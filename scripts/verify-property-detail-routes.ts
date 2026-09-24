import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { PublicPropertyPageState } from "../src/core/data-access/public/provider.ts";
import { resolveProjectPublicRoute } from "../src/project/public-route-resolver.ts";

const categoryCases = [
	["apartment", "kvartiry", "kvartira-v-donetske", "101"],
	["house", "doma", "dom-v-donetske", "102"],
	["land", "uchastki", "uchastok-v-donetske", "103"],
] as const;

for (const [category, categorySlug, slug, publicUrlId] of categoryCases) {
	const href = `/${categorySlug}/${slug}-${publicUrlId}/`;
	const property = {
		id: publicUrlId,
		slug,
		href,
		title: "Опубликованный объект",
		description: "Фактическое описание объекта.",
		category,
		address: "Донецк",
		lifecycle: { status: "active", isArchived: false },
	} as unknown as Extract<
		PublicPropertyPageState,
		{ property: unknown }
	>["property"];
	const resolve = (path: string) =>
		resolveProjectPublicRoute(path.split("/").filter(Boolean), {
			loadProperty: async (candidate) =>
				candidate === publicUrlId
					? { lifecycle: { kind: "active", statusCode: 200 }, property }
					: null,
		});

	const canonical = await resolve(href);
	assert.equal(canonical.kind, "page", href);
	if (canonical.kind === "page") {
		assert.equal(canonical.canonicalPath, href);
	}
	assert.deepEqual(await resolve(`/${categorySlug}/drugoy-slug-${publicUrlId}/`), {
		kind: "redirect",
		statusCode: 301,
		destination: href,
	});
}

const routeSource = readFileSync("src/app/(site)/public-route.tsx", "utf8");
const propertyViewSource = readFileSync(
	"packages/ui/src/views/property/StarterPropertyPageView.tsx",
	"utf8",
);
const lawyerPageSource = readFileSync(
	"src/project/static-page-composition.ts",
	"utf8",
);

assert.match(routeSource, /href: projectUrls\.lawyer/);
assert.match(routeSource, /formKind: "legal"/);
assert.match(propertyViewSource, /Юридическая проверка объекта/);
assert.match(propertyViewSource, /data-lead-form-kind=\{legalSupport\.formKind\}/);
assert.match(propertyViewSource, /href=\{legalSupport\.href\}/);
assert.doesNotMatch(propertyViewSource, /documentCheckSummary|объект проверен/i);
assert.match(lawyerPageSource, /lawyer \? "legal" : "general"/);

console.log("EPIC-28 property detail routes: PASS");
