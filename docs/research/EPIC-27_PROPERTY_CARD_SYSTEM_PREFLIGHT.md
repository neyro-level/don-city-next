# EPIC-27 — Property Card System: preflight

**Plan:** `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`
**Mode:** implementation preparation; no production, database, DNS or secret write

## Source of Truth

- The approved master plan, EPIC-27, requires a category-aware property card,
  the factual locality and district, and the category canonical property URL.
- `src/project/url-grammar.ts` owns the category-to-path mapping and property
  URL construction.
- `src/core/data-access/public/catalog.ts` is the sole Public Gateway source
  for published property geography; `dto.ts` transforms that public record
  into the card contract.

## Entry conditions

- EPIC-12, EPIC-13 and RP-12 are already delivered in canonical `main`.
- EPIC-26 was merged as `a40473a953561bf0983f62a58b8b255128898ba4`; the new
  implementation branch starts from that revision.
- This epic has no external data, owner or infrastructure prerequisite. It
  verifies the public DTO and URL contract only.

## Baseline findings

- `toPropertyCardDTO` calls `buildPropertyUrl` with the stored category,
  semantic slug and `publicUrlId`; it does not construct a donor URL.
- The Public Gateway resolves published city and district relations before
  building a public property record, and the DTO exposes those values on the
  card.
- The missing-data fallbacks are neutral public text, not a substitute city,
  district or donor link.

## Minimal implementation scope

1. Add an executable regression check for apartment, house and land cards.
2. Prove the returned `href` is the category canonical path and rejects the
   legacy generic `/obekty/` shape.
3. Prove city and district on a card remain the factual Public Gateway values.

## Boundaries

- Do not add a generic compatibility route, public data fallback or SEO URL.
- Do not read or write production Payload data, migrate schema, mutate DNS or
  modify Secret Master.
