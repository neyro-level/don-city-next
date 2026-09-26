# EPIC-46 — full SEO crawl preflight

Date: 2026-09-26
Base revision: `3745b955221f34ab5f1519d0b4cb7dad591062e0`
Mode: `VERIFY + FULL + CATALOG`, isolated Timeweb staging, read-only HTTP

## Outcome contract

EPIC-46 must produce a reproducible, normalized crawl of the approved R1 URL
families and compare rendered `Title`, `Description`, `H1`, canonical, robots,
HTTP lifecycle, sitemap/robots/lastmod, JSON-LD/NAP and internal links with the
V4 owner mapping. The proof must also cover resolver precedence, query and
pagination canonical rules, global category-root `noindex`, absence of V3
category-first owners and one-hop `301`/`308` plus real `404`/`410` behavior.

The crawl target is the authorized isolated staging runtime at
`https://staging.doncity-home.ru`. Its global `X-Robots-Tag: noindex, nofollow`
and deny-all `robots.txt` remain mandatory. The crawler therefore uses only an
explicit project-owned URL manifest and does not discover or mutate production.

## Entry evidence

| Entry condition | Result | Evidence |
| --- | --- | --- |
| Approved graph and exact source | PASS | Plan `AMS-DON-CITY-REPLAN-V4-CITY-FIRST` v7 is `APPROVED`; inventory reconciliation is clean. |
| Canonical base | PASS | Fresh task worktree starts from `origin/main@3745b955221f34ab5f1519d0b4cb7dad591062e0`. |
| Parent dependencies | PASS | EPIC-36, EPIC-37, EPIC-38, EPIC-45 and RP-12 / EPIC-65 are closed. |
| Staging identity and isolation | PASS | EPIC-45 proves a dedicated database, private media prefix, staging-only secrets, immutable candidate and no production data/schema operation. |
| Staging indexing boundary | PASS | HTTPS returns the fail-closed noindex header and `/robots.txt` denies all crawlers. |
| V4 ownership contract | PASS | Product Structure and master plan §§7–31 own URL, metadata, lifecycle, query, pagination, sitemap and NAP rules. |
| Search-console evidence | NOT APPLICABLE | Staging is intentionally non-indexable; Yandex Webmaster belongs to explicit production cutover/post-launch scope. It cannot strengthen this staging verdict. |

## Explicit coverage registry

| Family / state | Representative contract | Expected proof |
| --- | --- | --- |
| Home and static commercial | `/`, seller, lawyer, company, contacts | `200`, exact metadata/H1/canonical, visible content and stable links |
| Donetsk hub | `/donetsk/` | indexable page contract under the staging-wide noindex envelope |
| Global category roots | `/kvartiry/`, `/doma/`, `/uchastki/` | `200`, self-canonical, page robots `noindex,follow`, absent from sitemap |
| Donetsk category listings | apartment, house and land paths | exact registry metadata, canonical, listing composition and internal links |
| District/microdistrict | one administrative district and Textilshchik | Gate-aware metadata/indexability and correct inflection |
| Approved facets | room and land/house representative paths | owned path canonical; query equivalent stays `noindex,follow` |
| Pagination | page 1 and page 2+ | clean canonical for page 1; page 2+ self-canonical and `noindex,follow` |
| Nearby geo | published hub/category plus forbidden district | R1 noindex/not sitemap/not menu; unsupported combinations return `404` |
| Property lifecycle | active, semantic mismatch, archived and gone | `200`, one-hop `301`, retained noindex page or exact `410` per fixture |
| Unknown/disabled/V3 routes | unknown segments, prepared-off categories, historical category-first owners | real `404`; no canonical/sitemap/internal-link ownership |
| Redirect normalization | semantic mismatch and missing trailing slash | one-hop `301` or `308`; final host/path/canonical are correct |
| Machine-readable surfaces | robots and every sitemap child | only V4 canonical eligible URLs, correct status/host and meaningful `lastmod` |
| Structured data / NAP | home, contacts and representative property | parseable JSON-LD, visible-value consistency and one site-settings NAP source |
| Trust/legal/result states | privacy, consent and thanks | approved content, expected noindex/nofollow and safe navigation |

Hidden/draft/admin, API, preview, import, internal operations and authenticated
Payload surfaces are explicit deny scope. The crawl stores no response bodies,
cookies, authorization headers, secrets or PII.

## Execution boundaries

- Use an explicit manifest derived from project routes, SEO registry, fixture
  identities and sitemap output; do not infer completeness from link discovery.
- Respect the staging deny-all robots policy by treating it as evidence and by
  using only the already authorized project manifest, never a generic external
  crawler or search-bot identity.
- Limit structural HTTP concurrency to `2`, requests to at most `2 RPS`, and
  avoid retries that could warm caches or create load.
- Keep structural crawl and rendered browser sample distinct. Render at least
  one representative page for every applicable family/state needed to prove
  source-visible H1, canonical, robots, links and JSON-LD.
- Normalize findings by root cause and severity; a tool score is not a verdict.
- Do not generate sitemap content from crawl results and do not mutate
  Webmaster, IndexNow, CMS, DNS, server, database, media or secrets.

## Acceptance mapping

1. Exact metadata and H1 are compared with the generated V4 registry, not
   duplicated into a second hand-maintained truth source.
2. Resolver, query, pagination, root-noindex and lifecycle expectations are
   checked both through deterministic project contracts and real staging HTTP.
3. Sitemap/robots/lastmod, canonical host, redirect `Location`, JSON-LD/NAP and
   internal hrefs are captured as normalized evidence with representative URLs.
4. Coverage reports found/checked/skipped counts per family and records any
   timeout, truncation, WAF response or unavailable fixture.
5. Any P0/P1 or systematic mismatch fails the epic until fixed and rechecked;
   an unavailable required runtime family yields `PARTIAL`, never a false PASS.

## Stop conditions

- staging no longer matches the authorized isolated contour or loses its
  fail-closed noindex boundary;
- target identity, deployed candidate identity or fixture identity cannot be
  established without exposing a secret or touching production;
- the crawl would require authenticated admin/API access, real PII, production
  data, provider mutation, DNS, deployment or destructive database work;
- source/inventory drift or a new URL/indexability decision outside the
  approved V4 contract is discovered.

## Preflight verdict

`PASS` — the full catalog crawl is executable against isolated staging with an
explicit low-load manifest. No owner or external decision is required for this
read-only verification. Production and public indexing remain outside EPIC-46.
