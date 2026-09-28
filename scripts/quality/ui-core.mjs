import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import {
	collectDesignFindings,
	fingerprint,
	scanDesignLiterals,
	walk,
} from "./ui-core-lib.mjs";

const root = resolve(import.meta.dirname, "../..");
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const failures = [];
const rules = readJson(join(import.meta.dirname, "ui-core.rules.json"));
const baseline = readJson(join(import.meta.dirname, "ui-core-baseline.json"));
const clonePolicy = readJson(join(import.meta.dirname, "ui-clone-policy.json"));

assert.equal(rules.schema_version, 1);
assert.equal(baseline.schema_version, 1);
assert.equal(
	new Set(rules.rules.map((rule) => rule.id)).size,
	rules.rules.length,
);
for (const rule of rules.rules) {
	assert.match(
		rule.classification,
		/^(MECHANICAL|TARGETED|VISUAL|MANUAL|N\/A)$/,
	);
	assert.ok(rule.proof);
}

const fixture = [
	'<div className="rounded-[18px] text-[13px] font-[550] duration-[175ms]" />',
	'<div className="rounded-[15px] bg-[#fff]" />',
].join("\n");
const fixtureFindings = scanDesignLiterals(fixture);
for (const value of [
	"rounded-[18px]",
	"rounded-[15px]",
	"text-[13px]",
	"font-[550]",
	"duration-[175ms]",
	"bg-[#fff]",
]) {
	assert.ok(
		fixtureFindings.some((finding) => finding.value === value),
		`fixture not detected: ${value}`,
	);
}
assert.deepEqual(
	scanDesignLiterals(
		'<div className="w-[42px] grid-cols-[1fr_auto] aspect-[4/3] rounded-[var(--radius)] text-[var(--text)]" />',
	),
	[],
	"structural geometry and CSS variables must not be design-literal violations",
);

const designFindings = collectDesignFindings(root);
const current = new Map(
	designFindings.map((finding) => [fingerprint(finding), finding]),
);
const accepted = new Set(baseline.findings);
const acceptedDesign = new Set(
	baseline.findings.filter((key) => key.startsWith("design-literals|")),
);
for (const key of current.keys()) {
	if (!accepted.has(key)) failures.push(`new UI design literal: ${key}`);
}
for (const key of acceptedDesign) {
	if (!current.has(key)) failures.push(`stale UI baseline entry: ${key}`);
}

const componentsPath = join(root, "packages", "ui", "components.json");
const components = readJson(componentsPath);
const expectedAliases = {
	components: "@ams/realtbase-ui/components",
	utils: "@ams/realtbase-ui/lib/utils",
	ui: "@ams/realtbase-ui/components/ui",
	lib: "@ams/realtbase-ui/lib",
};
for (const [key, value] of Object.entries(expectedAliases)) {
	if (components.aliases?.[key] !== value)
		failures.push(`components.json alias ${key} must equal ${value}`);
}

const uiPackage = readJson(join(root, "packages", "ui", "package.json"));
assert.deepEqual(
	Object.keys(uiPackage.exports).sort(),
	[
		"./analytics",
		"./primitives",
		"./public/catalog-page",
		"./public/gone-property-page",
		"./public/home-page",
		"./public/legal-document-page",
		"./public/marketing-page",
		"./public/property-page",
		"./public/site-shell",
		"./styles.css",
	].sort(),
	"UI package exports must stay intentional and closed",
);

for (const path of walk(join(root, "src", "app"))) {
	if (!/\.[cm]?[jt]sx?$/.test(path)) continue;
	const source = readFileSync(path, "utf8");
	if (/@ams\/realtbase-ui(?:["']|\/(?:views(?:["']|\/)|starter\/))/.test(source)) {
		failures.push(
			`public app must use canonical UI exports: ${relative(root, path).replaceAll("\\", "/")}`,
		);
	}
}

for (const relativePath of [
	"packages/ui/src/views/home/StarterHomePageView.tsx",
	"packages/ui/src/views/catalog/StarterCatalogPageView.tsx",
	"packages/ui/src/views/property/StarterPropertyPageView.tsx",
]) {
	const source = readFileSync(join(root, relativePath), "utf8");
	if (/<section[^>]*>[\s\S]{0,240}<Section(?:\s|>)(?![^>]*as=["']div["'])/.test(source)) {
		failures.push(`semantic section nesting: ${relativePath}`);
	}
	if (/<SectionHeader[\s\S]{0,300}<h2[^>]*sr-only/.test(source)) {
		failures.push(`duplicate visible and sr-only section heading: ${relativePath}`);
	}
}

const shellSource = readFileSync(
	join(
		root,
		"packages",
		"ui",
		"src",
		"views",
		"public-shell",
		"PublicSiteShellView.tsx",
	),
	"utf8",
);
for (const requiredPattern of [
	/aria-label="Основная навигация"/,
	/aria-label="Мобильная навигация"/,
	/aria-expanded=/,
	/event\.key === "Escape"/,
	/document\.addEventListener\("pointerdown"/,
]) {
	if (!requiredPattern.test(shellSource)) {
		failures.push(`public navigation contract missing: ${requiredPattern}`);
	}
}
const plainUsageCount = walk(join(root, "packages", "ui", "src"))
	.filter((path) => /\.tsx$/.test(path))
	.reduce(
		(count, path) =>
			count +
			(readFileSync(path, "utf8").match(/variant=["']plain["']/g)?.length ?? 0),
		0,
	);
if (plainUsageCount > clonePolicy.plain_usage_limit) {
	failures.push(
		`plain primitive usage ${plainUsageCount} exceeds policy limit ${clonePolicy.plain_usage_limit}`,
	);
}

const primitiveRoot = join(root, "packages", "ui", "src", "components", "ui");
const primitiveNames = new Set(
	walk(primitiveRoot).map((path) => basename(path)),
);
for (const path of walk(join(root, "packages", "ui", "src"))) {
	if (dirname(path) === primitiveRoot || !primitiveNames.has(basename(path)))
		continue;
	failures.push(
		`duplicate primitive owner: ${relative(root, path).replaceAll("\\", "/")}`,
	);
}

const canonicalPrimitiveOwners = new Map([
	["Button", "packages/ui/src/components/ui/button.tsx"],
	["Input", "packages/ui/src/components/ui/input.tsx"],
	["Dialog", "packages/ui/src/components/ui/dialog.tsx"],
	["Card", "packages/ui/src/components/ui/card.tsx"],
	["Table", "packages/ui/src/components/ui/table.tsx"],
]);
const discoveredPrimitiveOwners = new Map(
	[...canonicalPrimitiveOwners.keys()].map((name) => [name, []]),
);
const primitiveDeclarationPattern =
	/export\s+(?:const|function)\s+(Button|Input|Dialog|Card|Table)\b/g;
for (const path of walk(join(root, "packages", "ui", "src"))) {
	if (!/\.[cm]?[jt]sx?$/.test(path)) continue;
	const source = readFileSync(path, "utf8");
	const owner = relative(root, path).replaceAll("\\", "/");
	for (const match of source.matchAll(primitiveDeclarationPattern)) {
		discoveredPrimitiveOwners.get(match[1]).push(owner);
	}
}
for (const [name, expectedOwner] of canonicalPrimitiveOwners) {
	const owners = discoveredPrimitiveOwners.get(name).sort();
	if (owners.length !== 1 || owners[0] !== expectedOwner) {
		failures.push(
			`${name} must have exactly one canonical owner ${expectedOwner}; found: ${owners.join(", ") || "none"}`,
		);
	}
}

const layout = readFileSync(join(root, "src", "app", "layout.tsx"), "utf8");
const globals = readFileSync(join(root, "src", "app", "globals.css"), "utf8");
const themeBoundary = globals.indexOf("\n@theme inline");
const privateTypographyReference = /var\(--site-(?:type|leading|tracking)-/;
if (themeBoundary < 0)
	failures.push("semantic typography: @theme inline is missing");
if (privateTypographyReference.test(globals.slice(0, themeBoundary))) {
	failures.push(
		"semantic typography: private numeric source may only feed @theme roles",
	);
}
const themeEnd = globals.indexOf("\n}", themeBoundary);
const themeBlock = globals.slice(themeBoundary, themeEnd);
const typographyRoles = [...themeBlock.matchAll(/^\s*(--text-[a-z0-9-]+):/gm)]
	.map((match) => match[1])
	.sort();
assert.deepEqual(
	typographyRoles,
	[
		"--text-body",
		"--text-body-lg",
		"--text-body-sm",
		"--text-caption",
		"--text-h1",
		"--text-h2",
		"--text-h3",
		"--text-h4",
		"--text-label",
		"--text-process-step",
	].sort(),
	"typography must expose only the canonical roles and the approved decorative step exception",
);
const exceptionStart = globals.indexOf("/* Approved component exceptions:");
const exceptionEnd = globals.indexOf("/* End approved component exceptions. */");
const componentExceptionTokens = [
	...globals
		.slice(exceptionStart, exceptionEnd)
		.matchAll(/^\s*(--[a-z0-9-]+):/gm),
]
	.map((match) => match[1])
	.sort();
assert.ok(exceptionStart >= 0 && exceptionEnd > exceptionStart);
assert.ok(
	componentExceptionTokens.every((token) =>
		/^--(?:catalog-hero-overlay-|home-action-shadow|site-header-shadow|house-project-preview-visual-primary)/.test(
			token,
		),
	),
	"component-specific tokens are limited to documented visual exceptions",
);
const legacyTypographyRole =
	/\btext-(?:display(?:-[a-z-]+)?|section(?:-[a-z-]+)?|heading(?:-[a-z-]+)?|editorial-[a-z-]+|micro(?:-tight)?|overline|support(?:-dense)?|lead(?:-compact)?|body-(?:large|compact|dense|emphasis|highlight|fluid)|caption-(?:tight|dense|relaxed)|label-relaxed|card-(?:large|fluid|compact(?:-(?:medium|large))?|title(?:-large)?|section|heading-fluid)|price(?:-(?:large|medium|mobile))?|selection-title|profile-title|calculator-result|property-title|dialog-(?:title|subtitle)|footer-title|route-status|thank-you)\b/;
for (const path of walk(join(root, "packages", "ui", "src"))) {
	if (!/\.(?:css|tsx?)$/.test(path)) continue;
	const source = readFileSync(path, "utf8");
	if (privateTypographyReference.test(source)) {
		failures.push(
			`semantic typography: UI consumer bypasses public role in ${relative(root, path).replaceAll("\\", "/")}`,
		);
	}
	if (legacyTypographyRole.test(source)) {
		failures.push(
			`semantic typography: legacy role in ${relative(root, path).replaceAll("\\", "/")}`,
		);
	}
}
const fontToken = globals.match(/--font-sans:\s*([^;]+);/)?.[1]?.trim();
const usesNextFont = /from\s+["']next\/font\//.test(layout);
if (!fontToken) failures.push("font mapping: --font-sans is missing");
if (fontToken?.includes('"Manrope"') && !usesNextFont) {
	const key = "font-mapping|src/app/layout.tsx|Manrope-without-next-font";
	if (!accepted.has(key)) failures.push(`font mapping mismatch: ${key}`);
}

const clientFiles = walk(join(root, "packages", "ui", "src"))
	.filter((path) => /^\s*["']use client["'];/m.test(readFileSync(path, "utf8")))
	.map((path) => relative(root, path).replaceAll("\\", "/"))
	.sort();

const report = {
	schema_version: 1,
	status: failures.length ? "FAIL" : "PASS",
	rules: rules.rules,
	counts: {
		design_findings: designFindings.length,
		baselined_findings: baseline.findings.length,
		client_boundaries: clientFiles.length,
	},
	client_boundaries: clientFiles,
};
assert.deepEqual(
	Object.keys(report).sort(),
	["client_boundaries", "counts", "rules", "schema_version", "status"].sort(),
);

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}

console.log(JSON.stringify(report, null, 2));
console.log("verify:ui-core: ok");
