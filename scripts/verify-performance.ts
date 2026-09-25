import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import type { PublicPropertyPageState } from "../src/core/data-access/public/provider.ts";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";

const dependencies = {
	loadProperty: async (): Promise<PublicPropertyPageState | null> => null,
};

const pageTwo = await resolveProjectPublicRoute(
	["donetsk", "kvartiry"],
	dependencies,
	{ page: "2" },
);
assert.equal(pageTwo.kind, "page");
if (pageTwo.kind === "page") {
	assert.equal(pageTwo.canonicalPath, "/donetsk/kvartiry/?page=2");
	assert.deepEqual(pageTwo.robots, {
		indexing: "noindex",
		following: "follow",
	});
	assert.equal(pageTwo.catalogQuery?.page, 2);
}

const repeatedPage = await resolveProjectPublicRoute(
	["donetsk", "kvartiry"],
	dependencies,
	{ page: ["2", "3"] },
);
assert.equal(repeatedPage.kind, "page");
if (repeatedPage.kind === "page") {
	assert.equal(repeatedPage.canonicalPath, "/donetsk/kvartiry/");
	assert.equal(repeatedPage.robots.indexing, "noindex");
	assert.equal(repeatedPage.catalogQuery?.page, 1);
}

const pageOne = await resolveProjectPublicRoute(
	["donetsk", "kvartiry"],
	dependencies,
	{ page: "1" },
);
assert.equal(pageOne.kind, "page");
if (pageOne.kind === "page") {
	assert.equal(pageOne.canonicalPath, "/donetsk/kvartiry/");
	assert.equal(pageOne.catalogQuery?.page, 1);
}

const [catalogView, catalogCard, imageAdapter, publicRoute, cacheProvider] =
	await Promise.all([
		readFile(
			"packages/ui/src/views/catalog/StarterCatalogPageView.tsx",
			"utf8",
		),
		readFile(
			"packages/ui/src/views/property/StarterPropertyCardView.tsx",
			"utf8",
		),
		readFile("packages/ui/src/lib/starter-image.tsx", "utf8"),
		readFile("src/app/(site)/public-route.tsx", "utf8"),
		readFile("src/core/data-access/public/cached-provider.ts", "utf8"),
	]);
const [uiPackage, publicLayout, publicHeader] = await Promise.all([
	readFile("packages/ui/package.json", "utf8"),
	readFile("src/app/(site)/layout.tsx", "utf8"),
	readFile("src/app/(site)/public-site-header.tsx", "utf8"),
]);

assert.doesNotMatch(catalogView, /^\s*["']use client["'];?/m);
assert.doesNotMatch(catalogCard, /^\s*["']use client["'];?/m);
assert.match(catalogView, /aria-label="Страницы каталога"/);
assert.match(publicRoute, /page: result\.catalogQuery\.page \?\? 1/);
assert.match(imageAdapter, /width=\{fill \? undefined : \(width \?\? 1200\)\}/);
assert.match(
	imageAdapter,
	/height=\{fill \? undefined : \(height \?\? 800\)\}/,
);
assert.match(
	imageAdapter,
	/loading=\{priority \? "eager" : \(loading \?\? "lazy"\)\}/,
);
assert.match(imageAdapter, /decoding="async"/);
assert.match(cacheProvider, /unstable_cache/);
assert.match(cacheProvider, /publicDataRevalidateSeconds/);
assert.match(uiPackage, /"\.\/starter\/catalog-page"/);
assert.doesNotMatch(publicRoute, /from "@ams\/realtbase-ui"/);
assert.doesNotMatch(publicLayout, /from "@ams\/realtbase-ui"/);
assert.doesNotMatch(publicHeader, /from "@ams\/realtbase-ui"/);
const broadUiImport = spawnSync(
	"git",
	["grep", "-n", 'from "@ams/realtbase-ui"', "--", "src/app"],
	{ encoding: "utf8" },
);
assert.equal(broadUiImport.status, 1);
assert.equal(broadUiImport.stdout.trim(), "");

console.log("EPIC-42 performance contract: PASS");
