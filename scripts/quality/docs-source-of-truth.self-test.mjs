import assert from "node:assert/strict";
import {
	canonicalMasterPlan,
	findDocsSourceOfTruthViolations,
	supersededV3,
} from "./docs-source-of-truth-rules.mjs";

const validFiles = [
	{
		name: canonicalMasterPlan,
		content:
			"Plan ID: AMS-DON-CITY-LIVE-CONFORMANCE\nVersion: v13\nStatus: APPROVED\nno additional monitoring, observation, post-production reconciliation",
	},
	{ name: supersededV3, content: "Status: SUPERSEDED" },
	{
		name: "docs/README.md",
		content:
			"`AMS-DON-CITY-LIVE-CONFORMANCE` v13\n| детальный execution/SEO/data contract | `AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md` |",
	},
];

assert.deepEqual(findDocsSourceOfTruthViolations(validFiles), []);
assert.deepEqual(
	findDocsSourceOfTruthViolations(
		validFiles.map((file) => ({
			...file,
			content: file.content.replaceAll("\n", "\r\n"),
		})),
	),
	[],
	"the documentation guard must be stable after a Windows CRLF checkout",
);
assert.ok(
	findDocsSourceOfTruthViolations([
		...validFiles,
		{ name: "docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V5_0.md", content: "" },
	]).some((violation) => violation.startsWith("active master plans")),
);
assert.ok(
	findDocsSourceOfTruthViolations([
		...validFiles,
		{
			name: "docs/03_ARCHITECTURE.md",
			content: "the v8 program in the master plan",
		},
	]).some((violation) => violation.startsWith("stale current plan pointer")),
);
assert.ok(
	findDocsSourceOfTruthViolations([
		...validFiles,
		{ name: "docs/01_PRD.md", content: "Production is globally noindex" },
	]).some((violation) =>
		violation.startsWith("obsolete global production noindex claim"),
	),
);
assert.ok(
	findDocsSourceOfTruthViolations([
		...validFiles,
		{
			name: "docs/PROJECT.md",
			content:
				"Production and isolated staging use separate database identities",
		},
	]).some((violation) =>
		violation.startsWith(
			"persistent staging/shadow database contradicts the one-database contract",
		),
	),
);
assert.ok(
	findDocsSourceOfTruthViolations(
		validFiles.map((file) =>
			file.name === canonicalMasterPlan
				? {
						...file,
						content:
							"Plan ID: AMS-DON-CITY-LIVE-CONFORMANCE\nVersion: v13\nStatus: APPROVED",
					}
				: file,
		),
	).some((violation) =>
		violation.startsWith(
			"canonical plan must keep production terminal with no follow-up stage",
		),
	),
);
assert.ok(
	findDocsSourceOfTruthViolations([
		...validFiles,
		{ name: "docs/SEO_PASSPORT_DON_CITY_v1_0.md", content: "" },
	]).some((violation) => violation.startsWith("legacy contract")),
);
assert.ok(
	findDocsSourceOfTruthViolations(
		validFiles.map((file) =>
			file.name === supersededV3 ? { ...file, content: "Status: FINAL" } : file,
		),
	).some((violation) => violation.includes("Status: SUPERSEDED")),
);
assert.ok(
	findDocsSourceOfTruthViolations([
		...validFiles,
		{
			name: "docs/02_PRODUCT_STRUCTURE.md",
			content: "| № | Query | broad | Final URL owner | Registry ID |",
		},
	]).some((violation) => violation.startsWith("embedded SEO registry")),
);

console.log("Documentation Source of Truth guard self-tests: PASS");
