# DC10-OPS-00 — Pre-release operational and access preflight

Status: `BLOCKED_FOR_IMPLEMENTATION`

Observed at: 2026-09-28 (Europe/Moscow)

Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13 `APPROVED`

Mode: read-only infrastructure and external availability inspection. No
production, DNS, database, Secret Master or server mutation was performed.

## Task contract

- Outcome: prove backup/restore, one jobs owner, health/availability and
  Secret Master access before the final release, with exactly one persistent
  production database and no post-production monitoring task.
- Data boundary: Payload remains the only schema/migration owner. Production
  data, PII, credential values, full database URLs and infrastructure
  addresses are excluded from evidence.
- Delivery: `CRITICAL`, `RISKY`, `MERGE_AFTER_GATE`.
- Stop boundary: removing a database, runtime, storage identity or Secret
  Master path is destructive production/infrastructure mutation and requires
  a separate explicit owner command.

## Redacted observed baseline

| Criterion | Read-only evidence | Verdict |
|---|---|---|
| Canonical access | The dedicated `codex-cursor-ai` credential listed the canonical `DonCity Server` project and names in `/` and `/production`; values were not emitted. | PASS |
| Server identity | The Timeweb API matched exactly one configured DON CITY server in the `on` state; dedicated SSH authenticated as the documented deploy role and returned the expected host identity. | PASS |
| Provider database topology | Timeweb returned one started PostgreSQL 18 cluster with automatic backups enabled. No replica was observed. | PASS at cluster level |
| Jobs ownership | Two application containers are running. Production has `JOBS_AUTORUN=true`; staging has `JOBS_AUTORUN=false`. The count of live jobs owners is exactly one. | PASS |
| Authenticated production health | HTTP `200`, overall `ok`; application, database, storage and jobs components are `ok`; no operational alert codes were returned. | PASS |
| Backup freshness | The mounted redacted health snapshot reports recent successful DB and media copies, integrity checks and offsite presence within a 36-hour SLA. | PASS |
| Backup execution | `doncity-backup.timer` is enabled and waiting on a daily schedule. The service creates a custom-format PostgreSQL dump, validates it with `pg_restore --list`, uploads and size-checks the offsite copy, then copies, downloads and checksum-compares a representative media object. | PASS |
| Restore evidence | Historical isolated database restore/migration proof remains recorded. Current media recovery is sampled by checksum without changing the production object. | PASS |
| External availability | Canonical HTTPS, `robots.txt` and `sitemap.xml` returned HTTP `200`; robots permits crawling; the certificate matches the domain and was valid with 88 days remaining at inspection time. | PASS |
| Final-stage boundary | The graph has no task after `DC11-PROD-FINAL`; no monitor, observation or follow-up automation was created. | PASS |

## Blocking topology drift

The same read-only server inspection found a running staging container. Its
database endpoint resolves to the same Timeweb cluster as production but its
logical database identity is different. Its S3 bucket and prefix are also
different. Secret Master still contains a `/staging` path.

This is a persistent staging contour, not a disposable bounded proof, and it
contradicts the approved v13 rule that the project has exactly one persistent
production database and no persistent staging/shadow/mirror application
database. Active Source of Truth currently claims that no persistent staging
database exists, so those statements must not be treated as factual until the
contour is retired and rechecked.

## Required resolution before implementation can pass

Under a separate explicit owner authorization:

1. Capture a redacted final staging identity/inventory needed for safe target
   confirmation; do not copy production data into staging.
2. Stop and remove the staging runtime and its Compose/runtime artifacts.
3. Delete only the confirmed staging logical database and staging storage
   identity after validating that neither is the production target.
4. Remove the obsolete Secret Master `/staging` entries after resource
   deletion; keep `/production` and server access intact.
5. Re-run Timeweb, SSH, jobs-owner, authenticated health, backup and external
   availability proof, then reconcile `PROJECT.md`, `03_ARCHITECTURE.md`,
   `OPERATIONS.md`, `DELIVERY_STATE.yaml` and `05_RELEASE_CHECKLIST.md`.

No production release is authorized by this preflight. The final production
stage remains last and must not create later monitoring work.
