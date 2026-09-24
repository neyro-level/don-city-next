import type { SiteProfile } from "../profile/types.ts";
import type { SeoRegistryEntry, SeoRegistryRobots } from "./registry.ts";

export type ListingContextFact = {
	source: string;
	checkedAt: string;
};

export type ListingContentGateEvidence = {
	activeObjects: number;
	introduction: string;
	contextFacts?: readonly ListingContextFact[];
	serverRendered: boolean;
	propertyLinksInHtml: boolean;
};

export type ListingContentGateDecision = {
	passed: boolean;
	threshold: number;
	reasons: readonly string[];
};

type ListingGateProfile = Pick<SiteProfile, "inventoryThreshold">;

function isMaterialized(value: string): boolean {
	return value.trim().length > 0 && !/[{}]/u.test(value);
}

function isVerifiedContextFact(fact: ListingContextFact): boolean {
	return (
		fact.source.trim().length > 0 &&
		Number.isFinite(new Date(fact.checkedAt).valueOf())
	);
}

function listedThreshold(
	entry: SeoRegistryEntry,
	profile: ListingGateProfile,
): number | null {
	if (!entry.tier) return 0;
	const threshold = profile.inventoryThreshold[entry.tier];
	if (!Number.isInteger(threshold) || threshold < 0) return null;
	return threshold;
}

export function evaluateListingContentGate(
	entry: SeoRegistryEntry,
	profile: ListingGateProfile,
	evidence?: ListingContentGateEvidence | null,
): ListingContentGateDecision {
	if (entry.contentGateRequired !== "true") {
		return { passed: true, threshold: 0, reasons: [] };
	}

	const threshold = listedThreshold(entry, profile);
	if (threshold === null) {
		return { passed: false, threshold: 0, reasons: ["unsupported_tier"] };
	}
	if (!evidence) {
		return { passed: false, threshold, reasons: ["missing_evidence"] };
	}

	const reasons: string[] = [];
	if (!Number.isInteger(evidence.activeObjects) || evidence.activeObjects < threshold) {
		reasons.push("inventory_below_threshold");
	}
	if (
		![entry.title, entry.description, entry.h1].every(isMaterialized) ||
		Number(entry.minActiveObjects) !== threshold
	) {
		reasons.push("registry_metadata_not_materialized");
	}
	if (evidence.introduction.trim().length < 600) {
		reasons.push("introduction_too_short");
	}
	if (
		entry.pageType === "district" &&
		!(evidence.contextFacts ?? []).every(isVerifiedContextFact)
	) {
		reasons.push("district_context_unverified");
	}
	if (!evidence.serverRendered) reasons.push("not_server_rendered");
	if (!evidence.propertyLinksInHtml) reasons.push("property_links_missing_in_html");

	return { passed: reasons.length === 0, threshold, reasons };
}

export function effectiveListingRobots(
	entry: SeoRegistryEntry,
	profile: ListingGateProfile,
	evidence?: ListingContentGateEvidence | null,
): SeoRegistryRobots {
	if (entry.contentGateRequired !== "true") return entry.robots;
	return evaluateListingContentGate(entry, profile, evidence).passed
		? "index,follow"
		: "noindex,follow";
}

export function isListingSitemapEligible(
	entry: SeoRegistryEntry,
	profile: ListingGateProfile,
	evidence?: ListingContentGateEvidence | null,
): boolean {
	return effectiveListingRobots(entry, profile, evidence) === "index,follow";
}

export function resolveListingQueryCanonical(input: {
	entry: SeoRegistryEntry;
	categoryGeoPath: string;
	profile: ListingGateProfile;
	evidence?: ListingContentGateEvidence | null;
}): string {
	return isListingSitemapEligible(input.entry, input.profile, input.evidence)
		? input.entry.url
		: input.categoryGeoPath;
}
