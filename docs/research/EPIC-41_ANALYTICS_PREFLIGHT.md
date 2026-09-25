# EPIC-41 Analytics preflight

## Task Contract

- Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST` v7 APPROVED.
- Base: canonical SourceCraft `main` at `6fc3b913a9d2b420c3c570c0035a02646e8ac65b`.
- Worktree / branch: registered EPIC-41 worktree on `codex/epic-41-analytics`.
- Goal: materialize `all_property_view`, `category_catalog_view`, `district_view`, `facet_view`, `filter_apply`, `property_open` and lead lifecycle events without PII.
- In scope: a provider-neutral browser event queue, typed event allowlist, explicit page identity dimensions, catalog/filter/property instrumentation, lead-form lifecycle instrumentation, deterministic verification and evidence.
- Out of scope: analytics vendor selection, external scripts, cookies or user identifiers, production configuration, secrets, server writes and database/schema changes.
- Data owner: canonical route identity remains `PublicPageIdentityDTO`; analytics consumes it and does not create a second page-identity source.
- Privacy boundary: only event name, canonical `pageKey`, `geoSlug`, category, form kind, filter-key names and non-sensitive outcome codes may leave the component. Name, phone, message, free-text query, consent values and request payloads are forbidden.
- Risk: `RISKY` because instrumentation is adjacent to lead PII even though the approved payload is non-PII and no lead data path is changed.
- Checks: dedicated analytics verifier, typecheck, lint, architecture guard and exact-diff review; one exact-head RISKY SourceCraft gate before merge.

## Entry evidence

- Task Manager reconciliation is `CLEAN` for all 55/55 v7 epics; EPIC-41 preflight is the restored claimed task.
- All declared parent product dependencies are closed: Home, all-property and category catalogs, property detail, seller/lawyer flows, leads and RP-12 page identity.
- ADR-0005 already establishes `PublicPageIdentityDTO` as the shared canonical dimension for cache and analytics.
- Existing catalog and property views contain passive `data-analytics-*` markers but no runtime dispatcher; the lead form has no analytics code.
- No analytics provider, key or external endpoint is required to implement and verify the approved event contract.

## Safe fallback and stop conditions

Until a provider is selected, events stay in the same-page browser queue and are exposed through a local custom event. This is deterministic, testable and does not perform an external write. A later vendor adapter may consume the queue under a separate consent/provider task.

Stop if implementation would require a persistent identifier, PII field, external script, cookie decision, secret, production write or a new event outside the approved EPIC-41 family.
