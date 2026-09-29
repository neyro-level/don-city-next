import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(path) {
	return readFileSync(path, "utf8");
}

function requireFragments(path, fragments) {
	const content = read(path);
	for (const fragment of fragments) {
		assert.ok(content.includes(fragment), `${path} missing: ${fragment}`);
	}
	return content;
}

const readme = requireFragments("docs/README.md", [
	"DC10-R11-00` доставил воспроизводимую read-only redacted production-матрицу",
	"после owner-authorized удаления persistent staging",
]);
assert.doesNotMatch(readme, /DC10-R11-00` обязан/);

const design = requireFragments("docs/DESIGN.md", [
	"Production публично индексируется",
	"page-level registry/content gates",
]);
assert.doesNotMatch(design, /Production остаётся `noindex`/);

const backlog = requireFragments("docs/04_BACKLOG.md", [
	"Authenticated health имеет статус `ok`",
	"внешний SourceCraft uptime monitor",
]);
assert.doesNotMatch(backlog, /Health имеет статус `degraded`/);
assert.doesNotMatch(backlog, /Закрыть media backup\/versioning/);

const delivery = read("docs/DELIVERY_STATE.yaml");
const cleanupProductionTruthIsActive = delivery.includes(
	"program: DON-CITY-CONSTITUTION-CLEANUP-PRODUCTION-TRUTH",
);

if (cleanupProductionTruthIsActive) {
	requireFragments("docs/04_BACKLOG.md", [
		"## Delivered — Constitution Cleanup / Production Truth v1",
		"EPIC-R2 merged through SourceCraft PR `#120`",
		"bounded live proof reconciled canonical `main`",
	]);
	requireFragments("docs/DELIVERY_STATE.yaml", [
		"plan_version: v1",
		"plan_status: APPROVED",
		"current_wave: CONTINUOUS_MAINTENANCE",
		"current_epic: none",
		"current_task: none",
		"next_action: none-program-complete",
		"reconciliation: CLEAN",
	]);
} else {
	requireFragments("docs/04_BACKLOG.md", [
		"DC11-PROD-FINAL` is mandatory and last",
	]);
	requireFragments("docs/DELIVERY_STATE.yaml", [
		"current_epic: DC11-PROD-FINAL",
		"current_task: authorized-final-production-release",
		"next_action: execute-one-exact-main-release-then-close-without-follow-up",
	]);
}

requireFragments("docs/DELIVERY_STATE.yaml", [
	"status: delivered",
	"pull_request: 102",
	"gate_run: 114",
	"pull_request: 103",
	"gate_run: 116",
	"status: authorized-final-stage",
	"autonomous_task: absent",
	"post_production_monitoring_task: forbidden",
	"open_p0_p1_contradictions: 0",
	"r2_status: delivered",
]);
assert.doesNotMatch(
	delivery.slice(0, delivery.indexOf("historical_evidence:")),
	/current_task: dc11-task-(?:101-implement|120-delivery)/,
);

requireFragments("docs/02_PRODUCT_STRUCTURE.md", [
	"slug `makeevka`",
	"`hub`, `kvartiry`, `doma` and `uchastki`",
	"Commercial, district and facet routes and alternate canonical slugs are not",
]);
const siteProfile = requireFragments("src/project/site.profile.ts", [
	'makeevka: ["hub", "kvartiry", "doma", "uchastki"]',
]);
assert.doesNotMatch(siteProfile, /makeevka:\s*\[[^\]]*kommercheskaya/);

requireFragments("docs/PROJECT.md", [
	"no persistent staging/shadow/mirror DB exists",
	"`nginx=true`, `automaticBackup=true` and `externalMonitoring=true`",
	"SourceCraft probes the public origin every",
]);
const architectureFragments = [
	"Exactly one persistent production database exists",
	"Owner-authorized retirement on 2026-09-28",
];
if (cleanupProductionTruthIsActive) {
	architectureFragments.push(
		"Current conformance plan: `DON-CITY-CONSTITUTION-CLEANUP-PRODUCTION-TRUTH` v1",
		"EPIC-R1, EPIC-R2 and their single owner-authorized rollout",
		"public GitHub mirror and production revision",
	);
} else {
	architectureFragments.push("`FINAL RELEASE AUTHORIZED`");
}
requireFragments("docs/03_ARCHITECTURE.md", architectureFragments);
requireFragments("docs/OPERATIONS.md", [
	"Exactly one application runtime and jobs owner remain",
	"Authenticated health reports current DB/media backup freshness",
	"no separate post-production monitoring task",
	"## Production State Matrix",
	"## Open product operations (not production-readiness blockers)",
]);
assert.doesNotMatch(
	read("docs/OPERATIONS.md"),
	/## Current Blockers Before Indexing/,
);

const contractPackage = JSON.parse(read("packages/contracts/package.json"));
const contractLock = JSON.parse(read("packages/contracts/contracts.lock.json"));
assert.equal(contractPackage.version, "2.1.0");
assert.equal(contractLock.contractVersion, "2.1.0");
requireFragments("packages/contracts/src/index.ts", [
	'contractVersion = "2.1.0"',
]);
requireFragments("docs/adr/ADR-0012-home-primary-action-contract.md", [
	"Status: Accepted",
	"HomePageDTO.primaryAction",
	"2.0.0",
]);
requireFragments("docs/adr/ADR-0016-public-nap-opening-hours.md", [
	"Status: Accepted",
	"PublicNapDTO",
	"2.1.0",
]);

const inventory = JSON.parse(
	read(
		cleanupProductionTruthIsActive
			? "docs/task-manager-r1-r2-inventory.v2.json"
			: "docs/task-manager-inventory.v2.json",
	),
);
if (cleanupProductionTruthIsActive) {
	assert.equal(
		inventory.source.plan_id,
		"DON-CITY-CONSTITUTION-CLEANUP-PRODUCTION-TRUTH",
	);
	assert.equal(inventory.source.version, "v1");
	assert.equal(
		inventory.nodes.some((node) => /^PROD-R2$/.test(node.key)),
		false,
		"production-only gates must stay outside the autonomous inventory",
	);
} else {
	const productionEpic = inventory.nodes.find((node) => node.key === "EPIC-121");
	assert.ok(productionEpic, "EPIC-121 missing");
	assert.equal(productionEpic.delivery_mode, "PR_ONLY");
	assert.equal(
		inventory.nodes.some((node) => node.parent_key === "EPIC-121"),
		false,
		"final production must have no autonomous child task",
	);
	assert.equal(
		inventory.nodes.some((node) => node.depends_on?.includes("EPIC-121")),
		false,
		"no task or epic may follow final production",
	);
}

console.log("final-documentation-audit: ok");
