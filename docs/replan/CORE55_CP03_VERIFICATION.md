# CP-03 verification — jobs, import and lead safety

Status: `LOCAL_TEST_PASS_STAGING_HANDOFF_CP08`

Verified implementation head: `036cfa8debccc1617f6fae01a3bb1984720d5198`

## Surface and result

| Core 5.5 proof | Local/test evidence | Result |
|---|---|---|
| A — heartbeat visibility | A second PostgreSQL connection observes the heartbeat while an ingest transaction remains open; rolling back that transaction does not roll back the heartbeat. | PASS |
| D — stale import recovery | Stale `running` becomes `interrupted`; a replacement queued run can then claim `running`. Concurrent worker-claim versus queued-janitor transition produces exactly one winner. | PASS |
| E — retention execution | Required integration coverage verifies linked lead/delivery delete or anonymize behavior in one transaction, including rollback. | PASS |
| F — lead outbox crash window | A pending delivery left without a job is recovered only after the orphan threshold; two workers produce one lease and one attached replacement job. | PASS |
| G — retryable delivery | Retry state remains `pending`, records `nextAttemptAt`, queues the matching `waitUntil` job and avoids throwing the classified retryable error. | PASS |

## OD-03 boundary

- The owner decision is exactly `APPROVE_NARROW_EXCEPTION`.
- ADR-0011 permits only `interruptRecoverableImportRun` and
  `claimPendingDeliveryRecoveryLease`.
- Both operations are named, parameterized, private-executor allowlist entries
  and return only the affected ID.
- Loser calls do not duplicate transitions, leases or jobs.
- No schema or migration changed.

## Executed checks

- `pnpm verify:integration:required` — PASS on loopback PostgreSQL 18 database
  `don_city_cp03_test`, owned by non-superuser `don_city_dev`.
- `pnpm verify:cp03-safety` — PASS.
- `pnpm verify:lead-intake` — PASS.
- `pnpm verify:security-boundaries` — PASS.
- `pnpm quality:architecture` — PASS.
- `pnpm quality:docs-sot` — PASS.
- `pnpm typecheck` — PASS.
- `pnpm lint` — PASS with pre-existing warnings outside this diff.
- `pnpm build` — PASS.

`pnpm verify:operational-recovery` currently stops on the pre-existing
`OPERATIONS.md` phrase inventory (`Manual import`). That document convergence is
already owned by downstream CP-07; the atomic recovery behavior is covered by
the passing targeted and database proofs above.

## Handoff and limits

CP-03 verification used only the explicit isolated local `_test` database.
Integrated isolated-staging execution belongs to CP-08 after CP-03 and CP-07
land on one exact candidate; running it here would duplicate that gate and break
the approved dependency order. CP-08 must repeat proofs A/D/E/F/G on the merged
candidate before program closure.

Production, public indexing, real-feed activation, DNS, secrets and destructive
migrations were not touched.
