import type { PropertyCategory } from "@ams/realtbase-contracts";
import type { PublicPropertyPageState } from "../core/data-access/public/provider.ts";
import type { PageKey } from "../platform/grammar/types.ts";
import { resolveCategoryRoute } from "../platform/profile/selectors.ts";
import { siteConfig } from "./site.config.ts";
import { type SiteCategory, siteProfile } from "./site.profile.ts";
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

const staticPages = {
	"prodat-nedvizhimost": {
		title: "Продать недвижимость в Донецке, ДНР | ДОН СИТИ",
		description:
			"Поможем продать квартиру, дом или участок в Донецке: оценка, подготовка, показы, переговоры и юридическое сопровождение сделки.",
		h1: "Продать недвижимость в Донецке",
		robots: { indexing: "index", following: "follow" },
	},
	yurist: {
		title: "Юрист по недвижимости в Донецке, ДНР | ДОН СИТИ",
		description:
			"Юрист по недвижимости в Донецке: проверка документов, сопровождение купли-продажи, наследство, регистрация права и земельные вопросы.",
		h1: "Юрист по недвижимости в Донецке",
		robots: { indexing: "index", following: "follow" },
	},
	"o-kompanii": {
		title: "О компании «ДОН СИТИ»: агентство недвижимости в Донецке",
		description:
			"О компании «ДОН СИТИ»: агентство недвижимости в Донецке, команда, подход к проверке объектов и сопровождению сделок.",
		h1: "О компании «ДОН СИТИ»",
		robots: { indexing: "index", following: "follow" },
	},
	kontakty: {
		title: "Контакты агентства недвижимости «ДОН СИТИ» в Донецке",
		description:
			"Адрес, телефон и график работы агентства недвижимости «ДОН СИТИ» в Донецке. Запись на консультацию и встречу.",
		h1: "Контакты агентства «ДОН СИТИ»",
		robots: { indexing: "index", following: "follow" },
	},
	"politika-konfidencialnosti": {
		title: "Политика конфиденциальности | ДОН СИТИ",
		description:
			"Политика обработки и защиты персональных данных пользователей сайта агентства недвижимости «ДОН СИТИ».",
		h1: "Политика конфиденциальности",
		robots: { indexing: "noindex", following: "follow" },
	},
	"soglasie-na-obrabotku-personalnyh-dannyh": {
		title: "Согласие на обработку персональных данных | ДОН СИТИ",
		description:
			"Согласие пользователя на обработку персональных данных агентством недвижимости «ДОН СИТИ».",
		h1: "Согласие на обработку персональных данных",
		robots: { indexing: "noindex", following: "follow" },
	},
	spasibo: {
		title: "Спасибо за обращение | ДОН СИТИ",
		description:
			"Заявка отправлена. Специалист агентства недвижимости «ДОН СИТИ» свяжется с вами.",
		h1: "Спасибо за обращение",
		robots: { indexing: "noindex", following: "nofollow" },
	},
} as const satisfies Record<
	string,
	{
		title: string;
		description: string;
		h1: string;
		robots: PublicRobots;
	}
>;

const categoryContract = {
	kvartiry: {
		category: "apartment",
		label: "Квартиры",
		geoTitle: "Купить квартиру в Донецке, ДНР: цены и объявления",
		geoDescription:
			"Квартиры на продажу в Донецке, ДНР: 1-, 2- и 3-комнатные варианты в разных районах. Подбор и сопровождение сделки в «ДОН СИТИ».",
		geoH1: "Квартиры на продажу в Донецке",
	},
	doma: {
		category: "house",
		label: "Дома",
		geoTitle: "Купить дом в Донецке, ДНР: дома с участками",
		geoDescription:
			"Дома на продажу в Донецке, ДНР: частные дома и дома с земельными участками. Подбор объекта и юридическое сопровождение сделки.",
		geoH1: "Дома на продажу в Донецке",
	},
	uchastki: {
		category: "land",
		label: "Земельные участки",
		geoTitle: "Купить земельный участок в Донецке, ДНР",
		geoDescription:
			"Земельные участки на продажу в Донецке и ДНР: земля под дом и строительство. Проверка документов и сопровождение сделки.",
		geoH1: "Земельные участки в Донецке и ДНР",
	},
} as const;

function categoryInfo(category: string) {
	return categoryContract[category as keyof typeof categoryContract];
}

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

function resolveCatalogPage(
	key: Exclude<PageKey, { kind: "home" | "static" | "property" | "geoHub" }>,
): ResolvedPublicRoute {
	const info = categoryInfo(key.category);
	if (!info) return { kind: "notFound", statusCode: 404 };
	if (key.kind === "categoryRoot") {
		if (siteProfile.categoryStatus[key.category as SiteCategory] !== "ACTIVE") {
			return { kind: "notFound", statusCode: 404 };
		}
		return page(key, {
			title: `${info.label} | ${siteConfig.brandName}`,
			description: `Каталог ${info.label.toLowerCase()} агентства недвижимости «ДОН СИТИ».`,
			h1: info.label,
			robots: { indexing: "noindex", following: "follow" },
			catalogQuery: { category: info.category },
		});
	}
	const route = resolveCategoryRoute(
		siteProfile,
		key.geo,
		key.category as SiteCategory,
	);
	if (route.statusCode === 404 || route.status === "NOINDEX_AUTO") {
		return { kind: "notFound", statusCode: 404 };
	}
	const leaf =
		key.kind === "categoryGeoDistrict"
			? key.district
			: key.kind === "categoryGeoFacet"
				? key.facet
				: null;
	const facetRooms =
		key.kind === "categoryGeoFacet"
			? { odnokomnatnye: [1], dvuhkomnatnye: [2], trehkomnatnye: [3] }[
					key.facet
				]
			: undefined;
	return page(key, {
		title: leaf
			? `${info.label}: ${leaf} в Донецке | ${siteConfig.brandName}`
			: info.geoTitle,
		description: leaf
			? `${info.label} в Донецке: ${leaf}. Актуальные опубликованные объекты агентства «ДОН СИТИ».`
			: info.geoDescription,
		h1: leaf ? `${info.label}: ${leaf}` : info.geoH1,
		robots: leaf
			? { indexing: "noindex", following: "follow" }
			: { indexing: "index", following: "follow" },
		catalogQuery: {
			category: info.category,
			city: "Донецк",
			district: key.kind === "categoryGeoDistrict" ? key.district : undefined,
			rooms: facetRooms,
		},
	});
}

export async function resolveProjectPublicRoute(
	segments: readonly string[],
	dependencies: PublicRouteDependencies,
): Promise<ResolvedPublicRoute> {
	const key = parseProjectUrl(`/${segments.join("/")}/`);
	if (!key || key.kind === "home") return { kind: "notFound", statusCode: 404 };
	if (key.kind === "static") {
		const contract = staticPages[key.slug as keyof typeof staticPages];
		return contract
			? page(key, contract)
			: { kind: "notFound", statusCode: 404 };
	}
	if (key.kind === "geoHub") {
		if (key.geo !== siteProfile.primaryGeo)
			return { kind: "notFound", statusCode: 404 };
		return page(key, {
			title: "Недвижимость в Донецке, ДНР: квартиры, дома, участки",
			description:
				"Недвижимость в Донецке и ДНР: квартиры, дома и земельные участки. Актуальные объекты агентства «ДОН СИТИ» и помощь в безопасной сделке.",
			h1: "Недвижимость в Донецке, ДНР",
			robots: { indexing: "index", following: "follow" },
			catalogQuery: { city: "Донецк" },
		});
	}
	if (key.kind !== "property") return resolveCatalogPage(key);

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
