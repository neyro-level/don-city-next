# DC10-R11-05 — robots, sitemap, mirrors and HTTP policy preflight

- Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13 `APPROVED`
- Epic: `EPIC-107` / `DC10-R11-05`
- Baseline SHA: `0a911968e07239f6b7d62c58a965aac7bbbd47c5`
- Production, DNS and secrets: unchanged

## Factual baseline

| Surface | Current implementation | v13 target / action |
| --- | --- | --- |
| Global indexing | Project policy is `public`; noindex mode applies page metadata and `X-Robots-Tag` globally. | Preserve. |
| `robots.txt` | Explicit text handler allows public pages and media, blocks admin/API, emits one sitemap, Yandex `Clean-param`, and also emits `Host`. | Remove `Host`; add `fbclid` to the existing root `Clean-param`; keep staging/noindex full disallow. |
| Sitemap | One dynamic index partitions static, geo, catalog, district, facet and four property owners. Entries are canonical, published and gate-filtered; unknown/unavailable shards fail closed. | Preserve and add/retain HTTP assertions for index, shards, unavailable data and forbidden routes. |
| Canonicals | Metadata uses resolver-owned canonical paths. Category roots self-canonical; query normalization is centralized. | Preserve exact absolute canonical proof. |
| Pagination | `page=1` returns one clean `301`; valid page 2+ is `noindex,follow` with a self-canonical query URL; invalid/repeated values are `404`; catalog boundary rejects beyond-total pages. | Freeze in one HTTP matrix without duplicate implementation. |
| Lifecycle | Unknown is `404`; active/archived property is `200`; semantic mismatch is one `301`; explicit replacement is `308`; purged without replacement is `410` with `noindex,follow`. | Preserve and include exact status/header/body proof. |
| Trailing slash | Public proxy performs one `308` normalization and preserves query values. | Preserve; assert no chain with semantic redirects. |
| Mirrors | Canonical origin is `https://doncity-home.ru`; historical evidence records `www` as a one-hop `308` at the external edge. Runtime repository has no app-owned mirror-host redirect. | Verify configuration/evidence read-only; do not mutate DNS or production proxy in this epic without an explicit infrastructure need. |

## Owners and affected files

- `src/project/indexing-policy.ts`: robots text owner and confirmed drift.
- `src/app/robots.txt/route.ts`: HTTP response/cache owner.
- `src/project/sitemap.ts`, `src/app/sitemap.xml/route.ts`,
  `src/app/sitemap/[...id]/route.ts`: sitemap index/shards.
- `src/project/public-route-resolver.ts`: pagination, canonical and lifecycle
  decisions.
- `src/proxy.ts`: trailing slash and edge property lifecycle redirects.
- Existing verification owners: `verify-sitemap-indexnow`,
  `verify-property-lifecycle-routes`, `verify-indexing-policy-http`, full SEO
  crawl and route HTTP matrix.

## Implementation contract

1. Make the only required robots policy correction: no `Host`, and `fbclid`
   included in the single root `Clean-param` list.
2. Replace old assertions that require `Host` with exact v13 assertions.
3. Add one bounded HTTP-policy regression matrix only where existing tests do
   not already prove the target; reuse current sitemap/lifecycle/pagination
   suites instead of duplicating them.
4. Keep sitemap and public GET read-only. Do not add scheduled monitoring,
   production changes, DNS writes or a second data store.

## Risk and stop conditions

- Expected implementation risk is `STANDARD` if the diff remains robots/tests
  only. Escalate to `RISKY` if runtime proxy, sitemap data boundary, persistence
  or production configuration changes.
- Stop on unknown canonical/mirror identity, production/DNS mutation or source
  drift.

## DOC IMPACT

This artifact records the baseline and convergence contract. The approved
master plan remains the owner; active product and architecture documents were
reviewed without semantic change.
