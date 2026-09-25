import assert from "node:assert/strict";

import { buildR1Navigation } from "../src/project/navigation.ts";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";
import {
	seoRegistry,
	seoRegistryById,
} from "../src/project/seo-registry.generated.ts";
import { siteProfile } from "../src/project/site.profile.ts";

const loadProperty = async () => null;

const apartmentRoot = seoRegistryById.get("APT_ROOT");
const apartmentGeo = seoRegistryById.get("APT_GEO");
assert.ok(apartmentRoot, "APT_ROOT registry entry must exist");
assert.ok(apartmentGeo, "APT_GEO registry entry must exist");

const rootResult = await resolveProjectPublicRoute(["kvartiry"], {
	loadProperty,
});
assert.equal(rootResult.kind, "page");
if (rootResult.kind !== "page") throw new Error("/kvartiry/ must resolve");
assert.equal(rootResult.statusCode, 200);
assert.equal(rootResult.canonicalPath, apartmentRoot.url);
assert.equal(rootResult.title, apartmentRoot.title);
assert.equal(rootResult.description, apartmentRoot.description);
assert.equal(rootResult.h1, apartmentRoot.h1);
assert.deepEqual(rootResult.robots, {
	indexing: "noindex",
	following: "follow",
});
assert.equal(rootResult.catalogQuery?.category, "apartment");
assert.equal(rootResult.catalogQuery?.geoSlug, undefined);

const geoResult = await resolveProjectPublicRoute(["donetsk", "kvartiry"], {
	loadProperty,
});
assert.equal(geoResult.kind, "page");
if (geoResult.kind !== "page") {
	throw new Error("/donetsk/kvartiry/ must resolve");
}
assert.equal(geoResult.statusCode, 200);
assert.equal(geoResult.canonicalPath, apartmentGeo.url);
assert.equal(geoResult.title, apartmentGeo.title);
assert.equal(geoResult.description, apartmentGeo.description);
assert.equal(geoResult.h1, apartmentGeo.h1);
assert.deepEqual(geoResult.robots, {
	indexing: "index",
	following: "follow",
});
assert.equal(geoResult.catalogQuery?.category, "apartment");
assert.equal(geoResult.catalogQuery?.geoSlug, "donetsk");
assert.equal(geoResult.catalogQuery?.districtSlug, undefined);
assert.equal(geoResult.catalogQuery?.rooms, undefined);

const realEstate = buildR1Navigation().find(
	(item) => item.label === "Недвижимость",
);
assert.deepEqual(
	realEstate?.children?.find((item) => item.label === "Квартиры"),
	{ label: "Квартиры", href: apartmentGeo.url },
);

assert.ok(
	!siteProfile.facetWhitelist.kvartiry.includes(
		"vtorichka" as (typeof siteProfile.facetWhitelist.kvartiry)[number],
	),
	"vtorichka must not be an apartment facet",
);
assert.ok(
	seoRegistry.every(
		(entry) =>
			!entry.registryId.toLowerCase().includes("vtorichka") &&
			!entry.url.toLowerCase().includes("vtorichka") &&
			!entry.facetSlug.toLowerCase().includes("vtorichka"),
	),
	"vtorichka must not own an R1 registry route",
);
assert.deepEqual(
	await resolveProjectPublicRoute(["donetsk", "kvartiry", "vtorichka"], {
		loadProperty,
	}),
	{ kind: "notFound", statusCode: 404 },
);

console.log("EPIC-21 apartment geo catalog contract: PASS");
