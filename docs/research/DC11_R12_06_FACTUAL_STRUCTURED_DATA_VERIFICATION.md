# DC10-R12-06 — factual structured data verification

Status: PASS

Verification date: 2026-09-28

Verified implementation head: `366cc392d8c0f9af7ca100999f18544592114a64`

## 1. Verified outcome

The exact implementation head emits structured data from the same public DTOs
and visible page composition used by the canonical renderer:

- apartment → `Apartment`;
- house → `House`;
- land → `Place` + `Земельный участок`;
- commercial → `Place` + `Коммерческая недвижимость`;
- lawyer page → `Service` with the rendered title, lead, service section titles,
  canonical URL and canonical public provider facts.

No route, sitemap, database, secret, production or monitoring state changed.

## 2. Independent fixture review

The five required cases are executable fixtures in
`scripts/verify-factual-structured-data.ts`. Verification confirmed:

| Case | Type proof | Locality / visible-fact proof | Verdict |
| --- | --- | --- | --- |
| apartment | `Offer.itemOffered.@type = Apartment` | `PostalAddress.addressLocality = Донецк` | PASS |
| house | `Offer.itemOffered.@type = House` | `addressLocality = Макеевка`, proving there is no Donetsk fallback | PASS |
| land | `Place` with explicit land discriminator | own locality retained; residential floor size omitted | PASS |
| commercial | `Place` with explicit commercial discriminator | own locality retained | PASS |
| lawyer | `Service` | name, description and service types equal the rendered `MarketingPageDTO`; provider equals public NAP | PASS |

The guard also rejects the previous generic `Residence` output and asserts that
no `FAQPage`, aggregate rating or review claim is introduced.

## 3. Checks

- `pnpm verify:factual-structured-data` — PASS;
- `pnpm typecheck` — PASS;
- `pnpm quality:architecture` — PASS, zero violations across 502 modules and
  1,560 dependencies;
- `pnpm verify:site-settings` — PASS;
- `pnpm verify:property-detail-routes` — PASS;
- `pnpm verify:seo-contracts` — PASS;
- `pnpm verify:project-documentation` — PASS;
- targeted Biome lint/format, secret guard and `git diff --check` — PASS.

## 4. Boundary proof

`src/app/(site)/public-route.tsx` remains the single runtime emitter. The lawyer
route now requests the existing public NAP and emits organization/service data;
property pages continue through the same `buildPropertyJsonLd` call. No second
data owner, schema store or generated factual source was introduced.
