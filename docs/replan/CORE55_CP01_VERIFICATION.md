# CORE 5.5 CP-01 — verification

Date: `2026-09-27`
Task: `dc55-task-67-verify`
Plan: `AMS-DON-CITY-CORE55-POSTPROD v9 APPROVED`
Branch: `codex/master-plan-core-5-5`
Entry head: `076e780d4cc62b751b0988ccb28578b3b91c949d`
Risk: `RISKY`

## Verdict

`PASS` for the CP-01 local/isolated verification surface.

The release-level `noindex` policy overrides every tested page/status policy in
both HTML metadata and `X-Robots-Tag`. Public mode removes only the global
override and preserves each page or lifecycle policy. The project remains
configured as `productionIndexing: "noindex"`; no production indexing action
was performed.

## HTTP matrix

`pnpm verify:indexing-policy` starts an ephemeral loopback HTTP server and
checks ten response families in both application modes:

| Family | Status | noindex mode | public mode |
|---|---:|---|---|
| home | 200 | meta + header `noindex,nofollow` | page policy preserved |
| geo hub | 200 | meta + header `noindex,nofollow` | page policy preserved |
| category | 200 | meta + header `noindex,nofollow` | page policy preserved |
| district | 200 | meta + header `noindex,nofollow` | page policy preserved |
| facet/query | 200 | meta + header `noindex,nofollow` | page `noindex,follow` preserved |
| property | 200 | meta + header `noindex,nofollow` | lifecycle policy preserved |
| static | 200 | meta + header `noindex,nofollow` | page policy preserved |
| legal | 200 | meta + header `noindex,nofollow` | page `noindex,follow` preserved |
| not found | 404 | meta + header `noindex,nofollow` | 404 meta policy preserved |
| gone | 410 | meta + header `noindex,nofollow` | lifecycle meta/header preserved |

Result: `CP-01 indexing HTTP matrix: PASS (20 cases)`.

The verifier also asserts the actual project wiring:

- `next.config.ts` derives the release header from the canonical project
  indexing policy and applies it to public responses;
- Payload Admin always receives `X-Robots-Tag: noindex, nofollow`;
- home, marketing and resolved public routes use the project-owned metadata
  composer rather than the platform mapper directly.

## Checks

- `pnpm verify:indexing-policy` — PASS, 20/20 HTTP cases.
- `pnpm verify:seo-contracts` — PASS, including 40 SEO registry rows.
- `pnpm typecheck` — PASS.
- `pnpm quality:architecture` — PASS, 497 modules and 1590 dependencies,
  zero violations.
- `pnpm lint` — PASS with zero errors; 28 existing warnings and two infos are
  outside CP-01 and were not modified.
- `git diff --check` — PASS.

## Environment and limits

- Local database: not used. Native PostgreSQL 18 was detected on loopback, but
  no project credential was guessed or created; CP-01 verification is
  data-independent.
- Docker/WSL: not touched.
- Production, staging, DNS, feeds, secrets and public indexing: not touched.
- Full real-runtime/staging crawl remains part of later exact-release proof;
  this task proves the deterministic application contract and its wiring.

The CP-01 evidence is sufficient to proceed to evidence packaging and the
epic's exact-head RISKY delivery gate. It does not authorize CP-09 or production.
