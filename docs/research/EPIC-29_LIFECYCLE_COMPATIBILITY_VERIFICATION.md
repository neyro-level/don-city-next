# EPIC-29 — Lifecycle / donor route compatibility: verification

**Plan:** `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`

| Acceptance condition | Evidence | Verdict |
| --- | --- | --- |
| Активная карточка доступна по своему каноническому пути. | `verify:property-lifecycle-routes` проверяет `200`, `index` и совпадение canonical path с `property.href`. | PASS |
| Архивная карточка сохраняется по каноническому URL, но не индексируется. | Тот же тест проверяет `200`, `noindex` и canonical path для lifecycle `archived`. | PASS |
| Неканоническая category/semantic вариация ведёт одним редиректом на канонический адрес. | Тест проверяет точный `301` на `property.href`; существующий `verify:route-resolver` покрывает semantic и category mismatch. | PASS |
| Очищенный объект без назначения не остаётся как «мягкая» страница. | Тест проверяет `410` для lifecycle `gone`. | PASS |
| Неизвестный объект не получает ложный редирект. | Тест проверяет `404` для несуществующего `publicUrlId`. | PASS |
| Явное назначение lifecycle соблюдается. | Тест проверяет сохранённый контракт `308` только для lifecycle `redirect`. | PASS |
| Donor `/obekty/[slug]` не дублирует каноническую карточку. | Без подтверждённой legacy-карты маршрут возвращает `404`; это явно проверено. | PASS |

Дополнительно прошли `pnpm verify:public-url-id`, `pnpm typecheck` и `git diff --check`.

Ни Payload schema, ни migration, ни production/DNS, ни секреты не менялись.
