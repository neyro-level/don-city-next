# EPIC-16 — evidence ledger

Date: 2026-09-24
Scope: UI intake and representative public route `/kvartiry/donetsk/`

This record indexes the implementation evidence without duplicating the master
plan. Requirements remain in `AMS_DON_CITY_FINAL_MASTER_PLAN_V3_0.md` §33B.

## Implemented surface

- `docs/06_DESIGN_SYSTEM.md` defines the project-owned UI tokens and the
  Manrope/semantic-colour policy.
- `src/app/globals.css` maps the reusable starter action role from red to a
  dark-green brand role while preserving the red error/destructive semantic.
- `packages/ui/src/views/catalog/StarterCatalogPageView.tsx` exposes a typed
  copy variant, so a route can change commercial content without cloning the
  catalog view.
- `src/app/(site)/kvartiry/donetsk/page.tsx` is the representative page. It
  reads only through the public catalog gateway and declares the required
  metadata, one H1, canonical and JSON-LD.
- `src/project/site.config.ts` and `src/core/seo/site.ts` make the canonical
  origin project-owned (`https://doncity-home.ru`), rather than deriving it
  from a local development host.

## Verification index

- Preflight and component disposition: `EPIC-16_UI_INTAKE_PREFLIGHT.md`.
- Runtime, responsive, accessibility, SEO and data-boundary checks:
  `EPIC-16_VERIFICATION.md`.
- Exact implementation head: `c664fef8ff99f5383b932ed0f65b7e22bafde2c0`.

The verified empty catalog state is intentional: no local Payload connection
or production data was used. Navigation and footer replacement are owned by
EPIC-17 and NAP work; they are not represented as completed in this epic.

## Boundary statement

No secrets, server/database access, DNS, migration or production operation was
performed. The token-report prerequisite `docs/PROJECT.md` remains a separate
document-contract item and was not fabricated here.
