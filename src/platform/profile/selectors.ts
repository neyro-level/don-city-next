import type {
	ProfileCategoryCandidate,
	ProfileStatus,
	SiteProfile,
} from "./types.ts";

export function resolveCategoryStatus<Category extends string>(
	profile: SiteProfile<Category>,
	geo: string,
	category: Category,
): ProfileStatus {
	const globalStatus = profile.categoryStatus[category];
	if (globalStatus === "PREPARED_OFF") return globalStatus;
	const geoStatus = profile.geoCategoryStatus[geo]?.[category];
	if (geoStatus) return geoStatus;
	if (geo === profile.primaryGeo) return globalStatus;
	return profile.defaultNearbyGeoStatus;
}

export function resolveCategoryRoute<Category extends string>(
	profile: SiteProfile<Category>,
	geo: string,
	category: Category,
) {
	const status = resolveCategoryStatus(profile, geo, category);
	return {
		status,
		statusCode: status === "PREPARED_OFF" ? 404 : 200,
		indexable: status === "ACTIVE",
		promotable: status === "ACTIVE",
	} as const;
}

export function selectActiveCategoryLinks<Category extends string>(
	profile: SiteProfile<Category>,
	candidates: readonly ProfileCategoryCandidate<Category>[],
) {
	return candidates.filter(
		(candidate) =>
			resolveCategoryRoute(profile, candidate.geo, candidate.category)
				.promotable,
	);
}

export function isGeoSwitcherVisible(profile: SiteProfile): boolean {
	return profile.geoMode === "MULTI_GEO";
}

export function isNearbyGeoRouteApproved(
	profile: Pick<SiteProfile, "primaryGeo" | "nearbyGeoRouteAllowlist">,
	geo: string,
	route: string,
): boolean {
	const allowed = profile.nearbyGeoRouteAllowlist?.[geo] as
		| readonly string[]
		| undefined;
	return geo !== profile.primaryGeo && (allowed?.includes(route) ?? false);
}
