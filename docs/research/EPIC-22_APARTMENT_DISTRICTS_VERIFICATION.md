# EPIC-22 — APARTMENT DISTRICTS / MICRODISTRICTS VERIFICATION

## Verified head

Reviewed implementation head: `15aa84c0a0a0356252b55c8fe14cf56e8a2fbc4c`.

## Acceptance matrix

| Acceptance | Evidence | Verdict |
|---|---|---|
| Approved apartment districts are dynamic catalog pages | `verify:apartment-districts` resolves all ten generated apartment district URLs through `resolveProjectPublicRoute()`, compares exact metadata/canonical paths and verifies apartment + Donetsk + district catalog queries. | PASS |
| Textilshchik keeps the hard contract | The verifier reads the canonical district seed and proves `microdistrict`, empty parent, `на`, `Текстильщике`, `P1`, broad `137` and `wordstat_v1`; its route keeps the exact approved title and H1. | PASS |
| TEST candidates use fallback data and threshold 10 | Every apartment TEST seed has blank broad and `fallback_no_wordstat`; its SEO registry row has `minActiveObjects=10` and remains `noindex,follow` without Gate evidence. | PASS |
| Optional parent changes breadcrumbs only | Resolver loads only a published, same-city administrative parent through the Public Gateway. A parent fixture inserts the grammar-owned parent path before Textilshchik while canonical remains `/donetsk/kvartiry/tekstilshchik/`. | PASS |
| `parent=null` is valid | The default Textilshchik fixture returns no parent and renders the four-item Home → hub → apartment → current breadcrumb chain. | PASS |
| Invalid district path is rejected | `/donetsk/kvartiry/unknown-district/` resolves to `404`. | PASS |
| Actual property links to its district owner | `verify:navigation` crawls the property → canonical district path while Gate filtering remains in place for hub/category top links. | PASS |
| Public data boundary remains narrow | The parent lookup uses explicit city/district selects, depth 0 and the existing public gateway access policy; no raw Payload document reaches public UI. | PASS |

## Checks

- `pnpm verify:apartment-districts` — PASS, 10 district routes.
- `pnpm verify:route-resolver` — PASS.
- `pnpm verify:seo-contracts` — PASS, 40 SEO rows, 10 district rows and
  50 Wordstat owners.
- `pnpm verify:navigation` — PASS, 13 canonical targets.
- `pnpm verify:public-gateway` — PASS.
- `pnpm verify:public-geo-gateway` — PASS.
- `pnpm typecheck` — PASS.
- `pnpm quality:architecture` — PASS, 460 modules and 1395 dependencies with
  no violations.
- Scoped Biome check — PASS for every changed code/config file.
- Repository lint — PASS with 25 existing warnings outside this scope.
- `git diff --check` — PASS.

## Scope and residuals

No schema, migration, auth, dependency, seed, secret or production change was
made. Runtime database integration was not started because this task changes no
database contract; the typed Public Gateway implementation is covered by
typecheck, architecture checks and deterministic resolver verification.

Deviations: none. Discovered work: none.

## Traceability

- canonical base after EPIC-21: `cd4b36c9c37f3e2e2a19ee2b3640b22b5a997d4d`;
- preflight: `f4dfc6e80cf21c5c323c041bb7d9c37a745e11f7`;
- implementation: `9908c7e916270bcded01b8495d6b5d04511479ef`;
- verification evidence: `8ec080ac7dd5c78c634f2885b879f7831a014bec`;
- full-diff review fix for an unavailable/unpublished parent:
  `15aa84c0a0a0356252b55c8fe14cf56e8a2fbc4c`;
- branch: `codex/epic-22-apartment-districts`;
- changed product surface: parent-aware district breadcrumbs, narrow public
  parent lookup, property-to-district linking and the EPIC-22 verifier;
- unchanged surfaces: Payload schema/migrations, auth, feed normalization,
  seed data, dependencies, secrets and production.
