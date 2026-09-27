import { getPayload } from "payload";
import config from "../../payload.config.ts";
import { systemOverrideAccess } from "../../src/core/data-access/system/overrides.ts";
import { requirePayloadRuntime } from "../../src/project/env.ts";
import {
	buildRedactedPropertyInventory,
	type RedactedGeoRow,
	type RedactedInventorySourceRow,
} from "./redacted-property-inventory.ts";

requirePayloadRuntime();
const payload = await getPayload({ config });
const access = systemOverrideAccess("trusted-inspection");

try {
	const propertiesResult = await payload.find({
		collection: "properties",
		where: { publishedAt: { exists: true } },
		pagination: false,
		depth: 0,
		sort: "id",
		select: {
			publicUrlId: true,
			slug: true,
			status: true,
			market: true,
			category: true,
			dealType: true,
			publishedAt: true,
			contentPurgedAt: true,
			needsReview: true,
			city: true,
			district: true,
		},
		...access,
	});

	const relationId = (value: unknown): number | null => {
		if (typeof value === "number" && Number.isInteger(value)) return value;
		if (
			typeof value === "object" &&
			value !== null &&
			typeof (value as { id?: unknown }).id === "number"
		) {
			return (value as { id: number }).id;
		}
		return null;
	};

	const properties: RedactedInventorySourceRow[] = propertiesResult.docs.map(
		(property) => ({
			publicUrlId: property.publicUrlId,
			slug: property.slug,
			status: property.status,
			market: property.market,
			category: property.category,
			dealType: property.dealType,
			publishedAt: property.publishedAt,
			contentPurgedAt: property.contentPurgedAt,
			needsReview: property.needsReview,
			cityId: relationId(property.city),
			districtId: relationId(property.district),
		}),
	);
	const cityIds = [
		...new Set(properties.flatMap((row) => (row.cityId ? [row.cityId] : []))),
	];
	const districtIds = [
		...new Set(
			properties.flatMap((row) => (row.districtId ? [row.districtId] : [])),
		),
	];

	const [citiesResult, districtsResult] = await Promise.all([
		cityIds.length
			? payload.find({
					collection: "cities",
					where: { id: { in: cityIds } },
					pagination: false,
					depth: 0,
					select: { slug: true, isPublished: true },
					...access,
				})
			: null,
		districtIds.length
			? payload.find({
					collection: "districts",
					where: { id: { in: districtIds } },
					pagination: false,
					depth: 0,
					select: { slug: true, isPublished: true },
					...access,
				})
			: null,
	]);

	const geoRows = (
		docs: readonly { id: number; slug: string; isPublished?: boolean | null }[],
	): RedactedGeoRow[] =>
		docs.map((row) => ({
			id: row.id,
			slug: row.slug,
			isPublished: row.isPublished === true,
		}));
	const inventory = buildRedactedPropertyInventory({
		properties,
		cities: geoRows(citiesResult?.docs ?? []),
		districts: geoRows(districtsResult?.docs ?? []),
	});

	process.stdout.write(
		`${JSON.stringify({
			schemaVersion: "1.0",
			capturedAt: new Date().toISOString(),
			mode: "read-only-redacted",
			...inventory,
		})}\n`,
	);
} finally {
	await payload.destroy();
}
