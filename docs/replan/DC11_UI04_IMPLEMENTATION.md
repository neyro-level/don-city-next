# DC10-UI-04 — Marketing semantic hierarchy implementation

Status: VERIFIED

Implementation SHA: `da8d3855fa7da41a4bf214b9317dc30ebdfd9dcc`

## Outcome

- The shared marketing hero retains exactly one page-level `h1`.
- Repeated marketing section cards explicitly render their titles as `h2`.
- `CardTitle` exposes a backwards-compatible `h2 | h3` semantic variant and
  keeps `h3` as the default for existing consumers.
- A deterministic guard covers the shared TSX composition and the Sell,
  Lawyer, About and Contacts route/data paths.

## Scope

The change is limited to the project-owned card primitive, the shared marketing
view, its executable guard, UI Core wiring and design documentation. Payload,
DTOs, route grammar, data access, auth and lead behavior are unchanged.

## Evidence

- `pnpm verify:marketing-headings` — PASS: one shared `h1`, `h2` section
  titles and four representative route/data paths.
- `pnpm verify:ui-core` — PASS, including accessibility, SEO, design-token and
  drift guards.
- `pnpm typecheck` and focused Biome checks — PASS.
- `pnpm quality:architecture` — PASS: 502 modules and 1,551 dependencies, no
  violations.
- `pnpm build` — PASS: 16/16 static pages, including Sell, Lawyer, About and
  Contacts.
- `pnpm lint` — PASS with zero errors; 24 pre-existing warnings and two infos
  remain outside this diff.

No production or live-browser claim is made.
