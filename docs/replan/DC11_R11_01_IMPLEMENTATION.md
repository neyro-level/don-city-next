# DC10-R11-01 — geo relation repair implementation

## Implemented outcome

- Added Payload migration `20260928_003000_geo_relation_backfill`.
- Published active rows resolve `cityRaw` to exactly one canonical city.
- District matching is scoped to that resolved city; the approved Donetsk
  Textilshchik contained-label rule is preserved.
- Existing city or district relationships are never overwritten.
- Unknown or ambiguous city/district labels keep a null relationship and set
  `needsReview=true`.
- Existing `needsReview=true` is preserved because it may represent a non-geo
  review reason.

## Idempotency and rollback

The migration captures only rows it changes in
`_dc11_geo_relation_backfill_audit`. A repeated `up` cannot recapture or touch
those rows. `down` restores the prior city, district, review flag and timestamp,
then removes the audit table.

The required PostgreSQL integration suite now proves, on a non-empty fixture:

- known city and district mapping;
- city-scoped matching where the same district name exists in another city;
- Textilshchik contained-label mapping;
- unknown district and unknown city review behavior;
- preservation of an existing manual relationship;
- exclusion of an archived record;
- second-run idempotency;
- exact `up → down` restoration and audit-table cleanup.

## Safety boundary

This task changes repository code only. The migration was tested against an
isolated Windows-native PostgreSQL 18 test database. It has not been applied to
production; production rollout remains the mandatory final plan stage and
requires a separate owner command.

## Document impact

- Changed: migration registry, integration migration proof, package command,
  this implementation evidence.
- Reviewed without change: PRD, Product Structure, Architecture, Backlog,
  Release Checklist and Operations.
- CURRENT→TARGET: code now contains the repair; live production data remains
  unchanged until the final authorized release runs migrations.
