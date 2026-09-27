# CORE 5.5 CP-06 — Transport security implementation evidence

Date: 2026-09-27

Epic: `dc55-epic-73`

Branch: `codex/dc55-epic-73`

Risk: `RISKY`

Implementation checkpoint: `a1c5b95a00cd38fcb442868dd9efdcc77670ccc4`

## Implemented decision

- Nginx is the sole HSTS owner. Next.js no longer emits
  `Strict-Transport-Security`.
- Every tracked TLS server block declares one canonical value:
  `max-age=31536000; includeSubDomains`.
- `preload` is absent and guarded. Enabling or submitting it remains blocked by
  OD-04, a complete DNS/TLS inventory and explicit owner approval.
- The public CSP remains compatible with static rendering and ISR. It allows
  `unsafe-eval` only in development for React diagnostics; production public
  pages do not allow it.
- Payload Admin remains a separate noindex surface with an explicit
  compatibility exception for `unsafe-eval`. It is not inherited by public
  pages.
- Public nonce-CSP and experimental SRI were rejected in this stream because
  the installed Next.js contract would force dynamic rendering and disable the
  current ISR/static optimization model.

## Deterministic regression proof

`pnpm verify:transport-security` loads `next.config.ts` in both development and
production modes and asserts:

- zero application HSTS declarations;
- development public CSP contains the React compatibility exception;
- production public CSP excludes `unsafe-eval`;
- the Admin exception remains isolated;
- each tracked Nginx TLS block has exactly one canonical HSTS declaration;
- no tracked HSTS declaration contains `preload`.

The check is included in `pnpm verify:security-boundaries`.

## Local evidence

Passed on 2026-09-27:

- `pnpm install --offline --frozen-lockfile`;
- `pnpm verify:security-boundaries`;
- `pnpm verify:production-topology`;
- `pnpm typecheck`;
- `pnpm lint` — exit 0 with 28 pre-existing warnings and two infos outside
  this diff;
- `pnpm build` on Next.js 16.3.5 — static/ISR public routes remained static;
- `pnpm verify:daily` with the exact documented readiness expectation — pass;
  `required-host-allowlists-missing` and
  `client-storage-deployment-contract-missing` remain explicit fail-closed
  project blockers rather than being treated as CP-06 regressions;
- production `next start` response smoke for `/` and `/yurist/` — `200`, public
  CSP without `unsafe-eval`, no application HSTS;
- production `next start` response smoke for `/admin` — the separate Admin CSP
  was present and no application HSTS was present. The page returned `500`
  because this isolated worktree had no authorized PostgreSQL credentials; no
  database or secret access was attempted.

## Rollout and rollback

This branch changes repository contracts only. It does not change live Nginx,
DNS, certificates, HSTS preload state or production runtime.

For a later explicitly authorized release:

1. validate the exact deployed Nginx config with `nginx -t`;
2. apply the canonical HSTS declaration to apex, redirect and staging TLS
   blocks while deploying the matching application artifact;
3. confirm each HTTPS response has exactly one HSTS value and no `preload`;
4. smoke public pages, Admin login boundary and noindex headers.

Rollback is the previous immutable application image plus the immediately
preceding known-good Nginx config. Never roll back only one of the two layers if
that would restore duplicate application/edge HSTS.

## Residual risk

- `unsafe-inline` remains a documented public static-CSP exception.
- Payload Admin retains `unsafe-eval` until its production bundle is proven
  compatible with a stricter policy.
- Full-zone DNS/TLS inventory is not available; OD-04 remains open and no
  preload claim is made.
- Live header convergence requires a separate production release command.

The DB-required `pnpm verify:merge-risky` was not run against an invented local
database. It remains the SourceCraft exact-head RISKY gate responsibility, using
the authorized CI test database and the same documented readiness blockers.
