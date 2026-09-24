# RP07 Preflight — SEO Registry, seeds and templates

Status: `READY FOR IMPLEMENTATION`

## Task Contract

- Goal: make the approved SEO Registry the runtime owner of the R1 city-first routes and metadata.
- Scope: `SEO_REGISTRY_SEED.csv`, district identity guard, project registry generation, reusable Platform template helpers, resolver integration, and the 50-row Wordstat owner fixture.
- Source of truth: `AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md` §§24–31 and RP07 acceptance.
- Repository/worktree: `don-city-next`, `codex/rp-07-seo-registry`.
- Risk: `RISKY` because seed contracts and route metadata ownership change together.
- Out of scope: Payload migrations, production data, DNS, server access, deployment and secret mutation.

## Implementation decisions

1. The two approved CSV files remain the only editable SEO seed sources.
2. Every SEO URL is recomputed from semantic registry keys through the V4 city-first grammar; the materialized CSV `url` is an exact drift guard.
3. A deterministic generator creates a committed project runtime module from the CSV. The resolver imports that module and does not parse files on requests.
4. Reusable district/facet materialization helpers live in Platform and accept data variables only. Project names, city wording and exact Gate-approved strings remain project data.
5. District uniqueness is `(citySlug, slug)`, so the same district slug may safely exist in another city later.
6. The frozen 50 Wordstat rows are verification evidence: each row names a stable Registry ID and expected city-first owner URL, and every owner must resolve as HTTP 200 against fixture dependencies.

## Acceptance proof

- `APT_MICRO_TEXT` resolves `/donetsk/kvartiry/tekstilshchik/` and returns the exact approved title from generated registry data.
- All 40 registry URLs equal their grammar-derived value; no active row retains a category-first V3 URL.
- All 50 Wordstat mappings resolve to their declared registry owner and a 200 route.
- District seed identity is unique by `(citySlug, slug)` and Textilshchik keeps `parentSlug` empty.
- `verify:schema`, targeted SEO/route checks, typecheck, architecture guard and build pass before delivery.

