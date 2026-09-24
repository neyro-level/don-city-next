# EPIC-10 verification — public URL ID

Status: PASS — ready for evidence and delivery gate
Date: 2026-09-24
Implementation head: `0cc43b96369e637a96c567a9c9afd67ccd821230`

## Acceptance matrix

| Requirement | Evidence | Verdict |
|---|---|---|
| Stable numeric `publicUrlId` | `Properties.ts` adds an indexed unique number field. The `afterChange` hook derives it only from the generated Payload record ID and marks its own update context to avoid recursion. | PASS |
| Same external identity preserves ID | Feed upsert remains keyed by `feedSource + externalId`; the update payload has no `publicUrlId`, while the collection hook restores the original value on update. | PASS |
| Public lookup uses the explicit ID | `catalog.ts` queries `publicUrlId`, not `id`; lifecycle reads use the same field. Public records without the identity stay outside publication predicates. | PASS |
| Canonical semantic/category mismatch | `verify:public-url-id` and `verify:route-resolver` prove one 301 to the stored canonical URL; unknown IDs return 404. | PASS |
| Price forbidden | The typed property URL builder accepts only category, semantic and `publicUrlId`; it has no price input. The test fixes the canonical path independently of price. | PASS |
| Public URL consumers | DTO card hrefs, sitemap, lead canonicalisation and public property loading use `property.publicUrlId`; an explicit static assertion protects against returning to `property.id`. | PASS |
| Forward schema change | Payload 3.90.1 generated `20260924_144035_public_url_id`; it adds the nullable unique indexed column needed before create-hook assignment. It was not applied. | PASS |

## Checks run

- `pnpm verify:public-url-id` — PASS.
- `pnpm verify:route-resolver` — PASS.
- `pnpm verify:public-gateway` — PASS.
- `pnpm verify:feed-ingest` — PASS.
- `pnpm verify:manual-ownership` — PASS.
- `pnpm typecheck` — PASS.
- `pnpm quality:docs-sot` — PASS.
- Scoped Biome lint and exact diff whitespace check — PASS.

## Boundaries and limitations

- No local PostgreSQL is configured. `verify:schema` and the database-backed
  integration suite are not run, because running them against the managed
  database would be an unauthorized mutation.
- The generated migration has not been applied to local, staging or production
  data. Applying it, any historical backfill and live HTTP proof belong to the
  explicitly authorised staging/release workflow.
- Full `pnpm lint` remains a known baseline failure in historical generated
  migrations, generated Payload types and starter CSS. The EPIC-10 changed
  sources pass scoped lint.
