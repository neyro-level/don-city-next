# EPIC-43 evidence — UI / accessibility QA

Status: `PASS`

Date: `2026-09-25`

Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`
Branch head used for evidence: `435b757866ab2562e8e137e7572f938afa67975a`

This record is traceability evidence only. The canonical requirement remains
`docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md#EPIC-43`.

## Traceability

| Requirement | Implementation evidence | Verification evidence | Verdict |
|---|---|---|---|
| Representative Home, ALL, apartment/house/land geo, P1 district, Textilshchik and room facet | `verify:ui-accessibility` composes the existing route contracts into one EPIC-43 command. | All route contracts pass; desktop and mobile browser matrices pass. | PASS |
| Property surface | Published-property resolver, detail composition and canonical-route contracts remain in the composed command. | Deterministic property fixture checks pass without production data. | PASS |
| Lawyer and contacts | Existing lawyer and company/contact/legal contracts are part of the composed command. | Both contracts and desktop/mobile browser checks pass. | PASS |
| 404 and 410 | 404 uses one site `main`, a descriptive title and `noindex,nofollow`; the 410 response exposes language, viewport, one `main`, one `h1`, recovery link and `noindex, follow`. | HTTP 404 and executable 410 response assertions pass. | PASS |
| Keyboard access | A visible-on-focus skip link targets `main#main-content`; the target is programmatically focusable. | First-tab and Enter activation pass; twelve sampled sequential focus targets retain visible focus. | PASS |
| Forms and semantics | Existing public form controls retain accessible labels and consent semantics. | Accessibility-tree inspection reports named inputs, checkbox and submit control; one `main` and one `h1` per route. | PASS |
| Responsive, contrast and motion | Existing semantic tokens and responsive layouts are unchanged except for the accessibility additions. | No sampled overflow; sampled contrast is WCAG AA compliant with a minimum ratio of `4.67:1`; reduced-motion check passes. | PASS |
| Browser shell asset | Root metadata points the icon to the existing DON CITY fixture SVG. | Icon resolves successfully; the regression assertion is part of `verify:a11y-starter`. | PASS |

## Evidence chain

- Preflight and representative matrix: `docs/research/EPIC-43_UI_ACCESSIBILITY_PREFLIGHT.md`.
- Detailed runtime and acceptance results: `docs/research/EPIC-43_UI_ACCESSIBILITY_VERIFICATION.md`.
- Implementation commits: `ef8ccb4293e3608a3df16e0a351447d8d50cf5ea`, `037acd2d31d6a4246c8fe417bc7cda44dc7c7c27`, `435b757866ab2562e8e137e7572f938afa67975a`.
- Final local checks: `pnpm verify:ui-accessibility`, `pnpm verify:route-http`, `pnpm typecheck`, `pnpm quality:docs-sot`, scoped Biome and `git diff --check` — PASS.

## Boundaries and deviations

- Chrome DevTools/Lighthouse was unavailable in the tool session. The documented safe fallback used local Playwright DOM/accessibility-tree inspection and deterministic project contracts.
- Property and 410 evidence used deterministic fixtures. No production database, PII, secrets, DNS, migrations or external production state were touched.
- The remaining development-console CSP `eval()` message is emitted by the Next/React development runtime and is not present as an application error in the checked production contract.

No unresolved EPIC-43 acceptance failure or discovered follow-up work remains.
