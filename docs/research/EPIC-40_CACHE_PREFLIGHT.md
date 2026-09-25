# EPIC-40 — CACHE PREFLIGHT

## Task Contract

- Outcome: cache the public Home, all-property, category, district, facet and
  property data targets without changing their URL, SEO, DTO or access
  contracts.
- Scope: Next.js Data Cache wrappers around existing Public Gateway reads,
  deterministic target tags, on-demand invalidation for CMS/feed writes and a
  focused contract verifier.
- Out of scope: schema or migration changes, a switch to Cache Components,
  external cache infrastructure, production rollout, DNS and secret mutation.
- Base: `origin/main@34e9bed0dab6f759ce929689419be49daf24a9a8`.
- Branch/worktree: `codex/epic-40-cache` in the registered EPIC-40 worktree.

## Entry and dependency evidence

- The exact approved source remains V4 city-first plan v7 with SHA-256
  `9f4b011c10520d4d4a813da5e0f10409354c84f1901a62c5cc3a89f073319418`.
- Home, all-property, category, district, facet and property route owners are
  already merged. EPIC-40 therefore changes runtime caching only.
- RP-10 already froze the cache dimensions `geo:{slug}`,
  `geo:{slug}:cat:{category}`, `district:{city}:{slug}` and
  `property:{publicUrlId}` and the authenticated internal revalidation route.
- Feed imports already emit the broad `properties` target. CMS property/page
  writes do not yet emit runtime invalidation, and catalog/property gateway
  reads are not currently attached to the Next.js Data Cache.

## Version-sensitive decision

Docs status: PASS.

- Question: which Next.js cache API is compatible with the existing dynamic
  catch-all catalog and HTTP revalidation adapter?
- Installed versions: Next.js 16.3.5, React 19.2.8, Payload 3.90.1.
- Official sources checked 2026-09-25:
  - https://nextjs.org/docs/app/api-reference/functions/unstable_cache
  - https://nextjs.org/docs/app/guides/caching-without-cache-components
  - https://nextjs.org/docs/app/api-reference/functions/revalidateTag
  - https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents
- Installed types confirm `unstable_cache(cb, keyParts, { revalidate, tags })`
  and `revalidateTag(tag, "max")`. The project does not enable
  `cacheComponents`; enabling it would change the rendering model and is not
  required by the approved epic.
- Decision: retain the current previous-model rendering contract and use
  `unstable_cache` only around non-`fetch` Public Gateway reads. Keep request
  parameters outside cache scopes and include normalized inputs in cache keys.
  Continue using the already-correct two-argument `revalidateTag` form.
- Remaining uncertainty: multi-instance shared cache is not required by the
  current single-app topology; a remote cache handler would be a separate
  architecture decision.

## Minimal implementation boundary

1. Add a server-only cached Public Gateway facade with a one-hour safety TTL.
2. Tag Home with `site` and `properties`; tag catalog variants with
   `properties` plus their exact geo/category/district dimensions; tag property
   reads with `properties` and `property:{publicUrlId}`.
3. Keep facets as independently keyed catalog variants. Their category/geo
   tags intentionally invalidate all affected facet variants when inventory
   changes, avoiding an unapproved fifth tag grammar.
4. Add CMS write hooks that emit broad site/property invalidation through the
   existing authenticated HTTP adapter. Preserve the scoped RP-10 tag grammar.
5. Prove all six target classes, stable keys, allowlisting and write-side
   invalidation with a focused verifier plus typecheck/architecture checks.

No owner or external prerequisite blocks this boundary.
