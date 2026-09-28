import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");

const dockerfile = read("Dockerfile");
const compose = read("deploy/clients/timeweb/production/compose.production.yml.example");
const nginx = read("deploy/clients/timeweb/production/nginx.production-public.conf.example");
const operations = read("docs/OPERATIONS.md");
const releaseManifest = read("scripts/release-manifest.mjs");
const pnpmWorkspace = read("pnpm-workspace.yaml");

for (const expected of [
	"node:24.20.0-bookworm-slim",
	"pnpm install --frozen-lockfile",
	"./node_modules/.bin/next build --webpack",
	'"./node_modules/.bin/next", "start"',
]) {
	assert.ok(dockerfile.includes(expected), `Dockerfile must include ${expected}.`);
}
assert.ok(
	dockerfile.includes("id=don-city-pnpm-store"),
	"Dockerfile must preserve the retry-safe pnpm BuildKit cache.",
);
assert.ok(!dockerfile.includes("DATABASE_URI="), "Dockerfile must not embed database credentials.");
assert.ok(!compose.includes("DATABASE_URI="), "Compose template must not embed database credentials.");
assert.ok(compose.includes('${IMAGE:?'), "Compose must require an immutable image tag.");
assert.ok(compose.includes("PRODUCTION_ENV_FILE"), "Compose must use the approved production env file.");
assert.ok(compose.includes('JOBS_AUTORUN: "true"'), "Production must remain the only jobs owner.");
assert.ok(!/^\s*build\s*:/m.test(compose), "Production must consume an image built outside the server.");
assert.ok(!nginx.includes("X-Robots-Tag"), "Public production Nginx must not add a global noindex header.");
assert.ok(!nginx.includes("Disallow: /"), "Public production Nginx must not deny all crawlers.");
assert.ok(nginx.includes("doncity-home.ru"), "Production Nginx must own the canonical public host.");
assert.ok(operations.includes("immutable image"), "Operations must preserve immutable image rule.");
assert.ok(releaseManifest.includes(".release"), "Release manifest must write local uncommitted evidence.");
assert.ok(pnpmWorkspace.includes("confirmModulesPurge: false"), "Workspace must support non-interactive Docker builds.");
for (const expected of [
	'profile: "REALTY_CATALOG"',
	'deliveryProfile: "CRITICAL"',
	'imageName: "don-city-next"',
	'indexing: "public"',
	'"RELEASE manifest requires the canonical main branch"',
	'"RELEASE manifest requires exact origin/main"',
]) {
	assert.ok(releaseManifest.includes(expected), `Release manifest must include ${expected}.`);
}

console.log("release artifact contract ok");
