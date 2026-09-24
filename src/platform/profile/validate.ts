import { profileStatuses, type SiteProfile } from "./types.ts";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const allowedStatuses = new Set(profileStatuses);

export function validateSiteProfile(profile: SiteProfile): string[] {
	const violations: string[] = [];
	if (!slugPattern.test(profile.primaryGeo)) {
		violations.push("primaryGeo must be a lowercase URL slug");
	}
	if (!allowedStatuses.has(profile.defaultNearbyGeoStatus)) {
		violations.push("defaultNearbyGeoStatus has an unsupported status");
	}

	for (const [scope, statuses] of [
		["marketStatus", profile.marketStatus],
		["categoryStatus", profile.categoryStatus],
	] as const) {
		for (const [key, status] of Object.entries(statuses)) {
			if (!status || !allowedStatuses.has(status)) {
				violations.push(`${scope}.${key} has an unsupported status`);
			}
		}
	}

	for (const [geo, statuses] of Object.entries(profile.geoCategoryStatus)) {
		if (!slugPattern.test(geo)) {
			violations.push(`geoCategoryStatus.${geo} is not a URL slug`);
		}
		for (const [category, status] of Object.entries(statuses)) {
			if (!(category in profile.categoryStatus)) {
				violations.push(`geoCategoryStatus.${geo}.${category} is unknown`);
			}
			if (!status || !allowedStatuses.has(status)) {
				violations.push(
					`geoCategoryStatus.${geo}.${category} has an unsupported status`,
				);
			}
		}
	}

	for (const [tier, value] of Object.entries(profile.tiers)) {
		if (!Number.isFinite(value.minBroad) || value.minBroad < 0) {
			violations.push(`tiers.${tier}.minBroad must be non-negative`);
		}
	}
	for (const [tier, value] of Object.entries(profile.inventoryThreshold)) {
		if (!Number.isInteger(value) || value < 0) {
			violations.push(`inventoryThreshold.${tier} must be a non-negative integer`);
		}
	}

	for (const [category, facets] of Object.entries(profile.facetWhitelist)) {
		if (!(category in profile.categoryStatus)) {
			violations.push(`facetWhitelist.${category} is unknown`);
		}
		const unique = new Set<string>();
		for (const facet of facets ?? []) {
			if (!slugPattern.test(facet)) {
				violations.push(`facetWhitelist.${category}.${facet} is not a URL slug`);
			}
			if (unique.has(facet)) {
				violations.push(`facetWhitelist.${category}.${facet} is duplicated`);
			}
			unique.add(facet);
		}
	}

	return violations;
}

export function assertValidSiteProfile(profile: SiteProfile): void {
	const violations = validateSiteProfile(profile);
	if (violations.length) {
		throw new Error(`Invalid Site Profile:\n${violations.join("\n")}`);
	}
}
