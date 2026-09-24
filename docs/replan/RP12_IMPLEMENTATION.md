# RP-12 implementation — two-profile proof

## Result

The portable site pipeline is exercised with two immutable fixture inputs:

- `donetsk-single`: Donetsk apartments are ACTIVE; Makeevka remains a
  non-indexable nearby-geo route and is absent from menu and sitemap output.
- `multi-geo`: Donetsk and Makeevka apartments are ACTIVE; both cities are
  projected into menu and sitemap output.

The proof switches only injected profile and registry data. It fingerprints
`src/**` before and after both matrices and fails if product source changes.

## Covered pipeline

1. Site Profile validation and geo-switcher state.
2. Typed URL grammar build/parse round trips.
3. Route status and indexability resolution.
4. Menu projection from active profile entries.
5. Registry-owned sitemap projection and XML parsing.

## Merge-risk integration

`verify:two-profile` is part of the root `verify` command, which is invoked by
the manual `merge-risky` workflow. Live infrastructure and production data are
not needed for this proof.

## Approved-plan integrity

The APPROVED V4 master plan is intentionally unchanged: editing its section 35
would invalidate the exact hash imported into Task Manager. The section 35
closure delta is recorded in `RP12_DONE.md` instead.
