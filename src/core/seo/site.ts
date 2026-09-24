import { createSiteSeo, type PublicUrlEntry } from "../../platform/seo/site.ts";
import { siteConfig } from "../../project/site.config.ts";
import { projectUrls } from "../../project/url-grammar.ts";

export type { PublicUrlEntry } from "../../platform/seo/site.ts";

const siteSeo = createSiteSeo(siteConfig);

export const siteBrandName = siteSeo.siteBrandName;
export const getSiteUrl = siteSeo.getSiteUrl;
export const absoluteUrl = siteSeo.absoluteUrl;

export const staticPublicUrlEntries: readonly PublicUrlEntry[] = [
	{
		path: projectUrls.home,
		changeFrequency: "daily",
		priority: 1,
		indexable: true,
	},
	{
		path: projectUrls.primaryCatalog,
		changeFrequency: "daily",
		priority: 0.9,
		indexable: true,
	},
	{
		path: projectUrls.lawyer,
		changeFrequency: "weekly",
		priority: 0.7,
		indexable: true,
	},
	{
		path: projectUrls.about,
		changeFrequency: "monthly",
		priority: 0.6,
		indexable: true,
	},
	{
		path: projectUrls.sale,
		changeFrequency: "weekly",
		priority: 0.7,
		indexable: true,
	},
	{
		path: projectUrls.contacts,
		changeFrequency: "monthly",
		priority: 0.6,
		indexable: true,
	},
	{
		path: projectUrls.privacy,
		changeFrequency: "yearly",
		priority: 0.2,
		indexable: false,
	},
	{
		path: projectUrls.consent,
		changeFrequency: "yearly",
		priority: 0.2,
		indexable: false,
	},
];
