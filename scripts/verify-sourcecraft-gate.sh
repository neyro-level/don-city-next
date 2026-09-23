#!/bin/sh
set -eu

expected="${EXPECTED_COMMIT_SHA:?EXPECTED_COMMIT_SHA is required}"
actual="${SOURCECRAFT_COMMIT_SHA:?SOURCECRAFT_COMMIT_SHA is required}"

case "$expected" in
  *[!0-9a-f]*|'')
    echo 'EXPECTED_COMMIT_SHA must be a lowercase full Git SHA' >&2
    exit 1
    ;;
esac

case "$actual" in
  *[!0-9a-f]*|'')
    echo 'SOURCECRAFT_COMMIT_SHA must be a lowercase full Git SHA' >&2
    exit 1
    ;;
esac

if [ "${#expected}" -ne 40 ] || [ "${#actual}" -ne 40 ]; then
  echo 'Commit SHA must be exactly 40 characters' >&2
  exit 1
fi

if [ "$expected" != "$actual" ]; then
  echo 'SourceCraft run commit does not match expected PR head' >&2
  exit 1
fi

printf '%s\n' 'Exact SourceCraft commit attestation passed.'
