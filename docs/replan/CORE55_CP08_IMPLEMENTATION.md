# CP-08 implementation and verification

Date: 2026-09-27

Plan: `AMS-DON-CITY-CORE55-POSTPROD v9 APPROVED`

Status: `PASS — DELIVERY PENDING`

## Exact candidate

- integrated base: `01b3af8584bf79b2a3ab4efa507c42b40444a4ce`;
- application source: `c7926d044472fb718bdac9a7e1bd34c130bfb1b9`;
- branch: `codex/dc55-epic-75`;
- image tag: `don-city-next:staging-c7926d0`;
- local image ID: `sha256:ff3a07397127da02ac6878fe024c02b82580e06875d5810b7e62eec2dbfcdd74`;
- server image ID: `sha256:663965ef7926dd3846378ec2e6d77c3a87a6542dcd371dd776fcf2d21a8ec2a0`;
- compressed artifact SHA-256: `3bb0f945e7551ea791c6cf38d4f78c7a05abca34fdb661bb50d2b5081a2344e7`;
- compressed artifact size: `420079897` bytes.

The image was built once outside the server. Transport used a temporary object
in the isolated staging bucket; local/server checksums matched and every CP-08
transport object plus server incoming file was removed after load.

## Staging and database proof

- Dedicated SSH authenticated as the existing deploy role on `doncity-server`.
- Staging remained on loopback `127.0.0.1:3100`, separate PostgreSQL/S3 and
  `JOBS_AUTORUN=false`.
- Pre-run custom-format PostgreSQL snapshot SHA-256:
  `da4c9f87d8bfea3ab10e9cd86adddff9ed9db2844483ca86658e49513f424f72`.
- The snapshot catalog passed and an isolated local restore produced 31 public
  tables and 17 migration rows; the temporary restore database was removed.
- Live rehearsal exposed a missing additive `COMM_GEO` enum migration. The
  candidate now includes `20260927_103500_core55_listing_content_registry_ids`;
  local and staging migrations plus `verify:schema` pass.
- Geo seed ran twice and remained idempotent at 10 districts.

## Verification

| Surface | Result |
|---|---|
| Proofs A/D/E/F/G | PASS — `verify:integration:required` on isolated PostgreSQL 18 |
| Schema | PASS — migration plus `verify:schema` |
| Public-mode application behind edge noindex | PASS |
| External staging indexing boundary | PASS — one `X-Robots-Tag: noindex, nofollow`; deny-all `robots.txt` |
| Full SEO crawl | PASS — 42 registry pages, 57 requests, 9 sitemap URLs, zero findings |
| Four-month scope | PASS — secondary apartments/houses/land/commercial and `/yurist/`; newbuild/ЖК absent and 404 |
| Metadata / canonical / JSON-LD | PASS |
| Performance contract | PASS |
| Live p95, 10 samples each | `/` 0.279 s; `/donetsk/` 0.275 s; `/yurist/` 0.272 s |
| Health | HTTP 200; database/storage `ok`; jobs disabled |

The structural crawler was corrected to follow only shards advertised by the
live sitemap index and to treat an empty-catalog page 2 as the required
over-range 404. It does not invent property inventory or publish empty shards.

## Rollback and cleanup

The final candidate was rolled back to the retained production-baseline image,
returned HTTP 200, and the exact same `c7926d0` image was redeployed. Final
container state is running with zero restarts and staging jobs disabled.
Compose checkpoints and the pre-run database snapshot remain available; all
temporary S3 and incoming transport files were removed.

Authenticated staging health remains intentionally `degraded` only for
`jobs_autorun_disabled`, `backup_db_failure` and `backup_media_failure`.
These are expected on isolated staging and remain production prerequisites,
not application failures.

## Residual CP-09 gates

CP-08 does not claim production readiness. CP-09 still requires the first
production owner, independent alert/lead delivery, external uptime monitoring,
durable DB/media backup freshness, sampled media restore and final NAP proof.
Real feed activation remains out of scope. Public indexing has separate owner
authorization but must not be enabled until these gates and the exact-main
RISKY release evidence are green.
