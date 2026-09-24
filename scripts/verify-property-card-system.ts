import assert from "node:assert/strict";
import { toPropertyCardDTO } from "../src/core/data-access/public/dto.ts";

type CardInput = Parameters<typeof toPropertyCardDTO>[0];

function property(input: {
	category: "apartment" | "house" | "land";
	slug: string;
	publicUrlId: number;
	locality: string;
	district: string;
}): CardInput {
	return {
		id: input.publicUrlId,
		slug: input.slug,
		publicUrlId: input.publicUrlId,
		status: "active",
		market: "secondary",
		category: input.category,
		dealType: "sale",
		priceMinor: null,
		currency: "RUB",
		pricePerMeterMinor: null,
		rooms: null,
		totalArea: null,
		livingArea: null,
		kitchenArea: null,
		floor: null,
		floors: null,
		locality: input.locality,
		district: input.district,
		publicAddress: null,
		lat: null,
		lng: null,
		title: "Проверяемый объект",
		description: null,
		updatedAt: "2026-09-24T00:00:00.000Z",
		images: null,
	};
}

const cases = [
	{
		input: property({
			category: "apartment",
			slug: "kvartira-v-kalininskom",
			publicUrlId: 101,
			locality: "Донецк",
			district: "Калининский район",
		}),
		href: "/kvartiry/kvartira-v-kalininskom-101/",
	},
	{
		input: property({
			category: "house",
			slug: "dom-v-budennovskom",
			publicUrlId: 102,
			locality: "Донецк",
			district: "Будённовский район",
		}),
		href: "/doma/dom-v-budennovskom-102/",
	},
	{
		input: property({
			category: "land",
			slug: "uchastok-v-tekstilshchike",
			publicUrlId: 103,
			locality: "Донецк",
			district: "Текстильщик",
		}),
		href: "/uchastki/uchastok-v-tekstilshchike-103/",
	},
] as const;

for (const item of cases) {
	const card = toPropertyCardDTO(item.input);
	assert.equal(card.href, item.href);
	assert.equal(card.city, item.input.locality);
	assert.equal(card.district, item.input.district);
	assert.ok(!card.href.startsWith("/obekty/"));
}

console.log("EPIC-27 property card system: PASS");
