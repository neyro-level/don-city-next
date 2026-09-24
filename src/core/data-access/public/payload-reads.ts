import "server-only";

import type { Payload, Where } from "payload";
import type { Property } from "../../../project/payload-types.ts";
import { propertyLifecycleReadAccess } from "./access-mode.ts";
import { publicGatewayPolicy } from "./policy";

const access = {
	overrideAccess: publicGatewayPolicy.overrideAccess,
	context: publicGatewayPolicy.context,
	depth: 0,
} as const;

const publicPropertyPublicationWhere: Where = {
	and: [
		{ status: { equals: "active" } },
		{ publishedAt: { exists: true } },
		{ contentPurgedAt: { exists: false } },
	],
};

type FacetRow = {
	category?: string | null;
	dealType?: string | null;
	cityRaw?: string | null;
	districtRaw?: string | null;
	rooms?: number | null;
	priceMinor?: number | null;
};

function bump(map: Map<string, number>, key: string) {
	if (!key) return;
	map.set(key, (map.get(key) ?? 0) + 1);
}

export async function aggregatePublicCatalogFacets(
	payload: Payload,
	where: Where,
) {
	const categories = new Map<string, number>();
	const dealTypes = new Map<string, number>();
	const cities = new Map<string, number>();
	const districts = new Map<string, number>();
	const rooms = new Map<number, number>();
	let total = 0;
	let priceMin: number | null = null;
	let priceMax: number | null = null;
	const result = await payload.find({
		collection: "properties",
		where,
		limit: 2000,
		pagination: false,
		select: {
			category: true,
			dealType: true,
			cityRaw: true,
			districtRaw: true,
			rooms: true,
			priceMinor: true,
		},
		...access,
	});

	for (const doc of result.docs as FacetRow[]) {
		total += 1;
		if (doc.category) bump(categories, doc.category);
		if (doc.dealType) bump(dealTypes, doc.dealType);
		if (doc.cityRaw) bump(cities, doc.cityRaw);
		if (doc.districtRaw) bump(districts, doc.districtRaw);
		if (typeof doc.rooms === "number" && doc.rooms > 0) {
			rooms.set(doc.rooms, (rooms.get(doc.rooms) ?? 0) + 1);
		}
		if (typeof doc.priceMinor === "number") {
			priceMin =
				priceMin == null ? doc.priceMinor : Math.min(priceMin, doc.priceMinor);
			priceMax =
				priceMax == null ? doc.priceMinor : Math.max(priceMax, doc.priceMinor);
		}
	}

	const toBuckets = (map: Map<string, number>) =>
		[...map.entries()]
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([value, count]) => ({ value, count }));

	return {
		total,
		priceMin,
		priceMax,
		categories: toBuckets(categories),
		dealTypes: toBuckets(dealTypes),
		cities: toBuckets(cities),
		districts: toBuckets(districts),
		rooms: [...rooms.entries()]
			.sort(([a], [b]) => a - b)
			.map(([value, count]) => ({ value, count })),
	};
}

export async function countPublicSitemapProperties(
	payload: Payload,
): Promise<number> {
	const result = await payload.count({
		collection: "properties",
		where: publicPropertyPublicationWhere,
		...access,
	});
	return result.totalDocs;
}

export async function findPublicSitemapListingLastModified(
	payload: Payload,
): Promise<{
	all?: string;
	byCategory: Partial<Record<Property["category"], string>>;
}> {
	const categories = ["apartment", "house", "land", "commercial"] as const;
	const [all, ...categoryResults] = await Promise.all([
		payload.find({
			collection: "properties",
			where: publicPropertyPublicationWhere,
			limit: 1,
			page: 1,
			sort: "-updatedAt",
			select: { updatedAt: true },
			...access,
		}),
		...categories.map((category) =>
			payload.find({
				collection: "properties",
				where: {
					and: [
						...(publicPropertyPublicationWhere.and ?? []),
						{ category: { equals: category } },
					],
				},
				limit: 1,
				page: 1,
				sort: "-updatedAt",
				select: { updatedAt: true },
				...access,
			}),
		),
	]);

	return {
		all: all.docs[0]?.updatedAt,
		byCategory: Object.fromEntries(
			categories.flatMap((category, index) => {
				const updatedAt = categoryResults[index]?.docs[0]?.updatedAt;
				return updatedAt ? [[category, updatedAt]] : [];
			}),
		),
	};
}

export async function listPublicSitemapPropertiesPage(
	payload: Payload,
	input: { limit: number; offset: number },
): Promise<
	readonly {
		id: Property["id"];
		slug: string;
		category: Property["category"];
		updatedAt: string;
	}[]
> {
	const limit = Math.trunc(input.limit);
	const offset = Math.trunc(input.offset);
	if (!Number.isInteger(limit) || limit < 1) {
		throw new Error("sitemap page size must be a positive integer.");
	}
	if (!Number.isInteger(offset) || offset < 0) {
		throw new Error("sitemap offset must be a non-negative integer.");
	}

	const pageSize = Math.min(100, limit);
	const items: {
		id: Property["id"];
		slug: string;
		category: Property["category"];
		updatedAt: string;
	}[] = [];
	let skipped = 0;
	const lastPage = Math.ceil((offset + limit) / pageSize);
	for (let page = 1; items.length < limit && page <= lastPage; page += 1) {
		const result = await payload.find({
			collection: "properties",
			where: publicPropertyPublicationWhere,
			limit: pageSize,
			page,
			sort: "-updatedAt",
			select: { id: true, slug: true, category: true, updatedAt: true },
			...access,
		});
		if (!result.docs.length) break;
		for (const property of result.docs) {
			if (skipped < offset) {
				skipped += 1;
				continue;
			}
			items.push({
				id: property.id,
				slug: property.slug,
				category: property.category,
				updatedAt: property.updatedAt,
			});
			if (items.length >= limit) break;
		}
		if (result.docs.length < pageSize) break;
	}
	return items;
}

const publicPublishedPagesWhere: Where = {
	and: [{ status: { equals: "published" } }, { publishedAt: { exists: true } }],
};

function isIndexableSitemapPage(doc: {
	slug?: string | null;
	seo?: { noindex?: boolean | null } | null;
}): boolean {
	return Boolean(doc.slug) && doc.slug !== "home" && !doc.seo?.noindex;
}

export async function countPublicSitemapPages(
	payload: Payload,
): Promise<number> {
	const result = await payload.find({
		collection: "pages",
		where: publicPublishedPagesWhere,
		limit: 100,
		page: 1,
		select: {
			slug: true,
			seo: { noindex: true },
		},
		...access,
	});
	return result.docs.filter(isIndexableSitemapPage).length;
}

export async function listPublicSitemapPagesPage(
	payload: Payload,
	input: { limit: number; offset: number },
): Promise<readonly { slug: string; updatedAt: string }[]> {
	const limit = Math.trunc(input.limit);
	const offset = Math.trunc(input.offset);
	if (!Number.isInteger(limit) || limit < 1) {
		throw new Error("sitemap page size must be a positive integer.");
	}
	if (!Number.isInteger(offset) || offset < 0) {
		throw new Error("sitemap offset must be a non-negative integer.");
	}

	const result = await payload.find({
		collection: "pages",
		where: publicPublishedPagesWhere,
		limit: 100,
		page: 1,
		sort: "slug",
		select: {
			slug: true,
			updatedAt: true,
			seo: { noindex: true },
		},
		...access,
	});

	return result.docs
		.filter(isIndexableSitemapPage)
		.slice(offset, offset + limit)
		.map((page) => ({
			slug: page.slug as string,
			updatedAt: page.updatedAt,
		}));
}

export async function findPublicPropertyLifecycleRow(
	payload: Payload,
	slug: string,
): Promise<{
	id: Property["id"];
	category: Property["category"];
	status: "active" | "archived";
	publishedAt: string | null;
	contentPurgedAt: string | null;
} | null> {
	const result = await payload.find({
		collection: "properties",
		where: { slug: { equals: slug } },
		limit: 1,
		page: 1,
		select: {
			id: true,
			category: true,
			status: true,
			publishedAt: true,
			contentPurgedAt: true,
		},
		...propertyLifecycleReadAccess(),
		depth: 0,
	});
	const row = result.docs[0];
	if (!row) return null;
	return {
		id: row.id,
		category: row.category,
		status: row.status === "archived" ? "archived" : "active",
		publishedAt: row.publishedAt ?? null,
		contentPurgedAt: row.contentPurgedAt ?? null,
	};
}

export async function findPublicPropertyLifecycleRowById(
	payload: Payload,
	publicUrlId: string,
): Promise<{
	id: Property["id"];
	slug: string;
	category: Property["category"];
	status: "active" | "archived";
	publishedAt: string | null;
	contentPurgedAt: string | null;
} | null> {
	if (!/^\d+$/.test(publicUrlId)) return null;
	const result = await payload.find({
		collection: "properties",
		where: { id: { equals: Number(publicUrlId) } },
		limit: 1,
		page: 1,
		select: {
			id: true,
			slug: true,
			category: true,
			status: true,
			publishedAt: true,
			contentPurgedAt: true,
		},
		...propertyLifecycleReadAccess(),
		depth: 0,
	});
	const row = result.docs[0];
	if (!row) return null;
	return {
		id: row.id,
		slug: row.slug,
		category: row.category,
		status: row.status === "archived" ? "archived" : "active",
		publishedAt: row.publishedAt ?? null,
		contentPurgedAt: row.contentPurgedAt ?? null,
	};
}

export async function findPublicRedirectByFromPath(
	payload: Payload,
	fromPath: string,
): Promise<{ from: string; to: string; statusCode: string } | null> {
	const result = await payload.find({
		collection: "redirects",
		where: { from: { equals: fromPath } },
		limit: 1,
		page: 1,
		select: {
			from: true,
			to: true,
			statusCode: true,
		},
		...access,
	});
	const row = result.docs[0];
	if (!row?.from || !row.to) return null;
	return {
		from: row.from,
		to: row.to,
		statusCode: String(row.statusCode ?? "301"),
	};
}

export async function publicRedirectDestinationIsChain(
	payload: Payload,
	destinationPath: string,
	sourcePath: string,
): Promise<boolean> {
	if (destinationPath === sourcePath) return true;
	const result = await payload.find({
		collection: "redirects",
		where: { from: { equals: destinationPath } },
		limit: 1,
		page: 1,
		select: { from: true },
		...access,
	});
	return result.docs.length > 0;
}
