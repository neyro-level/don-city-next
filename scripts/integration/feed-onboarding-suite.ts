import assert from "node:assert/strict";
import { getPayload } from "payload";
import config from "../../payload.config.ts";
import { systemOverrideAccess } from "../../src/core/data-access/system/overrides.ts";
import { ingestNormalizedFeed } from "../../src/core/ingest/feed-ingest.ts";
import { createPayloadFeedIngestRepository } from "../../src/core/ingest/payload-feed-ingest-repository.ts";

const uri = new URL(process.env.DATABASE_URI ?? "");
const database = uri.pathname.replace(/^\//, "");
assert.ok(["127.0.0.1", "localhost"].includes(uri.hostname));
assert.match(database, /_(?:dev|test)$/);

const payload = await getPayload({ config });
const access = systemOverrideAccess("controlled-maintenance");
const now = "2026-09-25T15:00:00.000Z";
const suffix = Date.now().toString(36);
const created: { collection: string; id: number }[] = [];
let owner: Awaited<ReturnType<typeof payload.create>> | undefined;

try {
	owner = await payload.create({
		collection: "users",
		data: {
			email: `epic39-${suffix}@example.test`,
			password: "EPIC-39-local-owner-A1!",
			roles: ["owner"],
		},
		...access,
	});
	created.push({ collection: "users", id: owner.id });

	const region = await payload.create({
		collection: "regions",
		data: {
			name: `EPIC-39 ДНР ${suffix}`,
			shortName: `ДНР ${suffix}`,
			slug: `epic39-region-${suffix}`,
			sortOrder: 390,
			ownerVerified: true,
			isPublished: true,
			publishedAt: now,
		},
		draft: false,
		...access,
	});
	created.push({ collection: "regions", id: region.id });

	const city = await payload.create({
		collection: "cities",
		data: {
			localityKind: "primary_city",
			agglomerationApproved: false,
			name: `EPIC-39 Донецк ${suffix}`,
			slug: `epic39-city-${suffix}`,
			region: region.id,
			sortOrder: 390,
			nameGenitive: "Донецка",
			nameLocative: "Донецке",
			preposition: "в",
			ownerVerified: true,
			isPublished: true,
			publishedAt: now,
		},
		draft: false,
		...access,
	});
	created.push({ collection: "cities", id: city.id });

	const district = await payload.create({
		collection: "districts",
		data: {
			name: `EPIC-39 Калининский ${suffix}`,
			slug: `epic39-district-${suffix}`,
			type: "administrative_district",
			city: city.id,
			sortOrder: 390,
			nameLocative: "Калининском районе",
			preposition: "в",
			ownerVerified: true,
			isPublished: true,
			publishedAt: now,
		},
		draft: false,
		...access,
	});
	created.push({ collection: "districts", id: district.id });

	const feedSource = await payload.create({
		collection: "feed-sources",
		data: {
			code: `epic39-${suffix}`,
			title: "EPIC-39 local fixture",
			parser: "yrl",
			market: "secondary",
			feedUrlRef: "EPIC39_LOCAL_FIXTURE_URL",
			enabled: false,
			refreshIntervalMinutes: 1440,
			safetyThresholdPercent: 30,
			maxDeactivationsPerRun: 50,
		},
		...access,
	});
	created.push({ collection: "feed-sources", id: feedSource.id });

	const createRun = async (queuedAt: string) => {
		const run = await payload.create({
			collection: "import-runs",
			data: { feedSource: feedSource.id, status: "running", queuedAt },
			...access,
		});
		created.push({ collection: "import-runs", id: run.id });
		return run;
	};
	const firstRun = await createRun(now);
	const repository = createPayloadFeedIngestRepository(
		payload,
		String(feedSource.id),
	);
	const baseOffer = {
		externalId: `property-${suffix}`,
		title: "EPIC-39 квартира",
		category: "квартира",
		dealType: "продажа",
		priceMinor: 8_000_000_00,
		currency: "RUB" as const,
		region: region.name,
		locality: city.name,
		district: district.name,
		landAreaNeedsReview: false,
		images: [],
	};
	await ingestNormalizedFeed({
		context: {
			feedSourceId: String(feedSource.id),
			feedSourceCode: feedSource.code,
			importRunId: String(firstRun.id),
			market: "secondary",
			nowIso: now,
		},
		offers: [baseOffer],
		repository,
	});

	const firstProperty = await payload.find({
		collection: "properties",
		where: { externalId: { equals: baseOffer.externalId } },
		limit: 1,
		depth: 0,
		...access,
	});
	assert.equal(firstProperty.totalDocs, 1);
	const property = firstProperty.docs[0];
	assert.ok(property);
	assert.ok(property.publicUrlId);
	assert.equal(property.needsReview, false);
	created.push({ collection: "properties", id: property.id });

	const secondRun = await createRun("2026-09-25T15:05:00.000Z");
	await ingestNormalizedFeed({
		context: {
			feedSourceId: String(feedSource.id),
			feedSourceCode: feedSource.code,
			importRunId: String(secondRun.id),
			market: "secondary",
			nowIso: "2026-09-25T15:05:00.000Z",
		},
		offers: [
			{
				...baseOffer,
				title: "EPIC-39 unknown taxonomy",
				category: "неизвестный объект",
				propertyType: "экспериментальный формат",
				dealType: "обмен",
			},
		],
		repository,
	});

	const updated = await payload.findByID({
		collection: "properties",
		id: property.id,
		depth: 0,
		...access,
	});
	assert.equal(updated.id, property.id);
	assert.equal(updated.publicUrlId, property.publicUrlId);
	assert.equal(updated.needsReview, true);
	assert.equal(updated.regionRaw, region.name);
	assert.equal(updated.cityRaw, city.name);
	assert.equal(updated.districtRaw, district.name);

	console.log("Feed onboarding Payload round trip: PASS");
} finally {
	for (const item of created.reverse()) {
		await payload.delete({
			collection: item.collection as never,
			id: item.id,
			...(item.collection === "feed-sources" && owner
				? { overrideAccess: false as const, user: owner }
				: access),
		});
	}
	await payload.destroy();
}
