import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const requireFragments = (path, fragments) => {
	const content = read(path);
	for (const fragment of fragments) {
		assert.ok(content.includes(fragment), `${path} missing: ${fragment}`);
	}
	return content;
};

const readiness = requireFragments("src/project/client-readiness.config.ts", [
	"jobsActiveRuntimeCount: 1",
	"nginx: true",
	"automaticBackup: true",
	"externalMonitoring: false",
]);
assert.doesNotMatch(readiness, /jobsActiveRuntimeCount:\s*null/);

requireFragments("docs/OPERATIONS.md", [
	"Exactly one application runtime and jobs owner remain",
	"Authenticated health reports current DB/media backup freshness",
	"no separate post-production monitoring task",
]);
requireFragments("docs/03_ARCHITECTURE.md", [
	"Exactly one persistent production database exists",
	"Persistent staging/shadow/mirror database запрещена",
	"`externalMonitoring` remains fail-closed",
]);
requireFragments("docs/PROJECT.md", [
	"no persistent staging/shadow/mirror DB exists",
	"`nginx=true` and `automaticBackup=true`",
	"`externalMonitoring` remains fail-closed `false`",
]);
requireFragments("docs/DELIVERY_STATE.yaml", [
	"persistent_runtime_count: 1",
	"persistent_logical_database_count: 1",
	"persistent_bucket_count: 1",
	"staging_runtime: absent",
	"staging_database: absent",
	"staging_bucket: absent",
	"staging_secret_folder: absent",
]);

for (const file of [
	"deploy/clients/timeweb/staging/compose.staging.yml.example",
	"deploy/clients/timeweb/staging/env.staging.example",
	"deploy/clients/timeweb/staging/nginx.staging.conf.example",
	"deploy/clients/timeweb/proofs/STAGING_PROOF.md",
	"scripts/ops/Invoke-DonCityStagingCloudRetirement.ps1",
	"scripts/ops/Invoke-DonCityStagingSecretRetirement.ps1",
]) {
	assert.equal(existsSync(file), false, `obsolete staging asset must be absent: ${file}`);
}

const serverOperator = requireFragments("scripts/ops/Invoke-DonCityServerInventory.ps1", [
	"staging_container_count=%s",
	"staging_runtime_directory=absent",
	"production_health=%s",
	"-replace \"`r`n\", \"`n\"",
	"CleanupFailedTransport",
	"failed_transport=absent",
	"CleanupFailedRelease",
	"cleanup_refused=release-is-running",
]);
assert.doesNotMatch(serverOperator, /RetireRuntime/);
assert.doesNotMatch(serverOperator, /rm\s+-rf/);

console.log("verify-single-production-contract: ok");
