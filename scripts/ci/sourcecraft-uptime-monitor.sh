#!/bin/sh
set -eu

monitor_url="${MONITOR_URL:-https://doncity-home.ru/}"
force_alert="${MONITOR_FORCE_ALERT:-false}"
api_url="https://api.sourcecraft.tech/repos/integrator-p/don-city-next/issues"
response_file="$(mktemp)"
trap 'rm -f "$response_file"' EXIT HUP INT TERM

status="$(curl --silent --show-error --location --output /dev/null \
	--write-out '%{http_code}' --connect-timeout 10 --max-time 20 \
	--retry 2 --retry-delay 2 --retry-all-errors "$monitor_url" || true)"

probe_failed=false
if [ "$status" != "200" ]; then
	probe_failed=true
fi

if [ "$probe_failed" = false ] && [ "$force_alert" != "true" ]; then
	echo "UPTIME_MONITOR_PASS status=200 origin=sourcecraft interval=15m"
	exit 0
fi

if [ -z "${SOURCECRAFT_TOKEN:-}" ]; then
	echo "UPTIME_MONITOR_ERROR SourceCraft API token is unavailable" >&2
	exit 1
fi

timestamp="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
if [ "$force_alert" = "true" ]; then
	title="[TEST][DON CITY UPTIME] independent alert path proof"
	description="Synthetic test alert from SourceCraft CI at ${timestamp}. Public probe status: ${status}. No application secret was used."
else
	title="[DON CITY UPTIME] public site unavailable"
	description="SourceCraft external probe failed at ${timestamp}. URL: ${monitor_url}. HTTP status: ${status}. Threshold: one failed scheduled run."
fi

body="$(printf '{"title":"%s","description":"%s","priority":"critical","visibility":"private"}' "$title" "$description")"
create_status="$(curl --silent --show-error --output "$response_file" \
	--write-out '%{http_code}' --request POST \
	--header "Authorization: Bearer $SOURCECRAFT_TOKEN" \
	--header 'Content-Type: application/json' \
	--data "$body" "$api_url")"

if [ "$create_status" != "201" ]; then
	echo "UPTIME_MONITOR_ERROR alert destination rejected request status=$create_status" >&2
	exit 1
fi

echo "UPTIME_MONITOR_ALERT_SENT destination=sourcecraft-issue test=$force_alert probe_status=$status"
if [ "$force_alert" = "true" ]; then
	exit 0
fi
exit 1
