# Backlog

Status: Active
Version: 1.3
Updated: 2026-09-28

## Delivered

- [x] Product Development Standard 2.0 и approved V4 contract.
- [x] SourceCraft primary repository, manual exact-head gates и CRITICAL release contract.
- [x] Next.js + Payload foundation, Platform/Project split, Site Profile и URL grammar.
- [x] География, Public/System/Ingest gateways, каталог, карточки и lifecycle.
- [x] Feed/import isolation, leads/outbox/delivery, SEO registry, sitemap и IndexNow contracts.
- [x] Public UI, accessibility, responsive states, cache/invalidation и runtime health.
- [x] Historical isolated candidate proof completed; its temporary database proof is not a second persistent environment.
- [x] Production Compose/Nginx/TLS, managed PostgreSQL/S3 secrets и manual SourceCraft release workflow.
- [x] Historical exact-main noindex rollout `cd5c743912650525f84d2d110e6a43c4e6c6e35d`, premium brand assets and rollback point.
- [x] 12 VK-derived listings and 92 photos imported and verified: 9 apartments, 3 houses/land-attached.
- [x] Temporary restore database/rehearsal cleaned; host temp artifact, stale compose backups, old image and excess journals cleaned.
- [x] Active product documentation reconciled with code and runtime.

## NOW — Live Conformance v13

- [x] Owner approved exact Plan ID `AMS-DON-CITY-LIVE-CONFORMANCE` v13 at `2026-09-27T21:09:12+03:00`.
- [x] Canonical v12→v13 non-destructive Upgrade passed in the one existing Beads store: 22/22 epics, 84 tasks, 106 managed nodes, zero drift/cycles.
- [x] Production remains the mandatory final stage, has no autonomous task and requires a separate explicit release command.
- [x] Execute the implementation Beads ready-loop through all R11/R12/UI/OPS delivery epics. Beads remains the only per-task execution state.
- [x] Converge active docs, catalog/geo/SEO/legal/UI contracts and final exact-head documentation evidence in dependency order.

Earlier CP-01…CP-08 evidence remains delivered history. It is not the current
program and does not create a persistent staging database or a second task graph.

## v13 Delivery Order

1. W0: DOC-00, OPS-00 and the read-only inventory diagnostic establish factual contracts.
2. W1–W3: catalog/geo/SEO/legal/UI implementation follows the exact dependencies in the approved plan.
3. W4: locality activation was owner-approved for Макеевка and delivered with only hub, apartments, houses and land routes.
4. W5: `DC11-DOC-FINAL` proves the exact candidate and active-document convergence.
5. W6: `DC11-PROD-FINAL` is mandatory and last; it requires a separate release command and no task follows it.

## Open Production Readiness

1. Создать первого production owner через безопасную bootstrap-команду.
2. Выбрать и подключить независимый alert/delivery channel; проверить redacted lead delivery.
3. Проверить canonical NAP по внешним источникам и подтвердить владельцем.
4. Сохранить реальный feed disabled, пока не предоставлены проверенный URL/allowlist и дата включения.
5. Найти подтверждённые отдельные объявления участков либо оставить категорию без фиктивного inventory.

## Final Production Gate

1. Завершить весь implementation graph и `DC11-DOC-FINAL` на exact candidate SHA.
2. Подтвердить jobs ownership, backup/restore, health/availability, rollback и Secret Master access до release.
3. Получить отдельную явную production-команду владельца.
4. Выпустить один exact-main artifact, выполнить один rollout и bounded live smoke внутри final stage.
5. После `DC11-PROD-FINAL` не создавать monitoring, observation, reconciliation или follow-up task.

## LATER

- Через четыре календарных месяца после фактического включения публичной индексации: review первоначального scope. Дату вычислить и зафиксировать как `PUBLIC_INDEXING_ENABLED_AT + 4 months`; новостройки/ЖК не включать без нового owner-approved plan.
- R2 research: `novostroyki`, `journal`, `agents`; включение только отдельным contract/epic.
- Масштабирование географии — только после business/evidence решения и MULTI_GEO proof.

## Technical Debt / Known Drift

- `clientReadinessConfig` подтверждает Nginx, один jobs runtime и automatic backup;
  `externalMonitoring` остаётся fail-closed до отдельного доказанного решения.
- Authenticated health имеет статус `ok`; durable DB/media backup freshness и
  sampled restore подтверждены DC10-OPS-00.
- Старые локальные ветки/worktrees могут содержать уникальные или dirty изменения; их нельзя удалять силой без отдельной сверки/решения.
