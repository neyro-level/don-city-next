import "server-only";

import type { PropertyCategory } from "@ams/realtbase-contracts";
import type { Payload, Where } from "payload";
import { isApprovedNearbyPair } from "@/project/geo/agglomeration";
import { relationId } from "@/project/geo/constraints";
import type { CitiesSelect, City } from "@/project/payload-types";
import { publicPropertyPublicationWhere } from "./catalog";
import { publicGatewayPolicy } from "./policy";

const nearbyCategories = ["apartment", "house", "land"] as const;

const publicCitySelect = {
	name: true,
	slug: true,
	nameGenitive: true,
	nameLocative: true,
	preposition: true,
	isPublished: true,
	localityKind: true,
	latitude: true,
	longitude: true,
	coordinatesVerifiedAt: true,
	agglomerationOf: true,
	agglomerationDistanceKm: true,
	agglomerationApproved: true,
	agglomerationApprovedAt: true,
} satisfies CitiesSelect<true>;

type PublicCity = Pick<
	City,
	| "id"
	| "name"
	| "slug"
	| "nameGenitive"
	| "nameLocative"
	| "preposition"
	| "isPublished"
	| "localityKind"
	| "latitude"
	| "longitude"
	| "coordinatesVerifiedAt"
	| "agglomerationOf"
	| "agglomerationDistanceKm"
	| "agglomerationApproved"
	| "agglomerationApprovedAt"
>;

const primaryCitySelect = {
	isPublished: true,
	localityKind: true,
	latitude: true,
	longitude: true,
	coordinatesVerifiedAt: true,
} satisfies CitiesSelect<true>;

type PublicPrimaryCity = Pick<
	City,
	| "isPublished"
	| "localityKind"
	| "latitude"
	| "longitude"
	| "coordinatesVerifiedAt"
>;

export type NearbyGeoAvailability = {
	slug: string;
	name: string;
	nameGenitive: string;
	nameLocative: string;
	preposition: string;
	activeObjects: number;
	activeByCategory: Partial<Record<PropertyCategory, number>>;
};

export async function findNearbyGeoAvailability(
	payload: Payload,
	slug: string,
): Promise<NearbyGeoAvailability | null> {
	const cityResult = await payload.find({
		collection: "cities",
		where: { slug: { equals: slug } },
		limit: 1,
		depth: publicGatewayPolicy.depth,
		select: publicCitySelect,
		overrideAccess: publicGatewayPolicy.overrideAccess,
		context: publicGatewayPolicy.context,
	});
	const city = cityResult.docs[0] as PublicCity | undefined;
	if (!city?.isPublished) return null;
	const primaryCityId = relationId(city.agglomerationOf);
	if (!primaryCityId) return null;
	const primaryCityResult = await payload.find({
		collection: "cities",
		where: { id: { equals: primaryCityId } },
		limit: 1,
		depth: publicGatewayPolicy.depth,
		select: primaryCitySelect,
		overrideAccess: publicGatewayPolicy.overrideAccess,
		context: publicGatewayPolicy.context,
	});
	const primaryCity = primaryCityResult.docs[0] as
		| PublicPrimaryCity
		| undefined;
	if (!primaryCity || !isApprovedNearbyPair(city, primaryCity)) return null;

	const cityWhere: Where = {
		and: [publicPropertyPublicationWhere, { city: { equals: city.id } }],
	};
	const [total, ...categoryCounts] = await Promise.all([
		payload.count({
			collection: "properties",
			where: cityWhere,
			overrideAccess: publicGatewayPolicy.overrideAccess,
			context: publicGatewayPolicy.context,
		}),
		...nearbyCategories.map((category) =>
			payload.count({
				collection: "properties",
				where: {
					and: [cityWhere, { category: { equals: category } }],
				},
				overrideAccess: publicGatewayPolicy.overrideAccess,
				context: publicGatewayPolicy.context,
			}),
		),
	]);

	return {
		slug: city.slug,
		name: city.name,
		nameGenitive: city.nameGenitive,
		nameLocative: city.nameLocative,
		preposition: city.preposition,
		activeObjects: total.totalDocs,
		activeByCategory: Object.fromEntries(
			nearbyCategories.map((category, index) => [
				category,
				categoryCounts[index].totalDocs,
			]),
		),
	};
}
