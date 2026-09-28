import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SaxesParser } from "saxes";
import {
	catalogRetentionThreshold,
	isCatalogRetentionDue,
} from "../src/core/ingest/catalog-retention.ts";
import { serializeJsonLdSafely } from "../src/core/seo/json-ld.ts";
import {
	createSitemapIndexResponse,
	createSitemapShardResponse,
} from "../src/core/seo/sitemap-http.ts";
import { toMetadata } from "../src/platform/seo/page-metadata.ts";
import {
	buildRobotsText,
	metadataRobotsForPolicy,
	robotsCleanQueryParameters,
} from "../src/project/indexing-policy.ts";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";
import { seoRegistry } from "../src/project/seo-registry.generated.ts";

const origin = "https://doncity-home.ru";
assert.equal(
	buildRobotsText("noindex", origin),
	"User-agent: *\nDisallow: /\n",
);
const publicRobots = buildRobotsText("public", origin);
for (const directive of [
	"Allow: /",
	"Allow: /api/media/file/",
	"Disallow: /admin/",
	"Disallow: /api/",
	"Sitemap: https://doncity-home.ru/sitemap.xml",
	`Clean-param: ${robotsCleanQueryParameters.join("&")} /`,
]) {
	assert.ok(publicRobots.includes(directive), directive);
}
assert.doesNotMatch(publicRobots, /^Host:/m);
assert.equal(
	(publicRobots.match(/^Clean-param:/gm) ?? []).length,
	1,
	"robots.txt must own one explicit query-cleaning directive",
);
assert.ok(robotsCleanQueryParameters.includes("fbclid"));
assert.deepEqual(metadataRobotsForPolicy("noindex"), {
	index: false,
	follow: false,
});
assert.deepEqual(metadataRobotsForPolicy("public"), {
	index: true,
	follow: true,
});

const descriptors = [
	{ id: 0, owner: "static" },
	{ id: 1, owner: "empty" },
] as const;
const loadEntries = async (owner: (typeof descriptors)[number]["owner"]) =>
	owner === "static"
		? [
				{
					path: "/donetsk/",
					lastModified: "2026-09-27T00:00:00.000Z",
					indexable: true,
				},
			]
		: [];
const indexResponse = await createSitemapIndexResponse({
	descriptors,
	loadEntries,
	absoluteShardUrl: (id) => `${origin}/sitemap/${id}.xml`,
});
assert.equal(indexResponse.status, 200);
assert.equal(indexResponse.headers.get("cache-control"), "private, no-store");
const indexXml = await indexResponse.text();
assert.match(indexXml, /sitemap\/0\.xml/);
assert.doesNotMatch(indexXml, /sitemap\/1\.xml/);

const shardResponse = await createSitemapShardResponse({
	id: "0.xml",
	descriptors,
	loadEntries,
	absoluteUrl: (path) => `${origin}${path}`,
});
assert.equal(shardResponse.status, 200);
const shardXml = await shardResponse.text();
assert.match(shardXml, /https:\/\/doncity-home\.ru\/donetsk\//);
assert.equal(
	(
		await createSitemapShardResponse({
			id: "1.xml",
			descriptors,
			loadEntries,
			absoluteUrl: (path) => `${origin}${path}`,
		})
	).status,
	404,
);
const failingLoader = async () => {
	throw new Error("provider unavailable");
};
assert.equal(
	(
		await createSitemapIndexResponse({
			descriptors,
			loadEntries: failingLoader,
			absoluteShardUrl: (id) => `${origin}/sitemap/${id}.xml`,
		})
	).status,
	503,
);
assert.equal(
	(
		await createSitemapShardResponse({
			id: "0.xml",
			descriptors,
			loadEntries: failingLoader,
			absoluteUrl: (path) => `${origin}${path}`,
		})
	).status,
	503,
);
for (const xml of [indexXml, shardXml]) {
	let error: Error | null = null;
	const parser = new SaxesParser({ xmlns: true });
	parser.on("error", (value) => {
		error = value;
	});
	parser.write(xml).close();
	assert.equal(error, null);
}

const metadata = toMetadata(
	{
		title: "Квартиры в Донецке — ДОН СИТИ",
		description: "Вторичные квартиры на продажу в Донецке.",
		canonicalPath: "/donetsk/kvartiry/",
		indexing: "index",
		following: "follow",
		openGraph: {
			image: {
				kind: "managed",
				src: "/brand/don-city-logo-approved.jpg",
				alt: "ДОН СИТИ",
				width: 1200,
				height: 630,
			},
		},
	},
	{
		absoluteUrl: (path) => new URL(path, origin).toString(),
		brandName: "ДОН СИТИ",
		locale: "ru-RU",
	},
);
assert.equal(metadata.openGraph?.url, `${origin}/donetsk/kvartiry/`);
assert.equal((metadata.openGraph as { type?: string })?.type, "website");
assert.equal(metadata.openGraph?.locale, "ru_RU");
assert.equal(metadata.openGraph?.siteName, "ДОН СИТИ");
assert.equal(
	(metadata.twitter as { card?: string })?.card,
	"summary_large_image",
);
assert.deepEqual(metadata.robots, { index: true, follow: true });

const indexableRegistry = seoRegistry.filter(
	(entry) => entry.status === "active" && entry.robots === "index,follow",
);
assert.equal(
	new Set(indexableRegistry.map((entry) => entry.title)).size,
	indexableRegistry.length,
);
assert.equal(
	new Set(indexableRegistry.map((entry) => entry.description)).size,
	indexableRegistry.length,
);
for (const entry of indexableRegistry) {
	assert.ok(
		entry.title.length >= 15 && entry.title.length <= 70,
		entry.registryId,
	);
	assert.ok(
		entry.description.length >= 70 && entry.description.length <= 180,
		entry.registryId,
	);
}

const dependencies = {
	loadProperty: async () => null,
	loadListingContentGateEvidenceMap: async () => ({}),
	loadListingContentGateEvidence: async () => null,
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
}
assert.deepEqual(
	await resolveProjectPublicRoute(["donetsk", "kvartiry"], dependencies, {
		page: "1",
	}),
	{
		kind: "redirect",
		statusCode: 301,
		destination: "/donetsk/kvartiry/",
	},
);
assert.deepEqual(
	await resolveProjectPublicRoute(["donetsk", "kvartiry"], dependencies, {
		page: ["2", "3"],
	}),
	{ kind: "notFound", statusCode: 404 },
);
const unknownQuery = await resolveProjectPublicRoute(
	["donetsk", "kvartiry"],
	dependencies,
	{ debug: "1" },
);
assert.equal(unknownQuery.kind, "page");
if (unknownQuery.kind === "page") {
	assert.equal(unknownQuery.canonicalPath, "/donetsk/kvartiry/");
	assert.equal(unknownQuery.robots.indexing, "noindex");
}

const exactDay100 = new Date("2026-04-19T00:00:00.000Z");
const now = new Date("2026-07-28T00:00:00.000Z");
assert.equal(
	catalogRetentionThreshold(now, 100).toISOString(),
	exactDay100.toISOString(),
);
assert.equal(isCatalogRetentionDue(exactDay100, now, 100), true);
assert.equal(
	isCatalogRetentionDue("2026-04-19T00:00:00.001Z", now, 100),
	false,
);

const adversarial = { value: "</script><script>alert(1)</script>" };
assert.deepEqual(JSON.parse(serializeJsonLdSafely(adversarial)), adversarial);
assert.equal(serializeJsonLdSafely(adversarial).includes("</script"), false);

const publicRouteSource = readFileSync(
	"src/app/(site)/public-route.tsx",
	"utf8",
);
for (const builder of [
	"buildCatalogItemListJsonLd",
	"buildPropertyJsonLd",
	"buildBreadcrumbJsonLd",
	"buildOrganizationJsonLd",
]) {
	assert.ok(publicRouteSource.includes(builder), builder);
}
assert.match(
	publicRouteSource,
	/const resolvePublicRouteRequestCached = cache/,
);
assert.equal(
	(publicRouteSource.match(/resolvePublicRouteRequest\(/g) ?? []).length,
	3,
	"Metadata and page rendering must share one request-scoped resolver.",
);
assert.match(publicRouteSource, /result\.kind === "notFound" \|\| outOfRange/);
assert.match(publicRouteSource, /if \(outOfRange\) notFound\(\)/);
assert.match(publicRouteSource, /robots: \{ index: false, follow: false \}/);
assert.doesNotMatch(
	publicRouteSource.match(
		/if \(result\.kind === "notFound" \|\| outOfRange\)[\s\S]*?\n\t\}/,
	)?.[0] ?? "",
	/canonical|alternates/,
);
const propertyViewSource = readFileSync(
	"packages/ui/src/views/property/StarterPropertyPageView.tsx",
	"utf8",
);
assert.doesNotMatch(
	propertyViewSource,
	/<h2[^>]*>\s*\{property\.price\?\.label/,
);
assert.match(propertyViewSource, /<h1[^>]*>[\s\S]*\{property\.title\}/);

console.log("CP-02 SEO surface, sitemap and lifecycle verification: PASS");
