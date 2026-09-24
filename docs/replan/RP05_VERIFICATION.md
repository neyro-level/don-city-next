# RP-05 Verification Evidence

Date: 2026-09-24  
Implementation head: `03d624a1fde3a0599d1a3526dfb891ec0f481eb9`  
Platform: PostgreSQL `18.6`, Payload `3.90.1`, Next.js `16.3.5`

## Acceptance proof

- `regions`, `cities` and `districts` are Payload-owned collections.
- City grammar, region short name, publication state, `agglomerationOf` and
  `ownerVerified=false` are represented in schema and seed data.
- District identity is enforced by the Payload compound unique index
  `(city, slug)` and by a validation hook.
- City slugs are checked against reserved roots. District slugs are checked
  against category and facet slugs.
- Feed matching resolves a district only inside the resolved city. Unknown
  source text remains in `districtRaw`, the relation remains empty, and
  `needsReview=true`; listing data is not discarded.
- The Donetsk seed is idempotent. Two consecutive runs leave 10 districts.
- `tekstilshchik` remains a microdistrict with `parent=null`.

## PostgreSQL migration proof

Two isolated local PostgreSQL 18.6 databases were created from the pre-RP-05
migration state.

### Empty database

1. Applied both RP-05 migrations.
2. Ran the geo seed twice.
3. Passed schema and Payload runtime checks.
4. Confirmed 10 districts and one `tekstilshchik` row with `parent_id IS NULL`.
5. Rolled both migrations down successfully.
6. Confirmed the legacy `region`, `locality`, `district` columns were restored
   and geo tables were removed.

### Representative non-empty database

1. Inserted one legacy property with non-empty region, locality and unknown
   district text.
2. Applied both RP-05 migrations.
3. Confirmed exact values in `region_raw`, `city_raw`, `district_raw`.
4. Ran the geo seed twice and passed schema/runtime checks.
5. Rolled both migrations down.
6. Confirmed the exact legacy values were restored in `region`, `locality`,
   `district`.

## Checks

| Check | Result |
|---|---|
| `pnpm verify:geo-model` | PASS |
| `pnpm verify:geo-runtime` | PASS |
| `pnpm verify:schema` | PASS |
| `pnpm verify:feed-ingest` | PASS |
| `pnpm verify:public-gateway` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm quality:architecture` | PASS — 403 modules, 1193 dependencies |
| `pnpm build` | PASS |

## Repository-wide limitations outside RP-05

- The complete local `verify:merge-risky` sequence reaches the pre-existing
  `verify:owner-operations` check and stops because `docs/PROJECT.md` is absent.
  All preceding checks, including RP-05 checks, pass.
- `quality:guards` passes architecture, URL, local API, design-token and module
  governance checks, then stops at the separately tracked SourceCraft policy
  limitation `dcn-4ic0`.

Neither limitation changes RP-05 schema, migration, seed or feed-matching
acceptance. They remain explicit inputs to delivery review; no production,
DNS, server or secret mutation was performed.

## Traceability

| Contract | Implementation evidence |
|---|---|
| Geo entities and publication state | `src/project/collections/Regions.ts`, `Cities.ts`, `Districts.ts` |
| Property relations plus raw preservation | `src/project/collections/Properties.ts`, migration `20260924_103933` |
| `(city, slug)` uniqueness | District collection compound index, migration `20260924_104718`, `verify:schema` |
| Reserved/category/facet collisions | `src/project/geo/constraints.ts`, `verify:geo-model`, `verify:geo-runtime` |
| City-scoped feed matching | `src/project/geo/feed-match.ts`, Payload feed repository, runtime verification |
| Donetsk and district seed | `scripts/seed-geo.ts`, `DISTRICT_REGISTRY_SEED.csv` |
| WIP reuse decision | `docs/replan/RP05_PREFLIGHT.md` |

Task Manager stages: `dcv4-task-58-preflight`,
`dcv4-task-58-implement`, `dcv4-task-58-verify`,
`dcv4-task-58-evidence`, `dcv4-task-58-delivery`.
