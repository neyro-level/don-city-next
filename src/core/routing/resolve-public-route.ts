import "server-only";

import { cache } from "react";
import {
	type PublicRouteSearchParams,
	resolveProjectPublicRoute,
} from "../../project/public-route-resolver.ts";
import {
	getCachedNearbyGeoAvailability,
	getCachedPublicDistrictParentSlug,
	getCachedPublicListingContentGateEvidence,
	getCachedPublicListingContentGateEvidenceMap,
	getCachedPublicPropertyByPublicUrlId,
} from "../data-access/public/cached-provider.ts";

export const resolvePublicRoute = cache(
	(segments: readonly string[], searchParams: PublicRouteSearchParams = {}) =>
		resolveProjectPublicRoute(
			segments,
			{
				loadProperty: getCachedPublicPropertyByPublicUrlId,
				loadNearbyGeo: getCachedNearbyGeoAvailability,
				loadListingContentGateEvidence:
					getCachedPublicListingContentGateEvidence,
				loadListingContentGateEvidenceMap:
					getCachedPublicListingContentGateEvidenceMap,
				loadDistrictParentSlug: getCachedPublicDistrictParentSlug,
			},
			searchParams,
		),
);
