import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { r1PublicPropertyCategories } from "../src/core/data-access/public/property-policy.ts";
import { buildR1Navigation } from "../src/project/navigation.ts";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";
import { siteProfile } from "../src/project/site.profile.ts";
import {
	projectSitemapEntries,
	projectSitemapEntriesForEvidence,
} from "../src/project/sitemap.ts";

const commercialPath = "/donetsk/kommercheskaya/";
const commercialEvidence = {
	activeObjects: 10,
	introduction: "К".repeat(600),
	serverRendered: true,
	propertyLinksInHtml: true,
};
const noProperty = async () => null;

assert.deepEqual(r1PublicPropertyCategories, [
	"apartment",
	"house",
	"land",
	"commercial",
]);
assert.equal(siteProfile.marketStatus.secondary, "ACTIVE");
assert.equal(siteProfile.marketStatus.newbuild, "PREPARED_OFF");
assert.equal(siteProfile.categoryStatus.kommercheskaya, "ACTIVE");
assert.equal(siteProfile.categoryStatus.novostroyki, "PREPARED_OFF");

const navigationJson = JSON.stringify(buildR1Navigation());
for (const path of [
	"/donetsk/kvartiry/",
	"/donetsk/doma/",
	"/donetsk/uchastki/",
	commercialPath,
	"/yurist/",
]) {
	assert.equal(navigationJson.includes(path), true, `${path} must be navigable`);
}
for (const forbidden of ["novostroyki", "komplex"]) {
	assert.equal(navigationJson.includes(forbidden), false, `${forbidden} leaked`);
}

const withoutEvidence = await resolveProjectPublicRoute(
	["donetsk", "kommercheskaya"],
	{ loadProperty: noProperty },
);
assert.equal(withoutEvidence.kind, "page");
if (withoutEvidence.kind === "page") {
	assert.equal(withoutEvidence.robots.indexing, "noindex");
}

const withEvidence = await resolveProjectPublicRoute(
	["donetsk", "kommercheskaya"],
	{
		loadProperty: noProperty,
		loadListingContentGateEvidence: async (registryId) =>
			registryId === "COMM_GEO" ? commercialEvidence : null,
	},
);
assert.equal(withEvidence.kind, "page");
if (withEvidence.kind === "page") {
	assert.equal(withEvidence.robots.indexing, "index");
}

assert.equal(
	projectSitemapEntries.some((entry) => entry.path === commercialPath),
	false,
);
assert.equal(
	projectSitemapEntriesForEvidence({ COMM_GEO: commercialEvidence }).some(
		(entry) => entry.path === commercialPath,
	),
	true,
);

for (const path of [
	["donetsk", "novostroyki"],
	["novostroyki", "zhk-test"],
	["komplex", "zhk-test"],
	["yurist", "nasledstvo"],
]) {
	assert.deepEqual(
		await resolveProjectPublicRoute(path, { loadProperty: noProperty }),
		{
			kind: "notFound",
			statusCode: 404,
		},
	);
}

const sitemapJson = JSON.stringify(projectSitemapEntries);
assert.equal(sitemapJson.includes("novostroyki"), false);
assert.equal(sitemapJson.includes("komplex"), false);

const backlog = readFileSync("docs/04_BACKLOG.md", "utf8");
const releaseChecklist = readFileSync("docs/05_RELEASE_CHECKLIST.md", "utf8");
assert.match(backlog, /PUBLIC_INDEXING_ENABLED_AT \+ 4 months/);
assert.match(releaseChecklist, /PUBLIC_INDEXING_ENABLED_AT/);
assert.match(releaseChecklist, /newbuild\/ЖК/);

console.log("CP-02A first-four-month scope: PASS");
