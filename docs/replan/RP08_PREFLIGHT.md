# RP08 Preflight — nearby geo under city-first grammar

Status: `READY FOR IMPLEMENTATION`

## Task Contract

- Goal: expose truthful conditional nearby-city hub/category pages without assigning nearby inventory to Donetsk.
- Acceptance fixture: published Макеевка with two active apartments.
- Source of truth: master plan §28 and EPIC-61 / RP-08.
- Branch/worktree: `codex/rp-08-nearby-geo`, dedicated RP08 worktree from `origin/main` at `64487c586dc4d4b0f3f38bcde5e95af54746974b`.
- Risk: `STANDARD`; no schema, migration, auth, secret, server, DNS or production mutation.

## Implementation decisions

1. A nearby slug is grammar-known but remains unreachable until Payload reports a published city and at least one active property.
2. Hub availability uses total active inventory; category availability uses the matching active category count.
3. Nearby pages are always `noindex,follow`, self-canonical, absent from menu/sitemap.
4. Nearby district URLs remain absent because the grammar has no district registry entries for nearby cities.
5. Metadata and catalog filters use the real city record, never the primary Donetsk fallback.
6. Property-page inbound geo links are emitted only when the property belongs to that nearby city and its conditional routes exist.

## Proof plan

- Fixture Макеевка / two apartments: hub and apartment category return 200 noindex; house and district return 404.
- A Макеевка apartment receives hub/category inbound links; a Donetsk property receives no Макеевка link.
- Public Gateway uses anonymous context, explicit city select and active-property counts.
- Route resolver, Public Gateway policy, typecheck, lint, architecture and build pass before STANDARD Gate.

