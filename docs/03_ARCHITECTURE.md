# Technical Architecture

Status: Active
Version: 1.0
Updated: 2026-09-27

## Normative Baseline and Conformance

- Platform baseline: `AMS_REALTY_PLATFORM_CORE_STANDARD_5.5_SOLO_AI_FINAL.md`.
- UI baseline: `AMS_UI_CORE_v5.0_FINAL.md`.
- Payload remains the sole schema/auth/migrations owner; AMS Payload Platform is the implementation layer.
- Current conformance status: `REVIEW`, not certified. The exact delta is owned by `replan/CORE55_CP00_EVIDENCE.md` and the v8 program in `AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md`.
- Project facts, enabled modules, URL policy and operational evidence remain owned by the project Source of Truth; the normative files are not a substitute for those records.

## 1. Architecture Summary

DON CITY — отдельный client instance на Next.js App Router, React, Payload CMS и PostgreSQL. Payload — единственный владелец schema, migrations, auth и Admin. Public path: `UI → DTO → Public Gateway → Payload`; raw business collections наружу не выдаются.

## 2. Installed Stack

- Next.js 16.3.5, React 19.2.8, Payload 3.90.1.
- Node.js 24.20, pnpm 11.5.1, TypeScript strict, Tailwind CSS 4.
- PostgreSQL 18, Payload migrations; Prisma запрещён.
- Repository: SourceCraft primary, GitHub read-only mirror.
- `DELIVERY_PROFILE=CRITICAL` из-за auth, PII, production data и интеграций.

Фактические версии определяются `package.json`, lockfile и runtime image. Major upgrades выполняются отдельной задачей.

## 3. Ownership and Modules

| Module | Owner | Public contract |
|---|---|---|
| catalog/geo | Payload Properties/Regions/Cities/Districts | filtered DTO queries |
| content/SEO | Pages, ListingContents, redirects, registry | metadata, canonical, sitemap |
| ingest | FeedSources, ImportRuns, ImportIssues | normalized source-isolated offers |
| leads | Leads, LeadDeliveries | validated intake + outbox |
| settings | SiteSettings global + project config | NAP and site DTO |
| media | Payload Media + private S3 | controlled file route and media DTO |
| runtime | app, jobs, health, cache | internal operations |

`src/platform/**` не содержит DON CITY literals и не импортирует Project. `src/project/**` владеет брендом, Site Profile, URL/SEO inputs и client readiness. Application composition root внедряет project config в portable platform modules.

<!-- MODULE_GOVERNANCE_BEGIN -->
| Module | State | Manifest |
|---|---|---|
| `novostroyki` | `disabled` | `none` |
| `journal` | `disabled` | `none` |
| `agents` | `disabled` | `none` |
<!-- MODULE_GOVERNANCE_END -->

## 4. Data and Security Boundaries

- Public Gateway: `overrideAccess:false`, publication filters, explicit select/depth/limit и DTO.
- System Gateway: только allowlisted operations могут использовать повышенный доступ.
- Ingest Gateway: validation, idempotency, safe outbound и source isolation.
- Lead intake: validation, rate limit, transactional outbox и централизованная redaction.
- GraphQL выключен. Anonymous raw Payload REST для business collections запрещён.
- Lead и archived property retention — 100 дней; lifecycle purge выполняет job, а не ручной SQL.
- Production schema меняется только migrations после backup/restore/rehearsal evidence.

## 5. Runtime Topology

- Один существующий Timeweb VPS `doncity-server`.
- Managed PostgreSQL 18 доступен приложению через private VPC; публичное раскрытие БД запрещено.
- Production runtime secrets принадлежат scope `DonCity Server/prod`; значения не хранятся в Git или документации.
- Host Nginx завершает TLS и проксирует production на loopback `3000`, staging — на `3100`.
- Production и staging используют один immutable image exact SHA, но разные env/database/storage prefixes.
- Production: managed PostgreSQL 18, private Timeweb S3 prefix, `JOBS_AUTORUN=true`.
- Staging: отдельная изолированная database/schema contract, отдельный storage prefix, `JOBS_AUTORUN=false`, всегда noindex.
- Production image: `don-city-next:production-cd5c74391265`; предыдущий `don-city-next:production-31367bfe4adf` и его compose сохранены как единственная непосредственная rollback point.
- Production release выполняется только из clean canonical `main`; host не делает build, install или `git pull`.

Текущий repository readiness config остаётся fail-closed для `nginx`, `automaticBackup` и `externalMonitoring`, пока эти возможности не представлены полным durable evidence. Это не отменяет факт работающего host Nginx и provider DB backup; расхождение закрывается после media backup, health freshness и независимого monitoring proof.

## 6. Jobs, Cache and Lifecycle

- Ровно один runtime владеет Payload queue polling; handover — stop-old-before-enable-new.
- `dispatchDueFeeds` планируется каждые 5 минут, maintenance/recovery — каждые 15 минут.
- Feed sources по умолчанию disabled; реальный feed включается только после owner-approved endpoint/allowlist.
- Public Gateway reads используют deterministic cache keys, 3600-second safety TTL и tags `site`, `properties`, `geo:*`, `district:*`, `property:*`.
- CMS/import invalidation батчируется; lifecycle и proxy reads не кэшируются.

## 7. SEO and UI Contracts

- UX: `PUBLIC_COMMERCIAL`; Payload Admin: `CMS_NATIVE_ADMIN`.
- Site Profile: `SINGLE_GEO` Donetsk; активны secondary market и категории `kvartiry`, `doma`, `uchastki`.
- Server Components по умолчанию; client boundaries только для интерактивных leaves.
- Data boundary: DTO/ViewModel from Public Gateway; raw Payload documents не передаются в reusable UI.
- Один project-owned semantic token source; light-only, `.dark` не устанавливается.
- Global production noindex является release override над page-level SEO contracts.

## 8. Delivery and Recovery

- Branch/PR не запускают платный CI автоматически.
- Перед merge: review и один manual exact-head SourceCraft `STANDARD` либо risk-specific `RISKY` gate.
- Release: один manual exact-main workflow, один immutable artifact, один rollout и live smoke.
- Database rollback связан с конкретной migration/backup evidence; application rollback использует предыдущий immutable image.
- Provider DB backup и изолированный restore/migration proof подтверждены. Media backup/restore и durable health freshness остаются открытыми.

## 9. Current Operational Gaps

- production owner user не создан;
- независимый alert/delivery channel и внешний monitoring не подключены;
- media backup/restore evidence отсутствует;
- NAP требует внешней проверки владельцем;
- реальный feed отключён;
- internal health остаётся degraded из-за отсутствия durable DB/media backup freshness signals.

## 10. Constraints

- Один сервер и существующие managed services; второй сервер или перенос не подразумеваются.
- Секреты — только dedicated Secret Master scope, без значений в git/docs/logs.
- DNS, снятие noindex, destructive migrations и включение production integrations требуют отдельного owner decision.
- Подробная URL/SEO grammar — Product Structure, seeds, ADR и approved master plan; этот документ не дублирует реестр.
