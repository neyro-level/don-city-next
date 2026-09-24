import type {
	BreadcrumbDTO,
	MarketingPageDTO,
	PageSEOContract,
} from "@ams/realtbase-contracts";
import { leadConsentContext } from "./legal.config.ts";
import { siteConfig } from "./site.config.ts";

const sellerSlug = "prodat-nedvizhimost";
const lawyerSlug = "yurist";

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

const lawyerSections = [
	{
		title: "Проверка документов",
		text: "Разберём документы по объекту и вопросы, которые важно уточнить до сделки.",
	},
	{
		title: "Сопровождение сделки",
		text: "Поможем с юридическими этапами купли-продажи и оформлением прав по ситуации.",
	},
	{
		title: "Наследство и земельные вопросы",
		text: "Обсудим вопросы наследства, регистрации права и земли в рамках вашей ситуации.",
	},
] as const;

export function buildStaticMarketingPage(input: {
	slug: string;
	title: string;
	seo: PageSEOContract;
	breadcrumbs: BreadcrumbDTO;
}): MarketingPageDTO {
	const seller = input.slug === sellerSlug;
	const lawyer = input.slug === lawyerSlug;
	return {
		slug: input.slug,
		eyebrow: seller
			? "Продажа недвижимости"
			: lawyer
				? "Юридическое сопровождение"
				: siteConfig.brandName,
		title: input.title,
		lead: input.seo.description,
		seo: input.seo,
		breadcrumbs: input.breadcrumbs,
		sections: seller ? sellerSections : lawyer ? lawyerSections : [],
		leadContext: {
			formKind: seller ? "sell" : lawyer ? "legal" : "general",
			sourcePage: input.seo.canonicalPath,
			...leadConsentContext(),
		},
	};
}
