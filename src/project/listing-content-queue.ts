import type { SeoRegistryEntry } from "../platform/seo/registry.ts";

const tierPriority: Readonly<Record<string, number>> = {
	P1: 0,
	P2: 1,
	TEST: 2,
};

export function buildListingContentQueue(
	registry: readonly SeoRegistryEntry[],
): readonly SeoRegistryEntry[] {
	return registry
		.filter((entry) => entry.contentGateRequired === "true")
		.map((entry, sourceIndex) => ({ entry, sourceIndex }))
		.sort(
			(left, right) =>
				(tierPriority[left.entry.tier] ?? Number.MAX_SAFE_INTEGER) -
					(tierPriority[right.entry.tier] ?? Number.MAX_SAFE_INTEGER) ||
				left.sourceIndex - right.sourceIndex,
		)
		.map(({ entry }) => entry);
}
