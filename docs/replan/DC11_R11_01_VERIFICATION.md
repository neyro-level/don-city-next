# DC10-R11-01 — verification

## Exact-head proof

Verification hardens the integration fixture with the redacted production
shape captured by DC10-R11-00: 12 active published records across five Donetsk
district labels in the observed `4 / 3 / 2 / 2 / 1` distribution.

On isolated PostgreSQL 18 the migration produces:

- `12/12` records linked to the canonical Donetsk city;
- `12/12` records linked to a district inside that city;
- the original four `needsReview=true` flags preserved;
- no overwrite of the separate existing-relationship fixture;
- unknown city/district fixtures left unlinked and marked for review;
- zero timestamp or data changes on the second `up` run;
- byte-equivalent selected relationship/review/timestamp state after `down`;
- removal of the migration audit table after rollback.

The required integration suite also applies the complete Payload migration
chain from zero, so migration registration and fresh-schema compatibility are
covered. TypeScript, focused geo-model checks, formatting and dependency rules
remain green.

## Evidence boundary

The production query was read-only and aggregate/redacted. The migration was
not applied to production, no secret or PII value is present here, and no live
outcome is claimed before the separately authorized final release.

## Document impact

- Changed: verification fixture and this evidence file.
- Reviewed without change: PRD, Product Structure, Architecture, Backlog,
  Release Checklist and Operations.
- The code outcome is verified; production data remains CURRENT and unchanged
  until the mandatory final production stage.
