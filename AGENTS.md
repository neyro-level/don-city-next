# DON CITY — project router

## Контекст

- Normative target: AMS Realty Platform Core 5.5 + AMS UI Core 5.0 + Payload Platform.
- Current implementation: EPIC-01…04 of exact APPROVED plan `AMS-DON-CITY-CONSTITUTION-REMEDIATION` v1 are merged; EPIC-05 prepares the exact release candidate and must stop before production.
- Profile: `catalog`, `BUILD`, `DELIVERY_PROFILE=CRITICAL`.
- Repository mode: `SOURCECRAFT_PRIMARY_GITHUB_MIRROR`.
- UX: public commercial catalog + CMS-native Payload Admin.

## Порядок чтения

1. Глобальный `~/.codex/AGENTS.md`.
2. `docs/README.md`.
3. Normative baselines: `AMS_REALTY_PLATFORM_CORE_STANDARD_5.5_SOLO_AI_FINAL.md` and `AMS_UI_CORE_v5.0_FINAL.md`.
4. Текущий scope в `01_PRD.md`, `02_PRODUCT_STRUCTURE.md`, `03_ARCHITECTURE.md`.
5. `docs/DELIVERY_STATE.yaml` и READY task в `04_BACKLOG.md`.
6. Exact APPROVED execution contract: `docs/DON_CITY_FINAL_CONSTITUTION_REMEDIATION_MASTER_PLAN_V2_0.md`.

## Инварианты

- Payload — единственный владелец schema/auth/migrations; Prisma запрещён.
- Public UI получает данные только через Public Gateway + explicit select + DTO.
- Secrets, PII и полные database URLs не попадают в git, docs и logs.
- У DON CITY один существующий сервер в Timeweb. До подтверждения identity/access его и БД обследовать только read-only; второй сервер или перенос инфраструктуры не подразумеваются без отдельного решения владельца.
- Production, DNS, destructive migrations и secret mutations требуют отдельной явной команды владельца.
- Task Manager исполняет только exact `APPROVED` graph; текущий v1 import reconciled `CLEAN`, а evidence записывается в его Beads ledger.

## Команды

Фактические runtime-команды берутся только из текущего `package.json`. Не выдумывать команды и не запускать production без отдельного owner intent.
