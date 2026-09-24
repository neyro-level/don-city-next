import type { PropertyCategory } from "@ams/realtbase-contracts";
import {
	buildUrl,
	parseUrl,
	type CanonicalPath,
	type PageKey,
	type UrlGrammarRegistry,
} from "../platform/grammar/index.ts";
import { siteProfile, type SiteCategory } from "./site.profile.ts";

const staticSlugs = [
	"prodat-nedvizhimost",
	"yurist",
	"o-kompanii",
	"kontakty",
	"politika-konfidencialnosti",
	"soglasie-na-obrabotku-personalnyh-dannyh",
	"spasibo",
	// Starter routes remain registered until their page contracts move in RP-09.
	"nedvizhimost",
	"uslugi",
	"ipoteka",
	"prodat",
	"sdat",
] as const;

export const urlGrammarRegistry = {
	categorySlugs: Object.keys(siteProfile.categoryStatus),
	geoSlugs: Object.keys(siteProfile.geoCategoryStatus),
	staticSlugs,
	districts: [{ geo: siteProfile.primaryGeo, slug: "tekstilshchik" }],
	facets: Object.entries(siteProfile.facetWhitelist).flatMap(
		([category, facets]) => (facets ?? []).map((slug) => ({ category, slug })),
	),
} satisfies UrlGrammarRegistry;

const propertyCategorySlug = {
	apartment: "kvartiry",
	house: "doma",
	land: "uchastki",
	commercial: "kommercheskaya",
	garage: "garazhi",
	room: "komnaty",
} as const satisfies Record<Exclude<PropertyCategory, "other">, SiteCategory>;

export const projectUrls = {
	home: buildUrl({ kind: "home" }),
	primaryCatalog: buildUrl({
		kind: "categoryGeo",
		geo: siteProfile.primaryGeo,
		category: "kvartiry",
	}),
	services: buildUrl({ kind: "static", slug: "uslugi" }),
	mortgage: buildUrl({ kind: "static", slug: "ipoteka" }),
	sale: buildUrl({ kind: "static", slug: "prodat-nedvizhimost" }),
	rent: buildUrl({ kind: "static", slug: "sdat" }),
	about: buildUrl({ kind: "static", slug: "o-kompanii" }),
	contacts: buildUrl({ kind: "static", slug: "kontakty" }),
	privacy: buildUrl({ kind: "static", slug: "politika-konfidencialnosti" }),
	consent: buildUrl({
		kind: "static",
		slug: "soglasie-na-obrabotku-personalnyh-dannyh",
	}),
	thanks: buildUrl({ kind: "static", slug: "spasibo" }),
} as const;

export function buildProjectUrl(key: PageKey): CanonicalPath {
	return buildUrl(key);
}

export function parseProjectUrl(path: string): PageKey | null {
	return parseUrl(path, urlGrammarRegistry);
}

export function propertyPageKey(input: {
	category: PropertyCategory;
	semantic: string;
	publicUrlId: string | number;
}): PageKey {
	if (input.category === "other") {
		throw new Error(
			"Property category 'other' has no canonical public URL category.",
		);
	}
	return {
		kind: "property",
		category: propertyCategorySlug[input.category],
		semantic: input.semantic,
		publicUrlId: String(input.publicUrlId),
	};
}

export function buildPropertyUrl(input: {
	category: PropertyCategory;
	semantic: string;
	publicUrlId: string | number;
}): CanonicalPath {
	return buildProjectUrl(propertyPageKey(input));
}
