# DON CITY

Status: Implementation
Version: 0.1
Updated: 2026-09-23

## Что создаём

Новый сайт и каталог агентства недвижимости «ДОН СИТИ» для вторичного рынка Донецка: квартиры, дома, участки, страницы районов, заявки и юридическое сопровождение. Основа — отдельный client instance AMS Realty Platform на Next.js + Payload CMS + PostgreSQL.

## Бизнес-цель

Получать проверяемые органические и прямые обращения, публиковать актуальные объекты и безопасно сопровождать заявки без зависимости public UI от raw CMS data.

## Текущий статус

Master plan `v6 APPROVED`: Task Manager graph is authorized for import and autonomous Developer execution. Production remains separately authorized only by an explicit release command.

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
| детальный execution/SEO/data contract | `AMS_DON_CITY_FINAL_MASTER_PLAN_V3_0.md` |

## Current Focus

EPIC-00…06: repository/docs → exact starter acquisition/install → client activation → read-only server/database/inventory discovery → infrastructure contract. Master plan v6 imported with CLEAN reconciliation; EPIC-00 has a private canonical repository, registered worktree and manual exact-head merge-gate bootstrap. Следующая safe action — его targeted verification; starter, сервер и production ещё не затрагиваются.
