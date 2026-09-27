import "server-only";

import type {
	HomePageDTO,
	MarketingPageDTO,
	PropertyCardDTO,
	PropertyDetailsDTO,
	PropertyFilterDTO,
	PropertyListDTO,
	PublicNapDTO,
	SiteFooterDTO,
	SiteHeaderDTO,
} from "@ams/realtbase-contracts";
import {
	buildProjectLegalLinks,
	leadConsentContext,
} from "../../../project/legal.config.ts";
import {
	buildGeoSwitcher,
	buildHomeCatalogLinks,
	buildR1Navigation,
} from "../../../project/navigation.ts";
import { seoRegistryById } from "../../../project/seo-registry.generated.ts";
import { siteConfig } from "../../../project/site.config.ts";
import {
	buildNapContactLinks,
	buildNapPhoneLink,
	toPublicNapDTO,
} from "../../../project/site-settings.ts";
import { buildPropertyUrl, projectUrls } from "../../../project/url-grammar.ts";
import type {
	PublicCatalogFacetsResult,
	PublicCatalogProperty,
	PublicCatalogResult,
} from "./catalog";
import type { PublicPageRecord } from "./pages";

const brandName = siteConfig.brandName;
function requireHomeRegistry() {
	const entry = seoRegistryById.get("HOME");
	if (!entry) {
		throw new Error(
			"HOME SEO registry entry is required for the public homepage.",
		);
	}
	return entry;
}

const homeRegistry = requireHomeRegistry();
const homeSeo = {
	title: homeRegistry.title,
	description: homeRegistry.description,
	canonicalPath: homeRegistry.url,
	indexing: "index",
	following: "follow",
} as const;
const logo = {
	kind: "managed" as const,
	src: "/brand/don-city-mark-ui.webp",
	alt: `Знак ${brandName}`,
	width: 88,
	height: 88,
};
const footerLogo = {
	kind: "managed" as const,
	src: "/brand/don-city-logo-footer.webp",
	alt: `${brandName} — агентство недвижимости`,
	width: 320,
	height: 400,
};

function rub(priceMinor: number) {
	return new Intl.NumberFormat(siteConfig.locale, {
		style: "currency",
		currency: siteConfig.currency,
		maximumFractionDigits: 0,
	}).format(priceMinor / 100);
}

function compact<T>(items: (T | null | undefined | false)[]): T[] {
	return items.filter(Boolean) as T[];
}

export type PublicPropertyLifecycle = {
	status: "active" | "archived";
	isArchived: boolean;
};

export type PublicPropertyDetailsDTO = PropertyDetailsDTO & {
	lifecycle: PublicPropertyLifecycle;
};

export function toPropertyCardDTO(
	property: PublicCatalogProperty,
): PropertyCardDTO {
	const address =
		property.publicAddress ||
		[property.locality, property.district].filter(Boolean).join(", ") ||
		"Адрес уточняется";

	return {
		id: String(property.id),
		slug: property.slug,
		href: buildPropertyUrl({
			category: property.category,
			semantic: property.slug,
			publicUrlId: property.publicUrlId,
		}),
		title: property.title,
		category: property.category,
		dealType: property.dealType,
		price: property.priceMinor
			? {
					priceMinor: property.priceMinor,
					pricePerMeterMinor: property.pricePerMeterMinor ?? undefined,
					currency: property.currency ?? siteConfig.currency,
					period: property.dealType === "rent" ? "month" : "total",
					label: rub(property.priceMinor),
				}
			: null,
		address,
		city: property.locality || "Город не указан",
		district: property.district ?? undefined,
		geo: property.geo,
		primaryMedia: (() => {
			const image = property.images?.find((candidate) => candidate.url);
			return image?.url
				? {
						kind: image.kind,
						src: image.url,
						alt: image.alt || property.title,
						...(image.variants ? { variants: image.variants } : {}),
					}
				: null;
		})(),
		summary: compact([
			property.rooms
				? {
						key: "rooms" as const,
						label: "Комнаты",
						value: String(property.rooms),
					}
				: null,
			property.totalArea
				? {
						key: "area" as const,
						label: "Площадь",
						value: `${property.totalArea} м²`,
					}
				: null,
			property.floor
				? {
						key: "floor" as const,
						label: "Этаж",
						value: property.floors
							? `${property.floor} из ${property.floors}`
							: String(property.floor),
					}
				: null,
		]),
		badges: [],
	};
}

export function toPropertyDetailsDTO(
	property: PublicCatalogProperty,
	related: readonly PublicCatalogProperty[],
): PublicPropertyDetailsDTO {
	const card = toPropertyCardDTO(property);

	return {
		...card,
		description: property.description || "Описание объекта уточняется.",
		lifecycle: {
			status: property.status,
			isArchived: property.status === "archived",
		},
		gallery:
			property.images
				?.filter((image) => image.url)
				.map((image) => ({
					kind: image.kind,
					src: image.url ?? "",
					alt: image.alt || property.title,
					...(image.variants ? { variants: image.variants } : {}),
				})) ?? [],
		characteristics: compact([
			property.totalArea
				? { label: "Общая площадь", value: `${property.totalArea} м²` }
				: null,
			property.livingArea
				? { label: "Жилая площадь", value: `${property.livingArea} м²` }
				: null,
			property.kitchenArea
				? { label: "Кухня", value: `${property.kitchenArea} м²` }
				: null,
			property.rooms
				? { label: "Комнаты", value: String(property.rooms) }
				: null,
			property.floor
				? {
						label: "Этаж",
						value: property.floors
							? `${property.floor} из ${property.floors}`
							: String(property.floor),
					}
				: null,
		]),
		location:
			typeof property.lat === "number" && typeof property.lng === "number"
				? { latitude: property.lat, longitude: property.lng }
				: undefined,
		related: related.map(toPropertyCardDTO),
	};
}

export function toPropertyListDTO(
	result: PublicCatalogResult,
): PropertyListDTO {
	return {
		items: result.items.map(toPropertyCardDTO),
		total: result.total,
		page: result.page,
		pageSize: result.pageSize,
		totalPages: result.totalPages,
		appliedFilters: result.applied,
	};
}

const categoryLabels = {
	apartment: "Квартиры",
	house: "Дома",
	land: "Участки",
	commercial: "Коммерческая",
} as const;

const dealTypeLabels = {
	sale: "Продажа",
	rent: "Аренда",
} as const;

const houseTypeLabels = {
	house: "Дом",
	cottage: "Коттедж",
	townhouse: "Таунхаус",
	dacha: "Дача",
	part_of_house: "Часть дома",
} as const;

export function toPropertyFilterDTO(
	result: PublicCatalogResult,
	facets?: PublicCatalogFacetsResult,
): PropertyFilterDTO {
	const rooms = facets
		? [...facets.rooms.map((bucket) => bucket.value)].sort((a, b) => a - b)
		: [
				...new Set(
					result.items
						.map((item) => item.rooms)
						.filter((room): room is number => Boolean(room)),
				),
			].sort((a, b) => a - b);
	const categories = facets
		? facets.categories.map((bucket) => bucket.value)
		: [...new Set(result.items.map((item) => item.category))];
	const dealTypes = facets
		? facets.dealTypes.map((bucket) => bucket.value)
		: [...new Set(result.items.map((item) => item.dealType))];
	const cities = facets
		? facets.cities.map((bucket) => bucket.value)
		: [
				...new Set(
					result.items
						.map((item) => item.locality)
						.filter((city): city is string => Boolean(city)),
				),
			];
	const districts = facets
		? facets.districts.map((bucket) => bucket.value)
		: [
				...new Set(
					result.items
						.map((item) => item.district)
						.filter((district): district is string => Boolean(district)),
				),
			];
	const priceMinor = facets
		? facets.priceMinor
		: {
				min: (() => {
					const prices = result.items
						.map((item) => item.priceMinor)
						.filter((price): price is number => Boolean(price));
					return prices.length ? Math.min(...prices) : null;
				})(),
				max: (() => {
					const prices = result.items
						.map((item) => item.priceMinor)
						.filter((price): price is number => Boolean(price));
					return prices.length ? Math.max(...prices) : null;
				})(),
			};

	return {
		categories: categories.flatMap((category) => {
			const label = categoryLabels[category as keyof typeof categoryLabels];
			return label
				? [{ value: category as keyof typeof categoryLabels, label }]
				: [];
		}),
		dealTypes: dealTypes.flatMap((dealType) => {
			const label = dealTypeLabels[dealType as keyof typeof dealTypeLabels];
			return label
				? [{ value: dealType as keyof typeof dealTypeLabels, label }]
				: [];
		}),
		cities: cities.map((city) => ({ value: city, label: city })),
		districts: districts.map((district) => ({
			value: district,
			label: district,
		})),
		rooms,
		priceMinor,
		buildingTypes:
			facets?.houseTypes.map((bucket) => ({
				value: bucket.value,
				label: houseTypeLabels[bucket.value],
			})) ?? [],
		renovations: [],
		landUseTypes: [],
		commercialTypes: [],
		commercialBuildingTypes: [],
		entranceTypes: [],
		applied: result.applied,
		total: result.total,
		resultLabel: `${result.total} ${result.total === 1 ? "объект" : "объектов"}`,
	};
}

export function toShellDTO(
	_pages: readonly PublicPageRecord[],
	nap: PublicNapDTO = toPublicNapDTO(),
) {
	const links = buildR1Navigation();
	const propertyLinks = links[0]?.children ?? [];

	const header: SiteHeaderDTO = {
		brandName,
		homeHref: projectUrls.home,
		logo,
		navigation: links,
		geoSwitcher: buildGeoSwitcher(),
		phone: buildNapPhoneLink(nap),
		primaryAction: {
			label: "Подобрать объект",
			href: projectUrls.primaryCatalog,
		},
	};

	const footer: SiteFooterDTO = {
		brandName,
		logo: footerLogo,
		groups: [
			{ title: "Недвижимость", links: propertyLinks },
			{ title: "Разделы", links: links.slice(1) },
		],
		contacts: buildNapContactLinks(nap, projectUrls.contacts),
		legalLinks: buildProjectLegalLinks(),
		copyright: `© ${brandName}`,
	};

	return { header, footer } as const;
}

export function toHomePageDTO(_page: PublicPageRecord | null): HomePageDTO {
	return {
		slug: "home",
		eyebrow: "Недвижимость без лишней неопределённости",
		title: homeRegistry.h1,
		lead: homeRegistry.description,
		seo: homeSeo,
		breadcrumbs: { items: [{ label: "Главная" }] },
		sections: [
			{
				title: "Понятный процесс",
				text: "Сначала фиксируем задачу, затем сравниваем подходящие предложения.",
				items: [
					"Уточняем задачу и бюджет",
					"Проверяем документы",
					"Сопровождаем сделку",
				],
			},
		],
		leadContext: {
			formKind: "general",
			sourcePage: projectUrls.home,
			...leadConsentContext(),
		},
		primaryAction: {
			label: "Смотреть объекты",
			href: projectUrls.primaryCatalog,
		},
		featuredPropertyId: "",
		serviceLinks: [
			...buildHomeCatalogLinks().map((link) => ({
				...link,
				description: "Актуальные объекты и подбор по критериям",
			})),
			{
				label: "Продать",
				href: projectUrls.sale,
				description: "Оценка и сопровождение продажи",
			},
			{
				label: "Юрист",
				href: projectUrls.lawyer,
				description: "Проверка документов и сопровождение сделки",
			},
		],
	};
}

export function toMarketingPageDTO(page: PublicPageRecord): MarketingPageDTO {
	return {
		slug: page.slug,
		eyebrow: "Страница",
		title: page.title,
		lead: page.seo.description,
		seo: page.seo,
		breadcrumbs: {
			items: [
				{ label: "Главная", href: projectUrls.home },
				{ label: page.title },
			],
		},
		sections: [],
		leadContext: {
			formKind: "general",
			sourcePage: page.seo.canonicalPath,
			...leadConsentContext(),
		},
	};
}
