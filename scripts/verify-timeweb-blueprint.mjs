import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const blueprintRoot = path.join(root, "deploy/clients/timeweb");
const requiredFiles = [
	"README.md",
	"env.client.example",
	"payload/s3-plugin.example.ts",
	"payload/activation.patch.md",
	"compose/client.compose.yml.example",
	"nginx/site.conf.example",
	"backup/README.md",
	"monitoring/README.md",
	"proofs/CLIENT_TIMEWEB_PROOF.md",
	"production/README.md",
	"production/compose.production.yml.example",
	"production/nginx.production-public.conf.example",
];

const files = new Map(requiredFiles.map((file) => [
	file,
	fs.readFileSync(path.join(blueprintRoot, file), "utf8"),
]));
const allText = [...files.values()].join("\n");
const compose = files.get("production/compose.production.yml.example");
const nginx = files.get("production/nginx.production-public.conf.example");

assert.ok(!allText.includes("start-baza.ams24.ru"), "starter demo domain is forbidden");
assert.ok(!/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/.test(allText), "credential-shaped value is forbidden");
assert.ok(compose.includes('image: "${IMAGE:?'), "immutable production image is required");
assert.ok(!/^\s*build\s*:/m.test(compose), "server-side build is forbidden");
assert.equal((compose.match(/JOBS_AUTORUN:\s*["']?true/g) ?? []).length, 1);
assert.ok(!nginx.includes("X-Robots-Tag"), "global production noindex is forbidden");
assert.ok(!nginx.includes("Disallow: /"), "deny-all production robots is forbidden");
for (const marker of [
	"doncity-home.ru",
	"Strict-Transport-Security",
	"X-Content-Type-Options",
	"Referrer-Policy",
	"X-Frame-Options",
	"__ADMIN_ACCESS_POLICY__",
]) {
	assert.ok(nginx.includes(marker), `production nginx missing ${marker}`);
}
for (const marker of [
	"one production application runtime",
	"one private S3 bucket",
	"persistent staging/shadow/mirror database is forbidden",
	"Secret Master",
	"immutable",
]) {
	assert.ok(allText.includes(marker), `blueprint missing ${marker}`);
}
for (const file of [
	"staging/compose.staging.yml.example",
	"staging/env.staging.example",
	"staging/nginx.staging.conf.example",
]) {
	assert.ok(!fs.existsSync(path.join(blueprintRoot, file)), `tracked staging asset is forbidden: ${file}`);
}

console.log("verify:timeweb-blueprint: PASS (single public production contour)");
