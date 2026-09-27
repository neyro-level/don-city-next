# CORE 5.5 CP-06 preflight

Status: `READY_WITH_OWNER_GATE`

## Execution boundary

- Plan: `AMS-DON-CITY-CORE55-POSTPROD v9 APPROVED`.
- Epic: `EPIC-73 / CP-06 — TRANSPORT SECURITY DECISIONS`.
- Branch/worktree: `codex/dc55-epic-73` / isolated CP-06 worktree.
- Base: `cc28f70d12874f7bbcb0fe77f27da26c153b8063` (`origin/main`).
- Risk: `RISKY` for any runtime or header mutation.
- Production, DNS, certificates, HSTS preload submission, secrets and deployment
  are excluded. All live checks below were read-only.

## Current owners and confirmed drift

1. `next.config.ts` emits HSTS on every application response as
   `max-age=63072000; includeSubDomains; preload`.
2. production Nginx examples emit a second value,
   `max-age=31536000; includeSubDomains`; the `www` redirect block does not emit
   HSTS itself.
3. Live `https://doncity-home.ru/` currently returns both HSTS values. The HSTS
   preload service reports status `unknown` and rejects preloadability because
   the response has two HSTS headers.
4. Public CSP is static and contains `script-src 'self' 'unsafe-inline'` and
   `style-src 'self' 'unsafe-inline'`. Admin additionally allows
   `'unsafe-eval'`.
5. The public development runtime reports the expected React `eval()` CSP
   diagnostic because the public development policy does not add the
   development-only allowance described by the pinned Next documentation.

## Pinned-version nonce spike

Exact installed runtime is Next `16.3.5`, React `19.2.8`, Payload `3.90.1`.
The bundled official Next `16.3.5` CSP guide states that nonce CSP:

- requires a fresh nonce in Proxy for every request;
- requires dynamic rendering for all nonce-protected pages;
- disables static optimization and ISR and removes default CDN caching;
- is incompatible with Partial Prerendering;
- requires `'unsafe-eval'` only in development for React diagnostics.

DON CITY intentionally uses `revalidate = 3600` on the public layout and static
commercial pages and `unstable_cache` in the Public Gateway. Converting the
whole public site to per-request dynamic rendering would therefore be an
architecture/performance change, not a narrow header hardening.

Decision for CP-06: **reject a public nonce rollout in the current stream**.
Retain the documented static-CSP exception for public Next-rendered pages until
a separately measured dynamic-rendering or stable hash-CSP decision exists.
Experimental SRI is not adopted as a production control. The implementation may
separate development CSP behavior from production and add fail-closed regression
proof, but must not claim that `'unsafe-inline'` was removed.

## Inline surface inventory

- Next/React framework inline scripts and styles are the primary public reason
  for the static exception.
- Project-owned JSON-LD uses a safe serializer in
  `src/core/seo/structured-data.tsx`.
- Three project-owned JSX inline style objects were found; they contain visual
  values, not executable script content.
- No project-owned `next/script` or third-party analytics script is currently
  present in the public runtime.
- Payload Admin remains a separate policy surface; its production compatibility
  must be proven rather than inferred from the public site.

## HSTS and domain inventory

Read-only DNS/HTTPS checks on 2026-09-27:

| Host | DNS A | HTTPS | Observed HSTS |
|---|---|---|---|
| `doncity-home.ru` | `92.53.97.177` | `200` | two conflicting values, one with `preload` |
| `www.doncity-home.ru` | `92.53.97.177` | `308` to apex | no HSTS on redirect response |
| `staging.doncity-home.ru` | `92.53.97.177` | `200`, external noindex | application value with `preload` |

This is the complete **known project host** inventory, not proof of the full DNS
zone. Complete zone/certificate inventory still requires authorized provider or
server evidence. Therefore OD-04 remains open and no preload submission or
long-term preload commitment is authorized.

Safe implementation fallback:

1. make the TLS terminator (Nginx), not Next, the single HSTS owner;
2. use one non-preload value consistently in the tracked Nginx production,
   redirect and staging contracts;
3. add regression checks that reject application HSTS and conflicting duplicate
   values;
4. keep `preload` absent until the owner explicitly approves OD-04 after full
   domain/TLS inventory.

The implementation changes repository contracts only. Applying them to live
Nginx or production remains a separate explicit release action.

## Verification plan

- deterministic checks for exactly one declared HSTS owner and no tracked
  `preload` token;
- production-mode public and Payload Admin response CSP smoke from a local
  immutable build where possible;
- development-mode proof that React diagnostics do not require weakening the
  production CSP;
- public page interaction smoke, JSON-LD presence and absence of CSP violations
  caused by project-authored scripts;
- `verify:security-boundaries`, production-topology and relevant architecture
  guards;
- rollout/rollback notes for the later explicit Nginx release.

## Stop conditions

Stop on a public nonce change that forces dynamic rendering without measured
approval, an experimental SRI production dependency, a Payload Admin regression,
an HSTS preload token/submission, incomplete full-zone evidence presented as
complete, or any production/DNS/certificate/secret mutation.
