# EPIC-27 — Property Card System: verification

**Plan:** `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`
**Scope:** public property card DTO and canonical property URL contract

| Acceptance condition | Evidence | Verdict |
| --- | --- | --- |
| The card is category-aware. | `verify:property-card-system` verifies apartment, house and land cards resolve respectively to `/kvartiry/`, `/doma/` and `/uchastki/`. | PASS |
| The card preserves the factual locality and district. | The same executable matrix supplies published Public Gateway geography and asserts the DTO values are unchanged. | PASS |
| The card uses the category canonical URL, not a generic donor URL. | The executable matrix rejects the `/obekty/` prefix; `verify:url-grammar` passes 22 generated canonical round trips. | PASS |
| The public identity remains stable. | `verify:public-url-id` passes the stored `publicUrlId` lookup and canonical URL contract. | PASS |

## Scope review

- Diff adds only a test command, its executable regression matrix and the
  preflight/verification evidence.
- No Payload schema, database contents, routing compatibility, DNS, Secrets or
  production infrastructure is changed.
