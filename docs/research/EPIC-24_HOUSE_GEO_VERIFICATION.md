# EPIC-24 — HOUSE GEO CATALOG VERIFICATION

## Verified head

Implementation head: `011af4c71411d669b31da6adbe96ff4d33fc3d13`.

## Acceptance matrix

| Acceptance | Evidence | Verdict |
|---|---|---|
| House root keeps its exact contract | `/doma/` resolves from `HOUSE_ROOT` with exact title, description and H1, self-canonical URL, `200` and `noindex,follow`. | PASS |
| Donetsk house catalog keeps its exact contract | `/donetsk/doma/` resolves from `HOUSE_GEO`, remains indexable and owns the `house + donetsk` Public Gateway query. | PASS |
| Every approved house subtype is bounded | `house`, `cottage`, `townhouse`, `dacha` and `part_of_house` are the only accepted values shared by route normalization and catalog validation. | PASS |
| Query variants remain non-indexable | A valid subtype query filters the catalog while retaining the base canonical and forcing `noindex,follow`; unknown or repeated values do not become filters. | PASS |
| Unknown or cross-category subtype input is denied | The catalog schema rejects values outside the allowlist and rejects `houseType` unless `category=house`; the route does not forward invalid values. | PASS |
| Public Gateway applies the subtype safely | Payload filtering uses an exact `houseType equals` predicate under the existing publication/access policy; no raw document or arbitrary field reaches the public boundary. | PASS |
| Facet DTO exposes only approved subtype values | Aggregate rows are parsed through the same allowlist and mapped to labeled `buildingTypes` in the existing portable filter DTO. | PASS |
| EPIC-25 activation remains isolated | `/donetsk/doma/dachi/` remains a registry-owned `200 noindex,follow` candidate; EPIC-24 does not activate its Content Gate path. | PASS |

## Checks

- `pnpm verify:house-geo-page` — PASS.
- `pnpm verify:public-gateway` and `pnpm verify:gateway-context` — PASS.
- `pnpm verify:route-resolver` — PASS.
- `pnpm verify:seo-contracts` — PASS: 40 SEO rows, 10 district rows and 50 Wordstat owners.
- `pnpm verify:seo-content-gate` — PASS.
- `pnpm verify:property-taxonomy` — PASS.
- `pnpm verify:apartment-room-facets` — PASS.
- `pnpm typecheck` — PASS.
- `pnpm quality:architecture` — PASS: 463 modules and 1405 dependencies, no violations.
- Scoped Biome and `git diff --check` — PASS.

## Scope and residuals

No Payload schema, migration, auth, access, dependency, secret or production
change was made. No database-dependent proof is required: existing taxonomy is
already covered by its verifier, while this epic changes only the typed public
query, exact Payload predicate, aggregate projection and DTO mapping. Inventory
and Content Gate activation remain owned by EPIC-38 and EPIC-25 respectively.

Deviations: none. Discovered work: none.

## Traceability

- canonical base after EPIC-23: `e20742e8ccd6432c2380c18a537a1e1cc43e8e52`;
- refreshed preflight: `6084996b681a0c49fade21ff8234c9bce67051f8`;
- implementation: `011af4c71411d669b31da6adbe96ff4d33fc3d13`;
- verification evidence: `2b5232d5a01cf91952c92c297084a5604a145e11`;
- branch: `codex/epic-24-house-geo`;
- changed product surface: typed route query, Public Gateway validation and
  Payload predicate, aggregate house subtype facets, filter DTO labels and
  focused verifier;
- unchanged surfaces: Payload schema/access/migrations, auth, dependencies,
  secrets, `dachi` activation and production.
