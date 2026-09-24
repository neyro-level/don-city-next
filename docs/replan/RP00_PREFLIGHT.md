# RP-00 preflight

Task: `dcv4-task-53-preflight`
Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7 APPROVED`
Plan SHA-256: `9f4b011c10520d4d4a813da5e0f10409354c84f1901a62c5cc3a89f073319418`
Repository: `integrator-p/don-city-next`
Base: `1f69be16b99bb55f53f6ccb6fafaf9a94ee74b24`

## Task Contract

- Goal: prepare a factual, evidence-linked current-state inventory for RP-00 without changing runtime behavior.
- Non-goals: city-first implementation, redirects, schema changes, migration execution, production/DNS/server/secret writes, WIP merge or deletion.
- Platform: AMS Realty Platform Core 3.0 + Payload Platform; profile `catalog`, mode `BUILD`, delivery profile `CRITICAL`.
- Data owner: Payload remains the only schema/auth/migration owner; Prisma is forbidden.
- Boundaries inspected by RP-00: public routes, URL/href/canonical/sitemap/lead construction, Payload geo/property/site-settings fields, merged V3 evidence and isolated EPIC-08 WIP.
- Data changes: none.
- Auth/PII: no access or mutation; no secret extraction.
- External access: public HTTP checks are read-only and may only prove existing published URLs. Uncertainty never creates a redirect rule.
- Proof: `docs/replan/RP00_INVENTORY.md` with `DONE_V3 | PARTIAL | ABSENT`, file/runtime evidence and explicit merged-versus-WIP classification.
- Gate: STANDARD for RP-00 delivery unless the exact diff expands into a risky surface.

## Entry evidence

- Exact plan validation: PASS, coverage `55/55`, tasks `265`.
- Task Manager reconciliation: `CLEAN`, missing IDs `0`, unexpected IDs `0`, drift `0`, cycles `0`.
- First ready implementation task: `dcv4-task-53-preflight`.
- Canonical remote identity matches the inventory repository.
- Worktree branch is isolated: `codex/rp-00-current-state-inventory`.
- The worktree starts from the approved replan checkpoint because the approved plan has not yet landed in `origin/main`; the eventual RP-00 PR targets `main` and must include this approved checkpoint. No runtime code is changed by this preflight.
- Preserved WIP: branch `codex/epic-08-geo-model`, head `f26853fd81c09e9c0bc2f9c57003c5f1ed5b8b21`; RP-00/RP-05 may inspect it, but may not merge or discard it implicitly.

## Inventory surface

1. `src/app/**` route owners, including current `/kvartiry/donetsk/` and `/obekty/[slug]` surfaces.
2. URL and link creation in `src/core/**`, `src/project/**`, `src/fixture/**` and `packages/**`.
3. Canonical, metadata, sitemap, robots, redirects, cache invalidation and lead source-page construction.
4. Payload collections/config/migrations for properties, geo and site settings.
5. SEO and district seed URLs and their current source version.
6. Merged V3 epic evidence versus isolated/unmerged EPIC-08 work.
7. Read-only public observations for `doncity-home.ru`; only reproducible URLs may enter a legacy compatibility manifest.

## Stop conditions

- Source/inventory drift or non-clean Task Manager reconciliation.
- Need for production, DNS, server, database or secret mutation.
- Redirect proposal without reproducible public evidence.
- Attempt to merge/discard EPIC-08 WIP during inventory.
- Discovery of an architecture decision not already settled by V4.
