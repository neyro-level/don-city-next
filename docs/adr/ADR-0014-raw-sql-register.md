# ADR-0014: Complete named raw SQL register

Status: Accepted
Date: 2026-09-28
Decision: `RETAIN_NAMED_SQL_REGISTER`
Approval source: owner-approved remediation plan v1, TASK-01.7

## Context

The runtime had eleven named SQL operations, while ADR-0011 authorized only two
additional recovery exceptions. Treating ADR-0011 as blanket authorization
would hide the ownership and reason for the older SQL surface.

## Decision

1. Keep the eight operations recorded in `docs/RAW_SQL_REGISTER.md` and in the
   typed runtime manifests. Each has a concrete concurrency trigger, accepts
   typed parameterized input and exposes no generic executor.
2. ADR-0011 remains the decision source only for
   `interruptRecoverableImportRun` and
   `claimPendingDeliveryRecoveryLease`.
3. Replace `touchFeedPropertiesLastSeenAt`,
   `countMissingActiveFeedProperties` and
   `deactivateMissingFeedProperties` with supported Payload Local API calls and
   explicit ingest access rules.
4. The quality guard rejects raw SQL outside the two private runtime files and
   rejects executed operations missing complete register metadata.
5. Any ninth retained runtime SQL operation requires a new owner decision or a
   superseding ADR. TASK-02.4 supplied that decision for the exact ninth
   operation recorded in ADR-0015; further expansion still requires a new owner
   decision. Production data access is not authorized by this decision.

## Safeguards

- SQL templates remain parameterized and private.
- `containsPii` and `userInput` are explicitly recorded for every operation.
- Transaction-participating SQL must use ADR-0013's exact session executor.
- The exact-head SourceCraft gate remains `RISKY`.
