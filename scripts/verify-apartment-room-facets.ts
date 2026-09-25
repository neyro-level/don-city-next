import assert from "node:assert/strict";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";
import { seoRegistry } from "../src/project/seo-registry.generated.ts";

const baseDependencies = { loadProperty: async () => null };
const passingEvidence = {
	activeObjects: 5,
	introduction: "а".repeat(600),
	serverRendered: true,
	propertyLinksInHtml: true,
};
const facets = [
	["odnokomnatnye", 1, "P1", "184"],
	["dvuhkomnatnye", 2, "P1", "145"],
	["trehkomnatnye", 3, "P2", "66"],
] as const;

for (const [slug, room, tier, broad] of facets) {
	const entry = seoRegistry.find(
		(candidate) =>
			candidate.pageType === "facet" && candidate.facetSlug === slug,
	);
	assert.ok(entry, `${slug} registry entry is required`);
	assert.equal(entry.tier, tier);
	assert.equal(entry.broad, broad);
	assert.equal(entry.minActiveObjects, "5");

	const pathResult = await resolveProjectPublicRoute(
		["donetsk", "kvartiry", slug],
		baseDependencies,
	);
	assert.equal(pathResult.kind, "page");
	if (pathResult.kind !== "page") continue;
	assert.deepEqual(pathResult.catalogQuery?.rooms, [room]);
	assert.equal(pathResult.canonicalPath, entry.url);
	assert.equal(pathResult.robots.indexing, "noindex");

	const gatedQuery = await resolveProjectPublicRoute(
		["donetsk", "kvartiry"],
		{
			...baseDependencies,
			loadListingContentGateEvidence: async (registryId) =>
				registryId === entry.registryId ? passingEvidence : null,
		},
		{ rooms: String(room) },
	);
	assert.equal(gatedQuery.kind, "page");
	if (gatedQuery.kind !== "page") continue;
	assert.equal(gatedQuery.canonicalPath, entry.url);
	assert.equal(gatedQuery.robots.indexing, "noindex");
	assert.deepEqual(gatedQuery.catalogQuery?.rooms, [room]);
	assert.ok(gatedQuery.internalLinks.some((link) => link.href === entry.url));
}

const fallback = await resolveProjectPublicRoute(
	["donetsk", "kvartiry"],
	baseDependencies,
	{ rooms: "1" },
);
assert.equal(fallback.kind, "page");
if (fallback.kind === "page") {
	assert.equal(fallback.canonicalPath, "/donetsk/kvartiry/");
	assert.equal(fallback.robots.indexing, "noindex");
	assert.deepEqual(fallback.catalogQuery?.rooms, [1]);
}

const multiple = await resolveProjectPublicRoute(
	["donetsk", "kvartiry"],
	baseDependencies,
	{ rooms: ["3", "1"] },
);
assert.equal(multiple.kind, "page");
if (multiple.kind === "page") {
	assert.equal(multiple.canonicalPath, "/donetsk/kvartiry/");
	assert.deepEqual(multiple.catalogQuery?.rooms, [1, 3]);
}

const unknown = await resolveProjectPublicRoute(
	["donetsk", "kvartiry"],
	baseDependencies,
	{ rooms: "9", debug: "1" },
);
assert.equal(unknown.kind, "page");
if (unknown.kind === "page") {
	assert.equal(unknown.canonicalPath, "/donetsk/kvartiry/");
	assert.equal(unknown.robots.indexing, "noindex");
	assert.deepEqual(unknown.catalogQuery?.rooms, [9]);
}

assert.equal(
	seoRegistry.some((entry) => String(entry.facetSlug) === "vtorichka"),
	false,
);

console.log("EPIC-23 apartment room facets contract: PASS");
