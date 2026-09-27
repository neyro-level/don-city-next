# DC11 R12-05 Implementation — legal, consent and NAP

Status: `IMPLEMENTED; EXACT-HEAD VERIFICATION PENDING`

Task: `dc11-task-112-implement`

Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13 (`APPROVED`)

Epic: `DC10-R12-05` / `EPIC-112`

## Implemented outcome

- Missing or false consent now returns the dedicated safe
  `lead.consent_required` result before persistence; exact version matching
  remains mandatory and `consentedAt` remains server-owned.
- Request and Payload consent evidence names are declared once and the Payload
  collection consumes the canonical storage names.
- The public legal contract has explicit `ABSENT` states for terms and an
  optional managed PDF. The public footer consumes this contract, so absent
  resources produce no links or file URL. Unknown candidate paths remain 404.
- A future managed document must be owner-approved, PDF-only and delivered
  through the controlled media route. No file or terms content was created.
- Browser analytics continues to allowlist fields; server analytics now has
  explicit hostile-key coverage for name, phone, email, address, message,
  comment and contact shapes.
- NAP keeps one runtime DTO owner and now exposes only a truthful evidence
  status: `PENDING_EXTERNAL_VERIFICATION` with the required source names. No
  independent verification claim was made.

## Safety boundaries

Payload remains the only schema/auth owner. No collection or migration was
added, no public route was activated, and no database, secret, DNS, production
or external system was mutated. The failed public lookup did not provide an
independent DON CITY business-card match, so it was not used as evidence.

## DOC IMPACT

- `docs/02_PRODUCT_STRUCTURE.md`: current legal surface and conditional absence.
- `docs/03_ARCHITECTURE.md`: consent evidence, fail-closed legal publication and
  NAP evidence status.
- `docs/05_RELEASE_CHECKLIST.md`: absent unapproved terms/PDF contract recorded;
  external NAP verification remains open.
- `docs/DELIVERY_STATE.yaml`: active v13 epic/task pointer only.
- Owner: `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md#EPIC-112`.

Exact-head acceptance and final check outputs belong to the VERIFY task and are
not claimed by this implementation record.
