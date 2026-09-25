import type { PublicPageIdentityDTO } from "@ams/realtbase-contracts";
import type { CatalogQueryInput } from "../data-access/public/catalog.ts";
import { publicCacheTags } from "../../project/cache-tags.ts";

export const publicDataRevalidateSeconds = 3600;

export type PublicCatalogCacheDescriptor = {
	keyParts: string[];
	tags: string[];
};

export function describePublicCatalogCache(input: {
	identity: PublicPageIdentityDTO;
	query: CatalogQueryInput;
}): PublicCatalogCacheDescriptor {
	const query = input.query;
	const geoSlug = query.geoSlug ?? input.identity.geoSlug;
	const category = query.category ?? input.identity.category;
	const tags = new Set<string>([publicCacheTags.properties]);

	if (geoSlug) tags.add(publicCacheTags.geo(geoSlug));
	if (geoSlug && category) {
		tags.add(publicCacheTags.category(geoSlug, category));
	}
	if (geoSlug && query.districtSlug) {
		tags.add(publicCacheTags.district(geoSlug, query.districtSlug));
	}

	return {
		keyParts: [
			"public-catalog",
			JSON.stringify({
				identity: input.identity,
				query: {
					page: query.page ?? 1,
					limit: query.limit ?? 24,
					sort: query.sort ?? "recommended",
					view: query.view ?? "grid",
					query: query.query,
					category: query.category,
					dealType: query.dealType,
					geoSlug: query.geoSlug,
					districtSlug: query.districtSlug,
					rooms: query.rooms
						? [...query.rooms].sort((a, b) => Number(a) - Number(b))
						: undefined,
					houseType: query.houseType,
					landUse: query.landUse,
					priceFromMinor: query.priceFromMinor,
					priceToMinor: query.priceToMinor,
					areaFrom: query.areaFrom,
					areaTo: query.areaTo,
				},
			}),
		],
		tags: [...tags],
	};
}
