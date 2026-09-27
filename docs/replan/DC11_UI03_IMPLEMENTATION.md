# DC10-UI-03 — lightbox primitive implementation

Status: VERIFIED

Date: 2026-09-27

## Result

- Property lightbox now composes the project-owned Radix Dialog and Button
  primitives.
- `yet-another-react-lightbox` and its stylesheet/type surface are removed.
- Previous/next, thumbnails, counter, zoom and supported-browser fullscreen
  remain available with Russian accessible labels.
- Radix owns focus trap and Escape; close autofocus restores the exact opener.
- ArrowLeft/ArrowRight and wrapping index behavior use a tested pure contract.
- Motion uses semantic duration/easing tokens and the global reduced-motion
  override.
- `verify:media-lightbox` is part of `verify:ui-core`.

## Boundaries

No DTO, Payload, route, public data, production or secret behavior changed.

## DOC IMPACT

- `docs/DESIGN.md` records the approved gallery modal owner and interaction
  responsibilities.
- Architecture, PRD, Product Structure, Backlog and Release Checklist semantics
  remain unchanged.

## Exact implementation verification

Implementation SHA: `172694fe53658fa932217982274d095e86aa8945`

- `pnpm build` — PASS: optimized Next.js build generated all 16/16 static pages
  and the active dynamic route set.
- `pnpm lint` — PASS: zero errors; 24 pre-existing warnings and 2 informational
  diagnostics remain outside this lightbox scope.
- `pnpm verify:media-lightbox` — PASS: approved primitives, second-library
  removal, keyboard/wrapping, focus restoration, controls and reduced motion.
- Typecheck, UI Core, property route/card checks and Dependency Cruiser passed
  on the implementation checkpoint.

The build emitted non-blocking compilation warnings without a failing
diagnostic. No production endpoint, database or secret was used.
