# DC10-R11-05 — HTTP policy verification

- Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13 `APPROVED`
- Epic: `EPIC-107` / `DC10-R11-05`
- Implementation SHA: `aaf36a3ea5668e69e3c1a2e3064e409b3943c073`
- Verification time: `2026-09-28T02:56:14+03:00`
- Delivery profile: `CRITICAL`
- Production, DNS, database and secrets: unchanged

## Result

The repository HTTP policy conforms to the approved scope:

- public `robots.txt` no longer emits the obsolete `Host` directive;
- the single root `Clean-param` directive includes `fbclid` alongside the
  existing campaign parameters;
- noindex mode remains a full robots disallow and retains global metadata and
  `X-Robots-Tag` behaviour;
- the sitemap index and shards remain canonical, read-only and fail closed for
  unavailable or unknown data;
- pagination keeps one clean redirect for `page=1`, a self-canonical
  `noindex,follow` response for valid page 2+, and rejects invalid, repeated or
  out-of-range values;
- property lifecycle responses remain `404` for unknown, `200` for
  active/archived, one semantic redirect, `308` for explicit replacement, and
  `410` with `noindex,follow` for purged entries without a replacement;
- canonical URLs continue to be resolver-owned absolute URLs on
  `https://doncity-home.ru`.

## Executed proof

| Check | Result |
| --- | --- |
| `pnpm verify:route-resolver` | PASS |
| `pnpm verify:sitemap-indexnow` | PASS |
| `pnpm verify:property-lifecycle-routes` | PASS |
| `pnpm verify:cp02-seo-surface` | PASS |
| `pnpm verify:indexing-policy` | PASS — 20 HTTP cases |
| `pnpm typecheck` | PASS |
| `git diff --check` | PASS |

## Read-only live edge observation

At the verification time, `https://www.doncity-home.ru/` returned one
`308 Permanent Redirect` with `Location: https://doncity-home.ru/`. This proves
the current one-hop mirror behaviour without changing DNS, Nginx or the
application host.

The live apex `robots.txt` was reachable with HTTP `200`, but it still belongs
to the pre-release production version. This verification does not claim that
the repository robots correction is deployed. Production remains a separate,
explicit final release stage.

## Scope and risk conclusion

The exact implementation diff changes only the robots policy and its bounded
regression assertions. It does not change proxy logic, sitemap data ownership,
persistence, infrastructure or production configuration. The delivery gate is
therefore `STANDARD`; the project-level delivery profile remains `CRITICAL`.
