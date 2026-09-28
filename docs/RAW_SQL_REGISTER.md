# Raw SQL register

Status: Active
Updated: 2026-09-28
Decision: `RETAIN_NAMED_SQL_REGISTER`

Runtime source of truth is the typed manifests
`approvedIngestSqlOperations` and `approvedSystemSqlOperations`. The quality
guard requires every executed operation to be named in those manifests with
all register fields. A generic `query(string)` API is forbidden.

## Retained operations

| Operation | File | Purpose | Atomic/performance trigger | Input type | PII? | User input? | Can Local API replace it? | Decision source | Integration proof |
|---|---|---|---|---|---|---|---|---|---|
| `claimDueFeedSources` | `src/core/data-access/ingest/sql/index.ts` | Claim a bounded due-feed batch | `UPDATE` + `FOR UPDATE SKIP LOCKED` + `RETURNING` | internal clock, configured batch | no | no | no equivalent concurrent claim | TASK-01.7, ADR-0014 | `verify:jobs-config`, `verify:integration` |
| `claimQueuedImportRun` | same | Claim one queued import | conditional state transition + affected row | internal ID, clock | no | no | no atomic Payload 3.90.1 equivalent | TASK-01.7, ADR-0014 | `verify:integration` |
| `interruptRecoverableImportRun` | same | Interrupt one still-stale run | worker/janitor race arbitration | internal ID/status/timestamps/redacted enum | no | no | no; read/update admits two winners | ADR-0011 exact exception | `verify:integration` |
| `touchImportRunHeartbeat` | same | Heartbeat only a running import | conditional timestamp update | internal ID, clock | no | no | no; split operation may touch terminal row | TASK-01.7, ADR-0014 | `verify:integration` |
| `consumeDeactivationApproval` | same | Consume valid approval once | conditional single-use mutation | internal IDs, clock | no | no | no; split operation permits double consume | TASK-01.7, ADR-0013, ADR-0014 | `verify:feed-ingest`, `verify:integration` |
| `finishImportRun` | same | Persist one terminal result | conditional terminal mutation + affected row | internal ID/result/counters/redacted error | no | no | no; split operation loses terminal ownership | TASK-01.7, ADR-0013, ADR-0014 | `verify:feed-ingest`, `verify:integration` |
| `claimLeadDeliveryRow` | `src/core/data-access/system/sql/index.ts` | Claim one due delivery and increment once | conditional claim + affected row | internal ID, clock | no | no | no; split operation risks duplicate delivery | TASK-01.7, ADR-0014 | `verify:integration` |
| `claimPendingDeliveryRecoveryLease` | same | Lease one stale pending delivery | concurrent recovery arbitration | internal ID/threshold/lease timestamps | no | no | no; split operation risks duplicate job | ADR-0011 exact exception | `verify:integration` |
| `recoverStaleSendingDeliveryIfStillStale` | same | Recover one still-stale sending delivery and append bounded safe audit evidence | status + heartbeat predicate, mutation and affected row must be atomic | internal ID/threshold/clock/log bound | no | no | no; Payload 3.90.1 reads matching IDs before per-ID writes | TASK-02.4, ADR-0015 | `verify:integration` two-worker one-winner and live-heartbeat proofs |

External feed values are untrusted data but are never raw SQL strings: retained
templates accept only typed scalar values through Drizzle parameter binding.

## Reverted to Payload Local API in TASK-01.7

The following former SQL operations had a supported normal-access Local API
path and were removed from the raw SQL surface:

- `touchFeedPropertiesLastSeenAt` → scoped `payload.update`;
- `countMissingActiveFeedProperties` → scoped `payload.count`;
- `deactivateMissingFeedProperties` → scoped `payload.update`.

All three use the explicit ingest access mode with `overrideAccess:false`; when
an import transaction exists, the same `PayloadRequest.transactionID` is used.
