# ADR-0013: Payload 3.90.1 transaction session carrier

Status: Accepted
Date: 2026-09-28
Decision: `PIN_PAYLOAD_SESSION_EXECUTOR`

## Context

DON CITY must commit import-finalization Local API writes and any retained
approved SQL in one PostgreSQL transaction. Passing one `PayloadRequest` with
the exact `transactionID` is the documented Payload mechanism for Local API
operations. The default `payload.db.drizzle` executor is not transaction-bound.

Official references:

- <https://payloadcms.com/docs/database/transactions>
- <https://payloadcms.com/docs/local-api/overview#transactions>

The installed `payload`, `@payloadcms/db-postgres` and `@payloadcms/drizzle`
versions are pinned to `3.90.1`. In that exact adapter source,
`beginTransaction` stores the Drizzle transaction object at
`adapter.sessions[id].db`, and Payload Local API operations resolve the same
object from `req.transactionID`.

## Decision

1. Start with `payload.db.beginTransaction()` and fail if it returns `null`.
2. Create one request carrying that exact `transactionID` and pass it to every
   Local API read/write in the atomic unit.
3. Retained approved SQL may execute only through
   `requirePayloadTransactionExecutor(payload, transactionID)`, which returns
   `adapter.sessions[id].db` and fails closed if the session is unavailable.
4. Never fall back to `payload.db.drizzle` for an operation that claims to be
   part of the transaction.
5. Commit or rollback by the same transaction ID. Await all participating work
   before either action.

This is a pinned dependency assumption over an adapter session registry. It is
allowed only while the source guard and real PostgreSQL rollback proof pass.
Any Payload/adapter version change must re-audit this ADR before merge.

## Proof and safeguards

- `verify:payload-transaction-contract` inspects installed `3.90.1` package
  source and the project helper; it fails on version or carrier drift.
- The PostgreSQL integration suite creates a row through Local API, updates it
  through the exact session executor, observes the update through the same
  request and proves rollback removes the row.
- No generic SQL executor is exported. The helper accepts only an already
  active Payload transaction ID and exposes no default adapter executor.
- Production database access and production migrations are outside this ADR.

## Rejected alternatives

- `payload.db.drizzle.execute(...)`: it uses the default adapter executor and
  does not prove participation in the active transaction.
- A read followed by an independent Local API/SQL write: it cannot provide the
  required atomicity or concurrency guarantee.
- Silent use of an undocumented session field without a version guard, ADR and
  real rollback proof.
