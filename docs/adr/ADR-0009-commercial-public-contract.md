# ADR-0009: Commercial public contract 1.4.0

- Status: Accepted
- Decision owner: approved Core 5.5 Master Plan v9, CP-02A
- Date: 2026-09-27

## Context

The owner-approved first-four-month product scope includes secondary commercial
real estate at `/donetsk/kommercheskaya/`. The Payload schema and typed URL
grammar already support commercial objects, but the frozen public contract
1.3.2 still classifies commercial as prepared-off and excludes it from the
public secondary-sale category policy.

## Decision

Publish additive contract version `1.4.0`. Add
`CommercialPropertyDetailsDTO` with `category=commercial` and
`market=secondary`, include it in `R1PropertyDetailsDTO`, and admit commercial
to the existing fail-closed public predicate `secondary + sale + published`.
Retain `PreparedCommercialPropertyDTO` as a deprecated compatibility alias;
newbuild remains prepared-off and is not added to the public policy.

## Consequences

- Commercial cards and property pages use the same explicit public Gateway and
  DTO boundary as the other approved secondary categories.
- This ADR does not activate real feeds, public indexing, rent or newbuild.
- Commercial listing indexability still requires its SEO inventory/content
  gate; rollback removes the 1.4.0 projection and returns the Site Profile to
  `PREPARED_OFF` without a database migration.
