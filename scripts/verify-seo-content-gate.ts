import assert from "node:assert/strict";
import { seoRegistryById } from "../src/project/seo-registry.generated.ts";
import { siteProfile } from "../src/project/site.profile.ts";
import {
	effectiveListingRobots,
	evaluateListingContentGate,
	isListingSitemapEligible,
	resolveListingQueryCanonical,
} from "../src/platform/seo/content-gate.ts";

const candidate = seoRegistryById.get("APT_DIST_KALIN");
assert.ok(candidate, "fixture candidate must exist");

const incomplete = evaluateListingContentGate(candidate, siteProfile);
assert.deepEqual(incomplete, {
	passed: false,
	threshold: 5,
	reasons: ["missing_evidence"],
});

const evidence = {
	activeObjects: 5,
	introduction: "а".repeat(600),
	contextFacts: [{ source: "official district register", checkedAt: "2026-09-24" }],
	serverRendered: true,
	propertyLinksInHtml: true,
};
assert.deepEqual(evaluateListingContentGate(candidate, siteProfile, evidence), {
	passed: true,
	threshold: 5,
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

const tooFewObjects = evaluateListingContentGate(candidate, siteProfile, {
	...evidence,
	activeObjects: 4,
});
assert.equal(tooFewObjects.passed, false);
assert.ok(tooFewObjects.reasons.includes("inventory_below_threshold"));

const testCandidate = seoRegistryById.get("LAND_FACET_SNT");
assert.ok(testCandidate, "TEST fixture candidate must exist");
assert.equal(
	evaluateListingContentGate(testCandidate, siteProfile, {
		...evidence,
		activeObjects: 9,
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
