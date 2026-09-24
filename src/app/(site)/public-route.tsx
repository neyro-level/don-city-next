import type { MarketingPageDTO } from "@ams/realtbase-contracts";
import {
	CatalogPageView,
	GonePropertyPageView,
	MarketingPageView,
	PropertyPageView,
} from "@ams/realtbase-ui";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getPublicCatalog, getPublicNap } from "@/core/data-access/public";
import { resolvePublicRoute } from "@/core/routing/resolve-public-route";
import { toMetadata } from "@/core/seo/page-metadata";
import { leadConsentContext } from "@/project/legal.config";
import { siteConfig } from "@/project/site.config";
import { buildStaticMarketingPage } from "@/project/static-page-composition";
import { projectUrls } from "@/project/url-grammar";

export async function generateResolvedRouteMetadata(
	segments: readonly string[],
): Promise<Metadata> {
	const result = await resolvePublicRoute(segments);
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
}: {
	segments: readonly string[];
}) {
	const result = await resolvePublicRoute(segments);
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
		const catalog = await getPublicCatalog({
			identity: result.identity,
			query: {
				...result.catalogQuery,
				limit: 24,
				page: 1,
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
				pageIdentity={catalog.identity}
			/>
		);
	}

	const staticSlug = result.key.kind === "static" ? result.key.slug : "page";
	const nap = staticSlug === "kontakty" ? await getPublicNap() : undefined;
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
