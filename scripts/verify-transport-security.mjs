import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const hstsValue = "max-age=31536000; includeSubDomains";
const hstsDirective = `add_header Strict-Transport-Security "${hstsValue}" always;`;

function read(path) {
	return readFileSync(path, "utf8");
}

function count(haystack, needle) {
	return haystack.split(needle).length - 1;
}

function extractServerBlocks(nginx) {
	const blocks = [];
	const serverStart = /\bserver\s*\{/g;
	for (const match of nginx.matchAll(serverStart)) {
		const openingBrace = match.index + match[0].lastIndexOf("{");
		let depth = 0;
		for (let index = openingBrace; index < nginx.length; index += 1) {
			if (nginx[index] === "{") depth += 1;
			if (nginx[index] === "}") depth -= 1;
			if (depth === 0) {
				blocks.push(nginx.slice(openingBrace + 1, index));
				break;
			}
		}
	}
	return blocks;
}

function probeNextConfig(nodeEnv) {
	const probe = `
		const module = await import("./next.config.ts?transport-security-" + process.env.NODE_ENV);
		const groups = await module.default.headers();
		const publicHeaders = groups.find((group) => group.source.includes("?!admin")).headers;
		const adminHeaders = groups.find((group) => group.source === "/admin").headers;
		const publicCsp = publicHeaders.find((header) => header.key === "Content-Security-Policy").value;
		const adminCsp = adminHeaders.find((header) => header.key === "Content-Security-Policy").value;
		console.log(JSON.stringify({
			applicationHsts: groups.flatMap((group) => group.headers).filter((header) => header.key === "Strict-Transport-Security").length,
			publicUnsafeEval: publicCsp.includes("'unsafe-eval'"),
			adminUnsafeEval: adminCsp.includes("'unsafe-eval'"),
		}));
	`;
	const result = spawnSync(
		process.execPath,
		["--experimental-strip-types", "--input-type=module", "-e", probe],
		{
			cwd: process.cwd(),
			encoding: "utf8",
			env: { ...process.env, NODE_ENV: nodeEnv },
		},
	);
	assert.equal(
		result.status,
		0,
		`next.config.ts ${nodeEnv} probe failed: ${result.stderr}`,
	);
	return JSON.parse(result.stdout.trim().split(/\r?\n/).at(-1));
}

const nextConfig = read("next.config.ts");
assert.equal(
	nextConfig.includes("Strict-Transport-Security"),
	false,
	"Next.js must not emit HSTS; Nginx is the sole transport-security owner",
);
assert.equal(
	count(nextConfig, '"script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'"'),
	1,
	"only the explicit Payload Admin compatibility policy may always allow unsafe-eval",
);

const developmentConfig = probeNextConfig("development");
const productionConfig = probeNextConfig("production");
assert.equal(developmentConfig.applicationHsts, 0);
assert.equal(productionConfig.applicationHsts, 0);
assert.equal(
	developmentConfig.publicUnsafeEval,
	true,
	"React development diagnostics require the development-only unsafe-eval exception",
);
assert.equal(
	productionConfig.publicUnsafeEval,
	false,
	"public production CSP must not allow unsafe-eval",
);
assert.equal(
	productionConfig.adminUnsafeEval,
	true,
	"Payload Admin compatibility exception must remain isolated from public CSP",
);

const nginxContracts = [
	"deploy/clients/timeweb/nginx/site.conf.example",
	"deploy/clients/timeweb/production/nginx.production-noindex.conf.example",
	"deploy/clients/timeweb/staging/nginx.staging.conf.example",
];

for (const path of nginxContracts) {
	const serverBlocks = extractServerBlocks(read(path));
	assert.ok(serverBlocks.length > 0, `${path}: expected at least one server block`);
	for (const [index, serverBlock] of serverBlocks.entries()) {
		assert.equal(
			count(serverBlock, hstsDirective),
			1,
			`${path}: server block ${index + 1} must declare the canonical HSTS value exactly once`,
		);
		assert.equal(
			/Strict-Transport-Security[^\n]*preload/i.test(serverBlock),
			false,
			`${path}: server block ${index + 1} must not declare preload before the approved full-zone TLS inventory`,
		);
	}
}

console.log("verify-transport-security: ok");
