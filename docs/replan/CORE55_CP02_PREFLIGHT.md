# CORE55 CP-02 PREFLIGHT

Status: `PASS / FROZEN`
Plan: `AMS-DON-CITY-CORE55-POSTPROD`, v9 `APPROVED`
Task: `dc55-task-69-preflight`
Branch: `codex/dc55-epic-69`
Base: `4dc6bb924c21024f75a2b3e1a665554fb9522259`

## Task Contract

- Goal: make robots, sitemap, metadata, structured data, heading, pagination and property lifecycle behavior deterministic for the approved secondary-sale scope.
- Allowed writes: SEO route handlers and helpers, public DTO presentation, page composition, semantic UI markup, pure lifecycle helpers, focused verification scripts and evidence documentation.
- Forbidden: production or public-indexing activation, DNS, real feeds, secrets, destructive migrations, newbuild/complex activation and invented factual claims.
- Delivery: one EPIC-69 branch/PR, review and one exact-head `RISKY` SourceCraft gate; merge is not a production release.

## Frozen public surface

The release envelope remains global `noindex`. Public-mode contracts may expose
only registry- and data-gated pages for secondary apartments, houses, land and
commercial property, plus the approved static pages and the single `/yurist/`
hub. Newbuild and complex routes remain excluded from robots, sitemap,
navigation, structured data and crawl verification.

| Item | Entry state | CP-02 owner |
|---|---|---|
| 1.2 robots/media | public policy disallows all `/api`; managed public media lives below `/api/media/file/` | explicit `robots.txt` response contract |
| 1.3 sitemap index | `/sitemap.xml` has no root index response | root sitemap index handler |
| 1.4 sitemap fail-closed | logical shard catches provider failures and returns `[]`; route is revalidated | sitemap provider/HTTP boundary |
| 1.5 OG/Twitter | optional title/description only | canonical metadata composer |
| 1.6 JSON-LD | safe serializer exists; home only is wired | resolved public page composition |
| 1.7 metadata | title/description/canonical/robots exist; deterministic brand/social fields are incomplete | page metadata contract |
| 1.8 headings | page views own H1; property price is currently an H2 and card headings need contextual semantics | project-owned UI views |
| 1.9 pagination | page 2+ is self-canonical/noindex; invalid, repeated, page=1 and over-limit HTTP behavior is incomplete | route resolver + catalog boundary |
| 1.10 lifecycle | active/archive/redirect/410 states exist; exact retention boundary is not isolated or proven | lifecycle threshold helper + route proof |

## Frozen implementation slices

1. Replace the metadata robots route with an explicit text handler so public mode can emit host, a single root sitemap URL, `Clean-param` rules and an allow exception for `/api/media/file/`; global noindex remains a full disallow.
2. Add a root XML sitemap index which lists only non-empty shards. Any provider error must return non-200 and must not be cached as a false empty success.
3. Make each logical shard fail closed at the HTTP boundary instead of converting provider failure to an empty XML success. Unknown and genuinely empty shards stay distinct.
4. Compose canonical absolute Open Graph and Twitter metadata from the factual page SEO contract, project locale/brand and an approved project-owned social image only when one exists.
5. Render only factual, DTO-derived JSON-LD for home, catalog, property and static/contact page types through the existing safe serializer.
6. Preserve exactly one logical H1 per page; price and card labels must not create competing section headings.
7. Normalize pagination deterministically: `page=1` redirects to the clean canonical URL, valid page 2+ is self-canonical and `noindex,follow`, malformed/repeated/unknown query combinations do not become indexable, and page beyond the factual total is not rendered as a successful empty page.
8. Extract and prove the archive retention threshold, including the exact day-100 boundary, while preserving explicit same-site redirects and 410 without homepage fallback or chains.

## Shared ownership and verification boundary

- `src/project/indexing-policy.ts` owns policy; HTTP formatting belongs to the explicit route handlers.
- `src/core/data-access/public/provider.ts` owns factual sitemap data; it must propagate infrastructure failures.
- `src/project/public-route-resolver.ts` owns canonical query decisions; the rendered catalog owns total-page validation.
- `src/core/seo/structured-data.tsx` may consume public DTO/NAP only and must keep safe serialization.
- `packages/ui` changes are limited to semantic heading corrections; no visual redesign belongs to CP-02.
- `src/project/jobs` may use a pure threshold helper; no job execution, database write or migration is authorized.

Required proof includes both indexing policies, XML parsing, non-empty shard
selection, provider-failure non-200 behavior, metadata and structured-data
snapshots for every page type, pagination edge cases, heading invariants and the
exact retention boundary. Isolated local HTTP may use fixture/no-database mode;
production and external crawl are outside this epic, with the full crawl kept
for CP-08.

## Risk, rollback and stop conditions

The gate is `RISKY`: sitemap responses and provider error propagation are a
public gateway/runtime boundary. No schema change is planned. Rollback restores
the previous SEO handlers and metadata presentation while retaining the global
noindex envelope and the already-approved CP-02A registry scope; it must never
replace a sitemap failure with a cached empty success or redirect a gone object
to the homepage.

Stop on source/inventory drift, an unplanned schema or dependency change,
unknown production/test identity, production/indexing/feed/secret mutation,
destructive data action, newbuild exposure or loss of the global noindex
envelope.
