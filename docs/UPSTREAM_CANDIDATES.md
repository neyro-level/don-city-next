# Upstream candidates

Status: candidate inventory; no upstream publication is authorized by this file.

| Candidate | Current owner | Why portable | Promotion gate |
|---|---|---|---|
| Safe JSON-LD serialization | `src/platform/seo/json-ld.ts` | Independent of client schema and brand | tests, API review, consumer compatibility |
| Property lifecycle resolver | `src/platform/seo/property.ts` | Pure lifecycle state machine | align canonical redirect semantics after RP-06 |
| Redirect path sanitizer | `src/platform/seo/redirect-path.ts` | Client-independent safety rule | security review and negative fixtures |
| Metadata mapping | `src/platform/seo/page-metadata.ts` | Typed contract to Next metadata | version compatibility and contract review |
| Catalog SEO decision | `src/platform/seo/catalog.ts` | Receives whitelist as typed input | replace V3 paths through RP-04/RP-07 before promotion |
| Site URL helpers | `src/platform/seo/site.ts` | Receives brand/origin as typed input | RP-12 two-profile matrix passed; upstream API review remains |
| Typed URL grammar | `src/platform/grammar/**` | Builds/parses canonical owners from an injected registry | RP-12 proves single/multi-geo registries without source mutation |
| Site Profile selectors | `src/platform/profile/**` | Resolve route/index/promotion state from injected profile data | RP-12 proves Donetsk-only and Donetsk+Makeevka matrices |
| Registry sitemap projection | `src/platform/sitemap/registry.ts` | Filters injected registry owners without project literals | RP-12 two-profile sitemap/XML matrix passed |
| IndexNow payload builder | `src/platform/indexnow/payload.ts` | Provider-neutral, same-origin event payload | security/API review and transport adapter before upstreaming |
| Platform boundary guard | `scripts/quality/platform-boundary-guard.mjs` | Generic dependency/literal invariant | parameterize forbidden literals before upstreaming |

Project configuration, DON CITY literals, registry CSV data, routes and Payload
collections are not upstream candidates. Geo data and Content Gate values remain
Project inputs even when their portable selectors become upstream candidates.
