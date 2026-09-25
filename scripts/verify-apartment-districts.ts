import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";
import { seoRegistry } from "../src/project/seo-registry.generated.ts";

const districtCsv = await readFile(
	new URL("../docs/seo/DISTRICT_REGISTRY_SEED.csv", import.meta.url),
	"utf8",
);

function parseCsv(input: string): Record<string, string>[] {
	const parsed: string[][] = [];
	let row: string[] = [];
	let value = "";
	let quoted = false;
	for (let index = 0; index < input.length; index += 1) {
		const character = input[index];
		if (quoted) {
			if (character === '"' && input[index + 1] === '"') {
				value += '"';
				index += 1;
			} else if (character === '"') quoted = false;
			else value += character;
		} else if (character === '"') quoted = true;
		else if (character === ",") {
			row.push(value);
			value = "";
		} else if (character === "\n") {
			row.push(value.replace(/\r$/u, ""));
			parsed.push(row);
			row = [];
			value = "";
		} else value += character;
	}
	if (value || row.length) {
		row.push(value.replace(/\r$/u, ""));
		parsed.push(row);
	}
	const [headers, ...data] = parsed.filter((entry) => entry.some(Boolean));
	assert.ok(headers, "District CSV headers are required");
	return data.map((entry) =>
		Object.fromEntries(
			headers.map((header, index) => [header, entry[index] ?? ""]),
		),
	);
}

const rows = parseCsv(districtCsv);

const apartmentEntries = seoRegistry.filter(
	(entry) => entry.pageType === "district" && entry.category === "apartment",
);
assert.equal(apartmentEntries.length, 10);

const baseDependencies = {
	loadProperty: async () => null,
	loadDistrictParentSlug: async () => null,
};

for (const entry of apartmentEntries) {
	const result = await resolveProjectPublicRoute(
		entry.url.split("/").filter(Boolean),
		baseDependencies,
	);
	assert.equal(result.kind, "page", `${entry.registryId} must resolve`);
	if (result.kind !== "page") continue;
	assert.equal(result.canonicalPath, entry.url);
	assert.equal(result.title, entry.title);
	assert.equal(result.h1, entry.h1);
	assert.equal(result.robots.indexing, "noindex");
	assert.deepEqual(result.catalogQuery, {
		category: "apartment",
		geoSlug: "donetsk",
		districtSlug: entry.districtSlug,
		rooms: undefined,
		landUse: undefined,
	});
	assert.equal(result.breadcrumbs.at(-1)?.label, entry.h1);
	assert.equal(result.breadcrumbs.length, 4);
}

const textilshchik = rows.find((row) => row.slug === "tekstilshchik");
assert.deepEqual(
	{
		type: textilshchik?.type,
		parentSlug: textilshchik?.parentSlug,
		preposition: textilshchik?.preposition,
		nameLocative: textilshchik?.nameLocative,
		apartmentTier: textilshchik?.apartmentTier,
		apartmentBroad: textilshchik?.apartmentBroad,
		apartmentSource: textilshchik?.apartmentSource,
	},
	{
		type: "microdistrict",
		parentSlug: "",
		preposition: "на",
		nameLocative: "Текстильщике",
		apartmentTier: "P1",
		apartmentBroad: "137",
		apartmentSource: "wordstat_v1",
	},
);

for (const row of rows.filter(
	(candidate) => candidate.apartmentTier === "TEST",
)) {
	assert.equal(row.apartmentBroad, "");
	assert.equal(row.apartmentSource, "fallback_no_wordstat");
	const entry = apartmentEntries.find(
		(candidate) => candidate.districtSlug === row.slug,
	);
	assert.equal(entry?.minActiveObjects, "10");
}

const withParent = await resolveProjectPublicRoute(
	["donetsk", "kvartiry", "tekstilshchik"],
	{
		...baseDependencies,
		loadDistrictParentSlug: async () => "kirovskiy",
	},
);
assert.equal(withParent.kind, "page");
if (withParent.kind === "page") {
	assert.equal(withParent.canonicalPath, "/donetsk/kvartiry/tekstilshchik/");
	assert.deepEqual(
		withParent.breadcrumbs.map((item) => item.href),
		[
			"/",
			"/donetsk/",
			"/donetsk/kvartiry/",
			"/donetsk/kvartiry/kirovskiy/",
			undefined,
		],
	);
}

const unknown = await resolveProjectPublicRoute(
	["donetsk", "kvartiry", "unknown-district"],
	baseDependencies,
);
assert.deepEqual(unknown, { kind: "notFound", statusCode: 404 });

console.log(
	`EPIC-22 apartment districts contract: PASS (${apartmentEntries.length} district routes)`,
);
