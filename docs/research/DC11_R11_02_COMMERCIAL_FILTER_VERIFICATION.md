# DC10-R11-02 — commercial filter repair verification

Status: PASS

Verified implementation head: `d9de3023ca35777f43249432fca4ff5fb7f53aeb`

Verified: 2026-09-28

## Result

Both supported commercial catalog routes resolve to the same explicit query
boundary:

| Route | Route kind | `catalogQuery.category` | Verdict |
| --- | --- | --- | --- |
| `/donetsk/kommercheskaya/` | canonical category + geo | `commercial` | PASS |
| `/kommercheskaya/` | compatibility/root category | `commercial` | PASS |

The fix is limited to the existing category map. The downstream public catalog
already converts a defined category to an equality filter, so neither route can
fall through to mixed inventory after this change.

## Checks

- route resolver matrix — PASS;
- CP-02A scope — PASS;
- CP-02 SEO surface — PASS;
- public gateway — PASS;
- TypeScript typecheck — PASS;
- targeted Biome lint and Git diff check — PASS.

No schema, migration, persistent data, route publication, secret, production or
monitoring state changed.
