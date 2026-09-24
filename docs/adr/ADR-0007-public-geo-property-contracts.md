# ADR-0007: Public geo and property contracts 1.3.1

- Status: Accepted
- Decision owner: approved Master Plan V4, EPIC-12
- Date: 2026-09-24

## Context

The city-first resolver and Payload geo model have completed, while public
catalog components must still receive only allow-listed DTOs. R1 needs typed
geography and category-specific data without making commercial or newbuild
inventory public before their separate research work.

## Decision

Release the additive frozen public contract `1.3.1`:

- `RegionDTO`, `CityDTO`, `DistrictDTO` and `PropertyLocationDTO` carry only
  public identity, grammar and publication data.
- R1 exports discriminated apartment, house and land details. House types and
  normalized land fields mirror the approved taxonomy without inventing legal
  enums.
- Commercial and development shapes are explicitly `prepared-off`. They add no
  public route, menu entry, catalog predicate or gateway read.

## Consequences

- Public Gateway owns the later mapping from Payload selections to these types.
- Reusable UI continues to avoid raw Payload documents.
- A later R2 activation must be separately researched and versioned; it cannot
  reinterpret this prepared contract as publication approval.
