import type { SeoRegistryEntry } from "../seo/registry.ts";
import {
	isListingSitemapEligible,
	type ListingContentGateEvidence,
} from "../seo/content-gate.ts";
import type { SiteProfile } from "../profile/types.ts";
import type { PublicUrlEntry } from "../seo/site.ts";

export type RegistrySitemapOptions = {
	contentUpdatedAt: string;
	isCanonicalPath: (path: string) => boolean;
	profile?: Pick<SiteProfile, "inventoryThreshold">;
	contentGateEvidence?: Readonly<Record<string, ListingContentGateEvidence>>;
};

function sitemapPresentation(
	pageType: string,
): Pick<PublicUrlEntry, "changeFrequency" | "priority"> {
	switch (pageType) {
		case "static":
			return { changeFrequency: "monthly", priority: 0.7 };
		case "geo_all":
			return { changeFrequency: "daily", priority: 0.9 };
		case "category_geo":
			return { changeFrequency: "daily", priority: 0.9 };
		case "district":
		case "facet":
			return { changeFrequency: "daily", priority: 0.8 };
		default:
			return { changeFrequency: "weekly", priority: 0.6 };
	}
}

export function buildRegistrySitemapEntries(
	registry: readonly SeoRegistryEntry[],
	options: RegistrySitemapOptions,
): PublicUrlEntry[] {
	const updatedAt = new Date(options.contentUpdatedAt);
	if (Number.isNaN(updatedAt.valueOf())) {
		throw new Error("Sitemap registry contentUpdatedAt must be an ISO date.");
	}

	return registry
		.filter(
			(entry) =>
				isListingSitemapEligible(
					entry,
					options.profile ?? { inventoryThreshold: {} },
					options.contentGateEvidence?.[entry.registryId],
				) &&
				entry.pageType !== "category_root" &&
				options.isCanonicalPath(entry.url),
		)
		.map((entry) => ({
			path: entry.url,
			lastModified: options.contentUpdatedAt,
			indexable: true,
			...sitemapPresentation(entry.pageType),
		}));
}

export function maxMeaningfulLastModified(
	...values: readonly (string | Date | null | undefined)[]
): string | undefined {
	let maximum = Number.NEGATIVE_INFINITY;
	for (const value of values) {
		if (!value) continue;
		const timestamp = new Date(value).valueOf();
		if (!Number.isNaN(timestamp)) maximum = Math.max(maximum, timestamp);
	}
	return Number.isFinite(maximum) ? new Date(maximum).toISOString() : undefined;
}
