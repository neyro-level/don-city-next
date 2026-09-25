import assert from "node:assert/strict";

import {
	buildHomeCatalogLinks,
	buildR1Navigation,
} from "../src/project/navigation.ts";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";
import { seoRegistryById } from "../src/project/seo-registry.generated.ts";

const allProperty = seoRegistryById.get("ALL");
assert.ok(allProperty, "ALL registry entry must exist");
assert.equal(allProperty.url, "/donetsk/");

const result = await resolveProjectPublicRoute(["donetsk"], {
	loadProperty: async () => null,
});

assert.equal(result.kind, "page");
if (result.kind !== "page") {
	throw new Error("/donetsk/ must resolve to a public page");
}

assert.equal(result.statusCode, 200);
assert.equal(result.canonicalPath, allProperty.url);
assert.equal(result.title, allProperty.title);
assert.equal(result.description, allProperty.description);
assert.equal(result.h1, allProperty.h1);
assert.deepEqual(result.robots, { indexing: "index", following: "follow" });
assert.deepEqual(result.catalogQuery, { geoSlug: "donetsk" });
assert.equal(result.identity.pageKey, "/donetsk/");
assert.equal(result.identity.geoSlug, "donetsk");

const navigation = buildR1Navigation();
const realEstate = navigation.find((item) => item.label === "Недвижимость");
const allPropertyMenu = realEstate?.children?.find(
	(item) => item.label === "Вся недвижимость",
);
assert.deepEqual(allPropertyMenu, {
	label: "Вся недвижимость",
	href: allProperty.url,
});

assert.deepEqual(buildHomeCatalogLinks()[0], {
	label: "Вся недвижимость",
	href: allProperty.url,
});

console.log("EPIC-20 Donetsk all-property geo hub contract: PASS");
