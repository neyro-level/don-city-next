import type { CollectionConfig } from "payload";
import { adminsAndOwners, ownersOnly } from "../../core/access/roles.ts";
import { publicGeoReadAccess } from "../../core/data-access/public/access-mode.ts";
import { normalizeGeoSlug } from "../geo/constraints.ts";

export const Regions: CollectionConfig = {
	slug: "regions",
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
				if (data?.slug) data.slug = normalizeGeoSlug(data.slug);
				return data;
			},
		],
	},
	fields: [
		{ name: "name", type: "text", required: true },
		{ name: "shortName", type: "text", required: true },
		{ name: "slug", type: "text", required: true, unique: true, index: true },
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
