import type { Where } from "payload";

export const r1PublicPropertyCategories = [
	"apartment",
	"house",
	"land",
] as const;

export type R1PublicPropertyCategory =
	(typeof r1PublicPropertyCategories)[number];

export function r1PublicPropertyPublicationClauses(): Where[] {
	return [
		{ market: { equals: "secondary" } },
		{ dealType: { equals: "sale" } },
		{ category: { in: [...r1PublicPropertyCategories] } },
	];
}
