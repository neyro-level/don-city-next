# CORE 5.5 CP-07 — Documentation preflight

Date: 2026-09-27

Epic: `dc55-epic-74`

Branch: `codex/dc55-epic-74`

Base: `c8fe1a2077b46f66a933337a8950122f70c7864e` (`origin/main`)

Mode: `NORMALIZE`, repository documentation only

Gate: `STANDARD` unless the implementation changes env/runtime validation

## Entry state

- CP-01, CP-02A, CP-02, CP-04, CP-05 and CP-06 are delivered in canonical
  `main`.
- CP-03 has an isolated PostgreSQL baseline proof but remains blocked on owner
  decision OD-03. CP-07 must record that fail-closed state and must not
  manufacture missing atomic concurrency, backup, monitoring or allowlist
  evidence.
- Production remains live under the global noindex override. This stream does
  not change production, DNS, feeds, secrets, indexing or readiness flags.
- `AMS_PROFILE=REALTY_BASE` is factual in `.env.example`, `projectConfig` and
  the Zod runtime literal. No extended-profile trigger is currently proven.

## Source-of-truth mapping

| Contract | Current owner | CP-07 disposition |
|---|---|---|
| project/runtime profile | split across Architecture, Operations and config | create canonical `docs/PROJECT.md`; link, do not duplicate implementation detail |
| project design policy | `docs/06_DESIGN_SYSTEM.md` | move active unique meaning to `docs/DESIGN.md`; retain a superseded pointer and Git history |
| architecture/security/delivery | `docs/03_ARCHITECTURE.md` | keep authoritative; add project class and link the project/design contracts |
| operations/readiness | `docs/OPERATIONS.md` plus runtime evidence | keep authoritative; add missing Core 5.5 operating procedures without promoting flags |
| current work | `docs/04_BACKLOG.md` | replace the stale approval/import checklist with actual CP delivery state |
| release/indexing gates | `docs/05_RELEASE_CHECKLIST.md` | keep fail-closed; clarify Core 5.5 integrated-candidate prerequisites |
| program cursor | `docs/DELIVERY_STATE.yaml` | reconcile the stale pre-Developer cursor with delivered/open CP streams |
| document map | `docs/README.md` | map `PROJECT.md` and `DESIGN.md`; remove the obsolete v8 REVIEW claim |

`01_PRD.md` and `02_PRODUCT_STRUCTURE.md` already own product scope, URL/index,
pagination and title policy. CP-07 links those decisions from `PROJECT.md`
instead of copying the registry or requirements.

## Factual readiness baseline

| Area | State | Evidence owner |
|---|---|---|
| domain/deployment/managed PostgreSQL/S3 | configured | Architecture, Operations, `client-readiness.config.ts` |
| profile/cache mode | `REALTY_BASE`, `http` | `.env.example`, `project.config.ts`, `env.ts` |
| lead/archive retention | 100/100 days | approved staging evidence and readiness config |
| production indexing | `noindex` | release policy and live evidence |
| real feeds/channels/host allowlists | disabled / empty | readiness config and Operations |
| Nginx/automatic backup/external monitoring readiness flags | fail-closed `false` | readiness config; durable proof incomplete |
| first production owner | absent | release checklist |
| optional modules | `novostroyki`, `journal`, `agents` disabled | Architecture module governance |
| reserved CMS namespaces | `/novostroyki`, `/komplex`, `/journal` | `project.config.ts` and Pages hook |

## Implementation boundaries

1. Create the two Core 5.5 project documents and update only their direct maps
   and guards.
2. Preserve `06_DESIGN_SYSTEM.md` as a short `SUPERSEDED` history pointer; it
   must not remain a second active design contract.
3. Record every unknown as disabled, fail-closed, `TODO` or owner/external
   blocker. Do not set readiness booleans to true from observation alone.
4. Keep final SEO/URL/index/canonical decisions in Product Structure and keep
   numeric design values in `src/app/globals.css`.
5. Prove CMS reserved namespace rejection and disabled-module governance with
   existing deterministic guards; add only focused documentation regressions
   where the current guards cannot see the new canonical files.

## Stop conditions

Stop on a request to infer real integration hosts/channel IDs, expose secret
references as values, enable a module, change `AMS_PROFILE`, promote a readiness
flag, alter production/indexing, or present open CP-03 work as delivered.
