import { sql } from "@payloadcms/db-postgres/drizzle";
import type { Payload } from "payload";
import { requirePayloadTransactionExecutor } from "../../system/payload-transaction.ts";

/**
 * Approved parameterized SQL for ingest claims, SKIP LOCKED, and heartbeat.
 * Generic query(sql: string) is not exported.
 */
export const ingestSqlLayer = "src/core/data-access/ingest/sql" as const;

export const approvedIngestSqlOperations = {
	claimDueFeedSources: {
		file: "src/core/data-access/ingest/sql/index.ts",
		purpose: "Claim a bounded due-feed batch without duplicate dispatch.",
		trigger:
			"Atomic concurrency: UPDATE plus FOR UPDATE SKIP LOCKED and RETURNING.",
		inputType: "Internal clock and configured batch size.",
		containsPii: false,
		userInput: false,
		localApiReplacement:
			"No supported Payload Local API primitive proves the same concurrent claim.",
		decisionSource: "TASK-01.7 and ADR-0014.",
		integrationProof: "verify:jobs-config and verify:integration.",
		invariant:
			"Each due feed source is claimed by at most one dispatcher tick.",
		reason: "Requires one UPDATE with FOR UPDATE SKIP LOCKED and RETURNING.",
	},
	claimQueuedImportRun: {
		file: "src/core/data-access/ingest/sql/index.ts",
		purpose: "Atomically claim one queued import run.",
		trigger:
			"Atomic conditional queued-to-running transition with affected-row result.",
		inputType: "Internal import-run ID and clock.",
		containsPii: false,
		userInput: false,
		localApiReplacement:
			"No; Payload 3.90.1 bulk update pre-reads before per-document writes.",
		decisionSource: "TASK-01.7 and ADR-0014.",
		integrationProof: "verify:integration queued-import concurrency proof.",
		invariant:
			"Exactly one queued-to-running transition can win for an import run.",
		reason:
			"Payload 3.90.1 bulk update reads before per-document updates and cannot prove an atomic conditional claim.",
	},
	interruptRecoverableImportRun: {
		file: "src/core/data-access/ingest/sql/index.ts",
		purpose:
			"Interrupt one import only while its stale/orphan predicate still matches.",
		trigger: "Atomic recovery arbitration between worker and janitor.",
		inputType: "Internal ID, status, timestamps and redacted reason enum.",
		containsPii: false,
		userInput: false,
		localApiReplacement: "No; read then update permits two recovery winners.",
		decisionSource: "ADR-0011 exact named exception.",
		integrationProof: "verify:integration two-worker recovery proof.",
		invariant:
			"A stale running or orphaned queued import run can be interrupted by at most one recovery worker while its recovery predicate still matches.",
		reason:
			"The status/timestamp predicate and terminal transition must be one conditional statement with an affected result.",
	},
	touchImportRunHeartbeat: {
		file: "src/core/data-access/ingest/sql/index.ts",
		purpose: "Refresh heartbeat only for a currently running import.",
		trigger: "Atomic status predicate plus timestamp update.",
		inputType: "Internal import-run ID and clock.",
		containsPii: false,
		userInput: false,
		localApiReplacement:
			"No; a read/update split can heartbeat a terminal run.",
		decisionSource: "TASK-01.7 and ADR-0014.",
		integrationProof: "verify:integration independent-heartbeat proof.",
		invariant: "Only a running import run receives a heartbeat.",
		reason:
			"The status predicate and timestamp update must be one conditional statement.",
	},
	consumeDeactivationApproval: {
		file: "src/core/data-access/ingest/sql/index.ts",
		purpose: "Consume one matching, valid and unexpired deactivation approval.",
		trigger: "Atomic single-use approval validation and consumption.",
		inputType: "Internal feed-source/import-run IDs and clock.",
		containsPii: false,
		userInput: false,
		localApiReplacement: "No; read/update can consume the same approval twice.",
		decisionSource: "TASK-01.7, ADR-0014 and transaction carrier ADR-0013.",
		integrationProof:
			"verify:feed-ingest rollback proof and verify:integration.",
		invariant:
			"A matching approval with approvedAt and a future expiry can be consumed only once.",
		reason:
			"Approval validation and consumption require one conditional update.",
	},
	finishImportRun: {
		file: "src/core/data-access/ingest/sql/index.ts",
		purpose: "Write one terminal result only for the running worker.",
		trigger:
			"Atomic running predicate, terminal mutation and affected-row result.",
		inputType: "Internal ID, terminal enum, counters, hash and redacted error.",
		containsPii: false,
		userInput: false,
		localApiReplacement:
			"No; a read/update split cannot prove single terminal ownership.",
		decisionSource: "TASK-01.7, ADR-0014 and transaction carrier ADR-0013.",
		integrationProof:
			"verify:feed-ingest terminal-state proof and verify:integration.",
		invariant:
			"Only the worker owning a running import can make one terminal transition.",
		reason:
			"The running predicate and terminal write must be one conditional statement with an affected result.",
	},
} as const;

type ApprovedIngestSqlOperation = keyof typeof approvedIngestSqlOperations;

export type ClaimedFeedSource = {
	id: string;
	code: string;
	market: "secondary" | "newbuild";
	feedUrlRef: string;
	refreshIntervalMinutes: number;
	nextDueAt: string;
	lastEtag?: string;
	lastModified?: string;
	lastFeedHash?: string;
	safetyThresholdPercent: number;
	maxDeactivationsPerRun: number;
	lastOfferCount?: number;
	enabled: boolean;
};

type DrizzleExecutor = {
	execute: (query: unknown) => Promise<unknown>;
};

function getDrizzle(payload: Payload): DrizzleExecutor {
	const drizzle = (payload.db as { drizzle?: DrizzleExecutor } | undefined)
		?.drizzle;
	if (!drizzle?.execute) {
		throw new Error("Ingest SQL requires Payload Postgres drizzle.execute.");
	}
	return drizzle;
}

async function executeApprovedIngestSql(
	payload: Payload,
	operation: ApprovedIngestSqlOperation,
	query: unknown,
	transactionId?: string | number,
): Promise<unknown> {
	void approvedIngestSqlOperations[operation];
	const executor =
		transactionId === undefined
			? getDrizzle(payload)
			: await requirePayloadTransactionExecutor(payload, transactionId);
	return executor.execute(query);
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

function asString(value: unknown): string {
	if (value == null) return "";
	return String(value);
}

function asOptionalString(value: unknown): string | undefined {
	if (value == null || value === "") return undefined;
	return String(value);
}

function asNumber(value: unknown, fallback = 0): number {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}

function mapClaimedFeed(row: Record<string, unknown>): ClaimedFeedSource {
	const market = row.market === "newbuild" ? "newbuild" : "secondary";
	return {
		id: asString(row.id),
		code: asString(row.code),
		market,
		feedUrlRef: asString(row.feed_url_ref),
		refreshIntervalMinutes: asNumber(row.refresh_interval_minutes, 1440),
		nextDueAt: asString(row.next_due_at),
		lastEtag: asOptionalString(row.last_etag),
		lastModified: asOptionalString(row.last_modified),
		lastFeedHash: asOptionalString(row.last_feed_hash),
		safetyThresholdPercent: asNumber(row.safety_threshold_percent, 30),
		maxDeactivationsPerRun: asNumber(row.max_deactivations_per_run, 50),
		lastOfferCount:
			row.last_offer_count == null ? undefined : asNumber(row.last_offer_count),
		enabled: row.enabled === true || row.enabled === "t",
	};
}

export async function claimDueFeedSources(
	payload: Payload,
	input: { now: Date; batchSize: number },
): Promise<ClaimedFeedSource[]> {
	const batchSize = Math.trunc(input.batchSize);
	if (!Number.isInteger(batchSize) || batchSize < 1) {
		throw new Error("dispatchBatchSize must be a positive integer.");
	}
	const now = input.now.toISOString();
	const result = await executeApprovedIngestSql(
		payload,
		"claimDueFeedSources",
		sql`
		UPDATE feed_sources AS claimed
		SET
			last_attempt_at = ${now}::timestamptz,
			next_due_at = GREATEST(
				${now}::timestamptz + (claimed.refresh_interval_minutes * interval '1 minute'),
				COALESCE(claimed.next_due_at, ${now}::timestamptz) + (claimed.refresh_interval_minutes * interval '1 minute')
			)
		WHERE claimed.id IN (
			SELECT source.id
			FROM feed_sources AS source
			WHERE source.enabled = true
				AND (
					source.next_due_at IS NULL
					OR source.next_due_at <= ${now}::timestamptz
				)
			ORDER BY source.next_due_at ASC
			LIMIT ${batchSize}
			FOR UPDATE SKIP LOCKED
		)
		RETURNING
			claimed.id,
			claimed.code,
			claimed.market,
			claimed.feed_url_ref,
			claimed.refresh_interval_minutes,
			claimed.next_due_at,
			claimed.last_etag,
			claimed.last_modified,
			claimed.last_feed_hash,
			claimed.safety_threshold_percent,
			claimed.max_deactivations_per_run,
			claimed.last_offer_count,
			claimed.enabled
	`,
	);
	return rowsFrom(result).map(mapClaimedFeed);
}

export async function claimQueuedImportRun(
	payload: Payload,
	input: { importRunId: string; now: Date },
): Promise<string | undefined> {
	const now = input.now.toISOString();
	const result = await executeApprovedIngestSql(
		payload,
		"claimQueuedImportRun",
		sql`
		UPDATE import_runs
		SET
			status = 'running',
			started_at = ${now}::timestamptz,
			heartbeat_at = ${now}::timestamptz
		WHERE id = ${input.importRunId}::integer
			AND status = 'queued'
		RETURNING id
	`,
	);
	const id = rowsFrom(result)[0]?.id;
	return id == null ? undefined : asString(id);
}

export async function interruptRecoverableImportRun(
	payload: Payload,
	input: {
		importRunId: string;
		expectedStatus: "queued" | "running";
		staleBefore: Date;
		now: Date;
		reason:
			| "running_heartbeat_stale"
			| "running_heartbeat_missing"
			| "queued_without_job"
			| "queued_dead_job";
	},
): Promise<string | undefined> {
	const now = input.now.toISOString();
	const staleBefore = input.staleBefore.toISOString();
	const result = await executeApprovedIngestSql(
		payload,
		"interruptRecoverableImportRun",
		sql`
		UPDATE import_runs
		SET
			status = 'interrupted',
			finished_at = ${now}::timestamptz,
			updated_at = ${now}::timestamptz,
			last_error_redacted = ${`Recovered by jobsJanitor: ${input.reason}.`}
		WHERE id = ${input.importRunId}::integer
			AND status = ${input.expectedStatus}
			AND (
				(
					${input.expectedStatus} = 'queued'
					AND queued_at < ${staleBefore}::timestamptz
				)
				OR (
					${input.expectedStatus} = 'running'
					AND (
						heartbeat_at < ${staleBefore}::timestamptz
						OR (
							heartbeat_at IS NULL
							AND started_at < ${staleBefore}::timestamptz
						)
					)
				)
			)
		RETURNING id
	`,
	);
	const id = rowsFrom(result)[0]?.id;
	return id == null ? undefined : asString(id);
}

export async function touchImportRunHeartbeat(
	payload: Payload,
	input: { importRunId: string; now: Date },
): Promise<boolean> {
	const now = input.now.toISOString();
	const result = await executeApprovedIngestSql(
		payload,
		"touchImportRunHeartbeat",
		sql`
		UPDATE import_runs
		SET heartbeat_at = ${now}::timestamptz
		WHERE id = ${input.importRunId}::integer
			AND status = 'running'
		RETURNING id
	`,
	);
	return rowsFrom(result).length > 0;
}

export async function consumeDeactivationApproval(
	payload: Payload,
	input: { feedSourceId: string; importRunId: string; now: Date },
	transactionId?: string | number,
): Promise<boolean> {
	const now = input.now.toISOString();
	const result = await executeApprovedIngestSql(
		payload,
		"consumeDeactivationApproval",
		sql`
		UPDATE feed_sources
		SET deactivation_approval_consumed_at = ${now}::timestamptz
		WHERE id = ${input.feedSourceId}::integer
			AND deactivation_approval_run_id_id = ${input.importRunId}::integer
			AND deactivation_approval_approved_at IS NOT NULL
			AND deactivation_approval_approved_at <= ${now}::timestamptz
			AND deactivation_approval_consumed_at IS NULL
			AND deactivation_approval_expires_at IS NOT NULL
			AND deactivation_approval_expires_at > ${now}::timestamptz
		RETURNING id
		`,
		transactionId,
	);
	return rowsFrom(result).length > 0;
}

export async function finishImportRun(
	payload: Payload,
	input: {
		importRunId: string;
		now: Date;
		status: "success" | "unchanged" | "suspicious" | "interrupted" | "failed";
		offeredCount?: number;
		createdCount?: number;
		updatedCount?: number;
		skippedCount?: number;
		warningCount?: number;
		errorCount?: number;
		feedHash?: string;
		lastErrorRedacted?: string;
	},
	transactionId?: string | number,
): Promise<boolean> {
	const now = input.now.toISOString();
	const result = await executeApprovedIngestSql(
		payload,
		"finishImportRun",
		sql`
		UPDATE import_runs
		SET
			status = ${input.status},
			finished_at = ${now}::timestamptz,
			heartbeat_at = ${now}::timestamptz,
			offered_count = ${input.offeredCount ?? null},
			created_count = ${input.createdCount ?? null},
			updated_count = ${input.updatedCount ?? null},
			skipped_count = ${input.skippedCount ?? null},
			warning_count = ${input.warningCount ?? null},
			error_count = ${input.errorCount ?? null},
			feed_hash = ${input.feedHash ?? null},
			last_error_redacted = ${input.lastErrorRedacted ?? null}
		WHERE id = ${input.importRunId}::integer
			AND status = 'running'
		RETURNING id
		`,
		transactionId,
	);
	return rowsFrom(result).length > 0;
}
