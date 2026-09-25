# EPIC-33 evidence — company, contacts and legal pages

Status: ready for delivery review
Date: 2026-09-25
Base: `e4ca3a2d0addf8977e6be078ca52c3da9d94b4cc`

The approved requirement remains master-plan `EPIC-33`. This artifact links
the owner decision, implementation and proof without creating a competing
legal, company or contact contract.

- **Legal operator:** the legal documents identify Individual Entrepreneur
  Plakhtienko Natalia Gennadievna and include the owner-approved INN, OGRNIP,
  registration date, legal address and e-mail. Registration facts live in the
  project company profile and remain outside the public NAP DTO.
- **Manager and founder:** the ABOUT page identifies Vladimir Sergeevich
  Plakhtienko only as manager and founder. The legal documents do not describe
  him as the operator and make no power-of-attorney claim.
- **Public NAP:** CONTACTS and shared navigation continue to consume the
  allow-listed `PublicNapDTO` from site settings. The office address, opening
  hours, telephone, e-mail and canonical site URL are not duplicated in UI
  components.
- **Legal routes:** the existing privacy-policy and personal-data-consent
  routes use the starter legal presentation with project-owned DON CITY text.
  The document content publishes the operator e-mail but not the telephone.
  Consent version `pd-2026-09-25` is shared by the rendered consent and lead
  context.
- **Result route:** `/spasibo/` remains `noindex,nofollow`, contains the next
  contact step and provides a safe action back to the home page.
- **Boundary:** no Payload schema, migration, secret, database, DNS, server or
  production state was changed. No independent legal-counsel attestation is
  claimed by this engineering evidence.

The exact implementation head, acceptance matrix, checks and fixture-safe
browser proof are recorded in
`EPIC-33_COMPANY_CONTACTS_LEGAL_VERIFICATION.md`.
