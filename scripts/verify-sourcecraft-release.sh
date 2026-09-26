#!/bin/sh
set -eu

sh scripts/verify-sourcecraft-gate.sh

checkout="$(git rev-parse HEAD)"
git fetch --quiet origin main
origin_main="$(git rev-parse origin/main)"

if [ "$checkout" != "$origin_main" ]; then
  echo 'Release workflow requires the exact current origin/main commit' >&2
  exit 1
fi

node scripts/verify-release-artifact.mjs
node --conditions=react-server ./node_modules/payload/bin.js run scripts/import-doncity-listings.ts -- --verify-catalog

printf '%s\n' "Exact-main noindex release attestation passed: $checkout"
