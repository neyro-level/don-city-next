# TASK-04.9 responsive media proof

Status: `PASS`

## Boundary

- Exact implementation SHA: `6ddbc04b17ee2733808822707fa0bbdb3f293681`.
- Production-like local Next.js build on native PostgreSQL 18.6 and the isolated
  `don_city_dev` database.
- Project-owned Atlas fixture: 60 active property records, normalized only in
  the local database to the canonical Donetsk city relation.
- Chrome DevTools profile: `390x844`, DPR `3`, mobile/touch, CPU throttling `4x`,
  `Slow 4G`.
- Production, DNS, public indexing, Timeweb storage and production data were not
  read or changed.

## Current media contract

- `PublicFeedImage` keeps native responsive output; no `next/image` rewrite was
  introduced.
- The first critical property image on Home and Property is eager with high
  fetch priority. Catalog card images remain lazy because the catalog heading,
  not a card image, is the observed LCP element.
- Managed Payload media emits width descriptors from its generated variants;
  external/demo images correctly fall back to their original `src` when no
  variants exist.
- Card and gallery `sizes` match their `33/50/100vw` and `62/100vw` layouts.
- Intrinsic width/height or an owned aspect container reserves space. Missing
  card/gallery media renders `MediaFallback`.

## Mobile trace evidence

| Route | HTTP | LCP | Breakdown | CLS | Budget |
|---|---:|---:|---|---:|---|
| Home `/` | 200 | `1,336 ms` | TTFB `6`; load delay `629`; load `595`; render delay `106` | `0.00` | PASS |
| Catalog `/donetsk/kvartiry/` | 200 | `1,045 ms` | TTFB `27`; render delay `1,018` | `0.00` | PASS |
| Property `/kvartiry/donetsk-apartment-2698847465424536680-21/` | 200 | `1,296 ms` | TTFB `25`; load delay `609`; load `590`; render delay `72` | `0.00` | PASS |

All routes pass `LCP <= 2.5 s` and `CLS <= 0.1`. Raw trace files remain in the
ignored local directory `artifacts/task-04-9/`.

## Verification

- `pnpm verify:responsive-media`
- `pnpm verify:performance`
- `pnpm verify:property-card-system`
- `pnpm verify:property-detail-routes`
- `pnpm build`

No performance fix was required because the current exact-SHA measurements pass
the approved budgets.
