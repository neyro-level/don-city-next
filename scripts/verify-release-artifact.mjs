import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");

const dockerfile = read("Dockerfile");
const dockerignore = read(".dockerignore");
const compose = read("deploy/clients/timeweb/production/compose.production.yml.example");
const nginx = read("deploy/clients/timeweb/production/nginx.production-public.conf.example");
const operations = read("docs/OPERATIONS.md");
const releaseManifest = read("scripts/release-manifest.mjs");
const productionRelease = read("scripts/ops/Invoke-DonCityProductionRelease.ps1");
const pnpmWorkspace = read("pnpm-workspace.yaml");

for (const expected of [
	"node:24.20.0-bookworm-slim",
	"pnpm install --frozen-lockfile",
	"./node_modules/.bin/next build --webpack",
	"/app/.next/standalone",
	'CMD ["node", "server.js"]',
	'CMD ["node", "--conditions=react-server", "./node_modules/payload/bin.js", "migrate"]',
]) {
	assert.ok(dockerfile.includes(expected), `Dockerfile must include ${expected}.`);
}
assert.ok(
	!dockerfile.includes("COPY --from=build --chown=nextjs:nodejs /app ./"),
	"Runtime image must not copy the complete build workspace.",
);
for (const excluded of ["docs", "scripts", ".sourcecraft", ".devcontainer"]) {
	assert.ok(
		dockerignore.split(/\r?\n/).includes(excluded),
		`.dockerignore must exclude ${excluded} from the application build context.`,
	);
}
assert.ok(!productionRelease.includes("$home ="), "Release helper must not overwrite PowerShell's HOME variable.");
assert.ok(
	dockerfile.includes("id=don-city-pnpm-store"),
	"Dockerfile must preserve the retry-safe pnpm BuildKit cache.",
);
for (const expected of [
	"rollback=executed-after-smoke-failure",
	"$attempt -le 10",
	"@(502, 503, 504)",
	"bounded release retries",
	"systemctl start doncity-backup.service",
	"JOBS_AUTORUN=false",
	"pkg.sourcecraft.tech/cr/integrator-p/cn1h8kfcah4l5sn4enbm/don-city-next",
	"--password-stdin",
	'registry_docker pull "$new_image"',
	'new_digest=$($docker_cmd image inspect "$new_image"',
	"cleanup_registry_auth",
	"migrations=success",
]) {
	assert.ok(productionRelease.includes(expected), `Production release helper must include ${expected}.`);
}
assert.ok(
	!productionRelease.includes("docker build"),
	"Production host release must pull the SourceCraft-built image, not build it.",
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
