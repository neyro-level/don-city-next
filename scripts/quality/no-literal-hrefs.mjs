import { readFileSync } from "node:fs";
import path from "node:path";
import { filesUnder } from "./source-files.mjs";

const root = process.cwd();
const excluded = ["src/platform/grammar/", "src/project/url-grammar.ts"];
const urlFieldLiteral =
	/\b(?:href|canonicalPath|sourcePage|path)\s*(?:=|:)\s*\{?\s*(["'`])(\/[a-zа-я0-9_[\]:${}-][^"'`\s<]*)\1/giu;
const catalogPathLiteral =
	/(["'`])(\/(?:donetsk|kvartiry|doma|uchastki|kommercheskaya|komnaty|garazhi|novostroyki|arenda|obekty|nedvizhimost)(?:\/[^"'`\s<]*)?)\1/giu;
const violations = [];

for (const file of filesUnder(root, "src", new Set([".ts", ".tsx"]))) {
	const relative = path.relative(root, file).replaceAll("\\", "/");
	if (excluded.some((prefix) => relative.startsWith(prefix))) continue;
	const content = readFileSync(file, "utf8");
	for (const match of content.matchAll(urlFieldLiteral)) {
		const literal = match[2];
		if (literal.startsWith("/:")) continue;
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
