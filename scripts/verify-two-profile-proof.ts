import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { SaxesParser } from "saxes";
import { buildUrl, parseUrl } from "../src/platform/grammar/index.ts";
import {
	isGeoSwitcherVisible,
	resolveCategoryRoute,
	selectActiveCategoryLinks,
	validateSiteProfile,
} from "../src/platform/profile/index.ts";
import { buildRegistrySitemapEntries } from "../src/platform/sitemap/registry.ts";
import { siteProfileMatrices } from "./fixtures/site-profile-matrices.ts";

function sourceFingerprint(root: string): string {
	const hash = createHash("sha256");
	const visit = (directory: string) => {
		for (const name of readdirSync(directory).sort()) {
			const path = join(directory, name);
			if (statSync(path).isDirectory()) visit(path);
			else {
				hash.update(relative(root, path).replaceAll("\\", "/"));
				hash.update(readFileSync(path));
			}
		}
	};
	visit(root);
	return hash.digest("hex");
}

const sourceBefore = sourceFingerprint("src");
const matrixResults: Record<string, { menu: string[]; sitemap: string[] }> = {};

for (const fixture of siteProfileMatrices) {
	assert.deepEqual(validateSiteProfile(fixture.profile), [], fixture.id);
	assert.equal(
		isGeoSwitcherVisible(fixture.profile),
		fixture.id === "multi-geo",
		fixture.id,
	);

	const grammar = {
		categorySlugs: Object.keys(fixture.profile.categoryStatus),
		geoSlugs: Object.keys(fixture.profile.geoCategoryStatus),
		staticSlugs: [],
		districts: [],
		facets: [],
	};
	const candidates = grammar.geoSlugs.map((geo) => ({
		category: "kvartiry" as const,
		geo,
		href: buildUrl({ kind: "categoryGeo", geo, category: "kvartiry" }),
		label: `${geo} apartments`,
	}));
	const menu = selectActiveCategoryLinks(fixture.profile, candidates).map(
		(entry) => entry.href,
	);
	assert.deepEqual(menu, [...fixture.expectedMenuPaths], fixture.id);

	const donetsk = resolveCategoryRoute(fixture.profile, "donetsk", "kvartiry");
	assert.deepEqual(
		{ statusCode: donetsk.statusCode, indexable: donetsk.indexable },
		{ statusCode: 200, indexable: true },
		fixture.id,
	);
	const makeevka = resolveCategoryRoute(
		fixture.profile,
		"makeevka",
		"kvartiry",
	);
	assert.equal(makeevka.statusCode, 200, fixture.id);
	assert.equal(makeevka.indexable, fixture.id === "multi-geo", fixture.id);

	const sitemap = buildRegistrySitemapEntries(fixture.registry, {
		contentUpdatedAt: "2026-09-24T00:00:00.000Z",
		isCanonicalPath(path) {
			const key = parseUrl(path, grammar);
			return key !== null && buildUrl(key) === path;
		},
	}).map((entry) => entry.path);
	assert.deepEqual(sitemap, [...fixture.expectedSitemapPaths], fixture.id);

	const xml = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap
		.map((path) => `<url><loc>https://doncity-home.ru${path}</loc></url>`)
		.join("")}</urlset>`;
	let parsedUrls = 0;
	const parser = new SaxesParser({ xmlns: true });
	parser.on("opentag", (tag) => {
		if (tag.local === "url") parsedUrls += 1;
	});
	parser.write(xml).close();
	assert.equal(parsedUrls, sitemap.length, fixture.id);

	matrixResults[fixture.id] = { menu, sitemap };
}

assert.equal(
	sourceFingerprint("src"),
	sourceBefore,
	"Switching profile fixtures must not mutate product source",
);
assert.equal(
	matrixResults["donetsk-single"].sitemap.includes("/makeevka/kvartiry/"),
	false,
);
assert.equal(
	matrixResults["multi-geo"].sitemap.includes("/makeevka/kvartiry/"),
	true,
);

console.log("RP-12 two-profile matrix: PASS (donetsk-single, multi-geo)");
