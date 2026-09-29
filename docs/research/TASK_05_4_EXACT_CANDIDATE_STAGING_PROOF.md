# TASK-05.4 — Exact Candidate Staging Proof

Status: PASS

Observed: 2026-09-29

Candidate: `145b58b0ef436f8c0871647cf4c8d19d646a2403`

## Isolation

- Runtime and HTTP proxy were bound only to loopback ports `3105` and `3106`.
- Database was the dedicated disposable local PostgreSQL 18 database
  `don_city_epic05_staging_test`; production and the normal development database
  were not used.
- Only synthetic integration fixtures were used. Production data, PII,
  production secrets and production storage were absent.
- `JOBS_AUTORUN=false`; media fallback used a disposable local directory.
- A temporary loopback proxy enforced `X-Robots-Tag: noindex, nofollow` and a
  `robots.txt` with `Disallow: /`.

## Evidence Matrix

| Required proof | Result | Evidence |
|---|---|---|
| clean migrations / representative schema | PASS | `verify:merge-risky` created/reset the isolated database and applied Payload migrations from zero |
| migration failure/rollback safety | PASS | integration suites proved numeric, auth, relation, retention and geo migration rejection/rollback cases before clean re-application |
| import atomic crash behavior | PASS | required integration/feed lifecycle suites passed against the disposable database |
| lead outbox transaction | PASS | lead intake/outbox/delivery integration suites passed with fixture-only destinations |
| retention backfill | PASS | lead retention boundary and lifecycle migration suites passed |
| access matrix | PASS | public/system/ingest gateway, auth/security and transport boundary suites passed |
| jobs ownership | PASS | jobs configuration and recovery suites passed with autorun explicitly disabled |
| UI production-like build | PASS | Next.js 16 production build compiled, typechecked and generated all static routes |
| SEO HTTP matrix | PASS | 60 loopback requests, 42 registry pages, 10 sitemap URLs, noindex proxy/robots enforced, zero findings |

The empty isolated catalog intentionally exercised catalog routes in their
fail-closed 404 state. Positive catalog metadata and lifecycle cases remain
covered by focused route/SEO and temporary synthetic fixture suites. Yandex
Webmaster and field performance were outside this noindex structural proof.

## Cleanup

- Next.js and noindex proxy processes were stopped.
- `don_city_epic05_staging_test` was dropped after terminating only connections
  to that exact disposable database.
- PostgreSQL confirmed the database absent.
- Windows confirmed no listeners remained on ports `3105` or `3106`.
- Production, DNS, server, production database, Secret Master and S3 were not
  mutated.
