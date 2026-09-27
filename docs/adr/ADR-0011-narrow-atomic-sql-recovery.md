# ADR-0011: Narrow atomic SQL recovery boundary

Status: Accepted
Date: 2026-09-27
Decision: `APPROVE_NARROW_EXCEPTION`

## Context

Payload 3.90.1 does not provide a demonstrated application primitive that
combines the required conditional predicate, state mutation and affected-row
result for two CP-03 races. A read followed by a Local API update would allow
two workers to act on the same stale state.

## Decision

The existing private parameterized SQL layers may expose exactly two additional
named operations:

1. `interruptRecoverableImportRun` conditionally moves one stale `running` or
   orphaned `queued` import run to `interrupted` while the original status and
   timestamp predicate still match.
2. `claimPendingDeliveryRecoveryLease` conditionally moves one sufficiently old
   `pending` delivery to a short retry lease and clears its dead job reference.
   Only the lease winner may enqueue and attach a replacement job.

Both operations return only the affected ID. Inputs are scalar IDs, statuses,
timestamps and an internal redacted reason. SQL templates and executors remain
private; no generic query function is exported.

## Safeguards

- The operations remain in the explicit ingest/system allowlists.
- User input, user CRUD, PII and external calls are forbidden in this boundary.
- Two-worker tests run only against an isolated local `_test` PostgreSQL 18
  database and prove one winner and no duplicate replacement job.
- Any third operation or broader SQL surface requires a new owner decision.
- Merge requires one exact-head `RISKY` gate. Production data work is not
  authorized by this ADR.

## Rejected alternative

A read→Local API update, even inside a default-isolation transaction, does not
prove the same atomic predicate + mutation + affected-result semantics.
