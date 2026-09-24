import assert from "node:assert/strict";
import {
	landFacetSlugs,
	permittedUseForLandFacet,
} from "../src/platform/catalog/land-facets.ts";

assert.deepEqual(landFacetSlugs, ["izhs", "snt"]);
assert.equal(permittedUseForLandFacet("izhs"), "ижс");
assert.equal(permittedUseForLandFacet("snt"), "снт");

console.log("Land facet query contract: PASS");
