# Technical Architecture

Status: Active
Version: 1.2
Updated: 2026-09-28

## Normative Baseline and Conformance

- Platform baseline: `AMS_REALTY_PLATFORM_CORE_STANDARD_5.5_SOLO_AI_FINAL.md`.
- UI baseline: `AMS_UI_CORE_v5.0_FINAL.md`.
- Payload remains the sole schema/auth/migrations owner; AMS Payload Platform is the implementation layer.
- Current conformance plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13.
- Current conformance status: `PRE-RELEASE CANDIDATE`. All v13 implementation
  epics are delivered; `DC11-DOC-FINAL` owns exact-head convergence before the
  separately authorized mandatory production stage. Earlier CP evidence remains
  historical.
- Project facts, enabled modules, URL policy and operational evidence remain owned by the project Source of Truth; the normative files are not a substitute for those records.

## 1. Architecture Summary

DON CITY — отдельный client instance на Next.js App Router, React, Payload CMS и PostgreSQL. Payload — единственный владелец schema, migrations, auth и Admin. Public path: `UI → DTO → Public Gateway → Payload`; raw business collections наружу не выдаются.

## 2. Installed Stack

- Next.js 16.3.5, React 19.2.8, Payload 3.90.1.
- Node.js 24.20, pnpm 11.5.1, TypeScript strict, Tailwind CSS 4.
- PostgreSQL 18, Payload migrations; Prisma запрещён.
- Repository: SourceCraft primary, GitHub read-only mirror.
- `PROJECT_CLASS=COMMERCIAL`: public business site, catalog and lead acquisition.
- `DELIVERY_PROFILE=CRITICAL` из-за auth, PII, production data и интеграций.

Project-specific profile/readiness choices are canonical in `PROJECT.md`; the
active visual policy is `DESIGN.md`. Architecture owns boundaries and topology,
not duplicated configuration tables.

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
- Host Nginx завершает TLS и проксирует production на loopback `3000`.
- HSTS имеет одного владельца — TLS-терминатор Nginx. Tracked TLS-hosts используют
  `max-age=31536000; includeSubDomains` без `preload`; application runtime HSTS не
  добавляет. `preload` запрещён до owner approval после полной DNS/TLS-инвентаризации.
- CSP принадлежит Next.js и разделён по поверхностям. Публичный статически
  оптимизируемый сайт временно сохраняет `unsafe-inline`; development-only React
  diagnostics получает `unsafe-eval`. Payload Admin остаётся noindex и хранит
  отдельное явно проверяемое compatibility-исключение. Nonce-CSP требует отдельного
  решения, потому что переводит страницы в dynamic rendering и отключает ISR.
- Exactly one persistent production database exists: managed PostgreSQL 18 over private VPC. Production also owns its private Timeweb S3 prefix and `JOBS_AUTORUN=true` runtime.
- Owner-authorized retirement on 2026-09-28 removed the former persistent
  staging runtime, its separate logical database, its empty S3 bucket and its
  Secret Master `/staging` folder. The shared S3 access identity and all
  production resources were preserved.
- Non-production database proof создаётся только как disposable isolated local/temporary environment, никогда не разделяет production data/secrets/storage и удаляется после bounded проверки. Persistent staging/shadow/mirror database запрещена.
- Last recorded noindex image `don-city-next:production-cd5c74391265` and prior image `don-city-next:production-31367bfe4adf` are historical rollback evidence. Exact deployed SHA/image for the observed public-indexing state remains pending release evidence.
- Production release выполняется только из clean canonical `main`; host не делает build, install или `git pull`.

Repository readiness records the proved host Nginx and automatic backup
capabilities as enabled. `externalMonitoring` remains fail-closed; required
availability proof is bounded inside the release gate and does not create a
monitoring or follow-up stage after production.

## 6. Jobs, Cache and Lifecycle

- Ровно один runtime владеет Payload queue polling/execution; handover — stop-old-before-enable-new.
- Payload jobs `autoRun` cron `* * * * *` только проверяет очереди; прикладное расписание задаёт registry.
- Registry schedules: `dispatchDueFeeds` = `*/5 * * * *`; `recoverLeadDeliveries` = `*/15 * * * *`.
- Static queues keep `disableScheduling=false`; programmatic import and delivery queues keep `disableScheduling=true`.
- `enableConcurrencyControl=true` remains обязательным для конкурентной обработки Payload jobs.
- Feed sources по умолчанию disabled; реальный feed включается только после owner-approved endpoint/allowlist.
- Public Gateway reads используют deterministic cache keys, 3600-second safety TTL и tags `site`, `properties`, `geo:*`, `district:*`, `property:*`.
- CMS/import invalidation батчируется; lifecycle и proxy reads не кэшируются.

## 7. SEO and UI Contracts

- UX: `PUBLIC_COMMERCIAL`; Payload Admin: `CMS_NATIVE_ADMIN`.
- Site Profile: `SINGLE_GEO` Donetsk; активны secondary market и категории `kvartiry`, `doma`, `uchastki`.
- Server Components по умолчанию; client boundaries только для интерактивных leaves.
- Data boundary: DTO/ViewModel from Public Gateway; raw Payload documents не передаются в reusable UI.
- Public API `@ams/realtbase-ui` закрыт десятью canonical entrypoints: analytics,
  primitives, семь активных public page/shell entrypoints и styles. Root barrel,
  `./views` и compatibility aliases `./starter/*` запрещены; будущие view modules
  остаются internal до отдельного activation contract.
- `packages/ui/src/views/public-shell/PublicSiteShellView.tsx` — единственный
  implementation owner header, footer и mobile navigation. Stable package
  entrypoint `./public/site-shell` указывает только на него; legacy component
  names допускаются исключительно как documented direct aliases в этом файле.
- Один project-owned semantic token source; light-only, `.dark` не устанавливается.
- Production публично индексируется; page-level registry/content gates, canonical policy и pagination `noindex,follow` остаются обязательными.
- Consent fail-closed: server принимает только явное `consentAccepted=true` и
  текущую project-owned версию; хранит неизменяемые
  `consent.accepted/version/consentedAt`, где время назначает только сервер.
- Legal publication fail-closed: privacy/consent активны, terms и optional
  managed PDF имеют typed `ABSENT` state и не дают public links. Их публикация
  требует owner-approved content/file и controlled internal/managed route.
- NAP имеет один runtime DTO owner и отдельный evidence status; текущий статус
  `PENDING_EXTERNAL_VERIFICATION` не позволяет выдавать значения за независимо
  подтверждённые.

## 8. Delivery and Recovery

- Branch/PR не запускают платный CI автоматически.
- Перед merge: review и один manual exact-head SourceCraft `STANDARD` либо risk-specific `RISKY` gate.
- Release: один manual exact-main workflow, один immutable artifact, один rollout и live smoke.
- Database rollback связан с конкретной migration/backup evidence; application rollback использует предыдущий immutable image.
- Provider DB backup, daily validated offsite copy, isolated restore/migration
  rehearsal, sampled media restore and authenticated freshness are confirmed.

## 9. Current Operational Gaps

- production owner user не создан;
- независимый alert/delivery channel не подтверждён;
- NAP требует внешней проверки владельцем;
- реальный feed отключён;
- independent alert/delivery channel остаётся неподтверждённым; authenticated
  health на проверке 2026-09-28 имеет статус `ok` без operational alerts.

## 10. Constraints

- Один сервер и существующие managed services; второй сервер или перенос не подразумеваются.
- Секреты — только dedicated Secret Master scope, без значений в git/docs/logs.
- DNS, destructive migrations, secret mutations и включение production integrations требуют отдельного owner decision.
- Финальный production — последний stage; после него программа не создаёт monitoring, observation, reconciliation или follow-up task.
- Подробная URL/SEO grammar — Product Structure, seeds, ADR и approved master plan; этот документ не дублирует реестр.
