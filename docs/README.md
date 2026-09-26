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

Normative target: AMS Realty Platform Core 5.5 + AMS UI Core 5.0 + AMS Payload Platform. Profile: `catalog`, mode: `BUILD`, `DELIVERY_PROFILE=CRITICAL`.

The production implementation is not yet declared conformant. Exact Core 5.5/UI 5.0 gaps and the staged remediation program are recorded in `replan/CORE55_CP00_EVIDENCE.md` and `AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md` v8 REVIEW.

## Source of Truth

| Область | Source of Truth |
|---|---|
| normative Realty platform baseline | `../AMS_REALTY_PLATFORM_CORE_STANDARD_5.5_SOLO_AI_FINAL.md` |
| normative UI baseline | `../AMS_UI_CORE_v5.0_FINAL.md` |
| продукт и scope | `01_PRD.md` |
| страницы, URL, flows, SEO policy | `02_PRODUCT_STRUCTURE.md` |
| техника, data, security, infrastructure | `03_ARCHITECTURE.md` |
| текущая работа | `04_BACKLOG.md` |
| release | `05_RELEASE_CHECKLIST.md` |
| UI | `06_DESIGN_SYSTEM.md` |
| operations / runtime | `OPERATIONS.md` |
| детальный execution/SEO/data contract | `AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md` |
| долговечные архитектурные решения | `adr/README.md` |
| история contract | `CHANGELOG.md` |

`research/**`, `replan/**` и `archive/**` — evidence и история, а не активный статус. Оперативная правда production фиксируется в `DELIVERY_STATE.yaml` и `OPERATIONS.md`.
