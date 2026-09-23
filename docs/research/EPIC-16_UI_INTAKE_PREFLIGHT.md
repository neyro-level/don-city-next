# EPIC-16 — UI Intake Preflight

Status: PASS — implementation is bounded and may start
Date: 2026-09-24
Scope: `dcn-task-16-preflight`

## Task Contract

- **Goal:** complete the one-time DON CITY UI intake from the installed starter,
  establish one semantic token system, then prove it on the representative
  `/kvartiry/donetsk/` catalog page.
- **Non-goals:** server, database, DNS, Secret Master mutations, Payload schema
  changes, production deployment, or a second UI library.
- **Platform:** AMS Realty Platform Core 3.0 / Payload; `catalog`, `BUILD`.
  Payload remains the only schema, auth and migration owner.
- **Delivery profile:** `CRITICAL`; the eventual epic delivery requires one
  exact-head `RISKY` SourceCraft gate before merge.
- **UX scope:** `PUBLIC_COMMERCIAL`; the page brief is the Product Structure
  and Master Plan §§23–25, 33B.
- **Data boundary:** public route → Public Gateway → DTO → UI. UI must not
  receive raw Payload documents, database clients, secrets or PII.
- **Data/auth/integrations:** no migration, no auth-policy change, no external
  side effect. The catalog may use the existing read-only Public Gateway.
- **Proof:** target route metadata/canonical/H1, DTO-only imports, token report
  where its starter prerequisite permits it, typecheck/lint and browser checks
  in the verification task.

## Verified inputs

| Area | Evidence | Intake disposition |
|---|---|---|
| Token source | `src/app/globals.css` is the single project token source and its `@theme inline` maps semantic Tailwind utilities. | `VARIANT` — replace the brand-role values only; do not scatter numbers in JSX. |
| Typeface | `src/app/layout.tsx` loads `Manrope` with `next/font/google`, `cyrillic` and `latin` subsets. Installed Next 16.3.5 font metadata lists `cyrillic`, weights 200–800 and `variable`. | `REUSE` — required Cyrillic coverage and useful weights are present. The implementation records the Google Fonts OFL source/license evidence before the design-system gate closes. |
| Theme | Starter is light-only and already defines `@custom-variant dark`; no `.dark` class is installed. | `REUSE` — preserve class-based dormant dark variant; do not author project `dark:` styles. |
| Layout | `Container`, `Section`, `Stack`, `Cluster` and `SectionHeader` use semantic tokens, responsive gutters and explicit size/spacing variants. | `REUSE` |
| Accessible primitives | Existing Button, Input, Select and Dialog use semantic focus tokens; Dialog is built on Radix. | `REUSE` — retain the single foundation. |
| Site shell | Header/footer are responsive but their navigation and contact data still come from starter DTO fallback. | `VARIANT` — preserve geometry/interaction only; EPIC-17 replaces information architecture and NAP. |
| Catalog/cards/forms | Catalog composition, property cards, native form controls, empty state and lead form exist and accept DTOs. | `VARIANT` — adapt to the approved category×geo route and page brief. |
| Donor coupling | Old URLs (`/nedvizhimost`, `/obekty/[slug]`) and placeholder phone/content remain in public DTO/SEO paths. | `REPLACE` in the respective route/navigation/SEO epics; no silent compatibility promotion. |
| Visual assets | `public/fixture/logo.svg` already names DON CITY. Catalog image sources remain content-driven. | `VARIANT` — retain only project-managed assets and factual alt text. |

## Normalization decisions

1. The starter red semantic family (`--accent`, `--primary`, `--ring` and their
   derived effect tokens) becomes a dark-green brand family. `--destructive`,
   `--error` and critical-warning red retain their safety meaning.
2. The existing layout rhythm is retained: site frame 1380px, responsive gutters
   20/32/40px, 48/64/88px section cadence and compact radii. Their values stay
   in `globals.css` only.
3. The representative page has one role: hot search/catalog intent for buying a
   flat in Donetsk. Its primary conversion is to receive a relevant selection;
   filters, listing and a contextual consultation are supporting actions.
4. No unverified company claims, inventory counts, testimonials, address,
   phone, prices or availability are fabricated. The empty catalog is a valid
   state until the approved data epics provide published objects.

## Representative page contract

| Field | Approved value |
|---|---|
| URL | `/kvartiry/donetsk/` |
| Title | Купить квартиру в Донецке, ДНР: цены и объявления |
| Description | Квартиры на продажу в Донецке, ДНР: 1-, 2- и 3-комнатные варианты в разных районах. Подбор и сопровождение сделки в «ДОН СИТИ». |
| H1 | Квартиры на продажу в Донецке |
| Robots | `index,follow` |
| Canonical | `https://doncity-home.ru/kvartiry/donetsk/` in production; the configured public origin only supplies the runtime host. |

The page sequence is `orientation → filters → factual listing or explicit empty
state → contextual selection CTA`. It is intentionally not a home-page-like
marketing composition and must not introduce a second design language.

## Section ownership map

```text
primitives: Button, Input, Select, Dialog
layout: Container, Section, SectionHeader
shared: responsive site shell, breadcrumbs, lead form
domain: category filters, property card, catalog results, pagination
page-specific: Donetsk apartment catalog hero/intro and contextual CTA
composition: /kvartiry/donetsk/ route
```

## Known prerequisites and discoveries

- The starter `pnpm tokens:report` currently fails before token analysis because
  `docs/PROJECT.md` is absent. This is a pre-existing starter quality-script
  dependency, not a generated substitute. It is recorded for the appropriate
  documentation/quality scope; EPIC-16 must not fabricate its baseline.
- The current route/SEO/data contracts still own donor catalog URLs and generic
  property hrefs. EPIC-16 may add the representative page only through the
  existing Public Gateway; canonical route resolution, full menu and all route
  migration remain in EPIC-15/17/18/21.
- Browser proof requires a local runtime with the project’s valid environment.
  It is intentionally deferred to `dcn-task-16-verify`; no database is started
  or invented for this preflight.

## Implementation entry criteria

- Preserve `REUSE → VARIANT → CREATE`; no dependency install or second design
  system.
- Update `docs/06_DESIGN_SYSTEM.md` alongside the token change and record the
  final contrast evidence there without duplicating HEX values.
- Keep every meaningful page section as a component; the route composes them.
- Use only the Public Gateway and DTOs; do not add raw Payload reads to UI.
- Treat the exact metadata/H1/canonical above as acceptance criteria, not copy
  suggestions.
