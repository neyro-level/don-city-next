import "server-only";

import type { PublicPageIdentityDTO } from "@ams/realtbase-contracts";

import { resolvePropertyPageLifecycle } from "@/core/seo/property";
import { type PublicUrlEntry, staticPublicUrlEntries } from "@/core/seo/site";
import { maxMeaningfulLastModified } from "@/platform/sitemap/registry";
import { projectConfig } from "@/project/project.config";
import { toPublicNapDTO } from "@/project/site-settings";
import {
	buildPropertyUrl,
	parseProjectUrl,
	propertyCategoryToSlug,
} from "@/project/url-grammar";
import {
	type CatalogQueryInput,
	catalogQuerySchema,
	findPublicCatalogFacets,
	findPublicCatalogProperties,
	findPublicPropertyByPublicUrlId,
	findPublicPropertyBySlug,
	findPublicPropertyLifecycleByPublicUrlId,
	findPublicPropertyLifecycleBySlug,
	type PublicCatalogResult,
} from "./catalog";
import {
	type PublicPropertyDetailsDTO,
	toHomePageDTO,
	toMarketingPageDTO,
	toPropertyDetailsDTO,
	toPropertyFilterDTO,
	toPropertyListDTO,
	toShellDTO,
} from "./dto";
import {
	findNearbyGeoAvailability,
	type NearbyGeoAvailability,
} from "./nearby-geo";
import { fallbackPublicPage, findPublicPage, findPublicPages } from "./pages";
import { getOptionalPublicGatewayPayload } from "./payload";
import { findPublicSiteSettings } from "./site-settings";
import {
	countPublicSitemapProperties,
	findPublicSitemapListingLastModified,
	listPublicSitemapPropertiesPage,
} from "./payload-reads";

export type PublicPropertyPageState =
	| {
			lifecycle: { kind: "gone"; statusCode: 410; robots: "noindex" };
	  }
	| {
			lifecycle: { kind: "redirect"; statusCode: 308; destination: string };
	  }
	| {
			lifecycle:
				| { kind: "active"; statusCode: 200 }
				| { kind: "archived"; statusCode: 200; robots: "noindex" };
			property: PublicPropertyDetailsDTO;
	  };

const urlsPerShard = projectConfig.sitemapUrlsPerShard;
const queryPageSize = projectConfig.sitemapQueryPageSize;

export async function getNearbyGeoAvailability(
	slug: string,
): Promise<NearbyGeoAvailability | null> {
	const payload = await getOptionalPublicGatewayPayload();
	return payload ? findNearbyGeoAvailability(payload, slug) : null;
}

function emptyCatalog(
	query: CatalogQueryInput = { limit: 24, page: 1 },
): PublicCatalogResult {
	const parsed = catalogQuerySchema.parse(query);
	return {
		items: [],
		total: 0,
		page: parsed.page,
		pageSize: parsed.limit,
		totalPages: 0,
		applied: {
			query: parsed.query,
			category: parsed.category,
			dealType: parsed.dealType,
			rooms: parsed.rooms,
			priceFromMinor: parsed.priceFromMinor,
			priceToMinor: parsed.priceToMinor,
			areaFrom: parsed.areaFrom,
			areaTo: parsed.areaTo,
			sort: parsed.sort,
			view: parsed.view,
		},
	};
}

function indexableStaticEntries(): PublicUrlEntry[] {
	return staticPublicUrlEntries.filter((entry) => entry.indexable);
}

async function sitemapRegistryEntriesWithOwnedLastModified(
	payload: NonNullable<
		Awaited<ReturnType<typeof getOptionalPublicGatewayPayload>>
	>,
): Promise<PublicUrlEntry[]> {
	const listingDates = await findPublicSitemapListingLastModified(payload);
	return indexableStaticEntries().map((entry) => {
		const key = parseProjectUrl(entry.path);
		if (key?.kind === "geoHub") {
			return {
				...entry,
				lastModified: maxMeaningfulLastModified(
					entry.lastModified,
					listingDates.all,
				),
			};
		}
		if (key?.kind === "categoryGeo") {
			const category = Object.entries(listingDates.byCategory).find(
				([propertyCategory]) =>
					propertyCategoryToSlug(
						propertyCategory as keyof typeof listingDates.byCategory,
					) === key.category,
			)?.[1];
			return {
				...entry,
				lastModified: maxMeaningfulLastModified(entry.lastModified, category),
			};
		}
		return entry;
	});
}

async function listRange<T>(
	readPage: (input: { limit: number; offset: number }) => Promise<readonly T[]>,
	offset: number,
	limit: number,
): Promise<T[]> {
	const items: T[] = [];
	while (items.length < limit) {
		const batch = await readPage({
			offset: offset + items.length,
			limit: Math.min(queryPageSize, limit - items.length),
		});
		if (!batch.length) break;
		items.push(...batch);
	}
	return items;
}

export async function getPublicShell() {
	const payload = await getOptionalPublicGatewayPayload();
	if (!payload) {
		return toShellDTO([]);
	}
	const [pages, nap] = await Promise.all([
		findPublicPages(payload),
		findPublicSiteSettings(payload),
	]);
	return toShellDTO(pages, nap);
}

export async function getPublicNap() {
	const payload = await getOptionalPublicGatewayPayload();
	return payload ? findPublicSiteSettings(payload) : toPublicNapDTO();
}

export type PublicCatalogRequest = {
	identity: PublicPageIdentityDTO;
	query: CatalogQueryInput;
};

export async function getPublicCatalog({
	identity,
	query,
}: PublicCatalogRequest) {
	const payload = await getOptionalPublicGatewayPayload();
	if (!payload) {
		const result = emptyCatalog(query);
		return {
			identity,
			list: toPropertyListDTO(result),
			filters: toPropertyFilterDTO(result),
		} as const;
	}
	const [result, facets] = await Promise.all([
		findPublicCatalogProperties(payload, query),
		findPublicCatalogFacets(payload, query),
	]);

	return {
		identity,
		list: toPropertyListDTO(result),
		filters: toPropertyFilterDTO(result, facets),
	} as const;
}

export async function getPublicSitemapTotals() {
	const payload = await getOptionalPublicGatewayPayload();
	if (!payload) {
		const staticCount = indexableStaticEntries().length;
		return {
			staticCount,
			pages: 0,
			properties: 0,
			total: staticCount,
		};
	}
	const staticCount = indexableStaticEntries().length;
	const properties = await countPublicSitemapProperties(payload);
	return {
		staticCount,
		pages: 0,
		properties,
		total: staticCount + properties,
	};
}

export async function getPublicSitemapShardCount() {
	const totals = await getPublicSitemapTotals();
	return Math.max(1, Math.ceil(totals.total / urlsPerShard));
}

export async function getPublicSitemapShard(
	id: number,
): Promise<PublicUrlEntry[]> {
	if (!Number.isInteger(id) || id < 0) return [];
	const payload = await getOptionalPublicGatewayPayload();
	const staticEntries = payload
		? await sitemapRegistryEntriesWithOwnedLastModified(payload)
		: indexableStaticEntries();
	if (!payload) {
		const start = id * urlsPerShard;
		return start >= staticEntries.length
			? []
			: staticEntries.slice(start, start + urlsPerShard);
	}
	const totals = await getPublicSitemapTotals();
	const start = id * urlsPerShard;
	if (start >= totals.total) return [];
	let remaining = urlsPerShard;
	let cursor = start;
	const entries: PublicUrlEntry[] = [];

	if (cursor < staticEntries.length && remaining > 0) {
		const slice = staticEntries.slice(cursor, cursor + remaining);
		entries.push(...slice);
		remaining -= slice.length;
		cursor += slice.length;
	}

	const propertiesStart = staticEntries.length;
	if (cursor >= propertiesStart && remaining > 0) {
		const propertyOffset = cursor - propertiesStart;
		const properties = await listRange(
			(input) => listPublicSitemapPropertiesPage(payload, input),
			propertyOffset,
			remaining,
		);
		entries.push(
			...properties.map((property) => ({
				path: buildPropertyUrl({
					category: property.category,
					semantic: property.slug,
					publicUrlId: property.publicUrlId,
				}),
				lastModified: property.updatedAt,
				changeFrequency: "daily" as const,
				priority: 0.8,
				indexable: true,
			})),
		);
	}

	return entries;
}

export async function getPublicSitemapEntries() {
	const count = await getPublicSitemapShardCount();
	const shards = await Promise.all(
		Array.from({ length: count }, (_, id) => getPublicSitemapShard(id)),
	);
	return shards.flat();
}

export async function getPublicHomePage() {
	const payload = await getOptionalPublicGatewayPayload();
	if (!payload) {
		return {
			page: toHomePageDTO(null),
			featured: null,
		} as const;
	}
	const [page, catalog] = await Promise.all([
		findPublicPage(payload, "home"),
		findPublicCatalogProperties(payload, { limit: 1, page: 1 }),
	]);
	const home = toHomePageDTO(page);
	const featured = catalog.items[0];

	return {
		page: {
			...home,
			featuredPropertyId: featured ? String(featured.id) : "",
		},
		featured: featured ? toPropertyListDTO(catalog).items[0] : null,
	} as const;
}

export async function getPublicProperty(
	slug: string,
): Promise<PublicPropertyPageState | null> {
	const payload = await getOptionalPublicGatewayPayload();
	if (!payload) {
		return null;
	}
	const lifecycle = resolvePropertyPageLifecycle(
		await findPublicPropertyLifecycleBySlug(payload, slug),
	);
	switch (lifecycle.kind) {
		case "missing":
			return null;
		case "gone":
			return { lifecycle };
		case "redirect":
			return { lifecycle };
	}

	const property = await findPublicPropertyBySlug(payload, slug);
	if (!property) return null;
	const relatedResult = await findPublicCatalogProperties(payload, {
		limit: 3,
		page: 1,
		category: property.category,
		geoSlug: property.geo?.city.slug,
	});
	const related = relatedResult.items
		.filter((item) => item.slug !== property.slug)
		.slice(0, 3);

	return {
		lifecycle,
		property: toPropertyDetailsDTO(property, related),
	} as const;
}

export async function getPublicPropertyByPublicUrlId(
	publicUrlId: string,
): Promise<PublicPropertyPageState | null> {
	const payload = await getOptionalPublicGatewayPayload();
	if (!payload) return null;
	const lifecycle = resolvePropertyPageLifecycle(
		await findPublicPropertyLifecycleByPublicUrlId(payload, publicUrlId),
	);
	if (lifecycle.kind === "missing") return null;
	if (lifecycle.kind === "gone") return { lifecycle };
	if (lifecycle.kind === "redirect") return { lifecycle };

	const property = await findPublicPropertyByPublicUrlId(payload, publicUrlId);
	if (!property) return null;
	const relatedResult = await findPublicCatalogProperties(payload, {
		limit: 3,
		page: 1,
		category: property.category,
		geoSlug: property.geo?.city.slug,
	});
	const related = relatedResult.items
		.filter((item) => item.id !== property.id)
		.slice(0, 3);

	return {
		lifecycle,
		property: toPropertyDetailsDTO(property, related),
	};
}

export async function getPublicMarketingPage(slug: string) {
	const payload = await getOptionalPublicGatewayPayload();
	if (!payload) {
		return toMarketingPageDTO(fallbackPublicPage(slug));
	}
	const page = await findPublicPage(payload, slug);
	return page ? toMarketingPageDTO(page) : null;
}
