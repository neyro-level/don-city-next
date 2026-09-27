# DC10-R12-02 — Verification evidence

Status: PASS

Implementation head: `3057069b6ad7f825f950959eaf02cefcd8a9ee44`

## Acceptance mapping

| Criterion | Result | Evidence |
| --- | --- | --- |
| Existing geo model owns nearby localities | PASS | `cities` was extended in place; no second collection or persistent database was added. |
| Donetsk is not used as a fallback for unknown locality | PASS | Existing unresolved feed behavior stays fail-closed, while nearby rows require an explicit primary-city relation. |
| Radius is no greater than 50 km | PASS | Hook calculation, database constraint and public read-time recalculation all enforce the boundary. |
| Coordinates are verified | PASS | Approval requires verification timestamps for both the nearby and primary locality. |
| Owner approval is explicit | PASS | Creating or changing approval evidence is restricted to the owner role; geometry changes require explicit re-verification and reapproval. |
| No route activation is implicit | PASS | The change adds no route, sitemap, menu, canonical or indexing entry and approves no nearby locality. |

## Executed proof

- `pnpm verify:integration:required` — PASS on isolated loopback PostgreSQL 18.
- `pnpm verify:agglomeration-model` — PASS for both sides of the 50 km boundary and missing evidence.
- `pnpm verify:geo-model` — PASS for resolver, nearby fixture and public gateway guards.
- `pnpm verify:public-gateway` — PASS.
- `pnpm verify:security-boundaries` — PASS.
- `pnpm typecheck` — PASS.
- `pnpm quality:architecture` — PASS with no dependency violations.
- Payload geo seed plus `pnpm verify:geo-runtime` — PASS on the isolated test database.
- `pnpm lint` — PASS with existing repository warnings and no changed-file errors.

## Migration proof

The integration fixture starts from the previous `cities` shape, applies the
migration, verifies safe defaults, rejects an approved distance above 50 km,
accepts a complete eligible approval, rolls back, and confirms that the original
rows remain present.

## Production boundary

No production, DNS, secret, persistent-data or route activation mutation was
performed. Production remains the final separately authorized stage of v13.
