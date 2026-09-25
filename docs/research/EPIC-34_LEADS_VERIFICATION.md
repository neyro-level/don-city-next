# EPIC-34 — LEADS verification

Status: PASS with isolated follow-ups
Date: 2026-09-25
Task: `dcv4-task-34-verify`
Verified implementation after rebase: `c9d656d`

## Acceptance evidence

| Criterion | Verdict | Evidence |
| --- | --- | --- |
| Reuse the starter lead engine | PASS | The existing `LeadFormView`, protected intake, idempotent outbox and delivery adapters remain the execution path. No parallel lead endpoint or bypass was introduced. |
| Capture `category`, `district`, `city`, `property` and typed `formKind` | PASS | Contract, browser payload, intake normalization, Payload collection, repository mapping and outbound adapter payloads carry the same business context. |
| Support `formKind=legal` | PASS | `/yurist` composition emits `legal`; the static contract check and PostgreSQL round trip persist and read it as `legal`. |
| Keep future mortgage/development fields nullable | PASS | Both fields accept `null` at the public boundary, normalize to absence in the domain and remain nullable in Payload/PostgreSQL. |
| Preserve security and data boundaries | PASS | Consent version, honeypot, timing checks, rate limiting, idempotency, public property validation and system-only persistence remain active. Security-boundary checks pass. |

## Executed proof

- `pnpm typecheck` — PASS.
- `pnpm verify:lead-context` — PASS.
- Existing lead intake, outbox, delivery-state, MAX, custom-webhook and lawyer-page checks — PASS.
- `pnpm verify:security-boundaries` — PASS, including safe outbound and secret guards.
- `pnpm quality:architecture` — PASS: 476 modules, 1484 dependencies, no violations.
- Scoped Biome check for changed source/config files — PASS.
- `pnpm quality:docs-sot` and `git diff --check` — PASS.
- Native PostgreSQL 18 disposable database:
  - all migrations, including `20260925_093100_add_lead_business_context`, applied successfully;
  - `pnpm verify:schema` — PASS;
  - `pnpm verify:integration` — PASS after the independently tracked property hook repair was merged;
  - `pnpm verify:lead-context:integration` — PASS with create/read/delete proof for a legal lead context.
- `pnpm quality:guards` — PASS after the independently tracked CI-policy and UI-core guard repairs were merged.
- Graphify affected analysis for `prepareLeadIntake()` found only the expected public gateway, verification suites and barrel export consumers.

## Isolated follow-ups

1. `dcn-lkdl` is CLOSED: the property `afterChange` / `publicUrlId` repair passed RISKY run 51 and was merged through PR 49 as main commit `213798d`.
2. `dcn-4962` is CLOSED: the manual exact-head SourceCraft policy passed RISKY run 50 and was merged through PR 48 as main commit `9378a74`.
3. `dcn-91kz` is CLOSED: the strict UI-core export allowlist passed RISKY run 52 and was merged through PR 50 as main commit `57e16b6`.
4. Public lead acceptance remains intentionally disabled while `clientReadinessConfig.leadRetentionDays` is unset. Selecting a real retention period is an owner/legal activation decision and was not guessed; the decision is tracked as `dcn-wb30`. This blocks production activation, not code review or merge.

## Conclusion

The EPIC-34 product contract is implemented and proven locally, including the full native PostgreSQL integration suite and a dedicated business-context round trip. No production, DNS, secret, outbound-channel or destructive data action was performed. Code delivery now requires only the normal exact-head RISKY review/gate; production activation remains separately gated by `dcn-wb30`.
