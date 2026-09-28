import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const csv = read("docs/seo/SEO_REGISTRY_SEED.csv")
	.trim()
	.split(/\r?\n/u)
	.slice(1);
const gatedThresholds = csv
	.filter((row) => row.endsWith('"true","candidate"'))
	.map((row) => row.match(/,"(\d+)","true","candidate"$/u)?.[1]);
assert.equal(gatedThresholds.length, 26);
assert.deepEqual([...new Set(gatedThresholds)], ["3"]);

const provider = read("src/core/data-access/public/provider.ts");
assert.doesNotMatch(provider, /payload\.(?:create|update|delete)\s*\(/u);
assert.match(provider, /lastThresholdPassedAt:\s*content\.lastThresholdPassedAt/u);

const task = read("src/project/jobs/tasks.ts");
assert.match(task, /slug:\s*payloadJobTaskSlugs\.refreshListingContentGate/u);
assert.match(task, /collection:\s*"listing-contents"/u);
assert.match(task, /nextListingInventoryGateState/u);
assert.match(task, /req\.payload\.update\s*\(/u);

const collection = read("src/project/collections/ListingContents.ts");
for (const field of [
	"inventorySnapshot",
	"inventoryEvaluatedAt",
	"lastThresholdPassedAt",
]) {
	assert.match(collection, new RegExp(`name: "${field}"`, "u"));
}
assert.match(collection, /systemOperation === "system-job"/u);

const migration = read(
	"migrations/20260928_230500_listing_content_gate_state.ts",
);
for (const column of [
	"inventory_snapshot",
	"inventory_evaluated_at",
	"last_threshold_passed_at",
]) {
	assert.match(migration, new RegExp(column, "u"));
}

console.log(
	"Unified Content Gate persistence: PASS (threshold=3, one Payload store, public GET read-only).",
);
