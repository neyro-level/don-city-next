# DON CITY — project router

## Контекст

- Platform: AMS Realty Platform Core 3.0 + Payload Platform.
- Profile: `catalog`, `BUILD`, `DELIVERY_PROFILE=CRITICAL`.
- Repository mode: `SOURCECRAFT_PRIMARY_GITHUB_MIRROR`.
- UX: public commercial catalog + CMS-native Payload Admin.

## Порядок чтения

1. Глобальный `~/.codex/AGENTS.md`.
2. `docs/README.md`.
3. Текущий scope в `01_PRD.md`, `02_PRODUCT_STRUCTURE.md`, `03_ARCHITECTURE.md`.
4. `docs/DELIVERY_STATE.yaml` и READY task в `04_BACKLOG.md`.
5. Детальный execution contract: `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V3_0.md`.

## Инварианты

- Payload — единственный владелец schema/auth/migrations; Prisma запрещён.
- Public UI получает данные только через Public Gateway + explicit select + DTO.
- Secrets, PII и полные database URLs не попадают в git, docs и logs.
- У DON CITY один существующий сервер в Timeweb. До подтверждения identity/access его и БД обследовать только read-only; второй сервер или перенос инфраструктуры не подразумеваются без отдельного решения владельца.
- Production, DNS, destructive migrations и secret mutations требуют отдельной явной команды владельца.
- Task Manager import запрещён до exact `APPROVED` master plan.

## Команды

Фактические runtime-команды появляются после EPIC-01 и берутся только из `package.json`. Не выдумывать их до клонирования starter baseline.
