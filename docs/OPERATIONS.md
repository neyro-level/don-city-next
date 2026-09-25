# DON CITY — Operations Contract

Status: pre-deploy contract; no production is authorized.

## Runtime topology

- Existing Timeweb server is the only application target.
- Host Nginx terminates TLS and proxies to the application on loopback.
- Next.js + Payload runs from an immutable image built outside the server.
- Timeweb Managed PostgreSQL 18 remains a separate private service.
- The preferred database path is the provider private network; public database exposure is forbidden by default.
- Staging is separate/noindex with separate database and secrets, even when its process shares the same VPS after capacity proof.

## Jobs owner

Exactly one application runtime has `JOBS_AUTORUN=true`. All other app/staging/candidate runtimes use `JOBS_AUTORUN=false`. The current repository does not yet prove a standalone worker entrypoint, so operations must not invent one.

Handover:

1. start candidate with jobs disabled;
2. prove application readiness;
3. stop the previous jobs owner and verify it is inactive;
4. enable jobs on exactly one candidate runtime;
5. prove queue polling/execution, scheduled dispatch and backlog movement.

## Deploy and rollback boundary

- Production deploy is allowed only from clean canonical `main`, exact approved SHA and immutable image digest/tag.
- No `git pull`, dependency install or image build runs on the production host.
- Database migrations run once from the approved release flow after backup/staging proof.
- Rollback restores the prior immutable image; a schema/data rollback follows the migration-specific recovery plan.

## Backup and restore

- Provider automatic PostgreSQL backup must have an explicit schedule and retention.
- A backup is not considered proven until restored into staging and checked by application smoke.
- Valuable production data needs a provider-independent/offsite recovery copy when the final retention policy is approved.
- Media backup/versioning is defined only after the S3/media owner is selected.

Before a migration, the release record must bind the exact database backup or
snapshot identifier, immutable application image and rollback point. A release
runner may create an encrypted custom-format dump with `pg_dump -Fc`, but the
command output and retained evidence must not contain `DATABASE_URI` or other
credentials. Restore proof uses an isolated staging database, `pg_restore` and
the changed application smoke; it never targets production as a test.

If production activation temporarily retains local media, archive `MEDIA_DIR`
to the approved encrypted offsite destination and verify a sampled restore
before rollout. If managed object storage is activated instead, its native
versioning/backup and restore evidence replace the local-media procedure. The
repository currently proves neither production S3 activation nor a media
restore, so both remain staging/release prerequisites.

## Manual import

An owner or admin may queue one feed through the controlled
`/:id/manual-import` Feed Sources endpoint. Confirm the source ID, disabled or
enabled state and latest completed run first. Never paste credential-bearing
feed URLs into the CMS or logs: `feedUrlRef` stores only a deployment secret
reference. Observe the resulting Import Run and stop escalation if counts,
hashes or source identity differ from the expected feed.

## Suspicious approval

Missing-object deactivation above the source threshold remains suspended. An
owner or admin reviews the exact Import Run, missing count and source scope,
then uses `/:id/approve-deactivation` for that run only. Approval metadata is
short-lived, auditable and single-use; it is not a standing bypass. The first
full baseline never deactivates missing objects.

## Stale/orphan recovery

`jobsJanitor` owns interrupted or orphaned import recovery. Before intervening,
inspect queue state through the System Gateway and distinguish a live future
`waitUntil` job from an orphan. Do not edit Payload job rows directly. Recovery
must retain redacted diagnostics and the original feed/run identity.

## Delivery retry

Only an owner may call the Lead Deliveries `/:id/retry` endpoint. Verify the
delivery is retryable or safely recoverable and that the destination channel is
still approved. The operation records the actor, clears only stale claim/job
state and queues the existing delivery identity; it never copies lead PII into
diagnostics.

## Delivery recovery

`recoverLeadDeliveries` owns stale `sending` recovery using the configured
heartbeat threshold. Operators inspect status, attempts, `claimedAt`,
`heartbeatAt` and redacted error state before retry. Raw payloads, response
bodies, PII, credentials and tokens are forbidden in incident notes.
Raw XML, PII, credentials и токены также запрещены в import/recovery evidence.

## Catalog lifecycle operations

`catalogLifecycle` archives stale records and purges content only under the
configured retention policy. A missing retention decision fails closed. Manual
database updates are forbidden; lifecycle state transitions and their canonical
404/410 behavior must be exercised through the project job and route contracts.

## Health and recovery evidence

`GET /api/internal/healthz` is authenticated for detailed internal evidence;
external monitoring consumes only its intended public availability signal.
Release/recovery records capture exact SHA/image, jobs-owner state, database and
media backup freshness, queue movement and redacted smoke results. The primary
alert destination is configured by `ALERT_WEBHOOK_URL`, and an Independent alert
channel must not share the failed application/server boundary.

## Monitoring and incidents

- External monitoring checks `/healthz`; monitoring on the same server is insufficient.
- Independent alert channel covers site down, import suspicious/overdue, stalled jobs, dead lead delivery and backup failure.
- Incident response preserves logs with redaction, exact release identity and recovery evidence; PII and secrets never enter diagnostics.

## Current blockers before staging

- attach the server to the existing database private network;
- prove authenticated SQL connectivity;
- decide and prove media/S3 ownership;
- render Nginx/runtime/monitoring configuration;
- approve retention, legal content and public indexing decisions.
