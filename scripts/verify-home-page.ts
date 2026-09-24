import assert from "node:assert/strict";

import { toHomePageDTO } from "../src/core/data-access/public/dto.ts";
import { seoRegistryById } from "../src/project/seo-registry.generated.ts";

const home = seoRegistryById.get("HOME");
assert.ok(home, "HOME registry entry must exist");

const page = toHomePageDTO({
	slug: "home",
	title: "CMS title must not replace the approved home H1",
	updatedAt: "2026-09-24T00:00:00.000Z",
	seo: {
		title: "CMS title must not replace the approved home metadata",
		description: "CMS description must not replace the approved home metadata",
		canonicalPath: "/",
		indexing: "noindex",
		following: "nofollow",
	},
});

assert.equal(page.title, home.h1);
assert.deepEqual(page.seo, {
	title: home.title,
	description: home.description,
	canonicalPath: home.url,
	indexing: "index",
	following: "follow",
});
assert.equal(page.lead, home.description);
assert.equal(page.seo.canonicalPath, "/");

console.log("EPIC-19 home metadata and H1 contract: PASS");
