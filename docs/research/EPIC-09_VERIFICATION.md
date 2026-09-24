# EPIC-09 verification — property taxonomy

Status: PASS — ready for delivery gate
Date: 2026-09-24
Exact implementation head: `84557708f16433d82f0f39bf24dd918058eedb6c`

## Acceptance matrix

| Requirement | Evidence | Verdict |
|---|---|---|
| One `properties` collection; R1 `apartment`, `house`, `land` | `Properties.ts`, generated `payload-types.ts`, `verify:property-taxonomy` | PASS |
| Prepared-off `commercial`, `room`, `garage` | Payload category enum and `verify:property-taxonomy`; Public Gateway R1 query excludes them | PASS |
| House subtypes include `dacha` and `part_of_house` | Payload select and normalizer fixtures | PASS |
| Land fields | `plotAreaSotka`, `landCategory`, `permittedUse`, `communications` in collection and generated types | PASS |
| m²/sotka/hectare input conversion | Deterministic fixture: 600 m² = 6 sotka; 6 sotka = 6; 0.06 ha = 6 | PASS |
| Ambiguous land area | Missing/unknown unit produces no numeric value and `landAreaNeedsReview=true`; repository ORs it into `needsReview` | PASS |
| R1 public predicate | Shared Public Gateway policy requires `secondary + sale + apartment/house/land`; catalog, detail, sitemap and nearby-geo callers use it | PASS |
| Payload migration | Forward migration and snapshot generated with Payload 3.90.1; migration was not applied | PASS |

## Checks run

- `pnpm payload:generate:types` — PASS.
- `pnpm payload:migrate:create property-taxonomy -- --force-accept-warning` —
  PASS; generated only files in `migrations/`.
- `pnpm verify:property-taxonomy` — PASS.
- `pnpm verify:feed-parser`, `pnpm verify:feed-ingest` and
  `pnpm verify:manual-ownership` — PASS.
- `pnpm verify:public-gateway` — PASS.
- `pnpm typecheck` — PASS.
- Scoped Biome lint for all edited non-generated sources — PASS.
- Exact branch diff whitespace check — PASS.

## Payload migration contract

Installed versions: Payload and `@payloadcms/db-postgres` `3.90.1`.

The official [Payload migrations documentation](https://payloadcms.com/docs/database/migrations)
states that the Postgres migration creation command produces the SQL migration
from the changed configuration without applying it. This branch follows that
contract. No local, staging or production database was connected or mutated.

## Known limitations

- A local PostgreSQL instance is not configured for this worktree. The
  DB-dependent `verify:schema` and integration suites were therefore not run;
  running them against the managed production database would be an unauthorized
  write. Their staging rehearsal belongs to the approved release workflow.
- Full `pnpm lint` still reports pre-existing diagnostics in historical
  generated migrations, generated Payload types and starter CSS. The changed
  source set passes scoped lint.
