import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const catalog = JSON.parse(
	readFileSync("scripts/data/doncity-listings.json", "utf8"),
);

assert.equal(catalog.schemaVersion, "1.0", "Unexpected catalog schema");
assert.equal(catalog.items.length, 12, "Exactly 12 listings are required");
assert.ok(
	catalog.items.filter((item) => item.category === "house").length >= 3,
	"At least 3 house/land-attached listings are required",
);
assert.equal(
	new Set(catalog.items.map((item) => item.externalId)).size,
	catalog.items.length,
	"Listing external IDs must be unique",
);
assert.equal(
	new Set(catalog.items.map((item) => item.slug)).size,
	catalog.items.length,
	"Listing slugs must be unique",
);

for (const item of catalog.items) {
	const source = new URL(item.sourceUrl);
	assert.equal(source.protocol, "https:", `${item.externalId}: source must use HTTPS`);
	assert.equal(source.hostname, "dnr.red", `${item.externalId}: source host is not approved`);
	assert.ok(item.sourceImageCount > 0, `${item.externalId}: images are required`);
	assert.ok(item.price > 0, `${item.externalId}: price is required`);
	const publicCopy = `${item.title}\n${item.publicAddress}\n${item.description}`;
	assert.doesNotMatch(publicCopy, /\+?7[\s(\-]*\d{3}/, `${item.externalId}: phone-like PII`);
}

console.log("DON CITY listing catalog: PASS (12 listings, 3 house/land-attached)");
