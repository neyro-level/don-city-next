import type {
	BreadcrumbItemDTO,
	PropertyDetailsDTO,
	SiteNavItemDTO,
} from "@ams/realtbase-contracts";
import type { PageKey } from "../platform/grammar/types.ts";
import type { SeoRegistryEntry } from "../platform/seo/registry.ts";
import { isListingSitemapEligible } from "../platform/seo/content-gate.ts";
import { seoRegistry } from "./seo-registry.generated.ts";
import { type SiteCategory, siteProfile } from "./site.profile.ts";
import {
	buildProjectUrl,
	projectUrls,
	propertyCategoryToSlug,
} from "./url-grammar.ts";

export type InternalLink = { label: string; href: string };

const categoryLabels: Record<SiteCategory, string> = {
	kvartiry: "Квартиры",
	doma: "Дома",
	uchastki: "Земельные участки",
	kommercheskaya: "Коммерческая недвижимость",
	komnaty: "Комнаты",
	garazhi: "Гаражи",
	novostroyki: "Новостройки",
	arenda: "Аренда",
};

const districtSlugs: Record<string, string> = {
	буденновский: "budennovskiy",
	будённовский: "budennovskiy",
	ворошиловский: "voroshilovskiy",
	калининский: "kalininskiy",
	киевский: "kievskiy",
	кировский: "kirovskiy",
	куйбышевский: "kuybyshevskiy",
	ленинский: "leninskiy",
	петровский: "petrovskiy",
	пролетарский: "proletarskiy",
	текстильщик: "tekstilshchik",
};

function activePrimaryCategories(): SiteCategory[] {
	const status = (siteProfile.geoCategoryStatus[siteProfile.primaryGeo] ??
		{}) as Partial<Record<SiteCategory, string>>;
	return (Object.keys(siteProfile.categoryStatus) as SiteCategory[]).filter(
		(category) =>
			siteProfile.categoryStatus[category] === "ACTIVE" &&
			status[category] === "ACTIVE",
	);
}

function categoryLink(geo: string, category: SiteCategory): InternalLink {
	return {
		label: categoryLabels[category],
		href: buildProjectUrl({ kind: "categoryGeo", geo, category }),
	};
}

function registryLink(url: string): InternalLink | null {
	const entry = seoRegistry.find((candidate) => candidate.url === url);
	if (!entry) return null;
	if (
		(entry.pageType === "district" || entry.pageType === "facet") &&
		!isListingSitemapEligible(entry, siteProfile)
	) {
		return null;
	}
	return { href: entry.url, label: entry.h1 };
}

function gatePassedTopLinks(
	geo: string,
	category?: SiteCategory,
): InternalLink[] {
	return (seoRegistry as readonly SeoRegistryEntry[])
		.filter(
			(entry) =>
				entry.geoSlug === geo &&
				(!category || entry.category === propertyCategoryFor(category)) &&
				(entry.pageType === "district" || entry.pageType === "facet") &&
				isListingSitemapEligible(entry, siteProfile),
		)
		.map((entry) => ({ href: entry.url, label: entry.h1 }));
}

function propertyCategoryFor(category: SiteCategory): string {
	return {
		kvartiry: "apartment",
		doma: "house",
		uchastki: "land",
		kommercheskaya: "commercial",
		komnaty: "room",
		garazhi: "garage",
		novostroyki: "",
		arenda: "",
	}[category];
}

export function buildR1Navigation(): readonly SiteNavItemDTO[] {
	const categories = activePrimaryCategories().map((category) =>
		categoryLink(siteProfile.primaryGeo, category),
	);
	return [
		{
			label: "Недвижимость",
			href: buildProjectUrl({ kind: "geoHub", geo: siteProfile.primaryGeo }),
			children: [
				{
					label: "Вся недвижимость",
					href: buildProjectUrl({
						kind: "geoHub",
						geo: siteProfile.primaryGeo,
					}),
				},
				...categories,
			],
		},
		{ label: "Продать", href: projectUrls.sale },
		{ label: "Юрист", href: projectUrls.lawyer },
		{ label: "О компании", href: projectUrls.about },
		{ label: "Контакты", href: projectUrls.contacts },
	];
}

export function buildGeoSwitcher(): readonly SiteNavItemDTO[] {
	if (siteProfile.geoMode === "SINGLE_GEO") return [];
	return Object.keys(siteProfile.geoCategoryStatus).map((geo) => ({
		label: geo,
		href: buildProjectUrl({ kind: "geoHub", geo }),
	}));
}

export function buildHomeCatalogLinks(): InternalLink[] {
	return [
		{
			label: "Вся недвижимость",
			href: buildProjectUrl({ kind: "geoHub", geo: siteProfile.primaryGeo }),
		},
		...activePrimaryCategories().map((category) =>
			categoryLink(siteProfile.primaryGeo, category),
		),
	];
}

export function buildPageBreadcrumbs(
	key: PageKey,
	currentLabel: string,
): BreadcrumbItemDTO[] {
	if (key.kind === "home") return [{ label: "Главная" }];
	const home = { label: "Главная", href: projectUrls.home };
	if (key.kind === "static") return [home, { label: currentLabel }];
	if (key.kind === "categoryRoot") return [home, { label: currentLabel }];
	if (key.kind === "property") return [home, { label: currentLabel }];
	const hub = {
		label:
			key.geo === siteProfile.primaryGeo
				? "Недвижимость в Донецке"
				: `Недвижимость: ${key.geo}`,
		href: buildProjectUrl({ kind: "geoHub", geo: key.geo }),
	};
	if (key.kind === "geoHub") return [home, { label: currentLabel }];
	const category = categoryLink(key.geo, key.category as SiteCategory);
	if (key.kind === "categoryGeo") {
		return [home, hub, { label: currentLabel }];
	}
	return [home, hub, category, { label: currentLabel }];
}

export function buildCatalogLinks(key: PageKey): InternalLink[] {
	if (key.kind === "home") return buildHomeCatalogLinks();
	if (key.kind === "geoHub") {
		return [
			...activePrimaryCategories().map((category) =>
				categoryLink(key.geo, category),
			),
			...gatePassedTopLinks(key.geo),
		];
	}
	if (
		key.kind === "categoryGeo" ||
		key.kind === "categoryGeoDistrict" ||
		key.kind === "categoryGeoFacet"
	) {
		return gatePassedTopLinks(key.geo, key.category as SiteCategory);
	}
	return [];
}

function districtLink(
	property: PropertyDetailsDTO,
	geo: string,
	category: SiteCategory,
): InternalLink | null {
	if (!property.district) return null;
	const normalized = property.district
		.toLocaleLowerCase("ru")
		.replace(/\s+район$/u, "")
		.trim();
	const district = districtSlugs[normalized];
	if (!district) return null;
	return registryLink(
		buildProjectUrl({ kind: "categoryGeoDistrict", geo, category, district }),
	);
}

export function buildPropertyNavigation(
	property: PropertyDetailsDTO,
	nearbyLinks: readonly InternalLink[] = [],
): { breadcrumbs: BreadcrumbItemDTO[]; links: InternalLink[] } {
	if (property.category === "other") {
		throw new Error("Property category 'other' has no navigation owner.");
	}
	const category = propertyCategoryToSlug(property.category);
	const geo = nearbyLinks[0]
		? new URL(nearbyLinks[0].href, "https://example.invalid").pathname
				.split("/")
				.filter(Boolean)[0]
		: siteProfile.primaryGeo;
	const baseLinks = nearbyLinks.length
		? [...nearbyLinks]
		: [
				{
					label: "Недвижимость в Донецке",
					href: buildProjectUrl({ kind: "geoHub", geo }),
				},
				categoryLink(geo, category),
			];
	const district = districtLink(property, geo, category);
	const context = [
		...baseLinks,
		...(district ? [district] : []),
		{ label: "Юридическая проверка объекта", href: projectUrls.lawyer },
	];
	return {
		breadcrumbs: [
			{ label: "Главная", href: projectUrls.home },
			...context.slice(0, district ? -1 : 2),
			{ label: property.title },
		],
		links: context,
	};
}
