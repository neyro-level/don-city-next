# EPIC-32 preflight — lawyer page

Status: PASS — bounded public-page implementation may start
Date: 2026-09-24
Scope: `dcv4-task-32-preflight`

## Task contract

- **Outcome:** `/yurist/` renders the approved LAW metadata and H1, contains a
  factual legal-service scope with a legal inquiry CTA, and passes
  `formKind="legal"` with the canonical source page.
- **In scope:** static-page composition, public DTO/UI context, approved SEO
  registry data and focused deterministic proof.
- **Out of scope:** child `/yurist/[service]/` routes, unverified legal
  guarantees or team claims, legal-document content, changing Payload schema,
  migrations, real-lead delivery, production, DNS and Secret Master.
- **Platform:** Realty catalog, `BUILD`; the same public marketing route and
  established public lead gateway are retained.
- **Risk:** STANDARD. `legal` must be added as a public form-context value and
  mapped by the client adapter to the established persisted `generic` lead
  type. This preserves the PII schema and requires no database change.

## Verified entry state

1. The approved LAW registry row already materializes the exact title,
   description, H1, canonical `/yurist/` and `index,follow` policy.
2. The static-route renderer currently composes `/yurist/` as a generic page,
   without service blocks or legal form context.
3. `LeadFormKind` supports seller UI context but not `legal`; the persisted
   Payload enum already accepts the safe generic intake category.
4. Product structure names `/yurist/` as the sole R1 legal-inquiry owner and
   forbids child service routes. Property-page legal CTA ownership remains
   EPIC-28 and is not pulled into this work.

## Implementation and proof

1. Extend the shared static-page composition for the exact `yurist` slug,
   keeping SEO title and H1 separate and using only factual service-scope copy
   derived from the approved LAW description.
2. Add public `formKind="legal"` and adapt it to the existing generic
   persisted intake value at the client boundary; do not add a Payload enum,
   migration or delivery branch.
3. Add focused assertions for exact LAW title/H1/canonical path, legal context,
   service sections and the absence of child-route composition. Run affected
   SEO, type and lead-contract checks.

## Stop conditions

- The requested page requires a verified claim about legal outcomes, actual
  lawyers, pricing or a service portfolio not present in the approved source.
- Legal UI context cannot be mapped through the established public intake
  boundary without a new persisted PII schema, migration or external delivery
  behaviour.
