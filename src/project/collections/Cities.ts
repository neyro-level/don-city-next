import type { CollectionConfig } from "payload";
import { adminsAndOwners, ownersOnly } from "../../core/access/roles.ts";
import { publicGeoReadAccess } from "../../core/data-access/public/access-mode.ts";
import { validateCitySlug } from "../geo/constraints.ts";
import { invalidateProjectPublicCache } from "../cache-invalidation.ts";
import { publicCacheTags } from "../cache-tags.ts";

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
			({ data }) => {
				if (data?.slug) data.slug = validateCitySlug(data.slug);
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
			name: "agglomerationOf",
			type: "relationship",
			relationTo: "cities",
			index: true,
		},
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
