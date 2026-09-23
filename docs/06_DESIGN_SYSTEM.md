# Design System

Status: Active — EPIC-16 intake completed for public UI foundation
Version: 1.0
Updated: 2026-09-24

## Policy

Новый public UI foundation проходит EPIC-16 design intake. Решение компонентов: `REUSE → VARIANT → CREATE`. Payload Admin сохраняет CMS-native интерфейс.

Starter design is the first inventory source, not an automatic final design. Preserve proven visual character, accessible primitives, layout geometry and useful domain patterns where compatible. Replace donor identity, content, routes, menu, domains, metadata and unsafe data coupling.

## Owner-approved direction

- Typeface: `Manrope` for the public product, supplied with `next/font/google` using `cyrillic` and `latin`. Installed Next metadata confirms `cyrillic`, variable weight and 200–800. The font is distributed through the Google Fonts Manrope family under SIL Open Font License 1.1; source and licence evidence: <https://github.com/google/fonts/tree/main/ofl/manrope>.
- Visual base: retain the starter's useful visual character, spacing rhythm, geometry and component behavior where compatible with DON CITY architecture and page intent.
- Brand color: replace the starter's brand-red semantic role with a dark-green brand role after token inventory and contrast testing.
- Safety colors: do not recolor error, destructive or critical warning states; their semantic red remains.
- The dark-green action family is contrast-safe for white text (primary action 6.41:1). Exact numeric values live only in `src/app/globals.css`; this document does not duplicate them.

## Disposition register

Each starter token/component/section is classified during EPIC-16:

- `REUSE` — safe and semantically compatible;
- `VARIANT` — retained foundation with DON CITY tokens/content/behavior;
- `REPLACE` — conflicts with product, accessibility, performance or architecture;
- `REMOVE` — duplicate, unused or donor-only;
- `REQUIRES_OWNER_DECISION` — material visual choice with no safe evidence.

## Current constraints

- Один project-owned semantic token source.
- Light-only до отдельного решения; Tailwind dark mode class-based, `.dark` не устанавливается.
- Один логический `h1` на коммерческой странице.
- Обязательны responsive, focus, keyboard, loading/empty/error, 404 и platform error boundary.
- Numeric tokens live only in the project token source; this document records their semantic policy and evidence.

## Intake outcome

- `src/app/globals.css` is the one numeric token source. Its semantic families cover surfaces, content, action, status, focus, containers, section rhythm, controls, typography, radii and motion.
- Brand action, primary and focus-ring roles use the dark-green family. `error`, `destructive` and critical warning roles retain red/orange semantics.
- Reused foundation: `Container`, `Section`, `SectionHeader`, Button, Input, Select and Dialog. Existing header/footer, catalog/cards/forms are variants until their DON CITY route/data contracts are implemented.
- The public theme is light-only. Tailwind's class-based `dark` custom variant remains dormant and project-authored `dark:` styling is not added.
- Motion is CSS/Tailwind based, uses the existing semantic duration/easing tokens and respects the platform's reduced-motion baseline through the existing UI foundation.

## Ownership map and scaling rule

```text
primitives → layout → shared → domain → page-specific → route composition
Button/Input/Select/Dialog → Container/Section → shell/lead form
→ catalog filters/cards/pagination → Donetsk catalog copy → /kvartiry/donetsk/
```

The representative `/kvartiry/donetsk/` page proves the foundation with the
approved title, description, canonical path, one logical H1, public DTO catalog,
filters, empty state, property cards and contextual lead action. Future route
families reuse or variant this system; they do not establish another visual
language.

## Deferred only to their owning epics

- Exact R1 menu and NAP replacement — EPIC-17 / EPIC-07.
- Canonical route resolver, full route skeleton and property detail paths — EPIC-15 / EPIC-18 / EPIC-28.
- Browser, responsive, accessibility, metadata and media proof — EPIC-16 verification task.
- The starter token-report script requires absent `docs/PROJECT.md`; do not fabricate that quality baseline in the design system.
