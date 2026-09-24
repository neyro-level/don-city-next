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
| operations / runtime | `OPERATIONS.md` |
| детальный execution/SEO/data contract | `AMS_DON_CITY_FINAL_MASTER_PLAN_V3_0.md` |

## Current Focus

Master plan v6 is imported with CLEAN reconciliation. Repository, exact starter baseline, DON CITY activation and UI intake are materialized. EPIC-06 read-only discovery confirms the one existing Timeweb server and separate managed PostgreSQL 18 target; the infrastructure/jobs contract is verified on branch `codex/epic-06-infrastructure-contract`. The remaining EPIC-03 SQL inventory requires a separately authorized private-network attachment. Production is not authorized.
