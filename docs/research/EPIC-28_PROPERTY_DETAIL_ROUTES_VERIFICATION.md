# EPIC-28 — Property Detail Routes: verification

**Plan:** `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`

| Acceptance condition | Evidence | Verdict |
| --- | --- | --- |
| Apartment, house and land use their category canonical detail paths. | `verify:property-detail-routes` resolves one factual property for each category and compares the canonical path. | PASS |
| A semantic mismatch produces one `301` to the public URL identified by `publicUrlId`. | The same verifier requests a mismatched semantic leaf and asserts the exact canonical destination. | PASS |
| Every property detail page exposes the legal CTA. | The composition passes project-owned `/yurist/` and `formKind=legal`; the UI renders the labelled, semantic CTA. | PASS |
| The legal CTA does not claim a completed document check. | The UI has no `documentCheckSummary` state or “объект проверен” copy. It renders neutral advice only. | PASS |
| Existing URL, lawyer-lead and module boundaries remain intact. | `verify:route-resolver`, `verify:lawyer-page`, TypeScript and architecture checks pass. | PASS |

No Payload schema, migration, production data, DNS or secret operation was run.
