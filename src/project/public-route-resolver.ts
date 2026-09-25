import type {
	PropertyCategory,
	PublicPageIdentityDTO,
} from "@ams/realtbase-contracts";
import type { NearbyGeoAvailability } from "../core/data-access/public/nearby-geo.ts";
import type { PublicPropertyPageState } from "../core/data-access/public/provider.ts";
import {
	type HouseType,
	isHouseType,
} from "../platform/catalog/house-types.ts";
import type { LandFacetSlug } from "../platform/catalog/land-facets.ts";
import type { PageKey } from "../platform/grammar/types.ts";
import {
	effectiveListingRobots,
	type ListingContentGateEvidence,
	resolveListingQueryCanonical,
} from "../platform/seo/content-gate.ts";
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
	houseType?: HouseType;
	landUse?: LandFacetSlug;
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
	loadListingContentGateEvidence?: (
		registryId: string,
	) => Promise<ListingContentGateEvidence | null>;
	loadDistrictParentSlug?: (
		geoSlug: string,
		districtSlug: string,
	) => Promise<string | null>;
};

export type PublicRouteSearchParams = Record<
	string,
	string | readonly string[] | undefined
>;

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

function robotsFromRegistry(
	entry: SeoRegistryEntry,
	evidence?: ListingContentGateEvidence | null,
): PublicRobots {
	const [indexing, following] = effectiveListingRobots(
		entry,
		siteProfile,
		evidence,
	).split(",");
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
	const landUse =
		key.kind === "categoryGeoFacet" && key.category === "uchastki"
			? ({ izhs: "izhs", snt: "snt" } as const)[key.facet as LandFacetSlug]
			: undefined;
	return {
		category,
		geoSlug: key.kind === "categoryRoot" ? undefined : key.geo,
		districtSlug: key.kind === "categoryGeoDistrict" ? key.district : undefined,
		rooms,
		landUse,
	};
}

async function resolveRegistryPage(
	key: Exclude<PageKey, { kind: "property" }>,
	dependencies: PublicRouteDependencies,
) {
	const canonicalPath = buildProjectUrl(key);
	const contract = seoRegistryByCanonicalPath.get(canonicalPath);
	if (!contract) return { kind: "notFound", statusCode: 404 } as const;
	const evidence = await dependencies.loadListingContentGateEvidence?.(
		contract.registryId,
	);
	const parentSlug =
		key.kind === "categoryGeoDistrict"
			? await dependencies.loadDistrictParentSlug?.(key.geo, key.district)
			: undefined;
	const parentContract =
		key.kind === "categoryGeoDistrict" && parentSlug
			? seoRegistryByCanonicalPath.get(
					buildProjectUrl({
						kind: "categoryGeoDistrict",
						geo: key.geo,
						category: key.category,
						district: parentSlug,
					}),
				)
			: undefined;
	return page(key, {
		title: contract.title,
		description: contract.description,
		h1: contract.h1,
		robots: robotsFromRegistry(contract, evidence),
		catalogQuery: catalogQueryFor(key),
		breadcrumbs: buildPageBreadcrumbs(key, contract.h1, {
			districtParent: parentContract
				? { label: parentContract.h1, href: parentContract.url }
				: undefined,
		}),
	});
}

const apartmentRoomFacetByRoom = {
	1: "odnokomnatnye",
	2: "dvuhkomnatnye",
	3: "trehkomnatnye",
} as const;

function normalizedRoomValues(
	value: PublicRouteSearchParams["rooms"],
): number[] {
	const values = Array.isArray(value) ? value : value ? [value] : [];
	return [
		...new Set(
			values
				.map((item) => Number(item))
				.filter((item) => Number.isInteger(item) && item > 0),
		),
	].sort((left, right) => left - right);
}

async function applyApartmentRoomQuery(
	result: ResolvedPublicRoute,
	key: Extract<PageKey, { kind: "categoryGeo" }>,
	searchParams: PublicRouteSearchParams,
	dependencies: PublicRouteDependencies,
): Promise<ResolvedPublicRoute> {
	if (
		result.kind !== "page" ||
		key.geo !== siteProfile.primaryGeo ||
		key.category !== "kvartiry" ||
		!Object.values(searchParams).some((value) =>
			Array.isArray(value) ? value.length > 0 : Boolean(value),
		)
	) {
		return result;
	}

	const rooms = normalizedRoomValues(searchParams.rooms);
	const approvedRoom = rooms.length === 1 ? rooms[0] : undefined;
	const facet = approvedRoom
		? apartmentRoomFacetByRoom[
				approvedRoom as keyof typeof apartmentRoomFacetByRoom
			]
		: undefined;
	const facetKey = facet
		? ({
				kind: "categoryGeoFacet",
				geo: key.geo,
				category: key.category,
				facet,
			} as const)
		: undefined;
	const facetContract = facetKey
		? seoRegistryByCanonicalPath.get(buildProjectUrl(facetKey))
		: undefined;
	const evidence = facetContract
		? await dependencies.loadListingContentGateEvidence?.(
				facetContract.registryId,
			)
		: undefined;
	const categoryGeoPath = buildProjectUrl(key);
	const canonicalPath = facetContract
		? resolveListingQueryCanonical({
				entry: facetContract,
				categoryGeoPath,
				profile: siteProfile,
				evidence,
			})
		: categoryGeoPath;

	return {
		...result,
		canonicalPath,
		robots: { indexing: "noindex", following: "follow" },
		catalogQuery: {
			...result.catalogQuery,
			...(rooms.length ? { rooms } : {}),
		},
		internalLinks:
			facetContract && canonicalPath === facetContract.url
				? [
						...result.internalLinks,
						{ href: facetContract.url, label: facetContract.h1 },
					]
				: result.internalLinks,
	};
}

function singleSearchParamValue(
	value: PublicRouteSearchParams[string],
): string | undefined {
	if (typeof value === "string") return value;
	return value?.length === 1 ? value[0] : undefined;
}

function applyHouseTypeQuery(
	result: ResolvedPublicRoute,
	key: Extract<PageKey, { kind: "categoryRoot" | "categoryGeo" }>,
	searchParams: PublicRouteSearchParams,
): ResolvedPublicRoute {
	if (
		result.kind !== "page" ||
		key.category !== "doma" ||
		(key.kind === "categoryGeo" && key.geo !== siteProfile.primaryGeo) ||
		!Object.values(searchParams).some((value) =>
			Array.isArray(value) ? value.length > 0 : Boolean(value),
		)
	) {
		return result;
	}

	const rawHouseType = singleSearchParamValue(searchParams.houseType);
	const houseType =
		rawHouseType && isHouseType(rawHouseType) ? rawHouseType : undefined;

	return {
		...result,
		robots: { indexing: "noindex", following: "follow" },
		catalogQuery: {
			...result.catalogQuery,
			...(houseType ? { houseType } : {}),
		},
	};
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
	searchParams: PublicRouteSearchParams = {},
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
	if (key.kind !== "property") {
		const result = await resolveRegistryPage(key, dependencies);
		if (key.kind === "categoryGeo") {
			const apartmentResult = await applyApartmentRoomQuery(
				result,
				key,
				searchParams,
				dependencies,
			);
			return applyHouseTypeQuery(apartmentResult, key, searchParams);
		}
		return key.kind === "categoryRoot"
			? applyHouseTypeQuery(result, key, searchParams)
			: result;
	}

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
