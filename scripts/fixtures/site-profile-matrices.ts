import type { SiteProfile } from "../../src/platform/profile/types.ts";
import type { SeoRegistryEntry } from "../../src/platform/seo/registry.ts";

type Category = "kvartiry";
type Market = "secondary";

function registryEntry(input: {
	registryId: string;
	pageType: "static" | "geo_all" | "category_geo";
	geoSlug?: string;
	url: `/${string}`;
}): SeoRegistryEntry {
	return {
		registryId: input.registryId,
		pageType: input.pageType,
		category: input.pageType === "category_geo" ? "apartment" : "",
		geoSlug: input.geoSlug ?? "",
		districtSlug: "",
		facetSlug: "",
		url: input.url,
		title: input.registryId,
		description: `${input.registryId} fixture description`,
		h1: input.registryId,
		robots: "index,follow",
		tier: "",
		broad: "",
		source: "rp12_fixture",
		minActiveObjects: "0",
		contentGateRequired: "false",
		status: "active",
	};
}

const commonProfile = {
	primaryGeo: "donetsk",
	marketStatus: { secondary: "ACTIVE" },
	categoryStatus: { kvartiry: "ACTIVE" },
	nearbyGeoAliases: { makeevka: ["Макеевка"] },
	defaultNearbyGeoStatus: "NOINDEX_AUTO",
	tiers: { P1: { minBroad: 100 } },
	inventoryThreshold: { P1: 5 },
	facetWhitelist: { kvartiry: [] },
} as const;

const commonRegistry = [
	registryEntry({ registryId: "HOME", pageType: "static", url: "/" }),
	registryEntry({
		registryId: "DONETSK_ALL",
		pageType: "geo_all",
		geoSlug: "donetsk",
		url: "/donetsk/",
	}),
	registryEntry({
		registryId: "DONETSK_APARTMENTS",
		pageType: "category_geo",
		geoSlug: "donetsk",
		url: "/donetsk/kvartiry/",
	}),
] as const;

export const siteProfileMatrices = [
	{
		id: "donetsk-single",
		profile: {
			...commonProfile,
			geoMode: "SINGLE_GEO",
			geoCategoryStatus: {
				donetsk: { kvartiry: "ACTIVE" },
				makeevka: {},
			},
		} satisfies SiteProfile<Category, Market>,
		registry: commonRegistry,
		expectedMenuPaths: ["/donetsk/kvartiry/"],
		expectedSitemapPaths: ["/", "/donetsk/", "/donetsk/kvartiry/"],
	},
	{
		id: "multi-geo",
		profile: {
			...commonProfile,
			geoMode: "MULTI_GEO",
			geoCategoryStatus: {
				donetsk: { kvartiry: "ACTIVE" },
				makeevka: { kvartiry: "ACTIVE" },
			},
		} satisfies SiteProfile<Category, Market>,
		registry: [
			...commonRegistry,
			registryEntry({
				registryId: "MAKEEVKA_ALL",
				pageType: "geo_all",
				geoSlug: "makeevka",
				url: "/makeevka/",
			}),
			registryEntry({
				registryId: "MAKEEVKA_APARTMENTS",
				pageType: "category_geo",
				geoSlug: "makeevka",
				url: "/makeevka/kvartiry/",
			}),
		],
		expectedMenuPaths: ["/donetsk/kvartiry/", "/makeevka/kvartiry/"],
		expectedSitemapPaths: [
			"/",
			"/donetsk/",
			"/donetsk/kvartiry/",
			"/makeevka/",
			"/makeevka/kvartiry/",
		],
	},
] as const;
