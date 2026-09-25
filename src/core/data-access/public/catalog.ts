import "server-only";

import type {
	PropertyCategory,
	PropertyDealType,
	PropertyLocationDTO,
	PropertySort,
	PropertyView,
} from "@ams/realtbase-contracts";
import type { Payload, Where } from "payload";
import { z } from "zod";
import { sanitizeExplicitRedirectPath } from "@/core/seo/redirect-path";
import type {
	CitiesSelect,
	City,
	District,
	DistrictsSelect,
	PropertiesSelect,
	Property,
	Region,
	RegionsSelect,
} from "@/project/payload-types";
import { buildPropertyUrl } from "@/project/url-grammar";
import {
	type HouseType,
	houseTypes,
} from "../../../platform/catalog/house-types.ts";
import {
	landFacetSlugs,
	permittedUseForLandFacet,
} from "../../../platform/catalog/land-facets.ts";
import {
	aggregatePublicCatalogFacets,
	findPublicPropertyLifecycleRow,
	findPublicPropertyLifecycleRowByPublicUrlId,
	findPublicRedirectByFromPath,
	listPublicSitemapPropertiesPage,
	publicRedirectDestinationIsChain,
} from "./payload-reads";
import { publicGatewayPolicy } from "./policy";
import {
	type R1PublicPropertyCategory,
	r1PublicPropertyCategories,
	r1PublicPropertyPublicationClauses,
} from "./property-policy";

const publicPropertySelect = {
	slug: true,
	publicUrlId: true,
	status: true,
	publishedAt: true,
	contentPurgedAt: true,
	market: true,
	category: true,
	dealType: true,
	priceMinor: true,
	currency: true,
	pricePerMeterMinor: true,
	rooms: true,
	totalArea: true,
	livingArea: true,
	kitchenArea: true,
	floor: true,
	floors: true,
	region: true,
	city: true,
	district: true,
	publicAddress: true,
	lat: true,
	lng: true,
	title: true,
	description: true,
	images: {
		kind: true,
		url: true,
		alt: true,
		order: true,
	},
	updatedAt: true,
} satisfies PropertiesSelect<true>;

const propertyCategorySchema = z.enum([...r1PublicPropertyCategories]);
const propertyDealTypeSchema = z.enum(["sale", "rent"]);
const propertySortSchema = z.enum([
	"recommended",
	"newest",
	"priceAsc",
	"priceDesc",
]);
const propertyViewSchema = z.enum(["grid", "list", "map"]);
const landUseFacetSchema = z.enum(landFacetSlugs);
const houseTypeSchema = z.enum(houseTypes);

const optionalPositiveInt = z.coerce.number().int().positive().optional();
const optionalNonNegativeNumber = z.coerce.number().nonnegative().optional();

export const catalogQuerySchema = z
	.object({
		page: z.coerce.number().int().positive().default(1),
		limit: z.coerce
			.number()
			.int()
			.min(1)
			.max(publicGatewayPolicy.maxLimit)
			.default(24),
		sort: propertySortSchema.default("recommended"),
		view: propertyViewSchema.default("grid"),
		query: z.string().trim().min(1).max(120).optional(),
		category: propertyCategorySchema.optional(),
		dealType: propertyDealTypeSchema.optional(),
		geoSlug: z.string().trim().min(1).max(80).optional(),
		districtSlug: z.string().trim().min(1).max(80).optional(),
		rooms: z.array(optionalPositiveInt.unwrap()).max(8).optional(),
		houseType: houseTypeSchema.optional(),
		landUse: landUseFacetSchema.optional(),
		priceFromMinor: optionalPositiveInt,
		priceToMinor: optionalPositiveInt,
		areaFrom: optionalNonNegativeNumber,
		areaTo: optionalNonNegativeNumber,
	})
	.superRefine((value, context) => {
		if (value.districtSlug && !value.geoSlug) {
			context.addIssue({
				code: "custom",
				path: ["districtSlug"],
				message: "districtSlug requires geoSlug.",
			});
		}
		if (value.houseType && value.category !== "house") {
			context.addIssue({
				code: "custom",
				path: ["houseType"],
				message: "houseType requires category=house.",
			});
		}
	});

export type CatalogQueryInput = z.input<typeof catalogQuerySchema>;
export type CatalogQuery = z.output<typeof catalogQuerySchema>;

type PublicCatalogSelectedProperty = Omit<
	Pick<
		Property,
		| "id"
		| "slug"
		| "publicUrlId"
		| "status"
		| "market"
		| "category"
		| "dealType"
		| "priceMinor"
		| "currency"
		| "pricePerMeterMinor"
		| "rooms"
		| "totalArea"
		| "livingArea"
		| "kitchenArea"
		| "floor"
		| "floors"
		| "region"
		| "city"
		| "district"
		| "publicAddress"
		| "lat"
		| "lng"
		| "title"
		| "description"
		| "images"
		| "updatedAt"
		| "publishedAt"
		| "contentPurgedAt"
	>,
	"category"
> & {
	category: R1PublicPropertyCategory;
	publicUrlId: number;
};

export type PublicCatalogProperty = Omit<
	PublicCatalogSelectedProperty,
	"region" | "city" | "district" | "publishedAt" | "contentPurgedAt"
> & {
	locality?: string | null;
	district?: string | null;
	geo?: PropertyLocationDTO;
};

export type PublicPropertyLifecycleLookup =
	| { found: false }
	| {
			found: true;
			status: Property["status"];
			publishedAt?: string | null;
			contentPurgedAt?: string | null;
			explicitRedirectPath?: string | null;
	  };

export type PublicCatalogResult = {
	items: readonly PublicCatalogProperty[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
	applied: {
		query?: string;
		category?: PropertyCategory;
		dealType?: PropertyDealType;
		city?: string;
		district?: string;
		rooms?: readonly number[];
		buildingType?: HouseType;
		priceFromMinor?: number;
		priceToMinor?: number;
		areaFrom?: number;
		areaTo?: number;
		sort: PropertySort;
		view: PropertyView;
	};
};

type PublicRegion = Pick<
	Region,
	"id" | "name" | "shortName" | "slug" | "isPublished"
>;
type PublicCity = Pick<
	City,
	| "id"
	| "name"
	| "slug"
	| "region"
	| "nameGenitive"
	| "nameLocative"
	| "preposition"
	| "isPublished"
>;
type PublicDistrict = Pick<
	District,
	| "id"
	| "name"
	| "slug"
	| "type"
	| "city"
	| "parent"
	| "nameLocative"
	| "preposition"
	| "isPublished"
>;

type PublicGeoIndex = {
	readonly cities: ReadonlyMap<number, PropertyLocationDTO["city"]>;
	readonly districts: ReadonlyMap<
		number,
		NonNullable<PropertyLocationDTO["district"]>
	>;
};

const publicRegionSelect = {
	name: true,
	shortName: true,
	slug: true,
	isPublished: true,
} satisfies RegionsSelect<true>;

const publicCitySelect = {
	name: true,
	slug: true,
	region: true,
	nameGenitive: true,
	nameLocative: true,
	preposition: true,
	isPublished: true,
} satisfies CitiesSelect<true>;

const publicDistrictSelect = {
	name: true,
	slug: true,
	type: true,
	city: true,
	parent: true,
	nameLocative: true,
	preposition: true,
	isPublished: true,
} satisfies DistrictsSelect<true>;

export type PublicCatalogFacetsResult = {
	source: "payload-aggregate";
	total: number;
	categories: readonly { value: PropertyCategory; count: number }[];
	dealTypes: readonly { value: PropertyDealType; count: number }[];
	cities: readonly { value: string; count: number }[];
	districts: readonly { value: string; count: number }[];
	rooms: readonly { value: number; count: number }[];
	houseTypes: readonly { value: HouseType; count: number }[];
	priceMinor: {
		min: number | null;
		max: number | null;
	};
};

export const publicPropertyPublicationWhere: Where = {
	and: [
		{ status: { equals: "active" } },
		{ publishedAt: { exists: true } },
		{ contentPurgedAt: { exists: false } },
		{ publicUrlId: { exists: true } },
		...r1PublicPropertyPublicationClauses(),
	],
};

export const publicPropertyRetainedArchivedWhere: Where = {
	and: [
		{ status: { equals: "archived" } },
		{ publishedAt: { exists: true } },
		{ contentPurgedAt: { exists: false } },
		{ publicUrlId: { exists: true } },
		...r1PublicPropertyPublicationClauses(),
	],
};

export const publicPropertyDetailsWhere: Where = {
	or: [publicPropertyPublicationWhere, publicPropertyRetainedArchivedWhere],
};

function relationId(value: unknown): number | null {
	const raw =
		typeof value === "object" && value !== null
			? (value as { id?: unknown }).id
			: value;
	if (typeof raw === "number" && Number.isInteger(raw)) return raw;
	if (typeof raw === "string" && /^\d+$/.test(raw)) return Number(raw);
	return null;
}

function relationshipIds(
	properties: readonly Pick<
		PublicCatalogSelectedProperty,
		"region" | "city" | "district"
	>[],
) {
	const regions = new Set<number>();
	const cities = new Set<number>();
	const districts = new Set<number>();
	for (const property of properties) {
		const region = relationId(property.region);
		const city = relationId(property.city);
		const district = relationId(property.district);
		if (region != null) regions.add(region);
		if (city != null) cities.add(city);
		if (district != null) districts.add(district);
	}
	return { regions, cities, districts };
}

async function loadPublicGeoIndex(
	payload: Payload,
	properties: readonly Pick<
		PublicCatalogSelectedProperty,
		"region" | "city" | "district"
	>[],
): Promise<PublicGeoIndex> {
	const ids = relationshipIds(properties);
	if (!ids.cities.size) {
		return { cities: new Map(), districts: new Map() };
	}

	const citiesResult = await payload.find({
		collection: "cities",
		where: {
			and: [{ id: { in: [...ids.cities] } }, { isPublished: { equals: true } }],
		},
		limit: ids.cities.size,
		pagination: false,
		depth: 0,
		select: publicCitySelect,
		overrideAccess: publicGatewayPolicy.overrideAccess,
		context: publicGatewayPolicy.context,
	});
	const cityRows = citiesResult.docs as PublicCity[];
	for (const city of cityRows) {
		const region = relationId(city.region);
		if (region != null) ids.regions.add(region);
	}
	const [regionsResult, districtsResult] = await Promise.all([
		payload.find({
			collection: "regions",
			where: {
				and: [
					{ id: { in: [...ids.regions] } },
					{ isPublished: { equals: true } },
				],
			},
			limit: ids.regions.size,
			pagination: false,
			depth: 0,
			select: publicRegionSelect,
			overrideAccess: publicGatewayPolicy.overrideAccess,
			context: publicGatewayPolicy.context,
		}),
		ids.districts.size
			? payload.find({
					collection: "districts",
					where: {
						and: [
							{ id: { in: [...ids.districts] } },
							{ isPublished: { equals: true } },
						],
					},
					limit: ids.districts.size,
					pagination: false,
					depth: 0,
					select: publicDistrictSelect,
					overrideAccess: publicGatewayPolicy.overrideAccess,
					context: publicGatewayPolicy.context,
				})
			: null,
	]);

	const regions = new Map<number, PropertyLocationDTO["region"]>();
	for (const region of regionsResult.docs as PublicRegion[]) {
		if (!region.isPublished) continue;
		regions.set(region.id, {
			id: String(region.id),
			slug: region.slug,
			name: region.name,
			shortName: region.shortName,
			isPublished: true,
		});
	}
	const cities = new Map<number, PropertyLocationDTO["city"]>();
	for (const city of cityRows) {
		const region = regions.get(relationId(city.region) ?? -1);
		if (!city.isPublished || !region) continue;
		cities.set(city.id, {
			id: String(city.id),
			slug: city.slug,
			name: city.name,
			region,
			nameGenitive: city.nameGenitive,
			nameLocative: city.nameLocative,
			preposition: city.preposition,
			isPublished: true,
		});
	}
	const districts = new Map<
		number,
		NonNullable<PropertyLocationDTO["district"]>
	>();
	for (const district of (districtsResult?.docs ?? []) as PublicDistrict[]) {
		const city = cities.get(relationId(district.city) ?? -1);
		if (!district.isPublished || !city) continue;
		districts.set(district.id, {
			id: String(district.id),
			slug: district.slug,
			name: district.name,
			type: district.type,
			city: { id: city.id, slug: city.slug, name: city.name },
			...(district.nameLocative ? { nameLocative: district.nameLocative } : {}),
			...(district.preposition ? { preposition: district.preposition } : {}),
			isPublished: true,
		});
	}
	return { cities, districts };
}

function publicGeoForProperty(
	property: Pick<PublicCatalogSelectedProperty, "city" | "district">,
	index: PublicGeoIndex,
): PropertyLocationDTO | undefined {
	const city = index.cities.get(relationId(property.city) ?? -1);
	if (!city) return undefined;
	const district = index.districts.get(relationId(property.district) ?? -1);
	return {
		region: city.region,
		city,
		...(district && district.city.id === city.id ? { district } : {}),
	};
}

async function resolvePublishedCatalogGeo(
	payload: Payload,
	query: CatalogQuery,
): Promise<{
	city?: PropertyLocationDTO["city"];
	district?: NonNullable<PropertyLocationDTO["district"]>;
} | null> {
	if (!query.geoSlug) return {};
	const cityResult = await payload.find({
		collection: "cities",
		where: {
			and: [
				{ slug: { equals: query.geoSlug } },
				{ isPublished: { equals: true } },
			],
		},
		limit: 1,
		depth: 0,
		select: publicCitySelect,
		overrideAccess: publicGatewayPolicy.overrideAccess,
		context: publicGatewayPolicy.context,
	});
	const city = cityResult.docs[0] as PublicCity | undefined;
	if (!city?.isPublished) return null;
	const regionId = relationId(city.region);
	if (regionId == null) return null;
	const regionResult = await payload.find({
		collection: "regions",
		where: {
			and: [{ id: { equals: regionId } }, { isPublished: { equals: true } }],
		},
		limit: 1,
		depth: 0,
		select: publicRegionSelect,
		overrideAccess: publicGatewayPolicy.overrideAccess,
		context: publicGatewayPolicy.context,
	});
	const region = regionResult.docs[0] as PublicRegion | undefined;
	if (!region?.isPublished) return null;
	const publicCity: PropertyLocationDTO["city"] = {
		id: String(city.id),
		slug: city.slug,
		name: city.name,
		region: {
			id: String(region.id),
			slug: region.slug,
			name: region.name,
			shortName: region.shortName,
			isPublished: true,
		},
		nameGenitive: city.nameGenitive,
		nameLocative: city.nameLocative,
		preposition: city.preposition,
		isPublished: true,
	};
	if (!query.districtSlug) return { city: publicCity };
	const districtResult = await payload.find({
		collection: "districts",
		where: {
			and: [
				{ slug: { equals: query.districtSlug } },
				{ city: { equals: city.id } },
				{ isPublished: { equals: true } },
			],
		},
		limit: 1,
		depth: 0,
		select: publicDistrictSelect,
		overrideAccess: publicGatewayPolicy.overrideAccess,
		context: publicGatewayPolicy.context,
	});
	const district = districtResult.docs[0] as PublicDistrict | undefined;
	if (!district?.isPublished || relationId(district.city) !== city.id)
		return null;
	return {
		city: publicCity,
		district: {
			id: String(district.id),
			slug: district.slug,
			name: district.name,
			type: district.type,
			city: { id: publicCity.id, slug: publicCity.slug, name: publicCity.name },
			...(district.nameLocative ? { nameLocative: district.nameLocative } : {}),
			...(district.preposition ? { preposition: district.preposition } : {}),
			isPublished: true,
		},
	};
}

function buildCatalogWhere(
	query: CatalogQuery,
	geo: {
		city?: PropertyLocationDTO["city"];
		district?: NonNullable<PropertyLocationDTO["district"]>;
	},
): Where {
	const and: Where[] = [publicPropertyPublicationWhere];

	if (query.query) {
		and.push({
			or: [
				{ title: { contains: query.query } },
				{ publicAddress: { contains: query.query } },
			],
		});
	}

	if (query.category) and.push({ category: { equals: query.category } });
	if (query.dealType) and.push({ dealType: { equals: query.dealType } });
	if (geo.city) and.push({ city: { equals: Number(geo.city.id) } });
	if (geo.district) and.push({ district: { equals: Number(geo.district.id) } });
	if (query.rooms?.length) and.push({ rooms: { in: query.rooms } });
	if (query.houseType) and.push({ houseType: { equals: query.houseType } });
	if (query.landUse) {
		and.push({
			permittedUse: {
				contains: permittedUseForLandFacet(query.landUse),
			},
		});
	}
	if (query.priceFromMinor)
		and.push({ priceMinor: { greater_than_equal: query.priceFromMinor } });
	if (query.priceToMinor)
		and.push({ priceMinor: { less_than_equal: query.priceToMinor } });
	if (query.areaFrom)
		and.push({ totalArea: { greater_than_equal: query.areaFrom } });
	if (query.areaTo) and.push({ totalArea: { less_than_equal: query.areaTo } });

	return { and };
}

function sortForCatalog(sort: PropertySort): string {
	switch (sort) {
		case "newest":
			return "-publishedAt";
		case "priceAsc":
			return "priceMinor";
		case "priceDesc":
			return "-priceMinor";
		default:
			return "-publishedAt";
	}
}

function emptyCatalogResult(query: CatalogQuery): PublicCatalogResult {
	return {
		items: [],
		total: 0,
		page: query.page,
		pageSize: query.limit,
		totalPages: 0,
		applied: {
			query: query.query,
			category: query.category,
			dealType: query.dealType,
			rooms: query.rooms,
			buildingType: query.houseType,
			priceFromMinor: query.priceFromMinor,
			priceToMinor: query.priceToMinor,
			areaFrom: query.areaFrom,
			areaTo: query.areaTo,
			sort: query.sort,
			view: query.view,
		},
	};
}

function emptyCatalogFacetsResult(): PublicCatalogFacetsResult {
	return {
		source: "payload-aggregate",
		total: 0,
		categories: [],
		dealTypes: [],
		cities: [],
		districts: [],
		rooms: [],
		houseTypes: [],
		priceMinor: { min: null, max: null },
	};
}

function toPublicCatalogProperty(
	property: PublicCatalogSelectedProperty,
	geo: PropertyLocationDTO | undefined,
): PublicCatalogProperty {
	return {
		id: property.id,
		slug: property.slug,
		publicUrlId: property.publicUrlId,
		status: property.status,
		market: property.market,
		category: property.category,
		dealType: property.dealType,
		priceMinor: property.priceMinor,
		currency: property.currency,
		pricePerMeterMinor: property.pricePerMeterMinor,
		rooms: property.rooms,
		totalArea: property.totalArea,
		livingArea: property.livingArea,
		kitchenArea: property.kitchenArea,
		floor: property.floor,
		floors: property.floors,
		locality: geo?.city.name,
		district: geo?.district?.name,
		geo,
		publicAddress: property.publicAddress,
		lat: property.lat,
		lng: property.lng,
		title: property.title,
		description: property.description,
		updatedAt: property.updatedAt,
		images:
			property.images?.map((image) => ({
				kind: image.kind,
				url: image.url,
				alt: image.alt,
				order: image.order,
				id: image.id,
			})) ?? null,
	};
}

export async function findPublicSitemapProperties(
	payload: Payload,
	input: { limit: number; offset: number } = { limit: 500, offset: 0 },
): Promise<
	readonly {
		slug: string;
		publicUrlId: number;
		category: R1PublicPropertyCategory;
		updatedAt: string;
	}[]
> {
	return listPublicSitemapPropertiesPage(payload, input).then((items) =>
		items.flatMap((item) =>
			r1PublicPropertyCategories.includes(
				item.category as R1PublicPropertyCategory,
			)
				? [
						{
							...item,
							category: item.category as R1PublicPropertyCategory,
						},
					]
				: [],
		),
	);
}

export async function findPublicCatalogProperties(
	payload: Payload,
	input: CatalogQueryInput,
): Promise<PublicCatalogResult> {
	const query = catalogQuerySchema.parse(input);
	const resolvedGeo = await resolvePublishedCatalogGeo(payload, query);
	if (resolvedGeo === null) return emptyCatalogResult(query);
	const where = buildCatalogWhere(query, resolvedGeo);

	const result = await payload.find({
		collection: "properties",
		where,
		depth: publicGatewayPolicy.depth,
		limit: query.limit,
		page: query.page,
		sort: sortForCatalog(query.sort),
		select: publicPropertySelect,
		overrideAccess: publicGatewayPolicy.overrideAccess,
		context: publicGatewayPolicy.context,
	});

	const properties = result.docs as PublicCatalogSelectedProperty[];
	const geoIndex = await loadPublicGeoIndex(payload, properties);
	return {
		items: properties.map((property) =>
			toPublicCatalogProperty(
				property,
				publicGeoForProperty(property, geoIndex),
			),
		),
		total: result.totalDocs,
		page: result.page ?? query.page,
		pageSize: result.limit,
		totalPages: result.totalPages,
		applied: {
			query: query.query,
			category: query.category,
			dealType: query.dealType,
			city: resolvedGeo.city?.name,
			district: resolvedGeo.district?.name,
			rooms: query.rooms,
			buildingType: query.houseType,
			priceFromMinor: query.priceFromMinor,
			priceToMinor: query.priceToMinor,
			areaFrom: query.areaFrom,
			areaTo: query.areaTo,
			sort: query.sort,
			view: query.view,
		},
	};
}

export async function findPublicPropertyBySlug(payload: Payload, slug: string) {
	const result = await payload.find({
		collection: "properties",
		where: {
			and: [publicPropertyDetailsWhere, { slug: { equals: slug } }],
		},
		depth: publicGatewayPolicy.depth,
		limit: 1,
		page: 1,
		select: publicPropertySelect,
		overrideAccess: publicGatewayPolicy.overrideAccess,
		context: publicGatewayPolicy.context,
	});

	const property = result.docs[0];
	if (!property) return null;

	const selected = property as PublicCatalogSelectedProperty;
	const geoIndex = await loadPublicGeoIndex(payload, [selected]);
	return toPublicCatalogProperty(
		selected,
		publicGeoForProperty(selected, geoIndex),
	);
}

export async function findPublicPropertyByPublicUrlId(
	payload: Payload,
	publicUrlId: string,
) {
	if (!/^\d+$/.test(publicUrlId)) return null;
	const result = await payload.find({
		collection: "properties",
		where: {
			and: [
				publicPropertyDetailsWhere,
				{ publicUrlId: { equals: Number(publicUrlId) } },
			],
		},
		depth: publicGatewayPolicy.depth,
		limit: 1,
		page: 1,
		select: publicPropertySelect,
		overrideAccess: publicGatewayPolicy.overrideAccess,
		context: publicGatewayPolicy.context,
	});

	const property = result.docs[0];
	if (!property) return null;
	const selected = property as PublicCatalogSelectedProperty;
	const geoIndex = await loadPublicGeoIndex(payload, [selected]);
	return toPublicCatalogProperty(
		selected,
		publicGeoForProperty(selected, geoIndex),
	);
}

export async function findPublicPropertyLifecycleByPublicUrlId(
	payload: Payload,
	publicUrlId: string,
): Promise<
	PublicPropertyLifecycleLookup & {
		slug?: string;
		category?: Property["category"];
	}
> {
	const property = await findPublicPropertyLifecycleRowByPublicUrlId(
		payload,
		publicUrlId,
	);
	if (!property) return { found: false };
	return {
		found: true,
		slug: property.slug,
		category: property.category,
		status: property.status,
		publishedAt: property.publishedAt,
		contentPurgedAt: property.contentPurgedAt,
	};
}

export async function findPublicPropertyLifecycleBySlug(
	payload: Payload,
	slug: string,
): Promise<PublicPropertyLifecycleLookup> {
	const property = await findPublicPropertyLifecycleRow(payload, slug);
	if (!property) return { found: false };

	const fromPath = buildPropertyUrl({
		category: property.category,
		semantic: slug,
		publicUrlId: property.publicUrlId,
	});
	const redirect = await findPublicRedirectByFromPath(payload, fromPath);
	const destination = sanitizeExplicitRedirectPath(redirect?.to);
	const chained =
		destination != null &&
		(await publicRedirectDestinationIsChain(payload, destination, fromPath));

	return {
		found: true,
		status: property.status,
		publishedAt: property.publishedAt,
		contentPurgedAt: property.contentPurgedAt,
		explicitRedirectPath: chained ? null : destination,
	};
}

export async function findPublicCatalogFacets(
	payload: Payload,
	input: CatalogQueryInput,
): Promise<PublicCatalogFacetsResult> {
	const query = catalogQuerySchema.parse(input);
	const resolvedGeo = await resolvePublishedCatalogGeo(payload, query);
	if (resolvedGeo === null) return emptyCatalogFacetsResult();
	const where = buildCatalogWhere(query, resolvedGeo);
	const aggregate = await aggregatePublicCatalogFacets(payload, where);
	const facetGeoIndex = await loadPublicGeoIndex(
		payload,
		aggregate.geographyRows as Pick<
			PublicCatalogSelectedProperty,
			"region" | "city" | "district"
		>[],
	);
	const cities = new Map<string, number>();
	const districts = new Map<string, number>();
	for (const row of aggregate.geographyRows) {
		const geo = publicGeoForProperty(
			row as Pick<PublicCatalogSelectedProperty, "city" | "district">,
			facetGeoIndex,
		);
		if (geo?.city.name)
			cities.set(geo.city.name, (cities.get(geo.city.name) ?? 0) + 1);
		if (geo?.district?.name) {
			districts.set(
				geo.district.name,
				(districts.get(geo.district.name) ?? 0) + 1,
			);
		}
	}
	const categories = aggregate.categories.flatMap((bucket) => {
		const parsed = propertyCategorySchema.safeParse(bucket.value);
		return parsed.success ? [{ value: parsed.data, count: bucket.count }] : [];
	});
	const dealTypes = aggregate.dealTypes.flatMap((bucket) => {
		const parsed = propertyDealTypeSchema.safeParse(bucket.value);
		return parsed.success ? [{ value: parsed.data, count: bucket.count }] : [];
	});
	const availableHouseTypes = aggregate.houseTypes.flatMap((bucket) => {
		const parsed = houseTypeSchema.safeParse(bucket.value);
		return parsed.success ? [{ value: parsed.data, count: bucket.count }] : [];
	});

	return {
		source: "payload-aggregate",
		total: aggregate.total,
		categories,
		dealTypes,
		cities: [...cities.entries()]
			.sort(([left], [right]) => left.localeCompare(right, "ru"))
			.map(([value, count]) => ({ value, count })),
		districts: [...districts.entries()]
			.sort(([left], [right]) => left.localeCompare(right, "ru"))
			.map(([value, count]) => ({ value, count })),
		rooms: aggregate.rooms,
		houseTypes: availableHouseTypes,
		priceMinor: {
			min: aggregate.priceMin,
			max: aggregate.priceMax,
		},
	};
}

export async function countPublicCatalogProperties(
	payload: Payload,
	input: CatalogQueryInput,
): Promise<number> {
	const query = catalogQuerySchema.parse({ ...input, limit: 1, page: 1 });
	const geo = await resolvePublishedCatalogGeo(payload, query);
	if (!geo) return 0;
	const result = await payload.count({
		collection: "properties",
		where: buildCatalogWhere(query, geo),
		overrideAccess: publicGatewayPolicy.overrideAccess,
		context: publicGatewayPolicy.context,
	});
	return result.totalDocs;
}
