import assert from "node:assert/strict";
import type { NearbyGeoAvailability } from "../src/core/data-access/public/nearby-geo.ts";
import type { PublicPropertyPageState } from "../src/core/data-access/public/provider.ts";
import {
	buildGeoSwitcher,
	buildHomeCatalogLinks,
	buildR1Navigation,
} from "../src/project/navigation.ts";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";

const property = {
	id: "1042",
	slug: "kalininskiy-2-komnatnaya",
	href: "/kvartiry/kalininskiy-2-komnatnaya-1042/",
	title: "2-комнатная квартира в Калининском районе",
	description: "Опубликованная квартира в Донецке.",
	category: "apartment",
	city: "Донецк",
	district: "Калининский район",
	address: "Донецк, Калининский район",
	related: [],
	gallery: [],
	characteristics: [],
	primaryMedia: null,
	price: null,
	dealType: "sale",
	summary: [],
	badges: [],
	lifecycle: { status: "active", isArchived: false },
} as unknown as Extract<
	PublicPropertyPageState,
	{ property: unknown }
>["property"];

const makeevka: NearbyGeoAvailability = {
	slug: "makeevka",
	name: "Макеевка",
	nameGenitive: "Макеевки",
	nameLocative: "Макеевке",
	preposition: "в",
	activeObjects: 2,
	activeByCategory: { apartment: 2, house: 0, land: 0 },
};

const dependencies = {
	loadProperty: async (id: string): Promise<PublicPropertyPageState | null> =>
		id === "1042"
			? { lifecycle: { kind: "active", statusCode: 200 }, property }
			: null,
	loadNearbyGeo: async (slug: string) =>
		slug === makeevka.slug ? makeevka : null,
};

async function resolve(href: string) {
	return resolveProjectPublicRoute(
		href.split("?")[0].split("/").filter(Boolean),
		dependencies,
	);
}

const menu = buildR1Navigation();
assert.equal(
	buildGeoSwitcher().length,
	0,
	"SINGLE_GEO switcher must be hidden",
);
assert.deepEqual(
	menu[0]?.children?.map((item) => item.href),
	["/donetsk/", "/donetsk/kvartiry/", "/donetsk/doma/", "/donetsk/uchastki/"],
);

const seedLinks = [
	...menu.flatMap((item) => [item, ...(item.children ?? [])]),
	...buildHomeCatalogLinks(),
	{ label: "Объект из каталога", href: property.href },
	{ label: "Макеевка", href: "/makeevka/" },
];

const queue = [...new Set(seedLinks.map((item) => item.href))];
const crawled = new Set<string>();
while (queue.length) {
	const href = queue.shift();
	if (!href || crawled.has(href)) continue;
	assert.equal(href.includes("?"), false, `query equivalent leaked: ${href}`);
	const result = await resolve(href);
	assert.equal(result.kind, "page", `non-page internal target: ${href}`);
	assert.equal(result.statusCode, 200, `non-200 internal target: ${href}`);
	if (result.kind !== "page") continue;
	assert.equal(
		result.canonicalPath,
		href,
		`redirect/canonical mismatch: ${href}`,
	);
	crawled.add(href);
	for (const link of [
		...result.breadcrumbs.flatMap((item) => (item.href ? [item.href] : [])),
		...result.internalLinks.map((item) => item.href),
	]) {
		if (!crawled.has(link)) queue.push(link);
	}
}

const propertyPage = await resolve(property.href);
assert.equal(propertyPage.kind, "page");
if (propertyPage.kind === "page") {
	assert.deepEqual(
		propertyPage.internalLinks.map((item) => item.href),
		[
			"/donetsk/",
			"/donetsk/kvartiry/",
			"/donetsk/kvartiry/kalininskiy/",
			"/yurist/",
		],
	);
}

assert.equal(crawled.has("/makeevka/kvartiry/"), true);
assert.equal(crawled.has("/makeevka/doma/"), false);
assert.equal(crawled.has("/makeevka/uchastki/"), false);

console.log(
	`RP-09 internal-link crawl: PASS (${crawled.size} canonical targets)`,
);
