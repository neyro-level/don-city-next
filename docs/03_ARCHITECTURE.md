# Technical Architecture

Status: Draft
Version: 0.1
Updated: 2026-09-23

## 1. Architecture Summary

Отдельный client instance: Next.js App Router + React + Payload CMS + PostgreSQL. Payload владеет Admin, auth, access, schema и migrations. Public data проходит `UI → DTO → Public Gateway → Payload`.

## 2. Stack and Platform Contract

- AMS Realty Platform Core 3.0 + AMS Payload Platform.
- Project profile: `catalog`; mode: `BUILD`.
- Planned baseline требует проверки в EPIC-01: Next.js 16.3.5, React 19.2.8, Payload 3.90.1, pnpm 11.5.1, Tailwind 4.x.
- Prisma, второй backend/auth/Admin и anonymous raw Payload business REST запрещены.

### Starter provenance

- Source: `https://sourcecraft.dev/integrator-p/ams-realty-baza-starter`.
- Verified baseline: `main@ca1b884d43e808d17e1eb18b05bad70ea358dd1c`.
- Starter остаётся read-only; в DON CITY импортируется только проверенный tracked tree без Git metadata, secrets, caches, artifacts и Task Manager state.
- Package/runtime truth определяется после fetch из package/lockfile/runtime config; заявленные версии до EPIC-01 являются плановым baseline, а не установленным runtime.

## 3. Module Map

| Module | Purpose | Ownership | Public contract | Dependencies |
|---|---|---|---|---|
| catalog | public listings/detail | Payload properties/geo | DTO queries | public gateway, SEO |
| ingest | feed normalization/import | feed sources/import runs | normalized offers | safe outbound, Payload DB |
| geo | regions/cities/districts | Payload collections | geo DTO | catalog, SEO |
| seo | registry/content gate/sitemap | registry seeds + computed state | metadata/indexability | catalog, geo |
| leads | intake/outbox/delivery | leads + lead-deliveries | narrow form commands | jobs, integrations |
| settings | NAP/domain/config | site-settings Global | NAP DTO | public pages, JSON-LD |
| media | manual/project media | verified project storage + Payload Media | media DTO | catalog/content |
| runtime | cache/jobs/observability | project runtime | internal operations | all enabled modules |

## 4. Data and Security Boundaries

- Public Gateway: `overrideAccess:false`, explicit select/depth/limit, publication filters, DTO.
- System Gateway: only whitelisted system operations may use `overrideAccess:true`.
- Ingest Gateway: low-level bulk path only with validation, idempotency and source isolation.
- Leads/PII: transactional outbox, centralized redaction, no PII analytics/logging.
- Production schema: migrations only; destructive changes require backup/staging/rollback proof.

## 5. Infrastructure / Deployment

EPIC-03 discovery confirms one existing DON CITY Timeweb server and one separate managed PostgreSQL 18 cluster in the same Timeweb account. The server is a clean Ubuntu deployment target with no Nginx, container runtime, Node.js, application service or local PostgreSQL. The database is private-only with automatic backups. Both services were already attached to the same provider VPC, but Ubuntu had not configured the server's existing private NIC. An owner-authorized, isolated Netplan definition restored the private route. Authenticated `READ ONLY` inventory confirms PostgreSQL 18.6, one empty `default_db/public` database and zero user tables/views/materialized views. Exact identities and credentials remain outside git in the dedicated `DonCity Server/prod` Secret Master scope.

The existing server remains the presumed production target and the verified database route is the existing private VPC; public database exposure, a second server, database move or new S3 resource is not implied. The database connection is stored in Secret Master and must be rotated before deployment because the temporary password appeared in the owner conversation. `doncity-home.ru` currently resolves elsewhere and does not return a usable site response. Production, DNS, further network mutation and secret mutation still require their own authorized task and recovery proof. Detailed evidence is in `docs/research/EPIC-03_DISCOVERY.md`.

Target shape: host Nginx → immutable Next.js + Payload image on loopback → existing PostgreSQL over the verified private route. Staging stays separate/noindex with separate database and secrets. Operational detail: `docs/OPERATIONS.md` and `docs/research/EPIC-06_INFRASTRUCTURE_CONTRACT.md`.

### Jobs ownership contract

- Exactly one deployed runtime owns Payload queue polling/execution with `JOBS_AUTORUN=true`; every other runtime uses `false`.
- The current proven owner is one Next.js + Payload application runtime. A standalone worker is not claimed until a real worker entrypoint is implemented and verified.
- Payload `autoRun` cron `* * * * *` polls explicit queues. `dispatchDueFeeds` = `*/5 * * * *`; maintenance tasks including `recoverLeadDeliveries` = `*/15 * * * *`.
- Static queues keep `disableScheduling=false`; programmatic queues keep `disableScheduling=true`.
- `enableConcurrencyControl=true` remains mandatory.
- Jobs-owner handover is stop-old-before-enable-new; simultaneous owners and a public jobs endpoint are forbidden.

## 6. Quality / Testing

WORK uses targeted diagnostics. PR creation runs no CI. Before merge: AI review + one exact-head `STANDARD` or risk-specific `RISKY` SourceCraft gate. `.sourcecraft/ci.yaml` keeps both gates manual-only, requires `expected_commit_sha` and rejects a run whose `SOURCECRAFT_COMMIT_SHA` differs from that full SHA. Release reuses valid evidence and builds one immutable artifact.

## 6.1 UI runtime profile

- UX scope: `PUBLIC_COMMERCIAL` for site/catalog; `CMS_NATIVE_ADMIN` for Payload Admin.
- UI input: verified starter snapshot, then one-time Design Intake.
- Typeface direction: Manrope; source/license, Cyrillic coverage and required weights are verified during intake.
- Color direction: starter visual theme is preserved where compatible; its brand-red semantic role becomes a contrast-safe dark-green brand role. Error/destructive red is retained.
- Ownership: `primitives → layout → shared → domain → page-specific → composition`.
- Styling: actual Tailwind 4 baseline and one project-owned semantic token source; no second UI library.
- Component decision: `REUSE → VARIANT → CREATE` after starter inventory.
- Default rendering: Server Components; client boundary only at interactive leaves.
- Data boundary: DTO/ViewModel from Public Gateway; raw Payload documents forbidden in reusable UI.
- Representative page: `/kvartiry/donetsk/` before mass route scaling.
- SEO owner: Product Structure/master registry; UI preserves one H1, metadata/canonical/structured-data compatibility.
- States: responsive mobile/tablet/desktop plus loading/empty/error/success and catalog-specific partial/stale states where applicable.
- Theme: light-only until a separate decision; class-based dark variant, `.dark` not installed.
- Icon system: reuse actual starter system if single/consistent; otherwise Lucide default after intake.

## 7. Delivery Profile

`DELIVERY_PROFILE = CRITICAL`

Reason: real leads/PII, production database, owner/editor auth, imports and business-critical integrations. Paid exact-head SourceCraft gate is mandatory before merge.

## 8. Constraints

- Production and DNS changes require separate owner command.
- Dedicated Secret Master scope per project; no cross-project fallback.
- R2 modules remain prepared-off until research-first contract.
- Exact package/API compatibility is verified from installed versions and official docs in EPIC-01.
- Starter visuals may be preserved, but donor routes/menu/content/domain/metadata never override DON CITY Product Structure.
- Every planned route must satisfy the page completeness/domain/metadata gate before the related Epic closes.
