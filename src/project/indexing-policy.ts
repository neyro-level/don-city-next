import type { MetadataRoute } from "next";
import { clientReadinessConfig } from "./client-readiness.config.ts";
import { type ProjectKind, siteConfig } from "./site.config.ts";

export type IndexingPolicy = "public" | "noindex";

export function resolveIndexingPolicy(input: {
	projectKind: ProjectKind;
	productionIndexing: IndexingPolicy | null;
}): IndexingPolicy {
	if (input.projectKind === "starter-demo") return "noindex";
	return input.productionIndexing ?? "noindex";
}

export function getProjectIndexingPolicy(): IndexingPolicy {
	return resolveIndexingPolicy({
		projectKind: siteConfig.projectKind,
		productionIndexing: clientReadinessConfig.productionIndexing,
	});
}

export function metadataRobotsForPolicy(policy: IndexingPolicy) {
	return policy === "public"
		? { index: true, follow: true }
		: { index: false, follow: false };
}

export function composeMetadataRobots(
	policy: IndexingPolicy,
	pageRobots: { index: boolean; follow: boolean },
) {
	return policy === "noindex"
		? metadataRobotsForPolicy(policy)
		: pageRobots;
}

export function xRobotsTagForPolicy(policy: IndexingPolicy): string | null {
	return policy === "noindex" ? "noindex, nofollow" : null;
}

export function buildRobots(
	policy: IndexingPolicy,
	host: string,
	sitemapPaths: readonly string[] = ["/sitemap.xml"],
): MetadataRoute.Robots {
	if (policy === "noindex") {
		return {
			rules: [{ userAgent: "*", disallow: "/" }],
		};
	}

	const sitemapUrls = sitemapPaths.map((path) =>
		new URL(path, host).toString(),
	);
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/admin", "/api"],
			},
		],
		sitemap: sitemapUrls.length === 1 ? sitemapUrls[0] : sitemapUrls,
		host,
	};
}
