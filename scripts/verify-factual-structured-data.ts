import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type {
	PropertyCategory,
	PropertyDetailsDTO,
} from "@ams/realtbase-contracts";
import {
	buildLawyerServiceJsonLd,
	buildOrganizationJsonLd,
	buildPropertyJsonLd,
} from "../src/core/seo/structured-data-builders.ts";
import { toPublicNapDTO } from "../src/project/site-settings.ts";
import { buildStaticMarketingPage } from "../src/project/static-page-composition.ts";

type JsonLd = Record<string, unknown>;

const categoryCases = [
	["apartment", "Apartment", "Квартира", "Донецк"],
	["house", "House", "Дом", "Макеевка"],
	["land", "Place", "Земельный участок", "Моспино"],
	["commercial", "Place", "Коммерческая недвижимость", "Харцызск"],
] as const satisfies readonly (readonly [
	PropertyCategory,
	string,
	string,
	string,
])[];

function propertyFixture(
	category: PropertyCategory,
	city: string,
): PropertyDetailsDTO {
	return {
		id: `${category}-fixture`,
		slug: `${category}-fixture`,
		href: `/fixture/${category}/`,
		title: `Тестовый объект: ${category}`,
		category,
		dealType: "sale",
		price: {
			priceMinor: 12_345_600,
			currency: "RUB",
			period: "total",
			label: "123 456 ₽",
		},
		address: `улица Фактическая, 1, ${city}`,
		city,
		primaryMedia: null,
		summary: [{ key: "area", label: "Площадь", value: "42,5 м²" }],
		badges: [],
		description: "Фактическое описание из публичного DTO.",
		gallery: [],
		characteristics: [],
		location: { latitude: 48.01, longitude: 37.81 },
		related: [],
	};
}

for (const [category, expectedType, expectedLabel, city] of categoryCases) {
	const jsonLd = buildPropertyJsonLd(propertyFixture(category, city));
	assert.equal(jsonLd["@type"], "Offer");
	const item = jsonLd.itemOffered as JsonLd;
	assert.equal(item["@type"], expectedType);
	assert.equal(item.additionalType, expectedLabel);
	assert.notEqual(item["@type"], "Residence");
	assert.equal((item.address as JsonLd).addressLocality, city);
	assert.equal(
		(item.address as JsonLd).streetAddress,
		`улица Фактическая, 1, ${city}`,
	);
	assert.deepEqual(item.geo, {
		"@type": "GeoCoordinates",
		latitude: 48.01,
		longitude: 37.81,
	});
	if (category === "land") {
		assert.equal(item.floorSize, undefined);
	} else {
		assert.deepEqual(item.floorSize, {
			"@type": "QuantitativeValue",
			value: 42.5,
			unitCode: "MTK",
		});
	}
}

const nap = toPublicNapDTO();
const organization = buildOrganizationJsonLd(nap);
assert.equal(organization["@type"], "RealEstateAgent");
assert.equal(organization.openingHours, undefined);
assert.deepEqual(organization.openingHoursSpecification, [
	{
		"@type": "OpeningHoursSpecification",
		dayOfWeek: [
			"https://schema.org/Monday",
			"https://schema.org/Tuesday",
			"https://schema.org/Wednesday",
			"https://schema.org/Thursday",
			"https://schema.org/Friday",
		],
		opens: "09:00",
		closes: "18:00",
	},
	{
		"@type": "OpeningHoursSpecification",
		dayOfWeek: ["https://schema.org/Saturday", "https://schema.org/Sunday"],
		opens: "09:00",
		closes: "18:00",
	},
]);
assert.equal(
	organization.logo,
	"https://doncity-home.ru/brand/don-city-logo-approved.jpg",
);
assert.equal(
	organization.image,
	"https://doncity-home.ru/brand/don-city-social-default.png",
);
assert.equal(organization.geo, undefined);
assert.equal(organization.sameAs, undefined);
assert.equal(nap.openingHours, "Пн–Пт: 09:00–18:00; Сб–Вс: 09:00–18:00");
const lawyerPage = buildStaticMarketingPage({
	slug: "yurist",
	title: "Юрист по недвижимости",
	seo: {
		title: "Юрист по недвижимости — ДОН СИТИ",
		description: "Юридическое сопровождение сделок с недвижимостью в Донецке.",
		canonicalPath: "/yurist/",
		indexing: "index",
		following: "follow",
	},
	breadcrumbs: {
		items: [{ label: "Главная", href: "/" }, { label: "Юрист" }],
	},
	nap,
});
const service = buildLawyerServiceJsonLd(lawyerPage, nap);
assert.equal(service["@type"], "Service");
assert.equal(service.name, lawyerPage.title);
assert.equal(service.description, lawyerPage.lead);
assert.match(String(service.url), /\/yurist\/$/);
assert.deepEqual(
	service.serviceType,
	lawyerPage.sections.map((section) => section.title),
);
assert.deepEqual(service.provider, {
	"@type": "RealEstateAgent",
	name: nap.brandName,
	legalName: nap.legalName,
	url: nap.url,
	telephone: nap.phone.e164,
	email: nap.email,
});
assert.doesNotMatch(JSON.stringify(service), /FAQPage|aggregateRating|review/i);

const routeSource = readFileSync("src/app/(site)/public-route.tsx", "utf8");
assert.match(routeSource, /staticSlug === "yurist" && nap/);
assert.match(routeSource, /buildLawyerServiceJsonLd\(staticPage, nap\)/);
assert.doesNotMatch(routeSource, /FAQPage/);

console.log("DC10-R12-06 factual structured data: PASS");
