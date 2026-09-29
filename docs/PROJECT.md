# DON CITY — Core 5.5 Project Contract

Status: Active — production live and publicly crawlable

Updated: 2026-09-29

Active execution contract: exact APPROVED plan
`AMS-DON-CITY-CONSTITUTION-REMEDIATION` v1 in
`DON_CITY_FINAL_CONSTITUTION_REMEDIATION_MASTER_PLAN_V2_0.md`. EPIC-01…04 are
merged; EPIC-05 owns release-candidate convergence and stops before production.
Runtime commands come only from the current root `package.json`.

## 1. Identity and profile

| Field | Value |
|---|---|
| Client | ДОН СИТИ |
| Canonical domain | `doncity-home.ru` |
| Project class | `COMMERCIAL` |
| Delivery profile | `CRITICAL` |
| Platform profile | `AMS_PROFILE=REALTY_BASE` |
| Realty profile | `catalog / BUILD / SINGLE_GEO` |
| Timezone | `Europe/Moscow` |
| Canonical origin | `https://doncity-home.ru` |

Canonical classifications: `PROJECT_CLASS=COMMERCIAL` and
`DELIVERY_PROFILE=CRITICAL`.

`REALTY_BASE` is validated by `.env.example`, `src/project/project.config.ts`
and the exact Zod literal in `src/project/env.ts`. The project has one
jobs-active application runtime, fewer than 2,000 active records and no proven
capacity or isolation trigger for `REALTY_EXTENDED`. A profile change requires a
separate architecture decision and runtime proof.

## 2. Runtime topology

- Production: one Timeweb VPS, managed PostgreSQL 18 over private VPC, private
  Timeweb S3, host Nginx/TLS, application loopback `3000`.
- The project has exactly one persistent production database. Non-production
  DB proof is disposable, isolated from production data/secrets/storage and
  removed after the bounded check; no persistent staging/shadow/mirror DB exists.
- The former persistent staging runtime, logical database, S3 bucket and
  Secret Master folder were owner-authorized for retirement and removed on
  2026-09-28; the shared production storage credential was preserved.
- `stagingMode = EPHEMERAL_ON_DEMAND`; `persistentStaging = false`. Required
  risky pre-production proof uses disposable isolated DB/secrets/data/storage,
  noindex and restricted access, exact candidate identity, explicit
  `JOBS_AUTORUN` and mandatory cleanup evidence.
- Exactly one production runtime owns Payload job autorun. Handover is
  stop-old-before-enable-new.
- Secret values and full connection URLs belong to Secret Master scope
  `DonCity Server/prod`, never this document.

Durable infrastructure evidence and the current rollback image are owned by
`03_ARCHITECTURE.md`, `OPERATIONS.md` and `DELIVERY_STATE.yaml`.

## 3. Modules and reserved namespaces

Base project modules are catalog/geo, content/SEO, ingest, leads/outbox,
settings/NAP, media and runtime operations.

| Optional module | State | Reserved public namespace |
|---|---|---|
| `novostroyki` | disabled / `PREPARED_OFF` | `/novostroyki/*`, `/komplex/*` |
| `journal` | disabled | `/journal/*` |
| `agents` | disabled | no public route activated |

Payload Pages cannot occupy `/novostroyki`, `/komplex` or `/journal`, including
descendants. Module activation requires its own manifest, migration/backfill,
Gateway/DTO, cache, UI and SEO proof. Existing frozen contracts or unused UI
components do not activate a module.

## 4. Feed and import contract

- Real feed sources: disabled. No endpoint or host allowlist is approved.
- Parser: `yrl` (`YRL/XML`); source `market` is authoritative.
- Default source refresh: `1440` minutes; minimum accepted value: `5` minutes.
- Dispatcher interval: `5` minutes; maintenance/recovery interval: `15`
  minutes; dispatch batch: `3`; ingest batch: `100`.
- Import heartbeat: `15` seconds.
- Suspicious deactivation defaults: `30%` threshold, hard cap `50` per run.
- Approval TTL: `240` minutes and bound to the exact import run.
- Feed URL is a secret/config reference (`feedUrlRef`), never a credential URL
  stored in CMS, Git or logs.

The exact parser mapping and source isolation are implementation-owned by the
Ingest Gateway. A real source remains disabled until its endpoint and outbound /
image allowlists are owner-approved and verified.

## 5. Lifecycle and retention

| Policy | Value |
|---|---|
| Lead retention | `100` days |
| Archived property content retention | `100` days |
| Employee archive retention | indefinite |
| Lead retention mode | per-row `delete` or `anonymize`; current intake default is `delete` |

Lifecycle purge belongs to scheduled jobs. Manual SQL cleanup is forbidden.
Privacy/legal text, runtime policy and owner approval must remain aligned before
lead operations are activated.

## 6. Lead delivery and alerts

- Supported channel kinds: `max`, `custom-webhook`.
- Active production channel IDs: none approved; `LEAD_CHANNELS` remains empty.
- Routing: `all-enabled`.
- Retry schedule: immediate, then `1`, `5`, `15`, `60`, `240` minutes.
- Unknown-delivery backoff: `60` minutes; stale sending threshold: `15`
  minutes; retained attempt-log entries: `20`.
- Destination allowlist: `LEAD_OUTBOUND_HOSTS`; currently empty.
- Credential references: MAX uses `MAX_BOT_TOKEN`, `MAX_CHAT_ID`,
  `MAX_API_URL`; custom webhook uses `CUSTOM_WEBHOOK_URL` and
  `CUSTOM_WEBHOOK_HMAC_SECRET`. Values are never documented.
- Independent alerts use `ALERT_WEBHOOK_URL`; no approved independent channel
  is currently proven.

## 7. Cache contract

- `CACHE_INVALIDATION_MODE=http` is the only approved mode.
- `INTERNAL_REVALIDATE_BASE_URL` must be HTTPS or loopback HTTP; production
  values and `REVALIDATE_SECRET` are external secrets/configuration.
- Public read safety TTL: `3600` seconds. Cache keys are deterministic and
  invalidation targets are allowlisted.
- Current code proof status: `http`; live operational readiness remains bounded
  by the release and health evidence.

## 8. Storage, database, backup and monitoring

- Database: Timeweb managed PostgreSQL 18, private VPC, region/provider identity
  controlled outside Git.
- Media: Timeweb S3-compatible storage, region `ru-1`; bucket, credentials and
  production prefix are secret/deployment values.
- Provider DB backup and one isolated restore/migration rehearsal are proven.
- Daily offsite DB backup, integrity validation, DB restore rehearsal, media
  copy and sampled checksum restore are proven; authenticated health reports
  current DB/media backup freshness without alerts.
- `nginx=true`, `automaticBackup=true` and `externalMonitoring=true` reflect
  durable operational evidence. SourceCraft probes the public origin every
  15 minutes and sends a private critical issue after one failed run; this does
  not create a post-production task.

## 9. Admin access

- Payload Admin is a separate `CMS_NATIVE_ADMIN` noindex surface with Payload
  auth, role checks, login lockout and owner-only sensitive operations.
- Host Nginx must apply the approved admin access policy. The tracked template
  deliberately retains `__ADMIN_ACCESS_POLICY__` until durable deployment
  evidence exists.
- The first production owner has not been bootstrapped. This blocks operational
  readiness but does not justify storing credentials in Git.

## 10. URL, indexing and title policy

- Exact URL grammar, canonical, metadata, pagination and launch indexability are
  owned by `02_PRODUCT_STRUCTURE.md` and the project registries.
- Production is publicly indexed; page-level registry/content gates remain the
  authority for canonical reachability and indexability.
- Pagination page 2+ is self-canonical and `noindex,follow`.
- Search/query combinations outside the approved registry are not indexable.
- Page titles, descriptions and one logical `h1` follow page contracts; the
  default fallback title is `ДОН СИТИ`.
- For the first four months after an explicitly authorized indexing release,
  only the approved secondary apartments, houses, land, commercial and legal
  scope may become indexable. Newbuild/ЖК remains disabled.

## 11. Readiness summary

Configured facts, observed public state, deployed artifact identity, code main
state, operational readiness, real feed readiness and lead delivery readiness
are separate claims. Their current values are canonical in the Operations
Production State Matrix and `DELIVERY_STATE.yaml`.

Open production-readiness / operational evidence:

- first production owner;
- approved independent alert/lead-delivery channel;
- non-empty verified destination/image/outbound allowlists for any activated
  integration;
- owner-verified canonical NAP;
- exact deployed SHA/image evidence for the observed public-indexing state.

Until their own gates are closed, real feeds and lead delivery stay disabled.
The final production stage is last; no separate monitoring, observation,
reconciliation or follow-up task is created after it.
