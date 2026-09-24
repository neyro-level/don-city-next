# RP-01 preflight — V4 Source of Truth / ADR / archive verification

Status: `PASS`
Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST` `v7 APPROVED`
Task: `dcv4-task-54-preflight`
Base: `main@2520bdcab19569882de24a308ffffbe92d488602`

## Цель и границы

RP-01 закрепляет V4 как единственный активный execution/SEO/data contract,
оформляет четыре долговечных решения в ADR, явно помечает V3 как
`SUPERSEDED` и разделяет активные документы от исторических evidence-файлов.

В scope входят только документы: `docs/README.md`, Product Structure,
Architecture, Backlog, Release Checklist, changelog, `docs/adr/**`, архив и
карта research evidence. Код, schema, migrations, Payload, сервер, DNS,
секреты, база данных и production не изменяются.

## Входные условия

- V4 `v7` утверждён владельцем, exact validation/import/reconciliation —
  `CLEAN`.
- RP-00 закрыт и доставлен в `main` через PR 8 и exact-head STANDARD Gate 9.
- Архивный V3 snapshot существует, но внутри файла ещё имеет статус
  `APPROVED`, поэтому acceptance RP-01 пока не выполнен.
- Каталог `docs/adr/` и changelog отсутствуют; четыре решения существуют
  только внутри master plan.
- `docs/README.md` всё ещё говорит, что graph ожидает approval/import, хотя
  этот этап уже завершён.
- Файлы `docs/research/**` являются историческими execution evidence, но их
  статус относительно V4 явно не описан.

## План проверки

1. Создать ADR-001…ADR-004 без дублирования полного master plan.
2. Обновить карту Source of Truth и ссылки Product Structure/Architecture.
3. Пометить сам V3 snapshot как `SUPERSEDED`, затем обновить его контрольный
   hash в archive index.
4. Создать changelog и карту historical research evidence.
5. Проверить активные документы на владельцев category-first URL, старый
   execution status и ссылки на несуществующий активный V3 plan.
6. Зафиксировать acceptance matrix и exact Task Manager evidence.

## Stop conditions

- Любое изменение approval или Beads authority V4.
- Необходимость менять runtime, schema или данные.
- Production, DNS, server, database или secret mutation.
- Невозможность сохранить исторические evidence без переписывания фактов.
