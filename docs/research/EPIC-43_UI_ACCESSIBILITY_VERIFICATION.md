# EPIC-43 verification — UI / accessibility QA

Status: `PASS`

Date: `2026-09-25`
Verified implementation head: `037acd2d31d6a4246c8fe417bc7cda44dc7c7c27`

## Acceptance matrix

| Surface | Evidence | Verdict |
|---|---|---|
| Home `/` | HTTP 200; desktop/mobile DOM pass; one `main`, one `h1`, labelled form fields, no horizontal overflow. | PASS |
| ALL `/donetsk/` | HTTP 200; route contract and desktop/mobile DOM pass. | PASS |
| Apartment geo `/donetsk/kvartiry/` | HTTP 200; route contract, accessibility-tree form inspection and desktop/mobile DOM pass. | PASS |
| House geo `/donetsk/doma/` | HTTP 200; route contract and desktop/mobile DOM pass. | PASS |
| Land geo `/donetsk/uchastki/` | HTTP 200; route/facet contract and desktop/mobile DOM pass. | PASS |
| P1 district `/donetsk/kvartiry/kalininskiy/` | HTTP 200; district contract and desktop/mobile DOM pass. | PASS |
| Textilshchik `/donetsk/kvartiry/tekstilshchik/` | HTTP 200; district contract and desktop/mobile DOM pass. | PASS |
| Room facet `/donetsk/kvartiry/odnokomnatnye/` | HTTP 200; room-facet contract and desktop/mobile DOM pass. | PASS |
| Property fixture | Published-property resolver, detail composition and canonical route checks pass without production data. | PASS |
| Lawyer `/yurist/` | HTTP 200; lawyer contract and desktop/mobile DOM pass. | PASS |
| Contacts `/kontakty/` | HTTP 200; company/contact contract and desktop/mobile DOM pass. | PASS |
| 404 | HTTP 404; one `main`, one `h1`, descriptive title and `noindex,nofollow`; no overflow. | PASS |
| 410 fixture | Executed response is HTTP 410 with `noindex, follow`, language, viewport, `main`, `h1` and a catalog recovery link. | PASS |

## Cross-page accessibility proof

- The first keyboard focus target is the visible-on-focus “Перейти к содержимому” link. Activating it moves focus to `main#main-content`.
- Twelve sequential desktop tab stops were visible and exposed an outline or ring, including shell navigation, CTA and the first form control.
- The catalog lead form exposes accessible names for name, telephone, comment, consent and submit controls in the accessibility tree.
- All 11 browser-renderable routes have one page landmark, one page-level heading, no unlabelled visible inputs and no horizontal overflow at `1440 × 1000` and `390 × 844` viewports.
- Sampled normal/large text on Home, apartment catalog, lawyer, contacts and 404 produced no WCAG AA contrast failures; the lowest measured ratio was `4.67:1`.
- With `prefers-reduced-motion: reduce`, no sampled element retained animation or transition duration above 1 ms. The light-only root did not acquire a `.dark` class.
- The favicon now resolves through the existing DON CITY SVG. The only remaining browser-console error is the known Next/React development CSP `eval()` warning, explicitly identified as development-only by the runtime.

## Executed checks

- `pnpm verify:ui-accessibility` — PASS.
- `pnpm verify:route-http` against the local fixture-safe runtime — PASS.
- `pnpm typecheck` — PASS.
- Scoped Biome check with formatting disabled — PASS.
- `git diff --check` — PASS.
- Local Playwright desktop/mobile, accessibility-tree, keyboard, contrast and reduced-motion checks — PASS.

## Runtime boundary

Chrome DevTools/Lighthouse was unavailable in this tool session. The documented fallback used local Playwright inspection plus deterministic project contracts. Property and 410 checks used injected fixtures; no production/staging database, PII, secrets, DNS, migrations or external state were touched.

No acceptance failure remains. The favicon 404 observed during the first pass was fixed and rechecked before this record was written.
