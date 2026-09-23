# EPIC-02 — Client Activation Preflight

Status: PASS — implementation may start in the registered epic worktree.

## Authority and entry evidence

- Master plan: `AMS-DON-CITY-FINAL-V3-GEO-DISTRICT-SEO` v6, `APPROVED`.
- Exact master-plan SHA-256: `091d0e2a8592bac4504b5b6f925487fc2bc8c192f288eab7243c00aecbc8a396`.
- Parent EPIC-01 is merged on canonical `origin/main` at `1d0e229dc5db701acb4a9db5bd40248d9e48c63a`.
- Implementation branch: `codex/epic-02-client-activation`, created from that exact main commit.
- Starter provenance remains immutable: `integrator-p/ams-realty-baza-starter@ca1b884d43e808d17e1eb18b05bad70ea358dd1c`.

## Approved minimal scope

1. Change versioned product identity to `ДОН СИТИ` / `Дон Сити Next` as appropriate for the runtime and repository.
2. Set the already-approved production origin `https://doncity-home.ru`, locale `ru-RU` and currency `RUB` in the project-owned configuration.
3. Run the repository-pinned `clone:prepare` cleanup only after the identity has switched to client mode. Its allowlist removes starter-only evidence and demo deployment artifacts, keeps the platform core, guards, packages and starter provenance, and creates `docs/CLONE_PROVENANCE.md`.
4. Update the client clone verification contract so it tests DON CITY identity and does not make a server, DNS, database or secret change.

## Explicitly out of scope

- No SSH, Timeweb, database, DNS, object storage, Secret Master or production mutation.
- No migration, import, Payload bootstrap, data deletion, dependency upgrade or deployment.
- No final storage/database/allowlist/retention/legal/indexing decision: those require the read-only discovery and owner-backed evidence in later approved epics.
- No UI redesign or token recoloring; the one-time design intake is EPIC-16.

## Guard review

- Payload remains the only schema, auth and migration owner; Prisma is absent.
- `next.config.ts` retains CSP/security headers and public/admin boundaries.
- Public data boundaries, secret redaction, source-control policy and package/workspace contracts remain in scope for diff review.
- Client-readiness verification must remain intentionally blocked by unset infrastructure decisions rather than inventing fallback values.

## Acceptance mapping

| Required outcome | Planned observable proof |
|---|---|
| DON CITY identity/domain/locale/currency | exact config and metadata-focused checks |
| canonical cleanup | `pnpm clone:prepare` output and clone-provenance allowlist |
| retained core/guards/packages | changed-path review plus targeted contracts/typecheck/guard checks |
| no external impact | no server, DB, DNS or secret command is run in this epic |

## Stop conditions

Stop and record a scoped blocker if the approved plan/inventory drifts, a required change would require a production or irreversible external action, or a new owner decision is needed. None is present at preflight time.
