import "server-only";

import { cache } from "react";
import { resolveProjectPublicRoute } from "../../project/public-route-resolver.ts";
import {
	getNearbyGeoAvailability,
	getPublicDistrictParentSlug,
	getPublicPropertyByPublicUrlId,
} from "../data-access/public/provider.ts";

export const resolvePublicRoute = cache((segments: readonly string[]) =>
	resolveProjectPublicRoute(segments, {
		loadProperty: getPublicPropertyByPublicUrlId,
		loadNearbyGeo: getNearbyGeoAvailability,
		loadDistrictParentSlug: getPublicDistrictParentSlug,
	}),
);
