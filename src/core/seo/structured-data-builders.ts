import type {
	HomePageDTO,
	MarketingPageDTO,
	PropertyCategory,
	PropertyDetailsDTO,
	PropertyListDTO,
	PublicNapDTO,
} from "@ams/realtbase-contracts";
import { projectUrls } from "../../project/url-grammar.ts";
import { buildRealEstateAgentJsonLd } from "./real-estate-agent.ts";
import { absoluteUrl, siteBrandName } from "./site.ts";

export type JsonLd = Record<string, unknown>;

const propertySchemaTypes: Readonly<
	Record<
		PropertyCategory,
		{ type: "Apartment" | "House" | "Place"; label: string }
	>
> = {
	apartment: { type: "Apartment", label: "Квартира" },
	house: { type: "House", label: "Дом" },
	land: { type: "Place", label: "Земельный участок" },
	commercial: { type: "Place", label: "Коммерческая недвижимость" },
	garage: { type: "Place", label: "Гараж" },
	room: { type: "Place", label: "Комната" },
	other: { type: "Place", label: "Недвижимость" },
};

export const buildOrganizationJsonLd = buildRealEstateAgentJsonLd;

export function buildWebsiteJsonLd(home: HomePageDTO): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: siteBrandName,
		url: absoluteUrl(projectUrls.home),
		description: home.seo.description,
	};
}

export function buildCatalogItemListJsonLd(list: PropertyListDTO): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		itemListElement: list.items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			url: absoluteUrl(item.href),
			name: item.title,
		})),
	};
}

function areaInSquareMeters(property: PropertyDetailsDTO) {
	const visibleArea = property.summary.find(
		(item) => item.key === "area",
	)?.value;
	if (!visibleArea) return undefined;
	const value = Number.parseFloat(visibleArea.replace(",", "."));
	return Number.isFinite(value) && value > 0 ? value : undefined;
}

export function buildPropertyJsonLd(property: PropertyDetailsDTO): JsonLd {
	const schemaType = propertySchemaTypes[property.category];
	const itemOffered: JsonLd = {
		"@type": schemaType.type,
		additionalType: schemaType.label,
		name: property.title,
		address: {
			"@type": "PostalAddress",
			streetAddress: property.address,
			addressLocality: property.city,
		},
	};
	const area = areaInSquareMeters(property);
	if (area !== undefined && property.category !== "land") {
		itemOffered.floorSize = {
			"@type": "QuantitativeValue",
			value: area,
			unitCode: "MTK",
		};
	}
	if (property.location) {
		itemOffered.geo = {
			"@type": "GeoCoordinates",
			latitude: property.location.latitude,
			longitude: property.location.longitude,
		};
	}

	const offer: JsonLd = {
		"@context": "https://schema.org",
		"@type": "Offer",
		url: absoluteUrl(property.href),
		name: property.title,
		description: property.description,
		itemOffered,
	};
	if (property.price) {
		offer.price = property.price.priceMinor / 100;
		offer.priceCurrency = property.price.currency;
	}
	return offer;
}

export function buildLawyerServiceJsonLd(
	page: MarketingPageDTO,
	nap: PublicNapDTO,
): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "Service",
		name: page.title,
		description: page.lead,
		url: absoluteUrl(page.seo.canonicalPath),
		serviceType: page.sections.map((section) => section.title),
		provider: {
			"@type": "RealEstateAgent",
			name: nap.brandName,
			legalName: nap.legalName,
			url: nap.url,
			telephone: nap.phone.e164,
			email: nap.email,
		},
	};
}

export function buildBreadcrumbJsonLd(
	items: readonly { name: string; path: string }[],
): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: absoluteUrl(item.path),
		})),
	};
}
