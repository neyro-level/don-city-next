import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { PublicPropertyPageState } from "../src/core/data-access/public/provider.ts";
import { publicUrlIdFromPayloadId } from "../src/core/identity/public-url-id.ts";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";
import { buildPropertyUrl } from "../src/project/url-grammar.ts";

assert.equal(publicUrlIdFromPayloadId(1042), 1042);
assert.equal(publicUrlIdFromPayloadId("1042"), 1042);
for (const value of [0, -1, 1.5, "id-1042", "1.5"]) {
	assert.throws(() => publicUrlIdFromPayloadId(value));
}

const canonical = buildPropertyUrl({
	category: "apartment",
	semantic: "kalininskiy-2-komnatnaya",
	publicUrlId: 1042,
});
assert.equal(canonical, "/kvartiry/kalininskiy-2-komnatnaya-1042/");

const property = {
	id: "internal-payload-id",
	slug: "kalininskiy-2-komnatnaya",
	href: canonical,
	title: "2-комнатная квартира в Калининском районе",
	description: "Опубликованная квартира в Донецке.",
	category: "apartment",
	address: "Донецк",
	lifecycle: { status: "active", isArchived: false },
} as unknown as Extract<
	PublicPropertyPageState,
	{ property: unknown }
>["property"];

const resolve = (path: string) =>
	resolveProjectPublicRoute(path.split("/").filter(Boolean), {
		loadProperty: async (publicUrlId) =>
			publicUrlId === "1042"
				? { lifecycle: { kind: "active", statusCode: 200 }, property }
				: null,
	});

assert.deepEqual(await resolve("/kvartiry/oshibka-1042/"), {
	kind: "redirect",
	statusCode: 301,
	destination: canonical,
});
assert.deepEqual(await resolve("/doma/kalininskiy-2-komnatnaya-1042/"), {
	kind: "redirect",
	statusCode: 301,
	destination: canonical,
});
assert.deepEqual(await resolve("/kvartiry/oshibka-9999/"), {
	kind: "notFound",
	statusCode: 404,
});

const propertiesSource = readFileSync(
	"src/project/collections/Properties.ts",
	"utf8",
);
const initializerSource = readFileSync(
	"src/core/data-access/system/property-public-url-id.ts",
	"utf8",
);
const stableIdSources = `${propertiesSource}\n${initializerSource}`;
for (const snippet of [
	'name: "publicUrlId"',
	"unique: true",
	"publicUrlIdFromPayloadId(doc.id)",
	"publicUrlIdInitialized: true",
	"data.publicUrlId = originalDoc.publicUrlId",
]) {
	assert.ok(stableIdSources.includes(snippet), `Missing stable-ID guard: ${snippet}`);
}

const catalogSource = readFileSync(
	"src/core/data-access/public/catalog.ts",
	"utf8",
);
assert.ok(
	catalogSource.includes("findPublicPropertyByPublicUrlId"),
	"Public Gateway must expose an explicit publicUrlId lookup.",
);
assert.ok(
	catalogSource.includes("publicUrlId: { equals: Number(publicUrlId) }"),
	"Public lookup must query the explicit public identity field.",
);
assert.ok(
	!catalogSource.includes("{ id: { equals: Number(publicUrlId) } }"),
	"Public lookup must not fall back to the internal Payload id.",
);

const publicConsumerSources = [
	"src/core/data-access/public/dto.ts",
	"src/core/data-access/public/provider.ts",
	"src/core/data-access/public/leads.ts",
].map((file) => readFileSync(file, "utf8"));
for (const source of publicConsumerSources) {
	assert.ok(
		source.includes("publicUrlId: property.publicUrlId"),
		"Every public URL consumer must use the stored publicUrlId.",
	);
}

console.log("EPIC-10 public URL ID contract: PASS");
