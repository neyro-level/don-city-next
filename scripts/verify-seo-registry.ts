import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
	catalogSeoTemplates,
	materializeSeoTemplate,
} from "../src/platform/seo/registry.ts";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";
import {
	seoRegistry,
	seoRegistryById,
} from "../src/project/seo-registry.generated.ts";
import { wordstatOwners } from "./fixtures/wordstat-owners.ts";

const root = resolve(import.meta.dirname, "..");

function parseCsv(input: string) {
	const lines = input.trim().split(/\r?\n/);
	const headers = lines[0].split(",");
	return lines.slice(1).map((line) => {
		const values = [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map((match) =>
			match[1].replaceAll('""', '"'),
		);
		return Object.fromEntries(
			headers.map((header, index) => [header, values[index]]),
		);
	});
}

const districtRows = parseCsv(
	await readFile(resolve(root, "docs/seo/DISTRICT_REGISTRY_SEED.csv"), "utf8"),
);

const masterPlan = await readFile(
	resolve(root, "docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md"),
	"utf8",
);
const planWordstatOwners = [
	...masterPlan.matchAll(
		/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*([\d ]+)\s*\|\s*`(\/[^`]*)`\s*\|\s*([A-Z0-9_]+)\s*\|$/gm,
	),
]
	.filter((match) => Number(match[1]) <= 50)
	.map((match) => [
		Number(match[1]),
		match[2].trim(),
		Number(match[3].replaceAll(" ", "")),
		match[4],
		match[5],
	]);
assert.deepEqual(
	planWordstatOwners,
	wordstatOwners.map((row) => [...row]),
	"Wordstat owner fixture must exactly match the approved master plan",
);
assert.equal(
	new Set(districtRows.map((row) => `${row.citySlug}/${row.slug}`)).size,
	districtRows.length,
	"District identity must be unique by citySlug/slug",
);

const baseVariables = {
	cityGenitive: "Донецка",
	cityPreposition: "в",
	cityLocative: "Донецке",
	regionShort: "ДНР",
	brandName: "ДОН СИТИ",
};
for (const district of districtRows) {
	const apartmentEntry = seoRegistry.find(
		(entry) =>
			entry.category === "apartment" && entry.districtSlug === district.slug,
	);
	assert.ok(apartmentEntry, `Missing apartment SEO entry for ${district.slug}`);
	const template =
		district.type === "microdistrict"
			? catalogSeoTemplates.apartmentMicrodistrict
			: catalogSeoTemplates.apartmentAdministrativeDistrict;
	assert.deepEqual(
		{
			title: apartmentEntry.title,
			description: apartmentEntry.description,
			h1: apartmentEntry.h1,
		},
		materializeSeoTemplate(template, {
			...baseVariables,
			districtLocative: district.nameLocative,
			districtPreposition: district.preposition,
		}),
		apartmentEntry.registryId,
	);
	if (district.type === "microdistrict") continue;
	const houseEntry = seoRegistry.find(
		(entry) =>
			entry.category === "house" && entry.districtSlug === district.slug,
	);
	assert.ok(houseEntry, `Missing house SEO entry for ${district.slug}`);
	assert.deepEqual(
		{
			title: houseEntry.title,
			description: houseEntry.description,
			h1: houseEntry.h1,
		},
		materializeSeoTemplate(catalogSeoTemplates.houseAdministrativeDistrict, {
			...baseVariables,
			districtLocative: district.nameLocative,
		}),
		houseEntry.registryId,
	);
}

const textilshchik = seoRegistryById.get("APT_MICRO_TEXT");
assert.equal(
	textilshchik?.title,
	"Купить квартиру на Текстильщике в Донецке, ДНР | ДОН СИТИ",
);
assert.equal(textilshchik?.url, "/donetsk/kvartiry/tekstilshchik/");
assert.ok(
	seoRegistry
		.filter((entry) => entry.status === "active")
		.every(
			(entry) =>
				!/^\/(?:kvartiry|doma|uchastki)\/donetsk(?:\/|$)/.test(entry.url),
		),
	"Active registry must not contain category-first V3 URLs",
);

assert.equal(
	wordstatOwners.length,
	50,
	"Wordstat owner fixture must stay frozen at 50 rows",
);
for (const [position, query, broad, ownerUrl, registryId] of wordstatOwners) {
	assert.equal(position > 0 && position <= 50, true, query);
	assert.equal(broad > 0, true, query);
	const registryEntry = seoRegistryById.get(registryId);
	assert.ok(registryEntry, `Missing registry owner ${registryId}`);
	assert.equal(registryEntry.url, ownerUrl, `${position}: ${query}`);
	const result = await resolveProjectPublicRoute(
		ownerUrl.split("/").filter(Boolean),
		{ loadProperty: async () => null },
	);
	assert.equal(result.statusCode, 200, `${position}: ${query}`);
	assert.equal(result.kind, "page", `${position}: ${query}`);
}

console.log(
	`RP-07 SEO registry PASS: ${seoRegistry.length} registry rows, ${wordstatOwners.length} Wordstat owners`,
);
