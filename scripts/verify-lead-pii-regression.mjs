import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { normalizeAnalyticsEvent } from "../src/platform/analytics/contract.ts";
import {
	assertNoPiiInDiagnostics,
	buildLeadIdempotencyKey,
	planLeadRetentionRun,
	planRetentionActions,
	sendCustomWebhookLead,
	sendMaxLead,
} from "../src/core/leads/index.ts";

const lead = {
	id: "lead-sensitive",
	status: "new",
	name: "Sensitive Name",
	phoneRaw: "+7 999 000 11 22",
	phoneE164: "+79990001122",
	email: "sensitive@example.test",
	message: "sensitive free-text body",
	formKind: "consultation",
	sourcePage: "/kontakty",
	context: { formKind: "general" },
	consent: {
		accepted: true,
		version: "privacy-v1",
		consentedAt: "2026-09-29T00:00:00.000Z",
	},
	idempotencyKey: "lead:11111111-1111-4111-8111-111111111111",
};

for (const file of [
	"src/app/api/public/leads/route.ts",
	"src/core/data-access/public/leads.ts",
	"src/core/leads/intake.ts",
	"src/core/leads/outbox.ts",
	"src/core/leads/deliver-lead.ts",
]) {
	const source = readFileSync(file, "utf8");
	for (const forbidden of ["console.", ".logger.", "payload.logger"]) {
		assert.equal(
			source.includes(forbidden),
			false,
			`${file} must not send lead data to ordinary logs`,
		);
	}
}

const normalizedAnalytics = normalizeAnalyticsEvent({
	event: "lead_success",
	pageKey: "/kontakty",
	geoSlug: "donetsk",
	formKind: "general",
	outcomeCode: "accepted",
	name: lead.name,
	phone: lead.phoneE164,
	email: lead.email,
	message: lead.message,
	body: "raw response body",
	token: "bearer-secret",
});
assert.deepEqual(normalizedAnalytics, {
	event: "lead_success",
	page_key: "/kontakty",
	geo_slug: "donetsk",
	form_kind: "general",
	outcome_code: "accepted",
});

const hostileProviderDiagnostic = `${lead.phoneE164} ${lead.email} bearer-secret raw-response-body`;
const maxFailure = await sendMaxLead({
	lead,
	transport: async () => ({
		ok: false,
		status: 503,
		errorCode: hostileProviderDiagnostic,
	}),
});
assert.equal(maxFailure.delivery.kind, "retryable");
assertNoPiiInDiagnostics({
	attemptLog: [maxFailure.safeLog],
	lastErrorRedacted: maxFailure.delivery.redactedNote,
	sourceLead: lead,
});
assert.equal(
	JSON.stringify(maxFailure).includes(hostileProviderDiagnostic),
	false,
	"MAX diagnostics must discard provider-controlled error bodies/codes",
);

const delivery = {
	id: "delivery-sensitive",
	lead: lead.id,
	channelId: "custom-webhook",
	channelKind: "messenger",
	status: "pending",
	attempts: 0,
	nextAttemptAt: "2026-09-29T00:00:00.000Z",
	idempotencyKey: "lead:lead-sensitive:channel:custom-webhook",
};
const webhookFailure = await sendCustomWebhookLead({
	lead,
	delivery,
	endpointUrl: "https://crm.example.test/leads",
	hmacSecret: "fixture-hmac-secret",
	nowIso: "2026-09-29T00:00:00.000Z",
	transport: async () => ({
		ok: false,
		status: 400,
		errorCode: hostileProviderDiagnostic,
	}),
});
assert.equal(webhookFailure.delivery.kind, "permanent");
assertNoPiiInDiagnostics({
	attemptLog: [webhookFailure.safeLog],
	lastErrorRedacted: webhookFailure.delivery.redactedNote,
	sourceLead: lead,
});
assert.equal(
	JSON.stringify({
		delivery: webhookFailure.delivery,
		safeLog: webhookFailure.safeLog,
	}).includes(hostileProviderDiagnostic),
	false,
	"webhook diagnostics must discard provider-controlled error bodies/codes",
);

const retention = planRetentionActions({
	nowIso: "2026-09-29T00:00:00.000Z",
	decision: planLeadRetentionRun(100),
	leads: [
		{
			...lead,
			retentionUntil: "2026-09-28T00:00:00.000Z",
			retentionMode: "anonymize",
			piiPurgedAt: null,
		},
	],
	deliveries: [
		{
			id: delivery.id,
			leadId: lead.id,
			attemptLog: [{ redactedNote: lead.phoneE164 }],
			lastErrorRedacted: lead.message,
		},
	],
});
assert.deepEqual(retention.processedLeadIds, [lead.id]);
assert.deepEqual(retention.processedDeliveryIds, [delivery.id]);
assertNoPiiInDiagnostics({
	...retention.purgedDiagnostics,
	sourceLead: lead,
});

const retryAttemptId = "11111111-1111-4111-8111-111111111111";
assert.equal(
	buildLeadIdempotencyKey(retryAttemptId),
	buildLeadIdempotencyKey(retryAttemptId.toUpperCase()),
	"HTTP retries must preserve one canonical idempotency key",
);

const gatewaySource = readFileSync(
	"src/core/data-access/public/leads.ts",
	"utf8",
);
const commitIndex = gatewaySource.indexOf(
	"const committed = await commitLeadOutbox",
);
const acceptedIndex = gatewaySource.indexOf("accepted: true", commitIndex);
assert.ok(commitIndex >= 0 && acceptedIndex > commitIndex);

const routeSource = readFileSync("src/app/api/public/leads/route.ts", "utf8");
assert.ok(routeSource.includes("if (!result.accepted)"));
assert.ok(routeSource.includes("NextResponse.json({ accepted: true })"));

const formSource = readFileSync(
	"packages/ui/src/views/starter/LeadFormView.tsx",
	"utf8",
);
const confirmationCheck = formSource.indexOf(
	"!response.ok || payload.accepted !== true",
);
const successState = formSource.indexOf(
	'setStatus("success")',
	confirmationCheck,
);
assert.ok(
	confirmationCheck >= 0 && successState > confirmationCheck,
	"form success must follow confirmed local persistence response",
);

console.log("verify-lead-pii-regression: ok");
