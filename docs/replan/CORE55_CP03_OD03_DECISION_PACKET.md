# CP-03 / OD-03 decision packet — narrow atomic SQL boundary

Status: `APPROVED_NARROW_EXCEPTION`

Owner decision recorded: `APPROVE_NARROW_EXCEPTION` on 2026-09-27.
Implementation is governed by `docs/adr/ADR-0011-narrow-atomic-sql-recovery.md`.

## Decision requested

Approve or reject a narrow, ADR-backed PostgreSQL exception for state changes
that require one conditional statement and an affected-row result. Approval is
not a blanket permission for raw SQL and does not permit production data work.

Recommended decision: `APPROVE_NARROW_EXCEPTION`.

## Current inventory

The implementation exposes no generic `query(string)` function. Every statement
is parameterized, named and kept under a private executor.

| Layer | Operation | Required invariant |
|---|---|---|
| ingest | `claimDueFeedSources` | Concurrent dispatchers cannot claim the same due source. |
| ingest | `claimQueuedImportRun` | Only one queued→running transition wins. |
| ingest | `touchImportRunHeartbeat` | Only a running import receives a heartbeat. |
| ingest | `touchFeedPropertiesLastSeenAt` | A bounded update touches only the selected source/external IDs. |
| ingest | `countMissingActiveFeedProperties` | Safety count uses the same predicate as deactivation. |
| ingest | `deactivateMissingFeedProperties` | Guarded bulk archive uses the exact safety predicate. |
| ingest | `consumeDeactivationApproval` | A valid unconsumed approval is consumed once. |
| ingest | `finishImportRun` | Only a running worker makes one terminal transition. |
| system | `claimLeadDeliveryRow` | Only one due pending→sending claim wins and increments attempts once. |

Payload Local API bulk update in installed Payload `3.90.1` does not provide a
demonstrated single-statement conditional claim with an affected-row result.
Replacing these operations with read→update would weaken the concurrency
contract.

## Two CP-03 additions

Approval also covers exactly two new named operations:

1. `interruptRecoverableImportRun`: update one run only while its current
   `status` and stale/orphan timestamp predicate still match. The job liveness
   inspection remains outside SQL; the conditional transition arbitrates the
   race with the worker claim.
2. `claimPendingDeliveryRecoveryLease`: move one sufficiently old pending
   delivery's `next_attempt_at` to a short recovery lease and clear its dead job
   reference only while the original pending/threshold predicate still matches.
   Only the lease winner may enqueue and attach a replacement job.

Both operations return only the affected ID. They accept scalar IDs/timestamps,
use parameterized templates and remain behind the existing System Gateway.

## Required safeguards

- Add the operations to the explicit allowlist with invariant and reason.
- Do not export the private executor or SQL template tag.
- Add two-worker concurrency tests against an isolated local `_test` database.
- Prove loser calls return no row and do not duplicate state changes/jobs.
- Run the exact-head `RISKY` gate before merge.
- Any additional SQL operation requires a new decision or an update to this ADR.

## Rejected alternative

`REWRITE_TO_LOCAL_API` is rejected by the technical recommendation until a
supported Payload API proves the same atomic predicate + mutation + affected
result. A transaction around read→update alone does not prove this under the
default isolation level.

## Owner response

Decision: `APPROVE_NARROW_EXCEPTION`.

The authorization is exhausted by the two named operations, ADR-0011 and their
isolated two-worker proofs. It does not approve any additional SQL operation or
production data action.
