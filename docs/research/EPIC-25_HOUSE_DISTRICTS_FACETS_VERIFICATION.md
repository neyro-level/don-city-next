# EPIC-25 — HOUSE DISTRICTS / FACETS VERIFICATION

## Verified head

Implementation head: `eca9206c04256902139bd05adfe7dee94b176b54`.

## Acceptance matrix

| Acceptance | Evidence | Verdict |
|---|---|---|
| Three P2 district candidates are exact | Kуйбышевский, Будённовский and Кировский resolve with broad 70/68/67, `wordstat_v1` and threshold 5. | PASS |
| Six remaining administrative districts are TEST | Ворошиловский, Калининский, Киевский, Ленинский, Петровский and Пролетарский have blank broad, `fallback_no_wordstat` and threshold 10. | PASS |
| Every house district owns its catalog query | All nine paths resolve to `category=house`, `geoSlug=donetsk` and their exact `districtSlug`. | PASS |
| District candidates obey Content Gate | Without evidence every path is `200 noindex,follow`; threshold/content evidence changes the same route to `index,follow`. | PASS |
| Dacha facet is the approved TEST owner | `/donetsk/doma/dachi/` has blank broad, fallback source, threshold 10 and maps to `houseType=dacha`. | PASS |
| Dacha activation obeys Content Gate | Gate-off remains `noindex`; passing evidence permits `index` without changing canonical ownership. | PASS |
| Apartment-only microdistrict is not reused | `/donetsk/doma/tekstilshchik/` returns 404; unknown house district/facet paths also return 404. | PASS |
| Existing house and shared route contracts remain stable | EPIC-24 verifier and RP-06 resolver matrix pass after the new mapping. | PASS |

## Checks

- `pnpm verify:house-districts-facets` — PASS.
- `pnpm verify:house-geo-page` — PASS.
- `pnpm verify:route-resolver` — PASS.
- `pnpm verify:seo-content-gate` — PASS.
- `pnpm verify:seo-contracts` — PASS: 40 SEO rows, 10 district rows and 50 Wordstat owners.
- `pnpm verify:navigation` — PASS: 13 canonical targets.
- `pnpm verify:public-gateway` — PASS.
- `pnpm typecheck` — PASS.
- `pnpm quality:architecture` — PASS: 464 modules and 1408 dependencies, no violations.
- Scoped Biome and `git diff --check` — PASS.

## Scope and residuals

No schema, migration, auth, Payload access, dependency, seed, secret or
production change was made. Real inventory/content activation and its evidence
loader remain owned by EPIC-38; until then all candidates safely stay noindex.

Deviations: none. Discovered work: none.

## Traceability

- canonical base after EPIC-24: `7a5a8f77b61dee0e07ea131433ba09c58216fc7b`;
- preflight: `f9948fd73b6cd9c02e11a317d079498283c41b40`;
- implementation: `eca9206c04256902139bd05adfe7dee94b176b54`;
- verification evidence: `4d8736041fb361f9d3fbf7d4d6de2bf007f54098`;
- branch: `codex/epic-25-house-districts-facets`;
- changed product surface: typed dacha path query ownership and focused
  district/facet verifier;
- unchanged surfaces: registry/seed, Payload schema/access/migrations, auth,
  dependencies, secrets, inventory activation and production.
