# DC10-R12-06 — factual structured data preflight

Status: PREFLIGHT COMPLETE; IMPLEMENTATION REQUIRED

Baseline SHA: `0780765b7d6d752b6cd86335f5ab4436dcba6fc0`

Observed: 2026-09-28

## 1. Goal and boundary

This epic must make public JSON-LD describe the same factual property category,
locality and service information that the page renders. It does not authorize a
new route, locality, FAQ, production release, database mutation or secret change.

The required validator matrix is apartment, house, land, commercial and the
visible lawyer service page. Claims that are not present in the public DTO and
visible page content must remain absent from JSON-LD.

## 2. Exact baseline

| Owner | Current behavior | Gap |
| --- | --- | --- |
| `packages/contracts/src/property.ts` | `PropertyCardDTO` already carries the allowlisted `category`, `city`, optional `district`, public `address`, price and visible summary. | No contract expansion is required to identify category or locality. |
| `src/core/data-access/public/dto.ts` | Maps Payload-selected category and resolved city/district into the public property DTO. | JSON-LD currently ignores the category and the structured locality fields. |
| `src/core/seo/structured-data.tsx` | Emits an `Offer` whose `itemOffered` is always `Residence`; address is a single text value. | Apartment, house, land and commercial objects are indistinguishable; `addressLocality` is absent. |
| `src/project/static-page-composition.ts` | Owns the visible lawyer title, lead and three service sections. | No service JSON-LD builder consumes these visible facts. |
| `src/app/(site)/public-route.tsx` | Emits property, list, breadcrumb and conditional organization JSON-LD. | The lawyer route emits only breadcrumb JSON-LD and does not request NAP because it is not in `needsNap`. |
| Existing verification | Property route tests cover apartment, house and land routing; the SEO crawl checks organization JSON-LD only. | No exact builder fixtures cover the four property categories and lawyer service. |

Graphify dependency tracing at this baseline confirms that
`buildPropertyJsonLd` is imported by `public-route.tsx`, called only from the
resolved property page, and reached by the catch-all and static route entry
points. The generated graph is a local diagnostic artifact and is not part of
the Git diff.

## 3. Normative type contract

Official Schema.org pages were checked on 2026-09-28:

- <https://schema.org/Apartment> and <https://schema.org/House> are factual
  accommodation types and accept `PostalAddress`, locality and floor-size data;
- <https://schema.org/Place> is the safe generic place type when no narrower
  official type truthfully describes a land or commercial listing;
- <https://schema.org/Offer> may wrap the offered item;
- <https://schema.org/Service> describes a service and permits visible
  `serviceType`, provider and area data.

Implementation must therefore use an explicit project mapping rather than infer
a Schema.org type from display text:

| Project category | `itemOffered.@type` | Required factual discriminator |
| --- | --- | --- |
| `apartment` | `Apartment` | `additionalType: "Квартира"` |
| `house` | `House` | `additionalType: "Дом"` |
| `land` | `Place` | `additionalType: "Земельный участок"` |
| `commercial` | `Place` | `additionalType: "Коммерческая недвижимость"` |

The `PostalAddress` must use the DTO's actual `city` as `addressLocality` and
must not substitute Donetsk for another locality. The public display address may
remain `streetAddress`; district may be emitted only from the DTO when present.

## 4. Implementation contract

1. Centralize the category-to-Schema.org mapping in the structured-data owner.
2. Build `Offer.itemOffered` from public DTO fields only: type, visible name,
   structured address/locality, optional factual area and coordinates.
3. Preserve price omission when price is absent; do not synthesize availability,
   ratings, seller identity or geo data.
4. Add lawyer `Service` JSON-LD from the same `MarketingPageDTO` title, lead,
   canonical URL and visible section titles/text rendered by the page.
5. If provider data is included, load the canonical public NAP for the lawyer
   route and reuse the existing `RealEstateAgent` facts; do not duplicate a new
   NAP source.
6. Do not add `FAQPage`: the lawyer page has no visible FAQ composition.

## 5. Acceptance-to-proof matrix

| Acceptance | Planned proof |
| --- | --- |
| Apartment and house use factual types | Builder fixtures assert `Apartment` and `House`. |
| Land and commercial are not mislabeled as residences | Fixtures assert `Place` plus the explicit Russian category discriminator. |
| Locality is factual | Every property fixture asserts its own DTO city in `PostalAddress.addressLocality`; one non-Donetsk fixture prevents fallback drift. |
| Lawyer facts are visible | Service fixture is built from the exact marketing DTO and asserts its name, description, URL and visible service items. |
| No invisible FAQ or invented claims | Source/fixture guards reject `FAQPage`, ratings, reviews and unsupported availability. |
| Runtime integration is owned once | Route-source check proves the property and lawyer builders are emitted only by the canonical public route renderer. |

## 6. Document impact

- Added this preflight evidence as the durable implementation contract.
- Reviewed PRD, Product Structure, Architecture, Backlog and Release Checklist;
  their current owner boundaries remain valid and need no preflight edit.
- Production, DNS, Payload data, secrets, routes and monitoring remain unchanged.
