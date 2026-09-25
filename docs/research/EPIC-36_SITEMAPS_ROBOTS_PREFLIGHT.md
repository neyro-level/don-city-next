# EPIC-36 — Sitemaps / Robots preflight

Status: READY
Date: 2026-09-25
Task: `dcv4-task-36-preflight`
Base: `origin/main@c92702c26c6110ae776ba7874e0bc4d1faae7e53`
Branch: `codex/epic-36-sitemaps-robots`

## Canonical contract

- Reuse the RP-11 grammar-owned sitemap, meaningful `lastmod`, robots and
  provider-neutral IndexNow contracts.
- Materialize the logical R1 sitemap owners from master plan §28: `static`,
  `geo`, `catalog`, `districts`, `facets`, `kvartiry`, `doma`, `uchastki`.
- Include only published canonical `index,follow` registry owners whose
  threshold/content gate passes, plus published property URLs built by the
  typed grammar.
- Keep global category roots, nearby R1 geographies, noindex legal/thank-you
  pages, V3 owners and all R2 maps out of sitemap output.
- Production indexing, live IndexNow/Webmaster requests, DNS and secrets remain
  outside this epic.

## Current-state evidence

- RP-11 already replaced the legacy static/CMS projection with
  `buildRegistrySitemapEntries()` and the published-property Public Gateway.
- The existing runtime emits one numerically sharded aggregate sitemap. It does
  not yet preserve the approved logical owner boundary in the generated maps.
- Registry content-gate filtering, canonical grammar checks and meaningful
  listing/property `lastmod` are already implemented and must not be bypassed.
- `robots.ts` currently advertises only `/sitemap.xml`; it must advertise the
  generated logical map URLs when public indexing is enabled.
- Next.js `16.3.5` supports multiple generated sitemap IDs and passes the ID to
  the sitemap function as `Promise<string>`; the project entrypoint already
  accepts this runtime shape.

## Implementation boundary

1. Add a deterministic logical-owner partition without duplicating URL,
   activation or content-gate policy.
2. Route registry owners to `static`, `geo`, `catalog`, `districts` or `facets`;
   route published property URLs to `kvartiry`, `doma` or `uchastki`.
3. Generate one stable map per R1 logical owner and advertise those URLs from
   public robots policy.
4. Extend focused fixtures to prove complete, unique partitioning, Gate-pass
   inclusion, R2 exclusion, canonical URLs and meaningful `lastmod`.
5. Preserve existing aggregate provider APIs where other code/tests consume
   them; do not introduce raw Payload access outside the Public Gateway.

## Dependency and risk assessment

- Completed dependencies: EPIC-14, 21, 24, 26, 28, 33 and RP-12.
- Graphify confirmed the affected runtime surface is limited to
  `src/app/sitemap.ts`, the Public Gateway sitemap provider/export, robots policy
  and focused SEO/sitemap verifiers.
- No schema, migration, PII, auth or external write is required. Delivery risk
  is `STANDARD` unless implementation expands beyond this boundary.

## Stop conditions

- Any need to activate a candidate page without content-gate evidence.
- Any R2/newbuild/mortgage/commercial map or route.
- Live indexing, IndexNow/Webmaster submission, production, DNS or secret write.
