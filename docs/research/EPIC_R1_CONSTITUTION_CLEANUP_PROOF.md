# EPIC-R1 Constitution Cleanup — focused proof

Date: 2026-09-29
Plan: `DON_CITY_CONSTITUTION_CLEANUP_PRODUCTION_TRUTH_MASTER_PLAN_V1_0.md`
Branch: `codex/dc-r1-constitution-cleanup`

## Historical loose file

The loose 2026-09-27 conformance input was inspected and classified as useful
history, not an active Source of Truth. It is preserved at
`docs/archive/AMS_DON_CITY_FINAL_CONFORMANCE_DOCUMENTATION_MASTER_PLAN_V4_0_2026-09-27.md`.

- SHA-256 before move: `AA127C8AEAD4AE2D2C8E0CDC900D2A53FA2154C8397CB166E518737C7EF1C213`
- SHA-256 after move: `AA127C8AEAD4AE2D2C8E0CDC900D2A53FA2154C8397CB166E518737C7EF1C213`
- original checkout `git status --short`: empty

## Focused checks

All commands passed on the R1 branch after TASK-R1.1 through TASK-R1.6:

- `pnpm verify:ui-core`
- `pnpm verify:feed-ingest`
- `pnpm verify:feed-lifecycle`
- `pnpm verify:lead-intake`
- `pnpm verify:lead-context`
- `pnpm verify:lead-outbox`
- `pnpm verify:lead-delivery-state`
- `pnpm verify:lead-pii-regression`
- `pnpm verify:cp02-seo-surface`
- `pnpm typecheck`
- `git diff --check`

## Dependency impact

Graphify was updated once after implementation. The affected surfaces confirm:

- 304 bookkeeping reaches the import task and feed verification suites;
- retention typing reaches the public lead gateway, outbox, delivery task and
  lead verification suites;
- query grammar reaches robots/indexing policy, route resolution and SEO checks.

No independent unplanned work was discovered. Delivery review and the exact-head
RISKY SourceCraft gate remain the separate `TASK-R1-DELIVERY` responsibility.
