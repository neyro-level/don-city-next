# EPIC-05 verification — docs consolidation and archive

Verified implementation checkpoint:
`07d1e895ec2059d5f4bccda51eeb9ce67c3a6e68`.

## Acceptance matrix

| Requirement | Evidence | Verdict |
|---|---|---|
| V4 is the only active master plan | real-tree docs guard discovers exactly the canonical V4 path | PASS |
| V3 is archived and superseded | exact archive path plus `Status: SUPERSEDED` assertion | PASS |
| SEO Passport and v2.2 are archived or absent | current-tree and Git path-history scans prove absence; archive index records it | PASS |
| Project docs reference, not duplicate, the registry | duplicate Wordstat/CSV registry signatures are rejected outside V4/archive | PASS |
| Drift prevention is executable | `quality:docs-sot` runs real-tree guard and negative self-tests | PASS |

## Checks

- `pnpm quality:docs-sot` — PASS.
- Duplicate active plan negative fixture — PASS (rejected).
- Unarchived SEO Passport negative fixture — PASS (rejected).
- Lost V3 `SUPERSEDED` marker negative fixture — PASS (rejected).
- Duplicate embedded registry negative fixture — PASS (rejected).
- `pnpm quality:architecture` — PASS (429 modules, 1284 dependencies).
- `pnpm lint` — PASS with the existing 20 warnings outside EPIC-05 scope.
- `git diff --check` — PASS.

## Existing repository-policy limitation

The aggregate `pnpm quality:guards` reaches and passes the new docs guard plus
all preceding architecture guards, then stops at the pre-existing SourceCraft
policy baseline (`assert-exact-head.mjs`, two merge commands,
`DATABASE_URI_TEST`, one automatic trigger). EPIC-05 does not change CI policy;
the exact-head SourceCraft delivery gate remains authoritative for this PR.
