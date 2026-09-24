# RP-03 verification

Status: PASS for the RP-03 acceptance contract.

## Acceptance matrix

| Criterion | Verdict | Evidence |
|---|---|---|
| Typed Site Profile is the single owner of geo mode, category/market activation, thresholds, inventory gates and facet whitelist | PASS | Portable generic contract lives in `src/platform/profile/types.ts`; exact DON CITY values live once in `src/project/site.profile.ts` using `as const satisfies SiteProfile`. |
| Profile validation tests pass | PASS | `verify:site-profile` validates the canonical profile and rejects an invalid geo slug. |
| `kvartiry=PREPARED_OFF` yields `404` without product-code edits | PASS | Portable selector returns `404`; the existing apartment route calls the selector in both metadata and page execution before data access. |
| Disabled apartments disappear from sitemap/menu/linking projections | PASS | The same portable active-link selector returns an empty projection for all three surfaces in the test profile. Current merged product publishes no apartment link in those surfaces, so no disabled URL leaks. |
| Nearby geo default is profile-owned | PASS | An unconfigured nearby geo resolves to `NOINDEX_AUTO`; SINGLE_GEO keeps the switcher hidden. |
| Platform/Project direction remains valid | PASS | Dependency Cruiser reports zero violations across 388 modules and 1,116 dependencies; Platform contains no project literals/imports. |

## Checks

- `pnpm verify:site-profile` — PASS.
- `pnpm quality:architecture` — PASS.
- `pnpm typecheck` — PASS.
- `pnpm lint` — PASS with 20 pre-existing warnings outside RP-03.
- `pnpm verify:schema` — PASS after all Payload migrations on isolated native
  PostgreSQL 18 database `don_city_rp03_test`.
- `git diff --check` — PASS.

Canonical V4 URL grammar, full catch-all resolver and final navigation IA remain
owned by RP-04, RP-06 and RP-09. RP-03 supplies the typed policy those epics
must consume; it does not pre-implement their routes.

No production, DNS, server, secret or production database mutation occurred.
