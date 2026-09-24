# EPIC-31 preflight — seller page

Status: PASS — bounded public-page implementation may start
Date: 2026-09-24
Scope: `dcv4-task-31-preflight`

## Task contract

- **Outcome:** `/prodat-nedvizhimost/` renders the approved SELL metadata,
  one H1, a concrete seller proposition and a lead form with a seller-specific
  UI context.
- **In scope:** static page composition, public DTO/context, factual copy from
  the approved registry, and deterministic route/UI proof.
- **Out of scope:** inventing NAP, guarantees, prices or team claims; changing
  lead PII schema, applying a migration, external lead delivery, production,
  DNS or Secret Master.
- **Platform:** Realty catalog, `BUILD`; public commercial page over the
  existing public route and lead gateway.
- **Risk:** STANDARD for page composition. The existing lead intake maps UI
  `sell` to the established persisted `generic` type and retains
  `sourcePage=/prodat-nedvizhimost/`; no persistence contract changes.

## Verified entry state

1. The static route and its canonical SEO registry row already exist, but the
   generic route renderer supplies no seller sections and uses `general` lead
   context.
2. The contract UI supports `LeadFormKind="sell"`; its safe adapter maps it to
   the existing accepted public lead form type instead of expanding a PII
   schema.
3. The approved SELL title, description, H1, canonical URL and index policy
   are materialized in `src/project/seo-registry.generated.ts`.
4. The product structure requires a concrete offer, process/evidence available
   and seller CTA/form. No verified NAP or commercial promises are required.

## Implementation and proof

1. Compose the seller page through the same public route boundary, using the
   registry metadata unchanged and `sell` lead context.
2. Add only factual process sections matching the approved SELL description:
   assessment, preparation, showings/negotiation and legal accompaniment.
3. Prove metadata, canonical path, single H1, seller context and absence of
   dummy NAP with a focused fixture. Run relevant page/SEO/lead type checks.

## Stop conditions

- A required seller assertion needs unverified business data or an owner NAP
  decision.
- The page needs a new persisted lead type, schema migration or external
  delivery behaviour outside the existing public lead gateway.
