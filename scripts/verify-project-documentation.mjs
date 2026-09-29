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
	"docs/DON_CITY_FINAL_CONSTITUTION_REMEDIATION_MASTER_PLAN_V2_0.md",
	"docs/DON_CITY_CONSTITUTION_CLEANUP_PRODUCTION_TRUTH_MASTER_PLAN_V1_0.md",
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
	"`externalMonitoring=true`",
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
	"## 4. UI Core 5.0 project policy",
	"Container",
	"prefers-reduced-motion",
	"Journal",
]);
assert.ok(!/^Status:\s*SUPERSEDED\s*$/im.test(design));
for (const section of [
	"4.1 Visual Character",
	"4.2 Status",
	"4.3 Typography",
	"4.4 Containers",
	"4.5 Section Rhythm",
	"4.6 Surfaces/Shadows",
	"4.7 Radii",
	"4.8 Buttons",
	"4.9 Forms",
	"4.10 Media",
	"4.11 Icons",
	"4.12 Motion",
	"4.13 Dark Mode",
	"4.14 Journal",
	"4.15 Shared Patterns",
	"4.16 Approved Exceptions",
]) {
	assert.ok(design.includes(`### ${section}`), `docs/DESIGN.md missing ${section}`);
}
assert.ok(design.includes("This section is policy only."));

requireAll("docs/06_DESIGN_SYSTEM.md", [
	"Status: SUPERSEDED",
	"](DESIGN.md)",
]);
requireAll("docs/README.md", [
	"| project profile, runtime choices and fail-closed readiness | `PROJECT.md` |",
	"| active project design policy | `DESIGN.md` |",
	"`DON-CITY-CONSTITUTION-CLEANUP-PRODUCTION-TRUTH` v1",
]);
requireAll("docs/03_ARCHITECTURE.md", [
	"`DON-CITY-CONSTITUTION-CLEANUP-PRODUCTION-TRUTH` v1",
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
	"## Production State Matrix",
	"Observed public state",
	"Deployed artifact identity",
	"Code main state",
	"Operational readiness",
	"Real feed readiness",
	"Lead delivery readiness",
	"## Open production-readiness / operational evidence",
	"## Manual Import and Suspicious Approval",
	"## Interrupted Jobs and Orphan Recovery",
	"## Lead Delivery Recovery and Channel Outage",
	"## Incident Procedure",
]);
assert.equal(
	read("docs/OPERATIONS.md").includes("## Current Blockers Before Indexing"),
	false,
	"Observed public indexing must not be described as blocked before indexing.",
);
requireAll("docs/04_BACKLOG.md", [
	"## NOW — Constitution Cleanup / Production Truth v1",
	"EPIC-R1 merged through SourceCraft PR `#119`",
	"already owner-authorized single release",
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
	"Status: Active — R2 final release convergence",
	"exact deployed SHA/image",
	"## Constitution Cleanup / Production Truth v1 Entry",
	"`Выпускаем production`",
	"must not promote a fail-closed",
]);
requireAll("docs/DELIVERY_STATE.yaml", [
	"program: DON-CITY-CONSTITUTION-CLEANUP-PRODUCTION-TRUTH",
	"plan_version: v1",
	"reconciliation: CLEAN",
	"current_wave: R2_PRODUCTION_TRUTH",
	"current_epic: EPIC-R2",
	"current_task: TASK-R2.3",
	"next_action: gate-and-merge-r2-then-one-owner-authorized-release",
	"status: LIVE_PUBLIC_OBSERVED",
	"release_target: exact SourceCraft origin/main attested by the manual release-main workflow",
	"observed_public_state: LIVE_PUBLIC_OBSERVED",
	"deployed_artifact_identity: \"revision fbc2dab7bf2fc408f2257bc280df0fb45970354e; RepoDigest sha256:423fc6671805bd92b958d9aa549e4049eb37264f59b5b862ae7ca862175b59f6\"",
	"operational_readiness: PARTIAL",
	"real_feed_readiness: DISABLED_NOT_READY",
	"lead_delivery_readiness: DISABLED_NOT_READY",
	"production_release_authorized: true",
	"task: TASK-05.4",
	"candidate_sha: 145b58b0ef436f8c0871647cf4c8d19d646a2403",
	"seo_http_matrix: PASS",
	"cleanup: PASS",
	"database_absent: true",
	"loopback_listeners_absent: true",
	"production_mutation: false",
	"production_admin_preflight:",
	"owner_identity_count: 1",
	"owner_role_count: 1",
	"successful_owner_login: PASS",
	"secret_master_owner_credential: PRESENT",
	"admin_noindex: PASS",
	"nginx_login_rate_limit: PASS",
	"nginx_admin_placeholder_absent: true",
	"evidence: docs/research/TASK_05_6_PRODUCTION_ADMIN_PREFLIGHT.md",
	"external_uptime_monitor:",
	"execution_origin: SOURCECRAFT_CLOUD",
	"test_run: 145",
	"test_issue: 1",
	"app_secret_in_probe: false",
	"evidence: docs/research/TASK_05_5_EXTERNAL_UPTIME_MONITOR.md",
	"canonical_nap_preflight:",
	"status: PASS",
	"live_matches_repository_candidate: true",
	"owner_confirmation: PROVEN_EPIC_07",
	"yandex_business_verification: NOT_PROVEN",
	"external_registry_conflict: true",
	"canonical_authority: OWNER_CONFIRMED_PUBLICATION_SET",
	"geo_and_same_as: OMIT_UNVERIFIED",
	"evidence: docs/research/TASK_05_7_CANONICAL_NAP_PREFLIGHT.md",
	"deployed_identity_contract:",
	"engineering_contract: PASS",
	"current_runtime_revision: a6cdbfc3a1a1348f65934ca202f39baec5c09bca",
	"runtime_and_compose_digest_match: true",
	"runtime_count: 1",
	"jobs_owner_count: 1",
	"current_runtime_health: healthy",
	"final_candidate_deployed_identity: PENDING_EXPLICIT_RELEASE",
	"evidence: docs/research/TASK_05_8_EXACT_DEPLOYED_IDENTITY_CONTRACT.md",
	"final_pre_release_proof:",
	"task: TASK-05.9",
	"seo_crawl_exact_candidate: PASS",
	"required_db_integration: PASS",
	"test_database_removed: true",
	"evidence: docs/research/TASK_05_9_FINAL_PRE_RELEASE_PROOF.md",
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
for (const flag of ["nginx", "automaticBackup"]) {
	assert.match(
		readiness,
		new RegExp(`${flag}: true`),
		`${flag} must reflect the durable DC10-OPS-00 evidence`,
	);
}
assert.match(
	readiness,
	/externalMonitoring: true/,
	"externalMonitoring must remain enabled with durable SourceCraft evidence",
);
assert.match(readiness, /requiredHostAllowlists:\s*{[\s\S]*?outbound:\s*\[\][\s\S]*?externalImages:\s*\[\][\s\S]*?leadOutbound:\s*\[\]/);

const pages = read("src/project/collections/Pages.ts");
assert.ok(pages.includes("projectConfig.reservedNamespaces"));
assert.ok(pages.includes("CMS page slug cannot occupy reserved namespace"));

const designGuard = read("scripts/quality/design-tokens.mjs");
assert.ok(designGuard.includes('join(root, "docs/DESIGN.md")'));
assert.equal(designGuard.includes('join(root, "docs/06_DESIGN_SYSTEM.md")'), false);

console.log("verify-project-documentation: ok");
