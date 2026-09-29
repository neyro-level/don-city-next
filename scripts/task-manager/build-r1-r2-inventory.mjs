import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..", "..");
const planPath =
	"docs/DON_CITY_CONSTITUTION_CLEANUP_PRODUCTION_TRUTH_MASTER_PLAN_V1_0.md";
const inventoryPath = resolve(
	root,
	"docs/task-manager-r1-r2-inventory.v2.json",
);
const plan = readFileSync(resolve(root, planPath), "utf8");

const sourceVersion = plan.match(/^Version:\s*(v\d+)\s*$/m)?.[1];
const sourceStatus = plan.match(/^Status:\s*(APPROVED)\s*$/m)?.[1];
const approvedBy = plan.match(/^Approved by:\s*(\S+)\s*$/m)?.[1];
const approvedAt = plan.match(/^Approved at:\s*(\S+)\s*$/m)?.[1];
if (!sourceVersion || !sourceStatus || !approvedBy || !approvedAt) {
	throw new Error("Approved plan metadata is incomplete");
}

const epicMatches = [...plan.matchAll(/^# (EPIC-R[12]) — (.+)$/gm)];
if (epicMatches.length !== 2) {
	throw new Error(`Expected 2 epics, found ${epicMatches.length}`);
}
const taskMatches = [
	...plan.matchAll(/^## (TASK-R([12])(?:\.(\d+)|-DELIVERY)) — (.+)$/gm),
];
if (taskMatches.length !== 12) {
	throw new Error(`Expected 12 imported tasks, found ${taskMatches.length}`);
}

const commonContext = [
	planPath,
	"AGENTS.md",
	"docs/README.md",
	"docs/PROJECT.md",
	"docs/03_ARCHITECTURE.md",
	"docs/04_BACKLOG.md",
	"docs/05_RELEASE_CHECKLIST.md",
	"docs/DESIGN.md",
	"docs/OPERATIONS.md",
	"docs/DELIVERY_STATE.yaml",
	"AMS_REALTY_PLATFORM_CORE_STANDARD_5.5_SOLO_AI_FINAL.md",
	"AMS_UI_CORE_v5.0_FINAL.md",
];

const dependencies = new Map([
	["TASK-R1.3", ["TASK-R1.1", "TASK-R1.2"]],
	[
		"TASK-R1.7",
		[
			"TASK-R1.1",
			"TASK-R1.2",
			"TASK-R1.3",
			"TASK-R1.4",
			"TASK-R1.5",
			"TASK-R1.6",
		],
	],
	[
		"TASK-R1-DELIVERY",
		[
			"TASK-R1.1",
			"TASK-R1.2",
			"TASK-R1.3",
			"TASK-R1.4",
			"TASK-R1.5",
			"TASK-R1.6",
			"TASK-R1.7",
		],
	],
	["TASK-R2.1", ["TASK-R1-DELIVERY"]],
	["TASK-R2.2", ["TASK-R2.1"]],
	["TASK-R2.3", ["TASK-R2.2"]],
	["TASK-R2-DELIVERY", ["TASK-R2.1", "TASK-R2.2", "TASK-R2.3"]],
]);

const nodes = epicMatches.map(([, key, title]) => ({
	key,
	title: title.trim(),
	type: "epic",
	source_anchor: key,
	goal: `Deliver the exact ${key} outcome from the approved plan.`,
	scope: [
		`${key} uses one SourceCraft stream and one PR; production remains outside Developer role work.`,
	],
	acceptance_criteria: [
		`All imported ${key} tasks close with concrete evidence.`,
	],
	depends_on: key === "EPIC-R2" ? ["TASK-R1-DELIVERY"] : [],
	delivery_mode: "MERGE_AFTER_GATE",
	propagate_dependencies_to_children: false,
	required_context: commonContext,
	allowed_actions: ["read", "plan"],
	stop_conditions: [
		"source or inventory drift",
		"unapproved destructive production action",
		"secret or PII exposure",
	],
	priority: 1,
	labels: ["wave:r1-r2-remediation", `epic:${key.toLowerCase()}`],
}));

for (const match of taskMatches) {
	const [, key, epicNumber, numericPart, title] = match;
	const delivery = key.endsWith("-DELIVERY");
	nodes.push({
		key,
		title: title.trim(),
		type: "task",
		role: "implementation",
		work_kind: delivery ? "delivery" : "implementation",
		repository_key: "don-city-next",
		parent_key: `EPIC-R${epicNumber}`,
		source_anchor: key,
		goal: `Implement and prove ${key}: ${title.trim()}.`,
		scope: [
			`The exact ${key} section in the approved plan is authoritative.`,
			"Do not expand into DNS, feed activation, new infrastructure or destructive production data work.",
		],
		acceptance_criteria: [
			`Every acceptance statement in ${key} has concrete evidence.`,
			"EXECUTION_LEDGER_V1 records exact branch/base/head, files, checks and deviations.",
		],
		required_checks: delivery
			? [
					"Review the full exact diff against the approved plan.",
					"Run one exact-head SourceCraft RISKY gate before merge.",
				]
			: [
					`Run the focused proof required by ${key}.`,
					"Map every acceptance item to observed evidence.",
				],
		depends_on: dependencies.get(key) ?? [],
		required_context: commonContext,
		allowed_actions: delivery
			? [
					"read",
					"test",
					"commit",
					"push",
					"create_pr",
					"merge_after_gate",
				]
			: ["read", "edit", "test", "commit", "push"],
		stop_conditions: [
			"source or inventory drift",
			"unapproved destructive or external action",
			"secret or PII exposure",
		],
		priority: 1,
		labels: [
			"wave:r1-r2-remediation",
			`epic:r${epicNumber}`,
			delivery ? "delivery:merge-after-gate" : `task:${numericPart}`,
		],
	});
}

nodes.sort((left, right) => left.key.localeCompare(right.key, "en"));
const inventory = {
	schema_version: 2,
	beads_prefix: "dcrp",
	source: {
		plan_id: "DON-CITY-CONSTITUTION-CLEANUP-PRODUCTION-TRUTH",
		path: planPath,
		version: sourceVersion,
		status: sourceStatus,
		approved_by: approvedBy,
		approved_at: approvedAt,
		sha256: createHash("sha256").update(Buffer.from(plan)).digest("hex"),
		epic_anchors: epicMatches.map((match) => match[1]),
	},
	repositories: [
		{
			key: "don-city-next",
			remote: "https://git.sourcecraft.dev/integrator-p/don-city-next.git",
			default_branch: "main",
		},
	],
	nodes,
};

writeFileSync(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`, "utf8");
process.stdout.write(
	`${JSON.stringify({ version: sourceVersion, status: sourceStatus, epics: 2, imported_tasks: taskMatches.length, production_tasks: 0 })}\n`,
);
