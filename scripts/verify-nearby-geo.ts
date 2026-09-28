import assert from "node:assert/strict";
import type { NearbyGeoAvailability } from "../src/core/data-access/public/nearby-geo.ts";
import type { PublicPropertyPageState } from "../src/core/data-access/public/provider.ts";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";
import { siteProfile } from "../src/project/site.profile.ts";

const makeevka: NearbyGeoAvailability = {
	slug: "makeevka",
	name: "Макеевка",
	nameGenitive: "Макеевки",
	nameLocative: "Макеевке",
	preposition: "в",
	activeObjects: 6,
	activeByCategory: { apartment: 2, house: 2, land: 2 },
};

function property(input: {
	id: string;
	slug: string;
	city: string;
}): Extract<PublicPropertyPageState, { property: unknown }> {
	return {
		lifecycle: { kind: "active", statusCode: 200 },
		property: {
			id: input.id,
			slug: input.slug,
			href: `/kvartiry/${input.slug}-${input.id}/`,
			title: `Квартира ${input.id}`,
			description: "Опубликованная квартира.",
			category: "apartment",
			city: input.city,
			address: input.city,
			lifecycle: { status: "active", isArchived: false },
		} as Extract<PublicPropertyPageState, { property: unknown }>["property"],
	};
}

const properties = new Map([
	[
		"2042",
		property({ id: "2042", slug: "kvartira-makeyevka", city: "Макеевка" }),
	],
	["1042", property({ id: "1042", slug: "kvartira-donetsk", city: "Донецк" })],
]);

const dependencies = {
	loadNearbyGeo: async (slug: string) =>
		slug === "makeevka" ? makeevka : null,
	loadProperty: async (id: string) => properties.get(id) ?? null,
};

async function resolve(path: string) {
	return resolveProjectPublicRoute(
		path.split("/").filter(Boolean),
		dependencies,
	);
}

for (const [path, query] of [
	["/makeevka/", { geoSlug: "makeevka" }],
	["/makeevka/kvartiry/", { category: "apartment", geoSlug: "makeevka" }],
	["/makeevka/doma/", { category: "house", geoSlug: "makeevka" }],
	["/makeevka/uchastki/", { category: "land", geoSlug: "makeevka" }],
] as const) {
	const result = await resolve(path);
	assert.equal(result.kind, "page", path);
	assert.equal(result.statusCode, 200, path);
	if (result.kind === "page") {
		assert.deepEqual(result.robots, {
			indexing: "noindex",
			following: "follow",
		});
		assert.equal(result.canonicalPath, path);
		assert.deepEqual(result.catalogQuery, query);
		assert.match(result.title, /Макеевк/);
	}
}

for (const path of [
	"/makeevka/kommercheskaya/",
	"/makeevka/kvartiry/centralnyy/",
	"/makeevka/kvartiry/odnokomnatnye/",
	"/makeyevka/",
]) {
	assert.deepEqual(
		await resolve(path),
		{ kind: "notFound", statusCode: 404 },
		path,
	);
}

const nearbyProperty = await resolve("/kvartiry/kvartira-makeyevka-2042/");
assert.equal(nearbyProperty.kind, "page");
if (nearbyProperty.kind === "page") {
	assert.deepEqual(nearbyProperty.geoLinks, [
		{ href: "/makeevka/", label: "Недвижимость в Макеевке" },
		{ href: "/makeevka/kvartiry/", label: "Квартиры в Макеевке" },
	]);
}

const primaryProperty = await resolve("/kvartiry/kvartira-donetsk-1042/");
assert.equal(primaryProperty.kind, "page");
if (primaryProperty.kind === "page") {
	assert.equal(primaryProperty.geoLinks, undefined);
}

const mutableProfile = siteProfile as unknown as {
	nearbyGeoRouteAllowlist: Record<string, readonly string[]>;
};
const approvedRoutes = mutableProfile.nearbyGeoRouteAllowlist;
try {
	mutableProfile.nearbyGeoRouteAllowlist = {};
	for (const path of ["/makeevka/", "/makeevka/kvartiry/"]) {
		assert.deepEqual(
			await resolve(path),
			{ kind: "notFound", statusCode: 404 },
			`pre-gate route leaked: ${path}`,
		);
	}
	const preGateProperty = await resolve("/kvartiry/kvartira-makeyevka-2042/");
	assert.equal(preGateProperty.kind, "page");
	if (preGateProperty.kind === "page") {
		assert.equal(preGateProperty.geoLinks, undefined);
		assert.equal(
			preGateProperty.internalLinks.some((link) =>
				link.href.startsWith("/makeevka/"),
			),
			false,
		);
	}
} finally {
	mutableProfile.nearbyGeoRouteAllowlist = approvedRoutes;
}

console.log("RP-08 nearby geo fixture: PASS");
