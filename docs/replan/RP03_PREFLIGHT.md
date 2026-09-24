# RP-03 preflight — Typed Site Profile

Status: PASS. Implementation may start from `main@c6f612dc63d064dba1ee320eb503cc51df31b6b6`.

## Contract

RP-03 introduces `src/platform/profile/types.ts` and the DON CITY-owned
`src/project/site.profile.ts`. The profile is the single source for geo mode,
market/category activation, geo/category overrides, nearby-geo default,
semantic tiers, inventory thresholds and facet whitelist.

Allowed states are `ACTIVE`, `PREPARED_OFF` and `NOINDEX_AUTO`.
`PREPARED_OFF` is fail-closed: affected routes return `404` and the category is
excluded from sitemap, menu and internal-link projections.

## Current-state evidence

- No typed Site Profile exists on merged `main`.
- The only current geo/apartment page is the legacy
  `src/app/(site)/kvartiry/donetsk/page.tsx`; canonical V4 grammar and resolver
  remain owned by RP-04 and RP-06.
- Static sitemap ownership is split between `src/core/seo/site.ts` and the
  public provider.
- Shell navigation is assembled in `src/core/data-access/public/dto.ts`; the UI
  package consumes DTOs and must not own activation policy.
- Graphify indexed 364 code files (2,360 nodes / 4,977 edges) and confirmed the
  route, sitemap, public DTO and site-shell consumers.

## Implementation boundary

1. Add portable profile types, validation and selectors under
   `src/platform/profile/**`; Platform receives typed input and imports no
   Project module.
2. Add exact §32B DON CITY values under `src/project/site.profile.ts` using
   `as const satisfies SiteProfile`.
3. Wire current route, sitemap and DTO/link projections through a composition
   layer so a test profile can disable apartments without editing product code.
4. Add validation and PREPARED_OFF contract tests, including route, sitemap,
   menu and internal-link outcomes.
5. Do not implement V4 URL grammar, catch-all resolver, geo schema migrations
   or final navigation IA here; those remain RP-04, RP-05, RP-06 and RP-09.

## Risk and proof

Risk is RISKY because activation policy controls public route availability and
future data publication. Required proof: profile validation tests, explicit
PREPARED_OFF matrix, architecture/literal guards, typecheck, lint and
`verify:schema` against isolated native PostgreSQL 18.

Stop on source/inventory drift, a need to consume dirty EPIC-08 WIP, production
or DNS access, secret mutation, or destructive database action.
