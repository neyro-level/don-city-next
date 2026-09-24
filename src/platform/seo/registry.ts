export type SeoRegistryRobots =
	| "index,follow"
	| "noindex,follow"
	| "noindex,nofollow";

export type SeoRegistryEntry = {
	registryId: string;
	pageType: string;
	category: string;
	geoSlug: string;
	districtSlug: string;
	facetSlug: string;
	url: `/${string}`;
	title: string;
	description: string;
	h1: string;
	robots: SeoRegistryRobots;
	tier: string;
	broad: string;
	source: string;
	minActiveObjects: string;
	contentGateRequired: string;
	status: "active" | "candidate";
};

export type SeoTemplate = Pick<
	SeoRegistryEntry,
	"title" | "description" | "h1"
>;

export type SeoTemplateVariables = Readonly<Record<string, string>>;

export const catalogSeoTemplates = {
	apartmentAdministrativeDistrict: {
		title:
			"Купить квартиру в {districtLocative} районе {cityGenitive}, {regionShort} | {brandName}",
		description:
			"Квартиры на продажу в {districtLocative} районе {cityGenitive}, {regionShort}: актуальные объекты, фото и цены. Подбор и сопровождение сделки в «{brandName}».",
		h1: "Квартиры в {districtLocative} районе {cityGenitive}",
	},
	houseAdministrativeDistrict: {
		title:
			"Купить дом в {districtLocative} районе {cityGenitive}, {regionShort} | {brandName}",
		description:
			"Дома на продажу в {districtLocative} районе {cityGenitive}, {regionShort}: актуальные объекты, фото и цены. Подбор и сопровождение сделки в «{brandName}».",
		h1: "Дома в {districtLocative} районе {cityGenitive}",
	},
	apartmentMicrodistrict: {
		title:
			"Купить квартиру {districtPreposition} {districtLocative} {cityPreposition} {cityLocative}, {regionShort} | {brandName}",
		description:
			"Квартиры на продажу {districtPreposition} {districtLocative} {cityPreposition} {cityLocative}, {regionShort}: актуальные объекты, фото и цены. Подбор и сопровождение сделки в «{brandName}».",
		h1: "Квартиры {districtPreposition} {districtLocative} {cityPreposition} {cityLocative}",
	},
} as const satisfies Record<string, SeoTemplate>;

export function materializeSeoTemplate(
	template: SeoTemplate,
	variables: SeoTemplateVariables,
): SeoTemplate {
	return {
		title: materializeValue(template.title, variables),
		description: materializeValue(template.description, variables),
		h1: materializeValue(template.h1, variables),
	};
}

function materializeValue(
	value: string,
	variables: SeoTemplateVariables,
): string {
	return value.replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g, (_, key: string) => {
		const replacement = variables[key];
		if (replacement === undefined) {
			throw new Error(`Missing SEO template variable: ${key}`);
		}
		return replacement;
	});
}
