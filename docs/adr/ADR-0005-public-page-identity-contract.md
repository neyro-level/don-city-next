# ADR-0005: Public page identity contract 1.1.0

- Status: Accepted
- Decision owner: approved Master Plan V4, EPIC-63 / RP-10
- Date: 2026-09-24

## Context

The frozen 1.0.0 DTO surface did not carry stable geography and page identity.
City-first gateway, cache and analytics consumers therefore could fall back to
display values or implicit primary geography.

## Decision

Add `PublicPageIdentityDTO` with required `geoSlug` and `pageKey` plus optional
category. Public catalog requests must provide this identity explicitly, route
resolution derives it from the canonical grammar, and downstream UI analytics
attributes consume the same DTO. Publish the additive contract as 1.1.0 and
refresh the deterministic base lock.

## Consequences

- No implicit Donetsk default is permitted at the public gateway boundary.
- Cache and analytics dimensions can share canonical geography/page identity.
- This is an additive minor release; no schema or migration is involved.
