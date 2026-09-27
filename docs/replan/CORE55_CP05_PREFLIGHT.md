# CORE 5.5 CP-05 preflight

Status: `READY`

## Execution boundary

- Plan: `AMS-DON-CITY-CORE55-POSTPROD v9 APPROVED`.
- Epic: `EPIC-72 / CP-05 — UI ROLE AND ACCESSIBILITY CONVERGENCE`.
- Branch/worktree: `codex/dc55-epic-72` / isolated CP-05 worktree.
- Base: `1af2f8e34509e3cd0a76653546f23998d889b7c6` (`origin/main`).
- UX: `PUBLIC_COMMERCIAL`; Payload Admin remains `CMS_NATIVE_ADMIN`.
- This is convergence of the existing DON CITY Design System, not a redesign or
  a new UI foundation.
- No production, public indexing, feed, data, secret, DNS or Payload Admin theme
  mutation is in scope.

## UI change contract

- UX brief: existing page and navigation contracts are reused.
- Design intake: existing owner-approved system reused; no new intake.
- Project Design System: `docs/06_DESIGN_SYSTEM.md` version `2.0`.
- Token source: `src/app/globals.css`, the only numeric token owner.
- Component decision: `REUSE → VARIANT → CREATE`; no second primitive tree.
- Ownership: token source → primitives/layout → shared public shell/forms →
  domain views → route composition.
- shadcn: configured at `packages/ui/components.json`; all aliases match the
  actual project-owned package tree.
- Responsive: mobile/tablet/desktop public shell and representative public
  pages.
- States: navigation closed/open/focus/Escape/outside click; lead default,
  invalid, submitting, server error and success; reduced motion.
- Data contract: current DTO/ViewModel boundary remains unchanged.

## Exact findings

| Severity | Owner/location | Evidence | Approved action |
|---|---|---|---|
| P1 | `src/app/globals.css` and imported UI CSS | `168` direct `--site-type-*` references remain. The token report passes with `CORE=30`, `SHADCN=180`, `PROJECT ACTIVE=433`, `DEAD=0`, but the scanner treats the parallel source/alias shape as valid. | Triage by actual usage; replace direct component consumption with semantic typography roles, collapse proven near-duplicates, and extend regression rules. Do not mass-rename numeric values without a mapped consumer. |
| P1 | `packages/ui/src/views/starter/SiteShellView.tsx` | The production shell is this starter owner. Mobile links are inside a `Container` carrying `aria-label`, not a `nav`. Desktop dropdown is native uncontrolled `details`; explicit Escape/outside-close/focus return is absent. Its summary has an `aria-label` that replaces the visible item label. | Promote the existing shell to a project-owned public-shell name and add controlled, tested navigation semantics using the existing Button/Container primitives. |
| P1 | UI package exports and public routes | Seven closed `@ams/realtbase-ui/starter/*` subpaths and `Starter*` component names remain in the production composition. Graph traversal shows the public layout/routes and multiple scripts as consumers. | Add canonical `public/*` entry points and canonical project-owned names, migrate first-party consumers, retain deprecated compatibility exports during this stream, and add a guard against new starter imports. |
| P1 | `src/app` | Root `error.tsx`, `global-error.tsx` and site-segment error boundary are absent while the project Design System marks a platform error boundary required. | Add one App Router error boundary using the existing public visual language, without changing Payload Admin. |
| P1 | UI scanners | `verify:ui-core`, `verify:drift`, `verify:a11y-starter` and `verify:navigation-shell` all pass while the confirmed starter-name, mobile landmark and dropdown interaction drift remains. The UI baseline is empty. | Extend mechanical checks for public naming, mobile `nav`, visible dropdown name, Escape/outside behavior and required error boundary. Browser evidence remains separate. |
| P2 | `LeadFormView` | Field errors and consent are already linked by `aria-describedby`; invalid focus and success focus exist. Automated a11y passes. Manual submitting/server/success behavior is unproven. | Preserve the component; add state-focused regression and browser evidence instead of rewriting the form. |
| P2 | repeated nav/chip styles | Public shell nav links and catalog/home chip patterns repeat semantic class bundles while current scanner checks only literal fingerprints and primitive duplication. | Extract only proven repeated semantic variants; do not create a universal chip/menu builder. |

No duplicate Button/Input/Dialog/Card owner, second token file, raw Payload model
in reusable UI, project-authored dark mode or second UI library was found.

## Naming and package compatibility decision

The package boundary is intentionally closed, so deleting or silently renaming
`starter/*` would be a breaking change. CP-05 will use an additive compatibility
slice:

1. canonical project-owned symbols and `public/*` subpaths become the first-party
   API;
2. current `starter/*` subpaths remain temporary deprecated aliases;
3. all repository consumers move to the canonical names;
4. a guard prevents new `starter/*` consumption;
5. removal of compatibility aliases is not part of this epic.

Because package exports and a shared shell boundary change, the exact diff is
`RISKY` even though the visual result must remain equivalent.

## Implementation order

1. Freeze canonical typography roles and an explicit alias/exception map; then
   update scanner coverage before mechanical consumer changes.
2. Promote the actual production starter shell/page/card/media names to
   project-owned public names with compatibility aliases.
3. Fix the production navigation landmark, accessible name, keyboard Escape,
   outside click and focus behavior; do not revive or duplicate the currently
   unused alternate shell.
4. Preserve and prove lead-form error associations and all five states.
5. Add the required platform error boundary using existing primitives/tokens.
6. Run deterministic UI/drift/a11y/navigation checks, dependency checks and
   browser evidence for mobile, desktop, keyboard, submit/error/success and
   reduced motion.

## Evidence at entry

- Graphify code-only index: `3306` nodes / `7246` edges; production starter
  shell and lead form consumers were traced before the naming decision.
- `pnpm tokens:report` — PASS; no reported dead token, but parallel typography
  consumption is outside that proof.
- `pnpm verify:drift` — PASS with the documented scanner gap.
- `pnpm verify:ui-core` — PASS with the documented scanner gap.
- `pnpm verify:a11y-starter` — PASS.
- `pnpm verify:navigation-shell` — PASS with the documented interaction gap.

## Stop conditions

Stop on a visual redesign, second UI/token/primitive foundation, removal of
compatibility exports, raw persistence types entering reusable UI, Payload Admin
branding, hidden keyboard regression, untested broad token replacement, or any
production/indexing/feed/secret/DNS action.
