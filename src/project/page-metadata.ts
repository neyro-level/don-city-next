import type { PageSEOContract } from "@ams/realtbase-contracts";
import type { Metadata } from "next";
import { absoluteUrl } from "../core/seo/site.ts";
import { toMetadata as toPlatformMetadata } from "../platform/seo/page-metadata.ts";
import {
	composeMetadataRobots,
	getProjectIndexingPolicy,
	type IndexingPolicy,
} from "./indexing-policy.ts";
import { siteConfig } from "./site.config.ts";

export const projectDefaultSocialImage = {
	kind: "managed",
	src: "/brand/don-city-social-default.png",
	alt: "ДОН СИТИ — агентство недвижимости",
	width: 1200,
	height: 630,
} as const;

export function withProjectIndexingPolicy(
	metadata: Metadata,
	policy: IndexingPolicy = getProjectIndexingPolicy(),
): Metadata {
	if (policy === "public") return metadata;
	return {
		...metadata,
		robots: composeMetadataRobots(policy, { index: true, follow: true }),
	};
}

export function toMetadata(
	seo: PageSEOContract,
	policy: IndexingPolicy = getProjectIndexingPolicy(),
): Metadata {
	const seoWithSocialFallback: PageSEOContract = {
		...seo,
		openGraph: {
			...seo.openGraph,
			image: seo.openGraph?.image ?? projectDefaultSocialImage,
		},
	};
	const pageMetadata = toPlatformMetadata(seoWithSocialFallback, {
		absoluteUrl,
		brandName: siteConfig.brandName,
		locale: siteConfig.locale,
	});
	return {
		...pageMetadata,
		robots: composeMetadataRobots(policy, {
			index: seo.indexing === "index",
			follow: seo.following === "follow",
		}),
	};
}
