# EPIC-16 — UI Intake Verification

Status: PASS
Date: 2026-09-24
Scope: `dcn-task-16-verify`
Head: `cda793f077825ac65c0236dafaf1194a9eaffb44` plus the canonical-origin correction in this verification checkpoint.

## Acceptance matrix

| Criterion | Evidence | Verdict |
|---|---|---|
| One project token source and no second UI system | `src/app/globals.css` remains the token source; public UI continues to use the existing project-owned primitives. | PASS |
| Dark-green action semantics and red safety semantics | Primary dark-green on white computes to 6.41:1; `--destructive` remains `--error`-based red. | PASS |
| Manrope supports the required public language | `next/font/google` loads `cyrillic` and `latin`; installed Next font metadata lists Cyrillic plus variable 200–800 weights. | PASS |
| Exact representative SEO contract | HTTP `200` response contains the approved title, description, one H1 and `https://doncity-home.ru/kvartiry/donetsk/` canonical. | PASS |
| DTO/Public Gateway boundary | Route imports Public Gateway, UI, structured data and lead context only; no raw Payload, database or secret import. | PASS |
| Mobile and accessibility structure | Chrome DevTools accessibility snapshot at 390×844 exposes banner, navigation, one H1, labelled filter/results regions, explicit empty state and labelled lead form controls. | PASS |
| Production-oriented compilation | `pnpm typecheck`; `pnpm build`; `pnpm verify:a11y-starter`; `pnpm verify:seo-contracts` pass. `next start` served the representative route with HTTP 200. | PASS |

## Canonical-origin correction

The first local response exposed a `localhost` canonical because the inherited
SEO helper treated the runtime dev host as a canonical origin. The helper now
uses the approved project-owned `canonicalOrigin`; this fixes canonical and
Open Graph URL generation without changing DNS, deployment or runtime access.

## Local runtime contour

- Native PostgreSQL 18 is running on the workstation, but this checkout has no
  `.env.local` and no DON CITY local database identity. It was not connected to
  or changed.
- The route correctly uses the Public Gateway's no-runtime fallback and renders
  the explicit zero-object state. No demo or production data was fabricated.
- Docker, WSL, Timeweb, DNS, Secret Master and production were not touched.

## Deliberately deferred findings

The snapshot still shows the starter fallback navigation, placeholder phone and
legacy URL targets. This is expected at this point: exact menu replacement is
EPIC-17, canonical NAP is EPIC-07, and complete route/property migration is
EPIC-15/18/28. These items were not silently changed in the UI-intake scope.

The browser's development-only console reported blocked cross-origin HMR/font
requests from the DevTools broker. The production `next start` HTTP route proof
does not use HMR; the warning is not a production application error.
