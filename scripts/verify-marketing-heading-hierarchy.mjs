import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { buildStaticMarketingPage } from "../src/project/static-page-composition.ts";

const marketingViewPath =
	"packages/ui/src/views/marketing/StarterMarketingPageView.tsx";
const cardPath = "packages/ui/src/components/ui/card.tsx";

function parseTsx(path) {
	return ts.createSourceFile(
		path,
		readFileSync(path, "utf8"),
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TSX,
	);
}

function jsxElements(sourceFile) {
	const elements = [];
	function visit(node) {
		if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
			elements.push(node);
		}
		ts.forEachChild(node, visit);
	}
	visit(sourceFile);
	return elements;
}

function tagName(element) {
	return element.tagName.getText();
}

function stringAttribute(element, name) {
	const attribute = element.attributes.properties.find(
		(candidate) => ts.isJsxAttribute(candidate) && candidate.name.text === name,
	);
	if (!attribute || !ts.isJsxAttribute(attribute)) return undefined;
	return attribute.initializer && ts.isStringLiteral(attribute.initializer)
		? attribute.initializer.text
		: undefined;
}

const marketingElements = jsxElements(parseTsx(marketingViewPath));
assert.equal(
	marketingElements.filter((element) => tagName(element) === "h1").length,
	1,
	"Shared marketing composition must own exactly one intrinsic h1",
);
assert.equal(
	marketingElements.filter((element) => tagName(element) === "h3").length,
	0,
	"Shared marketing composition must not skip from h1 to intrinsic h3",
);

const sectionTitle = marketingElements.find(
	(element) => tagName(element) === "CardTitle",
);
assert.ok(sectionTitle, "Marketing sections must use the project CardTitle");
assert.equal(
	stringAttribute(sectionTitle, "as"),
	"h2",
	"Marketing section titles must render as h2",
);

const cardSource = readFileSync(cardPath, "utf8");
assert.match(cardSource, /as: Heading = ["']h3["']/);
assert.match(cardSource, /as\?: ["']h2["'] \| ["']h3["']/);
assert.match(cardSource, /<Heading\b/);

const nap = {
	legalName: "Test legal owner",
	address: { full: "Test address" },
	phone: { display: "+7 000 000-00-00" },
	email: "test@example.invalid",
	openingHours: "Daily",
};
const representativePages = [
	["prodat-nedvizhimost", undefined],
	["yurist", undefined],
	["o-kompanii", nap],
	["kontakty", nap],
];

for (const [slug, pageNap] of representativePages) {
	const routePath = `src/app/(site)/${slug}/page.tsx`;
	const routeSource = readFileSync(routePath, "utf8");
	assert.match(routeSource, /ResolvedPublicRoutePage/);
	assert.match(routeSource, new RegExp(`segments = \\["${slug}"\\]`));

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
	assert.ok(page.sections.length > 0, `${slug} must exercise section headings`);
}

console.log(
	"verify:marketing-headings: ok (one h1, h2 sections, four representative routes)",
);
