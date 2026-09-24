export type HomePageKey = { kind: "home" };
export type GeoHubPageKey = { kind: "geoHub"; geo: string };
export type CategoryRootPageKey = { kind: "categoryRoot"; category: string };
export type CategoryGeoPageKey = {
	kind: "categoryGeo";
	geo: string;
	category: string;
};
export type CategoryGeoDistrictPageKey = {
	kind: "categoryGeoDistrict";
	geo: string;
	category: string;
	district: string;
};
export type CategoryGeoFacetPageKey = {
	kind: "categoryGeoFacet";
	geo: string;
	category: string;
	facet: string;
};
export type PropertyPageKey = {
	kind: "property";
	category: string;
	semantic: string;
	publicUrlId: string;
};
export type StaticPageKey = { kind: "static"; slug: string };

export type PageKey =
	| HomePageKey
	| GeoHubPageKey
	| CategoryRootPageKey
	| CategoryGeoPageKey
	| CategoryGeoDistrictPageKey
	| CategoryGeoFacetPageKey
	| PropertyPageKey
	| StaticPageKey;

export type UrlGrammarRegistry = {
	categorySlugs: readonly string[];
	geoSlugs: readonly string[];
	staticSlugs: readonly string[];
	districts: readonly { geo: string; slug: string }[];
	facets: readonly { category: string; slug: string }[];
};

export type CanonicalPath = "/" | `/${string}/`;
