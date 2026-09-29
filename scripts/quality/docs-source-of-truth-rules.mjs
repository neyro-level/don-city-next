import path from "node:path";

export const canonicalMasterPlan =
	"docs/DON_CITY_CONSTITUTION_CLEANUP_PRODUCTION_TRUTH_MASTER_PLAN_V1_0.md";
export const historicalV4 = "docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md";
export const supersededV3 =
	"docs/archive/AMS_DON_CITY_FINAL_MASTER_PLAN_V3_0_SUPERSEDED.md";

const normalize = (name) => name.replaceAll(path.sep, "/");

export function findDocsSourceOfTruthViolations(files) {
	const normalized = files.map((file) => ({
		name: normalize(file.name),
		content: file.content.replace(/\r\n?/g, "\n"),
	}));
	const violations = [];
	const activeMasters = normalized.filter(
		(file) =>
			file.name.startsWith("docs/") &&
			!file.name.startsWith("docs/archive/") &&
			/^docs\/DON_CITY_CONSTITUTION_CLEANUP_PRODUCTION_TRUTH_MASTER_PLAN_.*\.md$/i.test(file.name),
	);

	if (
		activeMasters.length !== 1 ||
		activeMasters[0]?.name !== canonicalMasterPlan
	) {
		violations.push(
			`active master plans must be exactly ${canonicalMasterPlan}; found: ${activeMasters.map((file) => file.name).join(", ") || "none"}`,
		);
	}

	for (const file of normalized) {
		if (!file.name.startsWith("docs/") || file.name.startsWith("docs/archive/"))
			continue;
		const basename = path.posix.basename(file.name);
		if (
			/seo[_ -]?passport/i.test(basename) ||
			/(?:^|[_ -])v?2[._-]2(?:[_ .-]|$)/i.test(basename)
		) {
			violations.push(`legacy contract must be archived: ${file.name}`);
		}
		if (
			file.name !== canonicalMasterPlan && file.name !== historicalV4 &&
			(file.content.includes(
				"| № | Query | broad | Final URL owner | Registry ID |",
			) ||
				file.content.includes(
					"registryId,pageType,category,geoSlug,districtSlug,facetSlug,url,title,description,h1",
				))
		) {
			violations.push(`embedded SEO registry must remain in the historical V4 evidence: ${file.name}`);
		}
	}

	const v3 = normalized.find((file) => file.name === supersededV3);
	if (!v3 || !/^Status:\s*SUPERSEDED\s*$/im.test(v3.content)) {
		violations.push(`${supersededV3} must exist with Status: SUPERSEDED`);
	}

	const docsMap = normalized.find((file) => file.name === "docs/README.md");
	if (
		!docsMap?.content.includes(
			"| текущий approved execution contract | `DON_CITY_CONSTITUTION_CLEANUP_PRODUCTION_TRUTH_MASTER_PLAN_V1_0.md` |",
		)
	) {
		violations.push("docs/README.md must map the current approved remediation contract");
	}

	const contentOf = (name) =>
		normalized.find((file) => file.name === name)?.content ?? "";
	const requireCurrent = (name, fragment, message) => {
		const content = contentOf(name);
		if (content && !content.includes(fragment))
			violations.push(`${message}: ${name}`);
	};
	const rejectCurrent = (name, pattern, message) => {
		const content = contentOf(name);
		if (content && pattern.test(content))
			violations.push(`${message}: ${name}`);
	};

	requireCurrent(
		canonicalMasterPlan,
		"Plan ID: DON-CITY-CONSTITUTION-CLEANUP-PRODUCTION-TRUTH",
		"canonical plan must identify cleanup and production truth v1",
	);
	requireCurrent(
		canonicalMasterPlan,
		"Version: v1",
		"canonical plan must identify version v1",
	);
	requireCurrent(
		canonicalMasterPlan,
		"Status: APPROVED",
		"canonical plan must be approved",
	);
	requireCurrent(
		canonicalMasterPlan,
		"Production: exactly one rollout only when final production identity differs",
		"canonical plan must keep production conditional and single-rollout",
	);
	requireCurrent(
		"docs/README.md",
		"`DON-CITY-CONSTITUTION-CLEANUP-PRODUCTION-TRUTH` v1",
		"docs map must identify the current approved plan",
	);
	requireCurrent(
		"docs/03_ARCHITECTURE.md",
		"Exactly one persistent",
		"architecture must state the one-persistent-database boundary",
	);
	requireCurrent(
		"docs/04_BACKLOG.md",
		"## NOW — Constitution Cleanup / Production Truth v1",
		"backlog must identify the current cleanup and production truth program",
	);
	requireCurrent(
		"docs/DELIVERY_STATE.yaml",
		"program: DON-CITY-CONSTITUTION-CLEANUP-PRODUCTION-TRUTH\nplan_version: v1\nplan_status: APPROVED",
		"delivery state must identify the current approved graph",
	);

	for (const name of [
		"docs/README.md",
		"docs/01_PRD.md",
		"docs/02_PRODUCT_STRUCTURE.md",
		"docs/03_ARCHITECTURE.md",
		"docs/PROJECT.md",
		"docs/OPERATIONS.md",
	]) {
		rejectCurrent(
			name,
			/(?:Status:.*global noindex|Status:.*production noindex|Production is globally `?noindex`?|весь production остаётся `noindex`)/i,
			"obsolete global production noindex claim",
		);
		rejectCurrent(
			name,
			/(?:Production and isolated staging use|Staging: loopback|Production и staging используют|Staging: отдельная изолированная database|Production and staging have separate database)/i,
			"persistent staging/shadow database contradicts the one-database contract",
		);
	}

	for (const name of [
		"docs/README.md",
		"docs/03_ARCHITECTURE.md",
		"docs/04_BACKLOG.md",
		"docs/DELIVERY_STATE.yaml",
	]) {
		rejectCurrent(
			name,
			/(?:APPROVED v9 program|v8 program in|## NOW — Core 5\.5 v9|program: AMS-DON-CITY-CORE55-POSTPROD)/i,
			"stale current plan pointer",
		);
	}

	return violations;
}
