import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SaxesParser } from "saxes";
import {
	buildRegistrySitemapEntries,
	maxMeaningfulLastModified,
} from "../src/platform/sitemap/registry.ts";
import { buildRobots } from "../src/project/indexing-policy.ts";
import { buildProjectIndexNowPayload } from "../src/project/indexnow.ts";
import { seoRegistry } from "../src/project/seo-registry.generated.ts";
import { siteProfile } from "../src/project/site.profile.ts";
import {
	projectRegistrySitemapEntries,
	projectSitemapEntries,
	projectSitemapEntriesForEvidence,
	projectSitemapOwners,
	registryContentUpdatedAt,
} from "../src/project/sitemap.ts";
import {
	buildProjectUrl,
	parseProjectUrl,
} from "../src/project/url-grammar.ts";

const expectedPaths = JSON.parse(
	readFileSync("scripts/fixtures/rp11-sitemap.snapshot.json", "utf8"),
) as string[];
const actualPaths = projectSitemapEntries.map((entry) => entry.path);

const expectedLogicalSitemaps = JSON.parse(
	readFileSync(
		"scripts/fixtures/epic36-logical-sitemaps.snapshot.json",
		"utf8",
	),
) as Record<string, string[]>;
const actualLogicalSitemaps = Object.fromEntries(
	projectSitemapOwners.map((owner) => [
		owner,
		owner === "kvartiry" ||
		owner === "doma" ||
		owner === "uchastki" ||
		owner === "kommercheskaya"
			? []
			: projectRegistrySitemapEntries(owner).map((entry) => entry.path),
	]),
);

assert.deepEqual(actualLogicalSitemaps, expectedLogicalSitemaps);
assert.equal(
	new Set(Object.values(actualLogicalSitemaps).flat()).size,
	Object.values(actualLogicalSitemaps).flat().length,
	"Logical registry sitemap owners must partition URLs without duplicates.",
);
assert.deepEqual(projectSitemapOwners, [
	"static",
	"geo",
	"catalog",
	"districts",
	"facets",
	"kvartiry",
	"doma",
	"uchastki",
	"kommercheskaya",
]);
assert.equal(
	projectSitemapOwners.some((owner) =>
		["novostroyki", "ipoteka"].includes(owner),
	),
	false,
	"Deferred sitemap owner leaked into the launch map set.",
);

const commercialEvidence = {
	COMM_GEO: {
		activeObjects: 10,
		introduction: "К".repeat(600),
		serverRendered: true,
		propertyLinksInHtml: true,
	},
};
assert.equal(
	projectSitemapEntries.some(
		(entry) => entry.path === "/donetsk/kommercheskaya/",
	),
	false,
	"Commercial must stay outside sitemap before its factual gate passes.",
);
assert.equal(
	projectSitemapEntriesForEvidence(commercialEvidence).some(
		(entry) => entry.path === "/donetsk/kommercheskaya/",
	),
	true,
	"Commercial must enter sitemap after its factual gate passes.",
);

assert.deepEqual(actualPaths, expectedPaths);
assert.ok(
	actualPaths.every((path) => {
		const key = parseProjectUrl(path);
		return key !== null && buildProjectUrl(key) === path;
	}),
);
assert.ok(
	projectSitemapEntries.every(
		(entry) => entry.lastModified === registryContentUpdatedAt,
	),
);
assert.equal(
	maxMeaningfulLastModified(
		registryContentUpdatedAt,
		"2026-09-25T10:00:00.000Z",
		"2026-09-23T10:00:00.000Z",
	),
	"2026-09-25T10:00:00.000Z",
);

for (const forbidden of [
	"/kvartiry/",
	"/doma/",
	"/uchastki/",
	"/makeevka/",
	"/kvartiry/donetsk/",
]) {
	assert.equal(actualPaths.includes(forbidden), false, `${forbidden} leaked`);
}

const origin = "https://doncity-home.ru";
const xml = [
	'<?xml version="1.0" encoding="UTF-8"?>',
	'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
	...projectSitemapEntries.map(
		(entry) =>
			`<url><loc>${new URL(entry.path, origin).toString()}</loc><lastmod>${entry.lastModified}</lastmod></url>`,
	),
	"</urlset>",
].join("");
let xmlError: Error | null = null;
let urlCount = 0;
const parser = new SaxesParser({ xmlns: true });
parser.on("error", (error) => {
	xmlError = error;
});
parser.on("opentag", (tag) => {
	if (tag.local === "url") urlCount += 1;
});
parser.write(xml).close();
assert.equal(xmlError, null);
assert.equal(urlCount, expectedPaths.length);

assert.deepEqual(buildRobots("noindex", `${origin}/`), {
	rules: [{ userAgent: "*", disallow: "/" }],
});
assert.deepEqual(buildRobots("public", origin), {
	rules: [
		{
			userAgent: "*",
			allow: ["/", "/api/media/file/"],
			disallow: ["/admin/", "/api/"],
		},
	],
	sitemap: `${origin}/sitemap.xml`,
	host: origin,
});

const gatedDistrict = seoRegistry.find(
	(entry) =>
		entry.pageType === "district" && entry.contentGateRequired === "true",
);
assert.ok(gatedDistrict, "Expected a district Content Gate fixture.");
const activatedDistrict = { ...gatedDistrict, status: "active" as const };
assert.deepEqual(
	buildRegistrySitemapEntries([activatedDistrict], {
		contentUpdatedAt: registryContentUpdatedAt,
		profile: siteProfile,
		owner: "districts",
		contentGateEvidence: {
			[activatedDistrict.registryId]: {
				activeObjects: Number(activatedDistrict.minActiveObjects),
				introduction: "Д".repeat(600),
				contextFacts: [
					{ source: "verified fixture", checkedAt: "2026-09-25T00:00:00.000Z" },
				],
				serverRendered: true,
				propertyLinksInHtml: true,
			},
		},
		isCanonicalPath(path) {
			const key = parseProjectUrl(path);
			return key !== null && buildProjectUrl(key) === path;
		},
	}).map((entry) => entry.path),
	[activatedDistrict.url],
	"An active Gate-pass district must enter only the districts map.",
);
assert.deepEqual(
	buildRegistrySitemapEntries([gatedDistrict], {
		contentUpdatedAt: registryContentUpdatedAt,
		profile: siteProfile,
		owner: "districts",
		isCanonicalPath: () => true,
	}),
	[],
	"A candidate district must remain outside sitemap output.",
);

const fakeKey = "fixture-indexnow-key";
for (const reason of [
	"publication",
	"meaningful_update",
	"archive",
	"removal",
	"gone",
] as const) {
	const payload = buildProjectIndexNowPayload(
		{ reason, canonicalPath: "/donetsk/kvartiry/" },
		fakeKey,
	);
	assert.deepEqual(payload.urlList, [`${origin}/donetsk/kvartiry/`]);
}

const move = buildProjectIndexNowPayload(
	{
		reason: "canonical_move",
		previousCanonicalPath: "/kvartiry/staryy-dom-123/",
		canonicalPath: "/kvartiry/novyy-dom-123/",
		previousUrlEvidence: "persisted_canonical",
	},
	fakeKey,
);
assert.deepEqual(move.urlList, [
	`${origin}/kvartiry/staryy-dom-123/`,
	`${origin}/kvartiry/novyy-dom-123/`,
]);
assert.throws(
	() =>
		buildProjectIndexNowPayload(
			{ reason: "publication", canonicalPath: "/kvartiry/donetsk/" },
			fakeKey,
		),
	/owned by the project grammar/,
);

console.log("Sitemap, robots and IndexNow contract verification passed.");
