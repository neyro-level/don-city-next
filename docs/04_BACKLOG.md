# Backlog

Status: Draft
Version: 0.1
Updated: 2026-09-23

## NOW

### EPIC-00 — Governance / repository / plan readiness

Goal: получить канонический repository, healthy docs map и exact master plan, готовый к owner approval и Task Manager import.

- [x] Private SourceCraft repository `integrator-p/don-city-next` создан.
- [x] Windows checkout привязан к canonical `origin`.
- [x] Product Development Standard 2.0 bootstrap создан.
- [x] Secret Master/Git access names проверены без раскрытия values.
- [x] Dedicated SSH, single Timeweb server, managed PostgreSQL 18, backup posture, capacity and jobs-owner contract verified read-only; SQL inventory awaits a private-network attachment.
- [x] SourceCraft starter access и exact `main` SHA проверены read-only.
- [x] Starter transformation/UI preservation/page completeness contract согласован и внесён в master plan v3.
- [x] Single Timeweb server strategy and Manrope/dark-green design direction внесены в master plan v4.
- [x] OD-01 закрыт: `MERGE_AFTER_GATE` для implementation scope; OD-02 закрыт в пользу одного существующего Timeweb server.
- [x] Final audit exact v5: найден task-graph blocker; v5 не импортировался.
- [x] Re-audit exact v6: `PASS`, task-graph blocker resolved.
- [ ] Импортировать clean APPROVED Task Manager graph и передать Developer.

## NEXT

1. EPIC-01 — isolated fetch + exact starter baseline + frozen-lockfile install.
2. EPIC-02 — DON CITY client activation.
3. EPIC-03/06 — dedicated access recovery and read-only discovery of the one existing Timeweb server, database, inventory and infrastructure.
4. EPIC-04/05 — SEO seed freeze and docs consolidation.
5. EPIC-07…15 — schema/contracts/gateways/SEO resolver.

Подробный порядок и зависимости — master plan §33A и §36.

## LATER

- EPIC-16…47 — public product, runtime quality, staging and release candidate.
- EPIC-48 — production, only explicit release command.
- EPIC-49 — post-launch Day-60.
- EPIC-50…52 — R2 research and activation.

## Technical Debt

Нет принятого technical debt. Неизвестные infrastructure credentials являются blocker/preflight, а не debt.
