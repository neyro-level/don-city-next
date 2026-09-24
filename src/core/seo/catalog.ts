import type { Metadata } from "next";
import type { CatalogQueryInput } from "@/core/data-access/public";
import {
	buildPortableCatalogSeoDecision,
	type CatalogSearchParams,
	type PortableCatalogSeoDecision,
} from "../../platform/seo/catalog.ts";
import { projectConfig } from "../../project/project.config.ts";
import { absoluteUrl, siteBrandName } from "./site.ts";
import { projectUrls } from "../../project/url-grammar.ts";

const indexedFilterKeys = projectConfig.indexedCatalogFilterKeys;
const allowedControlKeys = ["page", "sort", "view"] as const;
const nonIndexableFilterKeys = [
	"query",
	"limit",
	"priceFromMinor",
	"priceToMinor",
	"areaFrom",
	"areaTo",
] as const;

export const catalogSeoParamPolicy = {
	indexedFilterKeys,
	allowedControlKeys,
	nonIndexableFilterKeys,
} as const;

export type { CatalogSearchParams } from "../../platform/seo/catalog.ts";

export type CatalogSeoDecision = Omit<PortableCatalogSeoDecision, "query"> & {
	query: CatalogQueryInput;
};

export function buildCatalogSeoDecision(
	searchParams: CatalogSearchParams = {},
): CatalogSeoDecision {
	return buildPortableCatalogSeoDecision(
		indexedFilterKeys,
		projectUrls.primaryCatalog,
		searchParams,
	) as CatalogSeoDecision;
}

export function buildCatalogMetadata(
	searchParams: CatalogSearchParams = {},
): Metadata {
	const decision = buildCatalogSeoDecision(searchParams);
	const hasFilter = decision.canonicalPath.includes("?");
	const title = hasFilter
		? `Подбор недвижимости — ${siteBrandName}`
		: `Каталог недвижимости — ${siteBrandName}`;

	return {
		title,
		description: "Каталог опубликованных объектов недвижимости.",
		alternates: { canonical: decision.canonicalPath },
		openGraph: {
			title,
			description: "Каталог опубликованных объектов недвижимости.",
			url: absoluteUrl(decision.canonicalPath),
			type: "website",
		},
		robots: {
			index: decision.index,
			follow: decision.follow,
		},
	};
}
