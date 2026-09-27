# CORE 5.5 CP-05 implementation evidence

Status: `IMPLEMENTED_LOCAL`

## Boundary

- Plan: `AMS-DON-CITY-CORE55-POSTPROD v9 APPROVED`.
- Epic: `EPIC-72 / CP-05 — UI ROLE AND ACCESSIBILITY CONVERGENCE`.
- Branch: `codex/dc55-epic-72` from `origin/main` at
  `1af2f8e34509e3cd0a76653546f23998d889b7c6`.
- Risk: `RISKY` because the closed UI package API and shared public shell were
  extended.
- Payload Admin remains CMS-native. Production, public indexing, feeds, data,
  secrets and DNS were not changed.

## Delivered contract

1. The package now exposes canonical `@ams/realtbase-ui/public/*` entry points.
   All first-party application routes use them. Existing `starter/*` exports and
   `Starter*` symbols remain deprecated compatibility aliases, so this checkpoint
   does not break unknown external consumers.
2. Canonical public symbols own the site header/footer, property card, media
   gallery and feed image. A regression guard rejects new first-party
   `starter/*` imports.
3. Typography has one consumer language: components use semantic Tailwind
   `text-*`, `leading-*` and `tracking-*` roles. The existing `--site-type-*`,
   `--site-leading-*` and `--site-tracking-*` values are retained only as the
   private numeric source mapped once by `@theme inline`. The UI guard rejects
   direct component/CSS consumption outside that boundary.
4. The real production header now has a semantic desktop navigation and a real
   mobile `nav` landmark. The desktop submenu is controlled, preserves its
   visible accessible name, reports `aria-expanded`, closes on `Escape` and
   outside pointer input, and restores focus to its trigger on `Escape`.
5. The existing lead form was preserved. Its field/consent errors remain linked
   with `aria-describedby`, invalid submission focuses the first invalid field,
   and successful submission focuses the confirmation message.
6. A root App Router `error.tsx` supplies the required platform error boundary
   in the existing design language and does not expose exception messages.
7. UI guards now cover canonical package exports, first-party import ownership,
   semantic typography consumption, navigation semantics/interactions and the
   platform error boundary.

## Deterministic evidence

- `pnpm typecheck` — PASS.
- `pnpm verify:ui-core` — PASS; zero design-literal findings and zero baseline
  exceptions; `647` token definitions; design-token, drift, accessibility and
  SEO contract subchecks pass.
- `pnpm verify:a11y-starter` — PASS.
- `pnpm verify:navigation-shell` — PASS.
- `pnpm contracts:check` — PASS for base `1.4.0` and journal `0.1.0`.
- `pnpm quality:architecture` — PASS, `504` modules / `1617` dependencies, no
  violations.
- `pnpm quality:guards` — PASS.
- `pnpm lint` — PASS with `28` pre-existing warnings and `2` informational
  diagnostics outside this diff; no lint errors.
- `git diff --check` — PASS.

## Browser evidence

Local Next development runtime was exercised through Playwright without a
database mutation or external service call.

| Scenario | Evidence | Result |
|---|---|---|
| desktop shell | `1440x900`; desktop nav `display:flex`, mobile nav hidden; document width does not exceed viewport content width | PASS |
| tablet shell | accessibility snapshot at approximately `1025px`; one banner, main, contentinfo and named desktop navigation | PASS |
| mobile shell | `390x844`; named mobile navigation present, desktop navigation hidden, no horizontal document overflow | PASS |
| dropdown keyboard | open state reports `aria-expanded=true`; `Escape` closes it and returns focus to the trigger | PASS |
| dropdown outside input | pointer input on `main` closes the open submenu | PASS |
| invalid submit | three invalid controls expose linked description IDs; focus moves to `name`; form-level error is linked | PASS |
| success submit | browser-only mocked accepted response; confirmation text appears and receives focus; no real lead was sent | PASS |
| reduced motion | emulated `prefers-reduced-motion: reduce`; transition and animation durations resolve to `0.01ms` | PASS |
| semantic typography runtime | public `--text-section-title`, dialog, relaxed-label and footer roles resolve to their expected computed values; representative `h2` resolves to `24px / 26.4px` | PASS |

The development console reports the existing strict-CSP warning that React
development diagnostics cannot use `eval()`. Hydration and all tested
interactions remained functional. CSP policy itself belongs to CP-06; no CSP
weakening was made here. Chrome DevTools/Lighthouse was unavailable in this
session, so the proof uses the accessibility tree, computed styles and explicit
interaction assertions from Playwright.

## Rollback

Revert this checkpoint as one change. The deprecated compatibility exports make
rollback independent from external consumers. No schema, persistent data,
production configuration or indexing state requires rollback.
