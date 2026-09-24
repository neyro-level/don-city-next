import assert from "node:assert/strict";
import {
	buildUrl,
	parseUrl,
	type PageKey,
} from "../src/platform/grammar/index.ts";
import {
	buildPropertyUrl,
	parseProjectUrl,
	projectUrls,
	urlGrammarRegistry,
} from "../src/project/url-grammar.ts";

const samples = ["alpha", "beta-two", "gamma-3"] as const;
const keys: PageKey[] = [
	{ kind: "home" },
	...samples.map((geo) => ({ kind: "geoHub" as const, geo })),
	...samples.map((category) => ({ kind: "categoryRoot" as const, category })),
	...samples.map((value) => ({
		kind: "categoryGeo" as const,
		geo: value,
		category: `${value}-category`,
	})),
	...samples.map((value) => ({
		kind: "categoryGeoDistrict" as const,
		geo: value,
		category: `${value}-category`,
		district: `${value}-district`,
	})),
	...samples.map((value) => ({
		kind: "categoryGeoFacet" as const,
		geo: value,
		category: `${value}-category`,
		facet: `${value}-facet`,
	})),
	...samples.map((value, index) => ({
		kind: "property" as const,
		category: `${value}-category`,
		semantic: `${value}-semantic`,
		publicUrlId: String(index + 1),
	})),
	...samples.map((slug) => ({
		kind: "static" as const,
		slug: `${slug}-static`,
	})),
];

function registryFor(key: PageKey) {
	const categorySlugs = "category" in key ? [key.category] : [];
	const geoSlugs = "geo" in key ? [key.geo] : [];
	return {
		categorySlugs,
		geoSlugs,
		staticSlugs: key.kind === "static" ? [key.slug] : [],
		districts:
			key.kind === "categoryGeoDistrict"
				? [{ geo: key.geo, slug: key.district }]
				: [],
		facets:
			key.kind === "categoryGeoFacet"
				? [{ category: key.category, slug: key.facet }]
				: [],
	};
}

for (const key of keys) {
	const registry = registryFor(key);
	const path = buildUrl(key);
	assert.equal(path, path.toLowerCase());
	assert.ok(path.endsWith("/"));
	assert.deepEqual(parseUrl(path, registry), key);
}

assert.deepEqual(parseUrl("/", urlGrammarRegistry), { kind: "home" });
assert.deepEqual(parseProjectUrl(projectUrls.primaryCatalog), {
	kind: "categoryGeo",
	geo: "donetsk",
	category: "kvartiry",
});
assert.deepEqual(
	parseProjectUrl(
		buildPropertyUrl({
			category: "apartment",
			semantic: "test-property",
			publicUrlId: 42,
		}),
	),
	{
		kind: "property",
		category: "kvartiry",
		semantic: "test-property",
		publicUrlId: "42",
	},
);
assert.throws(() =>
	buildPropertyUrl({
		category: "other",
		semantic: "uncategorized",
		publicUrlId: 1,
	}),
);
assert.equal(parseUrl("/unknown/", urlGrammarRegistry), null);
assert.equal(parseUrl("/a/b/c/d/", urlGrammarRegistry), null);
assert.equal(parseUrl("/kvartiry/not-a-property/", urlGrammarRegistry), null);
assert.throws(() =>
	parseUrl("/", {
		categorySlugs: ["same"],
		geoSlugs: [],
		staticSlugs: ["same"],
		districts: [],
		facets: [],
	}),
);
assert.throws(() =>
	parseUrl("/", {
		categorySlugs: ["alpha"],
		geoSlugs: ["geo"],
		staticSlugs: [],
		districts: [{ geo: "geo", slug: "collision" }],
		facets: [{ category: "alpha", slug: "collision" }],
	}),
);

console.log(`verify:url-grammar: PASS (${keys.length} generated round trips)`);
