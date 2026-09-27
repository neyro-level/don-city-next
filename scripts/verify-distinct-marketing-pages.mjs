import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
	getMarketingCompositionKind,
	getMarketingConversionCopy,
} from "../packages/ui/src/views/marketing/marketing-page-contract.ts";
import { buildStaticMarketingPage } from "../src/project/static-page-composition.ts";

const nap = {
	legalName: "Test legal owner",
	address: { full: "Test address" },
	phone: { display: "+7 000 000-00-00" },
	email: "test@example.invalid",
	openingHours: "Daily",
};
const cases = [
	["prodat-nedvizhimost", "sell-process", "sell", undefined],
	["yurist", "legal-services", "legal", undefined],
	["o-kompanii", "about-trust", "general", nap],
	["kontakty", "contacts-access", "general", nap],
];

const kinds = new Set();
for (const [slug, expectedKind, expectedFormKind, pageNap] of cases) {
	const kind = getMarketingCompositionKind(slug);
	assert.equal(kind, expectedKind);
	kinds.add(kind);
	const conversion = getMarketingConversionCopy(kind);
	assert.ok(conversion.title.length > 0);
	assert.ok(conversion.description.length > 0);
	assert.ok(conversion.submitLabel.length > 0);

	const page = buildStaticMarketingPage({
		slug,
		title: `Test ${slug}`,
		seo: {
			title: `Test ${slug}`,
			description: `Test description ${slug}`,
			canonicalPath: `/${slug}/`,
			indexing: "index",
			following: "follow",
		},
		breadcrumbs: { items: [{ label: "Home", href: "/" }, { label: slug }] },
		nap: pageNap,
	});
	assert.ok(
		page.sections.length >= 2,
		`${slug} needs a meaningful composition`,
	);
	assert.equal(page.leadContext?.formKind, expectedFormKind);
	assert.equal(
		page.primaryAction,
		undefined,
		`${slug} must have one conversion`,
	);
}
assert.equal(kinds.size, 4, "Each target page must own a distinct composition");
assert.equal(getMarketingCompositionKind("spasibo"), "generic");

const viewSource = readFileSync(
	"packages/ui/src/views/marketing/StarterMarketingPageView.tsx",
	"utf8",
);
for (const kind of kinds) {
	assert.match(viewSource, new RegExp(`kind === ["']${kind}["']`));
	assert.match(viewSource, /data-marketing-composition=\{kind\}/);
}
assert.match(viewSource, /<ol\b/);
assert.match(viewSource, /<article\b/);
assert.match(viewSource, /<address\b/);
assert.match(viewSource, /sm:grid-cols-2/);
assert.match(viewSource, /md:grid-cols-2/);
assert.match(viewSource, /lg:grid-cols-3/);
assert.equal(
	[...viewSource.matchAll(/<LeadFormView\b/g)].length,
	1,
	"Shared composition must render one primary lead conversion",
);

console.log(
	"verify:distinct-marketing-pages: ok (4 factual compositions, 1 conversion each)",
);
