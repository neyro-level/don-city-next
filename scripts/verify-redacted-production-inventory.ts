import assert from "node:assert/strict";
import { buildRedactedPropertyInventory } from "./diagnostics/redacted-property-inventory.ts";

const privateMarker = "PRIVATE-MARKER-MUST-NOT-LEAK";
const result = buildRedactedPropertyInventory({
	properties: [
		{
			publicUrlId: 41,
			slug: "safe-slug",
			status: "active",
			market: "secondary",
			category: "apartment",
			dealType: "sale",
			publishedAt: "2026-09-28T00:00:00.000Z",
			needsReview: false,
			cityId: 7,
			districtId: 9,
			["privateInput" as string]: privateMarker,
		},
		{
			publicUrlId: 42,
			slug: "missing-geo",
			status: "active",
			market: "secondary",
			category: "house",
			dealType: "sale",
			publishedAt: "2026-09-28T00:00:00.000Z",
			needsReview: true,
		},
	] as never,
	cities: [{ id: 7, slug: "donetsk", isPublished: true }],
	districts: [{ id: 9, slug: "leninskiy", isPublished: true }],
});

assert.equal(result.totalPublished, 2);
assert.equal(result.totalDataIndexable, 2);
assert.equal(result.missingCityRelation, 1);
assert.equal(result.needsReview, 1);
assert.equal(result.rows[0]?.url, "/kvartiry/safe-slug-41/");
assert.equal(result.rows[0]?.city, "donetsk");
assert.equal(result.rows[0]?.district, "leninskiy");
assert.deepEqual(result.rows[1]?.reasons, ["city_relation"]);
assert.equal(JSON.stringify(result).includes(privateMarker), false);
assert.deepEqual(Object.keys(result.rows[0] ?? {}).sort(), [
	"category",
	"city",
	"dataIndexable",
	"dealType",
	"district",
	"market",
	"needsReview",
	"publicUrlId",
	"reasons",
	"row",
	"status",
	"url",
]);

console.log("verify-redacted-production-inventory: ok");
