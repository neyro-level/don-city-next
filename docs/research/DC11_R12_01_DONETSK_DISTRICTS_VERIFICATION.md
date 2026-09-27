# DC11-R12-01 — verification evidence

- Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13 `APPROVED`
- Epic: `EPIC-108` / `DC10-R12-01`
- Verified implementation head: `ffeff53312c4d634dc1d9d5deade6854c7d8884e`
- Scope: local code, disposable PostgreSQL 18 database and SourceCraft branch only
- Production, DNS, persistent external storage and secrets: unchanged

## Observed result

| Contract | Result | Evidence |
| --- | --- | --- |
| Donetsk district inventory | PASS | Exactly 10 canonical rows: nine `administrative_district` rows and one `microdistrict` row for Textilshchik; `(citySlug, slug)` identities are unique. |
| Canonical forms | PASS | Every row has explicit preposition, locative and genitive forms plus at least three normalized feed aliases. No runtime inflection is used. |
| Payload persistence | PASS | Additive migration `20260928_233000_district_canonical_forms` passes up, repeated up, down and second up. It backfills 10 genitive forms and 30 aliases only for Donetsk. |
| Seed idempotence | PASS | Full Payload migrations followed by two geo seed runs preserve 10 district identities, nine administrative identities and 30 aliases. |
| Feed mapping | PASS | Exact names, slugs, locative forms and stored aliases resolve inside the matched city; the same slug in another city is not modified; an unknown value stays unresolved with `needsReview=true`. |
| Landing behavior | PASS | Apartment and house district route suites cover every canonical district. Apartment landing checks prove indexable threshold pass, 30-day grace with non-zero inventory, and immediate `noindex` at zero inventory. |
| Architecture | PASS | Payload remains the only schema owner. `districts_synonyms` is the generated child table of the existing `districts` collection, not a second database or geo owner. Dependency analysis reports zero violations. |

## Checks run

- `pnpm typecheck`
- `pnpm lint` — exit 0; only pre-existing repository warnings
- `pnpm verify:geo-model`
- `pnpm verify:seo-contracts`
- `pnpm quality:guards`
- changed-path Biome lint and `git diff --check`
- Dependency Cruiser: 507 modules, 1577 dependencies, zero violations
- PostgreSQL migration proof: up / repeat / down / up
- full Payload migration, seed-twice and geo runtime proof on a disposable local database
- full integration suite including the canonical-form migration proof

The disposable databases were removed by the test cleanup. No production proof is claimed by this document.

## DOC IMPACT

This evidence document is additive. The approved master plan and active product/architecture contracts require no semantic correction for this epic.
