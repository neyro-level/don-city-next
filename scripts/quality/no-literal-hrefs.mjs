import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { filesUnder } from "./source-files.mjs";

const root = process.cwd();
const excluded = [
	"src/platform/grammar/",
	"src/project/url-grammar.ts",
	// Generated from the reviewed CSV registry; consumers still resolve through grammar.
	"src/project/seo-registry.generated.ts",
];
const urlFieldLiteral =
	/\b(?:href|canonicalPath|sourcePage|path)\s*(?:=|:)\s*\{?\s*(["'`])(\/[a-zа-я0-9_[\]:${}-][^"'`\s<]*)\1/giu;
const catalogPathLiteral =
	/(["'`])(\/(?:donetsk|kvartiry|doma|uchastki|kommercheskaya|komnaty|garazhi|novostroyki|arenda|obekty|nedvizhimost)(?:\/[^"'`\s<]*)?)\1/giu;
const violations = [];

function resolveModule(importer, specifier) {
	const base = path.resolve(path.dirname(importer), specifier);
	for (const candidate of [
		base,
		`${base}.ts`,
		`${base}.tsx`,
		path.join(base, "index.ts"),
		path.join(base, "index.tsx"),
	]) {
		if (existsSync(candidate) && /\.tsx?$/u.test(candidate)) return candidate;
	}
	return null;
}

function reachableUiSources() {
	const packageRoot = path.join(root, "packages", "ui");
	const packageJson = JSON.parse(
		readFileSync(path.join(packageRoot, "package.json"), "utf8"),
	);
	const pending = Object.values(packageJson.exports)
		.filter((target) => /\.tsx?$/u.test(target))
		.map((target) => path.resolve(packageRoot, target));
	const visited = new Set();
	const relativeImport =
		/\b(?:import|export)\s+(?:type\s+)?(?:[^"'`]*?\s+from\s+)?["'](\.{1,2}\/[^"']+)["']/gu;

	while (pending.length) {
		const file = pending.pop();
		if (!file || visited.has(file)) continue;
		visited.add(file);
		const content = readFileSync(file, "utf8");
		for (const match of content.matchAll(relativeImport)) {
			const dependency = resolveModule(file, match[1]);
			if (dependency && !visited.has(dependency)) pending.push(dependency);
		}
	}

	return [...visited];
}

const reachableUi = reachableUiSources();
for (const expectedPublicOwner of [
	"packages/ui/src/views/home/StarterHomePageView.tsx",
	"packages/ui/src/views/property/GonePropertyPageView.tsx",
]) {
	if (
		!reachableUi.some(
			(file) => path.relative(root, file).replaceAll("\\", "/") === expectedPublicOwner,
		)
	) {
		throw new Error(`guard:no-literal-hrefs missed ${expectedPublicOwner}.`);
	}
}

const publicSourceFiles = [
	...filesUnder(root, "src", new Set([".ts", ".tsx"])),
	...reachableUi,
];

for (const file of publicSourceFiles) {
	const relative = path.relative(root, file).replaceAll("\\", "/");
	if (excluded.some((prefix) => relative.startsWith(prefix))) continue;
	const content = readFileSync(file, "utf8");
	for (const match of content.matchAll(urlFieldLiteral)) {
		const literal = match[2];
		if (literal.startsWith("/:") || literal.includes("${")) continue;
		const line = content.slice(0, match.index).split("\n").length;
		violations.push(`${relative}:${line}: literal public path ${literal}`);
	}
	for (const match of content.matchAll(catalogPathLiteral)) {
		const context = content.slice(Math.max(0, match.index - 24), match.index);
		if (/PageProps<\s*$/u.test(context)) continue;
		const line = content.slice(0, match.index).split("\n").length;
		const violation = `${relative}:${line}: literal catalog path ${match[2]}`;
		if (!violations.includes(violation)) violations.push(violation);
	}
}

if (!catalogPathLiteral.test('href: "/kvartiry/"')) {
	throw new Error("guard:no-literal-hrefs self-test failed.");
}

if (violations.length) {
	console.error(
		"guard:no-literal-hrefs rejected URL construction outside the grammar:",
	);
	console.error(violations.join("\n"));
	process.exitCode = 1;
} else {
	console.log("guard:no-literal-hrefs: PASS");
}
