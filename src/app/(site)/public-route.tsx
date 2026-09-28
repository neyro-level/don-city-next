import type { MarketingPageDTO } from "@ams/realtbase-contracts";
import type { CatalogViewAnalyticsEvent } from "@ams/realtbase-ui/analytics";
import {
	CatalogPageView,
	type CatalogPaginationItem,
} from "@ams/realtbase-ui/public/catalog-page";
import { GonePropertyPageView } from "@ams/realtbase-ui/public/gone-property-page";
import {
	LegalDocumentView,
	type SiteLinkRendererProps,
} from "@ams/realtbase-ui/public/legal-document-page";
import { MarketingPageView } from "@ams/realtbase-ui/public/marketing-page";
import { PropertyPageView } from "@ams/realtbase-ui/public/property-page";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import {
	getCachedPublicCatalog,
	getCachedPublicNap,
} from "@/core/data-access/public/cached-provider";
import { resolvePublicRoute } from "@/core/routing/resolve-public-route";
import {
	buildBreadcrumbJsonLd,
	buildCatalogItemListJsonLd,
	buildLawyerServiceJsonLd,
	buildOrganizationJsonLd,
	buildPropertyJsonLd,
	JsonLdScript,
} from "@/core/seo/structured-data";
import type { PageKey } from "@/platform/grammar/types";
import { leadConsentContext } from "@/project/legal.config";
import { getProjectLegalDocument } from "@/project/legal-documents";
import { toMetadata, withProjectIndexingPolicy } from "@/project/page-metadata";
import type { PublicRouteSearchParams } from "@/project/public-route-resolver";
import { siteConfig } from "@/project/site.config";
import { buildStaticMarketingPage } from "@/project/static-page-composition";
import { projectUrls } from "@/project/url-grammar";

function catalogAnalyticsEvent(key: PageKey): CatalogViewAnalyticsEvent {
	if (key.kind === "geoHub") return "all_property_view";
	if (key.kind === "categoryGeoDistrict") return "district_view";
	if (key.kind === "categoryGeoFacet") return "facet_view";
	return "category_catalog_view";
}

function analyticsFilterKeys(searchParams: PublicRouteSearchParams) {
	return (["rooms", "houseType"] as const).filter((key) => {
		const value = searchParams[key];
		return Array.isArray(value) ? value.length > 0 : Boolean(value);
	});
}

function catalogPageHref(canonicalPath: string, page: number): string {
	const url = new URL(canonicalPath, "https://don-city.invalid");
	if (page <= 1) url.searchParams.delete("page");
	else url.searchParams.set("page", String(page));
	return `${url.pathname}${url.search}`;
}

function buildCatalogPagination(
	canonicalPath: string,
	currentPage: number,
	totalPages: number,
): CatalogPaginationItem[] {
	if (totalPages <= 1) return [];
	const pages = [
		...new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]),
	]
		.filter((page) => page >= 1 && page <= totalPages)
		.sort((left, right) => left - right);
	const items: CatalogPaginationItem[] = [];
	for (const [index, page] of pages.entries()) {
		const previous = pages[index - 1];
		if (previous && page - previous > 1) {
			items.push({ key: `gap-${previous}-${page}`, label: "…" });
		}
		items.push({
			key: String(page),
			label: String(page),
			href: catalogPageHref(canonicalPath, page),
			current: page === currentPage,
		});
	}
	return items;
}

function LegalLink({
	href,
	children,
	className,
	title,
	rel,
	target,
	ariaLabel,
	ariaCurrent,
	scroll,
}: SiteLinkRendererProps) {
	return (
		<Link
			href={href}
			className={className}
			title={title}
			rel={rel}
			target={target}
			aria-label={ariaLabel}
			aria-current={ariaCurrent}
			scroll={scroll}
		>
			{children}
		</Link>
	);
}

function breadcrumbJsonLdItems(
	items: readonly { label: string; href?: string }[],
	canonicalPath: string,
) {
	return items.map((item) => ({
		name: item.label,
		path: item.href ?? canonicalPath,
	}));
}

function stableSearchParamsKey(searchParams: PublicRouteSearchParams): string {
	return JSON.stringify(
		Object.fromEntries(
			Object.entries(searchParams).sort(([left], [right]) =>
				left.localeCompare(right),
			),
		),
	);
}

function isOutOfRangeCatalogPage(catalog: {
	list: { page: number; totalPages: number };
}): boolean {
	return (
		(catalog.list.page > 1 && catalog.list.totalPages === 0) ||
		catalog.list.page > catalog.list.totalPages
	);
}

const resolvePublicRouteRequestCached = cache(
	async (segmentsKey: string, searchParamsKey: string) => {
		const segments = JSON.parse(segmentsKey) as string[];
		const searchParams = JSON.parse(searchParamsKey) as PublicRouteSearchParams;
		const result = await resolvePublicRoute(segments, searchParams);
		if (result.kind !== "page" || !result.catalogQuery) {
			return { result, catalog: null, outOfRange: false } as const;
		}
		const catalog = await getCachedPublicCatalog({
			identity: result.identity,
			query: {
				...result.catalogQuery,
				limit: 24,
				page: result.catalogQuery.page ?? 1,
			},
		});
		return {
			result,
			catalog,
			outOfRange: isOutOfRangeCatalogPage(catalog),
		} as const;
	},
);

function resolvePublicRouteRequest(
	segments: readonly string[],
	searchParams: PublicRouteSearchParams,
) {
	return resolvePublicRouteRequestCached(
		JSON.stringify(segments),
		stableSearchParamsKey(searchParams),
	);
}

export async function generateResolvedRouteMetadata(
	segments: readonly string[],
	searchParams: PublicRouteSearchParams = {},
): Promise<Metadata> {
	const { result, outOfRange } = await resolvePublicRouteRequest(
		segments,
		searchParams,
	);
	if (result.kind === "notFound" || outOfRange) {
		return withProjectIndexingPolicy({
			title: "Страница не найдена | ДОН СИТИ",
			robots: { index: false, follow: false },
		});
	}
	if (result.kind === "gone") {
		return withProjectIndexingPolicy({
			title: "Объект снят с публикации | ДОН СИТИ",
			description:
				"Объект больше не публикуется. Перейдите в каталог актуальной недвижимости ДОН СИТИ.",
			robots: { index: false, follow: true },
		});
	}
	if (result.kind !== "page") return withProjectIndexingPolicy({});
	return toMetadata({
		title: result.title,
		description: result.description,
		canonicalPath: result.canonicalPath,
		indexing: result.robots.indexing,
		following: result.robots.following,
		...(result.property?.primaryMedia
			? { openGraph: { image: result.property.primaryMedia } }
			: {}),
	});
}

export async function ResolvedPublicRoutePage({
	segments,
	searchParams = {},
}: {
	segments: readonly string[];
	searchParams?: PublicRouteSearchParams;
}) {
	const { result, catalog, outOfRange } = await resolvePublicRouteRequest(
		segments,
		searchParams,
	);
	if (result.kind === "notFound") notFound();
	if (outOfRange) notFound();
	if (result.kind === "redirect") permanentRedirect(result.destination);
	if (result.kind === "gone") {
		return (
			<GonePropertyPageView
				slug={result.publicUrlId}
				catalogHref={projectUrls.primaryCatalog}
			/>
		);
	}
	if (result.property) {
		const leadPage: MarketingPageDTO = {
			slug: result.property.slug,
			eyebrow: "Просмотр объекта",
			title: result.property.title,
			lead: result.property.address,
			seo: {
				title: result.title,
				description: result.description,
				canonicalPath: result.canonicalPath,
				indexing: result.robots.indexing,
				following: result.robots.following,
			},
			breadcrumbs: { items: [] },
			sections: [],
			leadContext: {
				formKind: "property",
				sourcePage: result.canonicalPath,
				category: result.property.category,
				district: result.property.district,
				city: result.property.city,
				property: {
					id: result.property.id,
					slug: result.property.slug,
					title: result.property.title,
				},
				...leadConsentContext(),
			},
		};
		return (
			<>
				<JsonLdScript data={buildPropertyJsonLd(result.property)} />
				<JsonLdScript
					data={buildBreadcrumbJsonLd(
						breadcrumbJsonLdItems(result.breadcrumbs, result.canonicalPath),
					)}
				/>
				<PropertyPageView
					property={result.property}
					leadContext={leadPage.leadContext}
					breadcrumbs={result.breadcrumbs}
					contextLinks={result.internalLinks}
					pageIdentity={result.identity}
					legalSupport={{
						href: projectUrls.lawyer,
						formKind: "legal",
					}}
				/>
			</>
		);
	}
	if (result.catalogQuery) {
		if (!catalog) throw new Error("Catalog request state is unavailable.");
		return (
			<>
				<JsonLdScript data={buildCatalogItemListJsonLd(catalog.list)} />
				<JsonLdScript
					data={buildBreadcrumbJsonLd(
						breadcrumbJsonLdItems(result.breadcrumbs, result.canonicalPath),
					)}
				/>
				<CatalogPageView
					list={catalog.list}
					filters={catalog.filters}
					leadContext={{
						formKind: "general",
						sourcePage: result.canonicalPath,
						category: result.catalogQuery.category,
						district: result.catalogQuery.districtSlug,
						city: result.catalogQuery.geoSlug,
						...leadConsentContext(),
					}}
					copy={{
						eyebrow: siteConfig.brandName,
						title: result.h1,
						description: result.description,
						introduction: result.introduction,
						emptyMessage:
							"Опубликованных объектов по этим условиям пока нет. Оставьте критерии — подготовим подборку.",
						ctaTitle: "Получить подборку объектов",
						ctaDescription:
							"Расскажите, какой объект нужен. Уточним критерии и предложим доступные варианты.",
						ctaSubmitLabel: "Получить подборку",
					}}
					breadcrumbs={result.breadcrumbs}
					contextLinks={result.internalLinks}
					pagination={buildCatalogPagination(
						result.canonicalPath,
						catalog.list.page,
						catalog.list.totalPages,
					)}
					pageIdentity={catalog.identity}
					analyticsEvent={catalogAnalyticsEvent(result.key)}
					analyticsFilterKeys={analyticsFilterKeys(searchParams)}
				/>
			</>
		);
	}

	const staticSlug = result.key.kind === "static" ? result.key.slug : "page";
	const needsNap = [
		"kontakty",
		"o-kompanii",
		"yurist",
		"politika-konfidencialnosti",
		"soglasie-na-obrabotku-personalnyh-dannyh",
	].includes(staticSlug);
	const nap = needsNap ? await getCachedPublicNap() : undefined;
	const legalDocument = nap
		? getProjectLegalDocument(staticSlug, nap)
		: undefined;
	if (legalDocument && nap) {
		return (
			<>
				<JsonLdScript
					data={buildBreadcrumbJsonLd(
						breadcrumbJsonLdItems(result.breadcrumbs, result.canonicalPath),
					)}
				/>
				<LegalDocumentView
					document={legalDocument}
					legalName={nap.legalName}
					email={nap.email}
					linkRenderer={LegalLink}
				/>
			</>
		);
	}
	const staticPage = buildStaticMarketingPage({
		slug: staticSlug,
		title: result.h1,
		seo: {
			title: result.title,
			description: result.description,
			canonicalPath: result.canonicalPath,
			indexing: result.robots.indexing,
			following: result.robots.following,
		},
		breadcrumbs: { items: result.breadcrumbs },
		nap,
	});
	return (
		<>
			{nap ? <JsonLdScript data={buildOrganizationJsonLd(nap)} /> : null}
			{staticSlug === "yurist" && nap ? (
				<JsonLdScript data={buildLawyerServiceJsonLd(staticPage, nap)} />
			) : null}
			<JsonLdScript
				data={buildBreadcrumbJsonLd(
					breadcrumbJsonLdItems(result.breadcrumbs, result.canonicalPath),
				)}
			/>
			<MarketingPageView page={staticPage} />
		</>
	);
}
