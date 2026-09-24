import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getPayload, type Payload } from "payload";
import config from "../payload.config.ts";
import { systemOverrideAccess } from "../src/core/data-access/system/overrides.ts";
import { requirePayloadRuntime } from "../src/project/env.ts";

type DistrictSeed = {
	name: string;
	slug: string;
	type: "administrative_district" | "microdistrict";
	citySlug: string;
	parentSlug: string;
	preposition: string;
	nameLocative: string;
	isPublished: boolean;
};

const access = systemOverrideAccess("geo-seed");
const publishedAt = "2026-09-24T00:00:00.000Z";

function parseCsvLine(line: string): string[] {
	const fields: string[] = [];
	let current = "";
	let quoted = false;
	for (let index = 0; index < line.length; index += 1) {
		const char = line[index];
		if (char === '"') {
			if (quoted && line[index + 1] === '"') {
				current += '"';
				index += 1;
			} else {
				quoted = !quoted;
			}
		} else if (char === "," && !quoted) {
			fields.push(current);
			current = "";
		} else {
			current += char;
		}
	}
	fields.push(current);
	return fields;
}

function loadDistrictSeeds(): DistrictSeed[] {
	const source = readFileSync(
		resolve(process.cwd(), "docs/seo/DISTRICT_REGISTRY_SEED.csv"),
		"utf8",
	).trim();
	const [headerLine, ...lines] = source.split(/\r?\n/);
	const headers = parseCsvLine(headerLine);
	return lines.map((line) => {
		const values = parseCsvLine(line);
		const row = Object.fromEntries(
			headers.map((key, index) => [key, values[index] ?? ""]),
		);
		if (
			row.type !== "administrative_district" &&
			row.type !== "microdistrict"
		) {
			throw new Error(`Unsupported district type for ${row.slug}.`);
		}
		return {
			name: row.name,
			slug: row.slug,
			type: row.type,
			citySlug: row.citySlug,
			parentSlug: row.parentSlug,
			preposition: row.preposition,
			nameLocative: row.nameLocative,
			isPublished: row.isPublished === "true",
		};
	});
}

async function findOne(
	payload: Payload,
	collection: "regions" | "cities",
	slug: string,
) {
	const result = await payload.find({
		collection,
		where: { slug: { equals: slug } },
		limit: 1,
		depth: 0,
		...access,
	});
	return result.docs[0];
}

async function findDistrict(
	payload: Payload,
	city: number | string,
	slug: string,
) {
	const result = await payload.find({
		collection: "districts",
		where: { and: [{ city: { equals: city } }, { slug: { equals: slug } }] },
		limit: 1,
		depth: 0,
		...access,
	});
	return result.docs[0];
}

async function upsertGeo(payload: Payload) {
	const regionData = {
		name: "Донецкая Народная Республика",
		shortName: "ДНР",
		slug: "donetskaya-narodnaya-respublika",
		ownerVerified: false,
		sortOrder: 10,
		isPublished: true,
		publishedAt,
	};
	const existingRegion = await findOne(payload, "regions", regionData.slug);
	const region = existingRegion
		? await payload.update({
				collection: "regions",
				id: existingRegion.id,
				data: regionData,
				...access,
			})
		: await payload.create({
				collection: "regions",
				data: regionData,
				...access,
			});

	const cityData = {
		name: "Донецк",
		slug: "donetsk",
		region: region.id,
		nameGenitive: "Донецка",
		nameLocative: "Донецке",
		preposition: "в",
		agglomerationOf: null,
		ownerVerified: false,
		sortOrder: 10,
		isPublished: true,
		publishedAt,
	};
	const existingCity = await findOne(payload, "cities", cityData.slug);
	const city = existingCity
		? await payload.update({
				collection: "cities",
				id: existingCity.id,
				data: cityData,
				...access,
			})
		: await payload.create({ collection: "cities", data: cityData, ...access });

	const seeds = loadDistrictSeeds();
	const ids = new Map<string, number>();
	for (const seed of seeds) {
		if (seed.citySlug !== city.slug)
			throw new Error(`Unknown seed city: ${seed.citySlug}.`);
		const existing = await findDistrict(payload, city.id, seed.slug);
		const data = {
			name: seed.name,
			slug: seed.slug,
			type: seed.type,
			city: city.id,
			parent: null,
			sortOrder: 100,
			preposition: seed.preposition || null,
			nameLocative: seed.nameLocative || null,
			ownerVerified: false,
			isPublished: seed.isPublished,
			publishedAt: seed.isPublished ? publishedAt : null,
		};
		const district = existing
			? await payload.update({
					collection: "districts",
					id: existing.id,
					data,
					...access,
				})
			: await payload.create({ collection: "districts", data, ...access });
		ids.set(seed.slug, district.id);
	}

	for (const seed of seeds.filter((item) => item.parentSlug)) {
		const id = ids.get(seed.slug);
		const parent = ids.get(seed.parentSlug);
		if (!id || !parent)
			throw new Error(`Unresolved district parent for ${seed.slug}.`);
		await payload.update({
			collection: "districts",
			id,
			data: { parent },
			...access,
		});
	}

	return { region: region.id, city: city.id, districts: seeds.length };
}

requirePayloadRuntime();
const payload = await getPayload({ config });
try {
	const result = await upsertGeo(payload);
	payload.logger.info(`geo seed complete: districts=${result.districts}`);
} finally {
	await payload.destroy();
}
