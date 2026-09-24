import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { findPlatformBoundaryViolations } from "./platform-boundary-rules.mjs";

const root = process.cwd();
const platformRoot = path.join(root, "src", "platform");
const extensions = /\.(?:js|mjs|cjs|ts|tsx)$/u;

function filesUnder(directory) {
	if (!existsSync(directory)) return [];
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const absolute = path.join(directory, entry.name);
		if (entry.isDirectory()) return filesUnder(absolute);
		if (!extensions.test(entry.name)) return [];
		return [
			{
				name: path.relative(root, absolute).replaceAll("\\", "/"),
				content: readFileSync(absolute, "utf8"),
			},
		];
	});
}

const violations = findPlatformBoundaryViolations(filesUnder(platformRoot));
if (violations.length) {
	console.error(violations.join("\n"));
	process.exitCode = 1;
} else {
	console.log("platform boundary guard: PASS");
}
