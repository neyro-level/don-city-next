import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { decideImportRunRecovery } from "../src/core/ingest/import-recovery.ts";
import {
	pendingDeliveryOrphanThresholdMs,
	queuedImportOrphanThresholdMs,
} from "../src/core/operations/recovery-thresholds.ts";
import { evaluatePublicLeadRequest } from "../src/core/security/public-lead-request.ts";
import { detectRuntimeEnvMode } from "../src/project/env.ts";

const read = (path: string) => readFileSync(path, "utf8");

assert.equal(pendingDeliveryOrphanThresholdMs(15), 30 * 60_000);
assert.equal(queuedImportOrphanThresholdMs(5), 15 * 60_000);
assert.equal(
	detectRuntimeEnvMode({
		NEXT_PHASE: "phase-production-build",
		NODE_ENV: "development",
	}),
	"build",
);
assert.equal(detectRuntimeEnvMode({ NODE_ENV: "production" }), "runtime");

const recoveryThresholds = {
	importStaleBefore: "2026-09-18T11:45:00.000Z",
	queuedOrphanBefore: "2026-09-18T11:45:00.000Z",
	now: new Date("2026-09-18T12:00:00.000Z"),
};
assert.deepEqual(
	decideImportRunRecovery({
		...recoveryThresholds,
		run: {
			status: "queued",
			queuedAt: "2026-09-18T11:00:00.000Z",
			jobId: "41",
		},
		job: { processing: true, completedAt: null },
	}),
	{ interrupt: false },
);
assert.deepEqual(
	decideImportRunRecovery({
		...recoveryThresholds,
		run: {
			status: "queued",
			queuedAt: "2026-09-18T11:00:00.000Z",
			jobId: "42",
		},
		job: { processing: false, completedAt: "2026-09-18T11:01:00.000Z" },
	}),
	{ interrupt: true, reason: "queued_dead_job" },
);
assert.deepEqual(
	decideImportRunRecovery({
		...recoveryThresholds,
		run: {
			status: "running",
			startedAt: "2026-09-18T11:00:00.000Z",
			heartbeatAt: null,
		},
	}),
	{ interrupt: true, reason: "running_heartbeat_missing" },
);

assert.deepEqual(
	evaluatePublicLeadRequest(
		new Request("https://doncity-home.ru/api/public/leads", {
			headers: {
				"content-type": "application/json",
				origin: "https://doncity-home.ru",
				"sec-fetch-site": "same-origin",
			},
		}),
		"https://doncity-home.ru",
	),
	{ allowed: true },
);

const tasks = read("src/project/jobs/tasks.ts");
for (const marker of [
	"pendingDeliveryOrphanThresholdMs",
	"interruptRecoverableImportRun",
	"claimPendingDeliveryRecoveryLease",
	"applyLeadRetentionTransaction",
	"beginTransaction",
	"commitTransaction",
	"rollbackTransaction",
	"pagination: false",
]) {
	assert.ok(tasks.includes(marker), `jobs safety marker missing: ${marker}`);
}

const ingestSql = read("src/core/data-access/ingest/sql/index.ts");
assert.ok(
	ingestSql.includes("interruptRecoverableImportRun"),
	"the approved import interruption operation must be allowlisted",
);
const systemSql = read("src/core/data-access/system/sql/index.ts");
assert.ok(
	systemSql.includes("claimPendingDeliveryRecoveryLease"),
	"the approved pending-delivery recovery lease must be allowlisted",
);
assert.equal(
	tasks.includes("limit: 50,\n\t\t\t\t\tdepth: 0"),
	false,
	"lead retention must not cap linked delivery cleanup at 50 rows",
);

const payloadConfig = read("payload.config.ts");
assert.ok(payloadConfig.includes('detectRuntimeEnvMode() === "build"'));
assert.ok(payloadConfig.includes("requirePayloadRuntime()"));
assert.ok(
	payloadConfig.indexOf("build-only-payload-secret") <
		payloadConfig.indexOf("requirePayloadRuntime()"),
	"build-only fallbacks must be isolated before runtime fail-closed selection",
);

const leadRoute = read("src/app/api/public/leads/route.ts");
assert.ok(leadRoute.includes("evaluatePublicLeadRequest"));
assert.ok(leadRoute.includes("NextResponse.json({ accepted: true })"));
assert.equal(leadRoute.includes("reused: result.reused"), false);

const health = read("src/app/api/internal/healthz/route.ts");
assert.ok(health.includes("getRuntimeClock"));
assert.equal(health.includes("Date.now()"), false);

console.log("verify-cp03-safety: ok");
