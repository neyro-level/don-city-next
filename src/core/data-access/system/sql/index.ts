import { randomUUID } from "node:crypto";
import { sql } from "@payloadcms/db-postgres/drizzle";
import type { Payload } from "payload";

/**
 * Approved parameterized SQL for system atomic/bulk operations.
 * Generic query(sql: string) is not exported.
 */
export const systemSqlLayer = "src/core/data-access/system/sql" as const;

export const approvedSystemSqlOperations = {
	claimLeadDeliveryRow: {
		file: "src/core/data-access/system/sql/index.ts",
		purpose:
			"Claim one due lead delivery and increment its attempt exactly once.",
		trigger: "Atomic pending-to-sending transition with affected-row result.",
		inputType: "Internal delivery ID and clock.",
		containsPii: false,
		userInput: false,
		localApiReplacement:
			"No; read/update allows duplicate outbound delivery attempts.",
		decisionSource: "TASK-01.7 and ADR-0014.",
		integrationProof: "verify:integration lead-delivery claim proof.",
		invariant: "Exactly one due pending delivery can transition to sending.",
		reason:
			"Claim, attempt increment, and affected result must be one conditional statement.",
	},
	claimPendingDeliveryRecoveryLease: {
		file: "src/core/data-access/system/sql/index.ts",
		purpose: "Lease one stale pending delivery before replacement-job enqueue.",
		trigger: "Atomic recovery arbitration between concurrent janitors.",
		inputType: "Internal delivery ID and threshold/lease timestamps.",
		containsPii: false,
		userInput: false,
		localApiReplacement: "No; read/update permits duplicate replacement jobs.",
		decisionSource: "ADR-0011 exact named exception.",
		integrationProof: "verify:integration two-worker one-job recovery proof.",
		invariant:
			"Only one recovery worker can lease a sufficiently old pending delivery before enqueueing a replacement job.",
		reason:
			"The pending/age predicate, short lease, dead job reference clear, and affected result must be one conditional statement.",
	},
	recoverStaleSendingDeliveryIfStillStale: {
		file: "src/core/data-access/system/sql/index.ts",
		purpose:
			"Recover one sending delivery only while its persisted heartbeat is still stale.",
		trigger:
			"Atomic worker/janitor arbitration with affected-row result and bounded recovery audit entry.",
		inputType: "Internal delivery ID, threshold, clock, and bounded log size.",
		containsPii: false,
		userInput: false,
		localApiReplacement:
			"No; Payload 3.90.1 bulk update reads matching IDs before updating them, so a live worker can win between those steps.",
		decisionSource: "TASK-02.4 and ADR-0015.",
		integrationProof:
			"verify:integration stale-sending two-worker one-winner proof.",
		invariant:
			"A live heartbeat or terminal transition cannot be overwritten by stale recovery.",
		reason:
			"The ID/status/heartbeat predicate, recovery mutation, bounded audit entry, and affected result must commit atomically.",
	},
} as const;

type ApprovedSystemSqlOperation = keyof typeof approvedSystemSqlOperations;

type DrizzleExecutor = {
	execute: (query: unknown) => Promise<unknown>;
};

export type ClaimedLeadDeliveryRow = {
	id: string;
	leadId: string;
	channelId: string;
	channelKind: "messenger" | "crm";
	attempts: number;
	idempotencyKey: string;
	jobId?: string;
};

function getDrizzle(payload: Payload): DrizzleExecutor {
	const drizzle = (payload.db as { drizzle?: DrizzleExecutor } | undefined)
		?.drizzle;
	if (!drizzle?.execute) {
		throw new Error("System SQL requires Payload Postgres drizzle.execute.");
	}
	return drizzle;
}

function executeApprovedSystemSql(
	payload: Payload,
	operation: ApprovedSystemSqlOperation,
	query: unknown,
): Promise<unknown> {
	void approvedSystemSqlOperations[operation];
	return getDrizzle(payload).execute(query);
}

function rowsFrom(result: unknown): Array<Record<string, unknown>> {
	if (Array.isArray(result)) {
		return result as Array<Record<string, unknown>>;
	}
	if (result && typeof result === "object" && "rows" in result) {
		const rows = (result as { rows?: unknown }).rows;
		if (Array.isArray(rows)) {
			return rows as Array<Record<string, unknown>>;
		}
	}
	return [];
}

export async function claimLeadDeliveryRow(
	payload: Payload,
	input: { deliveryId: string; nowIso: string },
): Promise<ClaimedLeadDeliveryRow | undefined> {
	const deliveryId = Number(input.deliveryId);
	if (!Number.isInteger(deliveryId) || deliveryId < 1) {
		return undefined;
	}

	const result = await executeApprovedSystemSql(
		payload,
		"claimLeadDeliveryRow",
		sql`
		UPDATE lead_deliveries AS claimed
		SET
			status = 'sending',
			claimed_at = ${input.nowIso}::timestamptz,
			heartbeat_at = ${input.nowIso}::timestamptz,
			attempts = claimed.attempts + 1
		WHERE claimed.id = ${deliveryId}
			AND claimed.status = 'pending'
			AND claimed.next_attempt_at IS NOT NULL
			AND claimed.next_attempt_at <= ${input.nowIso}::timestamptz
		RETURNING
			claimed.id,
			claimed.lead_id,
			claimed.channel_id,
			claimed.channel_kind,
			claimed.attempts,
			claimed.idempotency_key,
			claimed.job_id
	`,
	);
	const row = rowsFrom(result)[0];
	if (!row) {
		return undefined;
	}

	const channelKind = row.channel_kind === "crm" ? "crm" : "messenger";
	return {
		id: String(row.id),
		leadId: String(row.lead_id),
		channelId: String(row.channel_id),
		channelKind,
		attempts: Number(row.attempts) || 0,
		idempotencyKey: String(row.idempotency_key),
		jobId: row.job_id ? String(row.job_id) : undefined,
	};
}

export async function claimPendingDeliveryRecoveryLease(
	payload: Payload,
	input: {
		deliveryId: string;
		orphanBefore: Date;
		leaseUntil: Date;
		now: Date;
	},
): Promise<string | undefined> {
	const deliveryId = Number(input.deliveryId);
	if (!Number.isInteger(deliveryId) || deliveryId < 1) {
		return undefined;
	}

	const result = await executeApprovedSystemSql(
		payload,
		"claimPendingDeliveryRecoveryLease",
		sql`
		UPDATE lead_deliveries AS claimed
		SET
			next_attempt_at = ${input.leaseUntil.toISOString()}::timestamptz,
			job_id = NULL,
			updated_at = ${input.now.toISOString()}::timestamptz
		WHERE claimed.id = ${deliveryId}
			AND claimed.status = 'pending'
			AND claimed.next_attempt_at IS NOT NULL
			AND claimed.next_attempt_at <= ${input.orphanBefore.toISOString()}::timestamptz
		RETURNING claimed.id
	`,
	);
	const id = rowsFrom(result)[0]?.id;
	return id == null ? undefined : String(id);
}

export async function recoverStaleSendingDeliveryIfStillStale(
	payload: Payload,
	input: {
		deliveryId: string;
		staleBeforeIso: string;
		nowIso: string;
		maxAttemptLogEntries: number;
	},
): Promise<string | undefined> {
	const deliveryId = Number(input.deliveryId);
	if (
		!Number.isInteger(deliveryId) ||
		deliveryId < 1 ||
		!Number.isInteger(input.maxAttemptLogEntries) ||
		input.maxAttemptLogEntries < 1
	) {
		return undefined;
	}

	const attemptLogId = randomUUID();
	const result = await executeApprovedSystemSql(
		payload,
		"recoverStaleSendingDeliveryIfStillStale",
		sql`
		WITH recovered AS (
			UPDATE lead_deliveries AS delivery
			SET
				status = 'pending',
				next_attempt_at = ${input.nowIso}::timestamptz,
				job_id = NULL,
				claimed_at = NULL,
				heartbeat_at = NULL,
				last_error_kind = 'retryable',
				last_error_redacted = 'Recovered stale sending delivery.',
				updated_at = ${input.nowIso}::timestamptz
			WHERE delivery.id = ${deliveryId}
				AND delivery.status = 'sending'
				AND delivery.heartbeat_at IS NOT NULL
				AND delivery.heartbeat_at < ${input.staleBeforeIso}::timestamptz
			RETURNING delivery.id
		), ranked_attempts AS (
			SELECT
				attempt.id,
				row_number() OVER (
					PARTITION BY attempt._parent_id
					ORDER BY attempt._order DESC, attempt.id DESC
				) AS newest_rank
			FROM lead_deliveries_attempt_log AS attempt
			WHERE attempt._parent_id IN (SELECT recovered.id FROM recovered)
		), pruned_attempts AS (
			DELETE FROM lead_deliveries_attempt_log AS attempt
			WHERE attempt.id IN (
				SELECT ranked.id
				FROM ranked_attempts AS ranked
				WHERE ranked.newest_rank >= ${input.maxAttemptLogEntries}
			)
			RETURNING attempt.id
		)
		INSERT INTO lead_deliveries_attempt_log (
			_order,
			_parent_id,
			id,
			attempted_at,
			safe_code,
			outcome,
			redacted_note
		)
		SELECT
			COALESCE((
				SELECT MAX(existing._order) + 1
				FROM lead_deliveries_attempt_log AS existing
				WHERE existing._parent_id = recovered.id
			), 0),
			recovered.id,
			${attemptLogId},
			${input.nowIso}::timestamptz,
			'stale_sending_recovered',
			'retryable',
			'Recovered stale sending delivery.'
		FROM recovered
		RETURNING _parent_id
	`,
	);
	const id = rowsFrom(result)[0]?._parent_id;
	return id == null ? undefined : String(id);
}
