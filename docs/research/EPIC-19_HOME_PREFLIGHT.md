# EPIC-19 — HOME: preflight

## SEO owner

У главной страницы один SEO owner — строка `HOME` утверждённого registry.
Её точные title, description, canonical `/`, `index,follow` и H1 не должны
зависеть от редактируемого значения CMS Pages.

## Product intent

H1 и metadata фиксируют intent агентства/бренда: «Агентство недвижимости
„ДОН СИТИ“ в Донецке». Контент CMS может использоваться для последующих
редакционных блоков, но не заменяет этот контракт.

## Проверка

`pnpm verify:home-page` подаёт заведомо конфликтующие CMS-данные и подтверждает,
что DTO возвращает только registry-owned metadata и H1.
