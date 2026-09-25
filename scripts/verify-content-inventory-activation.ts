import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildRegistrySitemapEntries } from "../src/platform/sitemap/registry.ts";
import { buildListingContentQueue } from "../src/project/listing-content-queue.ts";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";
import { seoRegistry } from "../src/project/seo-registry.generated.ts";
import { siteProfile } from "../src/project/site.profile.ts";

assert.deepEqual(siteProfile.inventoryThreshold, { P1: 5, P2: 5, TEST: 10 });

const queue = buildListingContentQueue(seoRegistry);
assert.ok(queue.length > 0);
assert.deepEqual(
	[...new Set(queue.map((entry) => entry.tier))],
	["P1", "P2", "TEST"],
	"Content production queue must process P1 before P2 before TEST.",
);
for (const entry of queue) {
	assert.equal(entry.contentGateRequired, "true");
	assert.equal(
		Number(entry.minActiveObjects),
		siteProfile.inventoryThreshold[
			entry.tier as keyof typeof siteProfile.inventoryThreshold
		],
		`${entry.registryId} threshold drift`,
	);
}

const p1Entry = queue.find((entry) => entry.tier === "P1");
assert.ok(p1Entry);
const passingEvidence = {
	activeObjects: 5,
	introduction: "Уникальный проверенный текст страницы. ".repeat(20),
	contextFacts: [{ source: "owner-reviewed-source", checkedAt: "2026-09-25" }],
	serverRendered: true,
	propertyLinksInHtml: true,
} as const;
assert.deepEqual(
	buildRegistrySitemapEntries([p1Entry], {
		contentUpdatedAt: "2026-09-25T00:00:00.000Z",
		profile: siteProfile,
		contentGateEvidence: { [p1Entry.registryId]: passingEvidence },
		isCanonicalPath: () => true,
	}).map((entry) => entry.path),
	[p1Entry.url],
	"A candidate row must enter sitemap only through complete runtime evidence.",
);

const resolved = await resolveProjectPublicRoute(
	p1Entry.url.split("/").filter(Boolean),
	{
		loadProperty: async () => null,
		loadListingContentGateEvidenceMap: async () => ({
			[p1Entry.registryId]: passingEvidence,
		}),
	},
);
assert.equal(resolved.kind, "page");
if (resolved.kind === "page") {
	assert.equal(resolved.robots.indexing, "index");
	assert.equal(resolved.introduction, passingEvidence.introduction);
}

const routeRuntime = readFileSync(
	new URL("../src/core/routing/resolve-public-route.ts", import.meta.url),
	"utf8",
);
assert.match(routeRuntime, /loadListingContentGateEvidenceMap/);

const sitemapRuntime = readFileSync(
	new URL("../src/core/data-access/public/provider.ts", import.meta.url),
	"utf8",
);
assert.match(sitemapRuntime, /listingContentGateEvidenceMap/);

const catalogView = readFileSync(
	new URL(
		"../packages/ui/src/views/catalog/StarterCatalogPageView.tsx",
		import.meta.url,
	),
	"utf8",
);
assert.match(catalogView, /section-catalog-introduction/);

console.log(
	`Content/inventory activation verified: ${queue.length} gated pages, P1/P2=5, TEST=10.`,
);
