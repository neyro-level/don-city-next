import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const uiRoot = join(root, "packages", "ui");
const packageJson = JSON.parse(
	readFileSync(join(uiRoot, "package.json"), "utf8"),
);

const expectedExports = {
	"./analytics": "./src/analytics.tsx",
	"./primitives": "./src/primitives.ts",
	"./public/catalog-page": "./src/views/catalog/StarterCatalogPageView.tsx",
	"./public/gone-property-page": "./src/views/property/GonePropertyPageView.tsx",
	"./public/home-page": "./src/views/home/StarterHomePageView.tsx",
	"./public/legal-document-page": "./src/views/legal/LegalDocumentView.tsx",
	"./public/marketing-page": "./src/views/marketing/StarterMarketingPageView.tsx",
	"./public/property-page": "./src/views/property/StarterPropertyPageView.tsx",
	"./public/site-shell": "./src/views/public-shell/PublicSiteShellView.tsx",
	"./styles.css": "./src/styles.css",
};

assert.deepEqual(
	packageJson.exports,
	expectedExports,
	"@ams/realtbase-ui must expose only the active canonical public surface",
);

for (const target of Object.values(expectedExports)) {
	assert.ok(
		existsSync(join(uiRoot, target)),
		`public export target must exist: ${target}`,
	);
}

for (const removedBarrel of ["src/index.ts", "src/views.ts"]) {
	assert.equal(
		existsSync(join(uiRoot, removedBarrel)),
		false,
		`broad public barrel must stay absent: ${removedBarrel}`,
	);
}

const sourceFiles = (directory) =>
	readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) return sourceFiles(path);
		return /\.[cm]?[jt]sx?$/.test(entry.name) ? [path] : [];
	});

const forbiddenImport = /from\s+["']@ams\/realtbase-ui(?:["']|\/(?:views(?:["']|\/)|starter\/))/;
for (const path of sourceFiles(join(root, "src", "app"))) {
	assert.doesNotMatch(
		readFileSync(path, "utf8"),
		forbiddenImport,
		`runtime app import must use a canonical UI entrypoint: ${relative(root, path)}`,
	);
}

const publicTargets = new Set(Object.values(expectedExports));
for (const internalOnly of [
	"./src/views/home/HomeNewBuildingsView.tsx",
	"./src/views/corporate/MortgageCalculatorView.tsx",
	"./src/views/legal/LegalHubView.tsx",
]) {
	assert.ok(existsSync(join(uiRoot, internalOnly)), `expected internal module: ${internalOnly}`);
	assert.equal(
		publicTargets.has(internalOnly),
		false,
		`future module must stay unreachable from package exports: ${internalOnly}`,
	);
}

console.log("verify:ui-public-surface: ok (10 canonical exports, 9 removed)");
