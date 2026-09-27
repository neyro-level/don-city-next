# DC11 R12-05 Verification — legal, consent and NAP

Status: `PASS`

Task: `dc11-task-112-verify`

Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13 (`APPROVED`)

Epic: `DC10-R12-05` / `EPIC-112`

Implementation candidate: `2981ad014d0e1617ca4024d97242121fb70f4308`

The verification commit and pushed exact head are bound by the task
`EXECUTION_LEDGER_V1`; this document intentionally does not claim production or
Merge Gate evidence.

## Acceptance matrix

| Criterion | Result | Observed evidence |
|---|---|---|
| Missing consent is rejected before persistence | PASS | `verify:lead-intake` covers omitted and false consent with `lead.consent_required`; diagnostics contain no submitted values. |
| Consent evidence has canonical names | PASS | `verify:legal-consent-contract` fixes request names and stored `consent.accepted/version/consentedAt`; caller-supplied time is ignored and server time is asserted. |
| Terms route is conditional | PASS | Runtime state is `ABSENT`; optional links resolve to an empty list, and `PUBLISHED` rejects both external and unregistered internal paths. |
| Managed contract PDF is conditional and safe | PASS | Runtime state is `ABSENT`; no file URL exists. Synthetic publication requires approval, non-empty media identity, PDF MIME/name and controlled `/api/media/file/*` path; unsafe external href is rejected. |
| Public shell exposes no absent resource | PASS | The actual shell DTO equals the canonical two-link privacy/consent set; terms/PDF are absent from footer output. |
| NAP behavior is factual | PASS | One runtime DTO owner remains unchanged; evidence status is explicitly `PENDING_EXTERNAL_VERIFICATION` with named required sources. No independent verification is claimed. |
| Analytics and diagnostics are privacy-safe | PASS | Browser unknown fields are dropped; server analytics rejects name/phone/email/address/message/comment/contact-shaped dimensions; lead diagnostics stay redacted. |
| Platform boundaries remain intact | PASS | Payload remains the sole schema owner, Public DTO owns shell output, and Dependency Cruiser reports zero violations. |

## Regression proof

- `verify:lead-intake` — PASS.
- `verify:legal-consent-contract` — PASS.
- `verify:company-contacts-legal` — PASS.
- `verify:site-settings` — PASS.
- `verify:analytics` — PASS.
- `verify:lead-context` and `verify:lead-outbox` — PASS.
- `verify:public-gateway`, `verify:home-page` and
  `verify:property-card-system` — PASS.
- `typecheck` and frozen base/journal contract checks — PASS.
- `quality:architecture` — PASS, zero dependency violations.
- `quality:docs-sot`, targeted Biome and `git diff --check` — PASS.
- Task Manager `Validate` — PASS; `Reconcile` — CLEAN.

`verify:schema` was attempted but needs a configured local `DATABASE_URI`. No
field name/type, collection shape or migration changed, so a database was not
created solely to relabel that optional check. This limitation is recorded as
`NOT RUN`, not as PASS.

## External evidence limitation

Public search did not return a reliable independent DON CITY business-card
match, and direct page retrieval was unavailable through the research tool.
Consequently NAP values were not changed or reclassified. Owner confirmation
and Yandex Business evidence remain required before status can become verified.

## DOC IMPACT

- Product Structure owns the current public legal surface and NAP evidence
  state.
- Architecture owns server consent/evidence and fail-closed publication rules.
- Release Checklist keeps external NAP proof open and records terms/PDF absence.
- Delivery State advances only the current implementation pointer.
- Production, DNS, secrets, database data and managed media were not touched.
