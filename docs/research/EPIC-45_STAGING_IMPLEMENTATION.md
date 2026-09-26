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

## Live staging activation

The owner authorized the isolated staging rollout on 2026-09-25. The existing
DON CITY server now runs a separate loopback-only staging container backed by a
dedicated PostgreSQL database, private S3 bucket and Secret Master `/staging`
scope. DNS, TLS, migrations and the temporary database-password rotation were
completed without changing the production runtime or production schema/data.

Redacted resource identities, immutable image/checksum evidence and live smoke
results are recorded in `EPIC-45_LIVE_STAGING_VERIFICATION.md`.

Owner approval on 2026-09-25 resolved retention at 100 days for leads and 100
days for archived property content. Future employee records remain archived
indefinitely. Staging external delivery remains disabled until real hosts are
supplied; unknown outbound destinations continue to fail closed.

Client readiness remains fail-closed for real host allowlists, backup restore
proof and independent monitoring/alert delivery. Those gaps block production,
not the isolated noindex staging runtime.

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
- Real client-readiness gate before owner approval: expected `FAIL` with four
  external blockers. Retention is now resolved; real host allowlists and the
  live storage/deployment/backup/monitoring contract remain runtime evidence.

The repository checks above are complemented by the authorized live Timeweb
evidence. Production rollout remains outside EPIC-45 and is not authorized.
