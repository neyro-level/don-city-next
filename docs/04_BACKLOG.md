# Backlog

Status: Draft
Version: 0.1
Updated: 2026-09-24

## NOW

### REPLAN V4 — city-first contract

Goal: выполнить утверждённый V4 graph без потери закрытых V3 evidence и без
скрытого production scope.

- [x] Private SourceCraft repository `integrator-p/don-city-next` создан.
- [x] Windows checkout привязан к canonical `origin`.
- [x] Product Development Standard 2.0 bootstrap создан.
- [x] Secret Master/Git access names проверены без раскрытия values.
- [x] Dedicated DON CITY SSH access, private NIC, managed PostgreSQL 18, backup posture, capacity and jobs-owner contract verified; authenticated read-only inventory confirms an empty database target. Temporary database credential is in Secret Master and requires rotation before deployment.
- [x] SourceCraft starter access и exact `main` SHA проверены read-only.
- [x] Starter transformation/UI preservation/page completeness contract согласован и внесён в master plan v3.
- [x] Single Timeweb server strategy and Manrope/dark-green design direction внесены в master plan v4.
- [x] OD-01 закрыт: `MERGE_AFTER_GATE` для implementation scope; OD-02 закрыт в пользу одного существующего Timeweb server.
- [x] Final audit exact v5: найден task-graph blocker; v5 не импортировался.
- [x] Re-audit exact v6: `PASS`, task-graph blocker resolved.
- [x] V3 execution остановлен на source drift; WIP EPIC-08 сохранён отдельно.
- [x] City-first revision packet интегрирован в master plan `v7 REVIEW` / product contract `4.0.1`.
- [x] Финальный четырёхпроходный аудит V4 завершён: `READY_WITH_LIMITS`, blockers `0`, unresolved major `0`.
- [x] V4 graph материализован и импортирован: `55` исполняемых эпиков, `265` задач, reconciliation `CLEAN`.
- [x] Получена точная фраза владельца `План утвержден` для exact v7 snapshot.
- [x] Replacement graph reconciled в существующем Beads store и передан Developer.
- [x] RP-00 factual inventory delivered through PR 8, exact-head STANDARD Gate 9 and merge `2520bdc`.
- [x] RP-01 Source of Truth, four ADRs and archive verification delivered through PR 9, exact-head STANDARD Gate 10 and merge `ff2c749`.
- [x] RP-02 Platform/Project split, hardcode/import guards and upstream candidate register implemented and verified; delivery pending exact-head RISKY gate.

## NEXT

1. RP-02 — deliver verified Platform/Project separation through its exact-head RISKY gate.
2. RP-03…RP-07 — typed profile, grammar, geo, resolver and SEO contracts.
3. RP-08…RP-12 — nearby geo, linking, gateway, sitemap and two-profile proof.
4. Resume only remaining V4-adjusted main-line epics.

Подробный порядок и зависимости — master plan §33A и §36.

## LATER

- Оставшиеся незавершённые EPIC-05…47 — public product, runtime quality, staging and release candidate; historical/superseded epics не перезапускаются.
- EPIC-48 — production, only explicit release command.
- EPIC-49 — post-launch Day-60.
- EPIC-50…52 — R2 research and activation.

## Technical Debt

Нет принятого technical debt. Неизвестные infrastructure credentials являются blocker/preflight, а не debt.
