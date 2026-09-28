import type { CollectionConfig } from "payload";
import {
	adminsAndOwners,
	hasRole,
	ownersOnly,
} from "../../core/access/roles.ts";
import { publicGeoReadAccess } from "../../core/data-access/public/access-mode.ts";
import { geoValidationSystemAccess } from "../../core/data-access/system/geo.ts";
import { invalidateProjectPublicCache } from "../cache-invalidation.ts";
import { publicCacheTags } from "../cache-tags.ts";
import {
	haversineDistanceKm,
	isGeoPoint,
	MAX_AGGLOMERATION_DISTANCE_KM,
} from "../geo/agglomeration.ts";
import { relationId, validateCitySlug } from "../geo/constraints.ts";

export const Cities: CollectionConfig = {
	slug: "cities",
	admin: { group: "Geo", useAsTitle: "name" },
	access: {
		create: adminsAndOwners,
		read: publicGeoReadAccess,
		update: adminsAndOwners,
		delete: ownersOnly,
	},
	hooks: {
		beforeValidate: [
			async ({ data, originalDoc, req }) => {
				if (!data) return data;
				if (data.slug) data.slug = validateCitySlug(data.slug);
				const includes = (key: string) => Object.hasOwn(data, key);
				const localityKind =
					(includes("localityKind")
						? data.localityKind
						: originalDoc?.localityKind) ?? "nearby_locality";
				const approved = includes("agglomerationApproved")
					? data.agglomerationApproved === true
					: originalDoc?.agglomerationApproved === true;
				const agglomerationOf = relationId(
					includes("agglomerationOf")
						? data.agglomerationOf
						: originalDoc?.agglomerationOf,
				);
				const geometryChanged = [
					"agglomerationOf",
					"latitude",
					"longitude",
				].some(includes);
				const approvalEvidenceChanged = [
					"agglomerationApproved",
					"agglomerationApprovedAt",
					"coordinatesVerifiedAt",
				].some(includes);
				if (
					approved &&
					(geometryChanged || approvalEvidenceChanged) &&
					!hasRole(req.user, ["owner"])
				) {
					throw new Error(
						"Only an owner can create or change nearby locality approval evidence.",
					);
				}
				if (
					approved &&
					geometryChanged &&
					(!includes("coordinatesVerifiedAt") ||
						!includes("agglomerationApprovedAt"))
				) {
					throw new Error(
						"Changed nearby geometry requires explicit coordinate verification and owner reapproval.",
					);
				}
				const currentId = relationId(originalDoc?.id);
				if (agglomerationOf && String(agglomerationOf) === String(currentId)) {
					throw new Error("City cannot be its own agglomeration owner.");
				}

				if (localityKind === "primary_city") {
					if (agglomerationOf || approved) {
						throw new Error(
							"Primary city cannot be an approved nearby locality.",
						);
					}
					data.agglomerationDistanceKm = null;
					data.agglomerationApproved = false;
					data.agglomerationApprovedAt = null;
					return data;
				}

				let primary:
					| {
							localityKind?: string | null;
							latitude?: number | null;
							longitude?: number | null;
							coordinatesVerifiedAt?: string | null;
					  }
					| undefined;
				if (agglomerationOf) {
					primary = await req.payload.findByID({
						collection: "cities",
						id: agglomerationOf,
						depth: 0,
						req,
						...geoValidationSystemAccess,
					});
					if (primary.localityKind !== "primary_city") {
						throw new Error("Agglomeration owner must be a primary city.");
					}
				}

				const locality = {
					latitude: includes("latitude")
						? data.latitude
						: originalDoc?.latitude,
					longitude: includes("longitude")
						? data.longitude
						: originalDoc?.longitude,
				};
				const primaryPoint = {
					latitude: primary?.latitude,
					longitude: primary?.longitude,
				};
				if (isGeoPoint(locality) && isGeoPoint(primaryPoint)) {
					data.agglomerationDistanceKm = Number(
						haversineDistanceKm(primaryPoint, locality).toFixed(3),
					);
				} else {
					data.agglomerationDistanceKm = null;
				}

				if (!approved) {
					data.agglomerationApprovedAt = null;
					return data;
				}
				const coordinatesVerifiedAt =
					(includes("coordinatesVerifiedAt")
						? data.coordinatesVerifiedAt
						: originalDoc?.coordinatesVerifiedAt) ?? null;
				const approvedAt =
					(includes("agglomerationApprovedAt")
						? data.agglomerationApprovedAt
						: originalDoc?.agglomerationApprovedAt) ?? null;
				if (
					!agglomerationOf ||
					!isGeoPoint(locality) ||
					!isGeoPoint(primaryPoint) ||
					!coordinatesVerifiedAt ||
					!primary?.coordinatesVerifiedAt ||
					!approvedAt ||
					typeof data.agglomerationDistanceKm !== "number" ||
					data.agglomerationDistanceKm > MAX_AGGLOMERATION_DISTANCE_KM
				) {
					throw new Error(
						"Approved nearby locality requires verified coordinates, owner approval and distance within 50 km.",
					);
				}
				return data;
			},
		],
		afterChange: [
			async () => {
				await invalidateProjectPublicCache(
					[{ type: "tag", tag: publicCacheTags.properties }],
					"city_changed",
				);
			},
		],
		afterDelete: [
			async () => {
				await invalidateProjectPublicCache(
					[{ type: "tag", tag: publicCacheTags.properties }],
					"city_deleted",
				);
			},
		],
	},
	fields: [
		{ name: "name", type: "text", required: true },
		{ name: "slug", type: "text", required: true, unique: true, index: true },
		{
			name: "region",
			type: "relationship",
			relationTo: "regions",
			required: true,
			index: true,
		},
		{ name: "nameGenitive", type: "text", required: true },
		{ name: "nameLocative", type: "text", required: true },
		{ name: "preposition", type: "text", required: true },
		{
			name: "localityKind",
			type: "select",
			required: true,
			defaultValue: "nearby_locality",
			index: true,
			options: [
				{ label: "Primary city", value: "primary_city" },
				{ label: "Nearby locality", value: "nearby_locality" },
			],
		},
		{ name: "latitude", type: "number", min: -90, max: 90 },
		{ name: "longitude", type: "number", min: -180, max: 180 },
		{ name: "coordinatesVerifiedAt", type: "date" },
		{
			name: "agglomerationOf",
			type: "relationship",
			relationTo: "cities",
			index: true,
		},
		{
			name: "agglomerationDistanceKm",
			type: "number",
			min: 0,
			admin: { readOnly: true, step: 0.001 },
		},
		{
			name: "agglomerationApproved",
			type: "checkbox",
			required: true,
			defaultValue: false,
			index: true,
		},
		{ name: "agglomerationApprovedAt", type: "date" },
		{
			name: "ownerVerified",
			type: "checkbox",
			required: true,
			defaultValue: false,
		},
		{
			name: "sortOrder",
			type: "number",
			required: true,
			defaultValue: 100,
			index: true,
		},
		{
			name: "isPublished",
			type: "checkbox",
			required: true,
			defaultValue: false,
			index: true,
		},
		{ name: "publishedAt", type: "date" },
	],
};
