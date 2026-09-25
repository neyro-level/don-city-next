# EPIC-45 — staging implementation

## Implemented safely in Git

- Client legal content is recorded as approved from the delivered EPIC-33 legal
  pages and owner-supplied entity details.
- Indexing remains fail-closed as `noindex`; public indexing belongs only to the
  explicit EPIC-48 owner gate.
- A separate Timeweb staging contract requires an immutable image, isolated env
  file/database/media, loopback port, `JOBS_AUTORUN=false`, Nginx noindex header
  and deny-all robots response.
- A redacted proof matrix covers R1 routes, geo/facets, nearby locality,
  lifecycle, feeds, leads, cache, monitoring and rollback.
- Release-manifest identity is client-specific (`REALTY_CATALOG`, `CRITICAL`,
  `don-city-next`) and defaults to `REHEARSAL`; the release verifier now checks
  the isolated DON CITY staging assets instead of legacy starter deployment
  files.
- Pre-gate review aligned staging auth, lead, internal-revalidation and Admin
  locations with the hardened Nginx policy, fixed the loopback port at `3100`
  end to end and made `RELEASE` manifests fail outside clean exact `main`.

## Remaining live gates

The implementation intentionally does not provision infrastructure, mutate
Secret Master, rotate credentials, write to the server, configure DNS/TLS or
run migrations. Those actions need the owner/external decisions recorded in
`EPIC-45_TIMEWEB_STAGING_PREFLIGHT.md` and an explicit staging rollout command.

Client readiness therefore remains fail-closed for retention, real host
allowlists and the final storage/deployment/backup/monitoring contract.

## Local evidence

- Static Timeweb/staging blueprint and negative fixtures: `PASS`.
- Production topology contract: `PASS`.
- R1 resolver, apartment/house districts and facets, nearby geo: `PASS`.
- Property lifecycle, feed parse/ingest/lifecycle: `PASS`.
- Jobs configuration, lead intake/context/outbox/delivery and cache targets:
  `PASS`.
- TypeScript: `PASS`; scoped Biome lint: `PASS`; documentation Source of Truth
  guard: `PASS`.
- Next.js 16.3.5 production build of the local candidate: `PASS` (23 static
  pages generated; dynamic application/API routes compiled).
- Real client-readiness gate: expected `FAIL` with exactly four external
  blockers: retention decisions, real host allowlists and the live
  storage/deployment/backup/monitoring contract.

These checks prove repository behavior only. They are not live Timeweb staging
evidence and do not authorize rollout.
