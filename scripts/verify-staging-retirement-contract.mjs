import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(path) {
	return readFileSync(path, "utf8");
}

function requireFragments(path, fragments) {
	const content = read(path);
	for (const fragment of fragments) {
		assert.ok(content.includes(fragment), `${path} missing: ${fragment}`);
	}
	return content;
}

const readiness = requireFragments("src/project/client-readiness.config.ts", [
	"jobsActiveRuntimeCount: 1",
	"nginx: true",
	"automaticBackup: true",
	"externalMonitoring: false",
]);
assert.doesNotMatch(readiness, /jobsActiveRuntimeCount:\s*null/);

const operations = requireFragments("docs/OPERATIONS.md", [
	"Exactly one application runtime and jobs owner remain",
	"former persistent staging runtime",
	"Authenticated health reports current DB/media backup freshness",
	"no separate post-production monitoring task",
]);
assert.doesNotMatch(operations, /health reports `backup_(?:db|media)_failure`/);

requireFragments("docs/03_ARCHITECTURE.md", [
	"Owner-authorized retirement on 2026-09-28",
	"Exactly one persistent production database exists",
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
	"production_release_authorized: false",
]);

const serverOperator = requireFragments(
	"scripts/ops/Invoke-DonCityServerInventory.ps1",
	[
		"staging_dir='/srv/doncity/staging'",
		"production_dir=$($docker_cmd inspect",
		"readlink -f",
		"production_health=$($docker_cmd inspect",
		"production_health=%s",
	],
);
assert.doesNotMatch(serverOperator, /rm\s+-rf/);

requireFragments("scripts/ops/Invoke-DonCityStagingCloudRetirement.ps1", [
	"expected exactly one managed database cluster",
	"database identities are not distinct",
	"bucket identities are not distinct",
	"staging bucket is not empty",
	"Unexpected additional logical database remains",
	"Unexpected additional storage bucket remains",
]);
requireFragments("scripts/ops/Invoke-DonCityStagingSecretRetirement.ps1", [
	"'/v3/secrets/batch/raw'",
	"staging folder identity is ambiguous",
	"production folder identity is ambiguous",
	"Production Secret Master proof failed",
]);

console.log("verify-staging-retirement-contract: ok");
