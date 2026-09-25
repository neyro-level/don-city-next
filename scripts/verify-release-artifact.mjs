import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");

const dockerfile = read("Dockerfile");
const compose = read("deploy/clients/timeweb/staging/compose.staging.yml.example");
const nginx = read("deploy/clients/timeweb/staging/nginx.staging.conf.example");
const operations = read("docs/OPERATIONS.md");
const releaseManifest = read("scripts/release-manifest.mjs");
const pnpmWorkspace = read("pnpm-workspace.yaml");

for (const expected of [
	"node:24.20.0-bookworm-slim",
	"pnpm install --frozen-lockfile",
	"pnpm exec next build --webpack",
	'"pnpm", "start"',
]) {
	assert.ok(dockerfile.includes(expected), `Dockerfile must include ${expected}.`);
}

assert.ok(!dockerfile.includes("DATABASE_URI="), "Dockerfile must not embed database credentials.");
assert.ok(!compose.includes("DATABASE_URI="), "Compose template must not embed database credentials.");
assert.ok(compose.includes('${IMAGE:?'), "Compose template must require an immutable image tag.");
assert.ok(
	compose.includes("STAGING_ENV_FILE"),
	"Compose template must load a separate staging env file.",
);
assert.ok(compose.includes('JOBS_AUTORUN: "false"'), "Staging must not own Payload jobs.");
assert.ok(!/^\s*build\s*:/m.test(compose), "Staging must consume an image built outside the server.");
assert.ok(nginx.includes("__STAGING_DOMAIN__"), "Nginx template must require an explicit staging domain.");
assert.ok(nginx.includes("noindex, nofollow"), "Nginx template must preserve staging noindex policy.");
assert.ok(operations.includes("immutable image"), "Operations must preserve immutable image rule.");
assert.ok(releaseManifest.includes(".release"), "Release manifest must write local uncommitted evidence.");
assert.ok(pnpmWorkspace.includes("confirmModulesPurge: false"), "Workspace must support non-interactive Docker builds.");
assert.ok(
	releaseManifest.includes("next-start-full-image"),
	"Release manifest must record the full-image Next.js runtime shape.",
);
for (const expected of [
	'profile: "REALTY_CATALOG"',
	'deliveryProfile: "CRITICAL"',
	'imageName: "don-city-next"',
	'process.env.RELEASE_MODE ?? "REHEARSAL"',
]) {
	assert.ok(releaseManifest.includes(expected), `Release manifest must include ${expected}.`);
}

console.log("release artifact contract ok");
