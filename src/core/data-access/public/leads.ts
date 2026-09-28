import "server-only";

import type { Payload } from "payload";
import { clientReadinessConfig } from "../../../project/client-readiness.config.ts";
import { runtimeEnv } from "../../../project/env.ts";
import { legalConsentConfig } from "../../../project/legal.config.ts";
import { projectConfig } from "../../../project/project.config.ts";
import { siteConfig } from "../../../project/site.config.ts";
import { buildPropertyUrl } from "../../../project/url-grammar.ts";
import { resolveEnabledLeadChannels } from "../../leads/channels.ts";
import { hitInProcessLeadRateLimit } from "../../leads/in-process-rate-limit.ts";
import {
	accelerateCommittedLeadDeliveryJobs,
	commitLeadOutbox,
	type LeadIntakeRejected,
	prepareLeadIntake,
} from "../../leads/index.ts";
import { normalizeCanonicalSourcePage } from "../../leads/intake.ts";
import { createPayloadLeadOutboxRepository } from "../leads/payload-outbox-repository.ts";
import { systemQueuePayloadJob } from "../system/queue-job.ts";
import { publicGatewayReadAccess } from "./access-mode.ts";
import { getPublicGatewayPayload } from "./payload.ts";

export type PublicLeadSubmitResult =
	| { accepted: true; reused: boolean }
	| LeadIntakeRejected
	| { accepted: false; status: 503; code: "lead.unavailable" };

export function checkPublicLeadRateLimit(
	rateLimitKey: string,
): LeadIntakeRejected | undefined {
	return hitInProcessLeadRateLimit({
		key: rateLimitKey,
		limit: runtimeEnv.LEAD_RATE_LIMIT_PER_MINUTE,
	});
}

async function enqueueLeadDelivery(
	payload: Payload,
	leadDeliveryId: string,
): Promise<string | undefined> {
	const queued = (await systemQueuePayloadJob({
		payload,
		task: "deliverLead" as never,
		queue: "lead-deliveries",
		input: { leadDeliveryId } as never,
	})) as { id?: number | string };

	return queued.id === undefined ? undefined : String(queued.id);
}

export async function submitPublicLead({
	body,
	rateLimitKey,
	rateLimitChecked = false,
}: {
	body: unknown;
	rateLimitKey: string;
	rateLimitChecked?: boolean;
}): Promise<PublicLeadSubmitResult> {
	const limited = rateLimitChecked
		? undefined
		: checkPublicLeadRateLimit(rateLimitKey);
	if (limited) {
		return limited;
	}

	const channels = resolveEnabledLeadChannels({
		LEAD_CHANNELS: runtimeEnv.LEAD_CHANNELS,
		LEAD_OUTBOUND_HOSTS: runtimeEnv.LEAD_OUTBOUND_HOSTS,
		MAX_BOT_TOKEN: runtimeEnv.MAX_BOT_TOKEN,
		MAX_CHAT_ID: runtimeEnv.MAX_CHAT_ID,
		CUSTOM_WEBHOOK_URL: runtimeEnv.CUSTOM_WEBHOOK_URL,
		CUSTOM_WEBHOOK_HMAC_SECRET: runtimeEnv.CUSTOM_WEBHOOK_HMAC_SECRET,
	});
	if (
		(channels.length > 0 && !projectConfig.leadRetentionDays) ||
		((siteConfig.projectKind as "starter-demo" | "client") === "client" &&
			(!projectConfig.leadRetentionDays ||
				(clientReadinessConfig.legalContent as "approved" | "placeholder") !==
					"approved"))
	) {
		return { accepted: false, status: 503, code: "lead.unavailable" };
	}

	const nowIso = new Date().toISOString();
	const intake = prepareLeadIntake(body, {
		fraudHmacKey: runtimeEnv.PAYLOAD_SECRET,
		nowIso,
		currentConsentVersion: legalConsentConfig.currentConsentVersion,
		leadRetentionDays: projectConfig.leadRetentionDays,
	});
	if (!intake.accepted) {
		return intake;
	}

	if (!runtimeEnv.DATABASE_URI || !runtimeEnv.PAYLOAD_SECRET) {
		return {
			accepted: false,
			status: 503,
			code: "lead.unavailable",
		};
	}

	const payload = await getPublicGatewayPayload();
	if (intake.lead.formKind === "property_request") {
		const propertyId = intake.lead.context.property;
		if (!propertyId || !/^\d+$/.test(propertyId)) {
			return propertyContextRejected(intake.lead.sourcePage);
		}
		const found = await payload.find({
			collection: "properties",
			where: { id: { equals: Number(propertyId) } },
			limit: 1,
			depth: 0,
			...publicGatewayReadAccess(),
		});
		const property = found.docs[0];
		const canonicalSourcePage =
			property?.publicUrlId != null
				? normalizeCanonicalSourcePage(
						buildPropertyUrl({
							category: property.category,
							semantic: property.slug,
							publicUrlId: property.publicUrlId,
						}),
					)
				: undefined;
		if (!property || intake.lead.sourcePage !== canonicalSourcePage) {
			return propertyContextRejected(intake.lead.sourcePage);
		}
		intake.lead.property = String(property.id);
		intake.lead.context.property = String(property.id);
		intake.lead.sourcePage = canonicalSourcePage;
	}
	const repository = createPayloadLeadOutboxRepository(payload);
	const committed = await commitLeadOutbox({
		intake,
		channels,
		repository,
		nowIso,
	});

	if (!committed.reusedExistingLead) {
		await accelerateCommittedLeadDeliveryJobs({
			deliveries: committed.deliveries,
			repository,
			enqueue: (leadDeliveryId) => enqueueLeadDelivery(payload, leadDeliveryId),
		});
	}

	return {
		accepted: true,
		reused: committed.reusedExistingLead,
	};
}

function propertyContextRejected(sourcePage: string): LeadIntakeRejected {
	return {
		accepted: false,
		status: 400,
		code: "lead.invalid_payload",
		safeDiagnostics: {
			code: "lead.property_context_invalid",
			formKind: "property_request",
			sourcePage,
			reason: "Property form context is not a published canonical property.",
			rawPiiIncluded: false,
		},
	};
}
