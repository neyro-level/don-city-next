# EPIC-23 — APARTMENT ROOM FACETS VERIFICATION

## Verified head

Implementation head: `5587a0d4703c8b22b159ffe4d5a41914247bc354`.

## Acceptance matrix

| Acceptance | Evidence | Verdict |
|---|---|---|
| Three approved room path owners exist | The focused verifier resolves `odnokomnatnye`, `dvuhkomnatnye` and `trehkomnatnye` and proves catalog room queries `[1]`, `[2]`, `[3]`. | PASS |
| Registry metadata keeps approved tiers and demand evidence | The verifier proves P1/184, P1/145 and P2/66 with `minActiveObjects=5`. | PASS |
| Direct facet paths follow Content Gate | Without activation evidence each direct path is `200 noindex,follow` and keeps its grammar-owned canonical URL. | PASS |
| Query equivalent never becomes indexable | Every apartment category query result is forced to `noindex,follow`. | PASS |
| Active single approved room owns canonical path | Gate-passing evidence changes `?rooms=1|2|3` canonical to the matching typed facet path and exposes that path as internal navigation. | PASS |
| Gate-off query falls back safely | Without evidence `?rooms=1` filters the catalog but canonical remains `/donetsk/kvartiry/`. | PASS |
| Multiple or unknown room query has no path owner | Multiple rooms retain a normalized catalog filter and base canonical; an unknown room remains noindex with base canonical. | PASS |
| Secondary-market duplicate is absent | Runtime registry scan confirms no `vtorichka` facet owner. | PASS |
| Metadata and page use one decision | The Next catch-all forwards the same `searchParams` to both metadata and rendered route resolution. | PASS |

## Checks

- `pnpm verify:apartment-room-facets` — PASS.
- `pnpm verify:route-resolver` — PASS.
- `pnpm verify:seo-content-gate` — PASS.
- `pnpm verify:seo-contracts` — PASS: 40 SEO rows, 10 district rows and 50
  Wordstat owners.
- `pnpm verify:navigation` — PASS: 13 canonical targets.
- `pnpm verify:public-gateway` and `pnpm verify:gateway-context` — PASS.
- EPIC-21 and EPIC-22 focused regressions — PASS.
- `pnpm typecheck` — PASS.
- `pnpm quality:architecture` — PASS: 461 modules and 1399 dependencies,
  no violations.
- Scoped Biome and `git diff --check` — PASS.

## Scope and residuals

No schema, migration, auth, Payload access, seed, dependency, secret or
production change was made. Real inventory activation remains owned by EPIC-38;
until its evidence loader is connected, query canonical correctly falls back to
the apartment category path.

Deviations: none. Discovered work: none.

## Traceability

- canonical base after EPIC-22: `e6729a62cc12a86a430d2aa191e4f21ee36eb917`;
- preflight: `58fad74ad80139e2fe72cdce5b2348ddac2778cb`;
- implementation: `5587a0d4703c8b22b159ffe4d5a41914247bc354`;
- verification evidence: `5137065e8b5bc6f38935141b76bfef8eced939fa`;
- branch: `codex/epic-23-apartment-room-facets`;
- changed product surface: public catch-all query forwarding, shared route
  resolution, room facet canonical decisions and focused verifier;
- unchanged surfaces: Payload schema/access/migrations, feeds, auth,
  dependencies, secrets and production.
