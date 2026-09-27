# CORE 5.5 CP-04 verification

Status: PASS
Date: 2026-09-27
Plan: `AMS-DON-CITY-CORE55-POSTPROD v9 APPROVED`
Task: `dc55-task-71-verify`
Branch: `codex/dc55-epic-71`
Verified implementation head: `be052be7a307e6812cd5494878e70cb70813fb81`
Base: `1af2f8e34509e3cd0a76653546f23998d889b7c6`

## Acceptance verdicts

| Acceptance surface | Verdict | Evidence |
|---|---|---|
| responsive/format strategy | PASS | Payload creates 320/640/1280 WebP variants at quality 82 without enlargement; original remains available |
| safe public media contract | PASS | explicit Public Gateway select and contract `1.5.0` expose only URL, dimensions and safe variant metadata used by native `srcset` |
| cache identity | PASS | immutable one-year policy is limited to UUID-versioned original/variant filenames |
| existing-media backfill | PASS | explicit isolated DB and ephemeral loopback S3 proof covered dry-run, three-variant apply, idempotent rerun and manifest rollback |
| rollback safety | PASS | only manifest-created variants were deleted; prior metadata and original object were preserved |
| request-path duplication | PASS | proxy uses lifecycle/canonical-only lookup; page retains the single full property DTO lookup |
| brand assets | PASS | approved originals preserved; 88×88 header and 320×400 footer WebP derivatives are used |
| schema | PASS | all migrations applied to `don_city_cp04_test`; `verify:schema` passed |
| request performance | PASS | 25-sample before/after p50/p95 recorded; property p95 improved `41.39 → 28.49 ms` |
| mobile budget | PASS | explicit 390×844 mobile/touch, CPU×4, Slow 4G traces: max LCP `1,401 ms`, max CLS `0.00` |

## Commands and runtime proof

- `pnpm payload:migrate` — PASS on native PostgreSQL `18.6`, loopback-only
  `127.0.0.1:5432/don_city_cp04_test`, non-superuser project owner.
- `pnpm verify:schema` — PASS.
- `pnpm verify:responsive-media` — PASS.
- `pnpm verify:responsive-media:integration` — PASS; representative managed
  image, three variants, idempotent rerun, rollback and original preservation.
- `pnpm verify:public-gateway` — PASS.
- `pnpm verify:contracts-dto` — PASS.
- `pnpm verify:property-card-system` — PASS.
- `pnpm verify:property-detail-routes` — PASS.
- `pnpm verify:property-lifecycle-routes` — PASS.
- `pnpm verify:cache-targets` — PASS.
- `pnpm verify:security-boundaries` — PASS.
- `pnpm quality:architecture` — PASS, 508 modules / 1,639 dependencies.
- `pnpm typecheck` — PASS.
- `pnpm lint` — exit `0`; 28 pre-existing warnings and 2 infos.
- `pnpm build` — PASS on the candidate and exact base comparison worktree.

## Performance evidence

Warm HTTP measurements use the same isolated database and 60-property project
fixture. Values are milliseconds; each percentile is from 25 sequential samples.

| Route | Base p50 / p95 | Candidate p50 / p95 |
|---|---:|---:|
| home | `7.65 / 15.81` | `8.69 / 18.74` |
| catalog | `18.30 / 26.75` | `18.20 / 25.61` |
| property | `33.09 / 41.39` | `22.13 / 28.49` |

Mobile traces used CPU×4 and Slow 4G:

| Route | LCP | Breakdown | CLS |
|---|---:|---|---:|
| home | `1,140 ms` | TTFB `10`; render delay `1,131` | `0.00` |
| catalog | `1,086 ms` | TTFB `27`; render delay `1,059` | `0.00` |
| property | `1,401 ms` | TTFB `37`; load delay `592`; load `581`; render delay `191` | `0.00` |

The home p95 moved by `+2.93 ms` but remains low in absolute terms and its data
owner was not changed. The affected property route improved by `31.2%` at p95.

## Boundaries

- Production, DNS, public indexing, real feed and real Timeweb S3 were untouched.
- Secret Master still returns `403`; no secret value was printed or persisted.
- Local S3 emulation is intentionally limited to the version-pinned
  PUT/GET/HEAD/DELETE surface used by this backfill.
- Global noindex remained active. The local Lighthouse SEO score therefore does
  not represent CP-04 performance failure.

Result: CP-04 acceptance from §33D is proven for VERIFY. Delivery still requires
the epic evidence checkpoint, full diff review and one exact-head RISKY
SourceCraft gate before merge.
