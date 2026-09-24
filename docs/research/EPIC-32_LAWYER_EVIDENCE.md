# EPIC-32 evidence — lawyer page

Status: ready for delivery review
Date: 2026-09-24
Base: `cbb9a399a6c24d5248b1a80bd84f401f94504189`

The approved requirement remains master-plan `EPIC-32`. This artifact links the
implementation and proof without creating a second service or SEO contract.

- **Canonical R1 owner:** only `/yurist/` receives the LAW static composition.
  Its SEO title, description, canonical URL and index policy come unchanged
  from the active registry; the approved H1 remains a separate route value.
- **Service scope:** three neutral blocks cover document checks, transaction
  support, inheritance and land questions. They make no promise about legal
  outcomes, pricing, a team, NAP or a service portfolio.
- **Lead boundary:** the page provides public `formKind="legal"` and canonical
  `sourcePage="/yurist/"`. The client boundary maps this UI context explicitly
  to the existing persisted `generic` intake type, leaving Payload schema,
  PII contract and external delivery behaviour unchanged.
- **Scope boundary:** no `/yurist/[service]/` route is created. The property
  legal-CTA block remains EPIC-28 ownership.

Changed paths are limited to the shared public form-context type, the explicit
client adapter, static composition, focused verifiers and EPIC-32 evidence
records. No database, migration, secret, DNS, server or production change is
included. Exact local proof and the non-production runtime limitation are in
`EPIC-32_LAWYER_VERIFICATION.md`.
