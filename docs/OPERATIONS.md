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
