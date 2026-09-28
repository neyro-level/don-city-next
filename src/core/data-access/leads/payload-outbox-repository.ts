import type { Payload, PayloadRequest } from "payload";
import { internalAccessMode } from "../../access/internal-modes.ts";
import type {
	LeadDeliveryRecord,
	LeadOutboxRepository,
	LeadOutboxTransaction,
	LeadRecord,
} from "../../leads/outbox.ts";

const intakeAccess = internalAccessMode("lead-intake");

type TransactionalDb = {
	beginTransaction?: (
		options?: unknown,
	) => Promise<string | number | false | null | undefined>;
	commitTransaction?: (id: string | number) => Promise<void>;
	rollbackTransaction?: (id: string | number) => Promise<void>;
};

type RequiredTransactionalDb = {
	beginTransaction: NonNullable<TransactionalDb["beginTransaction"]>;
	commitTransaction: NonNullable<TransactionalDb["commitTransaction"]>;
	rollbackTransaction: NonNullable<TransactionalDb["rollbackTransaction"]>;
};

function requireTransactionalDb(payload: Payload): RequiredTransactionalDb {
	const db = payload.db as TransactionalDb;
	if (
		typeof db.beginTransaction !== "function" ||
		typeof db.commitTransaction !== "function" ||
		typeof db.rollbackTransaction !== "function"
	) {
		throw new Error("Lead intake transaction capability is unavailable.");
	}
	return {
		beginTransaction: db.beginTransaction.bind(payload.db),
		commitTransaction: db.commitTransaction.bind(payload.db),
		rollbackTransaction: db.rollbackTransaction.bind(payload.db),
	};
}

function isValidTransactionId(value: unknown): value is string | number {
	return (
		(typeof value === "string" && value.trim().length > 0) ||
		(typeof value === "number" && Number.isFinite(value))
	);
}

function asRequest(transactionID: string | number): PayloadRequest {
	return internalAccessMode("lead-intake", transactionID).req as PayloadRequest;
}

function relationId(value: unknown): string {
	if (value && typeof value === "object" && "id" in value) {
		return String((value as { id: unknown }).id);
	}
	return String(value);
}

function parsePropertyId(value?: string): number | undefined {
	if (!value || !/^\d+$/.test(value)) {
		return undefined;
	}
	return Number(value);
}

function mapLead(doc: Record<string, unknown>): LeadRecord {
	const consent = (doc.consent ?? {}) as {
		accepted?: boolean;
		version?: string;
		consentedAt?: string;
	};
	const context = (doc.context ?? {}) as Record<string, unknown>;
	return {
		id: String(doc.id),
		status: "new",
		name: String(doc.name),
		phoneRaw: String(doc.phoneRaw ?? ""),
		phoneE164: String(doc.phoneE164),
		email: typeof doc.email === "string" ? doc.email : undefined,
		message: typeof doc.message === "string" ? doc.message : undefined,
		formKind: doc.formKind as LeadRecord["formKind"],
		sourcePage: String(doc.sourcePage),
		referrer: typeof doc.referrer === "string" ? doc.referrer : undefined,
		property:
			doc.property === null || doc.property === undefined
				? undefined
				: relationId(doc.property),
		context: {
			formKind: businessFormKind(context.formKind, doc.formKind),
			category: optionalString(context.category),
			district: optionalString(context.district),
			city: optionalString(context.city),
			property:
				context.property === null || context.property === undefined
					? undefined
					: relationId(context.property),
			mortgage: optionalString(context.mortgage),
			development: optionalString(context.development),
		},
		utm: (doc.utm as LeadRecord["utm"]) ?? undefined,
		consent: {
			accepted: true,
			version: String(consent.version ?? ""),
			consentedAt: String(consent.consentedAt ?? ""),
		},
		idempotencyKey: String(doc.idempotencyKey),
		retentionUntil:
			typeof doc.retentionUntil === "string" ? doc.retentionUntil : undefined,
		fraudFingerprint:
			typeof doc.fraudFingerprint === "string"
				? doc.fraudFingerprint
				: undefined,
	};
}

function mapDelivery(doc: Record<string, unknown>): LeadDeliveryRecord {
	return {
		id: String(doc.id),
		lead: relationId(doc.lead),
		channelId: String(doc.channelId),
		channelKind: doc.channelKind as LeadDeliveryRecord["channelKind"],
		status: "pending",
		attempts: 0,
		nextAttemptAt: String(doc.nextAttemptAt ?? ""),
		idempotencyKey: String(doc.idempotencyKey),
		jobId: typeof doc.jobId === "string" && doc.jobId ? doc.jobId : undefined,
	};
}

export function createPayloadLeadOutboxRepository(
	payload: Payload,
): LeadOutboxRepository {
	const createTx = (transactionID: string | number): LeadOutboxTransaction => {
		const req = asRequest(transactionID);
		return {
			async createLead(input) {
				const created = await payload.create({
					collection: "leads",
					data: {
						name: input.name,
						phoneRaw: input.phoneRaw,
						phoneE164: input.phoneE164,
						email: input.email,
						message: input.message,
						formKind: input.formKind,
						sourcePage: input.sourcePage,
						referrer: input.referrer,
						property: parsePropertyId(input.property),
						context: {
							...input.context,
							property: parsePropertyId(input.context.property),
						},
						utm: input.utm,
						consent: input.consent,
						status: "new",
						idempotencyKey: input.idempotencyKey,
						retentionMode: "delete",
						retentionUntil: input.retentionUntil,
						fraudFingerprint: input.fraudFingerprint,
					},
					depth: 0,
					req,
					overrideAccess: intakeAccess.overrideAccess,
					context: intakeAccess.context,
				});
				return mapLead(created as unknown as Record<string, unknown>);
			},
			async createLeadDelivery(input) {
				const created = await payload.create({
					collection: "lead-deliveries",
					data: {
						lead: Number(input.lead),
						channelId: input.channelId,
						channelKind: input.channelKind,
						status: "pending",
						attempts: 0,
						nextAttemptAt: input.nextAttemptAt,
						idempotencyKey: input.idempotencyKey,
					},
					depth: 0,
					req,
					overrideAccess: intakeAccess.overrideAccess,
					context: intakeAccess.context,
				});
				return mapDelivery(created as unknown as Record<string, unknown>);
			},
		};
	};

	return {
		async transaction(operation) {
			const db = requireTransactionalDb(payload);
			const transactionID = await db.beginTransaction();
			if (!isValidTransactionId(transactionID)) {
				throw new Error("Lead intake transaction could not be started.");
			}
			try {
				const result = await operation(createTx(transactionID));
				await db.commitTransaction(transactionID);
				return result;
			} catch (error) {
				await db.rollbackTransaction(transactionID).catch(() => undefined);
				throw error;
			}
		},
		async findLeadByIdempotencyKey(idempotencyKey) {
			const found = await payload.find({
				collection: "leads",
				where: { idempotencyKey: { equals: idempotencyKey } },
				limit: 1,
				depth: 0,
				overrideAccess: intakeAccess.overrideAccess,
				context: intakeAccess.context,
			});
			const doc = found.docs[0] as unknown as
				| Record<string, unknown>
				| undefined;
			return doc ? mapLead(doc) : undefined;
		},
		async findLeadDeliveries(leadId) {
			const found = await payload.find({
				collection: "lead-deliveries",
				where: { lead: { equals: Number(leadId) } },
				limit: 50,
				depth: 0,
				overrideAccess: intakeAccess.overrideAccess,
				context: intakeAccess.context,
			});
			return found.docs.map((doc) =>
				mapDelivery(doc as unknown as Record<string, unknown>),
			);
		},
		async findPendingDeliveriesWithoutJob(nowIso) {
			const found = await payload.find({
				collection: "lead-deliveries",
				where: {
					and: [
						{ status: { equals: "pending" } },
						{ nextAttemptAt: { less_than_equal: nowIso } },
						{ jobId: { exists: false } },
					],
				},
				limit: 50,
				depth: 0,
				overrideAccess: intakeAccess.overrideAccess,
				context: intakeAccess.context,
			});
			return found.docs.map((doc) =>
				mapDelivery(doc as unknown as Record<string, unknown>),
			);
		},
		async attachDeliveryJobId(deliveryId, jobId) {
			await payload.update({
				collection: "lead-deliveries",
				id: Number(deliveryId),
				data: { jobId },
				depth: 0,
				overrideAccess: intakeAccess.overrideAccess,
				context: intakeAccess.context,
			});
		},
	};
}

function optionalString(value: unknown): string | undefined {
	return typeof value === "string" && value ? value : undefined;
}

function businessFormKind(
	value: unknown,
	legacy: unknown,
): LeadRecord["context"]["formKind"] {
	if (
		typeof value === "string" &&
		[
			"general",
			"callback",
			"property",
			"mortgage",
			"sell",
			"legal",
			"rent",
		].includes(value)
	) {
		return value as LeadRecord["context"]["formKind"];
	}
	if (legacy === "property_request") return "property";
	if (legacy === "callback") return "callback";
	return "general";
}
