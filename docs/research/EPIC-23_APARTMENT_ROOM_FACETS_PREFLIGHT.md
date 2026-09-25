# EPIC-23 — APARTMENT ROOM FACETS PREFLIGHT

## Scope

EPIC-23 owns the three approved apartment room candidates:

- `/donetsk/kvartiry/odnokomnatnye/` → rooms `[1]`, P1, broad 184;
- `/donetsk/kvartiry/dvuhkomnatnye/` → rooms `[2]`, P1, broad 145;
- `/donetsk/kvartiry/trehkomnatnye/` → rooms `[3]`, P2, broad 66.

Each path is a candidate with threshold 5 plus Content Gate. Before Gate it is
`200 noindex,follow` and absent from sitemap/top links. When one approved active
room facet is selected through a query, navigation owns the path URL; the query
variant remains `noindex,follow` and canonicalizes to that active path. Without
an active path owner, canonical falls back to `/donetsk/kvartiry/`.

District routes belong to EPIC-22. House and land facets belong to EPIC-25 and
EPIC-26. Inventory/content activation belongs to EPIC-38.

## Entry conditions

- EPIC-22 and the RP grammar/SEO/Content Gate foundation are closed.
- Site Profile whitelists exactly the three apartment room slugs.
- SEO seed/generated registry materializes exact path, metadata, tier, broad,
  source and threshold for all three candidates.
- Product Structure assigns approved facets to the third city-first segment;
  query filters do not become independent SEO landings.

## Existing reusable foundation

- Typed grammar resolves each approved `categoryGeoFacet` and rejects unknown
  or fourth-segment combinations.
- `resolveProjectPublicRoute()` maps the three facet slugs to rooms `[1]`,
  `[2]`, `[3]` and sends them through the shared Public Gateway catalog query.
- Content Gate owns effective robots, sitemap eligibility and fallback-vs-path
  query canonical choice.
- Portable catalog SEO parsing already normalizes repeated `rooms` values and
  distinguishes indexable, control and unknown query parameters.

## Gap and minimal implementation boundary

The public catch-all page currently accepts only route segments. It ignores
`searchParams`, so query-equivalent room filters neither affect the catalog
query nor receive the required `noindex,follow` and canonical decision.

Implementation should add one route-level query decision for apartment
category-geo pages. Exactly one approved room value may resolve to its facet
owner only when supplied Gate evidence makes that owner active; otherwise the
canonical remains `/donetsk/kvartiry/`. Query variants must always remain
`noindex,follow`, while direct facet paths continue to use their registry and
Content Gate contracts. Filter navigation must use typed path builders rather
than literal/query-equivalent URLs.

A focused verifier must prove all three path routes and room queries, exact
metadata/tier/threshold data, Gate-off fallback canonical, Gate-on path
canonical, query robots, unknown/multiple room behavior and `vtorichka`
absence. No schema, migration, auth, seed, dependency or production change is
required.

## Delivery readiness

The stream starts from confirmed canonical `origin/main`
`e6729a62cc12a86a430d2aa191e4f21ee36eb917`. SourceCraft API and Git transport
remain available through the canonical `sourcecraft/prod` secret scope. No
owner, external, production or destructive prerequisite blocks the scoped
route-query contract.
