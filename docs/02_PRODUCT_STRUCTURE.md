# Product Structure

Status: Draft
Version: 0.1
Updated: 2026-09-24

## URL model

Канонический полный реестр, metadata, district/facet rules и Wordstat mapping:
master plan §§7–31. Здесь фиксируется ownership без копирования таблиц.
Долговечные причины решений закреплены в ADR-001, ADR-002 и ADR-004 из
`docs/adr/README.md`.

- `/` — brand/agency/realtor intent.
- `/donetsk/` — вся недвижимость.
- `/{geo}/{kvartiry|doma|uchastki}/` — geo × category.
- Third segment — district/microdistrict of that city, затем approved facet; иначе 404.
- Property canonical — `/{category}/{semantic}-{publicUrlId}/`; geo is data, not path identity.
- Category roots в `SINGLE_GEO` — `200 noindex,follow`.
- Nearby geo hub/category in R1 — only published + matching active inventory, `noindex`, not sitemap/menu; nearby district routes are 404.
- Every URL consumer uses the typed grammar from master plan RP-04; active
  category-first listing ownership отсутствует.

## Primary flows

1. Home → all/category → district/facet → property → lead.
2. Seller page → seller lead.
3. Property legal CTA → `/yurist/` → `formKind=legal` lead.
4. Payload Admin → inventory/content/settings/import operations.

## SEO structure

- Один intent → один canonical owner.
- Query filter не является SEO landing.
- Content Gate и numeric thresholds — master plan §§14–16A.
- Sitemap включает только canonical/indexable/Gate-pass URLs.
- Evidence Wordstat хранится в master plan до выделения research artifact; финальные решения принадлежат этому документу через ссылки на exact sections.
- `docs/seo/SEO_REGISTRY_SEED.csv` materializes the approved static, district and facet rows; `docs/seo/DISTRICT_REGISTRY_SEED.csv` materializes Donetsk district grammar and tiers. These are the only active SEO seed files and never replace this URL/index/canonical ownership layer.
- Seed status `candidate` means the URL is structurally approved but remains `noindex` and outside sitemap until the inventory threshold and Content Gate pass.
- The owner-confirmed single production origin is `https://doncity-home.ru`; seed URLs stay root-relative and all rendered canonical, Open Graph, sitemap, robots and JSON-LD URLs use that origin.
- Secondary/`vtorichka` intent belongs to `/donetsk/kvartiry/`; no `vtorichka` facet exists. R1 legal scope is exactly `/yurist/`, with no `/yurist/[usluga]/` routes.

## Required states

Loading/empty/error/404/410, below-threshold noindex, archived property, semantic 301, trailing-slash 308, lead success `/spasibo/`.

## Page completeness matrix

Exact Title/Description/H1 values and templates live in master plan §§24–25. Every row below must produce a real composition, not an empty route.

| Route family | Primary role / intent | Required meaningful composition | Index contract |
|---|---|---|---|
| `/` | agency / realtor / brand | intent-led Hero, category choice/current inventory, seller/legal paths, evidence/CTA using verified facts | index |
| `/donetsk/` | all property | H1/intro, category navigation, server-rendered listing or empty state, next action | index |
| `/kvartiry/`, `/doma/`, `/uchastki/` | global category bridge | H1, Donetsk path/summary and useful navigation; no empty placeholder | noindex |
| category × Donetsk | category catalog | H1/intro, filters, listing/empty/error/pagination, contextual CTA | index |
| district/microdistrict | local catalog | exact materialized metadata/H1, verified intro/context, listing/empty state, parent-safe breadcrumbs | Gate-dependent |
| approved facet | focused catalog | exact intent/H1, factual intro, listing/empty state, canonical path ownership | Gate-dependent |
| property detail | inspect object | factual heading, media/parameters/geo/description as available, lead action and legal CTA | property Gate-dependent |
| `/prodat-nedvizhimost/` | seller acquisition | concrete offer, process/evidence available, seller CTA/form | index |
| `/yurist/` | legal inquiry | service scope without invented claims, risk reduction, legal CTA/form | index |
| `/o-kompanii/` | trust/company | verified company facts, approach/evidence and next action | index |
| `/kontakty/` | contact/visit | canonical NAP, schedule/contact actions and safe map/address behavior | index |
| privacy/consent | legal compliance | applicable approved legal text and navigation | noindex |
| `/spasibo/` | lead result | confirmation, expected next step and safe navigation | noindex,nofollow |
| nearby geo | factual nearby inventory | H1/geo context, listing/empty handling; no menu promotion | noindex R1 |
| 404/410/error | recovery | clear state and relevant route back to home/catalog | noindex |

## Global navigation contract

Header/menu is exactly master plan §23. Starter menu may contribute visual/components behavior only. Labels, hierarchy and hrefs are replaced by the DON CITY contract. No R2 navigation appears in R1.

## Domain, links and page metadata

- Production origin: `https://doncity-home.ru`.
- Canonical and Open Graph URLs use the production origin and canonical trailing slash.
- Internal links use approved relative routes or typed route builders.
- One logical H1 per page; it does not silently diverge from the approved registry/template.
- Title/Description are exact registry values or deterministic rendered templates materialized in seed data.
- Donor domains, old brand, `localhost`, preview/staging hosts and generic `/obekty/[slug]` hrefs are forbidden outside explicit compatibility tests/docs.
- Each page has a primary role, primary intent, primary conversion goal, page-specific semantic block and defined mobile path.
