# ADR-0015: Atomic stale-sending recovery

Status: Accepted
Date: 2026-09-28
Decision: `ADD_EXACT_STALE_SENDING_OPERATION`
Approval source: owner-approved remediation plan v1, TASK-02.4

## Context

The recovery job read stale `sending` deliveries and later updated each row by
ID. A live worker could refresh its heartbeat or finish delivery after the read,
then have that newer state overwritten by the janitor. Payload 3.90.1 bulk
update does not close the race: it first resolves matching documents and then
performs document updates by ID.

## Decision

Add one named System Gateway operation,
`recoverStaleSendingDeliveryIfStillStale`. Its single PostgreSQL statement:

- matches the internal delivery ID, `sending` status and heartbeat older than
  the exact stale threshold;
- moves only the winner to `pending`, clears its active claim and records the
  retryable diagnostic;
- appends one bounded, non-PII recovery audit entry;
- returns the affected delivery ID, or no result when a live worker won.

This is a new exact owner mapping and does not broaden ADR-0011.

## Safeguards

- Inputs are internal scalar IDs, timestamps and the validated log bound.
- SQL remains parameterized and private; no generic executor is exposed.
- Two-worker integration proof requires one winner and one audit entry.
- A refreshed heartbeat proof requires no mutation.
- Merge remains subject to one exact-head `RISKY` SourceCraft gate.
- This decision does not authorize production access or release.

## Rejected alternative

Payload Local API `update(where)` is not an atomic compare-and-set in the
installed version because matching IDs are read before the per-document update.
