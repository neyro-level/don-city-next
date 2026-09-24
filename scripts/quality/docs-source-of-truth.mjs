import { readFileSync } from "node:fs";
import path from "node:path";
import { findDocsSourceOfTruthViolations } from "./docs-source-of-truth-rules.mjs";
import { filesUnder } from "./source-files.mjs";

const root = process.cwd();
const files = filesUnder(root, "docs", new Set([".md"])).map((file) => ({
	name: path.relative(root, file),
	content: readFileSync(file, "utf8"),
}));
const violations = findDocsSourceOfTruthViolations(files);

if (violations.length > 0) {
	console.error("Documentation Source of Truth guard failed:");
	for (const violation of violations) console.error(`- ${violation}`);
	process.exit(1);
}

console.log("Documentation Source of Truth guard: PASS");
