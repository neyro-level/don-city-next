import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { executeInternalRevalidation } from "../src/core/cache/internal-route-executor.ts";
import { describePublicCatalogCache } from "../src/core/cache/public-targets.ts";
import {
	buildPropertyWriteInvalidationTargets,
	publicCacheTags,
} from "../src/project/cache-tags.ts";

const identity = {
	geoSlug: "donetsk",
	pageKey: "/donetsk/kvartiry/",
	category: "kvartiry",
};

const all = describePublicCatalogCache({
	identity: { geoSlug: "donetsk", pageKey: "/donetsk/" },
	query: { geoSlug: "donetsk" },
});
assert.deepEqual(all.tags, ["properties", "geo:donetsk"]);

const category = describePublicCatalogCache({
	identity,
	query: { geoSlug: "donetsk", category: "apartment" },
});
assert.deepEqual(category.tags, [
	"properties",
	"geo:donetsk",
	"geo:donetsk:cat:apartment",
]);

const district = describePublicCatalogCache({
	identity: {
		...identity,
		pageKey: "/donetsk/kvartiry/kalininskiy/",
	},
	query: {
		geoSlug: "donetsk",
		category: "apartment",
		districtSlug: "kalininskiy",
	},
});
assert.deepEqual(district.tags, [
	"properties",
	"geo:donetsk",
	"geo:donetsk:cat:apartment",
	"district:donetsk:kalininskiy",
]);

const roomOne = describePublicCatalogCache({
	identity: { ...identity, pageKey: "/donetsk/kvartiry/1-komnatnye/" },
	query: { geoSlug: "donetsk", category: "apartment", rooms: [1] },
});
const roomTwo = describePublicCatalogCache({
	identity: { ...identity, pageKey: "/donetsk/kvartiry/2-komnatnye/" },
	query: { geoSlug: "donetsk", category: "apartment", rooms: [2] },
});
assert.notDeepEqual(roomOne.keyParts, roomTwo.keyParts);
assert.deepEqual(roomOne.tags, category.tags);

const propertyTargets = buildPropertyWriteInvalidationTargets({
	geo: { slug: "donetsk" },
	category: "apartment",
	district: { slug: "kalininskiy" },
	publicUrlId: 1042,
});
assert.deepEqual(
	propertyTargets.map((target) =>
		target.type === "tag" ? target.tag : target.path,
	),
	[
		"properties",
		"geo:donetsk",
		"geo:donetsk:cat:apartment",
		"district:donetsk:kalininskiy",
		"property:1042",
	],
);

let acceptedTargets = 0;
const revalidation = await executeInternalRevalidation({
	expectedSecret: "test-secret",
	providedSecret: "test-secret",
	body: { targets: propertyTargets },
	invalidate: async (targets) => {
		acceptedTargets = targets.length;
	},
});
assert.equal(revalidation.status, 200);
assert.equal(acceptedTargets, propertyTargets.length);

const cachedProvider = readFileSync(
	"src/core/data-access/public/cached-provider.ts",
	"utf8",
);
assert.match(cachedProvider, /unstable_cache/);
assert.match(cachedProvider, /public-home/);
assert.match(cachedProvider, /describePublicCatalogCache/);
assert.match(cachedProvider, /public-property/);
assert.match(cachedProvider, /publicCacheTags\.property\(publicUrlId\)/);

const homePage = readFileSync("src/app/(site)/page.tsx", "utf8");
const publicRoute = readFileSync("src/app/(site)/public-route.tsx", "utf8");
const resolver = readFileSync(
	"src/core/routing/resolve-public-route.ts",
	"utf8",
);
const proxy = readFileSync("src/proxy.ts", "utf8");
assert.match(homePage, /getCachedPublicHomePage/);
assert.match(publicRoute, /getCachedPublicCatalog/);
assert.match(resolver, /getCachedPublicPropertyByPublicUrlId/);
assert.doesNotMatch(proxy, /cached-provider/);

const properties = readFileSync("src/project/collections/Properties.ts", "utf8");
const pages = readFileSync("src/project/collections/Pages.ts", "utf8");
const settings = readFileSync("src/project/globals/SiteSettings.ts", "utf8");
const cities = readFileSync("src/project/collections/Cities.ts", "utf8");
const districts = readFileSync("src/project/collections/Districts.ts", "utf8");
const regions = readFileSync("src/project/collections/Regions.ts", "utf8");
const redirects = readFileSync("src/project/collections/Redirects.ts", "utf8");
assert.match(properties, /property_changed/);
assert.match(properties, /source === "import"/);
assert.match(pages, /page_changed/);
assert.match(settings, /site_settings_changed/);
assert.match(cities, /city_changed/);
assert.match(districts, /district_changed/);
assert.match(regions, /region_changed/);
assert.match(redirects, /redirect_changed/);
assert.equal(publicCacheTags.site, "site");
assert.equal(publicCacheTags.properties, "properties");

console.log("EPIC-40 cache targets: PASS");
