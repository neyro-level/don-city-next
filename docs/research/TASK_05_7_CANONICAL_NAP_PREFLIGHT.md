# TASK-05.7 — Canonical NAP preflight

Date: 2026-09-29

Mode: read-only public and repository verification

Status: `PASS` — the published values match the owner's durable canonical publication decision and the repository's single NAP source.

## Verified state

- The live homepage publishes a `RealEstateAgent` JSON-LD node whose brand, legal name, phone, email, address and canonical URL match the current repository candidate.
- The live node publishes the current textual opening-hours candidate and the canonical origin `https://doncity-home.ru`.
- `docs/research/EPIC-07_SITE_SETTINGS_NAP_PREFLIGHT.md` records the owner's exact approval of the canonical publication set before implementation: brand, legal name, phone, email, address, opening hours and canonical URL.
- The implemented single source in `src/project/site-settings.ts` matches that approval and feeds the public pages and `RealEstateAgent` JSON-LD.
- A Russian Guild of Realtors registry entry agrees on the brand and address but contains older/different contact values. It is secondary evidence and does not override the owner's explicit canonical publication decision.
- `geo` and `sameAs` remain omitted because they were not independently verified.

## Decision

The following canonical publication set is already confirmed by the owner and is therefore authoritative for this project:

1. brand and exact legal name;
2. phone and email;
3. full address;
4. opening hours;
5. canonical URL.

The existing public pages and `RealEstateAgent` JSON-LD match that confirmed set. A Yandex Business card was not independently found, but its absence does not invalidate the durable owner decision. Future external-directory corrections must be reconciled back to this single source rather than silently replacing it.

## Safety

- No public content, Payload data, legal document, DNS, server, Secret Master or production state was changed by this verification.
- Conflicting third-party values are retained as drift evidence and are not treated as an automatic replacement source.
