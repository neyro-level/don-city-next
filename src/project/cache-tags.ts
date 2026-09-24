import type { CacheTarget } from "../core/cache/revalidation-contract.ts";

const segment = /^[a-z0-9-]+$/;

function safe(value: string, label: string): string {
	if (!segment.test(value)) throw new Error(`Invalid ${label} cache segment.`);
	return value;
}

export const publicCacheTags = {
	geo: (geoSlug: string) => `geo:${safe(geoSlug, "geo")}`,
	category: (geoSlug: string, category: string) =>
		`geo:${safe(geoSlug, "geo")}:cat:${safe(category, "category")}`,
	district: (geoSlug: string, districtSlug: string) =>
		`district:${safe(geoSlug, "geo")}:${safe(districtSlug, "district")}`,
	property: (publicUrlId: string) =>
		`property:${safe(publicUrlId, "property")}`,
} as const;

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
