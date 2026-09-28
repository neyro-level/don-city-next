import type { SeoRegistryEntry } from "@/platform/seo/registry";
import type { CatalogQueryInput } from "./catalog";

export function buildListingCatalogQuery(
	entry: SeoRegistryEntry,
): CatalogQueryInput | null {
	const category =
		entry.category === "apartment" ||
		entry.category === "house" ||
		entry.category === "land" ||
		entry.category === "commercial"
			? entry.category
			: undefined;
	if (!category || !entry.geoSlug) return null;
	const query: CatalogQueryInput = {
		category,
		geoSlug: entry.geoSlug,
		...(entry.districtSlug ? { districtSlug: entry.districtSlug } : {}),
	};
	if (entry.facetSlug === "odnokomnatnye") query.rooms = [1];
	if (entry.facetSlug === "dvuhkomnatnye") query.rooms = [2];
	if (entry.facetSlug === "trehkomnatnye") query.rooms = [3];
	if (entry.facetSlug === "dachi") query.houseType = "dacha";
	if (entry.facetSlug === "izhs" || entry.facetSlug === "snt") {
		query.landUse = entry.facetSlug;
	}
	return query;
}
