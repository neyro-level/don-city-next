# DC10-R12-04 — agglomeration public routes verification

- Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13 `APPROVED`
- Epic: `EPIC-111` / `DC10-R12-04`
- Implementation SHA: `d705aefc7ea70be26ee955e32360027b8c2e28e3`
- Owner decision: `OD10-04`, 2026-09-28
- Production, DNS, secrets and persistent data: unchanged

## Verified contract

The project-owned Site Profile is the single route-activation owner. It allows
only canonical locality slug `makeevka` and route types `hub`, `kvartiry`,
`doma` and `uchastki`.

Reachability remains fail-closed at runtime:

- a route requires both the explicit allowlist entry and a valid published
  nearby-locality DTO from the Public Gateway;
- the hub requires factual active locality inventory;
- every category route and link requires its own positive category count;
- commercial, district, facet and alternate-slug routes return `404`;
- without the allowlist, hub and category routes return `404`, while property
  pages emit no Makeevka links;
- reachable nearby pages use the actual Макеевка grammatical forms and remain
  `noindex,follow` outside sitemap and IndexNow until a separate factual
  content/indexability gate is approved.

Property JSON-LD continues to take `addressLocality` from the factual public
property DTO. The structured-data fixture proves `Макеевка` is preserved for a
house rather than replaced with Донецк.

## Executed proof

| Check | Result |
| --- | --- |
| `pnpm verify:site-profile` | PASS — exact allowlist and empty-policy fail-closed selector |
| `pnpm verify:nearby-geo` | PASS — four approved routes, rejected routes, pre-gate `404` and no-link proof |
| `pnpm verify:navigation` | PASS — canonical internal-link crawl |
| `pnpm verify:factual-structured-data` | PASS — actual locality JSON-LD |
| `pnpm verify:geo-model` | PASS |
| `pnpm verify:public-geo-gateway` | PASS |
| `pnpm verify:sitemap-indexnow` | PASS — no premature Makeevka transport entry |
| `pnpm verify:content-inventory` | PASS |
| `pnpm verify:product-regression` | PASS |
| `pnpm verify:performance` | PASS after correcting its stale legacy UI export assertion |
| `pnpm quality:architecture` | PASS — 507 modules, 1579 dependencies, zero violations |
| `pnpm typecheck` and `git diff --check` | PASS |

## Verification-driven correction

The broader affected-path run found `verify:performance` still asserted the
removed `./starter/catalog-page` export even though the canonical public
surface is `./public/catalog-page`. The verifier now asserts the public export
and explicitly rejects the stale starter export. No runtime UI surface changed.

## DOC IMPACT

`docs/02_PRODUCT_STRUCTURE.md` records the exact owner-approved locality, slug
and route set. This artifact records exact-head proof; no other active source of
truth required a semantic change.
