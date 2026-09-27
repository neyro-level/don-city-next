# CORE 5.5 CP-04 implementation evidence

Status: `IMPLEMENTATION_ACCEPTANCE_PASS`

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
- `pnpm verify:responsive-media:integration` — PASS against the isolated DB and
  an ephemeral loopback S3-compatible contour: representative managed image,
  legacy metadata simulation, dry-run discovery, three-variant apply,
  idempotent rerun, rollback, exact variant cleanup and original preservation.
- The integration proof exposed and fixed an implementation defect: Payload S3
  does not populate the legacy `_objectKey` field. Backfill now derives the
  object key from the configured collection prefix, document prefix and factual
  filename according to the pinned storage adapter contract.

## Request-path comparison

Both exact trees were built as local production artifacts and exercised against
the same PostgreSQL 18 database and the same 60-property project fixture. Each
warm figure is the nearest-rank percentile from 25 sequential HTTP samples.

| Route | Base `1af2f8e` p50 / p95 | Candidate p50 / p95 | Result |
|---|---:|---:|---|
| home | `7.65 / 15.81 ms` | `8.69 / 18.74 ms` | `+2.93 ms` p95; low absolute value, no home request-path owner changed |
| catalog | `18.30 / 26.75 ms` | `18.20 / 25.61 ms` | `-4.3%` p95 |
| property | `33.09 / 41.39 ms` | `22.13 / 28.49 ms` | `-31.2%` p95 after removing the duplicate full property lookup |

Cold first-request samples were `569.19 ms` home, `395.76 ms` catalog and
`60.97 ms` property for the candidate. The base samples were `563.84 ms`,
`689.40 ms` and `114.42 ms` respectively. These one-shot cold values are
recorded as observations, not statistical percentiles.

## Mobile performance proof

Chrome DevTools traces used an explicit `390x844`, device scale `3`, mobile/touch
viewport, CPU throttling `4x` and `Slow 4G`. Lighthouse navigation reports and
raw traces are retained in ignored local `artifacts/lighthouse-cp04/`; the durable
summary is:

| Route | LCP | LCP subparts | CLS | Budget |
|---|---:|---|---:|---|
| home | `1,140 ms` | TTFB `10 ms`; render delay `1,131 ms` | `0.00` | PASS |
| catalog | `1,086 ms` | TTFB `27 ms`; render delay `1,059 ms` | `0.00` | PASS |
| property | `1,401 ms` | TTFB `37 ms`; load delay `592 ms`; load `581 ms`; render delay `191 ms` | `0.00` | PASS |

All three routes pass `LCP <= 2.5s` and `CLS <= 0.1`. Lighthouse navigation also
reported accessibility `0.99 / 1.00 / 1.00` and best practices `1.00` for home,
catalog and property. The lower local SEO score reflects the intentionally
preserved global noindex policy and is outside CP-04.

## Evidence boundary

The Secret Master credential still returns `403`, but database and media-backfill
proofs no longer depend on it: they use Windows-native PostgreSQL 18 and an
ephemeral loopback S3-compatible contour. No secret value was printed or
persisted, and real Timeweb S3 remains forbidden for this implementation task.
The local S3 server intentionally implements only the PUT/GET/HEAD/DELETE surface
used by this version-pinned backfill contract; Timeweb provider compatibility is
already owned by the delivered storage adapter activation and is not re-tested
with real credentials here. Production, public indexing, feed, DNS and real S3
were not touched.
