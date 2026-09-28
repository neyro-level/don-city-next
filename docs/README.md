# DON CITY

Status: Active — constitution remediation v1 approved
Version: 1.3
Updated: 2026-09-28

## Что создаём

Сайт и каталог агентства недвижимости «ДОН СИТИ» для вторичного рынка Донецка: квартиры, дома, участки и коммерческая недвижимость, страницы географии, карточки объектов, заявки и юридическое сопровождение. Реализация — отдельный client instance AMS Realty Platform на Next.js + Payload CMS + PostgreSQL.

## Бизнес-цель

Публиковать проверяемые объекты и получать обращения, не раскрывая raw CMS data и персональные данные. Публичная индексация включена; URL и контент по-прежнему проходят page-level registry/content gates.

## Текущий статус

- Production отвечает на `https://doncity-home.ru`; read-only evidence от 2026-09-27 подтверждает индексируемую homepage, разрешающий `robots.txt` и опубликованный sitemap.
- Exact deployed SHA/image для текущего публично индексируемого состояния ещё должен быть привязан к release evidence; прежний noindex release `cd5c743912650525f84d2d110e6a43c4e6c6e35d` остаётся историческим rollback evidence, а не заявлением о текущей identity.
- `DC10-R11-00` доставил воспроизводимую read-only redacted production-матрицу:
  12 опубликованных объектов и 92 фотографии на зафиксированном baseline.
- Реальный feed отключён; после owner-authorized удаления persistent staging
  остались ровно один production runtime, одна logical DB и один S3 bucket.
  Непроизводственные DB-проверки только disposable и удаляются после bounded proof.
- DB/media backup freshness и sampled restore подтверждены; NAP, owner account
  и delivery readiness остаются отдельными проверяемыми фактами и не создают
  post-production monitoring stage.

## Platform contract

Normative target: AMS Realty Platform Core 5.5 + AMS UI Core 5.0 + AMS Payload Platform. Profile: `REALTY_BASE`, `catalog`, mode: `BUILD`, `DELIVERY_PROFILE=CRITICAL`.

The current implementation is partially converged, not fully certified. Exact
gaps, dependencies and evidence are governed by APPROVED Plan ID
`AMS-DON-CITY-CONSTITUTION-REMEDIATION` v1 in
`DON_CITY_FINAL_CONSTITUTION_REMEDIATION_MASTER_PLAN_V2_0.md`. Earlier plans and
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
| текущий approved remediation contract | `DON_CITY_FINAL_CONSTITUTION_REMEDIATION_MASTER_PLAN_V2_0.md` |
| предыдущий live-conformance contract | `AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md` (history) |
| долговечные архитектурные решения | `adr/README.md` |
| активный реестр допустимых raw SQL операций | `RAW_SQL_REGISTER.md` |
| история contract | `CHANGELOG.md` |

`06_DESIGN_SYSTEM.md` is a superseded history pointer. `research/**`,
`replan/**` and `archive/**` are evidence/history, not active status. Operational
production truth is recorded in `DELIVERY_STATE.yaml` and `OPERATIONS.md`.
