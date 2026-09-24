import assert from "node:assert/strict";
import { executeInternalRevalidation } from "../src/core/cache/internal-route-executor.ts";
import type { PublicPropertyPageState } from "../src/core/data-access/public/provider.ts";
import { buildPublicAnalyticsEvent } from "../src/platform/analytics/event.ts";
import {
	buildPropertyInvalidationTargets,
	publicCacheTags,
} from "../src/project/cache-tags.ts";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";

const property = {
	id: "1042",
	slug: "kalininskiy-2-komnatnaya",
	href: "/kvartiry/kalininskiy-2-komnatnaya-1042/",
	title: "Квартира",
	description: "Опубликованный объект",
	category: "apartment",
	city: "Донецк",
	district: "Калининский район",
	address: "Адрес",
	lifecycle: { status: "active", isArchived: false },
} as unknown as Extract<
	PublicPropertyPageState,
	{ property: unknown }
>["property"];

const loadProperty = async (
	id: string,
): Promise<PublicPropertyPageState | null> =>
	id === "1042"
		? { lifecycle: { kind: "active", statusCode: 200 }, property }
		: null;

const catalog = await resolveProjectPublicRoute(["donetsk", "kvartiry"], {
	loadProperty,
});
assert.equal(catalog.kind, "page");
if (catalog.kind === "page") {
	assert.deepEqual(catalog.identity, {
		geoSlug: "donetsk",
		pageKey: "/donetsk/kvartiry/",
		category: "kvartiry",
	});
}

const propertyPage = await resolveProjectPublicRoute(
	["kvartiry", "kalininskiy-2-komnatnaya-1042"],
	{ loadProperty },
);
assert.equal(propertyPage.kind, "page");
if (propertyPage.kind !== "page") throw new Error("Property fixture failed.");
assert.deepEqual(propertyPage.identity, {
	geoSlug: "donetsk",
	pageKey: "/kvartiry/kalininskiy-2-komnatnaya-1042/",
	category: "kvartiry",
});

const targets = buildPropertyInvalidationTargets({
	geoSlug: "donetsk",
	category: "kvartiry",
	districtSlug: "kalininskiy",
	publicUrlId: "1042",
});
assert.deepEqual(
	targets.map((target) => (target.type === "tag" ? target.tag : target.path)),
	[
		"geo:donetsk",
		"geo:donetsk:cat:kvartiry",
		"district:donetsk:kalininskiy",
		"property:1042",
	],
);
assert.equal(publicCacheTags.geo("makeevka"), "geo:makeevka");

let invalidated = 0;
const revalidation = await executeInternalRevalidation({
	expectedSecret: "test-secret",
	providedSecret: "test-secret",
	body: { targets },
	invalidate: async (accepted) => {
		invalidated = accepted.length;
	},
});
assert.equal(revalidation.status, 200);
assert.equal(invalidated, 4);

assert.deepEqual(
	buildPublicAnalyticsEvent({
		event: "property_open",
		identity: propertyPage.identity,
		dimensions: { category: "kvartiry", position: 1 },
	}),
	{
		event: "property_open",
		geo_slug: "donetsk",
		page_key: "/kvartiry/kalininskiy-2-komnatnaya-1042/",
		dimensions: { category: "kvartiry", position: 1 },
	},
);
assert.throws(
	() =>
		buildPublicAnalyticsEvent({
			event: "lead_submit",
			identity: propertyPage.identity,
			dimensions: { phone: "+70000000000" },
		}),
	/PII key rejected/,
);

console.log("RP-10 gateway/cache/analytics contracts: PASS");
