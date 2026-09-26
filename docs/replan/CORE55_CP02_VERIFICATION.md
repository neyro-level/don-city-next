# CORE55 CP-02 VERIFICATION

Status: `LOCAL PASS`
Task: `dc55-task-69-verify`
Branch: `codex/dc55-epic-69`
Verified implementation: `a916cd845bf1ad503eb280c254a93971bd4ba9ed`

## Acceptance proof

| Contract | Evidence | Verdict |
|---|---|---|
| Both indexing policies are deterministic | `verify:indexing-policy` proves 20 page/header cases; `verify:cp02-seo-surface` snapshots global noindex and public robots text | PASS |
| Public media remains crawlable without opening private API | Public robots has the longer `/api/media/file/` allow rule and retains `/api/` disallow; release mode remains full `Disallow: /` | PASS |
| Root sitemap lists only successful non-empty shards | Pure response tests parse the XML and exclude the empty fixture; built local `/sitemap.xml` listed only shard 0, 1 and 2 | PASS |
| Sitemap cannot cache a false empty success | Provider-failure fixtures return `503`, `Retry-After: 300` and `private, no-store`; empty/unknown shard is `404` | PASS |
| Metadata is complete and factual | Canonical absolute URL, site name, locale, Open Graph and Twitter snapshots pass; property social image is included only from its public DTO | PASS |
| Structured data covers every public page type | Home keeps WebSite/Organization; catalog emits ItemList/Breadcrumb, property emits Offer/Breadcrumb, static/legal emits Breadcrumb and NAP-bearing pages emit Organization | PASS |
| Title/description policy is bounded | Every active indexable registry title and description is non-empty, unique and within the frozen 15–70 / 70–180 character bands | PASS |
| Heading hierarchy is deterministic | Page views retain one H1; property price changed from competing H2 to presentation text; accessibility/page suites pass | PASS |
| Pagination/filter normalization is deterministic | page 2+ is self-canonical and `noindex,follow`; `page=1` is a single clean redirect; malformed/repeated page is 404; unknown params are canonicalized and noindexed; beyond-total pages are 404 | PASS |
| Lifecycle day-100 boundary is exact | Pure clock fixture proves `<= threshold` becomes due at the exact millisecond; the next millisecond is retained; redirect/410 matrix has no homepage fallback | PASS |

## Checks run

- `pnpm verify:cp02-seo-surface` — PASS, including XML parsing, provider errors, metadata, registry uniqueness/length, query normalization and day-100 boundary.
- `pnpm verify:seo-contracts`, `verify:sitemap-indexnow`, `verify:performance`, `verify:indexing-policy`, `verify:route-resolver`, `verify:property-lifecycle-routes` and `verify:apartment-room-facets` — PASS.
- `pnpm verify:ui-accessibility` — PASS across all existing public page suites.
- `pnpm quality:architecture` — PASS, 503 modules and 1616 dependencies, no violations.
- `pnpm quality:guards` — PASS.
- `pnpm typecheck` — PASS.
- `pnpm build` — PASS; Next route manifest contains dynamic `/robots.txt`, `/sitemap.xml` and `/sitemap/[...id]` handlers.
- `pnpm verify:daily` with the exact documented readiness blocker set — PASS.
- Local built HTTP smoke on `127.0.0.1:4311` — robots/index/shards `200` with no-store, unknown shard `404`, `page=1` one `308`, out-of-range/repeated page `404`.
- `git diff --check` — PASS.

The successful daily run declared only the existing readiness facts
`required-host-allowlists-missing` and
`client-storage-deployment-contract-missing`. No readiness value, production
identity, indexing state or external service was invented or changed.

## Risk and limitations

- The completed diff is `RISKY` because it changes public sitemap/provider failure semantics; it does not change schema or migrations.
- Full external crawl remains assigned to CP-08. CP-02 used deterministic unit/route tests and an isolated local built server only.
- The local fallback contains no real property inventory, so `/donetsk/kvartiry/?page=2` correctly proved the beyond-total 404 path rather than a populated second page.
- Project lint exits successfully with existing warnings in generated migrations/Payload types and baselined UI CSS; changed CP-02 files have no lint errors.
- Global release-level noindex remains active. Newbuild/complex routes remain outside sitemap and public contracts.
