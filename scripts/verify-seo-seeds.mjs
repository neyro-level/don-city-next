import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

function parseCsv(input) {
	const rows = [];
	let row = [];
	let value = "";
	let quoted = false;

	for (let index = 0; index < input.length; index += 1) {
		const character = input[index];
		if (quoted) {
			if (character === '"' && input[index + 1] === '"') {
				value += '"';
				index += 1;
			} else if (character === '"') {
				quoted = false;
			} else {
				value += character;
			}
		} else if (character === '"') {
			quoted = true;
		} else if (character === ",") {
			row.push(value);
			value = "";
		} else if (character === "\n") {
			row.push(value.replace(/\r$/, ""));
			rows.push(row);
			row = [];
			value = "";
		} else {
			value += character;
		}
	}

	if (quoted) throw new Error("Unterminated CSV quote");
	if (value || row.length) {
		row.push(value.replace(/\r$/, ""));
		rows.push(row);
	}

	const [headers, ...data] = rows.filter((entry) => entry.some(Boolean));
	return {
		headers,
		rows: data.map((entry) =>
			Object.fromEntries(
				headers.map((header, index) => [header, entry[index] ?? ""]),
			),
		),
	};
}

function assertUnique(values, label) {
	assert.equal(new Set(values).size, values.length, `${label} must be unique`);
}

const seoPath = resolve(root, "docs/seo/SEO_REGISTRY_SEED.csv");
const districtPath = resolve(root, "docs/seo/DISTRICT_REGISTRY_SEED.csv");
const productStructurePath = resolve(root, "docs/02_PRODUCT_STRUCTURE.md");
const siteConfigPath = resolve(root, "src/project/site.config.ts");

const [seoCsv, districtCsv, productStructure, siteConfig] = await Promise.all([
	readFile(seoPath, "utf8"),
	readFile(districtPath, "utf8"),
	readFile(productStructurePath, "utf8"),
	readFile(siteConfigPath, "utf8"),
]);

const seo = parseCsv(seoCsv);
const districts = parseCsv(districtCsv);

assert.deepEqual(seo.headers, [
	"registryId",
	"pageType",
	"category",
	"geoSlug",
	"districtSlug",
	"facetSlug",
	"url",
	"title",
	"description",
	"h1",
	"robots",
	"tier",
	"broad",
	"source",
	"minActiveObjects",
	"contentGateRequired",
	"status",
]);
assert.deepEqual(districts.headers, [
	"name",
	"slug",
	"type",
	"citySlug",
	"parentSlug",
	"preposition",
	"nameLocative",
	"nameGenitive",
	"synonyms",
	"apartmentTier",
	"apartmentBroad",
	"apartmentSource",
	"houseTier",
	"houseBroad",
	"houseSource",
	"isPublished",
]);

assert.equal(
	seo.rows.length,
	42,
	"SEO registry must contain the 40 frozen R1 rows plus two CP-02A commercial owners",
);
assert.equal(
	districts.rows.length,
	10,
	"District registry must contain nine districts and Textilshchik",
);
assert.deepEqual(
	seo.rows.map((row) => row.registryId).sort(),
	[
		"ABOUT",
		"ALL",
		"APT_DIST_BUD",
		"APT_DIST_KALIN",
		"APT_DIST_KIEV",
		"APT_DIST_KIR",
		"APT_DIST_KUYB",
		"APT_DIST_LEN",
		"APT_DIST_PETR",
		"APT_DIST_PROL",
		"APT_DIST_VOR",
		"APT_GEO",
		"APT_MICRO_TEXT",
		"APT_ROOM_1",
		"APT_ROOM_2",
		"APT_ROOM_3",
		"APT_ROOT",
		"CONSENT",
		"CONTACTS",
		"COMM_GEO",
		"COMM_ROOT",
		"HOME",
		"HOUSE_DIST_BUD",
		"HOUSE_DIST_KALIN",
		"HOUSE_DIST_KIEV",
		"HOUSE_DIST_KIR",
		"HOUSE_DIST_KUYB",
		"HOUSE_DIST_LEN",
		"HOUSE_DIST_PETR",
		"HOUSE_DIST_PROL",
		"HOUSE_DIST_VOR",
		"HOUSE_FACET_DACHI",
		"HOUSE_GEO",
		"HOUSE_ROOT",
		"LAND_FACET_IZHS",
		"LAND_FACET_SNT",
		"LAND_GEO",
		"LAND_ROOT",
		"LAW",
		"PRIVACY",
		"SELL",
		"THANKS",
	].sort(),
	"SEO registry IDs must match the approved R1 freeze",
);
assert.deepEqual(
	districts.rows.map((row) => row.slug).sort(),
	[
		"budennovskiy",
		"voroshilovskiy",
		"kalininskiy",
		"kievskiy",
		"kirovskiy",
		"kuybyshevskiy",
		"leninskiy",
		"petrovskiy",
		"proletarskiy",
		"tekstilshchik",
	].sort(),
	"District slugs must match the approved R1 freeze",
);
assertUnique(
	seo.rows.map((row) => row.registryId),
	"SEO registry IDs",
);
assertUnique(
	seo.rows.map((row) => row.url),
	"SEO registry URLs",
);
assertUnique(
	districts.rows.map((row) => `${row.citySlug}/${row.slug}`),
	"District city/slug identities",
);
assert.equal(
	districts.rows.filter((row) => row.type === "administrative_district").length,
	9,
	"Donetsk must have exactly nine administrative district seeds",
);

for (const row of seo.rows) {
	assert.match(
		row.url,
		/^\/$|^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/$/,
		`${row.registryId} must use a root-relative trailing-slash URL`,
	);
	assert.ok(
		row.title && row.description && row.h1,
		`${row.registryId} must materialize title, description and H1`,
	);
	assert.ok(
		["index,follow", "noindex,follow", "noindex,nofollow"].includes(row.robots),
		`${row.registryId} has unsupported robots`,
	);
	assert.ok(
		["active", "candidate"].includes(row.status),
		`${row.registryId} has unsupported status`,
	);
	assert.ok(
		!row.url.includes("vtorichka"),
		"vtorichka route is forbidden in R1",
	);
	assert.ok(
		!row.url.startsWith("/yurist/") || row.url === "/yurist/",
		"child lawyer routes are forbidden in R1",
	);
	if (row.status === "active") {
		assert.doesNotMatch(
			row.url,
			/^\/(?:kvartiry|doma|uchastki|kommercheskaya)\/donetsk(?:\/|$)/,
			`${row.registryId} must not retain a category-first V3 URL`,
		);
	}

	if (row.status === "candidate") {
		assert.equal(
			row.robots,
			"noindex,follow",
			`${row.registryId} candidate must remain noindex until its gates pass`,
		);
		assert.equal(
			row.contentGateRequired,
			"true",
			`${row.registryId} candidate requires Content Gate`,
		);
		assert.ok(
			["P1", "P2", "TEST"].includes(row.tier),
			`${row.registryId} candidate requires a tier`,
		);
		if (row.tier === "TEST") {
			assert.equal(row.broad, "", `${row.registryId} TEST broad must be blank`);
			assert.ok(
				row.source === "fallback_no_wordstat" ||
					(row.registryId === "COMM_GEO" && row.source === "owner_scope_cp02a"),
				`${row.registryId} TEST source mismatch`,
			);
			assert.equal(
				row.minActiveObjects,
				"3",
				`${row.registryId} unified threshold mismatch`,
			);
		} else {
			assert.match(
				row.broad,
				/^[1-9][0-9]*$/,
				`${row.registryId} P1/P2 broad must be positive`,
			);
			assert.equal(
				row.source,
				"wordstat_v1",
				`${row.registryId} P1/P2 source mismatch`,
			);
			assert.equal(
				row.minActiveObjects,
				"3",
				`${row.registryId} unified threshold mismatch`,
			);
		}
	}
}

for (const row of districts.rows) {
	assert.equal(row.citySlug, "donetsk", `${row.slug} must belong to Donetsk`);
	assert.ok(row.name, `${row.slug} name is required`);
	assert.ok(row.preposition, `${row.slug} preposition is required`);
	assert.ok(row.nameLocative, `${row.slug} locative form is required`);
	assert.ok(row.nameGenitive, `${row.slug} genitive form is required`);
	const synonyms = row.synonyms
		.split("|")
		.map((value) => value.trim())
		.filter(Boolean);
	assert.ok(synonyms.length >= 3, `${row.slug} requires explicit feed synonyms`);
	assertUnique(
		synonyms.map((value) => value.toLocaleLowerCase("ru-RU").replaceAll("ё", "е")),
		`${row.slug} normalized synonyms`,
	);
	assert.equal(
		row.isPublished,
		"true",
		`${row.slug} must be published as a selectable geo entity`,
	);
	for (const prefix of ["apartment", "house"]) {
		const tier = row[`${prefix}Tier`];
		if (!tier) continue;
		if (tier === "TEST") {
			assert.equal(
				row[`${prefix}Broad`],
				"",
				`${row.slug} ${prefix} TEST broad must be blank`,
			);
			assert.equal(
				row[`${prefix}Source`],
				"fallback_no_wordstat",
				`${row.slug} ${prefix} TEST source mismatch`,
			);
		} else {
			assert.ok(
				["P1", "P2"].includes(tier),
				`${row.slug} ${prefix} tier mismatch`,
			);
			assert.match(
				row[`${prefix}Broad`],
				/^[1-9][0-9]*$/,
				`${row.slug} ${prefix} broad must be positive`,
			);
			assert.equal(
				row[`${prefix}Source`],
				"wordstat_v1",
				`${row.slug} ${prefix} source mismatch`,
			);
		}
	}
}

const textilshchik = districts.rows.find((row) => row.slug === "tekstilshchik");
assert.deepEqual(
	{
		name: textilshchik?.name,
		type: textilshchik?.type,
		parentSlug: textilshchik?.parentSlug,
		preposition: textilshchik?.preposition,
		nameLocative: textilshchik?.nameLocative,
		nameGenitive: textilshchik?.nameGenitive,
		synonyms: textilshchik?.synonyms,
		apartmentTier: textilshchik?.apartmentTier,
		apartmentBroad: textilshchik?.apartmentBroad,
		apartmentSource: textilshchik?.apartmentSource,
	},
	{
		name: "Текстильщик",
		type: "microdistrict",
		parentSlug: "",
		preposition: "на",
		nameLocative: "Текстильщике",
		nameGenitive: "Текстильщика",
		synonyms: "мкр. Текстильщик|микрорайон Текстильщик|на Текстильщике",
		apartmentTier: "P1",
		apartmentBroad: "137",
		apartmentSource: "wordstat_v1",
	},
);

const byId = new Map(seo.rows.map((row) => [row.registryId, row]));
assert.equal(byId.get("HOME")?.url, "/");
assert.equal(byId.get("ALL")?.url, "/donetsk/");
assert.notEqual(
	byId.get("HOME")?.title,
	byId.get("ALL")?.title,
	"Home and ALL intents must remain separate",
);
assert.equal(byId.get("LAW")?.url, "/yurist/");
assert.equal(
	seo.rows.filter((row) => row.url.startsWith("/yurist/")).length,
	1,
	"R1 must contain exactly one lawyer route",
);

const canonicalOrigin = "https://doncity-home.ru";
assert.ok(
	siteConfig.includes(`canonicalOrigin: "${canonicalOrigin}"`),
	"site config canonical origin mismatch",
);
assert.ok(
	productStructure.includes(`Production origin: \`${canonicalOrigin}\``),
	"Product Structure production origin mismatch",
);
assert.ok(
	!seoCsv.includes("http://") && !seoCsv.includes("https://"),
	"SEO seed URLs must remain root-relative",
);

console.log(
	`SEO seed verification PASS: ${seo.rows.length} SEO rows, ${districts.rows.length} district rows, canonical origin ${canonicalOrigin}`,
);
