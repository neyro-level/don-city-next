import type { MarketingPageDTO } from "@ams/realtbase-contracts";
import {
	CatalogPageView,
	type CatalogPaginationItem,
} from "@ams/realtbase-ui/starter/catalog-page";
import { GonePropertyPageView } from "@ams/realtbase-ui/starter/gone-property-page";
import {
	LegalDocumentView,
	type SiteLinkRendererProps,
} from "@ams/realtbase-ui/starter/legal-document-page";
import { MarketingPageView } from "@ams/realtbase-ui/starter/marketing-page";
import { PropertyPageView } from "@ams/realtbase-ui/starter/property-page";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
	getCachedPublicCatalog,
	getCachedPublicNap,
} from "@/core/data-access/public/cached-provider";
import { resolvePublicRoute } from "@/core/routing/resolve-public-route";
import { toMetadata } from "@/core/seo/page-metadata";
import { leadConsentContext } from "@/project/legal.config";
import { getProjectLegalDocument } from "@/project/legal-documents";
import type { PublicRouteSearchParams } from "@/project/public-route-resolver";
import { siteConfig } from "@/project/site.config";
import { buildStaticMarketingPage } from "@/project/static-page-composition";
import { projectUrls } from "@/project/url-grammar";

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

export async function generateResolvedRouteMetadata(
	segments: readonly string[],
	searchParams: PublicRouteSearchParams = {},
): Promise<Metadata> {
	const result = await resolvePublicRoute(segments, searchParams);
	if (result.kind === "notFound") {
		return {
			title: "Страница не найдена | ДОН СИТИ",
			robots: { index: false, follow: false },
		};
	}
	if (result.kind === "gone") {
		return {
			title: "Объект снят с публикации | ДОН СИТИ",
			description:
				"Объект больше не публикуется. Перейдите в каталог актуальной недвижимости ДОН СИТИ.",
			robots: { index: false, follow: true },
		};
	}
	if (result.kind !== "page") return {};
	return toMetadata({
		title: result.title,
		description: result.description,
		canonicalPath: result.canonicalPath,
		indexing: result.robots.indexing,
		following: result.robots.following,
	});
}

export async function ResolvedPublicRoutePage({
	segments,
	searchParams = {},
}: {
	segments: readonly string[];
	searchParams?: PublicRouteSearchParams;
}) {
	const result = await resolvePublicRoute(segments, searchParams);
	if (result.kind === "notFound") notFound();
	if (result.kind === "redirect") permanentRedirect(result.destination);
	if (result.kind === "gone") {
		return <GonePropertyPageView slug={result.publicUrlId} />;
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
				property: {
					id: result.property.id,
					slug: result.property.slug,
					title: result.property.title,
				},
				...leadConsentContext(),
			},
		};
		return (
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
		);
	}
	if (result.catalogQuery) {
		const catalog = await getCachedPublicCatalog({
			identity: result.identity,
			query: {
				...result.catalogQuery,
				limit: 24,
				page: result.catalogQuery.page ?? 1,
			},
		});
		return (
			<CatalogPageView
				list={catalog.list}
				filters={catalog.filters}
				leadContext={{
					formKind: "general",
					sourcePage: result.canonicalPath,
					...leadConsentContext(),
				}}
				copy={{
					eyebrow: siteConfig.brandName,
					title: result.h1,
					description: result.description,
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
			/>
		);
	}

	const staticSlug = result.key.kind === "static" ? result.key.slug : "page";
	const needsNap = [
		"kontakty",
		"o-kompanii",
		"politika-konfidencialnosti",
		"soglasie-na-obrabotku-personalnyh-dannyh",
	].includes(staticSlug);
	const nap = needsNap ? await getCachedPublicNap() : undefined;
	const legalDocument = nap
		? getProjectLegalDocument(staticSlug, nap)
		: undefined;
	if (legalDocument && nap) {
		return (
			<LegalDocumentView
				document={legalDocument}
				legalName={nap.legalName}
				email={nap.email}
				linkRenderer={LegalLink}
			/>
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
	return <MarketingPageView page={staticPage} />;
}
