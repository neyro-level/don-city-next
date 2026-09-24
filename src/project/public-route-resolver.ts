import type { PropertyCategory } from "@ams/realtbase-contracts";
import type { PublicPropertyPageState } from "../core/data-access/public/provider.ts";
import type { PageKey } from "../platform/grammar/types.ts";
import type { SeoRegistryEntry } from "../platform/seo/registry.ts";
import { seoRegistryByCanonicalPath } from "./seo-registry.generated.ts";
import { siteConfig } from "./site.config.ts";
import {
	buildProjectUrl,
	canonicalPropertySemantic,
	parseProjectUrl,
	propertyCategoryToSlug,
} from "./url-grammar.ts";

export type PublicRobots = {
	indexing: "index" | "noindex";
	following: "follow" | "nofollow";
};

type CatalogQuery = {
	category?: "apartment" | "house" | "land" | "commercial";
	city?: string;
	district?: string;
	rooms?: number[];
};

export type ResolvedPublicPage = {
	kind: "page";
	statusCode: 200;
	key: PageKey;
	canonicalPath: string;
	title: string;
	description: string;
	h1: string;
	robots: PublicRobots;
	catalogQuery?: CatalogQuery;
	property?: Extract<
		PublicPropertyPageState,
		{ property: unknown }
	>["property"];
};

export type ResolvedPublicRoute =
	| ResolvedPublicPage
	| { kind: "notFound"; statusCode: 404 }
	| { kind: "gone"; statusCode: 410; publicUrlId: string }
	| { kind: "redirect"; statusCode: 301 | 308; destination: string };

export type PublicRouteDependencies = {
	loadProperty: (
		publicUrlId: string,
	) => Promise<PublicPropertyPageState | null>;
};

function page(
	key: PageKey,
	input: Omit<
		ResolvedPublicPage,
		"kind" | "statusCode" | "key" | "canonicalPath"
	>,
): ResolvedPublicPage {
	return {
		kind: "page",
		statusCode: 200,
		key,
		canonicalPath: buildProjectUrl(key),
		...input,
	};
}

const domainCategory = {
	kvartiry: "apartment",
	doma: "house",
	uchastki: "land",
} as const;

function robotsFromRegistry(entry: SeoRegistryEntry): PublicRobots {
	const [indexing, following] = entry.robots.split(",");
	return {
		indexing: indexing as PublicRobots["indexing"],
		following: following as PublicRobots["following"],
	};
}

function catalogQueryFor(key: PageKey): CatalogQuery | undefined {
	if (key.kind === "geoHub") return { city: "Донецк" };
	if (
		key.kind !== "categoryRoot" &&
		key.kind !== "categoryGeo" &&
		key.kind !== "categoryGeoDistrict" &&
		key.kind !== "categoryGeoFacet"
	) {
		return undefined;
	}
	const category = domainCategory[key.category as keyof typeof domainCategory];
	const rooms =
		key.kind === "categoryGeoFacet"
			? { odnokomnatnye: [1], dvuhkomnatnye: [2], trehkomnatnye: [3] }[
					key.facet
				]
			: undefined;
	return {
		category,
		city: key.kind === "categoryRoot" ? undefined : "Донецк",
		district: key.kind === "categoryGeoDistrict" ? key.district : undefined,
		rooms,
	};
}

function resolveRegistryPage(key: Exclude<PageKey, { kind: "property" }>) {
	const canonicalPath = buildProjectUrl(key);
	const contract = seoRegistryByCanonicalPath.get(canonicalPath);
	if (!contract) return { kind: "notFound", statusCode: 404 } as const;
	return page(key, {
		title: contract.title,
		description: contract.description,
		h1: contract.h1,
		robots: robotsFromRegistry(contract),
		catalogQuery: catalogQueryFor(key),
	});
}

export async function resolveProjectPublicRoute(
	segments: readonly string[],
	dependencies: PublicRouteDependencies,
): Promise<ResolvedPublicRoute> {
	const key = parseProjectUrl(
		segments.length ? `/${segments.join("/")}/` : "/",
	);
	if (!key) return { kind: "notFound", statusCode: 404 };
	if (key.kind !== "property") return resolveRegistryPage(key);

	const state = await dependencies.loadProperty(key.publicUrlId);
	if (!state) return { kind: "notFound", statusCode: 404 };
	if (!("property" in state)) {
		if (state.lifecycle.kind === "gone") {
			return { kind: "gone", statusCode: 410, publicUrlId: key.publicUrlId };
		}
		return {
			kind: "redirect",
			statusCode: 308,
			destination: state.lifecycle.destination,
		};
	}
	const property = state.property;
	const actualCategory = propertyCategoryToSlug(
		property.category as Exclude<PropertyCategory, "other">,
	);
	if (
		key.category !== actualCategory ||
		key.semantic !== canonicalPropertySemantic(property.slug)
	) {
		return { kind: "redirect", statusCode: 301, destination: property.href };
	}
	return page(key, {
		title: `${property.title} — ${siteConfig.brandName}`,
		description: property.description,
		h1: property.title,
		robots: property.lifecycle.isArchived
			? { indexing: "noindex", following: "follow" }
			: { indexing: "index", following: "follow" },
		property,
	});
}
