# EPIC-07 verification — Site Settings / NAP

Date: 2026-09-24  
Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST` v7  
Scope: `EPIC-07 — SITE SETTINGS / NAP`

## Acceptance evidence

| Requirement | Result | Evidence |
|---|---|---|
| One Payload `site-settings` Global | PASS | `payload.config.ts` registers `SiteSettings`; generated Payload types include `SiteSetting`; the generated migration creates the Global table. |
| One public NAP DTO | PASS | `PublicNapDTO` is exported from the frozen contracts package at version `1.2.0`; Public Gateway maps only its allow-listed fields. |
| `RealEstateAgent` consumes the same NAP | PASS | Home JSON-LD receives `getPublicNap()` and `buildRealEstateAgentJsonLd()` maps the same DTO. |
| Starter contact placeholders removed | PASS | Public shell and fixture provider receive shared NAP links; the source scan found no starter phone or email placeholder in `src/**` and `packages/**`. |
| Contacts surface uses the same NAP | PASS | Header, footer and `/kontakty/` composition receive the normalized DTO rather than literals. |
| Public data boundary is preserved | PASS | Global read is permitted only through the explicit Public Gateway context; no raw Global document crosses the DTO boundary. |

## Checks

- `pnpm payload:generate:types` — PASS.
- `pnpm typecheck` — PASS.
- `pnpm verify:site-settings` — PASS.
- `pnpm verify:seller-page` and `pnpm verify:lawyer-page` — PASS.
- `pnpm contracts:check` — PASS: base `1.2.0`, journal `0.1.0`.
- Targeted Biome lint and `git diff --check` — PASS.

## Limit

No isolated local PostgreSQL test database is configured in this worktree.
The migration was generated and type-checked but not applied. The managed
Timeweb database, DNS, Secret Master and production were not touched; runtime
migration rehearsal remains a later RISKY/release proof.

## Traceability

- Master-plan source: `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md#EPIC-07`.
- Contract decision: `docs/adr/ADR-0006-public-nap-contract.md`.
- Implementation checkpoint: `40221f4472ca0eadfef754adf8cc515fa9767998`.
- Verification checkpoint: `174bc6172a12366f6b1825782784471634d5ed7e`.
- No discovered follow-up task was required; the remaining database rehearsal is
  a pre-existing later RISKY/release proof, not a production action in EPIC-07.
