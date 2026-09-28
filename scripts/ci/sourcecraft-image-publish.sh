#!/usr/bin/env sh
set -eu
umask 077

if ! printf '%s' "${EXPECTED_COMMIT_SHA:-}" | grep -Eq '^[0-9a-f]{40}$'; then
	echo "REGISTRY_PUBLISH_ERROR EXPECTED_COMMIT_SHA must be a full lowercase SHA" >&2
	exit 1
fi

actual_sha="$(git rev-parse HEAD)"
if [ "$actual_sha" != "$EXPECTED_COMMIT_SHA" ]; then
	echo "REGISTRY_PUBLISH_ERROR exact SHA mismatch" >&2
	exit 1
fi

expected_repository="pkg.sourcecraft.tech/cr/integrator-p/cn1h8kfcah4l5sn4enbm/don-city-next"
if [ "${IMAGE_REPOSITORY:-}" != "$expected_repository" ]; then
	echo "REGISTRY_PUBLISH_ERROR image repository is outside the approved path" >&2
	exit 1
fi

if [ -z "${SOURCECRAFT_TOKEN:-}" ]; then
	echo "REGISTRY_PUBLISH_ERROR SOURCECRAFT_TOKEN is unavailable" >&2
	exit 1
fi

command -v docker >/dev/null 2>&1 || {
	echo "REGISTRY_PUBLISH_ERROR docker command is unavailable" >&2
	exit 1
}

printf '%s' "$SOURCECRAFT_TOKEN" | docker login \
	--username iam --password-stdin pkg.sourcecraft.tech >/dev/null
trap 'docker logout pkg.sourcecraft.tech >/dev/null 2>&1 || true' EXIT

runtime_ref="$IMAGE_REPOSITORY:$EXPECTED_COMMIT_SHA"
migration_ref="$IMAGE_REPOSITORY:migration-$EXPECTED_COMMIT_SHA"
revision_label="org.opencontainers.image.revision=$EXPECTED_COMMIT_SHA"
source_label="org.opencontainers.image.source=https://sourcecraft.dev/integrator-p/don-city-next"

docker build --target runtime --label "$revision_label" --label "$source_label" --tag "$runtime_ref" .
docker build --target migration --label "$revision_label" --label "$source_label" --tag "$migration_ref" .
docker push "$runtime_ref"
docker push "$migration_ref"

echo "REGISTRY_PUBLISH_OK sha=$EXPECTED_COMMIT_SHA runtime=$runtime_ref migration=$migration_ref production=false"
