export const landFacetSlugs = ["izhs", "snt"] as const;

export type LandFacetSlug = (typeof landFacetSlugs)[number];

export function permittedUseForLandFacet(facet: LandFacetSlug): string {
	return facet === "izhs" ? "ижс" : "снт";
}
