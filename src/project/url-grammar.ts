import type { PropertyCategory } from "@ams/realtbase-contracts";
import {
	buildUrl,
	type CanonicalPath,
	type PageKey,
	parseUrl,
	type UrlGrammarRegistry,
} from "../platform/grammar/index.ts";
import { type SiteCategory, siteProfile } from "./site.profile.ts";

const staticSlugs = [
	"prodat-nedvizhimost",
	"yurist",
	"o-kompanii",
	"kontakty",
	"politika-konfidencialnosti",
	"soglasie-na-obrabotku-personalnyh-dannyh",
	"spasibo",
] as const;

export const urlGrammarRegistry = {
	categorySlugs: Object.keys(siteProfile.categoryStatus),
	geoSlugs: Object.keys(siteProfile.geoCategoryStatus),
	staticSlugs,
	districts: [
		"budennovskiy",
		"voroshilovskiy",
		"kalininskiy",
		"kievskiy",
		"kirovskiy",
		"kuybyshevskiy",
		"leninskiy",
		"petrovskiy",
		"proletarskiy",
		"tekstilshchik",
	].map((slug) => ({ geo: siteProfile.primaryGeo, slug })),
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
	sale: buildUrl({ kind: "static", slug: "prodat-nedvizhimost" }),
	lawyer: buildUrl({ kind: "static", slug: "yurist" }),
	// Transitional semantic aliases keep DTO consumers on grammar-owned V4 URLs.
	services: buildUrl({ kind: "static", slug: "yurist" }),
	mortgage: buildUrl({ kind: "static", slug: "yurist" }),
	rent: buildUrl({ kind: "static", slug: "prodat-nedvizhimost" }),
	about: buildUrl({ kind: "static", slug: "o-kompanii" }),
	contacts: buildUrl({ kind: "static", slug: "kontakty" }),
	privacy: buildUrl({ kind: "static", slug: "politika-konfidencialnosti" }),
	consent: buildUrl({
		kind: "static",
		slug: "soglasie-na-obrabotku-personalnyh-dannyh",
	}),
	thanks: buildUrl({ kind: "static", slug: "spasibo" }),
} as const;

export function propertyCategoryToSlug(
	category: Exclude<PropertyCategory, "other">,
): SiteCategory {
	return propertyCategorySlug[category];
}

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
		semantic: canonicalPropertySemantic(input.semantic),
		publicUrlId: String(input.publicUrlId),
	};
}

export function canonicalPropertySemantic(value: string): string {
	const normalized = value.trim().toLowerCase();
	return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized) ? normalized : "obekt";
}

export function buildPropertyUrl(input: {
	category: PropertyCategory;
	semantic: string;
	publicUrlId: string | number;
}): CanonicalPath {
	return buildProjectUrl(propertyPageKey(input));
}
