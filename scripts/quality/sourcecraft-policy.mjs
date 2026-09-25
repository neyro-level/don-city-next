import { readFileSync } from "node:fs";

const config = readFileSync(".sourcecraft/ci.yaml", "utf8");
const gateScript = readFileSync("scripts/verify-sourcecraft-gate.sh", "utf8");
const required = [
	"merge-standard:",
	"merge-risky:",
	"expected_commit_sha",
	"EXPECTED_COMMIT_SHA: ${{ inputs.expected_commit_sha }}",
	"sh scripts/verify-sourcecraft-gate.sh",
];
const forbidden = [
	/^\s*on\s*:/m,
	/^\s*push\s*:/m,
	/^\s*pull_request\s*:/m,
	/^\s*schedule\s*:/m,
];
const missing = required.filter((value) => !config.includes(value));
const automatic = forbidden.filter((pattern) => pattern.test(config));
const gateRequired = [
	"EXPECTED_COMMIT_SHA",
	"SOURCECRAFT_COMMIT_SHA",
	"Commit SHA must be exactly 40 characters",
	"SourceCraft run commit does not match expected PR head",
];
const missingGateProof = gateRequired.filter((value) => !gateScript.includes(value));

if (missing.length || automatic.length || missingGateProof.length) {
	console.error(
		`SourceCraft policy FAIL; missing=${missing.join(",") || "none"}; automatic=${automatic.length}; gate=${missingGateProof.join(",") || "none"}`,
	);
	process.exit(1);
}
console.log("SourceCraft policy: PASS (manual exact-head only)");
