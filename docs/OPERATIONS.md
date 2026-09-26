# DON CITY — Operations Contract

Status: active production, global noindex
Updated: 2026-09-26

## Current Runtime

- Production: `https://doncity-home.ru`, exact SHA `31367bfe4adf476925eca97b5dcb13088e31191e`, image `don-city-next:production-31367bfe4adf`.
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
- Authenticated health still lacks durable successful DB backup freshness and reports `backup_db_failure`.
- Media backup/versioning and sampled restore are not yet proven; health reports `backup_media_failure`.
- Until both signals are durable, health may remain `degraded` and indexing must remain disabled.

## Feed, Leads and PII

- Real feed sources remain disabled until the owner supplies a verified endpoint and outbound/image allowlists.
- Feed URL credentials are secret references, never CMS/log values. Missing-object deactivation requires run-specific approval.
- Lead delivery uses the existing outbox identity; retries never copy PII into diagnostics.
- `ALERT_WEBHOOK_URL` and the approved delivery channel must be independent from the application server.
- Logs, evidence and incident notes must not contain raw feed XML, PII, tokens, credentials or full database URLs.

## Health and Monitoring

- Detailed `/api/internal/healthz` is authenticated; external monitoring uses only the intended public availability signal.
- External uptime monitoring must run outside this VPS.
- Alerts cover site down, suspicious/overdue import, stalled jobs, dead lead delivery and backup failure.
- Release evidence captures exact SHA/image, jobs owner, queue movement, DB/media backup freshness and redacted smoke results.

## Lifecycle and Retention

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
