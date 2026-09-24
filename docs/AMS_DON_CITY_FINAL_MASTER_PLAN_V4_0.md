# AMS MASTER PLAN — DON CITY — CITY-FIRST REPLAN

Plan ID: AMS-DON-CITY-REPLAN-V4-CITY-FIRST
Version: v7
Status: APPROVED

**Replaces:** `AMS-DON-CITY-FINAL-V3-GEO-DISTRICT-SEO v6` / product contract `3.0.1`
**Superseded source SHA-256:** `091d0e2a8592bac4504b5b6f925487fc2bc8c192f288eab7243c00aecbc8a396`
**Product contract version:** `4.0.1`
**Date:** `2026-09-24`
**Architect phase:** `APPROVAL_HANDOFF`
**Target repository path:** `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md`
**Project:** агентство недвижимости «ДОН СИТИ»
**Production domain:** `https://doncity-home.ru`
**Canonical Git:** SourceCraft primary
**GitHub:** optional one-way mirror only
**Starter:** `https://sourcecraft.dev/integrator-p/ams-realty-baza-starter`
**Verified starter mirror baseline:** `main@ca1b884d43e808d17e1eb18b05bad70ea358dd1c`
**Verified runtime:** Next.js `16.3.5`, React `19.2.8`, Payload CMS `3.90.1`, pnpm `11.5.1`, Tailwind CSS `4.x`
**Platform:** `AMS Realty Platform Core Standard 3.0 — Solo + AI`
**Project profile:** `catalog`, mode `BUILD`
**Delivery profile:** `CRITICAL`
**Implementation delivery mode:** one Epic = one PR; `MERGE_AFTER_GATE` for RP-00…RP-12 and all unfinished/non-superseded implementation epics; EPIC-48 production remains explicit-owner-only; EPIC-49 post-launch remains outside autonomous merge delivery
**UI:** starter-based public UI foundation; Manrope; фирменный red accent → dark green через EPIC-16 token intake
**Secrets:** Secret Master / Infisical
**Infrastructure:** один существующий сервер DON CITY в Timeweb; точное размещение БД/storage/services определяется read-only discovery
**Release 1:** вторичка, продажа, квартиры, дома, участки, районы/микрорайоны, продавец, юрист
**R2:** новостройки/ЖК, ипотека, коммерческая недвижимость
**Production:** только по отдельной явной owner-команде

---

# ARCHITECT REVISION HISTORY

## 4.0.1 / v7 REVIEW — 2026-09-24

Revision input ID: `ARCHITECT-2026-09-24-V4-FINAL-AUDIT`

- Final audit covered logic/completeness, architecture/data/security, dependencies/autonomy and executability/evidence/delivery.
- Technical Task Manager anchors `EPIC-53…EPIC-65` map one-to-one to owner-facing `RP-00…RP-12`; this preserves exact RP naming while satisfying the canonical inventory validator.
- Replacement graph uses the same stealth Beads store but a new plan identity and prefix `dcv4`. The frozen V3 graph remains immutable historical evidence and is excluded from V4 claiming by plan label; no second task store is created.
- Seven already completed epics and four explicitly replaced epics remain documented but are excluded from the V4 execution inventory; their V3 nodes/ledgers stay immutable. Unfinished EPIC-08 branch remains preserved and can only be selectively absorbed by RP-05.
- Strict RP sequence is retained from the owner packet. It intentionally limits parallelism until RP-12; after that, the residual main line resumes by dependency waves.
- Result: `READY_WITH_LIMITS`, blockers `0`, unresolved major findings `0`, owner decisions before approval `0`. Import remains forbidden until the owner repeats the exact approval phrase for this v7 snapshot.

## v7 APPROVED — 2026-09-24

- Approval trigger: owner exact phrase `План утвержден`.
- Approved by: `owner` at `2026-09-24T11:15:46+03:00`.
- Approved scope: exact v7 city-first master plan, V4 inventory, `MERGE_AFTER_GATE` implementation policy and Developer handoff.
- Explicit exclusions: production rollout, DNS changes, secret mutations, destructive database actions and unplanned external writes.
- Handoff: validate exact source hash, import only the V4 plan-scoped graph into the existing stealth Beads store, reconcile `CLEAN`, then start Task Manager Developer.

## 4.0.0 REVIEW — 2026-09-24

Revision input ID: `OWNER-2026-09-24-CITY-FIRST-REPLAN`

- Source: owner-provided packet `AMS-DON-CITY-REPLAN-V4-CITY-FIRST`.
- Targets: city-first URL grammar, deterministic resolver, Platform/Project split, Site Profile, geo uniqueness, SEO registry owners, navigation, gateway/cache/analytics, sitemap/IndexNow and multi-geo proof.
- Accepted: `/{geo}/{category}/{sub}/` listing grammar with at most three segments; globally addressed properties without geo in path; one typed `buildUrl`/`parseUrl` source; status-driven categories/geographies; thirteen replan epics RP-00…RP-12 before the remaining main line; unchanged R1 scope, tiers, Content Gate §16A, `publicUrlId`, lifecycle, NAP, SourceCraft/production boundaries and R2 research-first contract.
- Accepted with adaptation: import-direction enforcement uses the repository's existing architecture guard/dependency tooling rather than introducing ESLint solely for `no-restricted-imports`; RP-12 means no product-code change when enabling a second city, while test fixtures and verification code remain in scope.
- Resolved by Architect: RP-01 does not create or approve its own master plan during Developer execution. This Architect revision materializes the plan first; RP-01 verifies Source-of-Truth alignment, ADRs, archive state and changelog in its own PR.
- Superseded execution: the v6 Task Manager graph is frozen on source drift. No old ready task may be claimed until exact V4 approval and replacement reconciliation.
- Preserved WIP: unfinished EPIC-08 branch is not merged or discarded; RP-05 must inventory and either absorb or supersede it from a fresh main-based stream.
- Owner decisions before approval: none introduced by the packet. Inflection values remain `ownerVerified=false` until content activation, as explicitly required.
- Sections changed: metadata, §§6–8, 16, 22–26, 28, 31–33C, replan epics, affected v3 epics, checklist and execution order.
- Result: assembly checkpoint `4.0.0 REVIEW`; final four-pass audit and Task Manager import are not yet authorized.

## v0 DRAFT — received basis

- Source: owner-provided master plan `3.0.1 FINAL`.
- Architect interpretation: исходный документ принят как basis, а не как автоматически утверждённый execution graph.
- Repository на момент получения отсутствовал; Task Manager store не был инициализирован.

## v1 REVIEW — 2026-09-23

Revision input ID: `OWNER-2026-09-23-START`

- Source: owner.
- Targets: SourceCraft repository, канон документов, dependency graph, Secret Master/server/database preflight, полное последовательное выполнение плана.
- Accepted: новый private SourceCraft repository `integrator-p/don-city-next`; Windows-native checkout; Realty Platform Core 3.0; Payload как единственный schema owner; `DELIVERY_PROFILE=CRITICAL`; отдельные implementation, production, post-launch и R2 boundaries; инфраструктурный discovery до любых server/DB writes.
- Rejected: считать полученный заголовок `FINAL` эквивалентом owner approval; использовать доступы AMS/Bastion/другого проекта по аналогии; печатать login/password/database URL; запускать production внутри implementation chain.
- Already covered: production только по отдельной owner-команде; SourceCraft primary; Timeweb + Managed PostgreSQL + S3; staging/noindex; exact-SHA delivery.
- Needs owner before approval: delivery mode `MERGE_AFTER_GATE` для implementation epics или default `PR_ONLY`.
- Deferred gates: точный legacy hosting/DB contour — до EPIC-03/06; production cutover — EPIC-48; Day-60 — EPIC-49; R2 activation — EPIC-50…52.
- Sections changed: metadata, Source of Truth contract, repository/infrastructure evidence, delivery boundaries, dependency waves, owner decisions and stop conditions.

## v2 REVIEW — 2026-09-23

Revision input ID: `OWNER-2026-09-23-STARTER-SERVER-ORDER`

- Source: owner.
- Targets: точный момент загрузки/установки SourceCraft starter и последующего подключения к Don City server/database.
- Accepted: starter является первым implementation baseline после approval; source repository и exact `main` SHA проверяются до копирования; starter остаётся read-only; application tree материализуется в отдельной ветке DON CITY; dependencies устанавливаются только по фактическому lockfile; server/database audit выполняется после baseline/client-activation contract и до зависимых data/infrastructure решений.
- Rejected: редактировать starter repository; копировать `.git`, secrets, build artifacts или `.beads`; подключаться к неизвестному server/DB target по чужому alias; запускать migration/import/write во время discovery.
- Already covered: EPIC-01 starter provenance, EPIC-03 inventory/NAP discovery, EPIC-06 infrastructure/Secret Master, production only by explicit owner command.
- Evidence: SourceCraft access PASS; starter `refs/heads/main` = `ca1b884d43e808d17e1eb18b05bad70ea358dd1c`.
- Sections changed: W0 sequence, critical path, external prerequisite register, EPIC-01/02/03/06 contracts.

## v3 REVIEW — 2026-09-23

Revision input ID: `OWNER-2026-09-23-STARTER-TRANSFORMATION-UI-PAGES`

- Source: owner.
- Targets: starter as implementation base, controlled UI preservation, strict DON CITY architecture/menu, completeness of every planned page, links/domain and exact Title/Description/H1.
- Accepted: starter is transformed in-place inside the DON CITY client repository after verified snapshot import; proven core/UI patterns may be reused; architecture, routes, menu, page roles and SEO ownership come only from this plan; every planned route/template receives a meaningful composition and deterministic acceptance; `/donetsk/kvartiry/` is the representative page before UI scaling.
- Rejected: redesigning every primitive without inventory; blind preservation of donor navigation/routes/content/brand; blank placeholder pages; one universal page builder; duplicated H1; stale donor domains/hrefs/canonicals; metadata inferred from visual copy instead of registry.
- Already covered: exact R1 menu §23; URL contract §7; route resolver §8; metadata registry §§24–25; Page/SEO epics 17–38; UI/accessibility QA EPIC-43; crawl EPIC-46.
- Owner decision: preserve reusable starter visual DNA where compatible, but DON CITY information architecture and menu have priority — `DECIDED`.
- Sections changed: UI transformation contract, page completeness gate, domain/link/metadata acceptance, EPIC-16/17/18 and UI scaling rules.

## v4 REVIEW — 2026-09-23

Revision input ID: `OWNER-2026-09-23-SINGLE-SERVER-DESIGN-DIRECTION`

- Source: owner.
- Targets: устранение ошибочного разделения на legacy/new server и ранняя фиксация визуального направления.
- Accepted: у DON CITY один существующий сервер в Timeweb; новый сервер не создавался и не планируется без отдельного owner decision; EPIC-03 обследует этот сервер и его БД read-only; production topology после discovery по умолчанию переиспользует подтверждённый сервер. Шрифт — Manrope с обязательной проверкой кириллицы; starter остаётся визуальной базой; фирменный красный accent переводится в тёмно-зелёную роль после token inventory и contrast proof.
- Rejected: считать текущий Timeweb server «старым» или только migration source; автоматически создавать второй instance; заранее выдумывать точные HEX до чтения starter token source; заменять красный цвет error/destructive states на зелёный.
- Already covered: starter inventory/disposition, one semantic token source, representative `/donetsk/kvartiry/` page, exact menu/routes/metadata/page gate.
- Owner decisions: single Timeweb server strategy — `DECIDED`; Manrope + starter-like theme + dark-green brand accent — `DECIDED`; exact dark-green palette — delegated to EPIC-16 verification within this direction.
- Sections changed: infrastructure metadata, EXT-01, OD-02, §33B visual direction, EPIC-03/06/16, Architecture and Project Design System.

## v5 REVIEW — 2026-09-23

Revision input ID: `OWNER-2026-09-23-MERGE-AFTER-GATE`

- Source: owner.
- Targets: закрытие последнего before-approval delivery decision.
- Accepted: `MERGE_AFTER_GATE` для EPIC-00…47 и R2 implementation EPIC-50…52. После полного diff review и одного risk-based exact-head SourceCraft gate Task Manager может выполнить merge без повторного owner-вопроса.
- Boundary: EPIC-48 production не разрешён этим решением и требует отдельной явной release-команды; EPIC-49 post-launch operations не входят в автономный merge scope.
- Rejected: direct push в `main`; автоматический CI на каждый push/PR; скрытый production rollout; повторные STANDARD+RISKY gates одного SHA.
- Owner decision: OD-01 — `DECIDED`.
- Open owner decisions before final audit: `0`.
- Sections changed: plan metadata, Owner Decision Register, delivery inventory policy and delivery state.

## v6 REVIEW — 2026-09-23

Revision input ID: `ARCHITECT-2026-09-23-FINAL-AUDIT-V5-TASK-GRAPH`

- Source: Architect final audit of exact v5 after owner approval trigger.
- Finding `F-01` — `BLOCKER`, resolved in this revision: v5 inventory contained only 53 epic nodes and zero implementation/delivery tasks. It passed coverage validation but could not produce a Developer ready queue and did not materialize §33A Common Epic Contract.
- Accepted remediation: each autonomous implementation epic receives five task cards — `PREFLIGHT`, `IMPLEMENT`, `VERIFY`, `EVIDENCE`, `DELIVERY`; cards inherit exact epic dependency, declare repository identity, scope, acceptance, required checks, allowed actions and stop conditions. Delivery depends on every sibling implementation card. EPIC-48 production and EPIC-49 post-launch remain non-autonomous and have no imported implementation tasks.
- Audit outcome for v5: `NOT_READY`; no Task Manager import and no Developer handoff performed for v5.
- Resulting state: v6 is a new reviewable snapshot. It requires a fresh final audit and owner approval before import.
- Sections changed: §33A task materialization, audit register, delivery inventory and state.

## Final audit v6 — 2026-09-23

- Trigger: owner exact approval phrase `План утвержден`.
- Logic / completeness: `PASS`; 53/53 canonical EPIC anchors are present, R1/R2/production boundaries are separated, page/URL/metadata/design/infra contracts remain covered.
- Architecture / data / security: `PASS`; Payload remains sole schema/auth/migration owner, Public Gateway/DTO boundary is preserved, PII/secrets/production writes are isolated, starter/server/DB discovery remains read-only until its dedicated tasks.
- Dependencies / autonomy: `PASS`; no cycle or missing dependency; one initial root `EPIC-00`; 51 autonomous epics have five ordered task cards and one delivery card each; EPIC-48/49 remain outside autonomous production authority.
- Executability / evidence / delivery: `PASS`; 255 implementation/delivery cards each include parent source instruction, scope, acceptance, required checks, repository identity, stop conditions and delivery policy. `MERGE_AFTER_GATE` applies to EPIC-00…47 and EPIC-50…52 only.
- Finding register: `F-01 RESOLVED`; blockers `0`, major findings `0`, owner decisions before approval `0`.
- Night Run Readiness: `READY_WITH_LIMITS` — server/DB/Secret Master discovery is an external read-only gate with fixture-safe fallback, and production remains an explicit later owner gate. It does not block starter baseline or independent safe work.
- Owner approval: v6 approved by owner on 2026-09-23; Task Manager import and Developer handoff are authorized for this exact snapshot. Production remains excluded.

## Final audit v7 — 2026-09-24

- Trigger: owner requested final verification after the city-first correction packet; this is an Architect audit, not approval of the changed snapshot.
- Logic / completeness: `PASS`; all 66 plan epics are accounted for: 55/55 executable anchors plus seven historical and four superseded sections. `EPIC-53…65` are the exact Task Manager aliases for `RP-00…12`; R1, R2, production and post-launch boundaries remain separated.
- Architecture / data / security: `PASS`; Payload remains the only schema/auth/migration owner, Public Gateway + DTO remains the public data boundary, Platform→Project direction is explicit, and secrets/PII/server/DNS/production writes remain outside this approval.
- Dependencies / autonomy: `PASS WITH LIMIT`; no missing reference or cycle in the draft inventory. The strict RP chain is intentional; the residual main line is blocked on RP-12 and then resumes by waves.
- Executability / evidence / delivery: `PASS`; active epics have task-level contracts, completed/superseded work remains in immutable V3 evidence rather than being replayed, and EPIC-48/49 have no autonomous production tasks.
- Replacement safety: `PASS`; V4 uses `dcv4` in the existing store. The frozen V3 `dcn` graph is historical, is not rewritten and cannot be claimed by the V4 plan-scoped helper.
- Finding register: blockers `0`, unresolved major findings `0`, accepted limits `1`, owner decisions before approval `0`.
- Night Run Readiness: `READY_WITH_LIMITS` — the first thirteen RP epics are serial; server/DB/Secret Master checks stay read-only; production, DNS and destructive migrations remain separate owner gates.
- Approval state: `APPROVED` by owner on `2026-09-24T11:15:46+03:00`; exact source/inventory validation and clean reconciliation are mandatory before Developer claim.

---

# 0. СТАТУС ДОКУМЕНТА И ЕДИНСТВЕННЫЙ SOURCE OF TRUTH

Этот Master Plan — canonical execution plan и детальный contract registry. Он содержит полный SEO/URL/data/delivery baseline и не дублируется вторым master plan.

Области Source of Truth разделены по AMS Product Development Standard 2.0:

```text
продукт и scope                 → docs/01_PRD.md
URL / pages / flows / SEO rules → docs/02_PRODUCT_STRUCTURE.md
stack / data / security / infra → docs/03_ARCHITECTURE.md
оперативный backlog             → docs/04_BACKLOG.md
release gate                    → docs/05_RELEASE_CHECKLIST.md
UI policy                       → docs/06_DESIGN_SYSTEM.md
детальный execution contract    → этот Master Plan
```

Канонические документы ссылаются на конкретные разделы Master Plan и не копируют реестры целиком. При конфликте зависимая разработка останавливается до устранения drift в профильном Source of Truth и Master Plan.

Запрещён второй активный документ, который дублирует URL map, Title/H1/Description, facet whitelist или district SEO registry.

Разрешены только data seeds:

```text
docs/seo/SEO_REGISTRY_SEED.csv
docs/seo/DISTRICT_REGISTRY_SEED.csv
```

Они являются импортными данными, а не параллельной документацией.

---

# 1. ОБЯЗАТЕЛЬНАЯ АРХИВАЦИЯ

```text
docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V3_0.md
→ docs/archive/AMS_DON_CITY_FINAL_MASTER_PLAN_V3_0_SUPERSEDED.md
```

Historical SEO Passport and Master Plan v2.2, if discovered by RP-00, are also
moved to `docs/archive/` and marked `SUPERSEDED` without copying their rules
into a second active document.

Единственный active master plan:

```text
docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md
```

---

# 2. CHANGELOG v3.0.1 → v4.0.0

1. Listing grammar is city-first: `/{geo}/{category}/{sub}/`, maximum three segments.
2. City hub owns general property intent; Home remains brand/agency/realtor.
3. Property and future R2 entities are globally addressed without geo in path.
4. Typed grammar becomes the only URL constructor and parser.
5. Deterministic resolver order and profile statuses replace route-specific defaults.
6. Platform/Project ownership forbids DON CITY literals in portable modules.
7. Site Profile owns geo mode, activation status, thresholds and facet whitelist.
8. City/district uniqueness and collision rules are explicit and city-scoped.
9. Registry IDs and all 50 Wordstat phrases are retained but remapped to V4 owners.
10. Nearby geo gets hub/category noindex routes; nearby districts remain absent in R1.
11. Menu, breadcrumbs, gateway, cache, analytics, sitemap and IndexNow consume grammar/geo identity.
12. RP-00…RP-12 run before any remaining main-line work and prove two profiles.
13. R1 scope, tiers, Content Gate §16A, `publicUrlId`, lifecycle, NAP,
    SourceCraft/production boundaries and R2 research-first remain unchanged.

---

# 3. АРХИТЕКТУРНЫЕ ИНВАРИАНТЫ

```text
Payload = schema owner
PostgreSQL = persistence
Next.js = public application
S3 = managed media

UI → DTO → Public Gateway → Payload

Geo × Category × District/Facet × Entity

1 intent → 1 canonical owner
query filter ≠ SEO landing
one Property → one category canonical URL
published slug → immutable by default
no speculative public modules
```

---

# 4. RELEASE 1 PRODUCT SCOPE

```text
market = secondary
dealType = sale
category = apartment | house | land
```

Prepared-off:

```text
commercial
room
garage
newbuild
rent
cottage_village
journal
employees
```

Commercial is R2, not R1.

---

# 5. GEO MODEL

```text
Region(shortName)
→ City(nameGenitive, nameLocative, preposition, agglomerationOf?, isPublished)
→ District / Microdistrict(parent?, inflection fields, isPublished)
```

Property:

```text
Property → Region → City → District?
         → districtRaw for unmatched source text
```

Prepared newbuild:

```text
Developer → Development → Region → City → District?
Property → Development?
```

Identity constraints:

- `cities.slug` is globally unique and may not collide with `RESERVED_ROOT`;
- `districts` uses composite identity `(city, slug)`, not a global slug;
- district slugs may not collide with any configured category or facet slug;
- facet slugs may not collide with categories;
- feed district matching is always scoped to the property's resolved city;
- Donetsk grammatical forms and region short name start with
  `ownerVerified=false` and cannot make a candidate indexable until verified.

---

# 6. SINGLE_GEO MODE

Launch mode: `SINGLE_GEO`, configured only through the typed Site Profile.

Meaning:

- `/{primaryGeo}/` is the indexable city hub and owns the general intent
  `недвижимость {город}`;
- global category roots remain `200 noindex,follow`, self-canonical, absent from
  sitemap and internal promotion;
- the geo switcher component exists but is hidden;
- other actual localities remain truthful data and may expose conditional
  noindex routes under §28/RP-08;
- enabling `MULTI_GEO` changes only profile/data/registry inputs and requires
  the RP-12 two-profile proof before activation.

---

# 7. URL CONTRACT — R1

```text
/
/{geo}/
/{geo}/{category}/
/{geo}/{category}/{district-or-facet}/

/{category}/
/{category}/{semantic}-{publicUrlId}/

/prodat-nedvizhimost/
/yurist/
/o-kompanii/
/kontakty/
/politika-konfidencialnosti/
/soglasie-na-obrabotku-personalnyh-dannyh/
/spasibo/
```

Canonical examples:

```text
/donetsk/
/donetsk/kvartiry/
/donetsk/kvartiry/tekstilshchik/
/donetsk/kvartiry/odnokomnatnye/
/kvartiry/kalininskiy-2-komnatnaya-1042/
```

Category roots in `SINGLE_GEO`: `200 noindex,follow`, self-canonical, not
sitemap. Property, and later R2 Development/Developer entities, are global:
their path contains no geo and does not change when the geo hierarchy changes.

All public paths, canonical URLs, sitemap URLs, JSON-LD URLs, IndexNow URLs,
breadcrumbs, menu links, cards and lead-email links are constructed only by
the typed grammar module from RP-04. Literal catalog paths outside that module
and its tests are forbidden.

V3 category-first listing URLs are not redirected unless RP-00 proves that a
specific URL was publicly reachable on production or an indexable staging
environment. Proven legacy URLs enter one explicit manifest and receive a
single `301`; invented compatibility redirects are forbidden.

Registry IDs do not change during the canonical move. Historical category-first
paths and mapping evidence live only in the archived V3 snapshot and the
explicit legacy manifest produced by RP-00 when public exposure is proven.

---

# 8. ROUTE RESOLUTION

Resolution is deterministic and ordered:

```text
1 segment  /{x}/
  static/service → category root → published geo → 404

2 segments /{geo}/{x}/
  category with ACTIVE in geoCategoryStatus[geo] → 404

2 segments /{category}/{x}/
  x matches /^[a-z0-9-]+-\d+$/ → property by publicUrlId → 404

3 segments /{geo}/{category}/{x}/
  district of that city → category facet whitelist → 404

4+ segments
  404
```

Status behavior:

```text
ACTIVE       → normal route contract
PREPARED_OFF → 404; absent from sitemap, menu and internal linking
NOINDEX_AUTO → conditional 200 noindex,follow only when its inventory rule passes
```

Property lookup uses `publicUrlId`. Semantic-prefix mismatch or wrong category
produces exactly one `301` to the grammar-owned canonical. One trailing-slash
normalization may produce `308`; redirect chains are forbidden. District×facet
combinations are forbidden.

Collision guard inputs:

```text
RESERVED_ROOT = every category slug, every static/service slug,
api, admin, media, _next, sitemap*, robots.txt, search, poisk,
zastroyshchiki, ipoteka, otzyvy, journal
```

---

# 9. DISTRICT ENTITY MODEL

Collection `districts` fields:

```text
name
slug
type = administrative_district | microdistrict
city
parent?          # nullable relationship → districts
sortOrder
preposition?
nameLocative?
isPublished
publishedAt?
seo?
```

Database uniqueness is `(city, slug)`. URL never depends on parent. Payload
hooks and deterministic CI guards enforce the collision rules from §§5/8.

---

# 10. ТЕКСТИЛЬЩИК — HARD CONTRACT

```text
name = Текстильщик
slug = tekstilshchik
type = microdistrict
parent = null
tier = P1
broad = 137
source = wordstat_v1
preposition = на
nameLocative = Текстильщике
```

Canonical:

```text
/donetsk/kvartiry/tekstilshchik/
```

If parent is later filled, URL remains unchanged.

Breadcrumb without parent:

```text
Главная → Квартиры в Донецке → Текстильщик
```

With parent:

```text
Главная → Квартиры в Донецке → Parent district → Текстильщик
```

Feed rule: `districtRaw` containing `Текстильщик` maps to this microdistrict. Unrecognized district remains `district=null`, creates `needsReview`, but property stays visible in general catalog.

Filter UI has separate groups `Районы` and `Микрорайоны`.

---

# 11. DONETSK DISTRICT REGISTRY

Administrative districts:

```text
Будённовский
Ворошиловский
Калининский
Киевский
Кировский
Куйбышевский
Ленинский
Петровский
Пролетарский
```

Microdistrict:

```text
Текстильщик
```

Exact inflection fields are verified before index activation.

---

# 12. APARTMENT DISTRICT SEO TIERS

| Slug | Type | Tier | broad | source |
|---|---|---:|---:|---|
| `kalininskiy` | administrative_district | P1 | 147 | wordstat_v1 |
| `voroshilovskiy` | administrative_district | P1 | 145 | wordstat_v1 |
| `tekstilshchik` | microdistrict | P1 | 137 | wordstat_v1 |
| `kirovskiy` | administrative_district | P1 | 116 | wordstat_v1 |
| `proletarskiy` | administrative_district | P1 | 115 | wordstat_v1 |
| `petrovskiy` | administrative_district | P2 | 97 | wordstat_v1 |
| `leninskiy` | administrative_district | P2 | 97 | wordstat_v1 |
| `budennovskiy` | administrative_district | TEST |  | fallback_no_wordstat |
| `kievskiy` | administrative_district | TEST |  | fallback_no_wordstat |
| `kuybyshevskiy` | administrative_district | TEST |  | fallback_no_wordstat |

Fallback broad remains null/empty.

---

# 13. HOUSE DISTRICT SEO TIERS

| Slug | Tier | broad | source |
|---|---:|---:|---|
| `kuybyshevskiy` | P2 | 70 | wordstat_v1 |
| `budennovskiy` | P2 | 68 | wordstat_v1 |
| `kirovskiy` | P2 | 67 | wordstat_v1 |
| `voroshilovskiy` | TEST |  | fallback_no_wordstat |
| `kalininskiy` | TEST |  | fallback_no_wordstat |
| `kievskiy` | TEST |  | fallback_no_wordstat |
| `proletarskiy` | TEST |  | fallback_no_wordstat |
| `petrovskiy` | TEST |  | fallback_no_wordstat |
| `leninskiy` | TEST |  | fallback_no_wordstat |

---

# 14. TIER / INDEXING RULE

Tier is determined by `broad` from `wordstat_v1`:

```text
P1   = broad >= 100
P2   = broad 50–99
TEST = no broad data, source=fallback_no_wordstat
```

Fixed `seoInventoryThreshold` values:

```text
P1   = activeObjects >= 5 + Content Gate (§16A)
P2   = activeObjects >= 5 + Content Gate (§16A)
TEST = activeObjects >= 10 + Content Gate (§16A)
```

P1 and P2 differ only by content-production priority in EPIC-38; their indexing threshold is the same.

If threshold or Content Gate is not passed:

```text
200
noindex,follow
not sitemap
```

Mandatory Day-60 review in EPIC-49 uses Yandex Webmaster actual data. No frequency fabrication.

---

# 15. R1 FACET REGISTRY

Apartments:

| Slug | Intent | Tier | broad | source |
|---|---|---:|---:|---|
| `odnokomnatnye` | 1-комнатные | P1 | 184 | wordstat_v1 |
| `dvuhkomnatnye` | 2-комнатные | P1 | 145 | wordstat_v1 |
| `trehkomnatnye` | 3-комнатные | P2 | 66 | wordstat_v1 |

Disabled in R1: `vtorichka` — duplicates secondary-only `/donetsk/kvartiry/`.

Houses:

| Slug | Intent | Tier | broad | source |
|---|---|---:|---:|---|
| `dachi` | дачи | TEST |  | fallback_no_wordstat |

Land:

| Slug | Intent | Tier | broad | source |
|---|---|---:|---:|---|
| `izhs` | ИЖС | TEST |  | fallback_no_wordstat |
| `snt` | СНТ | TEST |  | fallback_no_wordstat |

Commercial facet candidates are R2 and researched in EPIC-52.

---

# 16. FACET / DISTRICT ACTIVATION + QUERY CANONICAL

Tier thresholds are fixed in §14. Indexation additionally requires Content Gate (§16A).

If exactly one active approved facet is selected, UI navigates to the path URL. Query equivalent remains `noindex,follow` and canonical points to the active path facet. If no active path owner exists, canonical points to the clean category×geo page.

District query canonicalization:

```text
/donetsk/kvartiry/?district=kalininskiy
→ /donetsk/kvartiry/kalininskiy/
```

If the corresponding district page has passed threshold + Content Gate:

```text
UI/navigation → /donetsk/{category}/{district-slug}/
query variant robots = noindex,follow
query variant canonical = district path URL
```

If the district page has not passed Gate:

```text
query variant robots = noindex,follow
query variant canonical = /donetsk/{category}/
```

---

# 16A. CONTENT GATE — SINGLE SOURCE OF TRUTH

This section is the only normative definition of Content Gate. Other sections reference §16A and do not redefine it.

## Listing pages: geo / district / facet

A listing page passes Gate only when all conditions are true:

- `activeObjects` meets the tier threshold from §14;
- exact `Title`, `Description`, and `H1` are materialized in `docs/seo/SEO_REGISTRY_SEED.csv`;
- unique introductory text is at least 600 characters and is written specifically for this page, not produced by variable substitution into one generic template;
- for district/microdistrict pages, any context block contains only verified facts with `source + checkedAt`; no invented infrastructure;
- listing is server-rendered; property links exist in HTML without requiring JavaScript.

If Gate is not passed:

```text
200
noindex,follow
not sitemap
```

## Property detail

A property page passes Gate only when all are present:

- at least 3 photos stored in project-owned S3;
- price;
- area;
- factual geolocation;
- non-empty description.

If property Gate is not passed, the page remains `200 noindex,follow` and is excluded from sitemap, subject to lifecycle rules in §20.

## Computation / override

Gate status is computed automatically from data and registry state.

Manual override is allowed only for role:

```text
owner
```

Every owner override must be auditable.

---

# 17. PAGINATION

Page 2+ uses server-rendered HTML links, is `noindex,follow`, and self-canonical. Do not canonical page 2 to page 1. All property pages must be discoverable without JS filters/map/infinite scroll.

---

# 18. PROPERTY TAXONOMY

Single `properties` collection.

R1 categories: `apartment | house | land`.

Prepared-off: `commercial | room | garage`.

`market = secondary | newbuild`; `dealType = sale | rent`.

R1 public predicate: `secondary + sale + apartment/house/land + published`.

Actual geo is used; no global hardcoded `city=Donetsk`.

House subtype:

```text
house | cottage | townhouse | dacha | part_of_house
```

Land:

```text
plotAreaSotka
landCategory
permittedUse
communications
```

Import accepts m²/sotka/hectare and normalizes to sotka; ambiguous values → needsReview.

---

# 19. PUBLIC URL ID / SLUG

Every property has stable numeric `publicUrlId` used for public lookup.

Slug:

```text
[semantic-part]-[publicUrlId]
```

Price is forbidden in slug.

Same `feedSource + externalId` must preserve same property and publicUrlId across ordinary relisting/reactivation.

Semantic mismatch → one 301 to computed canonical; no 404 solely because semantic prefix changed.

---

# 20. PROPERTY LIFECYCLE

```text
missing → 404
active → 200 index candidate
archived retained → 200 noindex,follow
purged + exact replacement → 301
purged no replacement → 410
```

Real HTTP proof required.

---

# 21. STARTER COMPATIBILITY

Actual donor route is `/obekty/[slug]`. DON CITY does not use it as canonical. After internal href migration, remove it if never public, or keep only as one-hop 301 compatibility route when needed.

---

# 22. HOME / ALL INTENT SPLIT

Home owns `агентство недвижимости`, `риэлтор`, brand. `/donetsk/` owns general property intent. Both are indexable with distinct exact metadata from the registry.

Menu `Вся недвижимость` points to `/donetsk/`.

This ownership is identical in `SINGLE_GEO` and `MULTI_GEO`: Home never
absorbs city-hub intent, and a geo hub never becomes a brand-home alias.

---

# 23. MENU — R1

```text
Недвижимость ▾
  Вся недвижимость → buildUrl(geoHub: donetsk)       → /donetsk/
  Квартиры → buildUrl(categoryGeo: kvartiry)         → /donetsk/kvartiry/
  Дома → buildUrl(categoryGeo: doma)                 → /donetsk/doma/
  Земельные участки → buildUrl(categoryGeo: uchastki) → /donetsk/uchastki/
Продать → /prodat-nedvizhimost/
Юрист → /yurist/
О компании → /o-kompanii/
Контакты → /kontakty/
```

Logo → `/`.

Menu entries are derived from Site Profile and include only categories with
`ACTIVE` status for `primaryGeo`. No R1 links to newbuild, mortgage,
commercial, construction, journal or rent. The geo switcher is hidden when
`geoMode=SINGLE_GEO`.

Breadcrumb contracts:

```text
Главная → Недвижимость в Донецке → Квартиры → Текстильщик
Главная → Недвижимость в Донецке → Квартиры → {parent?} → Текстильщик
Главная → Недвижимость в {cityLocative} → Квартиры → {район} → {объект}
```

Optional district parent affects breadcrumbs only and never the canonical URL.

---

# 24. SEO-РЕЕСТР — STATIC / BASE PAGES

Registry IDs remain stable across the V3→V4 canonical move. The `url` column
is a materialized value computed by RP-04 grammar from row keys and verified by
`guard:registry-url`; it is not an independent source of truth.

| ID | URL | Type | Title | Description | H1 | Robots |
|---|---|---|---|---|---|---|
| HOME | `/` | static | Агентство недвижимости «ДОН СИТИ» в Донецке, ДНР | Агентство недвижимости «ДОН СИТИ» в Донецке: квартиры, дома и земельные участки. Подбор объектов, продажа и юридическое сопровождение сделок. | Агентство недвижимости «ДОН СИТИ» в Донецке | index,follow |
| ALL | `/donetsk/` | geo/all | Недвижимость в Донецке, ДНР: квартиры, дома, участки | Недвижимость в Донецке и ДНР: квартиры, дома и земельные участки. Актуальные объекты агентства «ДОН СИТИ» и помощь в безопасной сделке. | Недвижимость в Донецке, ДНР | index,follow |
| APT_ROOT | `/kvartiry/` | global category | Квартиры \| ДОН СИТИ | Каталог квартир агентства недвижимости «ДОН СИТИ». | Квартиры | noindex,follow |
| APT_GEO | `/donetsk/kvartiry/` | category×geo | Купить квартиру в Донецке, ДНР: цены и объявления | Квартиры на продажу в Донецке, ДНР: 1-, 2- и 3-комнатные варианты в разных районах. Подбор и сопровождение сделки в «ДОН СИТИ». | Квартиры на продажу в Донецке | index,follow |
| HOUSE_ROOT | `/doma/` | global category | Дома \| ДОН СИТИ | Каталог домов агентства недвижимости «ДОН СИТИ». | Дома | noindex,follow |
| HOUSE_GEO | `/donetsk/doma/` | category×geo | Купить дом в Донецке, ДНР: дома с участками | Дома на продажу в Донецке, ДНР: частные дома и дома с земельными участками. Подбор объекта и юридическое сопровождение сделки. | Дома на продажу в Донецке | index,follow |
| LAND_ROOT | `/uchastki/` | global category | Земельные участки \| ДОН СИТИ | Каталог земельных участков агентства недвижимости «ДОН СИТИ». | Земельные участки | noindex,follow |
| LAND_GEO | `/donetsk/uchastki/` | category×geo | Купить земельный участок в Донецке, ДНР | Земельные участки на продажу в Донецке и ДНР: земля под дом и строительство. Проверка документов и сопровождение сделки. | Земельные участки в Донецке и ДНР | index,follow |
| SELL | `/prodat-nedvizhimost/` | static | Продать недвижимость в Донецке, ДНР \| ДОН СИТИ | Поможем продать квартиру, дом или участок в Донецке: оценка, подготовка, показы, переговоры и юридическое сопровождение сделки. | Продать недвижимость в Донецке | index,follow |
| LAW | `/yurist/` | static | Юрист по недвижимости в Донецке, ДНР \| ДОН СИТИ | Юрист по недвижимости в Донецке: проверка документов, сопровождение купли-продажи, наследство, регистрация права и земельные вопросы. | Юрист по недвижимости в Донецке | index,follow |
| ABOUT | `/o-kompanii/` | static | О компании «ДОН СИТИ»: агентство недвижимости в Донецке | О компании «ДОН СИТИ»: агентство недвижимости в Донецке, команда, подход к проверке объектов и сопровождению сделок. | О компании «ДОН СИТИ» | index,follow |
| CONTACTS | `/kontakty/` | static | Контакты агентства недвижимости «ДОН СИТИ» в Донецке | Адрес, телефон и график работы агентства недвижимости «ДОН СИТИ» в Донецке. Запись на консультацию и встречу. | Контакты агентства «ДОН СИТИ» | index,follow |
| PRIVACY | `/politika-konfidencialnosti/` | legal | Политика конфиденциальности \| ДОН СИТИ | Политика обработки и защиты персональных данных пользователей сайта агентства недвижимости «ДОН СИТИ». | Политика конфиденциальности | noindex,follow |
| CONSENT | `/soglasie-na-obrabotku-personalnyh-dannyh/` | legal | Согласие на обработку персональных данных \| ДОН СИТИ | Согласие пользователя на обработку персональных данных агентством недвижимости «ДОН СИТИ». | Согласие на обработку персональных данных | noindex,follow |
| THANKS | `/spasibo/` | utility | Спасибо за обращение \| ДОН СИТИ | Заявка отправлена. Специалист агентства недвижимости «ДОН СИТИ» свяжется с вами. | Спасибо за обращение | noindex,nofollow |

---

# 25. SEO-РЕЕСТР — DISTRICT / FACET / PROPERTY TEMPLATES

District canonical: `/{geo}/{category}/{district-slug}/`.

Before `indexable=true`, rendered exact Title/Description/H1 is materialized into `SEO_REGISTRY_SEED.csv` from approved district grammar. URL never depends on parent.

`nameLocative` for administrative districts is the adjective in prepositional case, for example `Калининском`, `Будённовском`. Owner verifies grammar before `indexable=true` according to §11.

## Administrative district — apartments

```text
Title: Купить квартиру в {districtLocative} районе {cityGenitive}, {regionShort} | {brandName}
H1: Квартиры в {districtLocative} районе {cityGenitive}
Description: Квартиры на продажу в {districtLocative} районе {cityGenitive}, {regionShort}: актуальные объекты, фото и цены. Подбор и сопровождение сделки в «{brandName}».
```

## Administrative district — houses

```text
Title: Купить дом в {districtLocative} районе {cityGenitive}, {regionShort} | {brandName}
H1: Дома в {districtLocative} районе {cityGenitive}
```

## Microdistrict — apartments

```text
Title: Купить квартиру {districtPreposition} {districtLocative} {cityPreposition} {cityLocative}, {regionShort} | {brandName}
H1: Квартиры {districtPreposition} {districtLocative} {cityPreposition} {cityLocative}
```

Example for Textilshchik:

```text
Title: Купить квартиру на Текстильщике в Донецке, ДНР | ДОН СИТИ
H1: Квартиры на Текстильщике в Донецке
```

Room facets:

```text
/donetsk/kvartiry/odnokomnatnye/
Title: Купить однокомнатную квартиру в Донецке, ДНР
H1: Однокомнатные квартиры в Донецке

/donetsk/kvartiry/dvuhkomnatnye/
Title: Купить двухкомнатную квартиру в Донецке, ДНР
H1: Двухкомнатные квартиры в Донецке

/donetsk/kvartiry/trehkomnatnye/
Title: Купить трёхкомнатную квартиру в Донецке, ДНР
H1: Трёхкомнатные квартиры в Донецке
```

Descriptions: category-specific factual catalog description with DON CITY accompaniment; exact rendered strings live in SEO seed data generated from this Master Plan.

TEST facet candidates:

```text
/donetsk/doma/dachi/
/donetsk/uchastki/izhs/
/donetsk/uchastki/snt/
```

All have `broad=null`, `source=fallback_no_wordstat`, `TEST`, minimum 10 objects + Gate.

Property template:

```text
URL: category canonical
Title: {Название объекта} в {actualGeo}: цена, фото | ДОН СИТИ
Description: {Тип объекта}, {площадь}, {район/микрорайон если известен}. Цена {цена}. Фото, характеристики и консультация агентства недвижимости «ДОН СИТИ».
H1: {Название объекта}
```

Only factual values render; missing optional phrases are omitted.

---

# 26. SEO-РЕЕСТР — 50 WORDSTAT ФРАЗ

Source: SEO Passport DON CITY v1.0 / Yandex Wordstat. Frequencies are research evidence, not traffic forecasts.

| № | Query | broad | Final URL owner | Registry ID |
|---:|---|---:|---|---|
| 1 | квартиры в донецке днр | 4 996 | `/donetsk/kvartiry/` | APT_GEO |
| 2 | купить квартиру в донецке днр | 2 621 | `/donetsk/kvartiry/` | APT_GEO |
| 3 | купить дом в донецке днр | 1 523 | `/donetsk/doma/` | HOUSE_GEO |
| 4 | недвижимость днр донецк | 1 405 | `/donetsk/` | ALL |
| 5 | продажа квартир в донецке днр | 301 | `/donetsk/kvartiry/` | APT_GEO |
| 6 | агентство недвижимости донецк днр | 249 | `/` | HOME |
| 7 | квартиры в днр донецк недорого | 223 | `/donetsk/kvartiry/` | APT_GEO |
| 8 | однокомнатная квартира в донецке днр | 184 | `/donetsk/kvartiry/odnokomnatnye/` | APT_ROOM_1 |
| 9 | квартиры в калининском районе донецка днр | 147 | `/donetsk/kvartiry/kalininskiy/` | APT_DIST_KALIN |
| 10 | квартиры в донецке днр ворошиловский | 145 | `/donetsk/kvartiry/voroshilovskiy/` | APT_DIST_VOR |
| 11 | купить двухкомнатную квартиру в донецке днр | 145 | `/donetsk/kvartiry/dvuhkomnatnye/` | APT_ROOM_2 |
| 12 | квартиры в донецке днр текстильщик | 137 | `/donetsk/kvartiry/tekstilshchik/` | APT_MICRO_TEXT |
| 13 | квартиры в ворошиловском районе донецка днр | 135 | `/donetsk/kvartiry/voroshilovskiy/` | APT_DIST_VOR |
| 14 | 2 комнатная квартира в донецке днр | 123 | `/donetsk/kvartiry/dvuhkomnatnye/` | APT_ROOM_2 |
| 15 | продажа недвижимости донецк днр | 120 | `/donetsk/` | ALL |
| 16 | квартира в донецке днр кировский район | 116 | `/donetsk/kvartiry/kirovskiy/` | APT_DIST_KIR |
| 17 | купить однокомнатную квартиру в донецке днр | 115 | `/donetsk/kvartiry/odnokomnatnye/` | APT_ROOM_1 |
| 18 | квартира в пролетарском районе донецк днр | 115 | `/donetsk/kvartiry/proletarskiy/` | APT_DIST_PROL |
| 19 | купить квартиру в донецке днр калининский | 114 | `/donetsk/kvartiry/kalininskiy/` | APT_DIST_KALIN |
| 20 | купить квартиру в донецке днр текстильщик | 113 | `/donetsk/kvartiry/tekstilshchik/` | APT_MICRO_TEXT |
| 21 | куплю квартиру в донецке днр ворошиловский | 106 | `/donetsk/kvartiry/voroshilovskiy/` | APT_DIST_VOR |
| 22 | купить квартиру в донецке днр калининский район | 103 | `/donetsk/kvartiry/kalininskiy/` | APT_DIST_KALIN |
| 23 | купить квартиру в донецке днр недорого | 102 | `/donetsk/kvartiry/` | APT_GEO |
| 24 | земельный участок донецк днр | 101 | `/donetsk/uchastki/` | LAND_GEO |
| 25 | купить квартиру в донецке днр петровский | 97 | `/donetsk/kvartiry/petrovskiy/` | APT_DIST_PETR |
| 26 | квартира в ленинском районе донецк днр | 97 | `/donetsk/kvartiry/leninskiy/` | APT_DIST_LEN |
| 27 | купить квартиру в донецке днр ворошиловский район | 96 | `/donetsk/kvartiry/voroshilovskiy/` | APT_DIST_VOR |
| 28 | купить дом в донецке днр недорого | 88 | `/donetsk/doma/` | HOUSE_GEO |
| 29 | купить квартиру в донецке днр пролетарский | 86 | `/donetsk/kvartiry/proletarskiy/` | APT_DIST_PROL |
| 30 | купить участок в донецке днр | 84 | `/donetsk/uchastki/` | LAND_GEO |
| 31 | купить квартиру в донецке днр кировский район | 83 | `/donetsk/kvartiry/kirovskiy/` | APT_DIST_KIR |
| 32 | купить квартиру в донецке днр кировский | 83 | `/donetsk/kvartiry/kirovskiy/` | APT_DIST_KIR |
| 33 | купить 2 квартиру в донецке днр | 79 | `/donetsk/kvartiry/dvuhkomnatnye/` | APT_ROOM_2 |
| 34 | купить квартиру в донецке днр пролетарский район | 78 | `/donetsk/kvartiry/proletarskiy/` | APT_DIST_PROL |
| 35 | купить квартиру в петровском районе донецка днр | 77 | `/donetsk/kvartiry/petrovskiy/` | APT_DIST_PETR |
| 36 | сколько стоит квартира в донецке днр | 76 | `/donetsk/kvartiry/` | APT_GEO |
| 37 | купить квартиру в донецке днр вторичка | 72 | `/donetsk/kvartiry/` | APT_GEO |
| 38 | купить дом в донецке днр куйбышевский район | 70 | `/donetsk/doma/kuybyshevskiy/` | HOUSE_DIST_KUYB |
| 39 | купить 2 комнатную квартиру в донецке днр | 69 | `/donetsk/kvartiry/dvuhkomnatnye/` | APT_ROOM_2 |
| 40 | купить дом в донецке днр буденновский район | 68 | `/donetsk/doma/budennovskiy/` | HOUSE_DIST_BUD |
| 41 | продать квартиру в донецке днр | 68 | `/prodat-nedvizhimost/` | SELL |
| 42 | купить дом в донецке днр кировский | 67 | `/donetsk/doma/kirovskiy/` | HOUSE_DIST_KIR |
| 43 | купить квартиру в донецке днр 3 комнатную | 66 | `/donetsk/kvartiry/trehkomnatnye/` | APT_ROOM_3 |
| 44 | купить квартиру в донецке днр ленинский | 64 | `/donetsk/kvartiry/leninskiy/` | APT_DIST_LEN |
| 45 | купить 1 квартиру в донецке днр | 60 | `/donetsk/kvartiry/odnokomnatnye/` | APT_ROOM_1 |
| 46 | риэлтор донецк днр | 60 | `/` | HOME |
| 47 | купить квартиру в донецке днр ленинский район | 59 | `/donetsk/kvartiry/leninskiy/` | APT_DIST_LEN |
| 48 | купить недвижимость в донецке днр | 57 | `/donetsk/` | ALL |
| 49 | купить земельный участок в донецке днр | 47 | `/donetsk/uchastki/` | LAND_GEO |
| 50 | юрист по недвижимости донецк днр | 13 | `/yurist/` | LAW |

---

# 27. TOP-50 INTERPRETATION

```text
agency/realtor/brand → HOME
general property → /donetsk/
general apartments → /donetsk/kvartiry/
apartment district → district page
1/2/3 room → active room facet
secondary/vtorichka → /donetsk/kvartiry/
houses → /donetsk/doma/ or proven district page
land → /donetsk/uchastki/
seller → /prodat-nedvizhimost/
lawyer → /yurist/
```

No R1 page for `недорого` or price-question alone.

---

# 28. ROBOTS / CANONICAL / SITEMAP

Index candidates: Home, `/donetsk/`, Donetsk category pages, district/facet after Gate, active property pages, SELL, LAW, ABOUT, CONTACTS.

Noindex: category roots in SINGLE_GEO, below-threshold district/facet, query filters, nearby geo in R1, archived property, privacy/consent.

Nearby geo route contract for `geo != donetsk`:

```text
/{geo}/ exists only if geo.isPublished=true AND activeObjects(geo) >= 1
/{geo}/{category}/ exists only if geo.isPublished=true
  AND activeObjects(geo, category) >= 1
otherwise → 404
```

When it exists in R1:

```text
200
noindex,follow
not sitemap
not menu
```

Internal links to such geo pages are allowed only from property pages belonging to that geography. Indexation decision is deferred to EPIC-49 Day-60 + MULTI_GEO review.

Nearby-district pages are absent in R1: `/{nearby}/{category}/{district}/`
returns `404`. Actual object geography is never rewritten to the primary geo.

`/spasibo/` = noindex,nofollow.

Canonical = clean trailing-slash owner URL.

Logical sitemap owners are `static`, `geo`, `catalog`, `districts`, `facets`,
`kvartiry`, `doma`, `uchastki`. Every URL comes from RP-04 grammar. Sitemap
includes only published + canonical + indexable + Gate/threshold passed pages;
nearby geo and global category roots are excluded. Listing `lastmod` is the
maximum meaningful `updatedAt` of owned objects and registry content, never
current time on every request.

---

# 29. INDEXNOW / DUPLICATE LISTING / UNIQUE CONTENT

Implement IndexNow for new publication, meaningful update, archive/removal, canonical move and gone. Do not submit all URLs on every deploy.

Primary organic targets are category×geo, district, facet and service pages (`/prodat-nedvizhimost/`, `/yurist/`); property cards remain indexable where useful but may overlap marketplace listings.

Property may carry factual unique fields such as district context, verified infrastructure context, document-check summary, agency editorial summary and transaction/viewing notes. No invented facts.

---

# 30. NAP / REAL ESTATE AGENT / YANDEX

One NAP source: `site-settings`.

Same DTO feeds header, footer, contacts and `RealEstateAgent` JSON-LD. Before production owner verifies canonical Name/Address/Phone against Yandex Business.

Release checklist: Yandex Business NAP, Yandex Webmaster verification, region Donetsk configured, sitemap submitted, robots validated, IndexNow key configured.

---

# 31. SEO DATA SEEDS

Only allowed SEO data files:

`docs/seo/SEO_REGISTRY_SEED.csv` columns:

```text
registryId,pageType,category,geoSlug,districtSlug,facetSlug,url,title,description,h1,robots,tier,broad,source,minActiveObjects,contentGateRequired,status
```

`url` is computed from the other keys through `buildUrl` and is guarded for
exact equality. Registry IDs remain stable across the replan.

`docs/seo/DISTRICT_REGISTRY_SEED.csv` columns:

```text
name,slug,type,citySlug,parentSlug,preposition,nameLocative,apartmentTier,apartmentBroad,apartmentSource,houseTier,houseBroad,houseSource,isPublished
```

Fallback `broad` is blank, not zero.

District row identity is `(citySlug, slug)`; `citySlug` is mandatory.

Textilshchik row must encode parent empty/null, `на`, `Текстильщике`, P1, 137, wordstat_v1.

---

# 32. PAYLOAD CORE / ADDITIONS

Reuse starter: users, pages, properties, feeds/imports, leads/deliveries, media, redirects, Jobs, Gateways, Safe Outbound, lifecycle, cache, contracts, UI and guards.

Add R1: site-settings, regions, cities, districts; property relations `region`, `city`, `district`, `districtRaw`, `publicUrlId`; house/land taxonomy fields.

Prepared-off: commercial fields, room, garage, newbuild development relation.

## 32A. Platform / Project ownership

```text
src/platform/{grammar,resolver,geo,seo,catalog,gate,sitemap,indexnow}
src/project/{site.profile.ts,seo/,content/}
```

`src/platform/**` is portable and may not contain literals `donetsk`,
`Донецк`, `ДНР`, `ДОН СИТИ` or `doncity`. Project values arrive only through
typed inputs, Site Profile and data. Platform imports from Project are
forbidden by the existing architecture guard/dependency layer; the application
composition root may inject project inputs into platform modules. RP-02 records
portable modules in `docs/UPSTREAM_CANDIDATES.md`; upstream extraction itself
is outside R1.

## 32B. Site Profile

The typed `src/project/site.profile.ts` satisfies
`src/platform/profile/types.ts` and is the sole owner of launch-mode switches:

```ts
export const siteProfile = {
  geoMode: "SINGLE_GEO",
  primaryGeo: "donetsk",
  marketStatus: { secondary: "ACTIVE", newbuild: "PREPARED_OFF" },
  categoryStatus: {
    kvartiry: "ACTIVE",
    doma: "ACTIVE",
    uchastki: "ACTIVE",
    kommercheskaya: "PREPARED_OFF",
    komnaty: "PREPARED_OFF",
    garazhi: "PREPARED_OFF",
    novostroyki: "PREPARED_OFF",
    arenda: "PREPARED_OFF",
  },
  geoCategoryStatus: {
    donetsk: { kvartiry: "ACTIVE", doma: "ACTIVE", uchastki: "ACTIVE" },
  },
  defaultNearbyGeoStatus: "NOINDEX_AUTO",
  tiers: { P1: { minBroad: 100 }, P2: { minBroad: 50 } },
  inventoryThreshold: { P1: 5, P2: 5, TEST: 10 },
  facetWhitelist: {
    kvartiry: ["odnokomnatnye", "dvuhkomnatnye", "trehkomnatnye"],
    doma: ["dachi"],
    uchastki: ["izhs", "snt"],
  },
} as const satisfies SiteProfile;
```

Allowed status values are `ACTIVE | PREPARED_OFF | NOINDEX_AUTO`.
`PREPARED_OFF` means schema/import/DTO/tests may exist while every route remains
`404` and absent from sitemap/menu/linking. Thresholds, whitelist and activation
status may not be duplicated in resolver or UI code.

---

# 33. SOURCECRAFT DELIVERY CONTRACT

SourceCraft = canonical; GitHub optional one-way mirror.

Every implementation Epic: fresh main → branch/worktree → scoped work → targeted diagnostics → commit/push → PR. При `PR_ONLY` выполнение останавливается до merge-владельца; при утверждённом `MERGE_AFTER_GATE` выполняются review → один exact-head gate → merge → verify main → safe cleanup → next Epic.

One Epic = one PR.

Expected gates: `pnpm verify:merge-standard`; UI adds `pnpm verify:ui-core`; risky adds `pnpm verify:merge-risky` + `pnpm verify:schema`; final runs full verify/client-readiness/integration/UI. Exact script names and availability are verified against the starter in EPIC-01 before becoming executable acceptance.

Replan gate policy: RP-02…RP-07 require `verify:merge-risky` plus
`verify:schema`; RP-00, RP-01 and RP-08…RP-12 use
`verify:merge-standard` unless their exact diff triggers a higher risk class.

---

# 33A. TASK MANAGER EXECUTION CONTRACT — v2 REVIEW

## Repository evidence

```text
repository_key = don-city-next
canonical_remote = https://git.sourcecraft.dev/integrator-p/don-city-next.git
default_branch = main
repository_visibility = private
workspace = current Windows checkout
replan_base_main_sha = 8dfd7a6c8568a46dc9c0c7430e99c2e75ce9bcfd
```

Repository был создан пустым без automatic CI. SourceCraft API не материализовал initial README, поэтому единственный platform bootstrap commit создал `main`; дальнейшая работа идёт только через branch/worktree и PR.

## Program boundaries

```text
REPLAN         = RP-00…RP-12, mandatory before resumed main-line work
IMPLEMENTATION = EPIC-00…47
PRODUCTION     = EPIC-48, только exact owner release command
POST-LAUNCH    = EPIC-49, только после подтверждённого production cutover
R2             = EPIC-50…52, research-first; activation не смешивается с R1
```

Approval master plan не разрешает production, destructive migration, создание/изменение secret, DNS/firewall mutation или необратимое внешнее действие. Эти действия сохраняют отдельные stop conditions.

The prior V3 Beads graph remains historical execution evidence but becomes
non-claimable immediately on V4 source drift. After exact V4 approval,
reconciliation must preserve closed-task ledgers, retire/supersede obsolete
open cards, add RP cards and rewrite affected remaining contracts. A second
task store is forbidden.

## Common Epic Contract

Каждый implementation Epic при импорте в Task Manager декомпозируется минимум на:

1. contract/preflight task;
2. implementation tasks с минимальным blocking scope;
3. targeted verification task;
4. documentation/evidence task;
5. delivery task с `PR_ONLY` либо явно утверждённым `MERGE_AFTER_GATE`.

Для каждого Epic обязательны outcome, Source of Truth, scope in/out, entry/exit, dependencies, acceptance, verification, rollback/recovery и stop conditions. Фраза из краткого списка EPIC ниже является заголовком outcome, а не полной task card.

## Dependency taxonomy

- `HARD`: downstream технически невозможно начать до конкретного contract/output.
- `CONTRACT`: downstream открывается после freeze DTO/schema/route contract, не ждёт весь Epic.
- `SOFT`: рекомендуемый порядок без блокировки ready queue.
- `EXTERNAL`: credential, legacy hosting, feed, NAP, vendor, server, DB, DNS.
- `OWNER`: заранее определяемое решение владельца.
- `PRODUCTION`: отдельная release authorization.

## Delivery waves and critical path

| Wave | Epics | Entry / key dependency | Exit evidence | Parallel safety |
|---|---|---|---|---|
| WR Replan | RP-00…RP-12 | V3 graph frozen; current `main` known | city-first contracts, migrations, routes, registry, links, gateway, sitemap and two-profile proof | serial RP order; every epic begins from fresh main |
| W0 Governance / Discovery | 00–06 | repository exists; source plan V4 | canonical docs, installed starter baseline, inventory/NAP evidence, infra preflight | completed evidence is reused; no server mutation |
| W1 Data / Contracts | 07–15 | W0 contracts; actual inventory or explicit fixture fallback | Payload migrations, DTO freeze, gateways, SEO engine, resolver proofs | schema epics merge sequentially; UI consumers may start after contract freeze |
| W2 Public Product | 16–34 | route/DTO contracts frozen | R1 pages, catalogs, property lifecycle, legal/seller/NAP/leads | page epics parallel only after shared route/design contracts; leads/data sequential where shared |
| W3 Runtime / Quality | 35–44 | representative R1 flows wired | IndexNow, sitemap, feeds, cache, analytics, performance, UI/security evidence | independent audits/tests may run after exact shared head; no production writes |
| W4 Staging / Release Candidate | 45–47 | W3 P0/P1=0; infra target verified | staging proof, crawl, rehearsal, immutable RC and rollback point | migrations/import/auth remain sequential |
| W5 Production / Operations | 48–49 | explicit release command + exact approved main SHA | production cutover, live smoke, scheduled Day-60 evidence | production is serial and cannot be bypassed |
| W6 R2 Research / Activation | 50–52 | separate research evidence and owner-approved R2 contract | newbuild, mortgage and commercial outcomes as separate streams | research may parallelize; shared schema/routes merge sequentially |

Critical path for R1:

```text
RP-00 → RP-01 → RP-02 → RP-03 → RP-04 → RP-05 → RP-06
→ RP-07 → RP-08 → RP-09 → RP-10 → RP-11 → RP-12
→ remaining V4-adjusted main-line work

00 → 01 → 02 → 03
03 → 08/09 → 10/11 → 12 → 13 → 14 → 15
15 → 18 → 21…30 → 35/36/37/38/39/40
34 + 39 + 43 + 44 → 45 → 46 → 47
47 → [PRODUCTION OWNER GATE] → 48 → 49
```

Contract-first openings:

```text
07 NAP DTO freeze           → 17, 19, 31, 32, 33 may start
08 geo contract freeze      → 12, 22, 25, 30 may start
09 taxonomy freeze          → 12, 21, 24, 26 may start
10 publicUrlId contract     → 12, 28, 29, 35 may start
12 DTO freeze               → 13, 27 and page data integration may start
14 SEO state contract       → 18, 22, 23, 25, 26, 36, 38 may start
16 design tokens/components → independent page implementation may start
```

## External prerequisite register

### EXT-01 — Existing DON CITY Timeweb server / domain identity

- Evidence: EPIC-06 read-only proof identifies the one existing Timeweb app server,
  dedicated `DonCity Server/prod` Secret Master scope and a separate Timeweb
  Managed PostgreSQL 18 service in the same provider project.
- SSH: dedicated deploy identity and host fingerprint were verified without
  persisting values in Git.
- Database: current target was verified as an empty database during EPIC-03;
  authenticated private-network attachment remains an operations prerequisite,
  not a planning assumption.
- Domain: `https://doncity-home.ru` is the owner-confirmed production origin;
  DNS/cutover remains production-only.
- Fallback: continue local/staging implementation with sanitized fixtures;
  block only tasks that require private-network DB, DNS or production.
- Stop: any ambiguous target, cross-project credential, write without backup,
  or request to print password/full database URL.

### EXT-02 — Actual inventory / feed / NAP

- Preflight: obtain authoritative feed/source sample, category counts, geo/districtRaw values and owner-verified Name/Address/Phone.
- Fallback: synthetic fixtures may prove contracts but cannot activate production SEO pages or final lead/NAP flows.
- Stop: invented business data, invented Wordstat frequency or reassignment of unknown locality to Donetsk.

### EXT-03 — SourceCraft Task Manager prerequisites

- Evidence: Beads `bd 1.2.2` is available at canonical local fallback; store is not initialized.
- Rule: `ValidateDraft` allowed in REVIEW; `Init/Import` prohibited until exact `APPROVED` plan and clean inventory reconciliation.

### EXT-04 — SourceCraft starter acquisition

- Source: `https://sourcecraft.dev/integrator-p/ams-realty-baza-starter`.
- Verified ref: `refs/heads/main` = `ca1b884d43e808d17e1eb18b05bad70ea358dd1c` on 2026-09-23.
- Preflight: authenticate read-only; fetch/clone into an isolated reference directory or temporary worktree; verify exact commit, repository identity, license, lockfile, runtime files, package versions, migrations, routes, docs and SourceCraft workflow triggers.
- Materialization: import only tracked application tree into a fresh DON CITY branch/worktree; exclude `.git`, secrets, caches, build outputs and `.beads`; preserve and reconcile DON CITY canonical docs instead of overwriting them mechanically.
- Install: use the package manager/version declared by the fetched project; run frozen-lockfile dependency installation and only the baseline checks actually defined by `package.json`.
- Fallback: if exact SHA is unavailable or runtime/doc drift is material, stop EPIC-01 and record upstream evidence; do not silently use latest or upgrade packages.
- Stop: source identity/SHA mismatch, missing lockfile, secret material, automatic CI/deploy triggers, unresolved license or destructive bootstrap action.

## Owner Decision Register

### OD-01 — Delivery mode for implementation epics

- Decision: `MERGE_AFTER_GATE` разрешён для EPIC-00…47 и R2 implementation EPIC-50…52 после exact-plan approval.
- Execution: полный diff review → risk classification → один exact-head `STANDARD` или `RISKY` SourceCraft gate → merge без повторного owner-вопроса → verify canonical main → safe cleanup.
- Production: EPIC-48 всегда исключён и требует отдельной release-команды независимо от решения.
- Post-launch: EPIC-49 не получает автономных production/operations полномочий.
- Status: DECIDED by owner on 2026-09-23.

### OD-02 — Single DON CITY Timeweb server strategy

- Decision: существует один сервер DON CITY в Timeweb; он является единственным текущим hosting contour и предполагаемым production target после проверки пригодности.
- Constraint: новый server/instance, перенос БД, Managed PostgreSQL или S3 не создаются и не навязываются автоматически. Любое такое изменение требует evidence EPIC-03/06 и отдельного owner decision.
- Discovery: определить фактическое размещение БД, сервисы, backups и capacity read-only; не считать БД локальной или managed без доказательства.
- Status: DECIDED by owner on 2026-09-23.

## Stop conditions

- plan status не `APPROVED` или source SHA изменился после inventory;
- dependency cycle, неполное epic coverage или неизвестный repository identity;
- secret/server/database target неоднозначен;
- production/DNS/migration/write требует отдельного разрешения или recovery proof;
- R1 contract пытается активировать R2 route/module без research-first contract;
- exact-head gate отсутствует/неверифицирован для CRITICAL merge;
- единственная ready work требует owner/production action; независимая safe work исчерпана.

## Final-audit finding register

| ID | Severity | Evidence | Impact | Resolution | Status |
|---|---|---|---|---|---|
| F-01 | BLOCKER | v5 inventory: `53` epic nodes, `0` task nodes; Developer role can claim only implementation tasks | no autonomous ready queue; §33A Common Epic Contract not materialized | v6 inventory creates five task cards for each autonomous epic and one delivery task depending on all sibling tasks | RESOLVED in v6; re-audit required |
| F-V4-01 | BLOCKER | canonical validator detects only `EPIC-*` headings, while owner packet names `RP-00…RP-12` | V4 draft could not prove 66/66 heading coverage | assign technical anchors `EPIC-53…65` while retaining `RP-00…12` as exact owner-facing aliases | RESOLVED in v7 |
| F-V4-02 | BLOCKER | V3 already owns stable `dcn-*` IDs in the existing Beads store | reusing the prefix would collide or mutate historical ledgers | V4 uses plan-scoped prefix `dcv4`; V3 remains immutable in the same store and is excluded from V4 claims by plan label | RESOLVED in v7 |
| F-V4-03 | MAJOR | seven epics are merged and four are explicitly replaced by RP work | full replay would duplicate finished/superseded work | keep their sections as `HISTORICAL`/`SUPERSEDED`, exclude them from V4 executable anchors and retain their original V3 nodes/ledgers unchanged | RESOLVED in v7 |
| F-V4-04 | MAJOR | RP epics touch contracts also named in the remaining V3 main line | unclear ownership could cause duplicate edits | RP owns the city-first delta and freezes the new contract; later epics implement only residual product outcome not already proven by RP evidence | RESOLVED in v7 |
| F-V4-05 | LIMIT | owner packet mandates a strict thirteen-epic RP sequence | reduced parallelism until RP-12 | retain the sequence as an explicit temporary safety boundary; resume dependency waves afterward | ACCEPTED LIMIT |

## Inventory task materialization

Technical Task Manager anchors `EPIC-53…65` map to `RP-00…12`. For every
new RP epic and every unfinished/non-superseded implementation epic, the draft
inventory contains five task cards in this order:

```text
PREFLIGHT → IMPLEMENT → VERIFY → EVIDENCE → DELIVERY
```

Each card inherits the parent epic dependency; `DELIVERY` also depends on every sibling card. `PREFLIGHT` records entry/contract/external-stop evidence, `IMPLEMENT` changes the scoped product surface, `VERIFY` proves acceptance through task-relevant checks, `EVIDENCE` records documentation/traceability without duplicating source-of-truth requirements, and `DELIVERY` follows the parent `MERGE_AFTER_GATE` policy. EPIC-48 and EPIC-49 remain represented as non-autonomous parent epics pending their separate production/post-launch authority.

Completed V3 epics `00, 01, 02, 03, 04, 06, 16` and explicitly replaced
epics `08, 15, 18, 30` remain readable in this plan as `HISTORICAL` or
`SUPERSEDED`, but are not V4 executable anchors and receive no duplicate
cards. Their original V3 nodes and ledgers remain the evidence source.
EPIC-08 WIP is neither merged nor discarded by this transition.

The V4 inventory uses prefix `dcv4` and plan label
`AMS-DON-CITY-REPLAN-V4-CITY-FIRST`. The former `dcn` graph remains in the
same `.beads` store as immutable history; V4 `Next/Claim` filters it out by
plan identity. Creating another store, rewriting old ledgers or closing old
cards without evidence is forbidden.

RP epics are a strict chain because each changes the contract consumed by the
next. This exception is intentional and temporary; after RP-12 the remaining
main-line graph may reopen independent waves. If RP evidence already satisfies
part of a later epic, that later epic records reuse and performs only the
residual acceptance scope; completed work is never re-executed merely to fill
a card.

---

# 33B. STARTER → DON CITY UI TRANSFORMATION CONTRACT

## Precedence

```text
DON CITY Product Structure + URL/SEO registry + Page Strategy
→ DON CITY Project Design System
→ verified starter token/components/assets inventory
→ UI Development Constitution 4.4
→ implementation judgment
```

Starter is a snapshot and implementation base, not an update channel and not a second product/design source of truth.

## Design preservation decision

Owner-approved visual direction is already sufficient for planning:

- primary typeface: `Manrope`; EPIC-16 verifies the actual font source/license, Cyrillic glyph coverage and required weights before scaling;
- visual character: preserve the starter's useful composition, geometry, component behavior and general theme where compatible with DON CITY page intent;
- brand accent: convert the starter's brand-red semantic role to a dark-green role; exact shades are selected only after starter token inventory and must pass contrast checks;
- semantic red remains for error, destructive and critical warning states; this is not a blind global red→green replacement;
- numeric color values live only in the project token source. `docs/06_DESIGN_SYSTEM.md` records policy, not duplicated HEX values.

No separate finished design file is required before approval. The current Design System file records intent now; EPIC-16 completes the exact palette and component decisions from the installed starter before mass page implementation.

During EPIC-16, after EPIC-01/02 have materialized and activated the starter, inventory the actual:

- `globals.css`/token source, Tailwind setup and `components.json`;
- colors, typography, Cyrillic font coverage/license, widths, spacing, section rhythm, radii, borders, shadows and motion;
- primitives, layout components, header/footer, buttons/forms, cards, catalog/filter/gallery patterns and media ratios;
- page sections, responsive behavior, accessibility states and client boundaries;
- visual assets and any embedded donor branding/content/domain references.

Every item receives one disposition:

```text
REUSE       = safe, accessible, semantically compatible, no donor coupling
VARIANT     = good foundation, but needs DON CITY token/content/domain behavior
REPLACE     = conflicts with plan, accessibility, data boundary or brand
REMOVE      = unused, duplicate, speculative or donor-only
REQUIRES_OWNER_DECISION = material visual choice that cannot be inferred safely
```

Default preservation:

- keep accessible primitives, proven container/section geometry, working gallery/form behavior and useful responsive patterns;
- normalize reusable styles into one project-owned semantic token source;
- preserve recognisable visual character only when it does not weaken hierarchy, page intent, accessibility or performance;
- use `REUSE → VARIANT → CREATE`; do not introduce a second UI library or duplicate Button/Input/Card/Dialog foundation.

Mandatory replacement regardless of visual quality:

- donor company identity, copy, navigation, URL assumptions, metadata, canonical host, analytics identifiers and legal/NAP data;
- route-derived components that contradict §§7–8/23;
- raw Payload document coupling or unsafe client data contracts;
- placeholder claims, invented evidence and stale donor links.

## Design intake and representative page

Foundation order:

```text
starter UI inventory
→ normalization/disposition register
→ DON CITY semantic token schema
→ token + shadcn representative fixture
→ Project Design System update
→ section/page ownership map
→ representative /donetsk/kvartiry/ page
→ responsive/accessibility/SEO/browser proof
→ scale all remaining routes through REUSE → VARIANT → CREATE
```

`/donetsk/kvartiry/` is representative because it exercises global shell/menu, exact metadata/H1, catalog data, cards, filters, pagination, empty/error/loading states, CTA, responsive behavior and the public DTO boundary. Home is implemented after the foundation proves fit; it does not create a second visual language.

## Component ownership

```text
primitives → layout → shared → domain → page-specific → route composition
```

Every meaningful section is a component; route files primarily compose sections. Reusable UI receives DTO/ViewModel and never imports raw Payload documents, DB clients, secrets or authorization policy.

---

# 33C. PAGE COMPLETENESS / DOMAIN / METADATA GATE

## Planned route coverage

Implementation is incomplete until every applicable R1 route from §7 is materialized and the dynamic templates cover every registry candidate:

- Home and `/donetsk/`;
- apartment/house/land roots and Donetsk catalogs;
- approved district/microdistrict/facet candidates, including Textilshchik;
- apartment/house/land property detail templates;
- seller, lawyer, company, contacts, privacy, consent and thank-you;
- meaningful 404, platform error boundary and property 410 behavior;
- conditional nearby-geo pages only under §28 rules.

No page may be closed as DONE with only an empty route, placeholder heading or copied generic section.

## Minimum meaningful composition

Every planned page has at least one page-specific semantic block beyond global header/footer. This is a floor, not the target:

- commercial/static page: intent-led Hero plus at least one offer, evidence, catalog/service or CTA block appropriate to Page Strategy;
- catalog/geo/district/facet: H1/intro state + server-rendered listing or explicit empty state + next action;
- property detail: factual object content + gallery/characteristics as available + legal CTA from EPIC-28;
- legal/privacy/consent: actual applicable text and navigation; no fabricated clauses;
- thank-you: clear result, next step and safe navigation;
- 404/410/error: explanation and route back to a relevant catalog/home path.

Page blocks follow one role, one primary intent and one primary conversion goal. Claims without evidence are omitted or marked `требует проверки`.

## Exact page acceptance

For every rendered public route/template verify:

1. exactly one logical `h1` matching the approved registry/template;
2. exact or deterministically materialized `title` and `description` from §§24–25/seed data;
3. `metadataBase`, canonical, Open Graph URLs and sitemap URLs use only `https://doncity-home.ru` and the canonical trailing-slash owner;
4. robots/indexability follows page state, threshold and Content Gate;
5. header/menu matches §23 exactly; R2 links are absent in R1;
6. internal links resolve to approved DON CITY routes, not query equivalents where a path owner exists;
7. no donor domain, `/obekty/[slug]` href, stale brand, `localhost`, preview/staging host or hardcoded foreign canonical remains in public output;
8. server-rendered HTML contains the H1, primary content and required property links without JavaScript;
9. page has mobile/tablet/desktop behavior and loading/empty/error/success states where applicable;
10. CTA has a defined result and forms send the correct context/formKind without analytics PII.

## Link and domain proof

- central site URL/domain helper owns the canonical origin;
- internal links are relative or generated from typed route builders;
- link crawler checks all planned static routes and representative dynamic fixtures;
- repository/runtime scan rejects legacy domain/route references outside explicit compatibility tests/docs;
- real HTTP proof on staging covers status, redirect chain, canonical and final host;
- EPIC-46 performs the final full SEO crawl; browser/source inspection proves H1/metadata/link output, not only unit tests.

---

# REPLAN EPICS — MANDATORY BEFORE RESUMED MAIN LINE

Common entry: exact V4 plan is `APPROVED`, replacement inventory reconciles
cleanly in the existing stealth Beads store, and the epic starts from fresh
canonical `main`. Common exit: one PR, scoped review, declared gate, exact-head
merge evidence, clean main and `EXECUTION_LEDGER_V1`. Production/DNS/server/
secret mutation and destructive database work remain forbidden.

# EPIC-53 / RP-00 — CURRENT-STATE INVENTORY

Outcome: a factual impact inventory distinguishes `DONE_V3 | PARTIAL | ABSENT`
for every affected route, href builder, project literal, `/obekty/` dependency,
geo/site-settings/property field and already delivered V3 epic.

Scope: inspect `src/app/**`, public link/canonical/sitemap/lead construction,
Payload collections and current merged code. Read-only public discovery checks
whether category-first URLs were ever public/indexable and whether
`doncity-home.ru` exposes a legacy site. Only proven public URLs enter the
legacy manifest; uncertainty produces no redirect. Result:
`docs/replan/RP00_INVENTORY.md`, archived by RP-12.

Acceptance: every inventory row has status and file/runtime evidence; merged
and WIP-only surfaces are distinguished; old EPIC-08 WIP is identified but not
merged/discarded. Gate: `verify:merge-standard`.

# EPIC-54 / RP-01 — V4 SOURCE OF TRUTH / ADR / ARCHIVE VERIFICATION

Outcome: active project documentation consistently references this V4 plan,
the archived V3 snapshot is marked `SUPERSEDED`, and four decisions are durable:

- `ADR-001-city-first-grammar`;
- `ADR-002-city-hub-owns-general-intent`;
- `ADR-003-platform-project-split`;
- `ADR-004-entities-global-no-geo-in-path`.

Scope: verify and reconcile §§6–8, 16, 22–26, 28, 35, Product Structure,
Architecture, Backlog, Release Checklist and changelog. This epic does not
change plan approval or Beads authority. Active docs outside archive/changelog
must contain no category-first listing owner. Gate: `verify:merge-standard`.

# EPIC-55 / RP-02 — PLATFORM / PROJECT SPLIT AND HARDCODE GUARDS

Outcome: portable modules own grammar/resolver/geo/SEO/catalog/gate/sitemap/
IndexNow behavior; DON CITY values live only in Project inputs/data.

Scope: move already implemented geo/taxonomy/publicUrlId behavior without
semantic change; add `guard:platform-no-project-literals`; enforce no
Platform→Project import using existing repository architecture tooling; create
`docs/UPSTREAM_CANDIDATES.md`. Literal guard covers `donetsk`, `Донецк`, `ДНР`,
`ДОН СИТИ`, `doncity` under `src/platform/**`.

Acceptance: guards are green, dependency direction is proven, public behavior
is unchanged, no new linter is introduced solely for this rule. Gate:
`verify:merge-risky` + `verify:schema`.

# EPIC-56 / RP-03 — TYPED SITE PROFILE

Outcome: §32B typed Site Profile is the single owner of geo mode, category/
market activation, thresholds, inventory gates and facet whitelist.

Acceptance: profile validation tests pass; switching `kvartiry` to
`PREPARED_OFF` in a test profile returns `404` for every geo/apartment route
without product-code edits and removes it from sitemap/menu/linking. Gate:
`verify:merge-risky` + `verify:schema`.

# EPIC-57 / RP-04 — CANONICAL URL GRAMMAR

Outcome: `src/platform/grammar` exposes typed `PageKey`, `buildUrl` and
`parseUrl`; every internal/public URL consumer uses it.

`PageKey` is a discriminated union of `home | geoHub | categoryRoot |
categoryGeo | categoryGeoDistrict | categoryGeoFacet | property | static`.
Builders always emit lowercase trailing-slash paths. Replace URL construction
in menu, cards, breadcrumbs, sitemap, canonical, JSON-LD, IndexNow and lead
messages. `guard:no-literal-hrefs` rejects catalog path literals outside
grammar/tests.

Acceptance: property-based round-trip `parseUrl(buildUrl(key)) ≡ key` for every
key variant and all guards pass. Gate: `verify:merge-risky` + `verify:schema`.

# EPIC-58 / RP-05 — GEO MODEL / UNIQUENESS / COLLISION MIGRATION

Outcome: Regions/Cities/Districts satisfy §5 and feed matching is city-scoped.

Scope: add city grammatical fields, `agglomerationOf`, publication state;
region `shortName`; district composite `(city, slug)` uniqueness and nullable
parent; Payload hooks/guards for reserved/category/facet collisions; seed
Donetsk forms with `ownerVerified=false`. Inventory the unfinished EPIC-08
branch, reapply only verified compatible work from fresh main, and preserve
unknown district text/visibility.

Acceptance: up/down migration passes on empty and representative non-empty
PostgreSQL 18 data; seed is idempotent; city slug `kvartiry` and district slug
`odnokomnatnye` are rejected; Textilshchik remains `parent=null`. Gate:
`verify:merge-risky` + `verify:schema`.

# EPIC-59 / RP-06 — RESOLVER AND NEXT.JS ROUTES

Outcome: explicit static/service pages plus one catalog catch-all resolve only
through §§7–8 and Site Profile; `generateMetadata` consumes the same result.

Scope: remove V3 grammar routes if present; handle donor `/obekty/[slug]` only
when RP-00 proves public compatibility; property resolution uses `publicUrlId`
and canonicalizes semantic/category mismatch with one `301`; trailing slash
uses one `308`; four or more segments are `404`.

Acceptance: e2e matrix proves status/robots/canonical for every V4 owner and
negative cases: category-first Donetsk apartments, prepared newbuild,
district×facet and unknown third segment all return `404`. Gate:
`verify:merge-risky` + `verify:schema`.

# EPIC-60 / RP-07 — SEO REGISTRY / SEEDS / TEMPLATES

Outcome: stable registry IDs own new city-first URLs generated by grammar; all
50 Wordstat owners resolve against fixture data.

Scope: compute/guard CSV `url`; remap owners; require district `citySlug` and
`(citySlug, slug)` identity; move reusable draft templates to Platform with
data variables; keep exact Gate-passing strings materialized in CSV.

Acceptance: Textilshchik renders exactly `Купить квартиру на Текстильщике в
Донецке, ДНР | ДОН СИТИ` from data with no platform literal; every owner URL
resolves `200` in fixtures; active registry contains no V3 URL. Gate:
`verify:merge-risky` + `verify:schema`.

# EPIC-61 / RP-08 — NEARBY GEO UNDER CITY-FIRST GRAMMAR

Outcome: non-primary city hub/category pages follow §28 without false Donetsk
assignment or district publication.

Acceptance fixture `Макеевка, 2 квартиры`: `/makeevka/` and
`/makeevka/kvartiry/` are `200 noindex,follow`; `/makeevka/doma/` and any
nearby district route are `404`; inbound links exist only from properties of
that city. Replaces EPIC-30. Gate: `verify:merge-standard`.

# EPIC-62 / RP-09 — NAVIGATION / BREADCRUMBS / INTERNAL LINKING

Outcome: menu, breadcrumbs and linking follow §23 and are generated through
grammar/Profile only.

Scope: Home→hub/categories; hub→active categories and Gate-passing top
districts/facets; category→district/facet/property; property→actual city,
category, district and `/yurist/`; no query link when a path owner exists.

Acceptance: fixture crawl has no internal link to `404`, `301` or owned query
equivalent; SINGLE_GEO switcher is hidden. Gate: `verify:merge-standard`.

# EPIC-63 / RP-10 — GATEWAY / DTO / CACHE / ANALYTICS

Outcome: Public Gateway consumes `ParsedPath` or explicit geo/category inputs,
never an implicit Donetsk default; downstream contracts carry geo identity.

Cache tags: `geo:{slug}`, `geo:{slug}:cat:{category}`,
`district:{city}:{slug}`, `property:{publicUrlId}`. Publication/archive
invalidates the object's city, category and district. All §41 events include
`geo_slug` and `page_key` without PII.

Acceptance: DTO contract tests are updated/frozen and invalidation/analytics
tests prove exact dimensions. Gate: `verify:merge-standard` unless exact diff
changes schema or critical backend behavior, which escalates to RISKY.

# EPIC-64 / RP-11 — SITEMAP / ROBOTS / INDEXNOW

Outcome: §28 logical sitemaps, robots and IndexNow expose only grammar-owned
canonical URLs and meaningful lastmod.

Acceptance: fixture sitemap snapshot and XML validation pass; no V3 owner,
nearby geo or category root leaks into sitemap; canonical move submits both
old proven legacy URL and new URL. Gate: `verify:merge-standard`.

# EPIC-65 / RP-12 — TWO-PROFILE PROOF AND REPLAN CLOSURE

Outcome: `donetsk-single` and `multi-geo` fixtures prove that a second city is
enabled by profile/data/registry changes only, with no product-code edit.

Scope: run full e2e/sitemap/registry guard under both profiles; multi profile
uses Donetsk ACTIVE and Makeevka ACTIVE for apartments. Archive
`RP00_INVENTORY.md`, update §35 and `UPSTREAM_CANDIDATES.md`, write
`docs/replan/RP12_DONE.md` with exact SHA and portable-module list.

Acceptance: both matrices pass in `verify:merge-risky`; no `src/**` diff is
needed to switch the profile fixture; replacement graph can resume the
V4-adjusted main line. Delivery verification is RISKY because this is the
cross-contract closure despite its normal implementation gate.

---

# HISTORICAL EPIC-00 — SOURCECRAFT REPOSITORY / WORKSPACE

Create private client repo and separate workspace; starter untouched.

# HISTORICAL EPIC-01 — STARTER BASELINE + VERSION/DOC DRIFT

This is the first technical implementation Epic after exact plan approval.

1. Fetch/clone read-only starter `integrator-p/ams-realty-baza-starter` at exact `main@ca1b884d43e808d17e1eb18b05bad70ea358dd1c` into an isolated reference location; starter repository remains untouched.
2. Inventory tracked tree, license, `.node-version`/package-manager contract, `package.json`, lockfile, Payload/Next/React versions, migrations, actual `/obekty/[slug]`, env example, docs and SourceCraft workflows.
3. Materialize the verified tracked application tree into a fresh DON CITY branch/worktree without `.git`, secrets, caches, build outputs or `.beads`; reconcile conflicts with the already approved DON CITY docs rather than replacing them.
4. Install dependencies with the declared pnpm version and frozen lockfile. Do not start Docker/WSL or connect to production DB for baseline installation.
5. Run only existing baseline commands discovered from `package.json`; record exact versions, command results, source SHA and drift. If active starter docs repeat an older Payload version, correct only the client clone/source-of-truth and record upstream drift. No unnecessary upgrade.

Exit evidence: exact source SHA, imported tree manifest, clean lockfile install, verified runtime matrix, actual route proof and a pushed DON CITY checkpoint.

Stop conditions: source SHA/remote mismatch, missing lockfile, secret detected, undocumented destructive script, automatic push/PR CI, license uncertainty or baseline failure requiring architecture change.

# HISTORICAL EPIC-02 — CLIENT ACTIVATION

After EPIC-01 baseline PASS, set DON CITY identity, domain, locale/currency, run canonical client-clone cleanup and retain Core/guards/packages. Client activation must not erase starter provenance or weaken security/access guards.

# HISTORICAL EPIC-03 — ACTUAL INVENTORY / GEO / NAP BASELINE

After EPIC-01 baseline and EPIC-02 activation contract, recover/verify the dedicated Don City access contour and perform read-only discovery:

- SSH/hosting smoke: confirmed host identity, user, hosting type and relevant service names;
- database identity: managed/local provider, engine/version, database name alias, backup posture and read-only consumer smoke without exposing credentials or full URL;
- inventory: feed/source, category counts, actual localities, districtRaw values, subtype/unit values;
- content: canonical NAP and existing-site assets/pages that require migration.

Do not assume the database is local to the app server. Do not run migrations, import, UPDATE/DELETE, restart, DNS change or secret mutation. Do not create competing SEO docs. If dedicated access is still absent, record the blocker and continue only fixture-safe work.

# HISTORICAL EPIC-04 — FINAL SEO FREEZE FROM v1.0 + THIS MASTER PLAN

No separate SEO-dobor T-A. Materialize SEO and district seed CSVs from this embedded registry. Freeze R1 candidates, tiers, Home/ALL split, no-vtorichka and `/yurist/` only. No `/yurist/[usluga]/`.

# EPIC-05 — DOCS CONSOLIDATION / ARCHIVE

Make this file the only active master/SEO source of truth. Archive old SEO Passport and v2.2, mark SUPERSEDED. Project docs may reference but not duplicate the registry.

# HISTORICAL EPIC-06 — INFRASTRUCTURE / SECRET MASTER

Using the verified identity from EPIC-03, document the actual topology of the one existing DON CITY Timeweb server: OS/runtime, Nginx, application services, database placement/version, storage, backups, capacity and one jobs owner. Reuse this server as the presumed production target when it satisfies the contract. Do not create a second server, move the database or provision Managed PostgreSQL/S3 without evidence and a separate owner decision. Staging remains separate/noindex; secrets live only in a dedicated Don City Secret Master scope. Discovery remains read-only. Secret creation, DNS and production writes require their own authorized task and recovery proof.

# EPIC-07 — SITE SETTINGS / NAP

Create site-settings Global including `brandName`, one NAP DTO, RealEstateAgent input, remove starter dummy identity.

# SUPERSEDED EPIC-08 — GEO MODEL / DISTRICTS / TEXTILSHCHIK

Superseded by RP-05 for all unfinished scope. Preserve already merged evidence only; do not merge the pre-replan WIP branch directly.

# EPIC-09 — PROPERTY TAXONOMY

Active apartment/house/land; prepared commercial/room/garage; houseType dacha/part_of_house; land enums/plotAreaSotka normalization.

# EPIC-10 — PUBLIC URL ID

Add stable publicUrlId; preserve on same external identity; canonical semantic resolver + one 301; price forbidden.

# EPIC-11 — FEED TAXONOMY + GEO NORMALIZATION

Explicit source mapping; city-scoped Textilshchik matcher; unknown districts needsReview while object remains visible.

# EPIC-12 — CONTRACTS / DTO

Region/City/District + Apartment/House/Land DTO; prepared Commercial/Development DTO; freeze contracts after RP-10 geo-aware inputs.

# EPIC-13 — PUBLIC GATEWAY

Consume `ParsedPath` or explicit geo/category/district/facet inputs from RP-10; property by publicUrlId; actual published geographies rather than hardcoded city.

# EPIC-14 — SEO ENGINE / CONTENT GATE / SEED LOAD

Load RP-07 seed CSVs and implement Profile-owned SINGLE_GEO, P1/TEST threshold logic, Content Gate, district/facet status, query canonical mapping and sitemap eligibility.

# SUPERSEDED EPIC-15 — ROUTE RESOLVER / COLLISION GUARD / TRAILING SLASH

Superseded by RP-06. Preserve only evidence compatible with the city-first resolver.

# HISTORICAL EPIC-16 — UI INTAKE

Execute §33B completely: inventory and classify starter UI; install/verify Manrope with Cyrillic coverage; map the starter brand-red role to a contrast-safe dark-green brand role while preserving semantic error/destructive red; normalize one DON CITY token source; update Project Design System and section ownership map; compile token/shadcn fixture; then build `/donetsk/kvartiry/` as the representative page. Verify responsive, accessibility, data boundary, exact metadata/H1/canonical and performance-sensitive media before scaling. `REUSE→VARIANT→CREATE`; no second design system.

# EPIC-17 — NAVIGATION SHELL

Implement RP-09/§23 Profile-generated menu on desktop/mobile, logo → `/`, active/focus/keyboard behavior, header/footer NAP via safe DTO and no R2/donor links. Visual styling may reuse or variant the starter shell; information architecture may not.

# SUPERSEDED EPIC-18 — ROUTE SKELETON

Superseded by RP-06 catch-all/static route framework and §33C acceptance harness. Remaining work is page composition, never a second route grammar.

# EPIC-19 — HOME

Exact HOME metadata; agency/realtor/brand intent.

# EPIC-20 — `/donetsk/` ALL PROPERTY

Implement reusable `geoHub` template; Donetsk exact ALL metadata remains indexable and menu target `Вся недвижимость`.

# EPIC-21 — APARTMENT GEO CATALOG

`/kvartiry/` noindex root + `/donetsk/kvartiry/` index page; no vtorichka facet.

# EPIC-22 — APARTMENT DISTRICTS / MICRODISTRICTS

Dynamic district pages; Textilshchik parent=null; TEST rule; optional parent breadcrumbs without URL change.

# EPIC-23 — APARTMENT ROOM FACETS

1/2/3-room approved candidates; path navigation and query canonical ownership.

# EPIC-24 — HOUSE GEO CATALOG

Root + Donetsk geo catalog with house subtype support.

# EPIC-25 — HOUSE DISTRICTS / FACETS

P2 Kuibyshev/Budennovsky/Kirovsky; other six TEST with blank broad; dacha TEST.

# EPIC-26 — LAND GEO / FACETS

Root + Donetsk geo; IZH/SNT TEST; land taxonomy/unit normalization.

# EPIC-27 — PROPERTY CARD SYSTEM

Category-aware card, actual locality/district, category canonical href; no generic donor href.

# EPIC-28 — PROPERTY DETAIL ROUTES

Apartment/house/land global category routes; publicUrlId lookup; semantic or category mismatch gets one 301; factual unique blocks.

Every property page includes a block:

```text
Юридическая проверка объекта
→ /yurist/
lead formKind=legal
```

Verification status may be shown only from `documentCheckSummary`. If `documentCheckSummary` is empty, render a neutral CTA without any statement that the object has been checked.

# EPIC-29 — LIFECYCLE / DONOR ROUTE COMPATIBILITY

Prove 404/200/archived/301/410. Handle donor `/obekty/[slug]` only if compatibility is needed; no duplicate canonical.

# SUPERSEDED EPIC-30 — NEARBY GEO DATA / NOINDEX ROUTES

Superseded by RP-08. Indexing remains deferred to EPIC-49 Day-60 review.

# EPIC-31 — SELLER PAGE

Exact SELL metadata and seller lead flow.

# EPIC-32 — LAWYER PAGE

Only `/yurist/`, exact LAW metadata; no child service routes R1.

This route is the canonical target of the property-page block `Юридическая проверка объекта`. Legal inquiry forms use:

```text
formKind=legal
```

# EPIC-33 — COMPANY / CONTACTS / LEGAL

ABOUT/CONTACTS/PRIVACY/CONSENT/THANKS, NAP from site-settings.

# EPIC-34 — LEADS

Reuse starter engine; context category/district/city/property/formKind, including `formKind=legal`, with future mortgage/development fields nullable.

# EPIC-35 — INDEXNOW / LASTMOD

Use RP-04 grammar and RP-11 canonical-move behavior; meaningful sitemap lastmod; no deploy-wide spam.

# EPIC-36 — SITEMAPS / ROBOTS

Use RP-11 logical maps; include canonical Gate-pass pages only; no R2 maps.

# EPIC-37 — INTERNAL LINKING

Use RP-09 graph: Home→geo hub/category; hub→categories; categories→district/facet/property; property→actual geo/district/category/`yurist`; never link query equivalent when a path owner exists.

# EPIC-38 — CONTENT / INVENTORY ACTIVATION

Apply fixed thresholds from §14: P1>=5, P2>=5, TEST>=10; activate only pages that pass Content Gate (§16A). P1 is processed before P2 in the content queue; threshold is identical.

# EPIC-39 — FEED ONBOARDING

Normalize taxonomy/geo, preserve publicUrlId, unknown values needsReview, safe first baseline run.

# EPIC-40 — CACHE

Home/ALL/category/district/facet/property targets.

# EPIC-41 — ANALYTICS

all_property_view, category_catalog_view, district_view, facet_view, filter_apply, property_open, lead events, no PII.

# EPIC-42 — PERFORMANCE

RSC boundaries, catalog JS, pagination, media, DB/cache, LCP/CLS/INP.

# EPIC-43 — UI / ACCESSIBILITY QA

Representative Home, ALL, apartment/house/land geo, P1 district, Textilshchik, room facet, property, lawyer, contacts, 404/410.

# EPIC-44 — SECURITY / ARCHITECTURE AUDIT

Payload boundaries, publicUrlId, district/facet guard, feed normalization, NAP, IndexNow key, lead PII, S3, backup; P0/P1=0.

# EPIC-45 — TIMEWEB STAGING

Proof all R1 routes, districts/facets, nearby locality behavior, lifecycle, feeds/jobs/leads. Staging noindex.

# EPIC-46 — FULL SEO CRAWL

Verify Title/Description/H1/canonical against V4 owner mapping, absence of V3 routes, resolver precedence, query canonical, pagination, category root noindex, sitemap/robots/lastmod, JSON-LD/NAP and 301/308/404/410.

# EPIC-47 — RELEASE REHEARSAL + FINAL RELEASE CANDIDATE

Simulate deploy/rollback, full verify, exact SHA, immutable artifact and rollback point. No production action.

# EPIC-48 — PRODUCTION CUTOVER

Explicit owner trigger only: backup→exact SHA→artifact→migrations→jobs→Nginx→smoke→lifecycle→NAP/JSON-LD→sitemap/robots→IndexNow live→Webmaster→owner approval→public indexing.

# EPIC-49 — POST-LAUNCH / DAY-60 TEST REVIEW

Monitor Day 1/3/7/14/30/60. At Day 60 use Yandex Webmaster actual queries/impressions to re-evaluate TEST apartment districts, TEST house districts, TEST facets and nearby geographies. Tier change requires new PR; never backfill invented broad.

# EPIC-50 — R2 NEWBUILD / ЖК RESEARCH + ACTIVATION

First task before coding: Wordstat + SERP for newbuild/ЖК/developers in Donetsk. Then define exact R2 URL/meta/thresholds and activate prepared developers/developments/property relation. No R1 assumptions.

# EPIC-51 — R2 MORTGAGE RESEARCH + ACTIVATION

First task: Wordstat + SERP + official program-source verification. Only then decide `/ipoteka/` and exact metadata. Every rate/eligibility has `source + checkedAt`; no blanket 2% secondary claim without proof.

# EPIC-52 — R2 COMMERCIAL RESEARCH + ACTIVATION

First task: Wordstat + SERP for office/retail/warehouse/PSN and sale/rent. Then decide routes/meta/facets and whether sale/rent activate together. No R1 commercial route.

---

# 34. FUTURE AFTER EPIC-52

Possible owner-approved modules: MULTI_GEO, residential rent, room, garage, cottage villages, journal, employees, and `/yurist/[service]/` only if Webmaster + actual service portfolio justify.

---

# 35. CRITICAL ACCEPTANCE CHECKLIST

- [ ] One active Master Plan only: `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md`.
- [ ] V3 snapshot is archived and marked `SUPERSEDED`; old Task Manager graph is non-claimable.
- [ ] City-first listing grammar is the only active owner: `/{geo}/{category}/{sub}/`, maximum three segments.
- [ ] All public URL consumers use typed `buildUrl`; literal-path and registry-url guards pass.
- [ ] Platform contains no DON CITY/Donetsk literals and does not import Project.
- [ ] Site Profile is the single owner of category/geo statuses, thresholds and facet whitelist.
- [ ] `PREPARED_OFF` categories return 404 and appear in no sitemap/menu/link output.
- [ ] Global property URLs contain category + semantic + publicUrlId and no geo.
- [ ] Resolver negative matrix and single-hop redirect behavior pass.
- [ ] City slug, district slug and facet/category collision guards pass.
- [ ] District uniqueness is `(city, slug)` and feed matching is city-scoped.
- [ ] No other active doc duplicates URL map or Title/H1/Description.
- [ ] Old SEO Passport archived and marked SUPERSEDED.
- [ ] v2.2 archived and marked SUPERSEDED.
- [ ] Legacy all-property route is absent outside CHANGELOG.
- [ ] `/donetsk/` is index,follow with exact ALL metadata.
- [ ] Menu `Вся недвижимость` → `/donetsk/`.
- [ ] Textilshchik works with `parent=null`; URL independent of parent.
- [ ] Breadcrumb parent does not change canonical URL.
- [ ] Filter separates administrative districts and microdistricts.
- [ ] Textilshchik raw mapping works; unknown district does not hide property.
- [ ] Fallback broad is null/empty, never invented.
- [ ] Tier rule is explicit: P1 broad>=100, P2 broad=50–99, TEST broad missing/fallback.
- [ ] Index thresholds are numeric: P1>=5, P2>=5, TEST>=10, all plus Content Gate (§16A).
- [ ] Day-60 tier review is in EPIC-49.
- [ ] `vtorichka` facet absent R1.
- [ ] 1/2/3-room facets are candidates.
- [ ] dacha/IZH/SNT are TEST with blank broad.
- [ ] Single approved facet uses path navigation.
- [ ] Query equivalent canonical points to active path facet.
- [ ] `?district={slug}` transitions/canonicalizes to district path only after district Gate; otherwise canonical is category×Donetsk base.
- [ ] Administrative district and microdistrict metadata templates exist in §25; Textilshchik renders `на Текстильщике` correctly.
- [ ] Content Gate is defined only in §16A; other sections reference it.
- [ ] Every property page contains the `Юридическая проверка объекта` block targeting `/yurist/`, with `formKind=legal`.
- [ ] `/yurist/[service]/` absent R1.
- [ ] R2 Wordstat checks are first tasks EPIC-50/51/52.
- [ ] houseType includes dacha + part_of_house.
- [ ] room + garage PREPARED_OFF.
- [ ] landCategory/permittedUse/plotAreaSotka implemented.
- [ ] property resolver uses publicUrlId.
- [ ] semantic mismatch → one 301.
- [ ] publicUrlId survives same externalId relisting.
- [ ] price absent from slug.
- [ ] IndexNow implemented.
- [ ] sitemap lastmod meaningful.
- [ ] one NAP source.
- [ ] RealEstateAgent uses same NAP.
- [ ] Webmaster region setup is release checklist.
- [ ] Nearby geo route exists only for published geo with >=1 active object in category; otherwise 404; R1 page is noindex/not sitemap/not menu.
- [ ] Nearby city hub and category rules are separate; nearby district routes are 404.
- [ ] Two-profile proof enables Makeevka without product-code changes.
- [ ] actual starter `/obekty/[slug]` handled.
- [ ] package/docs Payload drift handled EPIC-01.
- [ ] all 50 Wordstat rows embedded.
- [ ] seed CSVs are data only.
- [ ] Sitemap/robots/IndexNow contain only grammar-owned V4 canonical URLs.
- [ ] Cache tags and analytics include geo identity (`geo_slug`, `page_key`).

---

# 36. FINAL EXECUTION ORDER

```text
RP-00    Current-state inventory
RP-01    V4 Source of Truth / ADR / archive verification
RP-02    Platform / Project split and hardcode guards
RP-03    Typed Site Profile
RP-04    Canonical URL grammar
RP-05    Geo model / uniqueness / collision migration
RP-06    Resolver and Next.js routes
RP-07    SEO registry / seeds / templates
RP-08    Nearby geo under city-first grammar
RP-09    Navigation / breadcrumbs / internal linking
RP-10    Gateway / DTO / cache / analytics
RP-11    Sitemap / robots / IndexNow
RP-12    Two-profile proof and replan closure

Then resume only remaining V4-adjusted main-line work; completed V3 evidence is reused.

EPIC-00  SourceCraft Repository / Workspace
EPIC-01  Starter Baseline + Version/Doc Drift
EPIC-02  Client Activation
EPIC-03  Actual Inventory / Geo / NAP Baseline
EPIC-04  Final SEO Freeze from v1.0 + v3.0 Contract
EPIC-05  Docs Consolidation / Archive
EPIC-06  Infrastructure / Secret Master
EPIC-07  Site Settings / NAP
EPIC-08  Geo Model / Districts / Tekstilshchik
EPIC-09  Property Taxonomy
EPIC-10  Public URL ID
EPIC-11  Feed Taxonomy + Geo Normalization
EPIC-12  Contracts / DTO
EPIC-13  Public Gateway
EPIC-14  SEO Engine / Content Gate / Seed Load
EPIC-15  Route Resolver / Collision Guard / Trailing Slash
EPIC-16  UI Intake
EPIC-17  Navigation Shell
EPIC-18  Route Skeleton
EPIC-19  Home
EPIC-20  /donetsk/ All Property
EPIC-21  Apartment Geo Catalog
EPIC-22  Apartment Districts / Microdistricts
EPIC-23  Apartment Room Facets
EPIC-24  House Geo Catalog
EPIC-25  House Districts / Facets
EPIC-26  Land Geo / Facets
EPIC-27  Property Card System
EPIC-28  Property Detail Routes
EPIC-29  Lifecycle / Donor Route Compatibility
EPIC-30  Nearby Geo Data / Noindex Routes
EPIC-31  Seller Page
EPIC-32  Lawyer Page
EPIC-33  Company / Contacts / Legal
EPIC-34  Leads
EPIC-35  IndexNow / Lastmod
EPIC-36  Sitemaps / Robots
EPIC-37  Internal Linking
EPIC-38  Content / Inventory Activation
EPIC-39  Feed Onboarding
EPIC-40  Cache
EPIC-41  Analytics
EPIC-42  Performance
EPIC-43  UI / Accessibility QA
EPIC-44  Security / Architecture Audit
EPIC-45  Timeweb Staging
EPIC-46  Full SEO Crawl
EPIC-47  Release Rehearsal + Final Release Candidate
EPIC-48  Production Cutover
EPIC-49  Post-launch / Day-60 TEST Review
EPIC-50  R2 Newbuild / ЖК Research + Activation
EPIC-51  R2 Mortgage Research + Activation
EPIC-52  R2 Commercial Research + Activation
```

---

# 37. PR TEMPLATE

```text
Goal
Scope
Files changed
Architecture impact
Schema impact
SEO / URL impact
Seed impact
Migrations
Tests
Verification
Known limitations
Rollback
Exact PR head SHA
```

After merge: record new SourceCraft main SHA, delete branch, next Epic starts from fresh main.

---

# 38. FINAL FORMULA

```text
AMS REALTY BAZA STARTER
+
ONE MASTER PLAN
+
EMBEDDED SEO REGISTRY
+
DONETSK / DISTRICTS / TEXTILSHCHIK
+
CITY-FIRST GEO × CATEGORY
+
TYPED GRAMMAR / DETERMINISTIC RESOLVER
+
WHITELIST PATH FACETS
+
PUBLIC URL ID
+
SECONDARY INVENTORY
+
INDEXNOW / LASTMOD
+
NAP / REAL ESTATE AGENT
+
PREPARED R2 DOMAINS
+
SOURCECRAFT
+
TIMEWEB
=
DON CITY V4
```

Главный принцип: районы и микрорайоны — полноценные SEO entities вторичного рынка, а не просто UI-фильтры.

Второй: `/donetsk/` владеет общим интентом недвижимости, Home — агентством/риелтором/брендом.

Третий: отсутствие Wordstat frequency означает пустой broad, а не выдуманное число.

Четвёртый: Textilshchik может иметь `parent=null`; parent не меняет URL.

Пятый: approved facet владеет path URL; query equivalent не становится главным внутренним SEO URL.

Шестой: R2 не смешивается с R1; newbuild, mortgage и commercial начинают с нового research preflight в EPIC-50…52.

Седьмой: единственный active master plan — `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md`.

Восьмой: Platform не знает Донецк или ДОН СИТИ; Project Profile и данные
инъецируют географию, бренд, статусы и SEO ownership.

# END
