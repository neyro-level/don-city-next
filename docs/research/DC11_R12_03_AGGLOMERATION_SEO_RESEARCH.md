# DC10-R12-03 — agglomeration SEO research

Status: EVIDENCE COMPLETE; OWNER DECISION REQUIRED

Observation date: 2026-09-28

Canonical decision owner: `docs/02_PRODUCT_STRUCTURE.md`

## 1. Decision boundary

This document measures the Makeevka hypothesis and recommends a later route
order. It does not approve a locality record, coordinates, inventory, route,
sitemap entry, navigation link or indexability state.

Current production evidence has no Makeevka locality/inventory owner. Live
requests to `/makeevka/` and `/makeevka/kvartiry/` returned `404` on
2026-09-28; `sitemap.xml` returned `200` with no `makeevka` entry. That is the
required fail-closed state before R12-04.

## 2. Sources and limitations

| Source | Date / period | Scope | Limitation |
| --- | --- | --- | --- |
| Yandex Wordstat SearchAPI | 2026-09-28 | Top phrases for six Russian geo-modified seeds | The region tree returned no Donetsk/Makeevka ID, so the locality was encoded in each phrase. Counts overlap and must not be summed. |
| Yandex Wordstat dynamics | 2025-09 through 2026-08 | Monthly counts for apartment and house purchase phrases | Completed calendar months only; this is demand evidence, not traffic forecast. |
| Yandex SearchAPI RU | 2026-09-28 | First 10 result groups for apartment, house and general real-estate queries | Result order is a dated SERP sample, not position monitoring. |
| Live DON CITY HTTP | 2026-09-28 | Candidate routes and sitemap | Confirms current reachability only; it does not prove future inventory. |
| R11/R12 project evidence | 2026-09-28 | Production geo/inventory baseline and fail-closed model | No Makeevka record, verified coordinates or owner approval currently exists. |

No Topvisor paid task was started. Yandex Webmaster impressions were not used:
they are not regional demand, and no accessible verified-site export was needed
to decide this candidate.

## 3. Wordstat evidence

All counts below are returned Wordstat values for the exact displayed rows.
They are not additive because phrases overlap.

| Seed / returned phrase | Count | Interpretation |
| --- | ---: | --- |
| `макеевка недвижимость` | 457 | General locality demand exists. |
| `недвижимость макеевка днр` | 198 | DNR-modified general demand exists. |
| `квартиры в макеевке` | 2,106 | Broad apartment intent; includes sale and rental branches. |
| `купить квартиру в макеевке` | 990 | Strong hot sale intent. |
| `купить квартиру в макеевке днр` | 490 | Strong DNR-qualified sale intent. |
| `купить дом в макеевке` | 636 | Strong hot house-sale intent. |
| `купить дом в макеевке днр` | 364 | Strong DNR-qualified house intent. |
| `купить участок в макеевке` | 23 | Low but non-zero land-sale intent. |
| `купить участок в макеевке днр` | 12 | Low DNR-qualified land intent. |
| `коммерческая недвижимость макеевка` | 47 | Mixed sale/rent intent. |
| `продажа коммерческой недвижимости макеевка` | 4 | Weak explicit sale intent. |
| `купить коммерческую недвижимость в макеевке` | 1 | Insufficient purchase evidence for a dedicated launch route. |

### Completed-month dynamics

| Month | Buy apartment | Buy house |
| --- | ---: | ---: |
| 2025-09 | 833 | 597 |
| 2025-10 | 881 | 687 |
| 2025-11 | 904 | 693 |
| 2025-12 | 708 | 461 |
| 2026-01 | 930 | 590 |
| 2026-02 | 742 | 777 |
| 2026-03 | 970 | 1,009 |
| 2026-04 | 1,187 | 668 |
| 2026-05 | 829 | 506 |
| 2026-06 | 885 | 447 |
| 2026-07 | 966 | 575 |
| 2026-08 | 1,090 | 626 |

Both purchase intents persist across all 12 completed months. The evidence
supports durable apartment and house clusters; it does not support a claim
about conversion, market size or expected DON CITY traffic.

## 4. Dated SERP evidence

The Yandex RU sample shows dedicated Makeevka inventory pages rather than
generic Donetsk pages.

| Query | Repeated result types / domains | Conclusion |
| --- | --- | --- |
| `купить квартиру в Макеевке ДНР` | `dnr.red`, `doneck.domclick.ru`, `avito.ru`, `dnr.sale`, `vkupiprodai.ru`, `realbase.estate`, `kupidnr.com`, `domick.ru`, `dnr.homes` | Transactional locality/category landing is the dominant intent. |
| `купить дом в Макеевке ДНР` | `dnr.red`, `avito.ru`, `doneck.domclick.ru`, `vkupiprodai.ru`, `dnr.homes`, `kupitvdnr.ru`, `domick.ru`, `realbase.estate` | Separate house inventory is expected by the SERP. |
| `недвижимость Макеевка ДНР` | category aggregators, classifieds and local agencies | A general locality hub can support discovery, but only with real cross-category inventory. |

Representative dated result URLs:

- <https://doneck.domclick.ru/pokupka/kvartiry/doneckaya-narodnaya-respublika/makeevka>
- <https://doneck.domclick.ru/pokupka/doma/doneckaya-narodnaya-respublika/makeevka>
- <https://dnr.red/makejevka/search/nedvizhimost/prodazha-nedvizhimosti/prodazha-kvartir/>
- <https://dnr.red/makejevka/search/nedvizhimost/prodazha-nedvizhimosti/prodazha-domov/>
- <https://www.avito.ru/makeevka/nedvizhimost>

## 5. Slug and locality recommendation

### Recommended candidate slug: `makeevka`

Reasons:

1. It is already the collision-free candidate in Site Profile and URL tests.
2. Major SERP owners use `/makeevka/` (Domclick and Avito); alternate spellings
   `makejevka`, `makeyevka` and `makieievka` also exist but are less consistent.
3. The public Cyrillic name remains `Макеевка`; the slug is only URL identity.

If the owner later approves activation, alternate Latin spellings must not
become parallel canonical pages. They may exist only as explicit one-hop
redirect inputs when actual legacy demand or inbound links are proven.

### Recommended locality list

| Locality | Research verdict | Activation now |
| --- | --- | --- |
| `makeevka` / Макеевка | `RECOMMEND AS THE ONLY R12-04 CANDIDATE` | `NO` — owner approval, verified coordinates, actual locality inventory and content/data gates are still absent. |

No other nearby locality was researched deeply enough for a whitelist decision.
Do not infer Gorlovka, Yasinovataya, Khartsyzsk or district routes from Wordstat
associations.

## 6. Recommended route priority

| Priority | Candidate URL | Intent | Recommendation |
| --- | --- | --- | --- |
| P1 | `/makeevka/kvartiry/` | Apartment purchase | First category candidate after owner + geo + inventory/content gates. |
| P1 | `/makeevka/doma/` | House purchase | Second category candidate; demand is durable and separately represented in SERP. |
| P2 | `/makeevka/` | General Makeevka property | Activate with the first approved category only when it can show factual cross-category or clearly scoped inventory. |
| P3 | `/makeevka/uchastki/` | Land purchase | Keep gated until at least the approved minimum active inventory and unique content exist. |
| HOLD | `/makeevka/kommercheskaya/` | Commercial-property sale | Do not create now: explicit purchase/sale evidence is too weak. |
| FORBIDDEN NOW | `/makeevka/{district-or-facet}/` | District/facet long tail | No locality district model, research or owner whitelist exists. |

Rental phrases are visible in Wordstat, but `arenda` is `PREPARED_OFF` in the
product contract and is outside this recommendation.

## 7. Activation recommendation

Recommendation: **approve `makeevka` as the sole candidate for R12-04 design,
but do not activate any route now.**

R12-04 may make only the approved priority routes reachable after all of these
are true:

1. owner explicitly approves the locality and canonical slug;
2. R12-02 eligibility has verified coordinates for Donetsk and Makeevka and a
   current distance no greater than 50 km;
3. properties retain their actual Makeevka relation and are never counted as
   Donetsk;
4. the later unified gate has at least its approved minimum active inventory
   for each category and persistent evidence;
5. metadata, visible content, canonical, sitemap, navigation and IndexNow are
   activated only for the same approved route set.

Until then, current `404`, no-link and no-sitemap behavior is correct.

## 8. Confirmed vs hypothesis

Confirmed:

- Apartment and house purchase demand is persistent in Wordstat.
- The sampled Yandex SERP expects separate Makeevka inventory pages.
- `makeevka` is a defensible canonical Latin slug.
- DON CITY currently has no evidence allowing immediate activation.

Hypothesis / requires later proof:

- DON CITY can acquire enough active Makeevka inventory to satisfy the gate.
- A general hub will add value beyond the first category landing.
- Land demand can justify a dedicated page after inventory appears.
- Any district, room, house-type or commercial subroute deserves activation.

## 9. Document impact

- Added this dated research evidence.
- Updated `docs/02_PRODUCT_STRUCTURE.md` with the non-activating recommendation
  and pending owner gate.
- Reviewed PRD, Architecture, Backlog, Release Checklist, Project and Operations
  without changing their current state.
- No production, DNS, secrets, data, routes, navigation, sitemap or monitoring
  tasks were changed.
