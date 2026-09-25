import "server-only";

import { unstable_cache } from "next/cache";
import {
	describePublicCatalogCache,
	publicDataRevalidateSeconds,
} from "../../cache/public-targets.ts";
import { publicCacheTags } from "../../../project/cache-tags.ts";
import {
	getNearbyGeoAvailability,
	getPublicCatalog,
	getPublicDistrictParentSlug,
	getPublicHomePage,
	getPublicNap,
	getPublicPropertyByPublicUrlId,
	type PublicCatalogRequest,
} from "./provider.ts";

const cachedHome = unstable_cache(getPublicHomePage, ["public-home"], {
	revalidate: publicDataRevalidateSeconds,
	tags: [publicCacheTags.site, publicCacheTags.properties],
});

const cachedNap = unstable_cache(getPublicNap, ["public-nap"], {
	revalidate: publicDataRevalidateSeconds,
	tags: [publicCacheTags.site],
});

export function getCachedPublicHomePage() {
	return cachedHome();
}

export function getCachedPublicNap() {
	return cachedNap();
}

export function getCachedPublicCatalog(request: PublicCatalogRequest) {
	const descriptor = describePublicCatalogCache(request);
	return unstable_cache(() => getPublicCatalog(request), descriptor.keyParts, {
		revalidate: publicDataRevalidateSeconds,
		tags: descriptor.tags,
	})();
}

export function getCachedPublicPropertyByPublicUrlId(publicUrlId: string) {
	return unstable_cache(
		() => getPublicPropertyByPublicUrlId(publicUrlId),
		["public-property", publicUrlId],
		{
			revalidate: publicDataRevalidateSeconds,
			tags: [
				publicCacheTags.properties,
				publicCacheTags.property(publicUrlId),
			],
		},
	)();
}

export function getCachedNearbyGeoAvailability(geoSlug: string) {
	return unstable_cache(
		() => getNearbyGeoAvailability(geoSlug),
		["public-nearby-geo", geoSlug],
		{
			revalidate: publicDataRevalidateSeconds,
			tags: [publicCacheTags.properties, publicCacheTags.geo(geoSlug)],
		},
	)();
}

export function getCachedPublicDistrictParentSlug(
	geoSlug: string,
	districtSlug: string,
) {
	return unstable_cache(
		() => getPublicDistrictParentSlug(geoSlug, districtSlug),
		["public-district-parent", geoSlug, districtSlug],
		{
			revalidate: publicDataRevalidateSeconds,
			tags: [
				publicCacheTags.properties,
				publicCacheTags.geo(geoSlug),
				publicCacheTags.district(geoSlug, districtSlug),
			],
		},
	)();
}
