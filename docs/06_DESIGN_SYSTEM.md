# Design System

Status: Direction approved; exact tokens pending starter intake
Version: 0.2
Updated: 2026-09-23

## Policy

Новый public UI foundation проходит EPIC-16 design intake. Решение компонентов: `REUSE → VARIANT → CREATE`. Payload Admin сохраняет CMS-native интерфейс.

Starter design is the first inventory source, not an automatic final design. Preserve proven visual character, accessible primitives, layout geometry and useful domain patterns where compatible. Replace donor identity, content, routes, menu, domains, metadata and unsafe data coupling.

## Owner-approved direction

- Typeface: `Manrope` for the public product. EPIC-16 verifies source/license, Cyrillic coverage and required weights before scaling.
- Visual base: retain the starter's useful visual character, spacing rhythm, geometry and component behavior where compatible with DON CITY architecture and page intent.
- Brand color: replace the starter's brand-red semantic role with a dark-green brand role after token inventory and contrast testing.
- Safety colors: do not recolor error, destructive or critical warning states; their semantic red remains.
- Exact HEX values are intentionally deferred until the installed starter token source is inspected. Numeric values will live only in that token source, not be duplicated here.

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
- Numeric tokens не выдумываются до intake/reference evidence; visual direction above is already approved.

## TODO EPIC-16

- visual inventory and normalization;
- semantic colors/typography/spacing/layout;
- Manrope source/Cyrillic/weight verification;
- starter brand-red → dark-green brand-role mapping with contrast proof while retaining semantic error/destructive red;
- representative tokens/components fixture;
- catalog/property/form/page section map;
- accessibility and motion rules.
- representative `/kvartiry/donetsk/` fixture and page proof;
- section ownership map for every planned route family;
- scan for stale donor branding, domains, hrefs and metadata.
