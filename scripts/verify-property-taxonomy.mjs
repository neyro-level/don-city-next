import assert from "node:assert/strict";
import {
	buildFeedPropertyWriteData,
	normalizeHouseType,
	normalizeLandAreaToSotka,
	normalizeYrlOffer,
} from "../src/core/ingest/index.ts";
import { Properties } from "../src/project/collections/Properties.ts";

const context = {
	feedSourceId: "taxonomy-feed",
	feedSourceCode: "taxonomy",
	importRunId: "taxonomy-run",
	market: "secondary",
	nowIso: "2026-09-24T14:00:00.000Z",
};

assert.deepEqual(normalizeLandAreaToSotka("600", "sqm"), {
	plotAreaSotka: 6,
	needsReview: false,
});
assert.deepEqual(normalizeLandAreaToSotka("6", "соток"), {
	plotAreaSotka: 6,
	needsReview: false,
});
assert.deepEqual(normalizeLandAreaToSotka("0.06", "ha"), {
	plotAreaSotka: 6,
	needsReview: false,
});
assert.deepEqual(normalizeLandAreaToSotka("6", undefined), {
	needsReview: true,
});
assert.deepEqual(normalizeLandAreaToSotka("6", "acre"), {
	needsReview: true,
});

assert.equal(normalizeHouseType("дача"), "dacha");
assert.equal(normalizeHouseType("часть дома"), "part_of_house");
assert.equal(normalizeHouseType("townhouse"), "townhouse");

const landResult = normalizeYrlOffer(
	{
		externalId: "land-1",
		title: "Участок",
		category: "участок",
		type: "продажа",
		plotArea: "600",
		plotAreaUnit: "м2",
		landCategory: "земли населённых пунктов",
		permittedUse: "ИЖС",
		communications: ["электричество", "газ", "электричество"],
		pictures: [],
	},
	new Set(),
);
assert.equal(landResult.ok, true);
if (!landResult.ok) throw new Error("land feed fixture must normalize");
assert.deepEqual(landResult.offer.communications, ["электричество", "газ"]);
assert.equal(landResult.offer.plotAreaSotka, 6);
assert.equal(landResult.offer.landAreaNeedsReview, false);
const landWrite = buildFeedPropertyWriteData({
	context,
	offer: landResult.offer,
});
assert.equal(landWrite.category, "land");
assert.equal(landWrite.plotAreaSotka, 6);
assert.deepEqual(landWrite.communications, [
	{ value: "электричество" },
	{ value: "газ" },
]);

const ambiguousResult = normalizeYrlOffer(
	{
		externalId: "land-ambiguous",
		title: "Участок с неясной единицей",
		category: "участок",
		plotArea: "6",
		pictures: [],
	},
	new Set(),
);
assert.equal(ambiguousResult.ok, true);
if (!ambiguousResult.ok)
	throw new Error("ambiguous land fixture must normalize");
assert.equal(ambiguousResult.offer.plotAreaSotka, undefined);
assert.equal(ambiguousResult.offer.landAreaNeedsReview, true);

for (const [sourceCategory, expectedCategory] of [
	["квартира", "apartment"],
	["дом", "house"],
	["участок", "land"],
	["коммерция", "commercial"],
	["комната", "room"],
	["гараж", "garage"],
]) {
	const write = buildFeedPropertyWriteData({
		context,
		offer: {
			externalId: `category-${expectedCategory}`,
			title: expectedCategory,
			category: sourceCategory,
			currency: "RUB",
			images: [],
			landAreaNeedsReview: false,
		},
	});
	assert.equal(write.category, expectedCategory);
}

const fieldByName = new Map(
	Properties.fields.map((field) => [field.name, field]),
);
assert.deepEqual(
	fieldByName.get("category")?.options?.map((option) => option.value),
	["apartment", "house", "land", "commercial", "room", "garage"],
);
assert.deepEqual(
	fieldByName.get("houseType")?.options?.map((option) => option.value),
	["house", "cottage", "townhouse", "dacha", "part_of_house"],
);
for (const field of [
	"plotAreaSotka",
	"landCategory",
	"permittedUse",
	"communications",
	"landAreaNeedsReview",
]) {
	assert.ok(fieldByName.has(field), `properties field ${field} must exist`);
}

console.log("verify-property-taxonomy: ok");
