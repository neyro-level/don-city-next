# RP-00 current-state inventory

Snapshot: `origin/main@8dfd7a6c8568a46dc9c0c7430e99c2e75ce9bcfd`
Approved-plan base: `origin/codex/replan-v4@1f69be16b99bb55f53f6ccb6fafaf9a94ee74b24`
Inventory date: `2026-09-24`

Statuses:

- `DONE_V3` — merged and evidenced V3 outcome; it may still require an explicit V4 delta.
- `PARTIAL` — a usable surface exists, but it does not satisfy the V4 contract.
- `ABSENT` — no implementation exists in merged main.
- `WIP_ONLY` — implementation exists only as preserved unmerged work and is not runtime truth.

## 1. Delivered V3 evidence

| Epic | Status | Merged evidence | V4 treatment |
|---|---|---|---|
| EPIC-00 repository/workspace | DONE_V3 | `d751d93` and SourceCraft repository history | reuse; no replay |
| EPIC-01 starter baseline | DONE_V3 | `1d0e229`; `docs/research/EPIC-01_*` | reuse verified starter provenance |
| EPIC-02 client activation | DONE_V3 | `4b95263`; DON CITY identity/config | reuse; project literals are reclassified by RP-02 |
| EPIC-03 actual inventory/infra | DONE_V3 | `1d25364`; `docs/research/EPIC-03_*` | reuse read-only server/DB evidence |
| EPIC-04 SEO freeze | DONE_V3 | `8dfd7a6`; `docs/seo/*.csv` | V3 keyword/metadata evidence remains; URLs are remapped by RP-07 |
| EPIC-06 infrastructure contract | DONE_V3 | `79b8ecf`; `docs/research/EPIC-06_*` | reuse; no server/secret mutation in RP work |
| EPIC-16 UI intake | DONE_V3 | `b0834e7`; `docs/research/EPIC-16_*` | reuse starter visual foundation; V4 navigation/routes take precedence |

## 2. Route and URL ownership

| Surface | Status | Merged evidence | V4 delta owner |
|---|---|---|---|
| Home `/` | DONE_V3 | `src/app/(site)/page.tsx` | later page outcome remains |
| Generic catalog `/nedvizhimost` | PARTIAL | `src/app/(site)/nedvizhimost/page.tsx` | RP-06/RP-09 decide its retained static/service role |
| Category-first apartments `/kvartiry/donetsk/` | PARTIAL | `src/app/(site)/kvartiry/donetsk/page.tsx`; canonical is a literal | replace with `/donetsk/kvartiry/` in RP-06 |
| City-first catalog routes | ABSENT | no `/{geo}/{category}/{sub}/` catch-all or resolver | RP-04/RP-06 |
| Property `/obekty/[slug]` | PARTIAL | `src/app/(site)/obekty/[slug]/page.tsx`; DTO/provider/lead/sitemap literals | replace with global category + semantic + `publicUrlId`; compatibility only if public evidence appears |
| Static service/legal routes | PARTIAL | existing `kontakty`, `o-kompanii`, `prodat`, `sdat`, `uslugi`, privacy/consent; current names differ from final menu in places | RP-01/RP-09 and later page epics |
| Typed `PageKey`, `buildUrl`, `parseUrl` | ABSENT | no `src/platform/grammar` and no typed owner | RP-04 |
| Deterministic city-first resolver | ABSENT | route files resolve independently; no §8 resolver | RP-06 |
| Four-or-more segment rejection / district×facet rejection | ABSENT | no V4 catch-all | RP-06 |
| Canonical trailing-slash policy | PARTIAL | individual routes and Next configuration provide local behavior | RP-04/RP-06 centralize it |

## 3. Literal URL consumers

| Consumer | Status | Evidence |
|---|---|---|
| Property DTO/cards | PARTIAL | `src/core/data-access/public/dto.ts`, `provider.ts`, `catalog.ts`, `src/fixture/provider.ts` build `/obekty/${slug}` |
| Lead context | PARTIAL | `src/core/data-access/public/leads.ts` validates `/obekty/${property.slug}` |
| Sitemap | PARTIAL | `src/app/sitemap.ts` + public provider emit page slugs and `/obekty/` property paths |
| HTML sitemap | PARTIAL | `packages/ui/src/views/shared/HtmlSitemapListingView.tsx` emits `/obekty/${item.slug}` |
| Navigation/shell | PARTIAL | fixture, DTO and UI shell contain `/nedvizhimost`, `/uslugi`, `/ipoteka`, `/kontakty`, `/prodazha-nedvizhimosti` and other literal paths |
| Canonical/metadata | PARTIAL | `src/app/layout.tsx` owns `metadataBase`; route metadata uses literal canonical paths |
| Cache invalidation | PARTIAL | generic revalidation exists under `src/core/cache/**`; V4 geo/category/district tag vocabulary is absent |
| IndexNow | ABSENT | no merged IndexNow implementation found |
| V4 literal-href guard | ABSENT | no `guard:no-literal-hrefs` command found |

## 4. Platform / Project / Site Profile

| Contract | Status | Evidence |
|---|---|---|
| Project-owned identity/domain | DONE_V3 | `src/project/site.config.ts` owns `https://doncity-home.ru` |
| Existing portable layer | PARTIAL | reusable behavior lives under `src/core/**`, but V4 requires explicit `src/platform/**` ownership |
| Platform→Project dependency rule | ABSENT | no V4 guard and no `src/platform/**` boundary |
| Project-literal guard | ABSENT | Donetsk/DON CITY and path literals still occur in core/fixtures/UI |
| Typed Site Profile | ABSENT | no owner of `geoMode`, market/category statuses, thresholds and facet whitelist |
| `ACTIVE | PREPARED_OFF | NOINDEX_AUTO` route policy | ABSENT | current runtime has no profile-driven category/geo state |
| `SINGLE_GEO` switcher policy | PARTIAL | `CitySwitcherView` exists, but no typed profile controls it |

## 5. Geo and property schema

| Contract | Status | Merged evidence | Preserved WIP |
|---|---|---|---|
| Regions collection | ABSENT | not registered in merged `payload.config.ts` | untracked `src/project/collections/Regions.ts` in EPIC-08 worktree |
| Cities collection | ABSENT | not registered in merged config | untracked `Cities.ts`, seed/guards in EPIC-08 worktree |
| Districts collection | ABSENT | not registered in merged config | untracked `Districts.ts`, migration and checks in EPIC-08 worktree |
| Property geo relationships | PARTIAL | merged `Properties.ts` stores `region`, `locality`, `district` as text | WIP converts them to relationships and retains `districtRaw` |
| Global city-slug uniqueness | ABSENT | no merged Cities collection | partial WIP; must be checked against V4 grammar/collision contract |
| `(city, district.slug)` uniqueness | ABSENT | district is merged free text | partial WIP; RP-05 owns final implementation |
| City grammatical fields / `agglomerationOf` / publication state | ABSENT | no merged typed geo collections | WIP requires V4 compatibility review |
| `publicUrlId` | ABSENT | property identity is the unique `slug` field; no `publicUrlId` occurrence | RP main-line contract after RP-04/RP-06 |
| Property market/category | DONE_V3 | `Properties.ts` has indexed `market` and `category` | reuse through typed grammar/profile |

## 6. Gateway, SEO, navigation and runtime contracts

| Contract | Status | Evidence | V4 owner |
|---|---|---|---|
| Public Gateway + explicit DTO | DONE_V3 | `src/core/data-access/public/**`; explicit access/select/DTO foundation exists | RP-10 changes inputs and geo identity without removing boundary |
| Explicit geo input | PARTIAL | catalog query uses string `city/locality` and `district`; provider can infer locality | RP-10 removes implicit/project default assumptions |
| SEO Registry seed | PARTIAL | stable registry IDs and V3 metadata exist, but active URLs are category-first and source is `master_plan_v6` | RP-07 remaps URL owner through grammar |
| District registry | PARTIAL | district seed includes `geoSlug=donetsk`; identity is not typed `(citySlug, slug)` | RP-05/RP-07 |
| Exact Textilshchik strings | DONE_V3 | `DISTRICT_REGISTRY_SEED.csv` and SEO seed contain verified forms/metadata | reuse data; do not hardcode in Platform |
| Sitemap/robots | PARTIAL | `src/app/sitemap.ts`, `src/app/robots.ts`, indexing policy exist | RP-11 changes URL and inclusion policy |
| Navigation/breadcrumbs | PARTIAL | starter shell/DTO/UI components exist with literal V3/donor-style routes | RP-09 rewires through grammar/Profile |
| Analytics geo/page dimensions | ABSENT | no proven merged `geo_slug` + `page_key` event contract | RP-10 |
| Nearby geo | ABSENT | no merged city relationship/page policy | RP-08; replaces EPIC-30 |

## 7. EPIC-08 preserved WIP

Classification: `WIP_ONLY`, not merged and not runtime truth.

- Worktree: `C:/Users/Юлия Скрицкая/Desktop/Проекты разработка/4. Дон сити--epic-08`.
- Branch/head: `codex/epic-08-geo-model@f26853fd81c09e9c0bc2f9c57003c5f1ed5b8b21`.
- Committed delta against `origin/main`: preflight documentation/delivery-state only.
- Uncommitted scope: Regions/Cities/Districts collections, geo guards, seed/check scripts, Payload migration, property relationships, public DTO/query/ingest adaptations and generated types.
- The diff also contains broad formatting churn in `migrations/index.ts`; RP-05 must not copy it blindly.
- Disposition: keep worktree unchanged. RP-05 starts from then-current main, inventories each WIP file, ports only V4-compatible behavior and independently regenerates migration/types. No merge, rebase, stash, reset or deletion is authorized here.

## 8. Public/domain observation

Read-only observation on `2026-09-24`:

- DNS A record resolved `doncity-home.ru` to `92.53.97.177`.
- HTTPS requests to `/`, `/kvartiry/donetsk/`, `/donetsk/kvartiry/` and `/obekty/test/` failed before an HTTP response because the remote TLS handshake did not complete.
- Plain HTTP returned an empty reply or timeout; no status/canonical/redirect chain was reproducible.
- Web search for `site:doncity-home.ru`, category-first and `/obekty/` paths returned no indexed result in the checked source.

Conclusion: no category-first or `/obekty/` public URL is proven. The legacy
redirect manifest is intentionally empty. A later reproducible crawl/search
artifact may add a compatibility redirect, but uncertainty must remain `404`
rather than inventing a redirect.

## 9. RP handoff matrix

| RP | Confirmed starting point |
|---|---|
| RP-01 | V4 docs exist; active docs still carry a few V3 implementation facts that need explicit ADR/source alignment |
| RP-02 | `core/project` foundation exists; explicit `platform/project` split and literal guards are absent |
| RP-03 | Site Profile is absent |
| RP-04 | typed grammar is absent; literal consumers are enumerated above |
| RP-05 | merged geo schema is absent; substantial EPIC-08 WIP is preserved separately |
| RP-06 | category-first and `/obekty/[slug]` runtime routes exist; city-first resolver is absent |
| RP-07 | metadata/keyword evidence exists; registry URLs remain V3 category-first |
| RP-08 | nearby geo model/routes are absent |
| RP-09 | shell exists; menu, breadcrumbs and links require grammar/Profile migration |
| RP-10 | gateway/DTO/cache foundations exist; explicit V4 geo/page contracts are incomplete |
| RP-11 | sitemap/robots exist; IndexNow and V4 inclusion rules are absent |
| RP-12 | no two-profile proof exists |

## 10. Exit decision

RP-00 may proceed to verification. The inventory found no need for production,
DNS, server, database or secret mutation and introduced no redirect manifest.
The only preserved implementation outside main is EPIC-08 WIP, explicitly
handed to RP-05 under selective-port rules.
