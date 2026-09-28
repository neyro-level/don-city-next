# ADR-0012: Required homepage primary action in contract 2.0.0

Status: Accepted

Date: 2026-09-28

## Context

Approved Plan ID `AMS-DON-CITY-LIVE-CONFORMANCE` v13 requires public HTML to
expose only active allowlisted routes through explicit DTO/buildUrl boundaries.
Delivered EPIC-105 added `HomePageDTO.primaryAction` as a required field and
made the homepage consume that DTO-owned canonical catalog action. The source
change passed its exact-head gate, but the frozen base contract lock remained
at the older `1.5.0` surface.

Making an inherited optional field required for `HomePageDTO` is a breaking
TypeScript contract change for consumers that construct a homepage DTO.
Regenerating the lock without a major version would hide that fact.

## Decision

- Preserve required `HomePageDTO.primaryAction`.
- Keep `MarketingPageDTO.primaryAction` optional for other marketing page
  compositions.
- Bump the base `@ams/realtbase-contracts` contract from `1.5.0` to `2.0.0`.
- Regenerate the normalized frozen base lock. Journal contract `0.1.0` is
  unchanged.

The approval authority is the owner-approved v13 plan and its delivered
EPIC-105 public-surface outcome. This ADR closes the lock/version drift; it does
not introduce a new route, API, production action or data migration.

## Consequences

- Homepage DTO producers must supply one safe primary action.
- Consumers receive a compile-time guarantee instead of relying on a fallback
  or literal href.
- Any later frozen base contract change still requires its own explicit
  version, ADR and approval evidence.
