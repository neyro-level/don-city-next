#!/usr/bin/env sh
set -eu
umask 077

if ! printf '%s' "${EXPECTED_COMMIT_SHA:-}" | grep -Eq '^[0-9a-f]{40}$'; then
	echo "REGISTRY_AUTH_ERROR EXPECTED_COMMIT_SHA must be a full lowercase SHA" >&2
	exit 1
fi

actual_sha="$(git rev-parse HEAD)"
if [ "$actual_sha" != "$EXPECTED_COMMIT_SHA" ]; then
	echo "REGISTRY_AUTH_ERROR exact SHA mismatch" >&2
	exit 1
fi

expected_repository="pkg.sourcecraft.tech/cr/integrator-p/cn1h8kfcah4l5sn4enbm/don-city-next"
if [ "${IMAGE_REPOSITORY:-}" != "$expected_repository" ]; then
	echo "REGISTRY_AUTH_ERROR image repository is outside the approved path" >&2
	exit 1
fi

if [ -z "${SOURCECRAFT_TOKEN:-}" ]; then
	echo "REGISTRY_AUTH_ERROR SOURCECRAFT_TOKEN is unavailable" >&2
	exit 1
fi

command -v docker >/dev/null 2>&1 || {
	echo "REGISTRY_AUTH_ERROR docker command is unavailable" >&2
	exit 1
}

printf '%s' "$SOURCECRAFT_TOKEN" | docker login \
	--username iam --password-stdin pkg.sourcecraft.tech >/dev/null
trap 'docker logout pkg.sourcecraft.tech >/dev/null 2>&1 || true' EXIT

echo "REGISTRY_AUTH_OK sha=$EXPECTED_COMMIT_SHA repository=$IMAGE_REPOSITORY push=false production=false"
