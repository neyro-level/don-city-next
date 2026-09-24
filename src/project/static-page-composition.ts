import type {
	BreadcrumbDTO,
	MarketingPageDTO,
	PageSEOContract,
} from "@ams/realtbase-contracts";
import { leadConsentContext } from "./legal.config.ts";
import { siteConfig } from "./site.config.ts";

const sellerSlug = "prodat-nedvizhimost";

const sellerSections = [
	{
		title: "Оценка и план продажи",
		text: "Разберём исходные данные по объекту и согласуем последовательность действий перед продажей.",
	},
	{
		title: "Подготовка и показы",
		text: "Поможем подготовить объект к показам и организовать коммуникацию с заинтересованными покупателями.",
	},
	{
		title: "Переговоры и сопровождение сделки",
		text: "Сопровождаем переговоры и помогаем пройти юридические этапы сделки.",
	},
] as const;

export function buildStaticMarketingPage(input: {
	slug: string;
	title: string;
	seo: PageSEOContract;
	breadcrumbs: BreadcrumbDTO;
}): MarketingPageDTO {
	const seller = input.slug === sellerSlug;
	return {
		slug: input.slug,
		eyebrow: seller ? "Продажа недвижимости" : siteConfig.brandName,
		title: input.title,
		lead: input.seo.description,
		seo: input.seo,
		breadcrumbs: input.breadcrumbs,
		sections: seller ? sellerSections : [],
		leadContext: {
			formKind: seller ? "sell" : "general",
			sourcePage: input.seo.canonicalPath,
			...leadConsentContext(),
		},
	};
}
