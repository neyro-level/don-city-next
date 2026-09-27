# Product Structure

Status: Active
Version: 1.2
Updated: 2026-09-27

## 1. URL Model

- Production origin: `https://doncity-home.ru`.
- `/` — бренд, агентство и основной коммерческий intent.
- `/donetsk/` — вся недвижимость Донецка.
- `/{geo}/{category}/` — город × утверждённая категория вторички: квартиры, дома, земельные участки и коммерческая недвижимость. Канонический маршрут коммерции: `/donetsk/kommercheskaya/`.
- Третий сегмент — район/микрорайон, затем только approved facet; неизвестная комбинация даёт 404.
- Карточка — `/{category}/{semantic}-{publicUrlId}/`; география хранится в данных, а не в identity URL.
- Legacy/alternate URL либо перенаправляется на canonical, либо возвращает 404/410 по lifecycle contract.

Точная grammar/registry хранится в project seeds и master plan; ADR-001, ADR-002 и ADR-004 объясняют устойчивые решения.

## 2. Page Inventory

| Тип | Назначение | Основное действие |
|---|---|---|
| Главная | бренд, доверие, подбор объектов | открыть каталог / оставить заявку |
| `/donetsk/` | весь доступный inventory | фильтровать и открыть объект |
| Категория | квартиры, дома или участки | выбрать объект |
| Коммерческая недвижимость | вторичные коммерческие объекты по фактическому inventory | выбрать объект / оставить заявку |
| Район/facet | релевантная посадочная по подтверждённому inventory | открыть карточку |
| Карточка | характеристики, фото, локация, CTA | связаться по объекту |
| Продавцам | предложение услуги продажи | отправить заявку |
| Юридические услуги | консультация и сопровождение | запросить консультацию |
| Юридический отдел | юридические услуги с подтверждённым составом и содержанием | запросить консультацию |
| Компания/контакты/legal | доверие, NAP, юридическая информация | позвонить/написать |

Все коммерческие страницы сохраняют один логический `h1`, корректные title/description/canonical и определённые loading/empty/error states.

## 3. Navigation and Discovery

Основная навигация ведёт на главную, каталог, активные категории вторички, юридический отдел, компанию и контакты. Квартиры, дома, земельные участки и коммерческая недвижимость получают самостоятельный indexable intent только после data/content gate. Канонические launch-маршруты: `/donetsk/kommercheskaya/` и `/yurist/`; дочерние юридические URL отсутствуют и не индексируются до подтверждённого service/content contract. Карточки связаны с каталогом и географией через breadcrumbs и внутренние ссылки.

Публичные legal-маршруты сейчас ограничены политикой конфиденциальности и
согласием на обработку данных. Условия оказания услуг и managed PDF договора
имеют явный статус `ABSENT`: для них нет URL, footer/navigation/sitemap links и
публичного файла. Переход в `PUBLISHED` требует утверждённого владельцем
содержимого и отдельного изменения URL/file contract.

## 4. Current Catalog

- 12 опубликованных объектов, 92 фотографии.
- 9 квартир.
- 3 дома/объекта с земельными участками.
- 0 отдельных объявлений категории участков; не создавать фиктивный inventory.

Публичные медиа выдаются через контролируемый file route. Анонимный list/read raw коллекции Media запрещён.

## 5. Lead Flows

1. Пользователь приходит на страницу или карточку.
2. Выбирает контактное действие либо заполняет минимальную форму.
3. Lead сохраняется через защищённый intake.
4. Transactional outbox создаёт delivery без PII в diagnostics.
5. Approved adapter доставляет уведомление; до подключения канала flow считается технически реализованным, но операционно незавершённым.

## 6. SEO and Indexability

Production публично индексируется. Page-level registry/content gates определяют, какие canonical URL доступны поиску; read-only HTTP evidence от 2026-09-27 подтверждает индексируемую homepage, crawl-allowed `robots.txt` и sitemap. Это наблюдение не подменяет exact deployed identity и release evidence.

Первые четыре месяца после открытия индексации индексируются только вторичные квартиры, дома, земельные участки, коммерческая недвижимость и утверждённые страницы юридического отдела. `novostroyki`/ЖК остаются disabled/noindex, отсутствуют в sitemap и индексируемой навигации; `/novostroyki/*` и `/komplex/*` только резервируются до отдельного review.

Pagination page 2+ использует self-canonical и `noindex,follow`. Search/query combinations вне approved registry не индексируются. Sitemap и IndexNow публикуют только разрешённые registry/content-gate URL.

## 7. Canonical NAP in Runtime

- Бренд: ДОН СИТИ.
- Юридическое имя: Индивидуальный предприниматель Плахтиенко Наталья Геннадьевна.
- Телефон: +7 (949) 110-10-10.
- Email: doncity-info@yandex.com.
- Адрес: ДНР, Донецк, бульвар Шахтостроителей, 16.
- Часы: ежедневно 09:00–18:00.

Это текущее runtime-значение. Evidence-статус —
`PENDING_EXTERNAL_VERIFICATION`; требуются именованные подтверждения владельца
и Yandex Business. До их получения документы и runtime не называют NAP внешне
проверенным.

## 8. Content Ownership

- Payload: объекты, география, listing content, pages, media, redirects и site settings.
- Project config/seeds: URL grammar, page registry, allowed facets и platform profile.
- Public Gateway: publication/filter/select contract и DTO.
- Операционные документы: фактические release identity, indexing, backup, jobs и availability state.
