# RP-10 preflight — gateway, DTO, cache and analytics

- Task: `dcv4-task-63-preflight`
- Base: `origin/main@35276f8efc210789abc9a21251d6a01d4edae66e`
- Branch: `codex/rp-10-gateway-cache-analytics`
- Risk: `STANDARD` while changes remain additive contracts/tests; escalate if schema, migrations or critical ingest writes become necessary.

## Confirmed inputs

- The city-first resolver already produces an explicit `PageKey`, canonical path and catalog query.
- `getPublicCatalog` currently accepts a loose query and carries display city but no stable `geo_slug` / `page_key` identity downstream.
- Cache revalidation currently allows generic tags (`properties`, `property`) and a small path prefix set; city/category/district/property tag builders do not exist.
- Feed invalidation currently emits only generic `properties` plus the apartment catalog path.
- UI exposes isolated analytics attributes, but there is no typed event envelope that requires `geo_slug` and `page_key` and rejects PII.

## Implementation contract

1. Freeze a typed public page identity and require gateway catalog calls to carry it alongside explicit filters.
2. Add deterministic cache-tag builders for geo, geo/category, city-scoped district and property identity.
3. Add publication/archive invalidation target builders that cover the object's exact geo/category/district/property dimensions.
4. Add a typed analytics envelope requiring `geo_slug` and `page_key`, with a strict PII-key rejection guard.
5. Update/freeze DTO contracts and prove the exact dimensions with focused tests.

## Stop conditions

- Any implicit Donetsk fallback in gateway, cache or analytics contracts.
- Schema/migration changes, destructive data mutation, production/DNS/secret action.
- Analytics payload fields containing contact, address or other PII.
