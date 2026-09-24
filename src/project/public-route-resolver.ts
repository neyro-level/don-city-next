import type {
	PropertyCategory,
	PublicPageIdentityDTO,
} from "@ams/realtbase-contracts";
import type { NearbyGeoAvailability } from "../core/data-access/public/nearby-geo.ts";
import type { PublicPropertyPageState } from "../core/data-access/public/provider.ts";
import type { PageKey } from "../platform/grammar/types.ts";
import type { SeoRegistryEntry } from "../platform/seo/registry.ts";
import {
	buildCatalogLinks,
	buildPageBreadcrumbs,
	buildPropertyNavigation,
	type InternalLink,
} from "./navigation.ts";
import { buildPublicPageIdentity } from "./public-page-identity.ts";
import { seoRegistryByCanonicalPath } from "./seo-registry.generated.ts";
import { siteConfig } from "./site.config.ts";
import { siteProfile } from "./site.profile.ts";
import {
	buildProjectUrl,
	canonicalPropertySemantic,
	parseProjectUrl,
	propertyCategoryToSlug,
} from "./url-grammar.ts";

export type PublicRobots = {
	indexing: "index" | "noindex";
	following: "follow" | "nofollow";
};

type CatalogQuery = {
	category?: "apartment" | "house" | "land";
	geoSlug?: string;
	districtSlug?: string;
	rooms?: number[];
};

export type ResolvedPublicPage = {
	kind: "page";
	statusCode: 200;
	key: PageKey;
	canonicalPath: string;
	title: string;
	description: string;
	h1: string;
	robots: PublicRobots;
	catalogQuery?: CatalogQuery;
	geoLinks?: readonly { href: string; label: string }[];
	breadcrumbs: readonly { label: string; href?: string }[];
	internalLinks: readonly InternalLink[];
	identity: PublicPageIdentityDTO;
	property?: Extract<
		PublicPropertyPageState,
		{ property: unknown }
	>["property"];
};

export type ResolvedPublicRoute =
	| ResolvedPublicPage
	| { kind: "notFound"; statusCode: 404 }
	| { kind: "gone"; statusCode: 410; publicUrlId: string }
	| { kind: "redirect"; statusCode: 301 | 308; destination: string };

export type PublicRouteDependencies = {
	loadProperty: (
		publicUrlId: string,
	) => Promise<PublicPropertyPageState | null>;
	loadNearbyGeo?: (slug: string) => Promise<NearbyGeoAvailability | null>;
};

function page(
	key: PageKey,
	input: Omit<
		ResolvedPublicPage,
		| "kind"
		| "statusCode"
		| "key"
		| "canonicalPath"
		| "breadcrumbs"
		| "internalLinks"
		| "identity"
	> &
		Partial<
			Pick<ResolvedPublicPage, "breadcrumbs" | "internalLinks" | "identity">
		>,
): ResolvedPublicPage {
	const result = {
		kind: "page" as const,
		statusCode: 200 as const,
		key,
		canonicalPath: buildProjectUrl(key),
		...input,
	};
	return {
		...result,
		breadcrumbs: input.breadcrumbs ?? buildPageBreadcrumbs(key, result.h1),
		internalLinks: input.internalLinks ?? buildCatalogLinks(key),
		identity: input.identity ?? buildPublicPageIdentity(key),
	};
}

const domainCategory = {
	kvartiry: "apartment",
	doma: "house",
	uchastki: "land",
} as const;

const nearbyCategoryCopy = {
	kvartiry: {
		category: "apartment",
		title: "Купить квартиру",
		h1: "Квартиры",
		description: "Квартиры на продажу",
	},
	doma: {
		category: "house",
		title: "Купить дом",
		h1: "Дома",
		description: "Дома на продажу",
	},
	uchastki: {
		category: "land",
		title: "Купить земельный участок",
		h1: "Земельные участки",
		description: "Земельные участки на продажу",
	},
} as const;

function robotsFromRegistry(entry: SeoRegistryEntry): PublicRobots {
	const [indexing, following] = entry.robots.split(",");
	return {
		indexing: indexing as PublicRobots["indexing"],
		following: following as PublicRobots["following"],
	};
}

function catalogQueryFor(key: PageKey): CatalogQuery | undefined {
	if (key.kind === "geoHub") return { geoSlug: key.geo };
	if (
		key.kind !== "categoryRoot" &&
		key.kind !== "categoryGeo" &&
		key.kind !== "categoryGeoDistrict" &&
		key.kind !== "categoryGeoFacet"
	) {
		return undefined;
	}
	const category = domainCategory[key.category as keyof typeof domainCategory];
	const rooms =
		key.kind === "categoryGeoFacet"
			? { odnokomnatnye: [1], dvuhkomnatnye: [2], trehkomnatnye: [3] }[
					key.facet
				]
			: undefined;
	return {
		category,
		geoSlug: key.kind === "categoryRoot" ? undefined : key.geo,
		districtSlug:
			key.kind === "categoryGeoDistrict" ? key.district : undefined,
		rooms,
	};
}

function resolveRegistryPage(key: Exclude<PageKey, { kind: "property" }>) {
	const canonicalPath = buildProjectUrl(key);
	const contract = seoRegistryByCanonicalPath.get(canonicalPath);
	if (!contract) return { kind: "notFound", statusCode: 404 } as const;
	return page(key, {
		title: contract.title,
		description: contract.description,
		h1: contract.h1,
		robots: robotsFromRegistry(contract),
		catalogQuery: catalogQueryFor(key),
	});
}

async function resolveNearbyGeoPage(
	key: Extract<PageKey, { kind: "geoHub" | "categoryGeo" }>,
	dependencies: PublicRouteDependencies,
): Promise<ResolvedPublicRoute> {
	const availability = await dependencies.loadNearbyGeo?.(key.geo);
	if (!availability?.activeObjects) {
		return { kind: "notFound", statusCode: 404 };
	}
	if (key.kind === "geoHub") {
		const internalLinks = Object.entries(nearbyCategoryCopy).flatMap(
			([category, copy]) =>
				availability.activeByCategory[copy.category]
					? [
							{
								href: buildProjectUrl({
									kind: "categoryGeo",
									geo: key.geo,
									category,
								}),
								label: `${copy.h1} ${availability.preposition} ${availability.nameLocative}`,
							},
						]
					: [],
		);
		return page(key, {
			title: `Недвижимость ${availability.preposition} ${availability.nameLocative}, ДНР | ${siteConfig.brandName}`,
			description: `Недвижимость ${availability.preposition} ${availability.nameLocative}, ДНР: опубликованные объекты, фото и цены. Подбор и сопровождение сделки в «${siteConfig.brandName}».`,
			h1: `Недвижимость ${availability.preposition} ${availability.nameLocative}`,
			robots: { indexing: "noindex", following: "follow" },
			catalogQuery: { geoSlug: availability.slug },
			breadcrumbs: [
				{ label: "Главная", href: buildProjectUrl({ kind: "home" }) },
				{
					label: `Недвижимость ${availability.preposition} ${availability.nameLocative}`,
				},
			],
			internalLinks,
		});
	}
	const copy =
		nearbyCategoryCopy[key.category as keyof typeof nearbyCategoryCopy];
	if (!copy || !availability.activeByCategory[copy.category]) {
		return { kind: "notFound", statusCode: 404 };
	}
	return page(key, {
		title: `${copy.title} ${availability.preposition} ${availability.nameLocative}, ДНР | ${siteConfig.brandName}`,
		description: `${copy.description} ${availability.preposition} ${availability.nameLocative}, ДНР: актуальные опубликованные объекты, фото и цены.`,
		h1: `${copy.h1} ${availability.preposition} ${availability.nameLocative}`,
		robots: { indexing: "noindex", following: "follow" },
		catalogQuery: { category: copy.category, geoSlug: availability.slug },
		breadcrumbs: [
			{ label: "Главная", href: buildProjectUrl({ kind: "home" }) },
			{
				label: `Недвижимость ${availability.preposition} ${availability.nameLocative}`,
				href: buildProjectUrl({ kind: "geoHub", geo: key.geo }),
			},
			{
				label: `${copy.h1} ${availability.preposition} ${availability.nameLocative}`,
			},
		],
		internalLinks: [],
	});
}

function nearbyGeoSlugForCity(city: string): string | null {
	for (const [slug, aliases] of Object.entries(
		siteProfile.nearbyGeoAliases ?? {},
	)) {
		if (
			aliases.some(
				(alias) =>
					alias.localeCompare(city, "ru", { sensitivity: "base" }) === 0,
			)
		) {
			return slug;
		}
	}
	return null;
}

async function propertyNearbyGeoLinks(
	property: ResolvedPublicPage["property"],
	dependencies: PublicRouteDependencies,
): Promise<ResolvedPublicPage["geoLinks"]> {
	if (!property) return undefined;
	const slug = nearbyGeoSlugForCity(property.city);
	if (!slug) return undefined;
	const availability = await dependencies.loadNearbyGeo?.(slug);
	if (!availability?.activeObjects) return undefined;
	const categorySlug = propertyCategoryToSlug(
		property.category as Exclude<PropertyCategory, "other">,
	);
	const domain = domainCategory[categorySlug as keyof typeof domainCategory];
	const links = [
		{
			href: buildProjectUrl({ kind: "geoHub", geo: slug }),
			label: `Недвижимость ${availability.preposition} ${availability.nameLocative}`,
		},
	];
	if (domain && availability.activeByCategory[domain]) {
		links.push({
			href: buildProjectUrl({
				kind: "categoryGeo",
				geo: slug,
				category: categorySlug,
			}),
			label: `${nearbyCategoryCopy[categorySlug as keyof typeof nearbyCategoryCopy]?.h1 ?? "Объекты"} ${availability.preposition} ${availability.nameLocative}`,
		});
	}
	return links;
}

export async function resolveProjectPublicRoute(
	segments: readonly string[],
	dependencies: PublicRouteDependencies,
): Promise<ResolvedPublicRoute> {
	const key = parseProjectUrl(
		segments.length ? `/${segments.join("/")}/` : "/",
	);
	if (!key) return { kind: "notFound", statusCode: 404 };
	if (
		(key.kind === "geoHub" || key.kind === "categoryGeo") &&
		key.geo !== siteProfile.primaryGeo
	) {
		return resolveNearbyGeoPage(key, dependencies);
	}
	if (key.kind !== "property") return resolveRegistryPage(key);

	const state = await dependencies.loadProperty(key.publicUrlId);
	if (!state) return { kind: "notFound", statusCode: 404 };
	if (!("property" in state)) {
		if (state.lifecycle.kind === "gone") {
			return { kind: "gone", statusCode: 410, publicUrlId: key.publicUrlId };
		}
		return {
			kind: "redirect",
			statusCode: 308,
			destination: state.lifecycle.destination,
		};
	}
	const property = state.property;
	const actualCategory = propertyCategoryToSlug(
		property.category as Exclude<PropertyCategory, "other">,
	);
	if (
		key.category !== actualCategory ||
		key.semantic !== canonicalPropertySemantic(property.slug)
	) {
		return { kind: "redirect", statusCode: 301, destination: property.href };
	}
	const geoLinks = await propertyNearbyGeoLinks(property, dependencies);
	const navigation = buildPropertyNavigation(property, geoLinks);
	const actualGeoSlug =
		nearbyGeoSlugForCity(property.city) ?? siteProfile.primaryGeo;
	return page(key, {
		title: `${property.title} — ${siteConfig.brandName}`,
		description: property.description,
		h1: property.title,
		robots: property.lifecycle.isArchived
			? { indexing: "noindex", following: "follow" }
			: { indexing: "index", following: "follow" },
		property,
		geoLinks,
		breadcrumbs: navigation.breadcrumbs,
		internalLinks: navigation.links,
		identity: buildPublicPageIdentity(key, {
			geoSlug: actualGeoSlug,
			category: actualCategory,
		}),
	});
}
