# EPIC-05 preflight — docs consolidation and archive

## Entry

- Base: SourceCraft `main@53e396f08ee405688469a8466c61332770d703f4`.
- Branch: `codex/epic-05-docs-consolidation`.
- Approved source: `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md`, plan v7.
- Scope is documentation governance only. Production and external systems are
  not involved.

## Inventory result

1. V4 is the only active master-plan file in the current tree.
2. V3 is preserved at
   `docs/archive/AMS_DON_CITY_FINAL_MASTER_PLAN_V3_0_SUPERSEDED.md` with an
   explicit `SUPERSEDED` status and immutable archive hash.
3. No SEO Passport or master plan v2.2 file exists in the current tree.
4. Git path history contains the active V4 path, the former V3 path and its
   archived replacement; it contains no SEO Passport or v2.2 path to move.
5. `docs/research/**`, `docs/replan/**` and `docs/archive/**` are explicitly
   evidence/history, not competing product or SEO contracts.
6. The two CSV files in `docs/seo/**` are materialized runtime seed data and do
   not replace URL/index/canonical ownership in Product Structure or the exact
   registry in V4.

## Implementation contract

1. Keep V4 byte-identical and the sole active detailed execution/SEO registry.
2. Refresh the docs map and archive index with explicit legacy-absence evidence.
3. Add a deterministic repository guard that rejects:
   - another active master-plan file outside `docs/archive/**`;
   - SEO Passport or v2.2 files outside `docs/archive/**`;
   - loss of the V3 `SUPERSEDED` marker;
   - docs-map drift away from the exact V4 owner.
4. Integrate the guard into existing quality checks without changing product
   runtime behavior.

## Acceptance and checks

- Exactly one active master plan is discovered.
- V3 archive status and path are verified.
- No unarchived legacy SEO/master files are discovered.
- Docs map, archive index and Product Structure retain reference-only ownership
  without copying the registry.
- The new guard passes and has a negative self-test for duplicate active files.
- Typecheck/build are not required for documentation-only behavior unless the
  guard implementation changes runtime code (it must not).

## Stop conditions

- A real untracked/ignored legacy contract is discovered and its provenance is
  unclear.
- Consolidation would require changing the APPROVED plan bytes or imported
  Task Manager inventory.
- A document contains unique active product decisions not represented by the
  current Source of Truth map.
