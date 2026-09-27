import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const uiRoot = join(root, "packages", "ui");
const canonicalRelative = "src/views/public-shell/PublicSiteShellView.tsx";
const canonicalPath = join(uiRoot, canonicalRelative);
const packageJson = JSON.parse(
	readFileSync(join(uiRoot, "package.json"), "utf8"),
);

assert.equal(
	packageJson.exports["./public/site-shell"],
	`./${canonicalRelative}`,
	"public shell entrypoint must resolve to its project-owned canonical source",
);
assert.ok(existsSync(canonicalPath), "canonical public shell source must exist");

for (const removedPath of [
	"src/views/starter/SiteShellView.tsx",
	"src/view-models/site-shell.ts",
]) {
	assert.equal(
		existsSync(join(uiRoot, removedPath)),
		false,
		`parallel or historical shell owner must stay absent: ${removedPath}`,
	);
}
const alternateTree = join(uiRoot, "src", "views", "site-shell");
assert.equal(
	existsSync(alternateTree) ? readdirSync(alternateTree).length : 0,
	0,
	"parallel shell tree must contain no source files",
);

const canonicalSource = readFileSync(canonicalPath, "utf8");
for (const canonicalSymbol of [
	"PublicSiteHeaderView",
	"PublicSiteFooterView",
	"PublicSiteShellView",
]) {
	assert.match(
		canonicalSource,
		new RegExp(`export function ${canonicalSymbol}\\b`),
		`canonical shell must own ${canonicalSymbol}`,
	);
}

for (const [legacy, canonical] of [
	["StarterSiteHeader", "PublicSiteHeaderView"],
	["StarterSiteFooter", "PublicSiteFooterView"],
	["SiteShellView", "PublicSiteShellView"],
]) {
	assert.match(
		canonicalSource,
		new RegExp(
			`/\\*\\* @deprecated Use ${canonical}\\. \\*/\\s*export const ${legacy} = ${canonical};`,
		),
		`${legacy} must be a documented direct compatibility alias`,
	);
}

const walkSources = (directory) =>
	readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) return walkSources(path);
		return /\.[cm]?[jt]sx?$/.test(entry.name) ? [path] : [];
	});

const owners = [];
for (const path of walkSources(join(uiRoot, "src"))) {
	const source = readFileSync(path, "utf8");
	if (
		/export function PublicSiteHeaderView\b/.test(source) ||
		/export function PublicSiteFooterView\b/.test(source)
	) {
		owners.push(relative(uiRoot, path).replaceAll("\\", "/"));
	}
}
assert.deepEqual(
	owners,
	[canonicalRelative],
	"header and footer must have exactly one implementation owner",
);

const layoutSource = readFileSync(join(root, "src", "app", "(site)", "layout.tsx"), "utf8");
const routeHeaderSource = readFileSync(
	join(root, "src", "app", "(site)", "public-site-header.tsx"),
	"utf8",
);
for (const source of [layoutSource, routeHeaderSource]) {
	assert.match(
		source,
		/from "@ams\/realtbase-ui\/public\/site-shell"/,
		"public route shell consumers must use the canonical package entrypoint",
	);
}

console.log(
	"verify:canonical-shell: ok (1 implementation owner, 3 direct compatibility aliases)",
);
