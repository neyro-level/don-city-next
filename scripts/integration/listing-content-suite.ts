import assert from "node:assert/strict";
import { getPayload } from "payload";
import config from "../../payload.config.ts";
import { countPublicCatalogProperties } from "../../src/core/data-access/public/catalog.ts";
import { findApprovedListingContent } from "../../src/core/data-access/public/listing-content.ts";
import { systemOverrideAccess } from "../../src/core/data-access/system/overrides.ts";
import { evaluateListingContentGate } from "../../src/platform/seo/content-gate.ts";
import { nextListingInventoryGateState } from "../../src/platform/seo/content-gate-state.ts";
import { seoRegistryById } from "../../src/project/seo-registry.generated.ts";
import { siteProfile } from "../../src/project/site.profile.ts";

const uri = new URL(process.env.DATABASE_URI ?? "");
const database = uri.pathname.replace(/^\//, "");
assert.ok(["127.0.0.1", "localhost"].includes(uri.hostname));
assert.match(database, /_(?:dev|test)$/);

const payload = await getPayload({ config });
const access = systemOverrideAccess("controlled-maintenance");
const now = "2026-09-25T12:00:00.000Z";
const created: { collection: string; id: number }[] = [];

try {
	const owner = await payload.create({
		collection: "users",
		data: {
			email: "epic38-owner@example.test",
			password: "EPIC-38-local-owner-A1!",
			roles: ["owner"],
		},
		...access,
	});
	created.push({ collection: "users", id: owner.id });

	const region = await payload.create({
		collection: "regions",
		data: {
			name: "Донецкая Народная Республика",
			shortName: "ДНР",
			slug: "donetskaya-narodnaya-respublika",
			sortOrder: 1,
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
			name: "Донецк",
			slug: "donetsk",
			region: region.id,
			sortOrder: 1,
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
			name: "Калининский район",
			slug: "kalininskiy",
			type: "administrative_district",
			city: city.id,
			sortOrder: 1,
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

	for (let index = 1; index <= 5; index += 1) {
		const property = await payload.create({
			collection: "properties",
			data: {
				origin: "manual",
				status: "active",
				publishedAt: now,
				slug: `epic38-kalininskiy-${index}`,
				market: "secondary",
				category: "apartment",
				dealType: "sale",
				region: region.id,
				city: city.id,
				district: district.id,
				title: `EPIC-38 квартира ${index}`,
			},
			...access,
		});
		created.push({ collection: "properties", id: property.id });
	}

	const introduction =
		"Уникальный проверенный текст Калининской страницы. ".repeat(14);
	await assert.rejects(
		() =>
			payload.create({
				collection: "listing-contents",
				data: {
					registryId: "APT_DIST_KALIN",
					status: "approved",
					introduction,
					contextFacts: [{ source: "owner fixture", checkedAt: now }],
				},
				overrideAccess: false,
				user: { ...owner, roles: ["admin"] },
			}),
		/Only an owner/,
	);
	const listingContent = await payload.create({
		collection: "listing-contents",
		data: {
			registryId: "APT_DIST_KALIN",
			status: "approved",
			introduction,
			contextFacts: [{ source: "owner fixture", checkedAt: now }],
		},
		overrideAccess: false,
		user: owner,
	});
	created.push({ collection: "listing-contents", id: listingContent.id });
	const persistedState = nextListingInventoryGateState({
		activeObjects: 5,
		threshold: 3,
		now: new Date(now),
	});
	await payload.update({
		collection: "listing-contents",
		id: listingContent.id,
		data: persistedState,
		...systemOverrideAccess("system-job"),
	});
	await assert.rejects(
		() =>
			payload.update({
				collection: "listing-contents",
				id: listingContent.id,
				data: { introduction: "б".repeat(600) },
				...systemOverrideAccess("system-job"),
			}),
		/Only an owner/,
		"Content Gate maintenance must not mutate approved editorial content.",
	);

	const [content, activeObjects] = await Promise.all([
		findApprovedListingContent(payload, "APT_DIST_KALIN"),
		countPublicCatalogProperties(payload, {
			category: "apartment",
			geoSlug: "donetsk",
			districtSlug: "kalininskiy",
		}),
	]);
	assert.equal(content?.introduction, introduction);
	assert.equal(content?.lastThresholdPassedAt, now);
	assert.equal(activeObjects, 5);
	const entry = seoRegistryById.get("APT_DIST_KALIN");
	assert.ok(entry);
	assert.equal(
		evaluateListingContentGate(entry, siteProfile, {
			activeObjects,
			introduction: content?.introduction ?? "",
			contextFacts: content?.contextFacts,
			serverRendered: true,
			propertyLinksInHtml: true,
			lastThresholdPassedAt: content?.lastThresholdPassedAt,
		}).passed,
		true,
	);
	console.log("Listing content Payload round trip: PASS");
} finally {
	for (const item of created.reverse()) {
		await payload.delete({
			collection: item.collection as never,
			id: item.id,
			...access,
		});
	}
	await payload.destroy();
}
