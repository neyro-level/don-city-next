import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogPageView } from "@ams/realtbase-ui";
import { getPublicCatalog } from "@/core/data-access/public";
import {
	buildCatalogItemListJsonLd,
	JsonLdScript,
} from "@/core/seo/structured-data";
import { leadConsentContext } from "@/project/legal.config";
import { siteProfile } from "@/project/site.profile";
import { resolveCategoryRoute } from "@/platform/profile";

export const dynamic = "force-dynamic";

const canonicalPath = "/kvartiry/donetsk/";
const title = "Купить квартиру в Донецке, ДНР: цены и объявления";
const description =
	"Квартиры на продажу в Донецке, ДНР: 1-, 2- и 3-комнатные варианты в разных районах. Подбор и сопровождение сделки в «ДОН СИТИ».";

function requireActiveApartments() {
	if (
		resolveCategoryRoute(siteProfile, siteProfile.primaryGeo, "kvartiry")
			.statusCode === 404
	) {
		notFound();
	}
}

export function generateMetadata(): Metadata {
	requireActiveApartments();
	return {
		title,
		description,
		alternates: { canonical: canonicalPath },
		openGraph: { title, description, url: canonicalPath, type: "website" },
		robots: { index: true, follow: true },
	};
}

export default async function DonetskApartmentsCatalogPage() {
	requireActiveApartments();
	const catalog = await getPublicCatalog({
		category: "apartment",
		city: "Донецк",
		limit: 24,
		page: 1,
	});
	const list = {
		...catalog.list,
		items: catalog.list.items.map((property) => ({
			...property,
			href: `/kvartiry/${property.slug}/`,
		})),
	};

	return (
		<>
			<JsonLdScript data={buildCatalogItemListJsonLd(list)} />
			<CatalogPageView
				list={list}
				filters={catalog.filters}
				leadContext={{
					formKind: "general",
					sourcePage: canonicalPath,
					...leadConsentContext(),
				}}
				copy={{
					eyebrow: "Квартиры в Донецке",
					title: "Квартиры на продажу в Донецке",
					description:
						"Выбирайте опубликованные квартиры по району, количеству комнат и бюджету. Если готового варианта нет, подготовим подборку по вашим критериям.",
					emptyMessage:
						"Опубликованных квартир по этим условиям пока нет. Оставьте критерии — подготовим подборку, когда появятся подходящие варианты.",
					ctaTitle: "Получить подборку квартир",
					ctaDescription:
						"Расскажите, какая квартира нужна. Уточним критерии и предложим доступные варианты.",
					ctaSubmitLabel: "Получить подборку",
				}}
			/>
		</>
	);
}
