# EPIC-38 — content / inventory activation verification

Date: 2026-09-25

Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`

Implementation checkpoint: `0a18e023a2edec4b5c0e4c7b1551938b65806658`

## Acceptance matrix

| Criterion | Verdict | Evidence |
| --- | --- | --- |
| P1 is processed before P2; both require at least 5 active objects | PASS | `pnpm verify:content-inventory` verifies the fixed queue order and thresholds. |
| TEST pages require at least 10 active objects | PASS | `pnpm verify:content-inventory` verifies all TEST queue entries against threshold 10. |
| A gated page activates only with approved, unique, contextual content and actual inventory | PASS | Payload integration creates 5 matching public properties, rejects admin approval, reads owner-approved content through the Public Gateway and passes the gate. |
| Missing evidence fails closed for robots, sitemap and internal links | PASS | Route resolver, sitemap/IndexNow and navigation verifiers pass with candidate pages excluded until evidence is present. |
| Approved introduction is present in server-rendered output | PASS | Route resolver propagates the approved introduction and the server catalog view renders it without a client-only dependency. |
| Payload access and raw REST boundaries are preserved | PASS | Public reads use classified `publicListingContentReadAccess`; anonymous raw REST remains denied. Security-boundary verifier passes. |
| Schema change is additive and reproducible | PASS | PostgreSQL 18 migration and `verify:schema` pass on the local development database and on a disposable database. |

## Executed checks

- `pnpm typecheck` — PASS.
- `pnpm lint` — PASS with warnings only. The warnings are existing generated-migration, generated-type and legacy CSS diagnostics; no lint error was emitted.
- `pnpm build` — PASS; all static and dynamic routes compiled.
- `pnpm verify:content-inventory` — PASS: 25 gated pages, P1/P2=5, TEST=10.
- `pnpm verify:content-inventory:integration` — PASS; fixture cleanup confirmed `0|0|0` for test user, content and properties.
- `pnpm verify:seo-content-gate` — PASS.
- `pnpm verify:route-resolver` — PASS.
- `pnpm verify:sitemap-indexnow` — PASS.
- `pnpm verify:navigation` — PASS.
- `pnpm verify:public-gateway` — PASS.
- `pnpm verify:security-boundaries` — PASS.
- `pnpm quality:architecture` — PASS: no dependency violations.
- `git diff --check` — PASS after generated migration whitespace normalization.

## Scope review

The diff is limited to the listing-content Payload collection and migration,
Public Gateway reads/counts, content-gate evidence propagation, SSR catalog copy,
sitemap/internal-link activation, and targeted verification. No real listing
content was inserted, so all candidate pages remain fail-closed until owner-approved
copy and matching published inventory exist.

## Known limitation and discovered work

The EPIC-38 down migration completed on a disposable database. Payload then
continued rolling back the whole historical batch and an older migration
`20260916_090228` failed while dropping a legacy foreign key that was already
absent. This is pre-existing migration-history debt outside EPIC-38; the disposable
database was recreated, verified with the full up path, and removed. Production,
DNS and external secrets were not touched.
