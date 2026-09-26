import type { ListingContentGateEvidence } from "../platform/seo/content-gate.ts";
import {
	buildRegistrySitemapEntries,
	type RegistrySitemapOwner,
	registrySitemapOwners,
} from "../platform/sitemap/registry.ts";
import { seoRegistry } from "./seo-registry.generated.ts";
import { siteProfile } from "./site.profile.ts";
import { buildProjectUrl, parseProjectUrl } from "./url-grammar.ts";

// Reviewed registry content revision. It is deliberately not request time.
export const registryContentUpdatedAt = "2026-09-24T00:00:00.000Z";

export function projectSitemapEntriesForEvidence(
	contentGateEvidence?: Readonly<Record<string, ListingContentGateEvidence>>,
) {
	return buildRegistrySitemapEntries(seoRegistry, {
		contentUpdatedAt: registryContentUpdatedAt,
		profile: siteProfile,
		contentGateEvidence,
		isCanonicalPath(path) {
			const key = parseProjectUrl(path);
			return key !== null && buildProjectUrl(key) === path;
		},
	});
}

export const projectSitemapEntries = projectSitemapEntriesForEvidence();

export const projectSitemapOwners = [
	...registrySitemapOwners,
	"kvartiry",
	"doma",
	"uchastki",
	"kommercheskaya",
] as const;

export type ProjectSitemapOwner = (typeof projectSitemapOwners)[number];
export type PropertySitemapOwner = Extract<
	ProjectSitemapOwner,
	"kvartiry" | "doma" | "uchastki" | "kommercheskaya"
>;

export const projectSitemapDescriptors = projectSitemapOwners.map(
	(owner, id) => ({ id, owner }),
);

export function projectSitemapPath(id: number): string {
	return `/sitemap/${id}.xml`;
}

export const projectSitemapPaths = projectSitemapDescriptors.map(({ id }) =>
	projectSitemapPath(id),
);

export function isProjectRegistrySitemapOwner(
	owner: ProjectSitemapOwner,
): owner is RegistrySitemapOwner {
	return (registrySitemapOwners as readonly string[]).includes(owner);
}

export function projectRegistrySitemapEntries(
	owner: RegistrySitemapOwner,
	contentGateEvidence?: Readonly<Record<string, ListingContentGateEvidence>>,
) {
	return buildRegistrySitemapEntries(seoRegistry, {
		contentUpdatedAt: registryContentUpdatedAt,
		profile: siteProfile,
		owner,
		contentGateEvidence,
		isCanonicalPath(path) {
			const key = parseProjectUrl(path);
			return key !== null && buildProjectUrl(key) === path;
		},
	});
}

export function propertyCategoryForSitemapOwner(
	owner: ProjectSitemapOwner,
): "apartment" | "house" | "land" | "commercial" | undefined {
	if (owner === "kvartiry") return "apartment";
	if (owner === "doma") return "house";
	if (owner === "uchastki") return "land";
	if (owner === "kommercheskaya") return "commercial";
	return undefined;
}
