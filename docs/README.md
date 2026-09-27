# DON CITY

Status: Active — production live, global noindex
Version: 1.0
Updated: 2026-09-27

## Что создаём

Сайт и каталог агентства недвижимости «ДОН СИТИ» для вторичного рынка Донецка: квартиры, дома и участки, страницы географии, карточки объектов, заявки и юридическое сопровождение. Реализация — отдельный client instance AMS Realty Platform на Next.js + Payload CMS + PostgreSQL.

## Бизнес-цель

Публиковать проверяемые объекты и получать обращения, не раскрывая raw CMS data и персональные данные. Индексация пока глобально запрещена до закрытия операционных блокеров и отдельного решения владельца.

## Текущий статус

- Production работает на `https://doncity-home.ru` из exact release SHA `cd5c743912650525f84d2d110e6a43c4e6c6e35d` и immutable image `don-city-next:production-cd5c74391265`.
- Глобальный `noindex` активен; `robots.txt` запрещает обход.
- В каталоге 12 опубликованных объектов и 92 фотографии: 9 квартир и 3 дома/объекта с земельными участками. Отдельных объявлений категории «участки» пока нет.
- Реальный feed отключён; production jobs включены только у одного runtime, staging jobs выключены.
- До снятия `noindex`: создать первого owner-пользователя, подключить независимый канал уведомлений и мониторинг, подтвердить NAP, закрыть media-backup evidence и принять решение по реальному feed.

## Platform contract

Normative target: AMS Realty Platform Core 5.5 + AMS UI Core 5.0 + AMS Payload Platform. Profile: `REALTY_BASE`, `catalog`, mode: `BUILD`, `DELIVERY_PROFILE=CRITICAL`.

The current implementation is partially converged, not fully certified. CP-01
through CP-07 are delivered; CP-08 integrated staging proof passed on the exact
candidate and awaits PR/RISKY delivery. Exact gaps and evidence are recorded
in `replan/CORE55_CP00_EVIDENCE.md` and the APPROVED v9 program in
`AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md`.

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
| детальный execution/SEO/data contract | `AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md` |
| долговечные архитектурные решения | `adr/README.md` |
| история contract | `CHANGELOG.md` |

`06_DESIGN_SYSTEM.md` is a superseded history pointer. `research/**`,
`replan/**` and `archive/**` are evidence/history, not active status. Operational
production truth is recorded in `DELIVERY_STATE.yaml` and `OPERATIONS.md`.
