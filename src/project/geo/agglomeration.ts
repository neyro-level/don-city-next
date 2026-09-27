export const MAX_AGGLOMERATION_DISTANCE_KM = 50;

export type GeoPoint = {
	latitude: number;
	longitude: number;
};

export type NearbyLocalityEligibility = {
	localityKind?: "primary_city" | "nearby_locality" | null;
	latitude?: number | null;
	longitude?: number | null;
	coordinatesVerifiedAt?: string | null;
	agglomerationOf?: unknown;
	agglomerationDistanceKm?: number | null;
	agglomerationApproved?: boolean | null;
	agglomerationApprovedAt?: string | null;
};

export type PrimaryCityEligibility = {
	localityKind?: "primary_city" | "nearby_locality" | null;
	isPublished?: boolean | null;
	latitude?: number | null;
	longitude?: number | null;
	coordinatesVerifiedAt?: string | null;
};

function radians(value: number) {
	return (value * Math.PI) / 180;
}

export function isGeoPoint<
	T extends {
		latitude?: number | null;
		longitude?: number | null;
	},
>(value: T): value is T & GeoPoint {
	return (
		typeof value.latitude === "number" &&
		Number.isFinite(value.latitude) &&
		value.latitude >= -90 &&
		value.latitude <= 90 &&
		typeof value.longitude === "number" &&
		Number.isFinite(value.longitude) &&
		value.longitude >= -180 &&
		value.longitude <= 180
	);
}

export function haversineDistanceKm(from: GeoPoint, to: GeoPoint): number {
	const earthRadiusKm = 6371.0088;
	const latitudeDelta = radians(to.latitude - from.latitude);
	const longitudeDelta = radians(to.longitude - from.longitude);
	const fromLatitude = radians(from.latitude);
	const toLatitude = radians(to.latitude);
	const haversine =
		Math.sin(latitudeDelta / 2) ** 2 +
		Math.cos(fromLatitude) *
			Math.cos(toLatitude) *
			Math.sin(longitudeDelta / 2) ** 2;
	return (
		2 *
		earthRadiusKm *
		Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
	);
}

export function isApprovedNearbyLocality(
	locality: NearbyLocalityEligibility,
): boolean {
	return (
		locality.localityKind === "nearby_locality" &&
		isGeoPoint(locality) &&
		Boolean(locality.coordinatesVerifiedAt) &&
		Boolean(locality.agglomerationOf) &&
		locality.agglomerationApproved === true &&
		Boolean(locality.agglomerationApprovedAt) &&
		typeof locality.agglomerationDistanceKm === "number" &&
		Number.isFinite(locality.agglomerationDistanceKm) &&
		locality.agglomerationDistanceKm >= 0 &&
		locality.agglomerationDistanceKm <= MAX_AGGLOMERATION_DISTANCE_KM
	);
}

export function isVerifiedPrimaryCity(
	locality: PrimaryCityEligibility,
): boolean {
	return (
		locality.localityKind === "primary_city" &&
		locality.isPublished === true &&
		isGeoPoint(locality) &&
		Boolean(locality.coordinatesVerifiedAt)
	);
}

export function isApprovedNearbyPair(
	locality: NearbyLocalityEligibility,
	primary: PrimaryCityEligibility,
): boolean {
	if (
		!isApprovedNearbyLocality(locality) ||
		!isVerifiedPrimaryCity(primary) ||
		!isGeoPoint(locality) ||
		!isGeoPoint(primary) ||
		typeof locality.agglomerationDistanceKm !== "number"
	) {
		return false;
	}
	const currentDistance = haversineDistanceKm(primary, locality);
	return (
		currentDistance <= MAX_AGGLOMERATION_DISTANCE_KM &&
		Math.abs(currentDistance - locality.agglomerationDistanceKm) <= 0.01
	);
}
