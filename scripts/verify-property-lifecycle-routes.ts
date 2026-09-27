import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import type { PublicPropertyPageState } from "../src/core/data-access/public/provider.ts";
import { createPropertyGoneResponse } from "../src/core/http/property-gone-response.ts";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";

type PropertyDetails = Extract<
	PublicPropertyPageState,
	{ property: unknown }
>["property"];

function propertyFixture(input: {
	publicUrlId: string;
	slug: string;
	status: "active" | "archived";
}): PropertyDetails {
	return {
		id: input.publicUrlId,
		slug: input.slug,
		href: `/kvartiry/${input.slug}-${input.publicUrlId}/`,
		title: "2-комнатная квартира в Калининском районе",
		description: "Опубликованный объект недвижимости в Донецке.",
		category: "apartment",
		address: "Донецк",
		city: "Донецк",
		lifecycle: {
			status: input.status,
			isArchived: input.status === "archived",
		},
	} as unknown as PropertyDetails;
}

const active = propertyFixture({
	publicUrlId: "1042",
	slug: "kalininskiy-2-komnatnaya",
	status: "active",
});
const archived = propertyFixture({
	publicUrlId: "1043",
	slug: "arhivnaya-2-komnatnaya",
	status: "archived",
});

const states = new Map<string, PublicPropertyPageState>([
	[
		"1042",
		{ lifecycle: { kind: "active", statusCode: 200 }, property: active },
	],
	[
		"1043",
		{
			lifecycle: { kind: "archived", statusCode: 200, robots: "noindex" },
			property: archived,
		},
	],
	[
		"1044",
		{
			lifecycle: {
				kind: "redirect",
				statusCode: 308,
				destination: active.href,
			},
		},
	],
	["1045", { lifecycle: { kind: "gone", statusCode: 410, robots: "noindex" } }],
]);

async function resolve(path: string) {
	return resolveProjectPublicRoute(path.split("/").filter(Boolean), {
		loadProperty: async (publicUrlId) => states.get(publicUrlId) ?? null,
	});
}

const activePage = await resolve("/kvartiry/kalininskiy-2-komnatnaya-1042/");
assert.equal(activePage.kind, "page");
assert.equal(activePage.statusCode, 200);
if (activePage.kind === "page") {
	assert.equal(activePage.robots.indexing, "index");
	assert.equal(activePage.canonicalPath, active.href);
}

const archivedPage = await resolve("/kvartiry/arhivnaya-2-komnatnaya-1043/");
assert.equal(archivedPage.kind, "page");
assert.equal(archivedPage.statusCode, 200);
if (archivedPage.kind === "page") {
	assert.equal(archivedPage.robots.indexing, "noindex");
	assert.equal(archivedPage.canonicalPath, archived.href);
}

assert.deepEqual(await resolve("/kvartiry/ustarevshiy-slug-1042/"), {
	kind: "redirect",
	statusCode: 301,
	destination: active.href,
});

assert.deepEqual(await resolve("/kvartiry/udalennyy-obekt-1045/"), {
	kind: "gone",
	statusCode: 410,
	publicUrlId: "1045",
});

assert.deepEqual(await resolve("/kvartiry/perenesennyy-obekt-1044/"), {
	kind: "redirect",
	statusCode: 308,
	destination: active.href,
});

assert.deepEqual(await resolve("/kvartiry/neizvestnyy-obekt-9999/"), {
	kind: "notFound",
	statusCode: 404,
});

assert.deepEqual(await resolve("/obekty/kalininskiy-2-komnatnaya/"), {
	kind: "notFound",
	statusCode: 404,
});

const goneResponse = createPropertyGoneResponse("1045");
const goneHtml = await goneResponse.text();
assert.equal(goneResponse.status, 410);
assert.equal(goneResponse.headers.get("x-robots-tag"), "noindex, follow");
assert.match(goneHtml, /<html lang="ru">/);
assert.match(goneHtml, /<meta name="viewport"/);
assert.match(goneHtml, /<main>/);
assert.match(goneHtml, /<h1>Объект снят с публикации<\/h1>/);

const proxySource = readFileSync("src/proxy.ts", "utf8");
assert.match(proxySource, /createPropertyGoneResponse\(publicUrlId\)/);
assert.match(proxySource, /getPublicPropertyEdgeState/);
assert.doesNotMatch(proxySource, /getPublicPropertyByPublicUrlId/);

console.log("EPIC-29 property lifecycle route matrix: PASS");
