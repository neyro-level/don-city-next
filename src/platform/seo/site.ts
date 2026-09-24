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

export type SiteSeoInput = {
	brandName: string;
	canonicalOrigin: string;
};

export function createSiteSeo(input: SiteSeoInput) {
	const canonicalOrigin = new URL(input.canonicalOrigin).toString();

	return {
		siteBrandName: input.brandName,
		getSiteUrl: () => canonicalOrigin,
		absoluteUrl: (path: string) => new URL(path, canonicalOrigin).toString(),
	};
}
