# EPIC-43 — UI / accessibility QA preflight

Status: `PASS`

Date: `2026-09-25`

Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7 APPROVED`
Base SHA: `1c96f6468f6698be32a82c1066dd79d98adf9adf`

## Task Contract

- Goal: prove representative public UI and accessibility quality for Home, ALL, apartment/house/land geo, P1 district, Textilshchik, room facet, property, lawyer, contacts, 404 and 410.
- UX class: `PUBLIC_COMMERCIAL`; the owner-approved EPIC-16 design direction and the existing project design system remain authoritative.
- Delivery profile: `CRITICAL`; delivery is `MERGE_AFTER_GATE` and does not authorize production.
- Allowed scope: targeted QA automation, scoped accessibility/UI fixes, local fixture-safe runtime checks, evidence, commit and push.
- Excluded: production or staging changes, DNS, secrets, schema/migrations, real lead submission, production data access, dependency upgrades and a design-system rewrite.

## Entry conditions

- Task Manager reconciliation is `CLEAN 55/55`; plan source and inventory have no drift.
- Parent epics `65, 17, 19–28, 31–33, 42` are all `closed` in Beads.
- The worktree is isolated on `codex/epic-43-ui-a11y`, based on canonical SourceCraft `main` at the SHA above.
- Canonical route grammar, page compositions, legal/contact pages, property lifecycle and performance baseline already exist; EPIC-43 audits those surfaces and makes only defects found by that audit.

## Representative matrix

| Surface | Canonical path / fixture | Required proof |
|---|---|---|
| Home | `/` | local browser + static contract |
| ALL | `/donetsk/` | local browser + route contract |
| Apartment geo | `/donetsk/kvartiry/` | local browser + route contract |
| House geo | `/donetsk/doma/` | local browser + route contract |
| Land geo | `/donetsk/uchastki/` | local browser + route contract |
| P1 district | `/donetsk/kvartiry/kalininskiy/` | local browser + route contract |
| Textilshchik | `/donetsk/kvartiry/tekstilshchik/` | local browser + route contract |
| Room facet | `/donetsk/kvartiry/odnokomnatnye/` | local browser + route contract |
| Property | injected published property fixture | resolver/page contract; browser only when an isolated fixture is available |
| Lawyer | `/yurist/` | local browser + route contract |
| Contacts | `/kontakty/` | local browser + route contract |
| 404 | `/epic-43-ne-sushchestvuet/` | local HTTP/browser status and accessible error UI |
| 410 | purged-property fixture | lifecycle response contract: status, noindex and accessible HTML |

## Acceptance method

Every browser-renderable page is checked at representative desktop and mobile widths for:

- document language/title/viewport, one logical `main` and one logical `h1`;
- meaningful heading order, accessible names, form labels and image alternatives;
- keyboard reachability, visible focus, dialogs/navigation behavior and no keyboard trap;
- minimum practical pointer targets, readable contrast, reduced-motion support and absence of horizontal overflow;
- correct HTTP/route semantics and no unexpected console or request errors attributable to the application.

Static project contracts remain mandatory (`verify:a11y-starter`, route/property lifecycle checks, typecheck and lint where the implementation diff requires them). Browser evidence supplements these contracts; it does not replace them.

## Safe fallback and stop conditions

- No isolated DON CITY content database is required for this task. Public catalog routes use the existing fixture-safe empty state; property and 410 behavior use deterministic injected/resolver/HTTP fixtures rather than production records.
- Chrome DevTools/Lighthouse is unavailable in the current tool session. The equivalent local browser pass uses Playwright inspection plus project-owned deterministic checks. This limitation must be stated in final evidence; it does not authorize installing browser tooling or using an external site.
- Stop and block if proof would require production/staging access, real PII submission, secret mutation, destructive data work, a new owner decision, or expansion beyond the approved representative matrix.

## Preflight result

`PASS`: the representative matrix is complete, all parent dependencies are closed, the local-only proof path is executable, and every unavailable external prerequisite has a safe deterministic fallback.
