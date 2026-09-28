# DC10-OPS-00 — Persistent staging retirement verification

Status: `PASS — staging retired; production preserved`

Observed at: 2026-09-28 (Europe/Moscow)

Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13 `APPROVED`

## Owner authorization and boundary

The owner explicitly authorized complete retirement of the persistent staging
contour. The authorized targets were the staging runtime and runtime artifacts,
its separate logical database, its storage bucket and Secret Master
`/staging`. Production, DNS, the shared managed database cluster and shared S3
access identity were outside the deletion boundary.

No secret value, infrastructure address, database name, access key, PII or full
connection URL is recorded in this evidence.

## Exact preconditions

- Server inventory matched exactly one production container and one staging
  container, each with a distinct Compose project and working directory.
- Timeweb inventory matched one shared managed PostgreSQL cluster containing
  exactly one production and one distinct staging logical database.
- Timeweb storage matched distinct production and staging buckets. The staging
  bucket contained zero objects.
- The S3 access identity was shared, so it was explicitly preserved.
- Secret Master contained separate `/production` and `/staging` folders.

## Authorized retirement result

| Surface | Result |
|---|---|
| staging container / Compose resources | removed |
| staging runtime directory | removed |
| staging-only immutable image | removed after zero remaining users |
| staging logical database | removed; shared cluster preserved |
| staging S3 bucket | removed; production bucket and shared key preserved |
| Secret Master `/staging` | 26 entries and folder removed |
| production resources | preserved |

## Post-retirement proof

| Criterion | Redacted result | Verdict |
|---|---|---|
| runtime topology | one running application container; staging name and directory absent | PASS |
| persistent database topology | one cluster and one logical database; production identity matches | PASS |
| storage topology | one bucket; production identity matches | PASS |
| Secret Master | `/staging` absent; `/production` contains the same 19 entries | PASS |
| jobs ownership | exactly one `JOBS_AUTORUN=true` owner, production | PASS |
| backup execution | timer enabled/active; latest service result `success`, exit status `0` | PASS |
| authenticated health | HTTP `200`, overall/app/database/storage/jobs `ok`, zero alerts | PASS |
| public availability | homepage, `robots.txt` and sitemap HTTP `200`; root crawl allowed | PASS |

The existing isolated database restore/migration rehearsal and current sampled
media checksum restore remain the recovery evidence. The daily backup process
creates and validates a custom-format database dump, checks the offsite copy and
tests a representative media copy without changing the production object.

## Delivery boundary

This operation did not deploy a new application artifact, change DNS, run a
production migration or authorize `DC11-PROD-FINAL`. Production remains the
mandatory final stage after a separate explicit owner release command. No
monitoring, observation, reconciliation or follow-up task is created after it.
