import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";
import { seoRegistryById } from "../src/project/seo-registry.generated.ts";

const houseTypes = [
	"house",
	"cottage",
	"townhouse",
	"dacha",
	"part_of_house",
] as const;
const loadProperty = async () => null;
const houseRoot = seoRegistryById.get("HOUSE_ROOT");
const houseGeo = seoRegistryById.get("HOUSE_GEO");
assert.ok(houseRoot);
assert.ok(houseGeo);

const root = await resolveProjectPublicRoute(["doma"], { loadProperty });
assert.equal(root.kind, "page");
if (root.kind !== "page") throw new Error("/doma/ must resolve");
assert.equal(root.canonicalPath, houseRoot.url);
assert.equal(root.title, houseRoot.title);
assert.equal(root.description, houseRoot.description);
assert.equal(root.h1, houseRoot.h1);
assert.deepEqual(root.robots, { indexing: "noindex", following: "follow" });
assert.equal(root.catalogQuery?.category, "house");
assert.equal(root.catalogQuery?.geoSlug, undefined);
assert.equal(root.catalogQuery?.houseType, undefined);

const geo = await resolveProjectPublicRoute(["donetsk", "doma"], {
	loadProperty,
});
assert.equal(geo.kind, "page");
if (geo.kind !== "page") throw new Error("/donetsk/doma/ must resolve");
assert.equal(geo.canonicalPath, houseGeo.url);
assert.equal(geo.title, houseGeo.title);
assert.equal(geo.description, houseGeo.description);
assert.equal(geo.h1, houseGeo.h1);
assert.deepEqual(geo.robots, { indexing: "index", following: "follow" });
assert.equal(geo.catalogQuery?.category, "house");
assert.equal(geo.catalogQuery?.geoSlug, "donetsk");

for (const houseType of houseTypes) {
	const filtered = await resolveProjectPublicRoute(
		["donetsk", "doma"],
		{ loadProperty },
		{ houseType },
	);
	assert.equal(filtered.kind, "page");
	if (filtered.kind !== "page") continue;
	assert.equal(filtered.canonicalPath, houseGeo.url);
	assert.deepEqual(filtered.robots, {
		indexing: "noindex",
		following: "follow",
	});
	assert.equal(filtered.catalogQuery?.houseType, houseType);
}

const unknown = await resolveProjectPublicRoute(
	["donetsk", "doma"],
	{ loadProperty },
	{ houseType: "castle" },
);
assert.equal(unknown.kind, "page");
if (unknown.kind === "page") {
	assert.equal(unknown.catalogQuery?.houseType, undefined);
	assert.equal(unknown.robots.indexing, "noindex");
}
const catalogSource = readFileSync(
	"src/core/data-access/public/catalog.ts",
	"utf8",
);
const aggregateSource = readFileSync(
	"src/core/data-access/public/payload-reads.ts",
	"utf8",
);
const dtoSource = readFileSync("src/core/data-access/public/dto.ts", "utf8");
for (const snippet of [
	"const houseTypeSchema = z.enum(houseTypes)",
	"houseType: houseTypeSchema.optional()",
	"houseType requires category=house.",
	"houseType: { equals: query.houseType }",
	"buildingType: query.houseType",
	"houseTypes: availableHouseTypes",
]) {
	assert.ok(
		catalogSource.includes(snippet),
		`catalog contract missing: ${snippet}`,
	);
}
for (const snippet of [
	"houseType: true",
	"bump(houseTypes, doc.houseType)",
	"houseTypes: toBuckets(houseTypes)",
]) {
	assert.ok(
		aggregateSource.includes(snippet),
		`facet aggregate missing: ${snippet}`,
	);
}
assert.ok(dtoSource.includes("facets?.houseTypes.map"));
for (const houseType of houseTypes) {
	assert.ok(dtoSource.includes(`${houseType}:`));
}

const dachaPath = await resolveProjectPublicRoute(
	["donetsk", "doma", "dachi"],
	{ loadProperty },
);
assert.equal(dachaPath.kind, "page");
if (dachaPath.kind === "page") {
	assert.equal(dachaPath.robots.indexing, "noindex");
}

console.log("EPIC-24 house geo catalog contract: PASS");
