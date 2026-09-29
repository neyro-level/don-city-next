import { readFileSync } from "node:fs";

const config = readFileSync(".sourcecraft/ci.yaml", "utf8");
const gateScript = readFileSync("scripts/verify-sourcecraft-gate.sh", "utf8");
const authProbe = readFileSync(
	"scripts/ci/sourcecraft-registry-auth-probe.sh",
	"utf8",
);
const imagePublisher = readFileSync(
	"scripts/ci/sourcecraft-image-publish.sh",
	"utf8",
);
const uptimeMonitor = readFileSync(
	"scripts/ci/sourcecraft-uptime-monitor.sh",
	"utf8",
);
const required = [
	"on:",
	"schedule:",
	"production-uptime-monitor:",
	"interval: 15m",
	"sh scripts/ci/sourcecraft-uptime-monitor.sh",
	"registry-auth-probe:",
	"merge-standard:",
	"merge-risky:",
	"release-main:",
	"expected_commit_sha",
	["EXPECTED_COMMIT_SHA: $", "{{ inputs.expected_commit_sha }}"].join(""),
	"sh scripts/verify-sourcecraft-gate.sh",
	"sh scripts/verify-sourcecraft-release.sh",
	"corepack enable",
	"pnpm verify:final-release-contract",
	"pkg.sourcecraft.tech/cr/integrator-p/cn1h8kfcah4l5sn4enbm/don-city-next",
	"sh scripts/ci/sourcecraft-image-publish.sh",
	"sh scripts/ci/sourcecraft-registry-auth-probe.sh",
];
const forbidden = [
	/^ {2}push\s*:/m,
	/^ {2}pull_request\s*:/m,
	/service_connection:/m,
	/cr\.yandex\//m,
];
const missing = required.filter((value) => !config.includes(value));
const automatic = forbidden.filter((pattern) => pattern.test(config));
const gateRequired = [
	"EXPECTED_COMMIT_SHA",
	"SOURCECRAFT_COMMIT_SHA",
	"Commit SHA must be exactly 40 characters",
	"SourceCraft run commit does not match expected PR head",
];
const missingGateProof = gateRequired.filter(
	(value) => !gateScript.includes(value),
);
const registryRequired = [
	"SOURCECRAFT_TOKEN",
	"docker login",
	"pkg.sourcecraft.tech",
];
const missingRegistryProof = registryRequired.filter(
	(value) => !authProbe.includes(value) || !imagePublisher.includes(value),
);
const publishRequired = [
	"--target runtime",
	"--target migration",
	'docker push "$runtime_ref"',
	'docker push "$migration_ref"',
];
const missingPublishProof = publishRequired.filter(
	(value) => !imagePublisher.includes(value),
);
const monitorRequired = [
	"https://doncity-home.ru/",
	"SOURCECRAFT_TOKEN",
	"api.sourcecraft.tech/repos/integrator-p/don-city-next/issues",
	"--connect-timeout 10",
	"--max-time 20",
	"--retry 2",
	'"visibility":"private"',
];
const missingMonitorProof = monitorRequired.filter(
	(value) => !uptimeMonitor.includes(value),
);

if (
	missing.length ||
	automatic.length ||
	missingGateProof.length ||
	missingRegistryProof.length ||
	missingPublishProof.length ||
	missingMonitorProof.length
) {
	console.error(
		`SourceCraft policy FAIL; missing=${missing.join(",") || "none"}; forbidden=${automatic.length}; gate=${missingGateProof.join(",") || "none"}; registry=${missingRegistryProof.join(",") || "none"}; publish=${missingPublishProof.join(",") || "none"}; monitor=${missingMonitorProof.join(",") || "none"}`,
	);
	process.exit(1);
}
console.log("SourceCraft policy: PASS (manual delivery workflows plus operational uptime schedule)");
