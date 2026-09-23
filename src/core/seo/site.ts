import { siteConfig } from "../../project/site.config.ts";

export const siteBrandName = siteConfig.brandName;

export type PublicUrlEntry = {
	path: string;
	lastModified?: string | Date | null;
	changeFrequency?:
		| "always"
		| "hourly"
		| "daily"
		| "weekly"
		| "monthly"
		| "yearly"
		| "never";
	priority?: number;
	indexable: boolean;
};

export const staticPublicUrlEntries: readonly PublicUrlEntry[] = [
	{ path: "/", changeFrequency: "daily", priority: 1, indexable: true },
	{
		path: "/nedvizhimost",
		changeFrequency: "daily",
		priority: 0.9,
		indexable: true,
	},
	{
		path: "/uslugi",
		changeFrequency: "weekly",
		priority: 0.7,
		indexable: true,
	},
	{
		path: "/o-kompanii",
		changeFrequency: "monthly",
		priority: 0.6,
		indexable: true,
	},
	{
		path: "/ipoteka",
		changeFrequency: "weekly",
		priority: 0.7,
		indexable: true,
	},
	{
		path: "/prodat",
		changeFrequency: "weekly",
		priority: 0.7,
		indexable: true,
	},
	{ path: "/sdat", changeFrequency: "weekly", priority: 0.7, indexable: true },
	{
		path: "/kontakty",
		changeFrequency: "monthly",
		priority: 0.6,
		indexable: true,
	},
	{
		path: "/politika-konfidencialnosti",
		changeFrequency: "yearly",
		priority: 0.2,
		indexable: false,
	},
	{
		path: "/soglasie-na-obrabotku-personalnyh-dannyh",
		changeFrequency: "yearly",
		priority: 0.2,
		indexable: false,
	},
];

export function getSiteUrl(): string {
	return siteConfig.canonicalOrigin;
}

export function absoluteUrl(path: string): string {
	return new URL(path, getSiteUrl()).toString();
}
