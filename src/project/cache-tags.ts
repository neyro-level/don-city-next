import type { CacheTarget } from "../core/cache/revalidation-contract.ts";

const segment = /^[a-z0-9-]+$/;

function safe(value: string, label: string): string {
	if (!segment.test(value)) throw new Error(`Invalid ${label} cache segment.`);
	return value;
}

export const publicCacheTags = {
	site: "site",
	properties: "properties",
	geo: (geoSlug: string) => `geo:${safe(geoSlug, "geo")}`,
	category: (geoSlug: string, category: string) =>
		`geo:${safe(geoSlug, "geo")}:cat:${safe(category, "category")}`,
	district: (geoSlug: string, districtSlug: string) =>
		`district:${safe(geoSlug, "geo")}:${safe(districtSlug, "district")}`,
	property: (publicUrlId: string) =>
		`property:${safe(publicUrlId, "property")}`,
} as const;

function relationshipSlug(value: unknown): string | null {
	if (!value || typeof value !== "object" || !("slug" in value)) return null;
	return typeof value.slug === "string" ? value.slug : null;
}

export function buildPropertyWriteInvalidationTargets(input: {
	geo?: unknown;
	category?: string | null;
	district?: unknown;
	publicUrlId?: string | number | null;
}): CacheTarget[] {
	const targets: CacheTarget[] = [
		{ type: "tag", tag: publicCacheTags.properties },
	];
	const geoSlug = relationshipSlug(input.geo);
	const districtSlug = relationshipSlug(input.district);
	if (geoSlug) {
		targets.push({ type: "tag", tag: publicCacheTags.geo(geoSlug) });
		if (input.category) {
			targets.push({
				type: "tag",
				tag: publicCacheTags.category(geoSlug, input.category),
			});
		}
		if (districtSlug) {
			targets.push({
				type: "tag",
				tag: publicCacheTags.district(geoSlug, districtSlug),
			});
		}
	}
	if (input.publicUrlId != null) {
		targets.push({
			type: "tag",
			tag: publicCacheTags.property(String(input.publicUrlId)),
		});
	}
	return targets;
}

export function buildPropertyInvalidationTargets(input: {
	geoSlug: string;
	category: string;
	districtSlug?: string | null;
	publicUrlId: string;
}): CacheTarget[] {
	return [
		{ type: "tag", tag: publicCacheTags.geo(input.geoSlug) },
		{
			type: "tag",
			tag: publicCacheTags.category(input.geoSlug, input.category),
		},
		...(input.districtSlug
			? [
					{
						type: "tag" as const,
						tag: publicCacheTags.district(input.geoSlug, input.districtSlug),
					},
				]
			: []),
		{ type: "tag", tag: publicCacheTags.property(input.publicUrlId) },
	];
}
