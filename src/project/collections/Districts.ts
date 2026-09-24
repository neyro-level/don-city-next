import type { CollectionConfig, Where } from "payload";
import { adminsAndOwners, ownersOnly } from "../../core/access/roles.ts";
import { publicGeoReadAccess } from "../../core/data-access/public/access-mode.ts";
import { geoValidationSystemAccess } from "../../core/data-access/system/geo.ts";
import { relationId, validateDistrictSlug } from "../geo/constraints.ts";

export const Districts: CollectionConfig = {
	slug: "districts",
	indexes: [{ unique: true, fields: ["city", "slug"] }],
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
				const slug = validateDistrictSlug(data.slug ?? originalDoc?.slug);
				const city = relationId(data.city ?? originalDoc?.city);
				if (!city) throw new Error("District city is required.");
				const duplicate = await req.payload.find({
					collection: "districts",
					where: {
						and: [{ city: { equals: city } }, { slug: { equals: slug } }],
					},
					limit: 2,
					depth: 0,
					req,
					...geoValidationSystemAccess,
				});
				if (
					duplicate.docs.some(
						(item) => String(item.id) !== String(originalDoc?.id ?? ""),
					)
				) {
					throw new Error(`District slug must be unique inside city: ${slug}.`);
				}
				const parentId = relationId(data.parent ?? originalDoc?.parent);
				if (parentId) {
					if (String(parentId) === String(originalDoc?.id ?? ""))
						throw new Error("District cannot be its own parent.");
					const parent = await req.payload.findByID({
						collection: "districts",
						id: parentId,
						depth: 0,
						req,
						...geoValidationSystemAccess,
					});
					if (String(relationId(parent.city)) !== String(city))
						throw new Error("District parent must belong to the same city.");
				}
				data.slug = slug;
				return data;
			},
		],
	},
	fields: [
		{ name: "name", type: "text", required: true },
		{ name: "slug", type: "text", required: true, index: true },
		{
			name: "type",
			type: "select",
			required: true,
			index: true,
			options: [
				{ label: "Administrative district", value: "administrative_district" },
				{ label: "Microdistrict", value: "microdistrict" },
			],
		},
		{
			name: "city",
			type: "relationship",
			relationTo: "cities",
			required: true,
			index: true,
		},
		{
			name: "parent",
			type: "relationship",
			relationTo: "districts",
			index: true,
			filterOptions: ({ data }) => {
				const and: Where[] = [{ type: { equals: "administrative_district" } }];
				if (data?.city) and.push({ city: { equals: data.city } });
				return { and };
			},
		},
		{
			name: "sortOrder",
			type: "number",
			required: true,
			defaultValue: 100,
			index: true,
		},
		{ name: "preposition", type: "text" },
		{ name: "nameLocative", type: "text" },
		{
			name: "ownerVerified",
			type: "checkbox",
			required: true,
			defaultValue: false,
		},
		{
			name: "isPublished",
			type: "checkbox",
			required: true,
			defaultValue: false,
			index: true,
		},
		{ name: "publishedAt", type: "date" },
		{
			name: "seo",
			type: "group",
			fields: [
				{ name: "title", type: "text" },
				{ name: "description", type: "textarea" },
				{ name: "noindex", type: "checkbox", defaultValue: true },
			],
		},
	],
};
