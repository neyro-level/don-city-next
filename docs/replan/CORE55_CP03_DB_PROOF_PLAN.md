# CP-03 isolated database proof plan

Status: `ATOMIC_RECOVERY_PROOF_PASS_GATE_PENDING`

## Confirmed local identity

- Engine: native Windows PostgreSQL `18` (`postgresql-x64-18`).
- Service state: running under `NT AUTHORITY\NetworkService`.
- Listener: loopback only, `127.0.0.1:5432` and `::1:5432`.
- Authentication: `scram-sha-256` for local/loopback client connections.
- Docker and WSL were not touched.
- Isolated database: `don_city_cp03_test`.
- Database owner: non-superuser project role `don_city_dev`.
- The explicit task URI was assembled in process from the local PostgreSQL
  credential source and was neither printed nor written to the repository.

This proves the server contour and project-local test identity. It does not
authorize access to production or any other database.

## Test identity verdict

- Dedicated non-superuser DON CITY role — PASS.
- Task-owned database ending in `_test` — PASS.
- Explicit loopback `DATABASE_URI_TEST`; no `DATABASE_URI` fallback — PASS.
- No other project role or mutable database reused — PASS.

`pnpm verify:integration:required` validates the URI, rejects non-loopback or
production-looking database names, recreates only the named test schema owned by
the test role, runs Payload migrations and executes the Payload integration
suites.

## Baseline proof

On `2026-09-27`, the required integration suite ran against
`don_city_cp03_test` and passed. The first run exposed two test fixtures that
still assumed pending delivery recovery could happen immediately at
`nextAttemptAt`. CP-03 now requires a minimum orphan age, so the fixtures were
aligned with `pendingDeliveryOrphanThresholdMs`; the production recovery policy
was not weakened.

Checkpoint: `58097bef322f6185f34a306201d8dab531fe2c01`.

Verified baseline surfaces include Payload migrations, access/auth boundaries,
feed/import integration, lead retention and delivery recovery. This is baseline
evidence only: the two OD-03 operations and their two-worker race proofs do not
exist yet and are not claimed as passing.

## CP-03 proof additions after OD-03

The DB suite must demonstrate:

1. Two concurrent import claims have exactly one winner.
2. Heartbeat committed outside the ingest transaction is visible to an
   independent PostgreSQL observer.
3. A concurrent worker claim and janitor transition have exactly one winner.
4. Two recovery workers produce one pending-delivery recovery lease and one
   replacement job attachment.
5. Retention rollback preserves both lead and linked deliveries; commit removes
   delete-mode rows or anonymizes all retained PII/diagnostics atomically.
6. Evidence contains IDs/counts/statuses only and no PII, token, password or full
   connection URI.

## OD-03 atomic proof

The owner selected `APPROVE_NARROW_EXCEPTION` on `2026-09-27`. ADR-0011 limits
the implementation to `interruptRecoverableImportRun` and
`claimPendingDeliveryRecoveryLease`.

`pnpm verify:integration:required` passed on the isolated loopback PostgreSQL 18
database after the implementation. The suite proved:

- an independent PostgreSQL observer sees the committed heartbeat while the
  ingest transaction remains open, and its later rollback does not roll back
  that heartbeat;
- stale import recovery permits a new queued import to claim and execute after
  the interrupted run;
- a concurrent queued import worker claim and janitor interruption have exactly
  one winner and leave one allowed terminal/running state;
- two delivery recovery workers produce exactly one lease winner;
- only that winner creates and attaches one replacement Payload job;
- the replacement job `waitUntil` equals the short lease stored in
  `nextAttemptAt`;
- the losing calls do not duplicate state transitions or jobs.

The remaining CP-03 delivery requirement is the exact-head `RISKY` SourceCraft
gate. No production database, real feed, secret mutation or destructive action
was performed.
