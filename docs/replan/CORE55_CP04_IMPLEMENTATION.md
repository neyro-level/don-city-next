# CORE 5.5 CP-04 implementation evidence

Status: `CODE_COMPLETE_PARTIAL_ISOLATED_PROOF`

## Boundary

- Plan: `AMS-DON-CITY-CORE55-POSTPROD v9 APPROVED`.
- Epic: `EPIC-71 / CP-04 — MEDIA AND REQUEST-PATH PERFORMANCE`.
- Branch: `codex/dc55-epic-71` from
  `1af2f8e34509e3cd0a76653546f23998d889b7c6` (`origin/main`).
- Delivery profile: `CRITICAL`; schema/media backfill remains `RISKY`.
- No production, public indexing, real feed, real S3, secret or DNS mutation was
  performed.

## Implemented

1. Payload is the single responsive-image owner: managed image uploads generate
   `320`, `640` and `1280` WebP variants at quality `82`, never enlarge a source,
   retain the original and use deterministic UUID-derived names.
2. Public contract `1.5.0` adds optional safe variant metadata. Public Gateway
   selects only filename, intrinsic dimensions and generated sizes; native
   project UI converts them into `srcset`. External URLs remain unchanged.
3. UUID-versioned original and variant URLs receive one-year immutable cache
   control. Legacy/unversioned filenames do not.
4. Property proxy resolution now uses a lifecycle/canonical-only read. The full
   property, related catalog, geo and media DTO remain page-owned and are not
   fetched by the proxy.
5. Approved brand originals remain untouched. New exact-size WebP derivatives
   are `88x88` for the header mark and `320x400` for the footer logo.
6. Additive media-size migration and current schema snapshot were generated
   offline. A second `migrate:create --skip-empty` produced no drift.
7. `payload:media:backfill` is dry-run by default. Apply and rollback require an
   explicit `staging` or `test` environment, matching non-production S3 prefix,
   exact target confirmation and a per-run manifest. Originals are read-only;
   rollback restores prior size metadata and deletes only objects recorded as
   created by that run.

## Local proof

- `pnpm verify:responsive-media` — PASS.
- `pnpm verify:public-gateway` — PASS.
- `pnpm verify:contracts-dto` — PASS.
- `pnpm verify:property-card-system` — PASS.
- `pnpm verify:property-detail-routes` — PASS.
- `pnpm verify:property-lifecycle-routes` — PASS.
- `pnpm verify:cache-targets` — PASS.
- `pnpm verify:security-boundaries` — PASS.
- `pnpm quality:architecture` — PASS.
- `pnpm quality:guards` — PASS.
- `pnpm contracts:check` — PASS, frozen public contract `1.5.0`.
- `pnpm typecheck` — PASS.
- `pnpm lint` — PASS with pre-existing warnings only.
- Native PostgreSQL `18.6` identity — PASS on loopback-only
  `127.0.0.1:5432`; isolated database `don_city_cp04_test` is owned by the
  existing non-superuser DON CITY role.
- `pnpm payload:migrate` — PASS against the isolated database, including
  `20260927_000349_core55_responsive_media_sizes`.
- `pnpm verify:schema` — PASS against the migrated isolated database.
- `pnpm payload:media:backfill -- --environment=test` — PASS in default
  dry-run mode with no S3 credentials and no candidate mutations.
- Invalid backfill environment — correctly returns non-zero after replacing the
  Payload bin wrapper with the direct Node 24 TypeScript CLI entry.

## External proof still blocked

The Secret Master credential still returns `403`, but the isolated database
part of the blocker was removed through the existing Windows-native PostgreSQL
18 contour. No secret value was printed or persisted. The remaining proof needs
an isolated S3-compatible target with representative test media; real Timeweb
S3 remains forbidden for this implementation task. The following acceptance
evidence was not run:

- representative imported-media dry-run/apply/rerun/rollback;
- cold/warm request p50/p95 before and after;
- mobile Lighthouse traces for home, catalog and property, including LCP
  subparts and CLS sources.

The test database contains no representative media, so the successful dry-run
reported zero candidates. This is not sufficient for CP-04 acceptance. CP-04
stays blocked until the apply/idempotent-rerun/rollback and performance evidence
is complete; production and indexing remain outside this epic.

## Isolated continuation

Bind an isolated local/test S3-compatible target and a prefix containing `test`,
then seed representative managed media and run the default dry-run. Apply is
allowed only after the reported IDs and target identity are reviewed. The same
run manifest is required for rollback rehearsal. Performance traces are recorded
only after representative managed media has survived apply, idempotent rerun and
rollback.
