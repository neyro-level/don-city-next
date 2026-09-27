# CP-03 evidence — jobs, import and lead safety

Status: `READY_FOR_RISKY_DELIVERY`

Evidence head before this record: `b9103000338ce7ca63689e88004ed9b3c048e4be`.

## Traceability

| Requirement | Implementation owner | Evidence |
|---|---|---|
| Transactional linked lead retention | `src/project/jobs/tasks.ts` | required integration rollback/commit coverage |
| Pending-delivery minimum orphan age | recovery thresholds + `recoverLeadDeliveries` | CP-03 safety check and required integration fixtures |
| Atomic import janitor transition | ingest SQL allowlist | ADR-0011 and worker-versus-janitor race proof |
| Atomic delivery recovery lease | system SQL allowlist | ADR-0011 and two-recovery-worker one-job proof |
| Heartbeat outside ingest transaction | ingest SQL heartbeat operation | open-transaction independent-observer proof |
| Runtime clock and fail-closed runtime env | project jobs/env/Payload config | CP-03 safety, security boundaries, typecheck and build |
| Lead boundary and minimized response | public lead route/security classifier | lead-intake and security-boundary checks |
| Bounded rate-limit state | in-process lead limiter | CP-03 safety and lead-intake checks |

## Durable records

- Owner decision and operation inventory:
  `CORE55_CP03_OD03_DECISION_PACKET.md`.
- Architecture decision: `docs/adr/ADR-0011-narrow-atomic-sql-recovery.md`.
- Database identity and proof: `CORE55_CP03_DB_PROOF_PLAN.md`.
- Acceptance matrix and exact checks: `CORE55_CP03_VERIFICATION.md`.
- Task execution history: Beads ledgers for CP-03 preflight, implementation,
  verification, evidence and delivery.

## Residual risks and handoff

- Integrated isolated-staging repetition remains mandatory in CP-08 on the
  merged exact candidate.
- The existing `OPERATIONS.md` phrase inventory is reconciled by CP-07; it does
  not weaken the passing runtime/database proof.
- Any additional raw SQL operation needs a new owner decision or ADR update.
- The SourceCraft RISKY gate must attest the final PR head; any new commit
  invalidates that gate.

No production, public indexing, real feed, DNS, secret mutation or destructive
migration is part of this evidence record.
