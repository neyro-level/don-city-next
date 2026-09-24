import type { GlobalConfig } from "payload";
import { adminsAndOwners } from "../../core/access/roles.ts";
import { publicGlobalReadAccess } from "../../core/data-access/public/access-mode.ts";
import { approvedSiteSettings, siteSettingsSlug } from "../site-settings.ts";

export const SiteSettings: GlobalConfig = {
	slug: siteSettingsSlug,
	label: "Настройки сайта",
	access: {
		read: publicGlobalReadAccess,
		update: adminsAndOwners,
	},
	fields: [
		{
			name: "brandName",
			type: "text",
			required: true,
			defaultValue: approvedSiteSettings.brandName,
		},
		{
			name: "legalName",
			type: "text",
			required: true,
			defaultValue: approvedSiteSettings.legalName,
		},
		{
			name: "phoneDisplay",
			type: "text",
			required: true,
			defaultValue: approvedSiteSettings.phoneDisplay,
		},
		{
			name: "phoneE164",
			type: "text",
			required: true,
			defaultValue: approvedSiteSettings.phoneE164,
			validate: (value: unknown) =>
				typeof value === "string" && /^\+[1-9]\d{7,14}$/.test(value)
					? true
					: "Введите телефон в формате E.164, например +79491101010.",
		},
		{
			name: "email",
			type: "email",
			required: true,
			defaultValue: approvedSiteSettings.email,
		},
		{
			name: "address",
			type: "group",
			fields: [
				{
					name: "full",
					type: "text",
					required: true,
					defaultValue: approvedSiteSettings.address.full,
				},
				{
					name: "streetAddress",
					type: "text",
					required: true,
					defaultValue: approvedSiteSettings.address.streetAddress,
				},
				{
					name: "addressLocality",
					type: "text",
					required: true,
					defaultValue: approvedSiteSettings.address.addressLocality,
				},
				{
					name: "addressRegion",
					type: "text",
					required: true,
					defaultValue: approvedSiteSettings.address.addressRegion,
				},
				{
					name: "addressCountry",
					type: "text",
					required: true,
					defaultValue: approvedSiteSettings.address.addressCountry,
					admin: { readOnly: true },
				},
			],
		},
		{
			name: "openingHours",
			type: "text",
			required: true,
			defaultValue: approvedSiteSettings.openingHours,
		},
	],
};
