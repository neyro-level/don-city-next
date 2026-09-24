import type { SiteProfile } from "../platform/profile/types.ts";

export type SiteCategory =
	| "kvartiry"
	| "doma"
	| "uchastki"
	| "kommercheskaya"
	| "komnaty"
	| "garazhi"
	| "novostroyki"
	| "arenda";
export type SiteMarket = "secondary" | "newbuild";

export const siteProfile = {
	geoMode: "SINGLE_GEO",
	primaryGeo: "donetsk",
	marketStatus: { secondary: "ACTIVE", newbuild: "PREPARED_OFF" },
	categoryStatus: {
		kvartiry: "ACTIVE",
		doma: "ACTIVE",
		uchastki: "ACTIVE",
		kommercheskaya: "PREPARED_OFF",
		komnaty: "PREPARED_OFF",
		garazhi: "PREPARED_OFF",
		novostroyki: "PREPARED_OFF",
		arenda: "PREPARED_OFF",
	},
	geoCategoryStatus: {
		donetsk: { kvartiry: "ACTIVE", doma: "ACTIVE", uchastki: "ACTIVE" },
	},
	defaultNearbyGeoStatus: "NOINDEX_AUTO",
	tiers: { P1: { minBroad: 100 }, P2: { minBroad: 50 } },
	inventoryThreshold: { P1: 5, P2: 5, TEST: 10 },
	facetWhitelist: {
		kvartiry: ["odnokomnatnye", "dvuhkomnatnye", "trehkomnatnye"],
		doma: ["dachi"],
		uchastki: ["izhs", "snt"],
	},
} as const satisfies SiteProfile<SiteCategory, SiteMarket>;
