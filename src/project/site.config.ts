export type ProjectKind = "starter-demo" | "client";

export type SiteConfig = {
	brandName: string;
	defaultTitle: string;
	defaultDescription: string;
	locale: string;
	currency: string;
	projectKind: ProjectKind;
};

export const siteConfig = {
	brandName: "ДОН СИТИ",
	defaultTitle: "ДОН СИТИ",
	defaultDescription: "Агентство недвижимости «ДОН СИТИ».",
	locale: "ru-RU",
	currency: "RUB",
	projectKind: "client",
} as const satisfies SiteConfig;
