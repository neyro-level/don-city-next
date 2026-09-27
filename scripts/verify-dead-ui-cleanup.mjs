import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const corporateRoot = join(root, "packages", "ui", "src", "views", "corporate");
assert.equal(
	existsSync(corporateRoot) ? readdirSync(corporateRoot).length : 0,
	0,
	"Unreachable historical corporate view tree must stay empty or absent",
);

const forbiddenTokenPrefixes = [
	"--about-company-",
	"--corporate-form-section-views-",
	"--mortgage-programs-",
	"--sale-negotiation-",
	"--sale-preparation-",
	"--sale-pricing-principles-",
	"--sale-promotion-",
	"--sale-reporting-",
];
const tokenSource = readFileSync(
	join(root, "src", "app", "globals.css"),
	"utf8",
);
for (const prefix of forbiddenTokenPrefixes) {
	assert.doesNotMatch(tokenSource, new RegExp(prefix));
}

const contentModels = readFileSync(
	join(root, "packages", "ui", "src", "view-models", "content.ts"),
	"utf8",
);
assert.doesNotMatch(contentModels, /CorporateRelatedServiceDTO/);
assert.doesNotMatch(contentModels, /CorporateArticlePreviewDTO/);

const publicSurfaceGuard = readFileSync(
	join(root, "scripts", "verify-ui-public-surface.mjs"),
	"utf8",
);
assert.doesNotMatch(publicSurfaceGuard, /MortgageCalculatorView/);

function sourceFiles(directory) {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		if (
			[".git", ".next", "graphify-out", "node_modules"].includes(entry.name)
		) {
			return [];
		}
		const path = join(directory, entry.name);
		if (entry.isDirectory()) return sourceFiles(path);
		return /\.[cm]?[jt]sx?$/.test(entry.name) ? [path] : [];
	});
}

for (const path of sourceFiles(root)) {
	assert.doesNotMatch(
		readFileSync(path, "utf8"),
		/views[\\/]corporate[\\/]/,
		`Deleted corporate UI path is referenced by ${path}`,
	);
}

console.log(
	"verify:dead-ui-cleanup: ok (14 files, 24 tokens, 2 DTO aliases removed)",
);
