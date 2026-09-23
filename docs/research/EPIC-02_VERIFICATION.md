# EPIC-02 — Client Activation Verification

Status: PASS for the approved client-activation scope.

Verified head: `998f375e9d120edcae17d838ec33d15c39ef22b0`
Base main: `1d0e229dc5db701acb4a9db5bd40248d9e48c63a`

| Acceptance criterion | Evidence | Verdict |
|---|---|---|
| DON CITY identity, locale and currency are active | `site.config.ts` sets `ДОН СИТИ`, `ru-RU`, `RUB` and `projectKind: client`; the package name is `don-city-next` | PASS |
| Approved domain is recorded without a runtime/deployment change | `clientReadinessConfig.domain = "doncity-home.ru"`; `NEXT_PUBLIC_SERVER_URL` remains externally supplied and empty in Git | PASS |
| Canonical cleanup removes only starter-only material | `pnpm clone:prepare` produced `docs/CLONE_PROVENANCE.md`, preserved the exact starter SHA and removed nine allowlisted demo paths | PASS |
| Core, packages and security boundaries are retained | No `src/core/**` or `packages/**` path changed by EPIC-02; `pnpm verify:security-boundaries` passes against the client blueprint | PASS |
| Visible donor brand is removed from the active product surface | The public fixture logo and runtime site config now use `ДОН СИТИ`; the remaining donor strings occur only in shared package test fixtures and clone/negative-test guards | PASS |
| No external state changed | No server, DB, DNS, Secret Master, migration, import or production command was issued | PASS |

## Targeted commands

- `pnpm contracts:test` — PASS.
- `pnpm contracts:check` — PASS for base and journal contracts.
- `pnpm verify:clone-prepare` — PASS.
- `pnpm verify:client-readiness --mode=fixture-client` — PASS; this proves the validator, not live readiness.
- `pnpm verify:security-boundaries` — PASS, including outbound and secret guards.
- `pnpm typecheck` — PASS.
- `pnpm lint` — exit `0`; 19 pre-existing warnings in migrations/generated Payload types and starter CSS, none in the EPIC-02 diff.
- `git diff --check` — PASS.

## Known non-blocking limitation

`pnpm quality:guards` does not complete because the verified starter baseline already lacked `docs/guard-baseline.json`; the missing file is absent from both the EPIC-01 merged base and this Epic's changed paths. It is not fabricated here because that would establish an architectural baseline outside EPIC-02. The applicable direct security-boundary verifier passes. Establishing or reconciling the missing guard baseline is tracked as discovery for the appropriate later architecture/quality scope.

Client readiness and release checks intentionally remain unavailable: storage, database, host allowlists, retention, legal-content and indexing decisions have not been invented. They require later read-only Don City discovery and owner-backed evidence.
