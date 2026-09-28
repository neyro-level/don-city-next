# Product Requirements Document

Status: Active
Version: 1.3
Updated: 2026-09-28

## 1. Product Summary

«ДОН СИТИ» — публичный сайт и управляемый каталог вторичной недвижимости Донецка. Продукт объединяет витрину объектов, страницы агентства и услуг, сбор заявок и CMS для владельца.

## 2. Business Goal

- Публиковать актуальный и проверяемый inventory агентства.
- Получать обращения на покупку, продажу и юридическое сопровождение.
- Развивать устойчивую city-first SEO-структуру без дублей страниц.
- Сохранять безопасную границу между публичным сайтом, CMS, PII и системными интеграциями.

## 3. Users

- Покупатель недвижимости.
- Продавец объекта.
- Клиент юридических услуг.
- Владелец/редактор каталога в Payload Admin.
- Оператор, контролирующий импорт, заявки, delivery и recovery.

## 4. R1 Scope

- Главная и каталог вторичной недвижимости Донецка: квартиры, дома, земельные участки и коммерческая недвижимость.
- Районные и разрешённые facet-страницы по реальному inventory.
- Карточка объекта с медиагалереей и формой обращения.
- Страницы продавца, юридического отдела и его утверждённых услуг, компании, контактов и правовой информации.
- Payload Admin: объекты, география, контент, медиа, feed/import, заявки и delivery.
- Safe ingest, lifecycle, SEO registry, sitemap/IndexNow, health и jobs.
- Production через immutable image, host Nginx/TLS, managed PostgreSQL и private object storage.

В первые четыре месяца после открытия индексации `novostroyki`/ЖК остаются выключенными и неиндексируемыми. Их URL-пространства резервируются, но не попадают в sitemap и индексируемую навигацию. Решение об активации принимается отдельным review после четырёх месяцев. Модули `journal` и `agents` также остаются выключенными до отдельного решения.

## 5. Current Production State

- Production live и публично индексируется: read-only HTTP evidence от 2026-09-27 подтверждает индексируемую homepage, crawl-allowed `robots.txt` и sitemap.
- Exact deployed SHA/image текущего публичного состояния требует release evidence; не выводить его из прежнего noindex release.
- Последний документированный baseline — 12 опубликованных объектов и 92 фотографии: 9 квартир и 3 дома/объекта с земельными участками. `DC10-R11-00` устанавливает текущие counts без production mutation.
- Источник первых объявлений — официальная группа DON CITY во VK; provenance хранится в импортированных данных.
- Реальный feed отключён. Заявки не должны считаться операционно готовыми до подключения независимого delivery/alert channel.

## 6. Functional Acceptance

- Public UI читает только DTO через Public Gateway и не получает raw Payload documents.
- Неопубликованный, архивный или удалённый объект возвращает установленный lifecycle-ответ.
- Формы валидируются, rate-limit применён, PII не попадает в логи/аналитику.
- Импорт идемпотентен, изолирован по source и не деактивирует объекты без threshold/approval.
- Один production runtime владеет jobs; disposable proof runtime не запускает параллельный polling.
- SEO metadata, canonical и structured data соответствуют page contract; публичная индексация не отменяет registry/content gates и `noindex,follow` для pagination page 2+.

## 7. Non-Functional Requirements

- `DELIVERY_PROFILE=CRITICAL`: exact-head review/gate, backup/restore и rollback evidence обязательны.
- Секреты хранятся только в Secret Master и никогда не фиксируются в git/docs/logs.
- Production host не собирает приложение и не выполняет `git pull`.
- Доступность, queue movement, backup freshness и delivery контролируются без раскрытия PII.
- Основные public flows доступны с клавиатуры и на мобильных разрешениях.

## 8. Current Risks and Blockers

- Первый production owner ещё не создан.
- Независимый alert/delivery channel не подтверждён.
- DB и media backup freshness, isolated restore и sampled media restore подтверждены; новый release обязан привязать их к exact-main evidence.
- Канонический NAP заполнен в runtime, но требует проверки владельцем по внешним источникам.
- Реальный feed и allowlists намеренно отключены до предоставления проверенных endpoints.
- Для полноценной категории участков нужен отдельный подтверждённый inventory.

## 9. Success Criteria

Успех текущей программы: фактическая индексируемая поверхность соответствует registry/content gates, обращения и delivery не раскрывают PII, inventory остаётся актуальным, а exact release identity и rollback доказуемы. Никакой отдельный monitoring/follow-up этап после финального production не создаётся.

## 10. Open Owner Decisions

- Канонический NAP после внешней проверки.
- Канал уведомлений и получатель заявок.
- Реальный feed и дата его включения.
- Дочерний SEO/URL registry юридических услуг после подтверждения фактического service/content scope. Канонические launch-маршруты уже зафиксированы: коммерция `/donetsk/kommercheskaya/`, юридический отдел `/yurist/`.
