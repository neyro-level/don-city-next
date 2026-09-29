# DON CITY — Design Policy

Status: Active — owner-approved brand direction
Version: 2.0
Updated: 2026-09-29

## Normative UI baseline

The project UI contract is governed by `../AMS_UI_CORE_v5.0_FINAL.md`. This document remains the project-specific design policy; numeric values remain exclusively in `src/app/globals.css`.

Current status is `TARGETED CONFORMANCE`. The delivered execution contract is
exact APPROVED plan `DON-CITY-CONSTITUTION-CLEANUP-PRODUCTION-TRUTH` v1 in
`DON_CITY_CONSTITUTION_CLEANUP_PRODUCTION_TRUTH_MASTER_PLAN_V1_0.md`; its
constitution cleanup, production-truth proof and one authorized rollout are
complete. Historical
CP-05 remains evidence, not the current router. This is not a claim that every
future page or optional module is certified; new UI still follows the same gates
and `REUSE → VARIANT → CREATE` rule.

## UI Core 5.0 targeted normalization baseline

The owner-approved constitution remediation plan starts one targeted Design
Intake pass from the actual public UI. It reuses this Design Policy and
`src/app/globals.css`; no second visual source or redesign is introduced.

Audited baseline before value changes on 2026-09-29:

- 563 unique CSS variable definitions: 30 core, 185 shadcn/Tailwind bridge and
  348 active project roles; reserved and dead roles were both zero;
- the diagnostic inventory found 271 typography-related names, 182
  color/surface-related names, 67 radius/shadow names, 38 spacing/layout names
  and 9 motion names;
- material duplication is concentrated in the `site`, `text`, `leading`,
  `color`, `property`, `legal`, `catalog`, `html`, `tracking` and `radius`
  families;
- project-owned component families currently encode many private surface,
  border and shadow names; typography includes sub-11px roles and several
  near-duplicate body/card/heading ladders;
- canonical primitives remain project-owned shadcn `new-york` components with
  Lucide icons, RSC enabled and Tailwind CSS variables sourced only from
  `src/app/globals.css`;
- the UI clone audit passed its existing baseline, but its 36 plain primitive
  uses and component-private token families are inventory evidence, not an
  exemption from normalization.

Normalization map for EPIC-04:

| Area | Canonical target | Disposition |
|---|---|---|
| typography | `h1/h2/h3/h4/body-lg/body/body-sm/label/caption` | collapse near-duplicates; retain an extra role only with a documented visual or accessibility reason |
| surfaces/content | page, raised, subtle, inverse; strong, default, subtle, inverse | reuse semantic roles before component-private aliases |
| actions/status | primary action plus success, warning, danger and info | preserve brand and state meaning; never encode status by color alone |
| layout | `narrow/site/wide` containers and `sm/md/lg/hero` section rhythm | one numeric source; no page-local rhythm scale |
| radius/shadow | installed shadcn scale plus proved card/large and card/raised/dialog shadows | remove value aliases that do not express a distinct role |
| motion/media | fast/standard/extended with reduced motion; owned media aspects and fallbacks | preserve calm interaction and layout stability |
| repeated patterns | shell, catalog controls/cards, property cards/gallery/forms, legal views | `REUSE → VARIANT → CREATE`; shared semantics replace private value families |

The representative system-fit surface is the property detail page because it
combines hierarchy, responsive media, cards, forms/actions, overlays and DTO
data. Home, catalog, marketing and legal routes remain required cross-checks for
section ownership and heading semantics. No owner decision is required for this
normalization pass: brand identity, light-only mode and the no-redesign boundary
are already approved. Exact deletions and exceptions must be proved by the
following EPIC-04 tasks before this baseline can be called normalized.

This file is the only active project design policy. Numeric values remain in
`src/app/globals.css`; the superseded `06_DESIGN_SYSTEM.md` path is only a
history pointer.

## Назначение

Система задаёт единый премиальный язык публичного сайта DON CITY. Она сохраняет проверенную структуру, ритм, компоненты и поведение starter/Bastion foundation, но заменяет донорскую идентичность фирменными цветами и утверждённым логотипом DON CITY.

Payload Admin остаётся CMS-native и не получает публичную бренд-тему.

## Источник бренда

- Утверждённый оригинал: `public/brand/don-city-logo-approved.jpg`.
- Компактный знак для шапки: `public/brand/don-city-mark.png`.
- Browser icons: `src/app/icon.png` и `src/app/apple-icon.png`.
- Оригинал нельзя перекрашивать, деформировать, поворачивать, обрезать по контуру зданий или заменять набранным текстом.
- Текстурный фон оригинала является частью логотипного изображения, а не фоном всего интерфейса.

В шапке используется компактный знак и название, набранное Manrope. В подвале используется полный утверждённый вертикальный логотип с подписью «Агентство недвижимости». Это сохраняет читаемость меню и одновременно показывает официальный знак без изменений.

## 4. UI Core 5.0 project policy

This section is policy only. All numeric values belong exclusively to
`src/app/globals.css`; components consume semantic roles.

### 4.1 Visual Character

DON CITY combines reliability, architectural precision and calm premium
presentation. Deep conifer, warm porcelain and restrained copper accents come
from the approved brand; metallic gradients, glare and decorative “gold” are
not part of the interface language. The original logo keeps its protected image
field and is never redrawn with text or CSS effects.

### 4.2 Status

The public UI is in `TARGETED CONFORMANCE` with UI Core 5.0. Public commercial
pages use the project design system; Payload Admin stays CMS-native. Loading,
empty, error, success, warning, disabled, hover and focus states use semantic
roles and never communicate status by color alone. Responsive, not-found and
platform-error states are mandatory.

### 4.3 Typography

Manrope is the only public typeface. The public scale is limited to `h1`, `h2`,
`h3`, `h4`, `body-lg`, `body`, `body-sm`, `label` and `caption`. Every
`text-*` role is compound and owns font size, line-height and letter-spacing;
weight remains independently composable. A normal heading therefore uses
`text-h1 font-extrabold`, without a parallel `leading-*` or `tracking-*` class.
Such an override is allowed only as a rare documented visual/accessibility
exception added to the exact guard allowlist. Commercial pages keep one logical
`h1`, while repeated sections own visible `h2` headings. Project-only
typography roles are not allowed.

### 4.4 Containers

Page composition uses `Container` with `narrow`, `site` or `wide` intent.
Routes and domain views do not introduce private max-width or gutter scales.
Header, footer and page content align to the same semantic container ownership.

### 4.5 Section Rhythm

`Section` owns `sm`, `md`, `lg` and `hero` vertical rhythm. Nested semantic
sections use `Section as="div"`; the outer landmark and visible heading retain
semantic ownership. Page-local spacing scales and hidden duplicate headings are
forbidden.

### 4.6 Surfaces/Shadows

Reusable UI consumes `surface-*`, `content-*`, `border-default`, `status-*`,
`shadow-card`, `shadow-raised` and `shadow-dialog`. Brand accents remain scarce;
danger and warning do not inherit brand colors. Component-private palettes and
shadow aliases require an approved exception.

### 4.7 Radii

Primitives use the installed shadcn radius scale derived from the single
`--radius` source: `sm`, `md`, `lg`, `xl` and `full`. Controls use `lg`; cards,
dialogs and large media use `xl`. New aliases with the same value are
forbidden. Oversized bubble forms conflict with the brand character.

### 4.8 Buttons

Button is the single action primitive. Variants express primary, secondary,
quiet and destructive intent; domain views compose them instead of cloning
padding, radius, focus or disabled behavior. Icons supplement a visible label or
an accessible name and never replace action semantics.

### 4.9 Forms

Input, Select, Textarea, Checkbox, Label and Field own form presentation.
Visible labels, error association, focus, disabled, pending and success states
are required. Public lead forms receive DTO context and preserve legal consent;
page-specific forms do not fork primitive styling.

### 4.10 Media

Payload owns managed variants; public views render native `srcset` and `sizes`
through `PublicFeedImage`. Critical first media may be eager/high priority;
noncritical media stays lazy. Intrinsic dimensions or an owned aspect container
reserve layout space, and `MediaFallback` owns missing media. Brand decoration
never substitutes for listing evidence.

### 4.11 Icons

Lucide is the shared UI icon source. The approved DON CITY mark and browser
icons remain brand assets, not generic icons. Decorative icons are hidden from
assistive technology; icon-only controls require an accessible name.

### 4.12 Motion

Motion uses the built-in Tailwind duration scale with semantic `ease-in-out`.
Transitions are limited to purposeful color, opacity and transform feedback.
`prefers-reduced-motion` removes nonessential motion, and no animation may block
navigation or form completion.

### 4.13 Dark Mode

The public project is light-only. Tailwind dark mode remains class-based for
framework compatibility, but the application does not install `.dark`. Inverse
surfaces are explicit semantic compositions, not an implicit dark theme.

### 4.14 Journal

`NOT_APPLICABLE` while the journal module is disabled. Journal presentation,
styles, routes and exports remain absent; enabling it requires a separate
approved product and UI task.

### 4.15 Shared Patterns

The ownership chain is `numeric tokens → primitives → layout → shared shell →
domain → page composition`. Component decisions follow `REUSE → VARIANT →
CREATE`. `PublicSiteShellView` is the single Header/Footer/mobile-navigation
owner; the property overlay uses the project-owned Dialog and Button primitives.
Home, Catalog, Property and Marketing compositions consume DTO data and the
project-owned analytics boundary.

### 4.16 Approved Exceptions

Approved exceptions are limited to the textured source logo inside its image
asset, CMS-native Payload Admin styling, documented unique hero/media overlays,
the neutral house-project illustration and four historical internal `Starter*`
filenames whose public exports and component names are already client-neutral.
New public owners use neutral names. Page-level CSS is allowed only for layout
or behavior that semantic APIs cannot express; it cannot introduce numeric
tokens, raw brand values or a second primitive system.

## Disposition register

- Historical `views/corporate` sections are `REMOVE`: after UI-01…05 they had
  no route, package-export or runtime consumer. Their private token prefixes and
  two private view-model aliases were removed with an executable absence guard.

- `REUSE`: сетка, spacing rhythm, responsive shell, доступные primitives.
- `VARIANT`: header, footer, action palette, surfaces, borders, focus и брендовые assets.
- `REPLACE`: донорский логотип, donor-red brand roles и холодные серые базовые поверхности.
- `REMOVE`: декоративные текстуры вне утверждённого логотипа, псевдозолотые градиенты и дубли numeric tokens.

## Проверка изменений

При изменении темы проверяются: контраст ключевых пар, header/footer на mobile и desktop, клавиатурный focus, favicon, отсутствие horizontal overflow, один `h1`, metadata/robots и отсутствие donor identity. Production публично индексируется; page-level registry/content gates продолжают управлять доступностью и индексируемостью отдельных URL.
