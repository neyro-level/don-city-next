import { readFileSync } from "node:fs";

const catalog = readFileSync("src/core/data-access/public/catalog.ts", "utf8");
const resolver = readFileSync("src/project/public-route-resolver.ts", "utf8");
const provider = readFileSync(
	"src/core/data-access/public/provider.ts",
	"utf8",
);
const reads = readFileSync(
	"src/core/data-access/public/payload-reads.ts",
	"utf8",
);
const nearby = readFileSync(
	"src/core/data-access/public/nearby-geo.ts",
	"utf8",
);

for (const snippet of [
	"geoSlug:",
	"districtSlug:",
	"districtSlug requires geoSlug.",
	"async function resolvePublishedCatalogGeo",
	"{ isPublished: { equals: true } }",
	"{ city: { equals: city.id } }",
	"async function loadPublicGeoIndex",
	"function publicGeoForProperty",
	"geo: PropertyLocationDTO",
]) {
	if (!catalog.includes(snippet)) {
		throw new Error(`Published geo catalog contract missing: ${snippet}`);
	}
}

for (const forbidden of ["cityRaw: true", "districtRaw: true"]) {
	if (catalog.includes(forbidden)) {
		throw new Error(
			`Raw geography leaked into public catalog select: ${forbidden}`,
		);
	}
}

for (const snippet of [
	"geoSlug: key.geo",
	"districtSlug:",
	"geoSlug: availability.slug",
]) {
	if (!resolver.includes(snippet)) {
		throw new Error(`URL grammar is not wired to geo slug: ${snippet}`);
	}
}

if (resolver.includes('city: "Донецк"')) {
	throw new Error("Public route resolver still hardcodes a city.");
}
if (!provider.includes("geoSlug: property.geo?.city.slug")) {
	throw new Error(
		"Related property lookup must reuse the resolved public city slug.",
	);
}
for (const snippet of [
	"region: true",
	"city: true",
	"district: true",
	"geographyRows",
]) {
	if (!reads.includes(snippet)) {
		throw new Error(`Facet aggregation lacks published geo input: ${snippet}`);
	}
}

for (const snippet of [
	"isApprovedNearbyPair(city, primaryCity)",
	"primaryCitySelect",
	"agglomerationApproved: true",
	"agglomerationApprovedAt: true",
	"coordinatesVerifiedAt: true",
]) {
	if (!nearby.includes(snippet)) {
		throw new Error(
			`Nearby public gateway is missing approval guard: ${snippet}`,
		);
	}
}

console.log("EPIC-13 published geo Public Gateway: PASS");
