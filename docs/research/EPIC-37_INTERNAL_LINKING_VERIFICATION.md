# EPIC-37 — Internal linking verification

Status: PASS
Date: 2026-09-25
Task: `dcv4-task-37-verify`
Runtime base: `c77bafb31b26a41370271deaf3c512cee3bbedaa`

| Acceptance criterion | Result | Evidence |
| --- | --- | --- |
| Home → ALL/category | PASS | Profile/grammar-derived menu and home links; navigation crawl. |
| ALL → categories | PASS | ACTIVE R1 category links resolve exact canonical 200. |
| Category → district/facet/property | PASS | Gate-filtered context links plus server-rendered Public Gateway property cards. |
| Property → actual geo/district/category/lawyer | PASS | Property fixture resolves the exact four canonical targets. |
| No owned query equivalent | PASS | Crawl rejects `?`; room/facet canonicalization tests pass. |
| No 404/redirect/R2 target | PASS | Thirteen unique generated targets resolve exact canonical 200; profile/registry gates remain fail-closed. |

Executed: `verify:navigation`, `verify:navigation-shell`,
`verify:property-detail-routes`, `verify:route-resolver`,
`verify:public-gateway`, `quality:guards`, `typecheck`, and `git diff --check` —
all PASS.

No production or external mutation was performed.
