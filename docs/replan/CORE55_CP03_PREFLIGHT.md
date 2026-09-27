# CORE 5.5 CP-03 preflight

Status: `READY_WITH_OWNER_DECISION`

## Execution boundary

- Plan: `AMS-DON-CITY-CORE55-POSTPROD v9 APPROVED`.
- Epic: `EPIC-70 / CP-03 — JOBS, IMPORT AND LEAD SAFETY`.
- Branch: `codex/dc55-epic-70`.
- Base: `1af2f8e34509e3cd0a76653546f23998d889b7c6` (`origin/main`).
- Delivery profile: `CRITICAL`; final gate is `RISKY` on the exact PR head.
- Production, public indexing, real-feed activation, DNS, secrets and destructive
  production data actions are outside this stream.

## Acceptance surface

CP-03 must prove that import and lead recovery are atomic and race-safe, lead
retention removes or anonymizes linked PII, runtime secrets fail closed, and
Core 5.5 proofs A/D/E/F/G pass against an explicit isolated PostgreSQL test
database and an isolated staging contour. Evidence must be redacted.

The implementation slices are:

1. Inventory the eight approved ingest operations and one system claim that use
   narrow parameterized SQL; do not rewrite them before OD-03 is decided.
2. Make janitor transitions conditional at write time and inspect both missing
   and dead referenced Payload jobs.
3. Make lead retention complete and transactional for all linked deliveries.
4. Apply a minimum-age threshold before pending delivery recovery and preserve
   live jobs discovered by id or concurrency key.
5. Prove import heartbeat visibility from an independent database observer.
6. Use the runtime clock consistently; make runtime DB/secret configuration
   fail closed while preserving an explicit build-only phase.
7. Evict expired rate-limit buckets first, then the oldest reset deadline.
8. Require a same-site or approved Origin, JSON Content-Type and safe Fetch
   Metadata on public lead intake; expose only `{ accepted: true }` publicly.
9. Keep Nginx lead rate limiting and prove the collection access matrix for
   Regions, Cities, Districts and ListingContents.

## Factual owner map

| Concern | Current owner | Preflight finding |
|---|---|---|
| Import claim/heartbeat/terminal transitions | `src/core/data-access/ingest/sql/index.ts` | Narrow parameterized SQL repeats state predicates atomically; OD-03 applies. |
| Lead delivery claim | `src/core/data-access/system/sql/index.ts` | One conditional claim statement; OD-03 applies. |
| Import janitor | `src/project/jobs/tasks.ts` | Read-then-update race and dead referenced-job gap are confirmed. |
| Lead retention | `src/project/jobs/tasks.ts`, `src/core/leads/retention.ts` | Linked delivery query is capped and mutations are not one proven transaction. |
| Delivery recovery | `src/project/jobs/tasks.ts`, `src/core/operations/recovery-thresholds.ts` | Threshold helper exists but is not applied to pending recovery. |
| Runtime clock/config | `src/core/time/clock.ts`, `src/project/env.ts`, `payload.config.ts` | Catalog lifecycle already uses runtime clock after CP-02; unconditional fallback DB/secret remains. |
| Request/rate boundary | public lead route, in-process limiter, Timeweb Nginx templates | Origin/Fetch Metadata/JSON checks and response minimization remain; edge limit already exists. |
| Collection access | Regions/Cities/Districts/ListingContents | Explicit CRUD access exists; regression matrix remains required. |

## Raw SQL decision (OD-03)

Current SQL is not generic: each exported operation is parameterized, named and
documents its atomic invariant. Payload `3.90.1` Local API does not currently
provide a demonstrated single-statement conditional claim/transition with an
affected-row result for these cases. Replacing it before equivalent concurrency
semantics are proven would increase risk.

Recommendation: retain only these narrow operations as an ADR-backed exception,
add transaction/concurrency evidence, and forbid ad-hoc SQL exports. This is an
owner decision before the affected implementation is closed. Non-SQL recovery
work can proceed independently.

## Test and staging identity

- Native PostgreSQL 18 is running locally on `127.0.0.1:5432`.
- No database is accepted merely because it is reachable. Integration proof may
  use only a newly created, task-specific local test database whose name and
  connection are supplied explicitly to the test process.
- Existing databases, production credentials and real feeds are not inspected or
  mutated by this preflight.
- For CP-03, “isolated staging” means a local production-mode application process
  backed by that disposable test database and test-only fixtures. External
  integrated staging remains CP-08 and must stay edge-noindex.

## Rollback and stop conditions

Rollback is the previous immutable application commit plus task-specific
transaction/data recovery. Stop before any destructive migration, unknown DB or
staging identity, real feed, production/indexing/DNS/secret mutation, or a SQL
rewrite without OD-03. A missing disposable test database blocks evidence and
delivery, not unrelated source implementation.
