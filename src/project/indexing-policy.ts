import type { MetadataRoute } from "next";
import { clientReadinessConfig } from "./client-readiness.config.ts";
import { type ProjectKind, siteConfig } from "./site.config.ts";

export type IndexingPolicy = "public" | "noindex";

export const robotsCleanQueryParameters = [
	"utm_source",
	"utm_medium",
	"utm_campaign",
	"utm_term",
	"utm_content",
	"yclid",
	"gclid",
	"fbclid",
] as const;

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
	return policy === "noindex" ? metadataRobotsForPolicy(policy) : pageRobots;
}

export function xRobotsTagForPolicy(policy: IndexingPolicy): string | null {
	return policy === "noindex" ? "noindex, nofollow" : null;
}

export function buildRobots(
	policy: IndexingPolicy,
	host: string,
): MetadataRoute.Robots {
	if (policy === "noindex") {
		return {
			rules: [{ userAgent: "*", disallow: "/" }],
		};
	}

	return {
		rules: [
			{
				userAgent: "*",
				allow: ["/", "/api/media/file/"],
				disallow: ["/admin/", "/api/"],
			},
		],
		sitemap: new URL("/sitemap.xml", host).toString(),
	};
}

export function buildRobotsText(policy: IndexingPolicy, host: string): string {
	if (policy === "noindex") {
		return ["User-agent: *", "Disallow: /", ""].join("\n");
	}

	const origin = new URL(host);
	return [
		"User-agent: *",
		"Allow: /",
		"Allow: /api/media/file/",
		"Disallow: /admin/",
		"Disallow: /api/",
		`Clean-param: ${robotsCleanQueryParameters.join("&")} /`,
		`Sitemap: ${new URL("/sitemap.xml", origin).toString()}`,
		"",
	].join("\n");
}
