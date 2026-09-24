# RP08 Verification — nearby geo under city-first grammar

Status: `PASS`

Implementation checkpoint: `48c6afe2d1078db5c437d0e7cef6e38714e7ed66`

## Acceptance matrix

| Fixture / rule | Result |
|---|---|
| Published Макеевка, two active apartments: `/makeevka/` | 200, self-canonical, `noindex,follow`, city filter = Макеевка |
| `/makeevka/kvartiry/` | 200, self-canonical, `noindex,follow`, apartment + Макеевка filters |
| `/makeevka/doma/` and `/makeevka/uchastki/` | 404 because matching active inventory is zero |
| `/makeevka/kvartiry/centralnyy/` | 404; nearby districts are absent in R1 |
| Макеевка property | Links only to `/makeevka/` and `/makeevka/kvartiry/` |
| Donetsk property | No Макеевка link |
| Menu/sitemap | No nearby promotion was added; nearby routes remain dynamic noindex owners |

## Executed checks

- `pnpm verify:geo-model` — PASS, including the RP08 fixture.
- `pnpm verify:public-gateway` — PASS.
- `pnpm verify:seo-contracts` — PASS.
- `pnpm typecheck` — PASS.
- `pnpm quality:architecture` — PASS: 412 modules, 1220 dependencies.
- `pnpm guard:platform-no-project-literals` — PASS.
- `pnpm lint` — PASS with pre-existing warnings only; RP08 files add none.
- `pnpm build` — PASS on Next.js 16.3.5.

## Boundary

No schema, migration, production, DNS, server, managed database or Secret
Master mutation was performed.

## Task Manager evidence

- Plan/version: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST` / `v7`.
- Implementation checkpoint: `48c6afe2d1078db5c437d0e7cef6e38714e7ed66`.
- Verification checkpoint: `5cb92309779fd738b9eff8bebfa12659910b8ce1`.
- Delivery policy: `MERGE_AFTER_GATE`, one exact-head STANDARD Gate, no production.
