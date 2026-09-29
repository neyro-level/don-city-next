# AMS DON CITY — FINAL CONFORMANCE & DOCUMENTATION MASTER PLAN v4.0

**Document type:** финальное техническое задание на корректировку проектной конституции, полной документации, кода, SEO и UI с обязательной синхронизацией по exact SHA  
**Date:** 2026-09-27  
**Target:** `don-city-next`  
**Canonical repository:** SourceCraft primary, GitHub mirror  
**Technical baseline:** AMS Realty Platform Core Standard 5.5 — Solo + AI  
**UI baseline:** AMS UI Core v5.0  
**Product baseline:** AMS FINAL MASTER PLAN — DON CITY v4.0 + текущие owner decisions  
**Production mode:** LIVE / PUBLIC INDEXING ENABLED

---

# 0. ЦЕЛЬ

Привести DON CITY к единому непротиворечивому production-state:

- полноценный боевой сайт с открытой индексацией;
- вторичная продажа: квартиры, дома, земельные участки, коммерческая недвижимость;
- страницы услуги продажи недвижимости;
- страница юриста;
- страница «О компании»;
- страница «Контакты»;
- обязательные юридические документы;
- районы Донецка;
- корректная поддержка объектов в пригороде/агломерации Донецка до ~50 км без ложного присвоения географии `Донецк`;
- новостройки/ЖК и ипотека архитектурно зарезервированы, но публично не активируются ближайшие 4–6 месяцев;
- UI приведён к AMS UI Core v5.0 без параллельных foundations и speculative public modules.

Это ТЗ **заменяет предыдущие remediation-планы как инструкция на корректировку Master Plan**, но не заменяет сам проектный Master Plan. После выполнения этого задания единственным активным project Source of Truth должен оставаться:

`docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md`

---

# 1. ПРИОРИТЕТ ИСТОЧНИКОВ

При конфликте использовать следующий порядок:

1. явные решения владельца из этого документа;
2. AMS Realty Platform Core Standard 5.5;
3. AMS UI Core v5.0;
4. `AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md`;
5. фактический production/repository state;
6. supporting evidence / SEO seeds / audit reports.

Нельзя молча изменять owner decisions ради сохранения старого текста Master Plan.

---


# 1A. DOCUMENTATION CONSTITUTION / ОБЯЗАТЕЛЬНАЯ СИНХРОНИЗАЦИЯ

Документация является частью deliverable и проверяется так же строго, как код.

## 1A.1 Активный набор документов

После завершения работ активная проектная документация должна иметь однозначные роли.

| Документ | Единственная ответственность |
|---|---|
| `docs/01_PRD.md` | продукт, пользователи, business goals, R1/R2 scope, success criteria, owner decisions |
| `docs/02_PRODUCT_STRUCTURE.md` | page inventory, URL/navigation model, discovery, SEO/indexability policy, public surface |
| `docs/03_ARCHITECTURE.md` | runtime, data/security boundaries, modules, topology, jobs/cache, technical constraints |
| `docs/PROJECT.md` | фактический project profile/config: domain, AMS_PROFILE, active/prepared modules, retention, cache, NAP, indexing mode |
| `docs/OPERATIONS.md` | фактический production/staging runtime, exact deployed SHA/image, backup/restore, monitoring, rollback, jobs ownership, incidents |
| `docs/DESIGN.md` | единственная активная project UI/design policy по AMS UI Core v5.0 |
| `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md` | единственная подробная project constitution: geo, URL grammar, SEO registry rules, Content Gate, epics, acceptance |
| `docs/04_BACKLOG.md` | только актуальная очередь работ и открытый technical debt; не дублирует архитектуру |
| `docs/05_RELEASE_CHECKLIST.md` | только текущий release gate / live acceptance |
| `docs/DELIVERY_STATE.yaml` | machine-readable фактический delivery/runtime state и exact release identity |
| `docs/README.md` | навигация по Source of Truth + краткий текущий статус |
| `docs/CHANGELOG.md` | история решений/изменений, не текущий нормативный контракт |
| `docs/seo/*.csv` | materialized SEO data; не самостоятельный нормативный источник правил |
| `docs/adr/*` | только труднообратимые архитектурные решения/исключения |
| `docs/research/*`, `docs/replan/*`, `docs/archive/*` | evidence/history; не текущий status/source of truth |

`docs/06_DESIGN_SYSTEM.md` остаётся `SUPERSEDED` pointer и не превращается обратно во второй design source.

---

## 1A.2 Главное правило документации

```text
ONE FACT → ONE OWNER DOCUMENT
```

Другие документы могут ссылаться на факт, но не должны поддерживать конкурирующую нормативную копию.

Примеры:

```text
URL grammar / Content Gate
-> Master Plan

current production SHA / image
-> OPERATIONS + DELIVERY_STATE

product scope
-> PRD

public page inventory / navigation
-> PRODUCT_STRUCTURE

technical topology / boundaries
-> ARCHITECTURE

actual project config / indexing mode
-> PROJECT

visual policy
-> DESIGN
```

Запрещено:

- одновременно хранить разные значения Content Gate в Master Plan, PRD и Backlog;
- хранить разные статусы commercial/newbuild между PRD, PROJECT и Master Plan;
- писать `LIVE_NOINDEX` в одном документе и `productionIndexing=public` в другом;
- хранить hard-coded inventory counts как вечный нормативный факт;
- дублировать точный SEO registry вручную в нескольких active docs.

---

## 1A.3 CURRENT vs TARGET

На первом documentation pass разрешено привести документы к новому **целевому контракту**, но нельзя выдавать ещё не реализованный код за факт.

Использовать явную маркировку:

```text
CURRENT
TARGET
IMPLEMENTATION STATUS
PROOF
```

Пример:

```text
TARGET:
contentGate.minActive = 3

CURRENT:
legacy tier thresholds still exist in code

IMPLEMENTATION STATUS:
PENDING EPIC R1.1-04
```

После закрытия эпика `CURRENT` обновляется на фактическую реализацию и прикладывается exact proof.

---

## 1A.4 Обнаруженный documentation drift — ОБЯЗАТЕЛЬНО исправить

На текущем `main` найдены расхождения.

### `docs/01_PRD.md`

Сейчас ошибочно/устарело:

- production описан как global `noindex`;
- success criteria говорят «до снятия noindex»;
- noindex остаётся open owner decision;
- nearby/agglomeration model отсутствует;
- новый единый gate `>=3` отсутствует;
- legal terms/contract page отсутствует;
- future horizon описан только как 4 месяца, owner decision теперь 4–6 месяцев.

Исправить PRD так, чтобы:

```text
production = LIVE_PUBLIC
secondary sale = apartment + house + land + commercial
SELL / LAWYER / ABOUT / CONTACTS = active
Donetsk districts + agglomeration = product scope
newbuild/ЖК + mortgage = PREPARED_OFF 4–6 months
```

---

### `docs/02_PRODUCT_STRUCTURE.md`

Исправить:

- global-noindex policy;
- page inventory: добавить commercial как равноправную active category;
- добавить `/usloviya-raboty/` как conditional legal page;
- описать Donetsk districts;
- описать agglomeration/nearby без смешения с Donetsk;
- navigation whitelist;
- `Content Gate >=3 + content quality`;
- убрать hard-coded snapshot counts из нормативного раздела либо маркировать их `OBSERVED SNAPSHOT <date>`;
- SEO/indexability привести к OD-04…OD-07.

---

### `docs/03_ARCHITECTURE.md`

Исправить:

- `Current conformance status` по фактическому итоговому состоянию после remediation;
- active category list — включить commercial;
- убрать `global production noindex` как architecture fact;
- `DNS, снятие noindex ... require owner decision` удалить как устаревшее;
- добавить agglomeration extension существующего geo model, без второй geo collection;
- зафиксировать persistent anti-flicker gate state без mutation из public GET;
- отразить единственный canonical shell/UI boundary после UI remediation;
- сохранить AMS Core 5.5 invariants без ослабления.

---

### `docs/PROJECT.md`

Исправить фактический project profile:

```text
productionIndexing = public
commercial = ACTIVE
newbuild = PREPARED_OFF
mortgage public surface = PREPARED_OFF / reserved
contentGate.minActive = 3
contentGate.graceDays = 30
agglomerationRadiusKm = 50
```

Добавить owner-approved/verified geo whitelist только после research/approval.

Удалить формулировки, что indexing blocked/disabled.

---

### `docs/OPERATIONS.md`

Обновить только фактические live данные:

- `LIVE_PUBLIC`;
- exact deployed SHA/image после релиза;
- robots/crawl state;
- actual jobs owner;
- actual backup/monitoring status;
- production crawl result;
- rollback point.

Не переносить сюда URL registry/SEO templates.

---

### `docs/04_BACKLOG.md`

Переписать `NOW`:

```text
TRACK OPS
R1.1 HOTFIX
R1.2 CONFORMANCE
SEO AGGLOMERATION RESEARCH
```

Удалить отдельный `Production Indexing Gate` как ещё не разрешённое действие.

Indexing уже включён; backlog должен описывать remediation публичного production.

---

### `docs/05_RELEASE_CHECKLIST.md`

Изменить статус:

```text
production LIVE_PUBLIC
```

Удалить:

```text
Do not enable indexing...
Required Before Indexing...
```

Разделить на:

```text
R1.1 HOTFIX RELEASE GATE
R1.2 CONFORMANCE RELEASE GATE
ONGOING OPS REQUIREMENTS
```

`PUBLIC_INDEXING_ENABLED_AT` записать как фактическое значение из release evidence, не придумывать дату.

---

### `docs/README.md`

Сделать коротким navigator документом.

Исправить:

- `global noindex`;
- текущий scope;
- commercial;
- public indexing;
- список active Source of Truth.

README не должен дублировать подробный backlog/SEO contract.

---

### `docs/DELIVERY_STATE.yaml`

После каждого production release обновлять:

```text
production.status
production.indexing
exact_main_sha
image_tag
artifact_sha256
release/gate evidence
health
blockers
```

Финальный target:

```text
production.status: LIVE_PUBLIC
production.indexing: public
```

Нельзя оставлять SHA старого релиза после нового deploy.

---

### `docs/DESIGN.md`

После UI remediation обновить:

- canonical shell owner;
- удалённые/сохранённые exceptions;
- lightbox decision;
- representative page;
- UI conformance status.

Числовые design values по-прежнему только в `src/app/globals.css`.

---

### `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md`

Это главный документ, который GPT должен привести к новому owner contract.

Обязательно переписать:

- production = LIVE_PUBLIC;
- commercial = ACTIVE;
- P1/P2/TEST thresholds больше не определяют indexability;
- `Content Gate minActive=3`;
- grace 30 дней;
- persistent gate state;
- 9 районов Донецка;
- Текстильщик сохраняется как approved SEO microdistrict candidate;
- agglomeration/nearby contract;
- `/usloviya-raboty/`;
- current/future public-surface whitelist;
- newbuild/ЖК + mortgage = deferred 4–6 months;
- final release order;
- new documentation epics / DoD.

Исторические sections можно сохранить в changelog/history, но активная нормативная часть не должна противоречить owner decisions.

---

### `docs/seo/SEO_REGISTRY_SEED.csv`

После изменения Master Plan:

- regenerated/materialized from current registry contract;
- commercial rows corrected;
- minActiveObjects = 3 для GATED_INDEX;
- legal conditional page row only when contract допускает materialization;
- nearby rows создаются только после SEO research/owner approval;
- URLs только из `buildUrl`;
- no duplicate normative rules in CSV.

---

### `docs/seo/DISTRICT_REGISTRY_SEED.csv`

Обязательно:

- все 9 administrative districts;
- падежи;
- synonyms;
- Textilshchik contract;
- no invented Wordstat data;
- indexing priority отдельно от inventory gate.

---

## 1A.5 Documentation workflow — обязательный порядок

### DOC-EPIC-00 — Initial Source-of-Truth reconciliation

**Выполняется ДО первого кодового remediation epic.**

Задачи:

1. построить matrix:

```text
FACT
OWNER DOCUMENT
CURRENT VALUE
TARGET VALUE
CODE OWNER
STATUS
```

2. обновить активные документы до нового TARGET contract;
3. каждую ещё не реализованную вещь пометить `PENDING <EPIC>`;
4. удалить прямые нормативные противоречия;
5. не менять historical evidence как будто оно всегда описывало новый state.

Выход:

```text
docs/replan/DOCUMENTATION_CONVERGENCE_BASELINE.md
```

Этот файл = evidence, не новый Source of Truth.

---

### DOC-EPIC-01 — Documentation impact per implementation PR

Каждый PR/эпик обязан содержать:

```text
DOC IMPACT:
- documents changed
- documents reviewed/no change required
- Source of Truth owner
- CURRENT/TARGET transition
```

Если код меняет:

- URL;
- SEO;
- schema;
- public surface;
- module state;
- indexing;
- UI foundation;
- runtime;
- production operation;

то соответствующая active документация обновляется **в том же PR**.

Epic нельзя закрыть с `DONE`, если active docs описывают старое поведение.

---

### DOC-EPIC-02 — Pre-release exact-head documentation audit

После всех кодовых эпиков релиза и ДО production:

Проверить:

```text
Master Plan
PRD
Product Structure
Architecture
PROJECT
OPERATIONS candidate section
DESIGN
Backlog
Release Checklist
SEO seeds
```

против exact candidate SHA.

Результат:

```text
0 P0 documentation contradictions
0 P1 documentation contradictions
```

`OPERATIONS`/`DELIVERY_STATE` не должны заранее утверждать deploy, которого ещё не было.

---

### DOC-EPIC-03 — Post-production reconciliation

Сразу после production live proof:

Обновить фактические документы:

```text
OPERATIONS
DELIVERY_STATE
RELEASE_CHECKLIST
BACKLOG
README
CHANGELOG
```

Записать:

- exact deployed SHA;
- immutable image/artifact;
- actual indexing state;
- live crawl result;
- actual sitemap/robots;
- jobs owner;
- rollback point;
- backup/monitoring state;
- known residual risks.

---

## 1A.6 Mechanical documentation guards

Добавить/расширить проверки.

### `quality:docs-sot`

Должен падать, если одновременно обнаружены конфликтующие active claims:

```text
LIVE_NOINDEX vs LIVE_PUBLIC
productionIndexing=noindex vs public
commercial PREPARED_OFF vs ACTIVE
minActive 5/10 vs 3
newbuild ACTIVE during current phase
```

### `verify:docs-links`

Проверить:

- active docs links exist;
- superseded docs clearly marked;
- active README points to current docs only.

### `verify:docs-release-state`

Проверить coherence:

```text
PROJECT.productionIndexing
DELIVERY_STATE.production.indexing
OPERATIONS runtime state
Release Checklist status
```

### `verify:seo-doc-contract`

Проверить:

```text
Master Plan Content Gate
site profile Content Gate
SEO seed minActive
runtime registry
```

на равенство.

Не проверять исторические evidence/archive как текущий contract.

---

## 1A.7 Documentation Definition of Done

Перед финальным закрытием проекта:

```text
[ ] PRD соответствует фактическому public product scope
[ ] Product Structure соответствует URL/menu/indexability
[ ] Architecture соответствует фактическим boundaries/topology/modules
[ ] PROJECT соответствует runtime config
[ ] OPERATIONS соответствует live production
[ ] DESIGN соответствует реально используемому UI foundation
[ ] Master Plan содержит единственный актуальный SEO/geo contract
[ ] Backlog содержит только незакрытую/текущую работу
[ ] Release Checklist соответствует текущему релизу
[ ] DELIVERY_STATE содержит exact live SHA/image/status
[ ] README не содержит stale status
[ ] SEO seeds соответствуют registry/buildUrl/gate
[ ] research/replan/archive не выдаются за active Source of Truth
[ ] 0 противоречий LIVE_PUBLIC/LIVE_NOINDEX
[ ] 0 противоречий ACTIVE/PREPARED_OFF
[ ] 0 противоречий Content Gate
[ ] 0 дублирующих нормативных URL/SEO contracts
```

---


# 2. ФИНАЛЬНЫЕ OWNER DECISIONS

## OD-01 — Production indexing

Production **уже находится в боевом режиме**.

```text
productionIndexing = public
robots.txt = crawl allowed
page-level robots = according to page contract
```

Запрещено возвращать production в global `noindex`.

Нужно исправить всю документацию, где production всё ещё описан как:

- `LIVE_NOINDEX`;
- `global noindex`;
- «indexing must remain disabled»;
- «do not enable indexing»;
- «owner authorization to remove noindex pending».

Документация должна отражать факт:

```text
PRODUCTION = LIVE_PUBLIC
PUBLIC_INDEXING = ENABLED
```

Staging остаётся `noindex`.

---

## OD-02 — Текущий публичный продуктовый контур

### ACTIVE NOW

```text
market = secondary
dealType = sale

category =
  apartment
  house
  land
  commercial
```

Активные публичные направления:

```text
/
 /donetsk/
 /donetsk/kvartiry/
 /donetsk/doma/
 /donetsk/uchastki/
 /donetsk/kommercheskaya/

 /prodat-nedvizhimost/
 /yurist/
 /o-kompanii/
 /kontakty/

 property pages
 district/facet pages after gate
 approved agglomeration/locality pages after gate
```

### FUTURE / PREPARED OFF

Не удалять архитектурные резервы, но не показывать как действующий продукт:

```text
novostroyki
residential complexes / ЖК
mortgage
journal
rent
rooms
garages
employees
other future modules
```

Горизонт повторного review:

```text
4–6 months after current public SEO launch
```

До отдельного owner-approved activation:

- 404 на неактивные public routes;
- 0 ссылок из меню;
- 0 CTA;
- 0 карточек услуг;
- 0 блоков на главной;
- 0 footer links;
- 0 sitemap URLs;
- 0 IndexNow submissions;
- 0 indexable SEO registry rows.

Reserved namespace должен сохраниться.

---

## OD-03 — Public Surface Whitelist

Public UI должен использовать allowlist, а не принцип «всё, что есть в starter, можно показать».

### Разрешённые пользовательские разделы

```text
HOME
DONETSK GEO HUB
APARTMENTS
HOUSES
LAND
COMMERCIAL
SELL
LAWYER
ABOUT
CONTACTS
PROPERTY
DISTRICT/FACET pages after gate
AGGLOMERATION pages after gate
PRIVACY
CONSENT
TERMS/WORKING AGREEMENT when approved
THANK-YOU
404
410
ERROR
```

Любой другой route/link/CTA в публичном HTML считается дефектом, если он не находится в explicit compatibility manifest.

---

# 3. ИНДЕКСАЦИЯ И CONTENT GATE

## OD-04 — Два класса SEO-страниц

### ALWAYS_INDEX

Не зависят от количества объектов:

```text
/
 /donetsk/
 /prodat-nedvizhimost/
 /yurist/
 /o-kompanii/
 /kontakty/
```

Active property page не зависит от количества других объектов, но обязана пройти собственный Property Quality Gate.

### GATED_INDEX

```text
/donetsk/kvartiry/
/donetsk/doma/
/donetsk/uchastki/
/donetsk/kommercheskaya/

district pages
approved facet pages
future agglomeration hub
future locality pages
future locality category pages
```

---

## OD-05 — Единый inventory threshold

Owner decision:

```text
contentGate.minActive = 3
```

Порог `3` применяется единообразно для:

- category × geo;
- district;
- approved facet;
- agglomeration hub/category;
- locality hub/category.

Старые различия:

```text
P1 >= 5
P2 >= 5
TEST >= 10
```

**больше не управляют индексируемостью.**

P1/P2/TEST можно сохранить только как:

- SEO priority;
- research evidence;
- content production ordering.

Они не задают minimum inventory.

---

## OD-06 — Content quality gate НЕ ослаблять

Изменение inventory threshold до 3 не означает, что можно индексировать thin pages.

Для GATED_INDEX одновременно обязательны:

```text
activeCount >= 3
+
exact registry title
+
exact registry H1
+
exact registry description
+
unique owner-approved SSR introduction
+
introduction >= 600 characters
+
SSR property links present in HTML
+
canonical clean URL
+
page-specific factual geo/context content where required
```

Для district/locality factual statements требуют `source + checkedAt`.

Generic text с простой подстановкой `{district}` / `{locality}` не считается уникальным контентом.

---

## OD-07 — Anti-flicker grace period

Если страница **никогда не проходила Gate**:

```text
0–2 objects -> noindex,follow
```

Если страница ранее была indexable:

```text
activeCount = 0
-> immediate noindex,follow
-> remove from sitemap

activeCount = 1–2
-> keep indexable maximum 30 calendar days
-> if count does not recover to >=3 -> noindex,follow
```

Настройка:

```text
contentGate.minActive = 3
contentGate.graceDays = 30
```

Не вычислять grace только из request-time state.

Нужно иметь persistent gate state:

```text
lastGatePassedAt
belowThresholdSince
```

Предпочтительно хранить state рядом с `listing-contents` либо в другом project-owned SEO state, а обновлять контролируемой maintenance operation. Public GET не должен мутировать БД.

---

# 4. PROPERTY QUALITY GATE

Отдельная карточка объекта не зависит от `minActive=3`.

Indexable property требует:

```text
status=active
publishedAt exists
publicUrlId exists
canonical category correct
price exists
area exists when applicable
actual geo relation exists
non-empty factual description
>=3 managed/project-owned photos
```

Если quality gate не проходит:

```text
200
noindex,follow
not sitemap
```

Archived:

```text
200 noindex,follow
not sitemap
```

После retention:

```text
relevant exact replacement -> one 301
otherwise -> 410
```

Редирект снятого объекта на нерелевантную главную запрещён.

---

# 5. ДОНЕЦК — GEO MODEL

## 5.1 Primary geo

```text
geoMode = SINGLE_GEO
primaryGeo = donetsk
```

Это означает:

- Донецк остаётся главным SEO-geo;
- наличие объектов рядом с Донецком не делает проект MULTI_GEO;
- nearby localities не должны автоматически получать статус полноценного самостоятельного города сайта.

---

## 5.2 Девять административных районов Донецка

В seed/справочнике должны существовать ровно 9 administrative districts:

1. Будённовский
2. Ворошиловский
3. Калининский
4. Киевский
5. Кировский
6. Куйбышевский
7. Ленинский
8. Петровский
9. Пролетарский

Для каждого обязательно:

```text
name
slug
type=admin_district
city=donetsk
nameGenitive
nameLocative
preposition
synonyms[]
isPublished
```

Никакого автоматического склонения русского названия в metadata.

---

## 5.3 Текстильщик

Не применять предложение внешнего аудита «все микрорайоны без URL» буквально.

В действующем Master Plan Текстильщик имеет:

- отдельную SEO-семантику;
- Wordstat evidence;
- закреплённый canonical;
- hard contract.

Поэтому:

```text
/donetsk/kvartiry/tekstilshchik/
```

сохраняется как отдельный **approved microdistrict SEO candidate**.

Остальные микрорайоны:

```text
Боссе
Путиловка
и т.п.
```

по умолчанию остаются data/filter values без самостоятельных SEO URL, пока не появится отдельное evidence.

---

# 6. ПРИГОРОД / АГЛОМЕРАЦИЯ ДОНЕЦКА

## 6.1 Главное правило

**Пригород ≠ Донецк.**

Объект в Макеевке, Ясиноватой, Моспино и другом населённом пункте нельзя:

- считать объектом Донецка;
- включать в `activeCount(donetsk)`;
- писать в Title «в Донецке»;
- писать H1 «в Донецке»;
- использовать `addressLocality=Донецк`;
- подставлять Донецк в alt;
- помещать в район Донецка.

---

## 6.2 Архитектурная модель

Не создавать новую параллельную geo collection.

Расширить существующий `cities`/geo entity contract.

Для primary и nearby settlement использовать одну geo-модель:

```text
name
slug
region
nameGenitive
nameLocative
preposition
agglomerationOf
isPublished
ownerVerified
```

Добавить:

```text
kind:
  city
  town
  settlement
  village

centerLat
centerLng

distanceKmFromPrimaryGeo
agglomerationMember
```

`distanceKmFromPrimaryGeo` вычисляется server-side по Haversine от утверждённой точки primary geo.

Не использовать внешнее «расстояние по дороге» как domain truth.

---

## 6.3 Agglomeration contract

```text
agglomerationOf = donetsk
agglomerationRadiusKm = 50
```

Радиус — validation boundary, а не автоматическая публикация всего, что попало в окружность.

Населённый пункт публикуется только если:

```text
owner whitelist = true
AND canonical coordinates verified
AND distance <= 50 km
```

Иначе:

```text
needsReview=true
not public
```

---

## 6.4 Candidate whitelist for research

Начальный candidate set:

```text
Макеевка
Ясиноватая
Харцызск
Иловайск
Докучаевск
Старобешево
Зугрэс
Моспино
```

Это **candidate list**, а не автоматический production whitelist.

До activation выполнить:

- координатную валидацию;
- actual inventory review;
- SEO Audit / Wordstat;
- owner approval.

Особенно не считать административную подчинённость доказательством географии объекта.

Пример: Моспино хранится как фактический locality, а не как «район Донецка», если объект находится вне городской геометрии Донецка.

---

## 6.5 Public route strategy

Архитектуру подготовить сразу, публичные URL активировать после SEO research.

### Candidate hub

```text
/prigorod-donetska/
```

Перед freeze проверить спрос:

```text
пригород донецка
недвижимость пригород донецка
дом пригород донецка
недвижимость рядом с донецком
дом рядом с донецком
```

Если другой slug имеет доказанно лучший intent, решение фиксируется в Master Plan до activation.

### Candidate category routes

```text
/prigorod-donetska/kvartiry/
/prigorod-donetska/doma/
/prigorod-donetska/uchastki/
/prigorod-donetska/kommercheskaya/
```

### Locality light pages

После отдельного SEO approval:

```text
/{locality}/
/{locality}/{category}/
```

Это light geo surface, а не переход проекта в MULTI_GEO.

Gate = OD-05/06.

До Gate:

```text
no internal links
no sitemap
no IndexNow
404 or noindex according to final route decision
```

Рекомендуемый R1.2 вариант:

```text
new locality with <3 objects -> 404
previously indexed locality falling below gate -> grace/noindex rules
```

---

## 6.6 Donetsk pages

На:

```text
/donetsk/
/donetsk/{category}/
```

разрешён отдельный SSR-блок:

```text
Рядом с Донецком
```

В блоке показываются реальные nearby properties/localities.

Но:

```text
Donetsk count = only actual Donetsk
Nearby count = separate
```

---

# 7. SEO AUDIT — ОБЯЗАТЕЛЕН ДЛЯ ПРИГОРОДА, НЕ ДЛЯ БАЗОВОЙ ГЕОГРАФИИ

Отдельный SEO Audit **не нужен**, чтобы определить 9 районов Донецка: они фиксируются географически.

SEO Audit нужен, чтобы решить:

1. нужен ли `/prigorod-donetska/`;
2. какой intent/slug выбрать;
3. какие nearby localities имеют отдельный поисковый спрос;
4. какие locality pages индексировать первыми;
5. нужен ли locality root или достаточно locality × category;
6. какие Title/H1/Description использовать;
7. есть ли отдельный спрос на Моспино/Макеевку/Ясиноватую/Харцызск и т.д.;
8. есть ли commercial/land/house demand по каждому locality.

SEO research не меняет data model — только activation/registry.

---

# 8. ТЕКУЩИЕ P0 ТЕХНИЧЕСКИЕ ДЕФЕКТЫ

## F-01 — commercial category leak

В `public-route-resolver.ts` текущая category mapping не должна терять:

```text
kommercheskaya -> commercial
```

Acceptance:

```text
/donetsk/kommercheskaya/
query.category === commercial

/kommercheskaya/
query.category === commercial
```

Никаких apartment/house rows в commercial catalog.

---

## F-02 — Donetsk geo catalogs show zero while objects exist

Причина должна быть исправлена на data boundary, не UI workaround.

Existing manual import заполняет raw geo, но production catalog фильтрует relation:

```text
property.city
property.district
```

Нужно:

1. провести controlled inventory diagnostic;
2. materialize `region/city/district` relations для текущих manual records;
3. сделать idempotent backfill;
4. исправить import/manual creation path, чтобы public listing не мог быть опубликован без actual geo relation;
5. unknown district -> `district=null + needsReview=true`;
6. запрещено default-assign district.

Acceptance:

```text
/donetsk/ = actual Donetsk count
/donetsk/kvartiry/ = actual apartment count
/donetsk/doma/ = actual house count
```

Никакой property не исчезает из city catalog только из-за нераспознанного district.

---

## F-03 — `/nedvizhimost` dead links

Удалить literal:

```text
/nedvizhimost
```

из публичного UI.

Запрещено просто заменить его новым hardcoded literal.

Canonical catalog href должен приходить через contract/DTO/buildUrl.

Проверить:

- Home Hero;
- Home empty state;
- 410 page;
- all shared CTA;
- footer/header;
- test fixtures.

---

## F-04 — inactive product copy

Удалить с текущего public HTML обещания неактивных направлений:

```text
аренда
ипотечное сопровождение
новостройки
ЖК
журнал
```

если речь идёт о самостоятельном предлагаемом сейчас направлении.

Можно упоминать ипотеку только внутри factual transaction context, если это не создаёт самостоятельный product CTA/route.

---

# 9. PUBLIC NAVIGATION

## Header

```text
Недвижимость
  Вся недвижимость
  Квартиры
  Дома
  Земельные участки
  Коммерческая недвижимость

Продать
Юрист
О компании
Контакты
```

Commercial остаётся в меню даже если сейчас страница `noindex` из-за inventory Gate.

Land остаётся в меню даже при временном `noindex`.

После activation agglomeration hub:

```text
Пригород Донецка
```

может быть добавлен в меню только после Gate + SEO approval.

Районы Донецка в main menu не выводить.

---

## Footer

Обязательно:

```text
Недвижимость
Квартиры
Дома
Участки
Коммерческая недвижимость
Продать
Юрист
О компании
Контакты

Политика конфиденциальности
Согласие на обработку персональных данных
Условия работы и договор — только если approved content published

NAP
legalName
INN
OGRN/OGRNIP
```

One source = `site-settings` / canonical NAP.

---

# 10. ЮРИДИЧЕСКИЕ СТРАНИЦЫ

## 10.1 Privacy

```text
/politika-konfidencialnosti/
200
noindex,follow
```

## 10.2 Personal data consent

```text
/soglasie-na-obrabotku-personalnyh-dannyh/
200
noindex,follow
```

Это отдельный документ.

Для каждого legal document:

```text
version
effectiveDate
updatedAt/revision date
owner-approved content
one H1
```

---

## 10.3 Условия работы / договор

Создать reserved static route:

```text
/usloviya-raboty/
```

Policy:

```text
approved legal content exists
-> 200 noindex,follow
-> footer link visible

approved content absent
-> 404
-> zero links
```

Содержание:

- как агентство начинает работу;
- виды договоров;
- этапы;
- состав услуг;
- порядок подписания;
- расчёты/вознаграждение только из approved legal copy;
- права/обязанности только из approved legal copy.

Не называть публичной офертой без отдельного решения юриста.

При наличии образца договора:

- хранить как managed file;
- link from terms page;
- HTTP `X-Robots-Tag: noindex, nofollow`;
- не добавлять PDF в sitemap.

---

## 10.4 Thank you

```text
/spasibo/
200
noindex,nofollow
```

---

## 10.5 Cookie / analytics notice

Не создавать отдельную SEO-страницу «Cookies» без юридической необходимости.

Если используется Яндекс Метрика или другие analytics cookies:

- показать consent/notice;
- ссылка на Privacy;
- описать cookies/analytics в Privacy;
- не записывать содержимое form fields в Webvisor;
- analytics events не содержат PII.

---

# 11. LEAD / CONSENT CONTRACT

Canonical form:

- checkbox не отмечен по умолчанию;
- visible link → отдельный Consent document;
- server rejects lead without consent.

Persist:

```text
consentAccepted
consentVersion
consentedAt
formKind
sourcePage
```

Не вводить второй набор имён `consentAt/pageUrl`, если canonical schema уже использует `consentedAt/sourcePage`.

Документация должна использовать реальные contract names.

---

# 12. ROBOTS / SITEMAP / CANONICAL

## robots.txt

Production:

```text
User-agent: *
Allow: /
Allow: /api/media/file/
Disallow: /admin/
Disallow: /api/

Clean-param: utm_source&utm_medium&utm_campaign&utm_term&utm_content&yclid&gclid&fbclid /

Sitemap: https://doncity-home.ru/sitemap.xml
```

Удалить deprecated/unsupported project dependency на:

```text
Host:
```

Canonical host определяется:

- redirects;
- canonical;
- sitemap;
- server config.

---

## Sitemap

Только:

```text
200
canonical
indexable
gate-passed
published
```

Exclude:

- category roots;
- legal noindex;
- thank-you;
- query URLs;
- legacy URLs;
- gate-failed pages;
- archived properties;
- inactive modules;
- future reserved modules.

---

## Mirrors

Проверить:

```text
http://doncity-home.ru/*
http://www.doncity-home.ru/*
https://www.doncity-home.ru/*
```

→ один redirect → `https://doncity-home.ru/.../`

Не допускать chains.

---

## Pagination

```text
?page=1 -> clean canonical route via one redirect

?page>=2 only:
  200
  noindex,follow
  self-canonical

?page>=2 + filters:
  noindex,follow
  canonical = clean approved owner route
```

Page 2+ не в sitemap.

---

# 13. STRUCTURED DATA

Исправить generic `Residence` для всех типов.

Use factual type mapping:

```text
apartment
-> Apartment

house
-> House or SingleFamilyResidence

land
-> Place + factual additionalProperty

commercial
-> Place / approved Schema.org type after validator proof
```

Wrapper:

```text
Offer
price
priceCurrency=RUB
url=canonical property URL
```

Address:

```text
PostalAddress
addressLocality = actual locality
```

Для nearby object запрещён `addressLocality=Донецк`.

`/yurist/`:

```text
Service
provider -> RealEstateAgent
```

FAQPage только когда FAQ реально видим пользователю.

`RealEstateAgent.areaServed`:

- Донецк;
- approved agglomeration localities.

Проверить Schema.org + validator до merge.

---

# 14. ABOUT / CONTACTS / SELL / LAWYER — PAGE COMPLETENESS

## About

`/o-kompanii/` остаётся `index,follow`.

Minimum:

```text
Hero
agency positioning
what the company actually does
manager/founder factual block
legal identity factual block
working principles without invented claims
contact CTA
```

Не выдумывать:

- стаж;
- число сделок;
- рейтинг;
- отзывы;
- награды;
- market share.

---

## Contacts

`/kontakty/` = `index,follow`.

Minimum:

- canonical NAP;
- phone/email actions;
- address;
- hours;
- legal entity;
- map only from actual verified location;
- consultation CTA.

---

## Sell

`/prodat-nedvizhimost/` обязательно оставить `index,follow`.

Minimum:

- commercial H1;
- what is included;
- preparation;
- promotion/showings;
- negotiations;
- legal closing;
- seller lead form.

---

## Lawyer

`/yurist/` = `index,follow`.

No child routes in current release.

Minimum:

- Hero;
- document review;
- transaction support;
- inheritance/land topics only if service is actually provided;
- lead form `formKind=legal`;
- factual Service structured data.

---

# 15. UI CORE v5.0 — ОТДЕЛЬНЫЙ REMEDIATION STREAM

## UI-EPIC-01 — Remove speculative public UI

Audit `packages/ui/src/views.ts` and package exports.

Components for:

- newbuild;
- mortgage;
- journal;
- inactive corporate modules;

must not remain part of active public package surface simply «на будущее».

Rule:

```text
needed for active R1 -> keep
required by approved compatibility -> isolate/deprecate
unused speculative public UI -> remove
```

Future module activation creates/reintroduces UI through its own epic.

---

## UI-EPIC-02 — One canonical shell

Currently there are overlapping header/footer/shell implementations.

Select one canonical production tree.

Target:

```text
one Header
one Footer
one Mobile navigation pattern
one Site Shell ownership
```

Do not rewrite visual design unnecessarily.

Compatibility aliases can remain temporarily only when proven necessary; they must not form a second active implementation.

---

## UI-EPIC-03 — Lightbox primitive conformance

`yet-another-react-lightbox` requires explicit owner exception as a second UI library.

Default action:

- replace with existing shadcn Dialog/approved project-local gallery composition;
- preserve keyboard navigation;
- focus trap;
- ESC close;
- reduced motion;
- responsive media.

Do not remove Embla merely because it is a dependency of canonical shadcn Carousel.

---

## UI-EPIC-04 — Marketing page semantic hierarchy

Current shared MarketingPage composition must not jump:

```text
H1 -> H3
```

Page sections use logical H2, nested content H3 only where needed.

Acceptance:

- exactly one H1;
- no skipped heading levels in primary composition;
- Breadcrumb nav semantic;
- one main intent;
- one primary conversion.

---

## UI-EPIC-05 — Page-specific composition

Stop treating all commercial static pages as identical generic card grids.

Create composition through reuse/variants:

- Sell;
- Lawyer;
- About;
- Contacts.

No second design language.

---

## UI-EPIC-06 — Token/dead UI audit

Run actual:

```text
pnpm tokens:report
pnpm verify:ui-core
pnpm verify:drift
pnpm verify:a11y-starter
```

Do not delete token based only on visual suspicion.

Delete only proved dead project-specific tokens/components.

---

# 16. SECURITY / PRODUCTION HEADERS

Do not downgrade an already enforced CSP to Report-Only merely because an audit template says so.

Instead:

1. identify header owner:
   - Nginx or Next, one owner per header;
2. add/fix:
   - HSTS at TLS edge;
   - X-Content-Type-Options;
   - Referrer-Policy;
   - frame protection;
   - Permissions-Policy;
   - CSP;
3. set:
   - `poweredByHeader: false`;
4. if Yandex Metrika is enabled, explicitly allow only required origins in CSP;
5. no wildcard expansion.

---

# 17. DOCUMENTATION SOURCE OF TRUTH

Update at minimum:

```text
docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md
docs/PROJECT.md
docs/OPERATIONS.md
docs/05_RELEASE_CHECKLIST.md
docs/04_BACKLOG.md
docs/DELIVERY_STATE.yaml
docs/CHANGELOG.md
docs/DESIGN.md where UI scope changed
```

Remove stale claims:

```text
LIVE_NOINDEX
global noindex
indexing pending
commercial prepared-off
P1>=5/P2>=5/TEST>=10 as indexing threshold
```

Replace with current facts/owner decisions.

Do not rewrite historical evidence files as if old evidence never existed.
Historical reports remain historical.

---

# 18. DELIVERY PLAN

## DOCUMENTATION TRACK — mandatory from day 0

Order:

```text
DOC-EPIC-00 Target-contract reconciliation
-> implementation epics update docs in same PR
-> DOC-EPIC-02 exact-head pre-release audit
-> production deploy/live proof
-> DOC-EPIC-03 post-production factual reconciliation
```

Documentation is not postponed until the end.

## TRACK OPS — parallel from day 1

Operational hardening runs in parallel.

Tasks:

- automatic DB backup freshness;
- sampled DB restore;
- media backup/versioning;
- sampled media restore;
- external uptime monitoring;
- exactly one jobs owner proof;
- first production owner;
- independent alert channel.

Public indexing remains ON, but these remain production risk items until closed.

---

# 19. RELEASE R1.1 — SEO / CATALOG HOTFIX

## EPIC R1.1-00 — Exact production inventory diagnostic

Produce factual matrix:

```text
publicUrlId
category
market
dealType
status
cityRaw
city relation
districtRaw
district relation
public URL
indexability
```

No data mutation.

---

## EPIC R1.1-01 — Geo relation repair

- materialize actual Donetsk city relation;
- map 9 districts;
- unknown district -> needsReview;
- no default district;
- detect actual nearby objects and do not coerce to Donetsk;
- idempotent migration/backfill.

RISKY + schema/data proof.

---

## EPIC R1.1-02 — Commercial filter repair

Add commercial to canonical resolver mapping and tests.

---

## EPIC R1.1-03 — Public surface cleanup

Remove:

- `/nedvizhimost`;
- dead links;
- rental/mortgage/newbuild/journal public claims;
- inactive module CTA;
- inactive module navigation.

Use DTO/buildUrl.

---

## EPIC R1.1-04 — Unified Gate = 3

Implement:

```text
minActive=3
unique content >=600
SSR links
grace=30
```

Keep SEO tiers only for priority.

---

## EPIC R1.1-05 — Robots / sitemap / mirror / errors

- robots cleanup;
- Clean-param including fbclid;
- no Host dependency;
- sitemap exact eligibility;
- 1-hop mirrors;
- real 404;
- 410;
- pagination;
- canonical proof.

---

## R1.1 release gate

Before code verification:

```text
DOC-EPIC-00 closed
all R1.1 PRs have DOC IMPACT reviewed
```

Required:

```text
pnpm verify:daily
pnpm verify:merge-risky
pnpm verify:seo-contracts
pnpm verify:seo-content-gate
pnpm verify:seo-crawl
pnpm verify:route-resolver
pnpm verify:route-http
pnpm verify:property-detail-routes
pnpm verify:property-lifecycle-routes
pnpm verify:sitemap-indexnow
pnpm build
```

Then:

```text
DOC-EPIC-02 exact-head docs audit
-> staging crawl
-> production rollout
-> production crawl
-> DOC-EPIC-03 live-state reconciliation
```

---

# 20. RELEASE R1.2 — GEO / LEGAL / UI CONFORMANCE

## EPIC R1.2-01 — Donetsk district completion

- 9 admin districts;
- inflections;
- synonyms;
- current inventory relations;
- district landing Gate=3;
- Textilshchik remains approved microdistrict candidate.

---

## EPIC R1.2-02 — Agglomeration data model

- existing cities/geo model extension;
- kind;
- agglomerationOf;
- coordinates;
- distance;
- whitelist;
- radius;
- needsReview;
- migrations only.

Do not activate SEO pages yet.

---

## EPIC R1.2-03 — Agglomeration SEO research

Run SEO Audit/Wordstat.

Output:

```text
approved hub intent
approved hub slug
approved locality list
priority by category
metadata
content requirements
```

Owner approves.

---

## EPIC R1.2-04 — Agglomeration public routes

Only after R1.2-03.

Implement approved:

- hub;
- category hub;
- locality pages;
- block «Рядом с Донецком»;
- separate counters;
- actual locality in Property metadata/JSON-LD.

---

## EPIC R1.2-05 — Legal expansion

- consent version/date;
- `/usloviya-raboty/`;
- conditional footer link;
- contract file noindex;
- NAP/legal requisites.

---

## EPIC R1.2-06 — Structured data

Fix property types and actual locality.

---

## EPIC R1.2-07…12 — UI Core remediation

Run UI-EPIC-01…06.

---

# 21. SEO AUDIT PROMPT FOR DONETSK AGGLOMERATION

```text
Ты — senior SEO researcher по недвижимости.

Проект: DON CITY, агентство недвижимости в Донецке.
Основной SEO geo: Донецк.
Основной продукт сейчас: вторичная продажа квартир, домов, земельных участков и коммерческой недвижимости.

Нужно исследовать спрос по пригородам и населённым пунктам в радиусе примерно 50 км от центра Донецка.

НЕ проектируй техническую архитектуру. Нужны только поисковые данные и SERP/intent evidence.

Проверь кандидатов:
- Макеевка
- Ясиноватая
- Харцызск
- Иловайск
- Докучаевск
- Старобешево
- Зугрэс
- Моспино
- добавь другие релевантные населённые пункты до ~50 км, если обнаружишь спрос.

Для каждого населённого пункта исследуй:
1. недвижимость + населённый пункт;
2. купить квартиру;
3. купить дом;
4. купить участок;
5. коммерческая недвижимость;
6. продажа недвижимости;
7. варианты «ДНР» / «Донецк» / «рядом с Донецком», если они реально встречаются;
8. конкурентов в выдаче;
9. наличие локальных каталогов;
10. Wordstat broad/exact evidence, не придумывать числа.

Отдельно сравни интенты:
- «пригород Донецка»
- «недвижимость в пригороде Донецка»
- «дом в пригороде Донецка»
- «недвижимость рядом с Донецком»
- «дом рядом с Донецком»

Результат:
- рекомендуемый SEO intent и slug для общего хаба;
- список населённых пунктов, которым нужна отдельная SEO page;
- список населённых пунктов, которые пока должны быть filter/data-only;
- приоритет P1/P2/TEST только как SEO/content priority, НЕ как inventory threshold;
- рекомендуемые Title/H1/Description;
- source/date для каждой цифры;
- никаких прогнозов трафика без данных.
```

---

# 22. FINAL ACCEPTANCE / DEFINITION OF DONE

## Product

- [ ] secondary sale only;
- [ ] apartment active;
- [ ] house active;
- [ ] land active;
- [ ] commercial active;
- [ ] Sell active;
- [ ] Lawyer active;
- [ ] About active;
- [ ] Contacts active;
- [ ] privacy/consent active noindex;
- [ ] terms conditional;
- [ ] future newbuild/mortgage not publicly activated.

## Catalog

- [ ] actual geo relations on all published properties;
- [ ] commercial cannot leak other categories;
- [ ] Donetsk catalogs show real Donetsk inventory;
- [ ] nearby never enters Donetsk counters;
- [ ] no dead catalog href.

## SEO

- [ ] public indexing ON;
- [ ] ALWAYS_INDEX correct;
- [ ] GATED_INDEX minActive=3;
- [ ] unique intro >=600;
- [ ] grace 30 days only for previously indexed pages;
- [ ] 0 objects = immediate noindex;
- [ ] category roots noindex;
- [ ] privacy/consent/terms noindex;
- [ ] thank-you noindex,nofollow;
- [ ] sitemap contains only eligible URLs;
- [ ] no inactive module URLs;
- [ ] actual localities in metadata and JSON-LD;
- [ ] 404/410 real HTTP statuses;
- [ ] pagination policy verified;
- [ ] mirror redirects one-hop.

## Geo

- [ ] 9 Donetsk admin districts;
- [ ] inflections stored, not generated;
- [ ] Textilshchik preserved as approved SEO candidate;
- [ ] nearby uses actual locality;
- [ ] agglomeration whitelist + 50 km validation;
- [ ] no object outside Donetsk described as «в Донецке».

## Legal / leads

- [ ] privacy;
- [ ] separate consent;
- [ ] consent version/date persisted;
- [ ] terms page conditional;
- [ ] contract file noindex;
- [ ] requisites from one NAP source;
- [ ] no PII analytics.

## UI

- [ ] one canonical shell;
- [ ] no speculative active UI exports;
- [ ] no second UI foundation;
- [ ] marketing heading hierarchy correct;
- [ ] page-specific semantic composition;
- [ ] responsive proof;
- [ ] keyboard/focus proof;
- [ ] reduced motion proof;
- [ ] one H1 per page;
- [ ] no donor/starter dead links.

## Documentation

- [ ] PRD synchronized;
- [ ] Product Structure synchronized;
- [ ] Architecture synchronized;
- [ ] PROJECT synchronized;
- [ ] OPERATIONS synchronized to live exact SHA;
- [ ] DESIGN synchronized;
- [ ] Backlog synchronized;
- [ ] Release Checklist synchronized;
- [ ] DELIVERY_STATE synchronized;
- [ ] README synchronized;
- [ ] Master Plan is the only detailed active project constitution;
- [ ] SEO/District seeds synchronized;
- [ ] `quality:docs-sot` PASS;
- [ ] `verify:docs-release-state` PASS;
- [ ] `verify:seo-doc-contract` PASS;
- [ ] zero active-doc contradictions.

## Operations

- [ ] exact SourceCraft SHA;
- [ ] staging proof;
- [ ] immutable artifact;
- [ ] rollback point;
- [ ] production crawl;
- [ ] backups/restores;
- [ ] external monitoring;
- [ ] one jobs owner.

---

# 23. FINAL FORMULA

```text
DON CITY NOW
=
SECONDARY SALE
+
APARTMENTS
+
HOUSES
+
LAND
+
COMMERCIAL
+
DONETSK
+
9 ADMIN DISTRICTS
+
APPROVED MICRODISTRICT SEO
+
DONETSK AGGLOMERATION DATA MODEL
+
SELL
+
LAWYER
+
ABOUT
+
CONTACTS
+
PRIVACY
+
CONSENT
+
CONDITIONAL TERMS/CONTRACT
+
PUBLIC INDEXING
+
UNIFORM INVENTORY GATE >= 3
+
UNIQUE SSR CONTENT
+
CITY-FIRST URL GRAMMAR
+
ACTUAL GEO IN PROPERTY DATA
+
AMS CORE 5.5
+
AMS UI CORE 5.0
+
DOCUMENTATION CONVERGENCE
+
EXACT-SHA LIVE STATE
```

```text
FUTURE 4–6 MONTHS
=
NEWBUILD / ЖК
+
MORTGAGE
```

They remain reserved, not publicly activated.

**Critical geo invariant:**

```text
Nearby ≠ Donetsk.
Agglomeration is grouping, not falsification of address.
```

**END**
