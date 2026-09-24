import { siteProfile } from "../site.profile.ts";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const reservedGeoRoots = new Set([
	...Object.keys(siteProfile.categoryStatus),
	"api",
	"admin",
	"media",
	"_next",
	"sitemap",
	"robots.txt",
	"search",
	"poisk",
	"zastroyshchiki",
	"ipoteka",
	"otzyvy",
	"journal",
]);

export const districtCollisionSlugs = new Set([
	...Object.keys(siteProfile.categoryStatus),
	...Object.values(siteProfile.facetWhitelist).flatMap(
		(values) => values ?? [],
	),
]);

export function normalizeGeoSlug(value: unknown): string {
	const slug = String(value ?? "")
		.trim()
		.toLowerCase();
	if (!slugPattern.test(slug)) {
		throw new Error("Geo slug must be a non-empty lowercase Latin URL slug.");
	}
	return slug;
}

export function validateCitySlug(value: unknown): string {
	const slug = normalizeGeoSlug(value);
	if (reservedGeoRoots.has(slug)) {
		throw new Error(`City slug collides with reserved root: ${slug}.`);
	}
	return slug;
}

export function validateDistrictSlug(value: unknown): string {
	const slug = normalizeGeoSlug(value);
	if (districtCollisionSlugs.has(slug)) {
		throw new Error(`District slug collides with category or facet: ${slug}.`);
	}
	return slug;
}

export function relationId(value: unknown): number | string | null {
	if (typeof value === "number" || typeof value === "string") return value;
	if (value && typeof value === "object" && "id" in value) {
		const id = (value as { id?: unknown }).id;
		if (typeof id === "number" || typeof id === "string") return id;
	}
	return null;
}
