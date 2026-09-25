# SourceCraft policy guard preflight

Status: PASS — isolated CI-policy repair
Date: 2026-09-24
Task: `dcn-4ic0`

## Task contract

- **Goal:** align the local SourceCraft-policy guard and the tracked workflow
  with the approved zero-CI-on-push/PR, manual exact-head gate contract.
- **In scope:** `.sourcecraft/ci.yaml`, its local PowerShell contract fixture,
  and the JavaScript policy guard.
- **Non-goals:** adding test-database wiring, changing application tests,
  changing SourceCraft credentials, deploying, or changing server/DNS state.
- **Risk:** RISKY because this is merge-gate tooling. The existing
  `verify-sourcecraft-gate.sh` remains the exact-head enforcement point.

## Verified drift

The workflow already used `verify-sourcecraft-gate.sh` and had successful
manual gate runs, but it retained a no-op `push` stanza. The JavaScript guard
instead required non-existent scripts and `DATABASE_URI_TEST`, so it could not
prove the actual configuration. The repair must reject every automatic trigger
and verify the tracked shell attestation contract directly.
