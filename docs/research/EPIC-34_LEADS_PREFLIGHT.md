# EPIC-34 preflight — leads

Status: `PASS`

Date: `2026-09-25`

Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7 APPROVED`

## Canonical outcome

Reuse the existing protected starter lead engine and preserve a typed business
context for every submission: `category`, `district`, `city`, `property` and the
public `formKind`, including `legal`. Prepared future `mortgage` and
`development` context remains nullable and does not activate an R2 module.

## Entry conditions

- Task Manager reconciliation is CLEAN (`55/55`) and EPIC-34 is APPROVED.
- Parent epics 07, 31, 32, 33 and 65 are closed.
- The starter engine already owns validation, consent versioning, anti-spam,
  rate limiting, idempotency, retention, transactional outbox and delivery.
- Public routes already construct general, seller, legal and property contexts.
- The project is `DELIVERY_PROFILE=CRITICAL`; schema/PII work requires one
  exact-head RISKY gate before merge.

## Observed gap

The UI currently collapses public form kinds into four transport kinds before
submission (`legal` becomes `generic`, `sell` becomes `generic`). The intake and
Payload record preserve only that coarse transport kind and an optional property
id. Catalog category/district/city and future mortgage/development context are
not transported or persisted.

Graph navigation confirms the relevant boundary:

1. `LeadFormView` is reused by Home, catalog, property and marketing views.
2. The browser submits to `/api/public/leads`; this runtime fetch is not a static
   import edge, so the route-to-`submitPublicLead` boundary must be verified by
   source and executable contracts.
3. `submitPublicLead` delegates to the existing intake/outbox and Payload
   repository; this engine remains the only write path.

## Minimal implementation contract

- Extend the shared `LeadFormContext` with optional category, district, city,
  mortgage and development identifiers; keep property as the existing typed DTO.
- Submit the public `formKind` separately from the existing coarse delivery kind
  so `legal` is never lost while current channel routing stays compatible.
- Validate every context value with bounded allow-listed strings. Persist the
  context as nullable fields owned by the Leads collection; never log raw PII.
- Populate catalog context from the resolved query/identity, property context
  from the published DTO, and legal/seller/general context from static pages.
- Add one additive reversible Payload migration and regenerate Payload types.
- Keep future mortgage/development fields nullable; do not add public R2 routes,
  collections or fake relations.

## Verification contract

- Focused lead-context verifier covers general, seller, legal, catalog and
  property payloads plus nullable mortgage/development fields.
- Existing lead intake, outbox, delivery, security-boundary and legal-page
  contracts remain green.
- Typecheck, migration/static schema checks, architecture guard and exact diff
  review pass before the RISKY SourceCraft gate.

## Boundaries and stop conditions

No production database, production lead, PII, secret, outbound channel, DNS or
release action is needed. Local PostgreSQL is needed only if migration execution
cannot be proved statically; it must be a disposable project database. Stop on
source/inventory drift, an unsafe migration, or a requirement to activate an R2
mortgage/development product.

No owner or external prerequisite blocks implementation.
