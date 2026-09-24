import assert from "node:assert/strict";
import { getPayload } from "payload";
import config from "../payload.config.ts";
import { systemOverrideAccess } from "../src/core/data-access/system/overrides.ts";
import { requirePayloadRuntime } from "../src/project/env.ts";
import { resolveFeedGeo } from "../src/project/geo/feed-match.ts";

requirePayloadRuntime();
const payload = await getPayload({ config });
const access = systemOverrideAccess("trusted-inspection");

try {
	const cities = await payload.find({
		collection: "cities",
		where: { slug: { equals: "donetsk" } },
		limit: 1,
		depth: 0,
		...access,
	});
	const city = cities.docs[0];
	assert.ok(city, "Donetsk seed is required for geo runtime verification.");

	await assert.rejects(
		payload.create({
			collection: "cities",
			data: {
				name: "Collision fixture",
				slug: "kvartiry",
				region: typeof city.region === "number" ? city.region : city.region.id,
				nameGenitive: "fixture",
				nameLocative: "fixture",
				preposition: "in",
				ownerVerified: false,
				sortOrder: 999,
				isPublished: false,
			},
			...access,
		}),
		/reserved root/,
	);

	await assert.rejects(
		payload.create({
			collection: "districts",
			data: {
				name: "Collision fixture",
				slug: "odnokomnatnye",
				type: "microdistrict",
				city: city.id,
				ownerVerified: false,
				sortOrder: 999,
				isPublished: false,
			},
			...access,
		}),
		/category or facet/,
	);

	const textilshchik = await payload.find({
		collection: "districts",
		where: {
			and: [
				{ city: { equals: city.id } },
				{ slug: { equals: "tekstilshchik" } },
			],
		},
		limit: 1,
		depth: 0,
		...access,
	});
	assert.equal(textilshchik.docs[0]?.parent ?? null, null);

	const known = await resolveFeedGeo(payload, {
		region: "ДНР",
		locality: "Донецк",
		district: "Текстильщик",
	});
	assert.equal(known.city, city.id);
	assert.equal(known.district, textilshchik.docs[0]?.id);
	assert.equal(known.needsReview, false);

	const unknown = await resolveFeedGeo(payload, {
		locality: "Донецк",
		district: "Unknown district from feed",
	});
	assert.equal(unknown.city, city.id);
	assert.equal(unknown.district, null);
	assert.equal(unknown.districtRaw, "Unknown district from feed");
	assert.equal(unknown.needsReview, true);

	payload.logger.info("verify-geo-runtime: ok");
} finally {
	await payload.destroy();
}
