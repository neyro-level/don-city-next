# EPIC-35 — IndexNow / lastmod: preflight

## Решение по scope

EPIC-35 использует уже слитый результат RP-11, а не создаёт второй параллельный
механизм. В текущем `main` уже имеются:

- platform-neutral конструктор payload IndexNow;
- project adapter, принимающий только URL, принадлежащие URL grammar;
- событие для публикации, meaningful update, архива, удаления, `gone` и
  canonical move;
- обязательная пара old/new URL при canonical move только с persisted-canonical
  evidence;
- fixed registry revision и максимум meaningful `updatedAt` для sitemap
  `lastmod`, без request-time timestamp.

## Границы

- Массовая отправка sitemap или всех URL при deploy запрещена.
- Живой IndexNow transport, ключ, DNS, production request и secret mutation не
  входят в EPIC-35: они остаются явным release действием.
- Не создаётся второй event hook или transport без owner-approved operational
  contract и безопасного delivery/outbox механизма.

## Проверяемый результат

`pnpm verify:sitemap-indexnow` доказывает маршрутизацию только затронутых URL,
canonical move old+new, отсутствие неканонических URL и вычисление meaningful
`lastmod`. EPIC-35 добавляет актуальную traceability и повторную проверку на
текущем main.
