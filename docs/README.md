# DON CITY

Status: Active — continuous maintenance after delivered R1/R2 release
Version: 1.6
Updated: 2026-09-29

## Что создаём

Сайт и каталог агентства недвижимости «ДОН СИТИ» для вторичного рынка Донецка: квартиры, дома, участки и коммерческая недвижимость, страницы географии, карточки объектов, заявки и юридическое сопровождение. Реализация — отдельный client instance AMS Realty Platform на Next.js + Payload CMS + PostgreSQL.

## Бизнес-цель

Публиковать проверяемые объекты и получать обращения, не раскрывая raw CMS data и персональные данные. Публичная индексация включена; URL и контент по-прежнему проходят page-level registry/content gates.

## Текущий статус

- Constitution cleanup EPIC-R1 was delivered through PR `#119` / RISKY gate
  `160`; EPIC-R2 was delivered through PR `#120` / RISKY gate `163`, followed
  by the single authorized SourceCraft release run `164` and rollout.
- Observed public state, deployed artifact identity, code main state,
  operational readiness, real feed readiness and lead delivery readiness are
  separate facts; the current matrix is owned by `OPERATIONS.md` and
  `DELIVERY_STATE.yaml`.
- Production отвечает на `https://doncity-home.ru`; final live crawl от
  2026-09-29 проверил 61 request и 21 sitemap URL без findings.
- The delivered R2 release reconciled canonical SourceCraft `main`, the public
  GitHub mirror and the production revision. Exact mutable SHA/digest values are
  retained by SourceCraft release evidence and read-only runtime labels rather
  than copied into durable product policy.
- `DC10-R11-00` доставил воспроизводимую read-only redacted production-матрицу:
  12 опубликованных объектов и 92 фотографии на зафиксированном baseline.
- Реальный feed отключён; после owner-authorized удаления persistent staging
  остались ровно один production runtime, одна logical DB и один S3 bucket.
  Непроизводственные DB-проверки только disposable и удаляются после bounded proof.
- DB/media backup freshness, sampled restore, canonical NAP, external monitoring
  and production-owner login are proved. Lead delivery remains a separate
  fail-closed product operation and does not create a post-production stage.

## Platform contract

Normative target: AMS Realty Platform Core 5.5 + AMS UI Core 5.0 + AMS Payload Platform. Profile: `REALTY_BASE`, `catalog`, mode: `BUILD`, `DELIVERY_PROFILE=CRITICAL`.

The current implementation is partially converged, not fully certified. Exact
gaps, dependencies and evidence are governed by APPROVED Plan ID
`DON-CITY-CONSTITUTION-CLEANUP-PRODUCTION-TRUTH` v1 in
`DON_CITY_CONSTITUTION_CLEANUP_PRODUCTION_TRUTH_MASTER_PLAN_V1_0.md`. Earlier plans and
CP evidence remain history, not current execution state.

## Source of Truth

| Область | Source of Truth |
|---|---|
| normative Realty platform baseline | `../AMS_REALTY_PLATFORM_CORE_STANDARD_5.5_SOLO_AI_FINAL.md` |
| normative UI baseline | `../AMS_UI_CORE_v5.0_FINAL.md` |
| project profile, runtime choices and fail-closed readiness | `PROJECT.md` |
| продукт и scope | `01_PRD.md` |
| страницы, URL, flows, SEO policy | `02_PRODUCT_STRUCTURE.md` |
| техника, data, security, infrastructure | `03_ARCHITECTURE.md` |
| текущая работа | `04_BACKLOG.md` |
| release | `05_RELEASE_CHECKLIST.md` |
| active project design policy | `DESIGN.md` |
| operations / runtime | `OPERATIONS.md` |
| SourceCraft Spaces pilot | `SOURCECRAFT_SPACES.md` |
| SourceCraft organization/platform audit | `SOURCECRAFT_PLATFORM_AUDIT.md` |
| текущий approved execution contract | `DON_CITY_CONSTITUTION_CLEANUP_PRODUCTION_TRUTH_MASTER_PLAN_V1_0.md` |
| предыдущий live-conformance contract | `AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md` (history) |
| долговечные архитектурные решения | `adr/README.md` |
| активный реестр допустимых raw SQL операций | `RAW_SQL_REGISTER.md` |
| история contract | `CHANGELOG.md` |

`06_DESIGN_SYSTEM.md` is a superseded history pointer. `research/**`,
`replan/**` and `archive/**` are evidence/history, not active status. Operational
production truth is recorded in `DELIVERY_STATE.yaml` and `OPERATIONS.md`.
