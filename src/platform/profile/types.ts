export const profileStatuses = [
	"ACTIVE",
	"PREPARED_OFF",
	"NOINDEX_AUTO",
] as const;

export type ProfileStatus = (typeof profileStatuses)[number];
export type GeoMode = "SINGLE_GEO" | "MULTI_GEO";

export type SiteProfile<
	Category extends string = string,
	Market extends string = string,
> = {
	geoMode: GeoMode;
	primaryGeo: string;
	marketStatus: Record<Market, ProfileStatus>;
	categoryStatus: Record<Category, ProfileStatus>;
	geoCategoryStatus: Record<string, Partial<Record<Category, ProfileStatus>>>;
	nearbyGeoAliases?: Partial<Record<string, readonly string[]>>;
	nearbyGeoRouteAllowlist?: Partial<
		Record<string, readonly ("hub" | Category)[]>
	>;
	defaultNearbyGeoStatus: ProfileStatus;
	tiers: Record<string, { minBroad: number }>;
	inventoryThreshold: Record<string, number>;
	facetWhitelist: Partial<Record<Category, readonly string[]>>;
};

export type ProfileCategoryCandidate<Category extends string = string> = {
	category: Category;
	geo: string;
	href: string;
	label: string;
};
