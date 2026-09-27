# DC10-UI-02 — canonical shell implementation

Status: VERIFIED

Date: 2026-09-27

## Result

- The active header, footer, mobile navigation and composite shell now live in
  `packages/ui/src/views/public-shell/PublicSiteShellView.tsx`.
- Stable consumer API remains `@ams/realtbase-ui/public/site-shell`.
- The unreachable 11-file alternate `views/site-shell/` tree and its exclusive
  view-model were removed.
- Three stylesheets were reduced to the one still-used layout utility, and
  tokens owned only by the removed alternate tree were deleted after the token
  guard proved them dead.
- `StarterSiteHeader`, `StarterSiteFooter` and `SiteShellView` remain only as
  documented direct aliases in the canonical source; they contain no separate
  JSX or state.
- `pnpm verify:canonical-shell` prevents a second implementation owner,
  historical path restoration, entrypoint drift or alias duplication.
- The guard is part of `verify:ui-core`, so normal UI and Merge Gate proof runs
  it rather than relying on an optional command.

## Runtime impact

This is source ownership convergence, not a redesign. Public route imports,
DTOs, navigation content, active JSX, rendered styles and interaction logic are
unchanged. Only selectors and tokens exclusively owned by the unreachable
alternate tree were removed.

Mechanical evidence after convergence: design-token ownership changed from
647 definitions / 115 UI source files to 589 definitions / 101 UI source files,
with zero dead tokens and one numeric token source. Client boundaries changed
from 35 to 32 because the parallel interactive shell components were removed.

## Exact implementation verification

Implementation SHA: `fa20b1a8465aa1dca866504aba3c2b67372343f6`

- `pnpm build` — PASS: optimized Next.js build completed and generated all
  16/16 static pages plus the active dynamic route set.
- `pnpm lint` — PASS: zero errors; 24 pre-existing warnings and 2 informational
  diagnostics remain outside this shell scope.
- `pnpm verify:canonical-shell` — PASS: one implementation owner and three
  direct compatibility aliases.
- Typecheck, UI Core, token integrity, navigation/a11y checks and Dependency
  Cruiser passed on the implementation checkpoint.

The build emitted non-blocking compilation warnings without a failing
diagnostic. Verification did not access production, a database or secrets.

## DOC IMPACT

- `docs/03_ARCHITECTURE.md` owns the canonical source and package boundary.
- `docs/DESIGN.md` owns the single-shell design policy.
- PRD, Product Structure, Backlog and Release Checklist semantics are unchanged.
