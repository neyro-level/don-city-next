# EPIC-34 — LEADS evidence

Status: implementation and targeted verification complete
Date: 2026-09-25
Task: `dcv4-task-34-evidence`
Branch: `codex/epic-34-leads`
Verified implementation/verification commits after rebase: `c9d656d`, `d177bad`

## Traceability

- Contract and browser submission: `packages/contracts/src/lead.ts`, `packages/ui/src/views/starter/LeadFormView.tsx`.
- Route composition: `src/app/(site)/public-route.tsx`, `src/project/static-page-composition.ts`.
- Validation and protected intake: `src/core/leads/intake.ts`, `src/core/data-access/public/leads.ts`.
- Persistence: `src/project/collections/Leads.ts`, generated Payload types, repository mapping and additive migration `20260925_093100_add_lead_business_context`.
- Delivery: MAX and custom-webhook payloads include the typed context; existing outbox and idempotency behavior is retained.
- Verification: `scripts/verify-lead-context.ts`, `scripts/integration/lead-context-suite.ts` and the updated existing lead suites.

## Result

The existing starter lead pipeline now captures and preserves `category`, `district`, `city`, `property` and the public business `formKind`, including `legal`. Future `mortgage` and `development` values are nullable. Legacy coarse form kinds remain readable and are mapped to a safe fallback context.

The implementation passed TypeScript, focused lead suites, security boundaries, architecture rules, schema verification, the full native PostgreSQL integration suite and a real PostgreSQL create/read/delete round trip. The disposable database was removed after verification. Full details and command evidence are in `EPIC-34_LEADS_VERIFICATION.md`.

## Deviations and discovered work

- `dcn-lkdl` — CLOSED through PR 49 / RISKY run 51 / main `213798d`.
- `dcn-4962` — CLOSED through PR 48 / RISKY run 50 / main `9378a74`.
- `dcn-91kz` — CLOSED through PR 50 / RISKY run 52 / main `57e16b6`.
- `dcn-wb30` — OPEN owner/legal decision for the production lead retention period.

The technical blockers are resolved and do not change the verified EPIC-34 implementation contract. `dcn-wb30` intentionally prevents production lead activation until the owner sets a real retention period; it does not block review or delivery of the code to canonical `main`.
