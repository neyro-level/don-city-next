# EPIC-17 — Navigation shell verification

Дата: 2026-09-24
Ветка: `codex/epic-17-navigation-shell`
Проверяемый commit: `185b512cdaba5ac5461eb58628cb77a0bab0e566`

## Матрица acceptance

| Требование | Результат | Доказательство |
| --- | --- | --- |
| Точное R1-меню на desktop/mobile | PASS | `buildR1Navigation()` выдаёт `/donetsk/`, `/donetsk/kvartiry/`, `/donetsk/doma/`, `/donetsk/uchastki/`; скрипт `verify:navigation-shell` запрещает `novostroyki`, `ipoteka` и `arenda`. |
| Логотип, текущий раздел, фокус и клавиатура | PASS | Логотип ведёт на `/`; текущий путь нормализуется в `PublicSiteHeader`; у текущей ссылки есть `aria-current`; группы используют нативные `details/summary`, все интерактивные ссылки имеют `focus-visible`-стиль. |
| NAP в header/footer через безопасный DTO | PASS | Header получает Shell DTO с сервера, footer выводит только `footer.contacts`; verifier проверяет телефон, email и канонический contacts URL. |
| Нет R2/donor ссылок и нарушения data boundary | PASS | Публичный layout остаётся server-side gateway consumer; клиентский компонент читает только pathname. `verify:navigation`, `verify:gateway-context`, typecheck и architecture guard зелёные. |

## Выполненные проверки

- `pnpm verify:navigation-shell` — PASS;
- `pnpm verify:navigation` — PASS, 13 canonical targets;
- `pnpm verify:gateway-context` — PASS;
- `pnpm typecheck` — PASS;
- scoped Biome lint и `git diff --check` — PASS;
- `pnpm quality:architecture` — PASS, 447 modules / 1347 dependencies;
- dependency impact trace — ограничен `layout → PublicSiteHeader → StarterSiteHeader`.

## Ограничение

Production/staging браузерная проверка не выполнялась: EPIC-17 не разрешает deploy или инфраструктурные изменения. Её покрывает поздний UI/SEO QA перед release.

## Traceability

- source instruction: `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md#EPIC-17`;
- implementation head: `185b512cdaba5ac5461eb58628cb77a0bab0e566`;
- verification/evidence head: `a1371df752b668b68bf2533cb9f98c9b583fe497`;
- reusable test entry: `pnpm verify:navigation-shell`.

The implementation preserves the starter visual shell where compatible. R1
information architecture remains owned by the project Profile/navigation model;
no donor route, public client data access, or secret-bearing configuration was
introduced by this epic.
