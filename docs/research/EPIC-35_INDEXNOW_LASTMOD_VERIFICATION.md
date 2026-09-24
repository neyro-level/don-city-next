# EPIC-35 — IndexNow / lastmod: verification

**Plan:** `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`

| Acceptance condition | Evidence | Verdict |
| --- | --- | --- |
| IndexNow covers meaningful property lifecycle events. | `verify:sitemap-indexnow` builds payloads for publication, meaningful update, archive, removal and gone. | PASS |
| Canonical move submits exactly the proven historical and current URLs. | The verifier asserts old+new URL output and rejects an unowned current path. | PASS |
| Sitemap `lastmod` is meaningful. | Registry revision is fixed; `maxMeaningfulLastModified` takes the maximum supplied source timestamp, never request time. | PASS |
| Sitemap URLs remain canonical and grammar-owned. | `verify:sitemap-indexnow`, `verify:seo-contracts` and `verify:public-gateway` pass on the current main-derived head. | PASS |
| Deploy-wide spam is absent. | There is no transport/deploy hook; the event builder accepts only caller-provided affected paths. | PASS |

No IndexNow key was configured or read, and no external IndexNow request, DNS,
production or secret mutation was performed.
