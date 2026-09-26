# Backlog

Status: Active
Version: 1.0
Updated: 2026-09-26

## Delivered

- [x] Product Development Standard 2.0 и approved V4 contract.
- [x] SourceCraft primary repository, manual exact-head gates и CRITICAL release contract.
- [x] Next.js + Payload foundation, Platform/Project split, Site Profile и URL grammar.
- [x] География, Public/System/Ingest gateways, каталог, карточки и lifecycle.
- [x] Feed/import isolation, leads/outbox/delivery, SEO registry, sitemap и IndexNow contracts.
- [x] Public UI, accessibility, responsive states, cache/invalidation и runtime health.
- [x] Isolated staging: database, S3 prefix, Nginx/TLS и global noindex.
- [x] Production Compose/Nginx/TLS, managed PostgreSQL/S3 secrets и manual SourceCraft release workflow.
- [x] Exact-main production rollout `31367bfe4adf476925eca97b5dcb13088e31191e`, global noindex и rollback point.
- [x] 12 VK-derived listings and 92 photos imported and verified: 9 apartments, 3 houses/land-attached.
- [x] Temporary restore database/rehearsal cleaned; host temp artifact, stale compose backups, old image and excess journals cleaned.
- [x] Active product documentation reconciled with code and runtime.

## NOW — Production Readiness

1. Создать первого production owner через безопасную bootstrap-команду.
2. Выбрать и подключить независимый alert/delivery channel; проверить redacted lead delivery.
3. Подключить внешний uptime monitoring вне production server.
4. Закрыть media backup/versioning и sampled restore evidence; вывести DB/media freshness в health.
5. Проверить canonical NAP по внешним источникам и подтвердить владельцем.
6. Сохранить реальный feed disabled, пока не предоставлены проверенный URL/allowlist и дата включения.
7. Найти подтверждённые отдельные объявления участков либо оставить категорию без фиктивного inventory.

## NEXT — Indexing Decision

1. Выполнить production crawl и проверить canonical/robots/sitemap/structured data.
2. Подтвердить queue movement, alerts, backup freshness и rollback readiness.
3. Получить отдельное разрешение владельца на снятие global noindex.
4. Выпустить один exact-main indexing release и повторить live smoke.

## LATER

- Post-launch Day-60 review и retention cleanup.
- R2 research: `novostroyki`, `journal`, `agents`; включение только отдельным contract/epic.
- Масштабирование географии — только после business/evidence решения и MULTI_GEO proof.

## Technical Debt / Known Drift

- `clientReadinessConfig` намеренно остаётся fail-closed по Nginx/backup/monitoring до полного operational evidence.
- Health имеет статус `degraded`, пока отсутствуют durable `backup_db` и `backup_media` freshness signals.
- Старые локальные ветки/worktrees могут содержать уникальные или dirty изменения; их нельзя удалять силой без отдельной сверки/решения.
