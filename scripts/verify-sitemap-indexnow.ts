import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SaxesParser } from "saxes";
import { maxMeaningfulLastModified } from "../src/platform/sitemap/registry.ts";
import { buildRobots } from "../src/project/indexing-policy.ts";
import { buildProjectIndexNowPayload } from "../src/project/indexnow.ts";
import {
	projectSitemapEntries,
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
	rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
	sitemap: `${origin}/sitemap.xml`,
	host: origin,
});

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
