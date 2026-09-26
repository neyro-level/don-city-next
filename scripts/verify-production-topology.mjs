import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(path) {
	return readFileSync(path, "utf8");
}

const architecture = read("docs/03_ARCHITECTURE.md");
const operations = read("docs/OPERATIONS.md");
const releaseChecklist = read("docs/05_RELEASE_CHECKLIST.md");
const envExample = read(".env.example");
const payloadConfig = read("payload.config.ts");
const clientReadiness = read("src/project/client-readiness.config.ts");
const storageActivation = read("scripts/clone-activate-timeweb-storage.mjs");

for (const required of [
	"one existing DON CITY Timeweb server",
	"managed PostgreSQL 18",
	"private VPC",
	"DonCity Server/prod",
]) {
	assert.ok(
		architecture.includes(required),
		`DON CITY architecture missing ${required}`,
	);
}

assert.ok(
	payloadConfig.includes("timewebS3Plugin"),
	"Payload must activate the proven project-owned Timeweb S3 plugin",
);
assert.ok(
	clientReadiness.includes('mediaStorage: "timeweb-s3"'),
	"client readiness must record the selected Timeweb S3 storage owner",
);
assert.ok(
	storageActivation.includes("@payloadcms/storage-s3") &&
		storageActivation.includes("timeweb-s3"),
	"the explicit Timeweb storage activation path must remain available",
);
assert.ok(
	operations.includes("offsite"),
	"Operations must require offsite backup copy",
);
assert.ok(
	operations.includes("Independent alert channel"),
	"Operations must pin an independent alert channel",
);
assert.ok(
	operations.includes("ALERT_WEBHOOK_URL"),
	"Operations must name the primary alert destination",
);

for (const requiredEnv of [
	"DATABASE_URI=",
	"DATABASE_POOL_MAX=",
	"PAYLOAD_SECRET=",
	"REVALIDATE_SECRET=",
	"INTERNAL_HEALTH_SECRET=",
	"JOBS_AUTORUN=false",
	"CACHE_INVALIDATION_MODE=http",
	"S3_ENDPOINT=",
	"S3_REGION=",
	"S3_BUCKET=",
	"S3_ACCESS_KEY_ID=",
	"S3_SECRET_ACCESS_KEY=",
	"S3_PREFIX=",
]) {
	assert.ok(
		envExample.includes(requiredEnv),
		`.env.example missing ${requiredEnv}`,
	);
}

const packageJson = JSON.parse(read("package.json"));
const dependencies = {
	...(packageJson.dependencies ?? {}),
	...(packageJson.devDependencies ?? {}),
};
assert.equal(
	dependencies["@payloadcms/storage-s3"],
	"3.90.1",
	"DON CITY must pin the Payload-compatible Timeweb S3 adapter version",
);

assert.ok(
	operations.includes("pg_dump -Fc"),
	"Operations backup canon must retain a custom-format PostgreSQL dump",
);
assert.ok(
	operations.includes("archive `MEDIA_DIR`") ||
		operations.includes("archive MEDIA_DIR"),
	"Operations must define the conditional local-media snapshot",
);
assert.ok(architecture.includes("staging") && architecture.includes("noindex"));
assert.ok(releaseChecklist.includes("backup") || releaseChecklist.includes("Backup"));
assert.ok(releaseChecklist.includes("rollback") || releaseChecklist.includes("Rollback"));

console.log("verify-production-topology: ok");
