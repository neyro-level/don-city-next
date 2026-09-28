import assert from "node:assert/strict";
import {
	effectiveListingRobots,
	evaluateListingContentGate,
	isListingSitemapEligible,
	resolveListingQueryCanonical,
} from "../src/platform/seo/content-gate.ts";
import { nextListingInventoryGateState } from "../src/platform/seo/content-gate-state.ts";
import { buildCatalogLinks } from "../src/project/navigation.ts";
import { seoRegistryById } from "../src/project/seo-registry.generated.ts";
import { siteProfile } from "../src/project/site.profile.ts";

const candidate = seoRegistryById.get("APT_DIST_KALIN");
assert.ok(candidate, "fixture candidate must exist");

const incomplete = evaluateListingContentGate(candidate, siteProfile);
assert.deepEqual(incomplete, {
	passed: false,
	threshold: 3,
	reasons: ["missing_evidence"],
});

const evidence = {
	activeObjects: 3,
	introduction: "а".repeat(600),
	contextFacts: [
		{ source: "official district register", checkedAt: "2026-09-24" },
	],
	serverRendered: true,
	propertyLinksInHtml: true,
};
assert.deepEqual(evaluateListingContentGate(candidate, siteProfile, evidence), {
	passed: true,
	threshold: 3,
	reasons: [],
});
assert.equal(
	effectiveListingRobots(candidate, siteProfile, evidence),
	"index,follow",
);
assert.equal(isListingSitemapEligible(candidate, siteProfile, evidence), true);
assert.equal(
	resolveListingQueryCanonical({
		entry: candidate,
		categoryGeoPath: "/donetsk/kvartiry/",
		profile: siteProfile,
		evidence,
	}),
	"/donetsk/kvartiry/kalininskiy/",
);

const invalidDistrictFactCases = [
	{ label: "undefined", contextFacts: undefined },
	{ label: "empty", contextFacts: [] },
	{
		label: "blank source",
		contextFacts: [{ source: " ", checkedAt: "2026-09-24" }],
	},
	{
		label: "invalid date",
		contextFacts: [{ source: "official register", checkedAt: "not-a-date" }],
	},
	{
		label: "mixed valid and invalid",
		contextFacts: [
			{ source: "official register", checkedAt: "2026-09-24" },
			{ source: "", checkedAt: "2026-09-24" },
		],
	},
] as const;

for (const fixture of invalidDistrictFactCases) {
	const failingEvidence = { ...evidence, contextFacts: fixture.contextFacts };
	const decision = evaluateListingContentGate(
		candidate,
		siteProfile,
		failingEvidence,
	);
	assert.equal(decision.passed, false, fixture.label);
	assert.ok(decision.reasons.includes("district_context_unverified"));
	assert.equal(
		effectiveListingRobots(candidate, siteProfile, failingEvidence),
		"noindex,follow",
		fixture.label,
	);
	assert.equal(
		isListingSitemapEligible(candidate, siteProfile, failingEvidence),
		false,
		fixture.label,
	);
	assert.equal(
		resolveListingQueryCanonical({
			entry: candidate,
			categoryGeoPath: "/donetsk/kvartiry/",
			profile: siteProfile,
			evidence: failingEvidence,
		}),
		"/donetsk/kvartiry/",
		fixture.label,
	);
	assert.equal(
		buildCatalogLinks(
			{ kind: "categoryGeo", geo: "donetsk", category: "kvartiry" },
			{ [candidate.registryId]: failingEvidence },
		).some((link) => link.href === candidate.url),
		false,
		fixture.label,
	);
}

const tooFewObjects = evaluateListingContentGate(candidate, siteProfile, {
	...evidence,
	activeObjects: 2,
});
assert.equal(tooFewObjects.passed, false);
assert.ok(tooFewObjects.reasons.includes("inventory_below_threshold"));

const now = new Date("2026-09-28T12:00:00.000Z");
const graceStartedAt = "2026-08-29T12:00:00.000Z";
const graceEvidence = {
	...evidence,
	activeObjects: 1,
	lastThresholdPassedAt: graceStartedAt,
};
assert.equal(
	evaluateListingContentGate(candidate, siteProfile, graceEvidence, now).passed,
	true,
	"One or two objects may retain indexability through day 30.",
);
assert.equal(
	evaluateListingContentGate(
		candidate,
		siteProfile,
		graceEvidence,
		new Date("2026-09-28T12:00:00.001Z"),
	).passed,
	false,
	"Grace expires immediately after 30 calendar days.",
);
assert.equal(
	evaluateListingContentGate(
		candidate,
		siteProfile,
		{ ...graceEvidence, activeObjects: 0 },
		now,
	).passed,
	false,
	"Zero inventory must fail immediately even during grace.",
);

const passingState = nextListingInventoryGateState({
	activeObjects: 3,
	threshold: 3,
	now,
});
assert.equal(passingState.lastThresholdPassedAt, now.toISOString());
const graceState = nextListingInventoryGateState({
	activeObjects: 2,
	threshold: 3,
	now: new Date("2026-09-29T12:00:00.000Z"),
	lastThresholdPassedAt: passingState.lastThresholdPassedAt,
});
assert.equal(
	graceState.lastThresholdPassedAt,
	passingState.lastThresholdPassedAt,
);
const zeroState = nextListingInventoryGateState({
	activeObjects: 0,
	threshold: 3,
	now: new Date("2026-09-30T12:00:00.000Z"),
	lastThresholdPassedAt: passingState.lastThresholdPassedAt,
});
assert.equal(
	zeroState.lastThresholdPassedAt,
	passingState.lastThresholdPassedAt,
);

const testCandidate = seoRegistryById.get("LAND_FACET_SNT");
assert.ok(testCandidate, "TEST fixture candidate must exist");
assert.equal(
	evaluateListingContentGate(testCandidate, siteProfile, {
		...evidence,
		activeObjects: 2,
	}).passed,
	false,
);
assert.equal(
	effectiveListingRobots(testCandidate, siteProfile),
	"noindex,follow",
);
assert.equal(
	resolveListingQueryCanonical({
		entry: candidate,
		categoryGeoPath: "/donetsk/kvartiry/",
		profile: siteProfile,
	}),
	"/donetsk/kvartiry/",
);

const commercial = seoRegistryById.get("COMM_GEO");
assert.ok(commercial, "commercial launch owner must exist");
assert.equal(effectiveListingRobots(commercial, siteProfile), "noindex,follow");
assert.equal(
	evaluateListingContentGate(commercial, siteProfile, {
		...evidence,
		activeObjects: 10,
	}).passed,
	true,
);

console.log("SEO Content Gate verification passed.");
