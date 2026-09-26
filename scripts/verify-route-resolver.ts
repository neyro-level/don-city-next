import assert from "node:assert/strict";
import type { PublicPropertyPageState } from "../src/core/data-access/public/provider.ts";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";

const property = {
	id: "1042",
	slug: "kalininskiy-2-komnatnaya",
	href: "/kvartiry/kalininskiy-2-komnatnaya-1042/",
	title: "2-комнатная квартира в Калининском районе",
	description: "Опубликованная квартира в Донецке.",
	category: "apartment",
	address: "Донецк",
	lifecycle: { status: "active", isArchived: false },
} as unknown as Extract<
	PublicPropertyPageState,
	{ property: unknown }
>["property"];

const loadProperty = async (
	publicUrlId: string,
): Promise<PublicPropertyPageState | null> =>
	publicUrlId === "1042"
		? { lifecycle: { kind: "active", statusCode: 200 }, property }
		: null;

async function resolve(path: string) {
	return resolveProjectPublicRoute(path.split("/").filter(Boolean), {
		loadProperty,
	});
}

const cases = [
	["/prodat-nedvizhimost/", 200, "index", "/prodat-nedvizhimost/"],
	["/yurist/", 200, "index", "/yurist/"],
	["/o-kompanii/", 200, "index", "/o-kompanii/"],
	["/kontakty/", 200, "index", "/kontakty/"],
	[
		"/politika-konfidencialnosti/",
		200,
		"noindex",
		"/politika-konfidencialnosti/",
	],
	[
		"/soglasie-na-obrabotku-personalnyh-dannyh/",
		200,
		"noindex",
		"/soglasie-na-obrabotku-personalnyh-dannyh/",
	],
	["/spasibo/", 200, "noindex", "/spasibo/"],
	["/donetsk/", 200, "index", "/donetsk/"],
	["/kvartiry/", 200, "noindex", "/kvartiry/"],
	["/doma/", 200, "noindex", "/doma/"],
	["/uchastki/", 200, "noindex", "/uchastki/"],
	["/kommercheskaya/", 200, "noindex", "/kommercheskaya/"],
	["/donetsk/kvartiry/", 200, "index", "/donetsk/kvartiry/"],
	["/donetsk/doma/", 200, "index", "/donetsk/doma/"],
	["/donetsk/uchastki/", 200, "index", "/donetsk/uchastki/"],
	[
		"/donetsk/kommercheskaya/",
		200,
		"noindex",
		"/donetsk/kommercheskaya/",
	],
	[
		"/donetsk/kvartiry/tekstilshchik/",
		200,
		"noindex",
		"/donetsk/kvartiry/tekstilshchik/",
	],
	[
		"/donetsk/kvartiry/kalininskiy/",
		200,
		"noindex",
		"/donetsk/kvartiry/kalininskiy/",
	],
	[
		"/donetsk/kvartiry/odnokomnatnye/",
		200,
		"noindex",
		"/donetsk/kvartiry/odnokomnatnye/",
	],
	[
		"/kvartiry/kalininskiy-2-komnatnaya-1042/",
		200,
		"index",
		"/kvartiry/kalininskiy-2-komnatnaya-1042/",
	],
] as const;

for (const [path, statusCode, indexing, canonicalPath] of cases) {
	const result = await resolve(path);
	assert.equal(result.statusCode, statusCode, path);
	assert.equal(result.kind, "page", path);
	if (result.kind === "page") {
		assert.equal(result.robots.indexing, indexing, path);
		assert.equal(result.canonicalPath, canonicalPath, path);
	}
}

for (const path of [
	"/kvartiry/donetsk/",
	"/donetsk/novostroyki/",
	"/komplex/test/",
	"/yurist/nasledstvo/",
	"/donetsk/kvartiry/tekstilshchik/odnokomnatnye/",
	"/donetsk/kvartiry/neizvestnyy/",
	"/donetsk/kvartiry/tekstilshchik/extra/",
	"/obekty/kalininskiy-2-komnatnaya/",
	"/nedvizhimost/",
	"/uslugi/",
	"/ipoteka/",
	"/prodat/",
	"/sdat/",
]) {
	const result = await resolve(path);
	assert.deepEqual(result, { kind: "notFound", statusCode: 404 }, path);
}

const semanticMismatch = await resolve("/kvartiry/oshibka-1042/");
assert.deepEqual(semanticMismatch, {
	kind: "redirect",
	statusCode: 301,
	destination: "/kvartiry/kalininskiy-2-komnatnaya-1042/",
});

const categoryMismatch = await resolve("/doma/kalininskiy-2-komnatnaya-1042/");
assert.deepEqual(categoryMismatch, {
	kind: "redirect",
	statusCode: 301,
	destination: "/kvartiry/kalininskiy-2-komnatnaya-1042/",
});

assert.deepEqual(await resolve("/kvartiry/neizvestnyy-9999/"), {
	kind: "notFound",
	statusCode: 404,
});

const gatePassedDistrict = await resolveProjectPublicRoute(
	["donetsk", "kvartiry", "kalininskiy"],
	{
		loadProperty,
		loadListingContentGateEvidence: async (registryId) =>
			registryId === "APT_DIST_KALIN"
				? {
						activeObjects: 5,
						introduction: "а".repeat(600),
						contextFacts: [
							{ source: "official district register", checkedAt: "2026-09-24" },
						],
						serverRendered: true,
						propertyLinksInHtml: true,
					}
				: null,
	},
);
assert.equal(gatePassedDistrict.kind, "page");
if (gatePassedDistrict.kind === "page") {
	assert.equal(gatePassedDistrict.robots.indexing, "index");
}

for (const [path, landUse] of [
	["/donetsk/uchastki/izhs/", "izhs"],
	["/donetsk/uchastki/snt/", "snt"],
] as const) {
	const result = await resolve(path);
	assert.equal(result.kind, "page", path);
	if (result.kind === "page") {
		assert.deepEqual(result.catalogQuery, {
			category: "land",
			geoSlug: "donetsk",
			districtSlug: undefined,
			rooms: undefined,
			landUse,
		});
		assert.equal(result.robots.indexing, "noindex", path);
	}
}

console.log("RP-06 route resolver matrix: PASS");
