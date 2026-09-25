# EPIC-42 Performance Evidence

Status: `LOCAL PASS`

## Acceptance matrix

| Area | Verdict | Evidence |
| --- | --- | --- |
| RSC boundaries | PASS | Catalog view, property cards, pagination, and active public footer remain Server Components. Header and lead form remain explicit interactive leaves. |
| Catalog JavaScript | PASS | Public app imports use narrow UI package entrypoints. The catch-all client-reference build surface fell from 33 project client modules / 323,824 raw chunk bytes to 14 modules / 178,857 raw chunk bytes (44.8% reduction). |
| Pagination | PASS | A validated `page` reaches the Public Gateway; page 2+ is `noindex,follow`, self-canonical, and linked by server-rendered anchors. Repeated or invalid values fall back to non-indexable page 1. |
| Media | PASS | Catalog cards keep fixed 3:2 geometry, explicit image width/height and `sizes`, async decoding, lazy loading below the fold, and priority only when explicitly selected. |
| DB/cache | PASS | Pagination is part of the catalog request and therefore of the existing tagged `unstable_cache` key; EPIC-40 cache-target verification remains green. |
| LCP/CLS/INP readiness | PASS WITH RUNTIME LIMITATION | Production build passes; server/client and media prerequisites are enforced. Field-like timings were not fabricated because this workstation has no project-local PostgreSQL identity/config and no Chrome DevTools CLI executable. Exact throttled metrics remain staging evidence in EPIC-45/46. |

## Executed checks

- `pnpm verify:performance` — PASS.
- `pnpm verify:route-resolver` — PASS.
- `pnpm verify:cache-targets` — PASS.
- `pnpm quality:architecture` — PASS, 470 modules / 1,449 dependencies,
  no violations.
- `pnpm typecheck` — PASS.
- `pnpm lint` — PASS with pre-existing warnings in generated migrations,
  generated Payload types, and legacy shell CSS.
- `pnpm build` — PASS using Next.js 16.3.5 production webpack build.

## Build measurement method

The before/after figures are deterministic local build-artifact measurements
from `.next/server/app/(site)/[...segments]/page_client-reference-manifest.js`.
They sum unique raw JavaScript chunks referenced by project-owned client
modules, excluding CSS and third-party module records. They are useful for
regression comparison but are not transferred/gzipped bytes and are not Web
Vitals.

## Runtime boundary

- Native PostgreSQL 18 service/CLI: not found on this workstation.
- Project `.env.local` and process database credentials: absent.
- Chrome DevTools CLI executable: not found.
- Docker/WSL, production, staging, DNS, migrations, and secrets: untouched.

The safe next runtime proof is a throttled staging trace on representative Home,
catalog page 1, catalog page 2, and property routes. Record LCP element and
breakdown, CLS sources, INP interaction, transferred JavaScript, cache hit
behavior, and a comparison against this exact release SHA.
