# DON CITY

Status: Replan approved; Task Manager handoff
Version: 0.1
Updated: 2026-09-24

## Что создаём

Новый сайт и каталог агентства недвижимости «ДОН СИТИ» для вторичного рынка Донецка: квартиры, дома, участки, страницы районов, заявки и юридическое сопровождение. Основа — отдельный client instance AMS Realty Platform на Next.js + Payload CMS + PostgreSQL.

## Бизнес-цель

Получать проверяемые органические и прямые обращения, публиковать актуальные объекты и безопасно сопровождать заявки без зависимости public UI от raw CMS data.

## Текущий статус

Master plan `v7 APPROVED` / product contract `4.0.1` passed the four-pass Architect audit with `READY_WITH_LIMITS` and was approved by the owner on 2026-09-24. The V4 graph has `55` executable epics and `265` task cards; exact validation/import/reconciliation precede Developer claims. The prior v6 Task Manager graph remains immutable historical evidence. Production remains separately authorized only by an explicit release command.

## Platform contract

AMS Realty Platform Core 3.0 + AMS Payload Platform. Profile: `catalog`, mode `BUILD`, delivery profile `CRITICAL`.

## Source of Truth

| Область | Source of Truth |
|---|---|
| продукт и scope | `01_PRD.md` |
| страницы, URL, flows, SEO policy | `02_PRODUCT_STRUCTURE.md` |
| техника, data, security, infrastructure | `03_ARCHITECTURE.md` |
| текущая работа | `04_BACKLOG.md` |
| release | `05_RELEASE_CHECKLIST.md` |
| UI | `06_DESIGN_SYSTEM.md` |
| operations / runtime | `OPERATIONS.md` |
| детальный execution/SEO/data contract | `AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md` |

## Current Focus

Task Manager Architect has completed the RP-00…RP-12 integration and final audit. Existing implementation evidence remains preserved, while new claims and production actions are paused until the exact v7 replacement graph is approved and imported.
