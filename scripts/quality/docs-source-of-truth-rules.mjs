import path from "node:path";

export const canonicalMasterPlan =
	"docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md";
export const supersededV3 =
	"docs/archive/AMS_DON_CITY_FINAL_MASTER_PLAN_V3_0_SUPERSEDED.md";

const normalize = (name) => name.replaceAll(path.sep, "/");

export function findDocsSourceOfTruthViolations(files) {
	const normalized = files.map((file) => ({
		name: normalize(file.name),
		content: file.content,
	}));
	const violations = [];
	const activeMasters = normalized.filter(
		(file) =>
			file.name.startsWith("docs/") &&
			!file.name.startsWith("docs/archive/") &&
			/^docs\/AMS_DON_CITY_FINAL_MASTER_PLAN_.*\.md$/i.test(file.name),
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
			file.name !== canonicalMasterPlan &&
			(file.content.includes(
				"| № | Query | broad | Final URL owner | Registry ID |",
			) ||
				file.content.includes(
					"registryId,pageType,category,geoSlug,districtSlug,facetSlug,url,title,description,h1",
				))
		) {
			violations.push(`embedded SEO registry must remain in V4: ${file.name}`);
		}
	}

	const v3 = normalized.find((file) => file.name === supersededV3);
	if (!v3 || !/^Status:\s*SUPERSEDED\s*$/im.test(v3.content)) {
		violations.push(`${supersededV3} must exist with Status: SUPERSEDED`);
	}

	const docsMap = normalized.find((file) => file.name === "docs/README.md");
	if (
		!docsMap?.content.includes(
			"| детальный execution/SEO/data contract | `AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md` |",
		)
	) {
		violations.push("docs/README.md must map the detailed contract to V4");
	}

	return violations;
}
