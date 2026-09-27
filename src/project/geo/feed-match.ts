import type { Payload } from "payload";
import { geoMatchSystemAccess } from "../../core/data-access/system/geo.ts";
import { relationId } from "./constraints.ts";

export type FeedGeoInput = {
	region?: string;
	locality?: string;
	district?: string;
};

export type FeedGeoMatch = {
	region: number | null;
	city: number | null;
	district: number | null;
	regionRaw?: string;
	cityRaw?: string;
	districtRaw?: string;
	needsReview: boolean;
};

function numericId(value: unknown): number | null {
	const id = relationId(value);
	if (id == null) return null;
	const numeric = Number(id);
	return Number.isInteger(numeric) && numeric > 0 ? numeric : null;
}

export function normalizeGeoLabel(value: unknown): string {
	return String(value ?? "")
		.trim()
		.toLocaleLowerCase("ru-RU")
		.replaceAll("ё", "е")
		.replace(/[^a-zа-я0-9]+/giu, " ")
		.trim()
		.replace(/\s+/g, " ");
}

function matchesLabel(
	value: string | undefined,
	candidate: { name?: string | null; slug?: string | null },
): boolean {
	const normalized = normalizeGeoLabel(value);
	return (
		normalized.length > 0 &&
		(normalizeGeoLabel(candidate.name) === normalized ||
			normalizeGeoLabel(candidate.slug) === normalized)
	);
}

type DistrictMatchCandidate = {
	name?: string | null;
	slug?: string | null;
	nameGenitive?: string | null;
	nameLocative?: string | null;
	synonyms?: { value?: string | null }[] | null;
};

function matchesDistrictLabel(
	value: string,
	candidate: DistrictMatchCandidate,
): boolean {
	const normalized = normalizeGeoLabel(value);
	if (!normalized) return false;
	const aliases = [
		candidate.name,
		candidate.slug,
		candidate.nameGenitive,
		candidate.nameLocative,
		...(candidate.synonyms?.map((item) => item.value) ?? []),
	]
		.map(normalizeGeoLabel)
		.filter(Boolean);
	const padded = ` ${normalized} `;
	return aliases.some(
		(alias) => normalized === alias || padded.includes(` ${alias} `),
	);
}

export async function resolveFeedGeo(
	payload: Payload,
	input: FeedGeoInput,
): Promise<FeedGeoMatch> {
	const regionRaw = input.region?.trim() || undefined;
	const cityRaw = input.locality?.trim() || undefined;
	const districtRaw = input.district?.trim() || undefined;
	let region: number | null = null;
	let city: number | null = null;
	let district: number | null = null;
	let matchedCity:
		| { id: unknown; region?: unknown; slug?: string | null }
		| undefined;

	if (cityRaw) {
		const cities = await payload.find({
			collection: "cities",
			limit: 1000,
			pagination: false,
			depth: 0,
			...geoMatchSystemAccess,
		});
		matchedCity = cities.docs.find((item) => matchesLabel(cityRaw, item));
		if (matchedCity) {
			city = numericId(matchedCity.id);
			region = numericId(matchedCity.region);
		}
	}

	if (!region && regionRaw) {
		const regions = await payload.find({
			collection: "regions",
			limit: 1000,
			pagination: false,
			depth: 0,
			...geoMatchSystemAccess,
		});
		region = numericId(
			regions.docs.find(
				(item) =>
					matchesLabel(regionRaw, item) ||
					normalizeGeoLabel(item.shortName) === normalizeGeoLabel(regionRaw),
			)?.id,
		);
	}

	if (city && districtRaw) {
		const districts = await payload.find({
			collection: "districts",
			where: { city: { equals: city } },
			limit: 1000,
			pagination: false,
			depth: 0,
			...geoMatchSystemAccess,
		});
		const districtMatch = districts.docs.find((item) =>
			matchesDistrictLabel(districtRaw, item),
		);
		district = numericId(districtMatch?.id);
	}

	return {
		region,
		city,
		district,
		regionRaw,
		cityRaw,
		districtRaw,
		needsReview: Boolean((cityRaw && !city) || (districtRaw && !district)),
	};
}
