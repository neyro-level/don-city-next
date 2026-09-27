# DC10-UI-02 — canonical shell preflight

Status: READY FOR IMPLEMENTATION

Date: 2026-09-27

Plan: `AMS-DON-CITY-LIVE-CONFORMANCE v13 APPROVED`

Epic: `EPIC-115 / DC10-UI-02 — One canonical shell`

Base: `origin/main@a2d0406b7ad0da9796c5aec1289d750dfbd88b63`

Branch: `codex/dc11-115-canonical-shell`

## 1. Observable outcome

One project-owned production implementation tree owns header, footer and mobile
navigation. Compatibility names, when retained, are direct aliases of that
implementation and cannot become a second tree.

Production, DNS, secrets, Payload data and public runtime state are outside this
epic.

## 2. Exact baseline

### Active production tree

| Owner | Current evidence | Consumers |
|---|---|---|
| `packages/ui/src/views/starter/SiteShellView.tsx` | Defines `PublicSiteHeaderView`, mobile navigation, `PublicSiteFooterView` and the composite `SiteShellView` in one file. | `src/app/(site)/public-site-header.tsx` and `src/app/(site)/layout.tsx` through `@ams/realtbase-ui/public/site-shell`. |
| `src/app/(site)/public-site-header.tsx` | Thin client route adapter adds the current pathname. | `src/app/(site)/layout.tsx`. |
| `src/app/(site)/layout.tsx` | Single route composition renders header, main and footer. | Public App Router segment. |

Graphify confirms `PublicSiteHeaderView` reaches the route adapter and public
layout. The package entrypoint is canonical, but its physical owner still uses
the historical `starter` directory name.

### Inactive parallel tree

`packages/ui/src/views/site-shell/` contains 11 source files:

- `SiteHeaderView.tsx`, `SiteFooterView.tsx`, `MobileMenuView.tsx`;
- `DesktopSiteNavView.tsx`, `CitySwitcherView.tsx`, `PhoneRevealView.tsx`;
- `CookieNoticeView.tsx`, `RequestModalView.tsx`,
  `ExpertRequestModalView.tsx`, `LeadSuccessNoticeView.tsx`;
- `site-header.types.ts`.

`packages/ui/src/view-models/site-shell.ts` exists only for that inactive tree.
Repository import inventory and Graphify report no affected runtime nodes for
`SiteHeaderView`, `SiteFooterView` or `MobileMenuView`. The tree is not exposed
by the closed package export map established by UI-01.

### Compatibility aliases

`StarterSiteHeader` and `StarterSiteFooter` are deprecated direct constants
pointing to `PublicSiteHeaderView` and `PublicSiteFooterView`. They do not own
independent JSX or state. Their temporary retention is allowed only inside the
single canonical entrypoint and must be protected by a non-duplication guard.

## 3. Prior owner decision

`docs/replan/CORE55_CP05_PREFLIGHT.md` already records the approved direction:

- promote the production shell from its historical starter path to a
  project-owned public-shell name;
- do not revive or duplicate the unused alternate shell;
- preserve the existing primitives, tokens, DTO boundary and interaction
  behavior.

This epic implements that existing decision; it does not redesign the shell.

## 4. Convergence contract

1. Move the active implementation to one project-owned `public-shell` source
   tree and keep the stable package entrypoint
   `@ams/realtbase-ui/public/site-shell`.
2. Remove the unreachable alternate `views/site-shell/` tree and its exclusive
   view-model owner.
3. Preserve `PublicSiteHeaderView` and `PublicSiteFooterView` as canonical
   symbols. Any retained legacy symbol must be a direct alias in the same file,
   carry deprecation documentation and contain no separate JSX/state.
4. Update hard-coded verifier paths and add one deterministic canonical-shell
   guard covering owner count, removed paths, stable package mapping, route
   consumers and alias identity.
5. Do not change DTOs, route structure, navigation content, CSS, tokens or
   interaction behavior.

## 5. Fail-first proof

The new guard must fail on each of these states:

- package `./public/site-shell` points outside the canonical public-shell tree;
- historical active `views/starter/SiteShellView.tsx` still exists;
- alternate `views/site-shell/` or its exclusive view-model exists;
- more than one source owner defines production header/footer/mobile
  navigation;
- route consumers bypass `@ams/realtbase-ui/public/site-shell`;
- a compatibility symbol becomes an independent implementation instead of a
  direct alias.

## 6. Verification matrix

| Criterion | Planned proof |
|---|---|
| One shell owns header/footer/mobile navigation | Canonical-shell guard plus Graphify affected paths. |
| One active implementation tree | Removed-path assertions, import inventory and package export mapping. |
| Aliases documented and non-duplicative | Source assertions for deprecation and direct identity aliases. |
| Active behavior preserved | Navigation shell, starter accessibility, UI Core, typecheck and active-route build. |
| Architecture remains valid | Dependency Cruiser and full diff review. |

## 7. Unknowns and blockers

- No owner decision is missing.
- No runtime, database or production identity is needed for this source-only
  convergence.
- Browser visual regression is not required because the contract forbids JSX,
  style, token and interaction changes; the active-route build and existing
  behavior checks remain mandatory.

## 8. DOC IMPACT

- Owner: `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md#EPIC-115`.
- Reviewed: `docs/03_ARCHITECTURE.md`, `docs/DESIGN.md` and
  `docs/replan/CORE55_CP05_PREFLIGHT.md`.
- Changed in PREFLIGHT: this evidence artifact and current delivery pointer.
- Planned implementation update: Architecture and Design ownership paths only;
  PRD, Product Structure, Backlog and Release Checklist semantics do not change.
