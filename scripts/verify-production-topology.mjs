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
const productionCompose = read(
	"deploy/clients/timeweb/production/compose.production.yml.example",
);
const timewebS3Plugin = read("src/project/timeweb-s3.plugin.ts");
const s3MediaMigration = read(
	"migrations/20260926_132000_s3_media_fields.ts",
);
const migrationIndex = read("migrations/index.ts");
const payloadImportMap = read("src/app/(payload)/admin/importMap.js");
const payloadAdminLayout = read(
	"src/app/(payload)/admin/[[...segments]]/layout.tsx",
);

for (const required of [
	"Один существующий Timeweb VPS `doncity-server`",
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
assert.ok(
	architecture.includes("Persistent staging/shadow/mirror database запрещена"),
	"Architecture must forbid a persistent second database contour",
);
assert.ok(
	architecture.includes("Production публично индексируется"),
	"Architecture must preserve public production indexing",
);
assert.ok(releaseChecklist.includes("backup") || releaseChecklist.includes("Backup"));
assert.ok(releaseChecklist.includes("rollback") || releaseChecklist.includes("Rollback"));
assert.ok(
	productionCompose.includes("'x-ams-health-secret':process.env.INTERNAL_HEALTH_SECRET"),
	"Production healthcheck must use the private health endpoint header contract",
);
assert.ok(
	!productionCompose.includes("authorization:'Bearer '"),
	"Production healthcheck must not use the unsupported Authorization header",
);
assert.ok(
	timewebS3Plugin.includes("alwaysInsertFields: true"),
	"Timeweb S3 fields must remain present when build-time credentials are absent",
);
for (const column of ['"prefix"', '"_objectkey"']) {
	assert.ok(
		s3MediaMigration.includes(`ADD COLUMN ${column} varchar`),
		`S3 media migration must add ${column}`,
	);
}
assert.ok(
	/name:\s*["']20260926_132000_s3_media_fields["']/.test(migrationIndex),
	"S3 media migration must remain registered",
);
assert.ok(
	payloadImportMap.includes(
		'"@payloadcms/storage-s3/client#S3ClientUploadHandler"',
	),
	"Payload Admin import map must include the production S3 client component",
);
assert.ok(
	productionCompose.includes("- /app/.next/cache"),
	"Read-only production runtime must provide a writable Next.js cache tmpfs",
);
assert.ok(
	payloadAdminLayout.includes(
		"const serverFunction: ServerFunctionClient = async function (args)",
	) && payloadAdminLayout.includes('"use server";'),
	"Payload Admin server function must preserve the Next.js server-action contract",
);

console.log("verify-production-topology: ok");
