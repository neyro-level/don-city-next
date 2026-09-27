import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(path) {
	return readFileSync(path, "utf8");
}

function requireAll(path, fragments) {
	const content = read(path);
	for (const fragment of fragments) {
		assert.ok(content.includes(fragment), `${path} missing: ${fragment}`);
	}
	return content;
}

for (const path of [
	"AMS_REALTY_PLATFORM_CORE_STANDARD_5.5_SOLO_AI_FINAL.md",
	"AMS_UI_CORE_v5.0_FINAL.md",
	"docs/01_PRD.md",
	"docs/02_PRODUCT_STRUCTURE.md",
	"docs/03_ARCHITECTURE.md",
	"docs/04_BACKLOG.md",
	"docs/05_RELEASE_CHECKLIST.md",
	"docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md",
	"docs/DELIVERY_STATE.yaml",
	"docs/DESIGN.md",
	"docs/OPERATIONS.md",
	"docs/PROJECT.md",
	"docs/adr/README.md",
	"docs/CHANGELOG.md",
]) {
	assert.ok(existsSync(path), `active documentation target missing: ${path}`);
}

const project = requireAll("docs/PROJECT.md", [
	"Status: Active",
	"production live and publicly crawlable",
	"exactly one persistent production database",
	"AMS_PROFILE=REALTY_BASE",
	"PROJECT_CLASS=COMMERCIAL",
	"DELIVERY_PROFILE=CRITICAL",
	"`100` days",
	"`all-enabled`",
	"LEAD_OUTBOUND_HOSTS",
	"CACHE_INVALIDATION_MODE=http",
	"Timeweb managed PostgreSQL 18",
	"region `ru-1`",
	"fail-closed `false`",
	"/novostroyki/*",
	"/komplex/*",
	"/journal/*",
	"self-canonical and `noindex,follow`",
]);
assert.ok(project.includes("Active production channel IDs: none approved"));

const design = requireAll("docs/DESIGN.md", [
	"Status: Active",
	"REUSE → VARIANT → CREATE",
	"src/app/globals.css",
	"## Характер системы",
	"Container",
	"prefers-reduced-motion",
	"## Page-level CSS, media, motion and approved exceptions",
]);
assert.ok(!/^Status:\s*SUPERSEDED\s*$/im.test(design));

requireAll("docs/06_DESIGN_SYSTEM.md", [
	"Status: SUPERSEDED",
	"](DESIGN.md)",
]);
requireAll("docs/README.md", [
	"| project profile, runtime choices and fail-closed readiness | `PROJECT.md` |",
	"| active project design policy | `DESIGN.md` |",
	"`AMS-DON-CITY-LIVE-CONFORMANCE` v13",
]);
requireAll("docs/03_ARCHITECTURE.md", [
	"`AMS-DON-CITY-LIVE-CONFORMANCE` v13",
	"Exactly one persistent production database exists",
	"Production публично индексируется",
	"`PROJECT_CLASS=COMMERCIAL`",
	"`DELIVERY_PROFILE=CRITICAL`",
	"`PROJECT.md`",
	"`DESIGN.md`",
]);
requireAll("docs/OPERATIONS.md", [
	"Status: active production, publicly crawlable",
	"Exactly one persistent managed PostgreSQL 18 database",
	"no separate post-production monitoring task",
	"## Manual Import and Suspicious Approval",
	"## Interrupted Jobs and Orphan Recovery",
	"## Lead Delivery Recovery and Channel Outage",
	"## Incident Procedure",
]);
requireAll("docs/04_BACKLOG.md", [
	"## NOW — Live Conformance v13",
	"106 managed nodes",
	"DC11-PROD-FINAL",
]);
requireAll("docs/01_PRD.md", [
	"Production live и публично индексируется",
	"Никакой отдельный monitoring/follow-up этап после финального production не создаётся",
]);
requireAll("docs/02_PRODUCT_STRUCTURE.md", [
	"Production публично индексируется",
	"registry/content gates",
]);
requireAll("docs/05_RELEASE_CHECKLIST.md", [
	"Status: Active — public production; next release not authorized",
	"exact deployed SHA/image",
	"DC11-PROD-FINAL",
	"must not promote a fail-closed",
]);
requireAll("docs/DELIVERY_STATE.yaml", [
	"program: AMS-DON-CITY-LIVE-CONFORMANCE",
	"plan_version: v13",
	"status: LIVE_PUBLIC_OBSERVED",
	"cp_03:",
	"pull_request: 79",
	"gate_run: 91",
	"cp_04:",
	"pull_request: 78",
	"gate_run: 90",
	"cp_07:",
	"status: delivered",
	"pull_request: 80",
	"gate_run: 92",
	"cp_08:",
	"status: staging-pass-delivery-pending",
	"full_crawl: PASS",
	"snapshot_restore: PASS",
]);

const envExample = read(".env.example");
const envSource = read("src/project/env.ts");
const projectConfig = read("src/project/project.config.ts");
assert.match(envExample, /^AMS_PROFILE=REALTY_BASE$/m);
assert.ok(envSource.includes('AMS_PROFILE: z.literal("REALTY_BASE")'));
assert.ok(projectConfig.includes('profile: "REALTY_BASE"'));
assert.ok(projectConfig.includes('cacheInvalidationMode: "http"'));
for (const namespace of ["novostroyki", "komplex", "journal"]) {
	assert.ok(
		projectConfig.includes(`slug: "${namespace}"`) ||
			projectConfig.includes(`category: "${namespace}"`),
		`project config must reserve ${namespace}`,
	);
}

const readiness = read("src/project/client-readiness.config.ts");
for (const flag of ["nginx", "automaticBackup", "externalMonitoring"]) {
	assert.match(
		readiness,
		new RegExp(`${flag}: false`),
		`${flag} must remain fail-closed without durable evidence`,
	);
}
assert.match(readiness, /requiredHostAllowlists:\s*{[\s\S]*?outbound:\s*\[\][\s\S]*?externalImages:\s*\[\][\s\S]*?leadOutbound:\s*\[\]/);

const pages = read("src/project/collections/Pages.ts");
assert.ok(pages.includes("projectConfig.reservedNamespaces"));
assert.ok(pages.includes("CMS page slug cannot occupy reserved namespace"));

const designGuard = read("scripts/quality/design-tokens.mjs");
assert.ok(designGuard.includes('join(root, "docs/DESIGN.md")'));
assert.equal(designGuard.includes('join(root, "docs/06_DESIGN_SYSTEM.md")'), false);

console.log("verify-project-documentation: ok");
