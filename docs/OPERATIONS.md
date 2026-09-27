# DON CITY — Operations Contract

Status: active production, global noindex
Updated: 2026-09-27

## Current Runtime

- Production: `https://doncity-home.ru`, exact release SHA `cd5c743912650525f84d2d110e6a43c4e6c6e35d`, image `don-city-next:production-cd5c74391265`.
- One Timeweb VPS `doncity-server`; host Nginx/TLS → production loopback `3000`, staging loopback `3100`.
- Managed PostgreSQL 18 and private Timeweb S3. Production and staging have separate database/secrets/storage prefixes.
- Production is globally noindex. Staging is always noindex.
- Exactly one jobs owner: production `JOBS_AUTORUN=true`; staging is false.
- One prior image and compose file are retained as the immediate rollback point.

## Deploy and Rollback

- Deploy only from clean canonical SourceCraft `main`, exact approved SHA and immutable image.
- Build/install/`git pull` on the host are forbidden.
- Before migrations bind the exact DB backup/restore proof, candidate image and rollback point to the release record.
- Start a candidate with jobs disabled; prove readiness; stop the old owner; enable jobs on exactly one runtime; prove queue movement.
- Application rollback restores the previous immutable image. Schema/data rollback follows the migration-specific plan; never test restore against production.

## Backup Truth

- Provider PostgreSQL backup exists and an isolated temporary restore/migration rehearsal passed; the temporary database was removed.
- Обязательная независимая копия БД создаётся командой `pg_dump -Fc` и хранится offsite; до устойчивого расписания и freshness evidence это остаётся открытым blocker.
- Если когда-либо активирован local-media fallback, перед rollout отдельно archive `MEDIA_DIR`; текущий production использует private S3 и не считает локальный каталог media backup.
- Authenticated health still lacks durable successful DB backup freshness and reports `backup_db_failure`.
- Media backup/versioning and sampled restore are not yet proven; health reports `backup_media_failure`.
- Until both signals are durable, health may remain `degraded` and indexing must remain disabled.

## Feed, Leads and PII

- Real feed sources remain disabled until the owner supplies a verified endpoint and outbound/image allowlists.
- Feed URL credentials are secret references, never CMS/log values. Missing-object deactivation requires run-specific approval.
- Lead delivery uses the existing outbox identity; retries never copy PII into diagnostics.
- `ALERT_WEBHOOK_URL` and the approved delivery channel must be independent from the application server.
- Logs, evidence and incident notes must not contain raw feed XML, PII, tokens, credentials or full database URLs.
- Raw XML, PII, credentials и токены запрещено сохранять в логах, evidence и incident notes.

## Health and Monitoring

- Independent alert channel использует `ALERT_WEBHOOK_URL` и не должен зависеть от этого VPS.
- Detailed `/api/internal/healthz` is authenticated; external monitoring uses only the intended public availability signal.
- External uptime monitoring must run outside this VPS.
- Alerts cover site down, suspicious/overdue import, stalled jobs, dead lead delivery and backup failure.
- Release evidence captures exact SHA/image, jobs owner, queue movement, DB/media backup freshness and redacted smoke results.

## Lifecycle and Retention

- **Catalog lifecycle operations.** Archive/purge выполняются только задачей `catalogLifecycle` по зафиксированным retention-правилам.
- Leads and archived property content are retained for 100 days before lifecycle purge.
- `catalogLifecycle` owns archive/purge transitions; manual DB edits are forbidden.
- Canonical 404/410 behavior is checked through route/lifecycle contracts.

## Current Blockers Before Indexing

- create the first production owner;
- connect approved independent alert/delivery channel and external monitoring;
- close durable DB/media backup freshness and sampled media restore;
- verify canonical NAP externally with the owner;
- run a production SEO/lifecycle crawl;
- receive a separate owner command to remove global noindex.

Production may remain online in noindex mode while these blockers are open. Real feed stays off.

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
   data loss; do not stop the public noindex site without evidence.
3. Check authenticated health, queue/import/delivery diagnostics and external
   availability separately.
4. Roll back the immutable application image or follow the migration-specific
   restore plan. Never improvise a production DB rollback.
5. Record the proof, residual risk and follow-up in the owning Source of Truth.
