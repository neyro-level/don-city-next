# RP-06 — preflight

## Execution identity

- Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST` v7, `APPROVED`.
- Task: `dcv4-task-59-preflight`.
- Branch: `codex/rp-06-resolver-routes`.
- Base: `ad43719f1f4c3d11df59c3c4122d59c2886e28b4` (`origin/main`).
- Delivery: `MERGE_AFTER_GATE`, `RISKY`, plus `verify:schema`.

## Task Contract

Implement only EPIC-59/RP-06: exact V4 static/service routes, one non-optional catalog catch-all, a shared typed resolver for page rendering and metadata, profile-aware status/robots/canonical decisions, property lookup by `publicUrlId`, one exact `301` for semantic/category mismatch, and one framework-owned `308` for trailing-slash normalization. Remove unproven V3 and donor public routes. Do not implement RP-07 registry/templates, RP-08 nearby-geo inventory rules, RP-09 final navigation/linking, RP-10 analytics/cache tags, RP-11 sitemap/IndexNow, or production changes.

## Confirmed route contract

- Explicit routes own `/`, `/prodat-nedvizhimost/`, `/yurist/`, `/o-kompanii/`, `/kontakty/`, `/politika-konfidencialnosti/`, `/soglasie-na-obrabotku-personalnyh-dannyh/` and `/spasibo/`.
- One `[...segments]` route owns category roots, geo hubs, category×geo, district/facet and global property paths. Four or more segments resolve to `404` before data access.
- Resolver order is exactly master-plan §§7–8: static → category root → published geo; geo/category; property ID; city district → category facet → `404`.
- `PREPARED_OFF` is always `404`. `ACTIVE` uses the normal route contract. `NOINDEX_AUTO` remains unavailable in RP-06 until RP-08 supplies and proves the inventory rule.
- Category roots in `SINGLE_GEO` are `200 noindex,follow`, self-canonical and non-promotable.
- `generateMetadata` and the page consume the same cached resolver result; they do not independently reinterpret URL segments.

## Compatibility decision

RP-00 found no reproducible public/indexed category-first or `/obekty/[slug]` URL. Therefore RP-06 creates no speculative legacy redirect and removes the V3 `/kvartiry/donetsk`, donor `/obekty/[slug]`, and obsolete starter routes `/nedvizhimost`, `/uslugi`, `/ipoteka`, `/prodat`, `/sdat` from public route ownership and the grammar registry.

## Next.js 16 implementation decision

- Current runtime is Next.js `16.3.5`; catch-all params are asynchronous and represented by a non-optional `[...segments]` segment.
- `trailingSlash: true` defines the canonical slash form. `skipTrailingSlashRedirect` lets the project proxy collapse a possible property semantic correction and slash normalization into one response; ordinary no-slash pages receive one `308`, while static files and `.well-known` are excluded.
- Server Component `redirect`/`permanentRedirect` emit `307`/`308`, not the plan-required `301`. A narrowly scoped Node-runtime `proxy.ts` normalizes public GET/HEAD paths and, for property-shaped paths only, asks the shared resolver for the canonical property path and returns `NextResponse.redirect(..., 301)` when semantic/category differs. It does not own authentication, mutate state or fetch unrelated data.
- Canonical property requests pass through to the catch-all page. A mismatched property request redirects directly to the trailing-slash canonical path, preventing a second redirect.

## Data and rendering boundaries

- Public Gateway gains explicit reads for published geo/district identity and property lifecycle by numeric `publicUrlId`; Payload remains the sole schema/data owner.
- Property canonical category and semantic prefix are derived from the public DTO, never trusted from the incoming path.
- RP-06 reuses current public catalog/property views and renders a minimal truthful H1, listing/empty state and canonical metadata for each accepted owner. RP-07/RP-09 may enrich copy and composition without changing route grammar.
- No production database, managed database, server, DNS or Secret Master mutation is required.

## Verification design

- Add a fixture-backed resolver matrix covering every V4 owner class with exact status, robots and canonical.
- Assert `404` for category-first `/kvartiry/donetsk/`, prepared `/donetsk/novostroyki/`, district×facet, unknown third segment, four segments, obsolete starter paths and `/obekty/...`.
- Assert property canonical and wrong semantic/category behavior, including exact single `301` destination.
- Run focused resolver/proxy tests, URL grammar, profile, schema, public-gateway, typecheck, lint, architecture checks and the RISKY gate.
- Run HTTP smoke against a local isolated PostgreSQL 18 test database to prove framework `308`, rendered status/robots/canonical and no redirect chain.

## Stop conditions checked

- Plan/inventory drift: none.
- RP-05 dependency: merged and closed.
- RP-00 compatibility evidence: explicit and negative; no legacy manifest entry applies.
- Production/DNS/server/secret mutation: not required and forbidden.
- Version-sensitive routing behavior: verified against official Next.js 16 documentation before implementation.
