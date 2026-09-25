# EPIC-38 — delivery evidence

Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`

Branch: `codex/epic-38-content-inventory`

Implementation SHA: `0a18e023a2edec4b5c0e4c7b1551938b65806658`

Verification SHA: `8285d22d98a845cd4ca315de19afe478d0c23d33`

## Traceability

- Master-plan contract: `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md#EPIC-38`.
- Preflight and safe fallback: `docs/research/EPIC-38_CONTENT_INVENTORY_PREFLIGHT.md`.
- Acceptance matrix and executed checks:
  `docs/research/EPIC-38_CONTENT_INVENTORY_VERIFICATION.md`.
- Runtime owner: Payload collection `listing-contents`; Prisma or a parallel
  content store was not introduced.
- Public read path: classified Public Gateway only; raw anonymous Payload REST
  access remains denied.
- Activation consumers: route robots/SSR introduction, internal links and
  sitemap all consume the same evidence contract.

## Exact outcome

The queue contains 25 gated registry pages. P1 precedes P2, both use threshold
5, and TEST uses threshold 10. A page can become indexable only when matching
published inventory meets its threshold and owner-approved unique content with
dated context facts exists. The same evidence controls all activation surfaces.

No production data was seeded and no candidate URL was force-activated. The
deployment default therefore remains fail-closed.

## Delivery classification

Risk: `RISKY` because the diff adds a Payload collection and PostgreSQL migration.
Required before merge: exact-head SourceCraft RISKY gate. Production deployment
is outside EPIC-38 and is not authorized by this evidence.

## Deviations and discovered work

- Deviations from the approved EPIC-38 contract: none.
- Discovered work: repair the historical down path in migration
  `20260916_090228` separately. It does not affect the verified forward migration
  or the isolated EPIC-38 down statements.
