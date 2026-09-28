import assert from "node:assert/strict";
import {
	haversineDistanceKm,
	isApprovedNearbyLocality,
	isApprovedNearbyPair,
} from "../src/project/geo/agglomeration.ts";

const origin = { latitude: 0, longitude: 0 };
const withinRadius = {
	latitude: 0,
	longitude: 49.9 / 111.195,
};
const outsideRadius = {
	latitude: 0,
	longitude: 50.1 / 111.195,
};

assert.ok(haversineDistanceKm(origin, withinRadius) < 50);
assert.ok(haversineDistanceKm(origin, outsideRadius) > 50);

const approved = {
	localityKind: "nearby_locality" as const,
	latitude: withinRadius.latitude,
	longitude: withinRadius.longitude,
	coordinatesVerifiedAt: "2026-09-28T00:00:00.000Z",
	agglomerationOf: 1,
	agglomerationDistanceKm: haversineDistanceKm(origin, withinRadius),
	agglomerationApproved: true,
	agglomerationApprovedAt: "2026-09-28T00:00:00.000Z",
};

assert.equal(isApprovedNearbyLocality(approved), true);
assert.equal(
	isApprovedNearbyPair(approved, {
		localityKind: "primary_city",
		isPublished: true,
		...origin,
		coordinatesVerifiedAt: "2026-09-28T00:00:00.000Z",
	}),
	true,
);
assert.equal(
	isApprovedNearbyPair(approved, {
		localityKind: "primary_city",
		isPublished: true,
		...origin,
		coordinatesVerifiedAt: null,
	}),
	false,
);
assert.equal(
	isApprovedNearbyPair(approved, {
		localityKind: "primary_city",
		isPublished: true,
		...outsideRadius,
		coordinatesVerifiedAt: "2026-09-28T00:00:00.000Z",
	}),
	false,
);
assert.equal(
	isApprovedNearbyLocality({ ...approved, agglomerationApproved: false }),
	false,
);
assert.equal(
	isApprovedNearbyLocality({ ...approved, coordinatesVerifiedAt: null }),
	false,
);
assert.equal(
	isApprovedNearbyLocality({
		...approved,
		agglomerationDistanceKm: haversineDistanceKm(origin, outsideRadius),
	}),
	false,
);
assert.equal(
	isApprovedNearbyLocality({ ...approved, localityKind: "primary_city" }),
	false,
);

console.log("DC10-R12-02 agglomeration model: PASS");
