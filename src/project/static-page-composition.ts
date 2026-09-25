import type {
	BreadcrumbDTO,
	MarketingPageDTO,
	PageSEOContract,
	PublicNapDTO,
} from "@ams/realtbase-contracts";
import { companyProfile } from "./company-profile.ts";
import { leadConsentContext } from "./legal.config.ts";
import { siteConfig } from "./site.config.ts";
import { projectUrls } from "./url-grammar.ts";

const sellerSlug = "prodat-nedvizhimost";
const lawyerSlug = "yurist";
const contactsSlug = "kontakty";
const aboutSlug = "o-kompanii";
const privacySlug = "politika-konfidencialnosti";
const consentSlug = "soglasie-na-obrabotku-personalnyh-dannyh";
const thanksSlug = "spasibo";

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

function contactSections(nap: PublicNapDTO) {
	return [
		{
			title: "Контакты офиса",
			text: `${nap.address.full}. Телефон: ${nap.phone.display}. E-mail: ${nap.email}.`,
		},
		{ title: "График работы", text: nap.openingHours },
	] as const;
}

function aboutSections(nap: PublicNapDTO) {
	return [
		{
			title: "О компании",
			text: "ДОН СИТИ помогает с подбором, продажей и юридическим сопровождением сделок с недвижимостью в Донецке.",
		},
		{
			title: "Руководитель и основатель",
			text: `Руководитель и основатель агентства — ${companyProfile.managerName}.`,
		},
		{
			title: "Правовая информация",
			text: `Деятельность ведёт ${nap.legalName}.`,
		},
	] as const;
}

function thanksSections() {
	return [
		{
			title: "Что дальше",
			text: "Специалист ДОН СИТИ свяжется с вами по указанным контактам, чтобы уточнить задачу.",
		},
	] as const;
}

export function buildStaticMarketingPage(input: {
	slug: string;
	title: string;
	seo: PageSEOContract;
	breadcrumbs: BreadcrumbDTO;
	nap?: PublicNapDTO;
}): MarketingPageDTO {
	const seller = input.slug === sellerSlug;
	const lawyer = input.slug === lawyerSlug;
	const contacts = input.slug === contactsSlug;
	const about = input.slug === aboutSlug;
	const legal = input.slug === privacySlug || input.slug === consentSlug;
	const thanks = input.slug === thanksSlug;
	const nap = input.nap;
	return {
		slug: input.slug,
		eyebrow: seller
			? "Продажа недвижимости"
			: lawyer
				? "Юридическое сопровождение"
				: about
					? "О компании"
					: legal
						? "Правовая информация"
						: thanks
							? "Заявка принята"
							: siteConfig.brandName,
		title: input.title,
		lead: input.seo.description,
		seo: input.seo,
		breadcrumbs: input.breadcrumbs,
		sections: seller
			? sellerSections
			: lawyer
				? lawyerSections
				: contacts && nap
					? contactSections(nap)
					: about && nap
						? aboutSections(nap)
						: legal
							? []
							: thanks
								? thanksSections()
								: [],
		primaryAction: thanks
			? { label: "Вернуться на главную", href: projectUrls.home }
			: undefined,
		leadContext:
			legal || thanks
				? undefined
				: {
						formKind: seller ? "sell" : lawyer ? "legal" : "general",
						sourcePage: input.seo.canonicalPath,
						...leadConsentContext(),
					},
	};
}
