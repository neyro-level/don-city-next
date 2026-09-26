# EPIC-45 — live Timeweb staging verification

Date: 2026-09-25
Mode: authorized live staging; production forbidden and untouched

## Deployed contour

- Host: the existing DON CITY Timeweb server `doncity-home`; no second server
  was created.
- URL: `https://staging.doncity-home.ru`.
- Database: separate PostgreSQL 18 database with a dedicated staging-only
  application identity; exact resource names remain in Secret Master.
- Media: separate private Timeweb S3 bucket with a staging-only prefix; exact
  resource identity remains in Secret Master.
- Secrets: separate Secret Master scope `DonCity Server/prod/staging`; values
  were never written to Git or this report.
- Runtime: loopback-only application port `127.0.0.1:3100`,
  `JOBS_AUTORUN=false`, no external lead/feed allowlists.

The temporary production database password was rotated through the provider API
and the canonical Secret Master names were updated. Both production and staging
database identities passed an authenticated connection smoke; no production
schema or data operation was performed.

## Immutable candidate evidence

- Pre-gate live candidate commit: `9ad95e2fa9c4d84dc0bb2f1ce6467ac3fda3cd0d`.
- Docker image: `don-city-next:staging-9ad95e2`.
- Image ID: `sha256:58958bc64c06cddf97a5064ec49ab0cf2c7a467426d619f153680fac9818da93`.
- Compressed transfer checksum:
  `4d05f9161bf260e8b4b1c6e03320ffc124d170b8fae107d34ed019aa6baf586d`.
- The image was built outside the server. A temporary private staging-S3 object
  transported the artifact, server-side SHA-256 matched, and the transfer object
  was deleted afterwards.
- Payload applied the complete migration chain to `doncity_staging`; the second
  run reported no pending migration.

The final exact canonical-main SHA and SourceCraft RISKY run belong to the
delivery ledger after review/merge. Until then this is explicitly candidate
evidence, not a production release attestation.

## Live smoke

| Proof | Result |
| --- | --- |
| Container | `running`, restart count `0` |
| HTTPS / certificate | `200`, TLS verification result `0`, certificate valid through 2026-12-24, automatic renewal installed |
| HTTP policy | `301` to HTTPS, HSTS enabled |
| Indexing boundary | `X-Robots-Tag: noindex, nofollow`; `/robots.txt` returns `Disallow: /` |
| Admin/internal boundary | `/admin` and unauthenticated internal revalidation return `403` |
| Authenticated health | HTTP `200`; app/database/storage/jobs components all `ok` |
| Jobs ownership | `JOBS_AUTORUN=false`; staging is not a jobs owner |
| Active R1 registry routes | 15/15 returned final HTTP `200`; unexpected statuses `0` |
| Lead intake | synthetic `.test` lead accepted; identical retry returned `reused=true`; fixture then deleted |
| Production | no deploy, DNS cutover, migration, data write or runtime restart |

Health is intentionally `degraded` rather than falsely green because isolated
staging has jobs autorun disabled and no staging backup-status snapshots. Alert
codes were `jobs_autorun_disabled`, `backup_db_failure` and
`backup_media_failure`; dependency components remained `ok`.

## Owner decisions recorded

- Leads: retain 100 days.
- Archived property objects: retain 100 days.
- Future employee records: archive indefinitely; no automatic purge.
- External delivery: disabled until real destination hosts are supplied.
- Production: not authorized.

## Deferred evidence, not claimed

- Backup restore drill and backup freshness snapshots.
- Independent external uptime/alert delivery provider.
- Payload Admin media create/read/delete UI flow; S3 transport and authenticated
  health prove bucket connectivity, not the complete Admin UX.
- Full metadata/canonical crawl and representative performance traces; these are
  EPIC-46/47 scope.
- A previous known-good application image does not exist because this is the
  first staging rollout. First-rollout rollback is fail-closed deactivation of
  the staging Compose/Nginx site while retaining the isolated database/media.

These deferred items block production readiness but do not invalidate the
authorized isolated staging runtime.
