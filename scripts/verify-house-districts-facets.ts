import assert from "node:assert/strict";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";
import { seoRegistry } from "../src/project/seo-registry.generated.ts";

const houseDistricts = seoRegistry.filter(
	(entry) => entry.pageType === "district" && entry.category === "house",
);
assert.equal(houseDistricts.length, 9);

const p2 = new Map([
	["kuybyshevskiy", "70"],
	["budennovskiy", "68"],
	["kirovskiy", "67"],
]);
const testDistricts = new Set([
	"voroshilovskiy",
	"kalininskiy",
	"kievskiy",
	"leninskiy",
	"petrovskiy",
	"proletarskiy",
]);
const loadProperty = async () => null;
const passingEvidence = {
	activeObjects: 10,
	introduction: "а".repeat(600),
	contextFacts: [{ source: "district-registry", checkedAt: "2026-09-25" }],
	serverRendered: true,
	propertyLinksInHtml: true,
};

for (const entry of houseDistricts) {
	const expectedBroad = p2.get(entry.districtSlug);
	if (expectedBroad) {
		assert.equal(entry.tier, "P2");
		assert.equal(entry.broad, expectedBroad);
		assert.equal(entry.source, "wordstat_v1");
		assert.equal(entry.minActiveObjects, "5");
	} else {
		assert.ok(testDistricts.has(entry.districtSlug));
		assert.equal(entry.tier, "TEST");
		assert.equal(entry.broad, "");
		assert.equal(entry.source, "fallback_no_wordstat");
		assert.equal(entry.minActiveObjects, "10");
	}

	const gatedOff = await resolveProjectPublicRoute(
		entry.url.split("/").filter(Boolean),
		{ loadProperty },
	);
	assert.equal(gatedOff.kind, "page");
	if (gatedOff.kind !== "page") continue;
	assert.equal(gatedOff.canonicalPath, entry.url);
	assert.equal(gatedOff.title, entry.title);
	assert.equal(gatedOff.h1, entry.h1);
	assert.equal(gatedOff.robots.indexing, "noindex");
	assert.equal(gatedOff.catalogQuery?.category, "house");
	assert.equal(gatedOff.catalogQuery?.geoSlug, "donetsk");
	assert.equal(gatedOff.catalogQuery?.districtSlug, entry.districtSlug);

	const gatedOn = await resolveProjectPublicRoute(
		entry.url.split("/").filter(Boolean),
		{
			loadProperty,
			loadListingContentGateEvidence: async (registryId) =>
				registryId === entry.registryId ? passingEvidence : null,
		},
	);
	assert.equal(gatedOn.kind, "page");
	if (gatedOn.kind === "page") assert.equal(gatedOn.robots.indexing, "index");
}

const dacha = seoRegistry.find(
	(entry) => entry.registryId === "HOUSE_FACET_DACHI",
);
assert.ok(dacha);
assert.equal(dacha.tier, "TEST");
assert.equal(dacha.broad, "");
assert.equal(dacha.source, "fallback_no_wordstat");
assert.equal(dacha.minActiveObjects, "10");

const dachaOff = await resolveProjectPublicRoute(["donetsk", "doma", "dachi"], {
	loadProperty,
});
assert.equal(dachaOff.kind, "page");
if (dachaOff.kind === "page") {
	assert.equal(dachaOff.robots.indexing, "noindex");
	assert.equal(dachaOff.catalogQuery?.houseType, "dacha");
}
const dachaOn = await resolveProjectPublicRoute(["donetsk", "doma", "dachi"], {
	loadProperty,
	loadListingContentGateEvidence: async () => passingEvidence,
});
assert.equal(dachaOn.kind, "page");
if (dachaOn.kind === "page") assert.equal(dachaOn.robots.indexing, "index");

assert.deepEqual(
	await resolveProjectPublicRoute(["donetsk", "doma", "tekstilshchik"], {
		loadProperty,
	}),
	{ kind: "notFound", statusCode: 404 },
);
assert.deepEqual(
	await resolveProjectPublicRoute(["donetsk", "doma", "unknown"], {
		loadProperty,
	}),
	{ kind: "notFound", statusCode: 404 },
);

console.log("EPIC-25 house districts/facets contract: PASS");
