# DON CITY — Operations Contract

Status: active production, publicly crawlable
Updated: 2026-09-29

Delivered execution is governed by exact APPROVED plan
`DON-CITY-CONSTITUTION-CLEANUP-PRODUCTION-TRUTH` v1 in
`DON_CITY_CONSTITUTION_CLEANUP_PRODUCTION_TRUTH_MASTER_PLAN_V1_0.md`. The R2
exact-head gate, merge, one authorized production release and final live proof
are complete.
Operational commands are resolved from the current
root `package.json` and versioned runbooks; historical plans are evidence only.

## Current Runtime

- Production: `https://doncity-home.ru`; bounded live evidence from 2026-09-29 confirms an indexable homepage, crawl-allowed `robots.txt`, sitemap publication and 21 canonical URLs without findings.
- Final R2 proof reconciled canonical SourceCraft `main`, the public GitHub mirror and production revision. Exact mutable revision/digest values are read from the SourceCraft release record and runtime labels for each rollout rather than frozen in this runbook.
- One Timeweb VPS `doncity-server`; host Nginx/TLS → production loopback `3000`.
- Exactly one persistent managed PostgreSQL 18 database and private Timeweb S3 production identity exist. Non-production DB proof is disposable, isolated and removed after use.
- The former persistent staging runtime, logical database, empty bucket and
  Secret Master `/staging` folder were removed under explicit owner approval.
- Exactly one application runtime and jobs owner remain: production
  `JOBS_AUTORUN=true`.
- One prior image and compose file are retained as the immediate rollback point.

## Production State Matrix

These states are independent and must not be collapsed into one “production”
flag:

| State | Current fact |
|---|---|
| Observed public state | `LIVE_PUBLIC_OBSERVED`: the public origin is reachable and indexing is observed. |
| Deployed artifact identity | `EXACT_READ_ONLY_PROOF`: SourceCraft release record, container revision label and pinned Compose RepoDigest must agree. |
| Code main state | EPIC-R1 and EPIC-R2 are merged; the delivered release proved `SourceCraft main = GitHub mirror = production revision`. |
| Operational readiness | `READY`: external uptime monitoring, backups, jobs ownership, canonical NAP and production-owner login are proved. |
| Real feed readiness | `DISABLED_NOT_READY`: no approved endpoint or outbound/image allowlists. |
| Lead delivery readiness | `DISABLED_NOT_READY`: no approved independent destination/channel or destination allowlist. |

Observed indexing does not prove artifact identity or operational readiness.
Likewise, a green code candidate does not authorize production mutation.

## Ephemeral On-Demand Staging

Project staging contract:

```text
stagingMode = EPHEMERAL_ON_DEMAND
persistentStaging = false
```

An isolated staging proof is mandatory before production for schema/migrations,
auth/access, parser or source identity, major framework/Payload/PostgreSQL
upgrades, critical jobs/recovery behavior and any other Core-classified RISKY
release that requires staging.

Every staging proof must use a separate disposable database, non-production
secrets, synthetic or sanitized non-PII data, `noindex`, restricted access and
an exact candidate SHA/image. Media testing uses a separate non-production
storage identity. `JOBS_AUTORUN` is explicit and defaults to `false`; enabling a
single disposable jobs owner requires the proof step to demand it. Evidence
must include resource identity, executed matrix and cleanup; all disposable
runtime, database, storage and credentials are destroyed after capture.

A SourceCraft Space is a development workspace, not staging by default. It may
host a proof only if the complete isolation, noindex, identity and cleanup
contract above is explicitly established for that run.

## Deploy and Rollback

- Deploy only from clean canonical SourceCraft `main`, exact approved SHA and immutable image.
- Build/install/`git pull` on the host are forbidden.
- The compact runtime image and the ephemeral migration image are built from
  the same exact SHA. The migration image is never a persistent application
  runtime and is removed after its one bounded migration process.
- SourceCraft can publish both images to the connected organization registry
  through its short-lived built-in `SOURCECRAFT_TOKEN`; no long-lived registry
  secret or external service connection is required. Publication is manual,
  verifies the exact canonical `main` SHA and remains separate from rollout.
  The production runbook then pulls those exact-SHA tags, resolves the runtime
  digest, pins Compose to that digest and removes the temporary registry login.
  Neither the workstation nor the Timeweb host rebuilds the application.
- Before migrations, trigger a fresh validated offsite backup and bind its
  successful service result, the candidate image and rollback point to the
  release evidence.
- Run the candidate image's versioned Payload migrations in one ephemeral
  `JOBS_AUTORUN=false` process. Then replace the single production Compose
  service in place; never run a second persistent application/jobs runtime.
- Application rollback restores the previous immutable image. Schema/data rollback follows the migration-specific plan; never test restore against production.

## Backup Truth

- Provider PostgreSQL backup exists and an isolated temporary restore/migration rehearsal passed; the temporary database was removed.
- Независимая копия БД создаётся ежедневным `doncity-backup.timer` через
  `pg_dump -Fc`, проверяется `pg_restore --list` и хранится offsite; timer
  enabled/active, а последний service result успешен.
- Если когда-либо активирован local-media fallback, перед rollout отдельно archive `MEDIA_DIR`; текущий production использует private S3 и не считает локальный каталог media backup.
- Media copy and representative checksum restore are proven without mutation
  of the production object.
- Authenticated health reports current DB/media backup freshness, overall
  `ok`, all application/database/storage/jobs components `ok` and zero alerts.

## Feed, Leads and PII

- Real feed sources remain disabled until the owner supplies a verified endpoint and outbound/image allowlists.
- Feed URL credentials are secret references, never CMS/log values. Missing-object deactivation requires run-specific approval.
- Lead delivery uses the existing outbox identity; retries never copy PII into diagnostics.
- `ALERT_WEBHOOK_URL` and the approved delivery channel must be independent from the application server.
- Logs, evidence and incident notes must not contain raw feed XML, PII, tokens, credentials or full database URLs.
- Raw XML, PII, credentials и токены запрещено сохранять в логах, evidence и incident notes.

## Health and Availability

- Independent alert channel использует `ALERT_WEBHOOK_URL` и не должен зависеть от этого VPS.
- Detailed `/api/internal/healthz` is authenticated; external monitoring uses only the intended public availability signal.
- Availability evidence required before release is bounded inside the release gate; the plan creates no separate post-production monitoring task.
- Alerts cover site down, suspicious/overdue import, stalled jobs, dead lead delivery and backup failure.
- Release evidence captures exact SHA/image, jobs owner, queue movement, DB/media backup freshness and redacted smoke results.

## Lifecycle and Retention

- **Catalog lifecycle operations.** Archive/purge выполняются только задачей `catalogLifecycle` по зафиксированным retention-правилам.
- Leads and archived property content are retained for 100 days before lifecycle purge.
- `catalogLifecycle` owns archive/purge transitions; manual DB edits are forbidden.
- Canonical 404/410 behavior is checked through route/lifecycle contracts.

## Open product operations (not production-readiness blockers)

- keep the proved SourceCraft uptime alert schedule active;
- select and verify an independent lead-delivery channel before enabling delivery;
- keep the real feed disabled until its endpoint and outbound/image allowlists are separately approved.

Production owner login, canonical NAP, external monitoring, bounded live crawl
and exact release identity have durable evidence. Production remains online;
real feed and lead delivery stay fail-closed.

## Manual Import and Suspicious Approval

- **Manual import.** Запуск разрешён только через контролируемую операцию Feed Sources.
- **Suspicious approval.** Разрешение привязано к одному точному Import Run и ограничено TTL.

1. Keep a source disabled until its secret reference and outbound/image hosts
   are approved.
2. Owner/admin may queue a manual import from the Feed Sources operation; never
   paste a credential URL into CMS.
3. Inspect the redacted Import Run/Issues record. Raw XML and credentials must
   not enter evidence.
4. A suspicious deactivation is approved only for the exact import run and only
   inside the 240-minute approval TTL. The configured source threshold/cap
   (defaults: 30% and 50) do not authorize bypassing source isolation.
5. Missing, expired or mismatched approval means skip/fail closed; do not edit
   rows manually.

## Interrupted Jobs and Orphan Recovery

- **Stale/orphan recovery.** Используется только именованная System/Ingest Gateway операция с сохранением audit identity.
- Use authenticated Payload job diagnostics and project recovery commands to
  inspect stalled/claimed work. Do not edit `payload-jobs` directly.
- Recovery thresholds derive from the 15-minute maintenance interval and
  observed task duration. Requeue/unstuck operations must retain audit identity.
- Before jobs-owner handover, stop the old owner, verify it is no longer
  scheduling, then enable the new owner and prove queue movement.
- For interrupted imports, preserve run/source identity and resume or supersede
  through the named System/Ingest Gateway operation; never replay raw SQL.

## Lead Delivery Recovery and Channel Outage

- **Delivery retry.** Повтор использует существующий outbox identity и не создаёт вторую заявку.
- **Delivery recovery.** Stale `sending` и pending без живой job восстанавливаются штатной recovery-задачей.
- Owner-only manual retry uses the controlled Lead Deliveries endpoint and the
  existing outbox identity; it does not create a second lead or copy PII into
  diagnostics.
- Retry schedule is `0/1/5/15/60/240` minutes. Unknown delivery waits 60
  minutes; stale `sending` recovery begins after 15 minutes.
- If a channel or destination host is not approved, disable routing and retain
  the outbox record. Do not add a temporary host outside `LEAD_OUTBOUND_HOSTS`.
- During an outage, verify redaction, queue age and retry state, notify through
  an independent approved channel, and resume only after a redacted smoke.

## Incident Procedure

Диагностика состояния доступна через authenticated `GET /api/internal/healthz` без публикации секретов и PII.

1. Preserve exact SHA/image, time window and affected surface; redact secrets
   and PII.
2. Stop the unsafe integration or jobs owner when continued execution can cause
   data loss; do not stop the public site without incident evidence.
3. Check authenticated health, queue/import/delivery diagnostics and external
   availability separately.
4. Roll back the immutable application image or follow the migration-specific
   restore plan. Never improvise a production DB rollback.
5. Record the proof, residual risk and follow-up in the owning Source of Truth.
