# ADR-004 — Entity URLs are global and contain no geo segment

Status: Accepted
Date: 2026-09-24
Source: master plan §§8, 25–26, 35 and RP-04…RP-06

## Context

An entity can retain identity when its normalized geography or presentation
changes. Putting geo in its canonical path couples identity to mutable data.

## Decision

Property canonical is global: `/{category}/{semantic}-{publicUrlId}/`.
Geography remains entity data and never appears in the canonical entity path.
Other global entities follow the same no-geo-in-path rule when activated.

## Consequences

- `publicUrlId` is stable and price is forbidden in canonical identity.
- Resolver issues at most one semantic 301 to the canonical path.
- Listing geography can change without creating a second canonical entity.
- Legacy `/obekty/[slug]` is compatibility-only when public evidence requires
  it; it never becomes a parallel canonical owner.
