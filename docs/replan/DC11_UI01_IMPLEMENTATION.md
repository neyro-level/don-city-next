# DC10-UI-01 — implementation evidence

Status: VERIFIED

Date: 2026-09-27

## Result

- `@ams/realtbase-ui` exposes exactly 10 active canonical entrypoints.
- Removed public root barrel `.` and broad `./views` barrel.
- Removed seven compatibility aliases under `./starter/*`.
- Existing future view modules remain in source but are unreachable through the
  package export map until a separate activation contract exists.
- Workspace consumption proof now imports only canonical entrypoints.

## Runtime impact

No route, DTO, JSX, CSS, token or data-flow implementation changed. Active
`src/app` consumers already used the retained canonical surface.

## Deterministic guard

`pnpm verify:ui-public-surface` checks the exact export map, target existence,
absence of broad barrels, forbidden app imports and representative internal-only
future modules. `verify:ui-core` independently owns the same closed export list.

## Exact implementation verification

Implementation SHA: `c6eac85e220ee163ae4423498f96a94e6705f952`

- `pnpm build` — PASS: optimized Next.js build completed; all 16 static pages
  generated and active static/dynamic routes were emitted.
- `pnpm lint` — PASS: zero errors; 28 pre-existing warnings and 2 informational
  diagnostics remain outside this package-surface scope.
- `pnpm verify:ui-public-surface` — PASS: 10 canonical exports and 9 removed
  broad/compatibility exports.
- Earlier implementation proof on the same SHA includes typecheck, UI Core,
  Dependency Cruiser and representative home/property/navigation/legal checks.

The build reported non-blocking compilation warnings without a failing
diagnostic. No production endpoint, database, secret or external service was
used during verification.

## Documentation impact

`docs/03_ARCHITECTURE.md` now records the closed UI package-surface contract.
No PRD, product structure, backlog or release-policy change is required.
