import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { Payload } from "payload";
import {
	districtCollisionSlugs,
	reservedGeoRoots,
	validateCitySlug,
	validateDistrictSlug,
} from "../src/project/geo/constraints.ts";
import { resolveFeedGeo } from "../src/project/geo/feed-match.ts";
import { siteProfile } from "../src/project/site.profile.ts";

assert.throws(() => validateCitySlug("kvartiry"), /reserved root/);
assert.throws(() => validateDistrictSlug("odnokomnatnye"), /category or facet/);
assert.equal(validateCitySlug("donetsk"), "donetsk");
assert.equal(validateDistrictSlug("tekstilshchik"), "tekstilshchik");

const categories = new Set(Object.keys(siteProfile.categoryStatus));
for (const facet of Object.values(siteProfile.facetWhitelist).flat()) {
	assert.equal(
		categories.has(facet),
		false,
		`Facet collides with category: ${facet}`,
	);
	assert.equal(districtCollisionSlugs.has(facet), true);
}
for (const category of categories)
	assert.equal(reservedGeoRoots.has(category), true);

const csv = readFileSync("docs/seo/DISTRICT_REGISTRY_SEED.csv", "utf8");
const textilshchik = csv
	.split(/\r?\n/)
	.find((line) => line.includes('"tekstilshchik"'));
assert.ok(textilshchik, "Textilshchik seed must exist.");
assert.match(
	textilshchik,
	/"tekstilshchik","microdistrict","donetsk","","на","Текстильщике","Текстильщика"/,
);

const districtFixtures = ([
	[20, "Будённовский", "budennovskiy", "Будённовского", "Будённовском", "Будённовский район"],
	[21, "Ворошиловский", "voroshilovskiy", "Ворошиловского", "Ворошиловском", "Ворошиловский район"],
	[22, "Калининский", "kalininskiy", "Калининского", "Калининском", "Калининский район"],
	[23, "Киевский", "kievskiy", "Киевского", "Киевском", "Киевский район"],
	[24, "Кировский", "kirovskiy", "Кировского", "Кировском", "Кировский район"],
	[25, "Куйбышевский", "kuybyshevskiy", "Куйбышевского", "Куйбышевском", "Куйбышевский район"],
	[26, "Ленинский", "leninskiy", "Ленинского", "Ленинском", "Ленинский район"],
	[27, "Петровский", "petrovskiy", "Петровского", "Петровском", "Петровский район"],
	[28, "Пролетарский", "proletarskiy", "Пролетарского", "Пролетарском", "Пролетарский район"],
	[11, "Текстильщик", "tekstilshchik", "Текстильщика", "Текстильщике", "мкр. Текстильщик"],
] as const).map(([id, name, slug, nameGenitive, nameLocative, synonym]) => ({
	id,
	name,
	slug,
	nameGenitive,
	nameLocative,
	synonyms: [{ value: synonym }],
}));

const calls: unknown[] = [];
const payload = {
	async find(input: Record<string, unknown>) {
		calls.push(input);
		if (input.collection === "cities") {
			return { docs: [{ id: 7, name: "Донецк", slug: "donetsk", region: 3 }] };
		}
		if (input.collection === "districts") {
			assert.deepEqual(input.where, { city: { equals: 7 } });
			return { docs: districtFixtures };
		}
		if (input.collection === "regions") return { docs: [] };
		throw new Error(`Unexpected collection: ${String(input.collection)}`);
	},
} as unknown as Payload;

const matched = await resolveFeedGeo(payload, {
	region: "ДНР",
	locality: "Донецк",
	district: "Текстильщик",
});
assert.deepEqual(matched, {
	region: 3,
	city: 7,
	district: 11,
	regionRaw: "ДНР",
	cityRaw: "Донецк",
	districtRaw: "Текстильщик",
	needsReview: false,
});

const containedTextilshchik = await resolveFeedGeo(payload, {
	locality: "Донецк",
	district: "мкр. Текстильщик, Донецк",
});
assert.equal(containedTextilshchik.district, 11);
assert.equal(containedTextilshchik.needsReview, false);

for (const districtFixture of districtFixtures.filter(
	(item) => item.slug !== "tekstilshchik",
)) {
	const bySynonym = await resolveFeedGeo(payload, {
		locality: "Донецк",
		district: districtFixture.synonyms[0]?.value,
	});
	assert.equal(bySynonym.district, districtFixture.id);
	assert.equal(bySynonym.needsReview, false);

	const byLocative = await resolveFeedGeo(payload, {
		locality: "Донецк",
		district: `${districtFixture.nameLocative} районе`,
	});
	assert.equal(byLocative.district, districtFixture.id);
	assert.equal(byLocative.needsReview, false);
}

const otherCityPayload = {
	async find(input: Record<string, unknown>) {
		if (input.collection === "cities") {
			return {
				docs: [{ id: 8, name: "Макеевка", slug: "makeyevka", region: 3 }],
			};
		}
		if (input.collection === "districts") {
			assert.deepEqual(input.where, { city: { equals: 8 } });
			return { docs: [{ id: 12, name: "Другой район", slug: "other" }] };
		}
		if (input.collection === "regions") return { docs: [] };
		throw new Error(`Unexpected collection: ${String(input.collection)}`);
	},
} as unknown as Payload;
const cityScoped = await resolveFeedGeo(otherCityPayload, {
	locality: "Макеевка",
	district: "мкр. Текстильщик",
});
assert.equal(cityScoped.district, null);
assert.equal(cityScoped.needsReview, true);

const unknown = await resolveFeedGeo(payload, {
	locality: "Донецк",
	district: "Неизвестный район",
});
assert.equal(unknown.city, 7);
assert.equal(unknown.district, null);
assert.equal(unknown.districtRaw, "Неизвестный район");
assert.equal(unknown.needsReview, true);
assert.ok(calls.length >= 4);

console.log("verify-geo-model: ok");
