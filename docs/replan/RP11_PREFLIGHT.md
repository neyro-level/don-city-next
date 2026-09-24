# RP-11 preflight — sitemap, robots and IndexNow

- Task: `dcv4-task-64-preflight`
- Base: `origin/main@ca7e34a592a7c80b2ef007c8390ce66997d5c790`
- Branch: `codex/rp-11-sitemap-indexnow`
- Risk: `STANDARD` for deterministic generation and tests; no live submission.

## Confirmed inputs

- The current sitemap still uses a legacy static list plus generic CMS pages and properties; it is not yet driven by the V4 SEO registry.
- The current static list omits the geo hub, houses and land category owners and cannot represent gate-passed district/facet owners.
- Nearby geo and global category roots must remain excluded even when their routes resolve.
- Listing `lastmod` must come from registry content and owned published objects, never request time.
- Robots already routes through the project indexing policy but requires a fixture proof against the canonical origin.
- No IndexNow module exists. RP-11 permits only payload construction/transport contracts and fixtures; live submission remains release-only.

## Implementation contract

1. Build logical sitemap entries only from grammar-owned, indexable, active/gate-passed registry owners plus published property DTOs.
2. Preserve meaningful `lastmod` and deterministic sharding/XML output.
3. Prove robots output for enabled and disabled indexing policies.
4. Add a provider-neutral IndexNow payload builder for publish, meaningful update, archive/removal, gone and canonical move; canonical move contains the proven old and new URLs.
5. Add snapshot/XML validation proving no V3 owner, nearby geo or category root leakage.

## Stop conditions

- Live IndexNow/Webmaster request, DNS or production mutation.
- Invented legacy URL, invented lastmod or activation of a pending content gate.
- Any URL not owned by the canonical grammar.
