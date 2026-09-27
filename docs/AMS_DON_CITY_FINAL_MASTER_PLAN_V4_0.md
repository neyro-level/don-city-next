# AMS MASTER PLAN — DON CITY — CITY-FIRST REPLAN

Plan ID: AMS-DON-CITY-LIVE-CONFORMANCE
Version: v13
Status: APPROVED

**Replaces:** `AMS-DON-CITY-FINAL-V3-GEO-DISTRICT-SEO v6` / product contract `3.0.1`
**Superseded source SHA-256:** `091d0e2a8592bac4504b5b6f925487fc2bc8c192f288eab7243c00aecbc8a396`
**Product contract version:** `5.4.2-approved`
**Date:** `2026-09-27`
**Architect phase:** `APPROVAL_HANDOFF`
**Approved by:** `owner`
**Approved at:** `2026-09-27T21:09:12+03:00`
**Prior approved snapshot:** `v12`, approved by owner at `2026-09-27T18:48:27+03:00`
**Current revision input:** `OWNER-2026-09-27-V13-APPROVAL`
**Target repository path:** `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md`
**Project:** агентство недвижимости «ДОН СИТИ»
**Production domain:** `https://doncity-home.ru`
**Canonical Git:** SourceCraft primary
**GitHub:** optional one-way mirror only
**Starter:** `https://sourcecraft.dev/integrator-p/ams-realty-baza-starter`
**Verified starter mirror baseline:** `main@ca1b884d43e808d17e1eb18b05bad70ea358dd1c`
**Verified runtime:** Next.js `16.3.5`, React `19.2.8`, Payload CMS `3.90.1`, pnpm `11.5.1`, Tailwind CSS `4.x`
**Current platform baseline:** `AMS Realty Platform Core Standard 3.0 — Solo + AI`
**Target conformance:** `AMS Realty Platform Core Standard 5.5` + `AMS UI Core 5.0`; both canonical sources are present, current implementation remains `PARTIAL / REVIEW`
**Project profile:** `catalog`, mode `BUILD`
**Delivery profile:** `CRITICAL`
**Implementation delivery mode:** `MERGE_AFTER_GATE` is authorized for v13 implementation epics; production remains excluded and requires a separate explicit release command
**Task Manager state:** approved v12 remains imported as 106 managed nodes in the one existing store; approved v13 preserves the exact Plan ID, prefix and managed ID set and authorizes one non-destructive `Upgrade` acknowledging all 84 changed task contracts; no re-import or second store is allowed
**UI:** starter-based public UI foundation; Manrope; фирменный red accent → dark green через EPIC-16 token intake
**Secrets:** Secret Master / Infisical
**Infrastructure:** один существующий сервер DON CITY в Timeweb; точное размещение БД/storage/services определяется read-only discovery
**Current public product:** secondary sale; apartments, houses, land and commercial; Sell, Lawyer, About and Contacts
**Deferred:** новостройки/ЖК and mortgage remain `PREPARED_OFF` and non-indexable for 4–6 months until a separate owner-approved activation
**Production state:** owner declares `LIVE_PUBLIC`; read-only HTTP evidence on 2026-09-27 confirms homepage `200`, `robots=index, follow`, crawl-allowed `robots.txt` and sitemap publication; exact deployed SHA/image remains an evidence requirement

---

# ARCHITECT REVISION HISTORY

## 5.4.2 / v13 APPROVED — 2026-09-27

Revision input ID: `OWNER-2026-09-27-V13-APPROVAL`

- Owner decision: `План утверждён`.
- Approved exact snapshot: Plan ID `AMS-DON-CITY-LIVE-CONFORMANCE`, version `v13`, final-audit result `PASS`, blockers `0`.
- Authorized graph transition: canonical non-destructive `Upgrade` from v12 to v13 in the one existing Beads store, with the exact explicit set of all 84 changed task IDs. Managed IDs, topology, ownership and prior ledgers remain intact; re-import and a second store are forbidden.
- Authorized delivery policy: `MERGE_AFTER_GATE` for implementation epics after their required review and exact-head gate.
- Production is not authorized by plan approval. `DC11-PROD-FINAL` remains mandatory and last, has no autonomous task, and may run only after a separate explicit owner release command. No post-production monitoring stage may be created.

## 5.4.1 / v13 FINAL AUDIT — 2026-09-27

Revision input ID: `ARCHITECT-2026-09-27-V13-FINAL-AUDIT`

- Logic / completeness: `PASS`. The owner outcomes and 22 epics are unchanged; the repair changes execution semantics only. Production remains mandatory and last, has no autonomous task, and has no dependent work after it.
- Architecture / data / security: `PASS`. Payload-only ownership, Public Gateway/select/DTO, one persistent production database, disposable isolated proof, PII/secret boundaries and pre-release safeguards are unchanged. PREFLIGHT/VERIFY artifacts explicitly prohibit secret/PII values and production mutation.
- Dependencies / autonomy: `PASS`. Canonical draft validation reports coverage `22/22`, tasks `84`, cycles `0`; every non-production epic has exactly `PREFLIGHT → IMPLEMENT → VERIFY → DELIVERY`. Three W0 roots remain independent.
- Executability / evidence: `PASS`. All 21 PREFLIGHT and 21 VERIFY cards now allow the edit/test/commit/push actions required by `EXECUTION_LEDGER_V1`; each requires a meaningful non-empty durable diff appropriate to its stage. PREFLIGHT no longer claims final epic completion.
- Upgrade compatibility: `PASS`. v12 and v13 have identical 106 managed IDs; stable type, role, work kind, repository, parent, source anchor and planned dependencies show drift `0`. Exactly 84 task contracts change, so approval handoff must acknowledge all 84 task IDs in canonical `Upgrade`; no re-import or graph rebuild is allowed.
- Helper proof: global Task Manager helper `ec1db7728cda8656c88af96ffea191bae162e3d5` passed isolated cross-prefix SelfTest, repository and quick validators, SourceCraft `skill-risky` run `164`, PR `!85`, merge and exact GitHub mirror.
- Result: exact v13 is `READY_FOR_OWNER_APPROVAL`. Blockers `0`; unresolved major findings `0`; before-approval owner decisions `0`; Night Run Readiness `READY_WITH_LIMITS`. `Upgrade`, blocker closure and Developer resume remain forbidden until a new exact `План утверждён` / `План утвержден` for v13. Production remains separately forbidden.

## 5.4.0 / v13 REVIEW — 2026-09-27

Revision input ID: `OWNER-2026-09-27-V13-HELPER-AND-STAGE-CONTRACT`

- Owner instruction: `Исправляй helper и готовь v13`.
- Runtime evidence: v12 imported cleanly, but `TASK-100-PREFLIGHT` could not be completed honestly because every stage inherited the final epic outcome while `PREFLIGHT` allowed only `read/plan`; `CompleteImplementation` simultaneously requires a non-empty pushed Git diff and PASS evidence for every acceptance row.
- Helper evidence: the historical store prefix is `dcn`, while the approved collision-safe graph prefix is `dc11`. The original `BlockImplementation` could not create a child record across that boundary. The global helper was fixed, passed an isolated cross-prefix SelfTest and `SKILL RISKY` run `164`, merged through SourceCraft PR `!85`, and was mirrored exactly to GitHub at `ec1db7728cda8656c88af96ffea191bae162e3d5`.
- v13 repair: preserve Plan ID `AMS-DON-CITY-LIVE-CONFORMANCE`, prefix `dc11`, all 22 epic IDs and all 84 task IDs. Give `PREFLIGHT`, `IMPLEMENT`, `VERIFY` and `DELIVERY` distinct goals, acceptance and allowed actions that match their actual evidence/ledger requirements.
- Upgrade policy: v13 must use canonical `Upgrade` from v12 with the explicit changed-task set; it must not create another store, re-import a second graph, delete v12/v9 history or rewrite prior ledgers.
- Production remains mandatory and last, has no autonomous task, and is not authorized by this revision work.

## 5.3.2 / v12 APPROVED — 2026-09-27

Revision input ID: `OWNER-2026-09-27-V12-APPROVAL`

- Owner decision: `План утверждён`.
- Approved exact snapshot: Plan ID `AMS-DON-CITY-LIVE-CONFORMANCE`, version `v12`, final-audit result `PASS`, blockers `0`.
- Authorized delivery policy: `MERGE_AFTER_GATE` for implementation epics after their required review and exact-head gate.
- Handoff contract: generate the canonical schema-v2 inventory from this exact source, attach the one existing Task Manager store without copying it, then run `Validate → Init → Import → Reconcile` before Developer execution.
- Production is not authorized by plan approval. `DC11-PROD-FINAL` remains the mandatory last stage, has no autonomous task and may run only after a separate explicit owner release command. No post-production monitoring stage may be created.

## 5.3.1 / v12 FINAL AUDIT — 2026-09-27

Revision input ID: `ARCHITECT-2026-09-27-V12-FINAL-AUDIT`

- Trigger: owner approved the collision-safe v12 Plan ID, so the Architect regenerated the inventory and repeated all four final passes against the exact updated snapshot.
- Logic / completeness: `PASS`. All owner outcomes map to active epics; production is mandatory and last; real feed, future modules and unapproved production actions remain non-goals.
- Architecture / data / security: `PASS`. Payload-only ownership, Public Gateway/select/DTO, one persistent production DB, disposable isolated proof, PII/secret boundaries, migration recovery, one UI foundation and pre-release operational safeguards remain explicit.
- Dependencies / autonomy: `PASS`. Coverage `22/22`, tasks `84`, missing dependencies `0`, cycles `0`; three independent W0 roots; later owner gates are bypassable; production has no autonomous task and no dependent work after it.
- Executability / evidence: `PASS`. All implementation epics materialize preflight/implement/verify/delivery cards; delivery depends on sibling proof; repository identity, required checks, exact-head ledger, stop conditions and production isolation are present. Canonical `ValidateDraft` passed while the snapshot was `REVIEW`; the normative ready status remains intentionally non-importable until approval.
- Task Manager identity proof: the existing store contains `0` managed nodes for `AMS-DON-CITY-LIVE-CONFORMANCE`, while the 55 closed v9 nodes remain under their historical identity. The new graph can be imported without overwrite after approval.
- Accepted operational limit: the existing single stealth `.beads` store currently lives in another registered checkout. Before import, the handoff must attach that same store to the exact approved checkout or otherwise make the exact approved source and the existing single store co-resident; creating a second store is forbidden and any ambiguity stops the handoff.
- Result: exact v12 is `READY_FOR_OWNER_APPROVAL`. Blockers `0`; unresolved major findings `0`; before-approval owner decisions `0`; Night Run Readiness `READY_WITH_LIMITS`. `Validate`, Task Manager mutation/import/reconcile, Developer goal, merge and production remain forbidden until the owner sends exactly `План утверждён` or `План утвержден` for this snapshot.

## 5.3.0 / v12 REVIEW — 2026-09-27

Revision input ID: `OWNER-2026-09-27-V12-PLAN-ID`

- Owner decision: `Утверждаю новый Plan ID AMS-DON-CITY-LIVE-CONFORMANCE`.
- Accepted: v12 uses collision-safe Plan ID `AMS-DON-CITY-LIVE-CONFORMANCE` and retains Beads prefix `dc11`.
- Preserved: the v9 graph, its 55 closed managed nodes and all historical ledgers remain unchanged in the one existing stealth Task Manager store. No second `.beads` store and no destructive graph replacement are allowed.
- Resolved: `V11-B02` / `OD11-11`; canonical import can identify v12 independently from immutable v9 while Task Manager selection remains scoped by exact Plan ID.
- Result: `v12 REVIEW`; inventory regeneration and the repeated four-pass final audit are required before `READY_FOR_OWNER_APPROVAL`.

## 5.2.1 / v11 FINAL AUDIT — 2026-09-27

Revision input ID: `ARCHITECT-2026-09-27-V11-FINAL-AUDIT`

- Trigger: owner explicitly said `Переходим к финальной проверке`; the four-pass final gate was run against exact v11 after canonical Secret Master and SourceCraft access were restored.
- Logic / completeness: `PASS`. Twenty-two active epics cover document convergence, operational readiness, production inventory, SEO/catalog/geo/legal/UI remediation, one exact-head documentation audit and one mandatory final production stage. Future modules, real feed and unapproved production actions remain outside scope.
- Architecture / data / security: `PASS`. Payload-only ownership, Public Gateway/select/DTO, one persistent production database, disposable isolated proof, PII/secret boundaries, migration recovery, one UI foundation and pre-release backup/jobs/availability readiness are explicit. Existing active-document drift is owned by `DC10-DOC-00` and is not presented as completed implementation.
- Dependencies / autonomy: the v11 draft graph itself `PASS`es with `22/22` epic coverage, `84` task cards, zero missing dependencies and zero cycles. Three independent W0 roots remain available; later locality/legal gates are bypassable; `DC11-PROD-FINAL` has no autonomous task and no dependent work after it.
- Executability / evidence: task-card structure, repository ownership, required checks, delivery fan-in, exact-head ledger and production isolation pass. Canonical `ValidateDraft` passes with Beads `1.2.2`.
- Blocking finding: the one existing stealth Task Manager contains `55` closed v9 managed nodes under the same Plan ID `AMS-DON-CITY-CORE55-POSTPROD`. The canonical helper intentionally rejects importing the changed v11 ID set over that graph. Creating a second `.beads` store would violate the single-store invariant, while destructive history replacement is not authorized.
- Architect recommendation: preserve the v9 graph and its ledgers as immutable history, keep the existing single Task Manager store, and assign v11 a new collision-safe Plan ID (recommended: `AMS-DON-CITY-LIVE-CONFORMANCE`) while retaining prefix `dc11`. Then regenerate inventory and repeat the exact final audit.
- Minor finding resolved during audit: §39 and header wording now identify the active snapshot as v11 rather than v10.
- Result: `v11 REVIEW`, `Night Run Readiness: NOT_READY`. Blockers `1`; unresolved major findings `0`; before-approval owner decisions `1`. No approval, import, reconciliation mutation or Developer handoff is allowed until `OD11-11` is decided and the final audit is repeated.

## 5.2.0 / v11 REVIEW — 2026-09-27

Revision input ID: `OWNER-2026-09-27-SIMPLE-FINAL-PRODUCTION-SECRET-MASTER`

- Source: owner instruction to simplify the program, make production the mandatory final stage, remove separate post-production monitoring work, prohibit secondary persistent databases and require all SourceCraft/password access through Secret Master.
- Accepted: implementation and documentation convergence complete first; one exact-head final documentation audit follows; one mandatory production release is the last plan stage. The release itself includes rollout, bounded live smoke/crawl, exact deployed identity, rollback proof and factual document reconciliation. These are release acceptance, not a later monitoring program.
- Accepted with safety clarification: no new monitoring task or observation phase is created after production. Required backup/restore, jobs-owner, health and external availability readiness are established before release. Existing minimum production safeguards are not silently disabled during implementation; changing/removing an already required safeguard would require an explicit risk decision and cannot be hidden under simplification.
- Accepted database contract: exactly one persistent production Timeweb Managed PostgreSQL is canonical. No second persistent cloud, staging, shadow, mirror or parallel application database may be created. Schema/data proof uses disposable local native PostgreSQL/fixture or a temporary isolated restore contour that is not production, is not shared with production and is removed before final release. Staging must never connect to the production database for risky rehearsal.
- Accepted access contract: SourceCraft is the canonical Git service. Git HTTPS and SourceCraft REST credentials come only from Secret Master `git-services/prod/`, process-locally, without Git Credential Manager, local MCP token, another Secret Master project or manual chat copy as fallback. Server, database, registry and application credentials use their separately confirmed project-specific Secret Master scopes; Git credentials are never reused for them.
- Secret Master preflight: the dedicated `codex-cursor-ai` Universal Auth credential is active, the identity is an `Admin` member of the canonical `Git Services Project`, and local aliases `git-services` / `sourcecraft` resolve to that project. Names-only `git-services/prod/` access passed without value output; SourceCraft REST returned `200` for `integrator-p/don-city-next`, and Git PAT transport returned `main` without Git Credential Manager or another credential fallback. `V11-B01` is resolved.
- Superseded v10 structure: separate R1.1/R1.2 production releases and separate post-production reconciliation nodes are removed. R1.1 and R1.2 remain implementation groupings inside one program and converge into one final candidate.
- Result: `v11 REVIEW`; simplified draft inventory validation and the canonical Secret Master / SourceCraft preflight pass. The assembly blocker is cleared; final audit, approval, Task Manager mutation and Developer handoff still require their explicit gates.

## 5.1.1 / v10 FINAL AUDIT — 2026-09-27

Revision input ID: `ARCHITECT-2026-09-27-V10-FINAL-AUDIT`

- Trigger: owner instructed the Architect to continue, check the plan and prepare execution; this closes the v10 assembly round and starts the final gate, but is not the exact approval phrase.
- Logic/completeness: `PASS`. The owner packet is represented by 22 implementation/research/documentation epics and four isolated production-only epics. R1.1 and R1.2 have separate exact-head documentation audits and separate post-production reconciliation, preventing evidence reuse across different SHAs.
- Architecture/data/security: `PASS`. Payload-only ownership, Public Gateway/select/DTO, controlled migrations, actual-locality rules, persistent gate state, PII/secret boundaries, one UI foundation and production isolation remain explicit.
- Dependencies/autonomy: `PASS`. Draft inventory validation found `26/26` epic coverage, `88` task cards, zero missing anchors and zero dependency cycles. Three independent W0 roots exist; shared schema/registry/shell owners are serialized; a blocked locality/production task does not stop independent work.
- Executability/evidence/delivery: `PASS`. Every autonomous epic has preflight, implementation, verification and one delivery card; delivery depends on all sibling work. Task contracts include outcome, context, acceptance, checks, allowed actions, rollback/stop boundaries and exact-head ledger. `MERGE_AFTER_GATE` applies only after owner approval; production nodes remain `PR_ONLY`/owner-gated with no autonomous implementation cards.
- Promise/evidence: `PASS`. Domain, wired and live claims have distinct proof; HTTP/runtime/crawl evidence is required for live claims. Requested guards that do not yet exist are implementation work and are not reported as already run.
- Findings: blockers `0`; unresolved major `0`; before-approval owner decisions `0`; accepted limits `2` — later agglomeration/legal owner gates and historical v6 Beads records. Neither limit blocks W0 or other safe work.
- Night Run Readiness: `READY_WITH_LIMITS`. Later owner/production gates are intentionally isolated and bypassable while independent work remains.
- Draft graph proof: the final `REVIEW` snapshot passed canonical `ValidateDraft` with coverage `26/26`, epics `26`, tasks `88` and coverage mode `DETECTED`. After the status-only transition and this audit record, the generated inventory carries the exact `READY_FOR_OWNER_APPROVAL` source SHA-256; independent exact-source validation confirms hash match, 26 declared/detected anchors, 88 tasks, zero missing dependencies and zero cycles.
- Tooling limit: canonical `ValidateDraft` currently accepts only `DRAFT | REVIEW | APPROVED` and rejects the normative intermediate status `READY_FOR_OWNER_APPROVAL`. This does not authorize a workaround import. After approval, the exact `APPROVED` snapshot must pass canonical `Validate` before any Task Manager write.
- Result: exact v10 is `READY_FOR_OWNER_APPROVAL`. `Validate`, Task Manager writes, import/reconcile, Developer goal, merge and production remain forbidden until the owner sends exactly `План утверждён` or `План утвержден` for this snapshot.

## 5.1.0 / v10 REVIEW — 2026-09-27

Revision input ID: `OWNER-2026-09-27-FINAL-CONFORMANCE-DOCUMENTATION`

- Source: owner-provided file `AMS_DON_CITY_FINAL_CONFORMANCE_DOCUMENTATION_MASTER_PLAN_V4_0_2026-09-27.md`, SHA-256 `AA127C8AEAD4AE2D2C8E0CDC900D2A53FA2154C8397CB166E518737C7EF1C213`.
- Interpretation: the file is a revision packet and technical assignment for this canonical Master Plan, not a second project Source of Truth. Stable Plan ID remains `AMS-DON-CITY-CORE55-POSTPROD`.
- Accepted owner decisions: production indexing is public; current product is secondary sale with apartment, house, land and commercial categories; Sell/Lawyer/About/Contacts stay active; newbuild/ЖК and mortgage remain `PREPARED_OFF` for 4–6 months; one inventory gate uses `minActive=3`; previously indexed pages may use a persistent 30-day anti-flicker state; Donetsk keeps nine administrative districts and the Textilshchik SEO candidate; nearby settlements must retain their actual locality and may only join a Donetsk agglomeration through verified coordinates, radius and an owner whitelist.
- Accepted documentation contract: one fact has one owner document; active documents distinguish `CURRENT`, `TARGET`, `IMPLEMENTATION STATUS` and `PROOF`; historical evidence is not rewritten; documentation convergence starts before code remediation, travels with each implementation PR, is checked against the exact release candidate, and is reconciled again after live proof.
- Accepted delivery decomposition for assembly: `DOC-EPIC-00…03`, parallel operational hardening, R1.1 SEO/catalog hotfix, R1.2 geo/legal/UI conformance, and a separate owner-approved SEO research gate before agglomeration routes become public.
- Accepted UI/security direction: one canonical shell, no speculative public exports, project-local approved primitives, semantic heading hierarchy, page-specific compositions, one owner for each production security header, and no CSP downgrade merely to match an audit template.
- Live evidence: `https://doncity-home.ru/` returned `200` with `robots=index, follow`; `/robots.txt` returned `200`, allows crawl and points to the sitemap; `/sitemap.xml` returned `200`. The observed robots contract still contains `Host` and its `Clean-param` does not include `fbclid`, so R1.1 remediation remains factual rather than speculative.
- Current conflicts: v9 and active docs still contain `LIVE_NOINDEX`, indexing-pending, commercial-prepared and legacy Content Gate statements. Those claims are superseded by this owner packet for v10 assembly but must be rewritten with `CURRENT/TARGET` evidence before final audit; no unreleased code or unknown exact deploy identity may be presented as current fact.
- Later owner gates, not silently decided here: approved agglomeration/locality whitelist and public slug after SEO evidence; owner-approved legal copy and managed contract file; exact production rollout identity; any future newbuild/ЖК or mortgage activation.
- Task Manager: read-only check found Beads `1.2.2`; v9 reconciliation is `CLEAN` with `10/10` coverage and 55 managed nodes. This v10 source drift blocks further v9 claiming and does not authorize `Init`, `Import`, `Upgrade` or Developer handoff. Two legacy v6 tasks remain `in_progress` in the shared historical store and are preserved pending a dedicated reconciliation decision.
- Sections changed in this checkpoint: document metadata, revision history and active precedence/status contract. Full semantic integration into product, geo, SEO, documentation, UI, delivery and acceptance sections remains the current assembly round.
- Result: `v10 REVIEW`; final four-pass audit, `READY_FOR_OWNER_APPROVAL`, Task Manager mutation and implementation are not authorized.

## 5.0.1 / v9 FINAL AUDIT — 2026-09-27

Revision input ID: `ARCHITECT-2026-09-27-CORE55-FINAL-AUDIT`

- Source: explicit owner continuation after v8 assembly and normative Core 5.5/UI Core 5.0 integration.
- Logic finding accepted: the delivered v7 body still classified commercial real estate as R2 while OD-07/OD-08 and CP-02A place `/donetsk/kommercheskaya/` in the first-four-month launch scope. v9 makes §33D authoritative for the post-production program and marks the former EPIC-52 activation contract superseded.
- Dependency finding accepted: the approved/delivered v7 inventory cannot be reused for v9. A new plan-scoped `dc55` draft inventory covers active EPIC-67…EPIC-76; historical v7 nodes and ledgers remain immutable in the existing `.beads` store.
- Executability finding accepted: CP-00 is completed assembly evidence and is not re-imported as implementation work. CP-01…CP-08 receive autonomous task cards; CP-09 remains a production-only parent with no autonomous implementation task.
- External limit: the owner-authorized temporary SourceCraft PAT passed API and exact-SHA push in this session, but canonical Secret Master authentication must be rotated before a later session. Credential loss is a stop condition, not a reason to use another Git provider.
- Sections changed: metadata, historical/current precedence, commercial/newbuild scope, §33D dependency matrix/audit/readiness, active execution order and Task Manager inventory contract.
- Owner approval: exact phrase `план утвержден`, received `2026-09-27T01:03:39+03:00`; the owner then explicitly confirmed the collision-safe Plan ID `AMS-DON-CITY-CORE55-POSTPROD` at `2026-09-27T01:23:46+03:00` after canonical import detected the immutable v7 graph under the former identity.
- Result: four-pass audit and graph validation pass; exact v9 is `APPROVED`. Canonical `Validate → Init → Import → Reconcile` and a clean Developer handoff are now authorized; production, public indexing, real-feed activation and destructive/external actions remain outside this approval.

## 5.0.0 / v8 REVIEW — 2026-09-27

Revision input ID: `OWNER-2026-09-27-REALTY-CORE-5.5-UI-CORE-5.0`

- Source: owner-provided package `don-city-next — приведение к AMS REALTY CORE 5.5 + AMS UI CORE 5.0`.
- Targets: release-level indexing override, robots/sitemap, social metadata and structured data, lifecycle/pagination, media/performance, jobs/import/leads safety, transport security, UI drift and project readiness documentation.
- Accepted: the package is a new post-production hardening program on top of the delivered v7/V4 system; production remains live with global `noindex` only during remediation, real feed remains disabled until its own readiness gate, and all jobs/leads/schema/SQL/runtime changes are RISKY and staging-first.
- Accepted with adaptation: one branch/PR is created per independent stream, not per smallest checklist item; `verify:daily` is required once for the completed STANDARD stream before delivery, while RISKY streams use the relevant risk-specific checks plus integration proof. Public staging remains edge-level `noindex`; public-mode SEO behavior is proved in an isolated test/crawler contour that cannot become indexable to external bots.
- Already covered: current page policy already specifies pagination `page>=2 → noindex,follow + self-canonical`; production/staging topology, retention `100` days, global noindex, disabled real feed, Payload-only schema ownership and the existing Project Design System remain active Source of Truth.
- Rejected: mechanically setting `clientReadinessConfig` flags to `true` from observed infrastructure alone. Nginx, jobs-owner, backup, monitoring, feed and allowlist readiness change only with durable evidence and fail-closed verification.
- Owner clarification: the end state is a full production launch with public indexing enabled after the complete SEO/operations/readiness proof. This revision authorizes planning that launch, but the actual rollout still uses the explicit exact-SHA release gate. Real feed activation remains a separate decision.
- Owner scope decision: for the first four months after public indexing, the active/indexable business scope is secondary apartments, houses, land plots, commercial real estate and the legal department. Newbuild/ЖК remains disabled and non-indexable, excluded from sitemap/indexable navigation; its namespace stays reserved for a separate post-four-month decision.
- Needs owner: HSTS `preload` may change only after explicit confirmation that every applicable subdomain is permanently HTTPS-ready; raw-SQL deviations require either a supported Payload conditional operation or an approved ADR with atomicity proof.
- Evidence status: local code search and CP-00 targeted checks classify the named SEO/jobs/UI/readiness surfaces. The owner-provided Realty Core 5.5 is line-identical to the existing project copy (line-ending format only); the owner-provided UI Core 5.0 is now stored at the project root with SHA-256 `3A68E274674C1BB6D652843BE6963E9732EDEF4126D5B3A2DD0457F0D3B4B39A`. Current implementation is only partially conformant.
- Graph state: v7 remains immutable approved/delivered history. This v8 source drift is not imported into Beads; implementation claiming is blocked until final audit, exact owner approval and clean reconciliation.
- Sections changed: plan metadata, normative-source evidence, revision history, Source of Truth links and §33D hardening program.
- Result: assembly checkpoint `v8 REVIEW`; final four-pass audit, Task Manager import and Developer handoff are not authorized.

## 4.0.1 / v7 REVIEW — 2026-09-24

Revision input ID: `ARCHITECT-2026-09-24-V4-FINAL-AUDIT`

- Final audit covered logic/completeness, architecture/data/security, dependencies/autonomy and executability/evidence/delivery.
- Technical Task Manager anchors `EPIC-53…EPIC-65` map one-to-one to owner-facing `RP-00…RP-12`; this preserves exact RP naming while satisfying the canonical inventory validator.
- Replacement graph uses the same stealth Beads store but a new plan identity and prefix `dcv4`. The frozen V3 graph remains immutable historical evidence and is excluded from V4 claiming by plan label; no second task store is created.
- Seven already completed epics and four explicitly replaced epics remain documented but are excluded from the V4 execution inventory; their V3 nodes/ledgers stay immutable. Unfinished EPIC-08 branch remains preserved and can only be selectively absorbed by RP-05.
- Strict RP sequence is retained from the owner packet. It intentionally limits parallelism until RP-12; after that, the residual main line resumes by dependency waves.
- Result: `READY_WITH_LIMITS`, blockers `0`, unresolved major findings `0`, owner decisions before approval `0`. Import remains forbidden until the owner repeats the exact approval phrase for this v7 snapshot.

## v7 APPROVED — 2026-09-24

- Approval trigger: owner exact phrase `План утвержден`.
- Approved by: `owner` at `2026-09-24T11:15:46+03:00`.
- Approved scope: exact v7 city-first master plan, V4 inventory, `MERGE_AFTER_GATE` implementation policy and Developer handoff.
- Explicit exclusions: production rollout, DNS changes, secret mutations, destructive database actions and unplanned external writes.
- Handoff: validate exact source hash, import only the V4 plan-scoped graph into the existing stealth Beads store, reconcile `CLEAN`, then start Task Manager Developer.

## 4.0.0 REVIEW — 2026-09-24

Revision input ID: `OWNER-2026-09-24-CITY-FIRST-REPLAN`

- Source: owner-provided packet `AMS-DON-CITY-REPLAN-V4-CITY-FIRST`.
- Targets: city-first URL grammar, deterministic resolver, Platform/Project split, Site Profile, geo uniqueness, SEO registry owners, navigation, gateway/cache/analytics, sitemap/IndexNow and multi-geo proof.
- Accepted: `/{geo}/{category}/{sub}/` listing grammar with at most three segments; globally addressed properties without geo in path; one typed `buildUrl`/`parseUrl` source; status-driven categories/geographies; thirteen replan epics RP-00…RP-12 before the remaining main line; unchanged R1 scope, tiers, Content Gate §16A, `publicUrlId`, lifecycle, NAP, SourceCraft/production boundaries and R2 research-first contract.
- Accepted with adaptation: import-direction enforcement uses the repository's existing architecture guard/dependency tooling rather than introducing ESLint solely for `no-restricted-imports`; RP-12 means no product-code change when enabling a second city, while test fixtures and verification code remain in scope.
- Resolved by Architect: RP-01 does not create or approve its own master plan during Developer execution. This Architect revision materializes the plan first; RP-01 verifies Source-of-Truth alignment, ADRs, archive state and changelog in its own PR.
- Superseded execution: the v6 Task Manager graph is frozen on source drift. No old ready task may be claimed until exact V4 approval and replacement reconciliation.
- Preserved WIP: unfinished EPIC-08 branch is not merged or discarded; RP-05 must inventory and either absorb or supersede it from a fresh main-based stream.
- Owner decisions before approval: none introduced by the packet. Inflection values remain `ownerVerified=false` until content activation, as explicitly required.
- Sections changed: metadata, §§6–8, 16, 22–26, 28, 31–33C, replan epics, affected v3 epics, checklist and execution order.
- Result: assembly checkpoint `4.0.0 REVIEW`; final four-pass audit and Task Manager import are not yet authorized.

## v0 DRAFT — received basis

- Source: owner-provided master plan `3.0.1 FINAL`.
- Architect interpretation: исходный документ принят как basis, а не как автоматически утверждённый execution graph.
- Repository на момент получения отсутствовал; Task Manager store не был инициализирован.

## v1 REVIEW — 2026-09-23

Revision input ID: `OWNER-2026-09-23-START`

- Source: owner.
- Targets: SourceCraft repository, канон документов, dependency graph, Secret Master/server/database preflight, полное последовательное выполнение плана.
- Accepted: новый private SourceCraft repository `integrator-p/don-city-next`; Windows-native checkout; Realty Platform Core 3.0; Payload как единственный schema owner; `DELIVERY_PROFILE=CRITICAL`; отдельные implementation, production, post-launch и R2 boundaries; инфраструктурный discovery до любых server/DB writes.
- Rejected: считать полученный заголовок `FINAL` эквивалентом owner approval; использовать доступы AMS/Bastion/другого проекта по аналогии; печатать login/password/database URL; запускать production внутри implementation chain.
- Already covered: production только по отдельной owner-команде; SourceCraft primary; Timeweb + Managed PostgreSQL + S3; staging/noindex; exact-SHA delivery.
- Needs owner before approval: delivery mode `MERGE_AFTER_GATE` для implementation epics или default `PR_ONLY`.
- Deferred gates: точный legacy hosting/DB contour — до EPIC-03/06; production cutover — EPIC-48; Day-60 — EPIC-49; R2 activation — EPIC-50…52.
- Sections changed: metadata, Source of Truth contract, repository/infrastructure evidence, delivery boundaries, dependency waves, owner decisions and stop conditions.

## v2 REVIEW — 2026-09-23

Revision input ID: `OWNER-2026-09-23-STARTER-SERVER-ORDER`

- Source: owner.
- Targets: точный момент загрузки/установки SourceCraft starter и последующего подключения к Don City server/database.
- Accepted: starter является первым implementation baseline после approval; source repository и exact `main` SHA проверяются до копирования; starter остаётся read-only; application tree материализуется в отдельной ветке DON CITY; dependencies устанавливаются только по фактическому lockfile; server/database audit выполняется после baseline/client-activation contract и до зависимых data/infrastructure решений.
- Rejected: редактировать starter repository; копировать `.git`, secrets, build artifacts или `.beads`; подключаться к неизвестному server/DB target по чужому alias; запускать migration/import/write во время discovery.
- Already covered: EPIC-01 starter provenance, EPIC-03 inventory/NAP discovery, EPIC-06 infrastructure/Secret Master, production only by explicit owner command.
- Evidence: SourceCraft access PASS; starter `refs/heads/main` = `ca1b884d43e808d17e1eb18b05bad70ea358dd1c`.
- Sections changed: W0 sequence, critical path, external prerequisite register, EPIC-01/02/03/06 contracts.

## v3 REVIEW — 2026-09-23

Revision input ID: `OWNER-2026-09-23-STARTER-TRANSFORMATION-UI-PAGES`

- Source: owner.
- Targets: starter as implementation base, controlled UI preservation, strict DON CITY architecture/menu, completeness of every planned page, links/domain and exact Title/Description/H1.
- Accepted: starter is transformed in-place inside the DON CITY client repository after verified snapshot import; proven core/UI patterns may be reused; architecture, routes, menu, page roles and SEO ownership come only from this plan; every planned route/template receives a meaningful composition and deterministic acceptance; `/donetsk/kvartiry/` is the representative page before UI scaling.
- Rejected: redesigning every primitive without inventory; blind preservation of donor navigation/routes/content/brand; blank placeholder pages; one universal page builder; duplicated H1; stale donor domains/hrefs/canonicals; metadata inferred from visual copy instead of registry.
- Already covered: exact R1 menu §23; URL contract §7; route resolver §8; metadata registry §§24–25; Page/SEO epics 17–38; UI/accessibility QA EPIC-43; crawl EPIC-46.
- Owner decision: preserve reusable starter visual DNA where compatible, but DON CITY information architecture and menu have priority — `DECIDED`.
- Sections changed: UI transformation contract, page completeness gate, domain/link/metadata acceptance, EPIC-16/17/18 and UI scaling rules.

## v4 REVIEW — 2026-09-23

Revision input ID: `OWNER-2026-09-23-SINGLE-SERVER-DESIGN-DIRECTION`

- Source: owner.
- Targets: устранение ошибочного разделения на legacy/new server и ранняя фиксация визуального направления.
- Accepted: у DON CITY один существующий сервер в Timeweb; новый сервер не создавался и не планируется без отдельного owner decision; EPIC-03 обследует этот сервер и его БД read-only; production topology после discovery по умолчанию переиспользует подтверждённый сервер. Шрифт — Manrope с обязательной проверкой кириллицы; starter остаётся визуальной базой; фирменный красный accent переводится в тёмно-зелёную роль после token inventory и contrast proof.
- Rejected: считать текущий Timeweb server «старым» или только migration source; автоматически создавать второй instance; заранее выдумывать точные HEX до чтения starter token source; заменять красный цвет error/destructive states на зелёный.
- Already covered: starter inventory/disposition, one semantic token source, representative `/donetsk/kvartiry/` page, exact menu/routes/metadata/page gate.
- Owner decisions: single Timeweb server strategy — `DECIDED`; Manrope + starter-like theme + dark-green brand accent — `DECIDED`; exact dark-green palette — delegated to EPIC-16 verification within this direction.
- Sections changed: infrastructure metadata, EXT-01, OD-02, §33B visual direction, EPIC-03/06/16, Architecture and Project Design System.

## v5 REVIEW — 2026-09-23

Revision input ID: `OWNER-2026-09-23-MERGE-AFTER-GATE`

- Source: owner.
- Targets: закрытие последнего before-approval delivery decision.
- Accepted: `MERGE_AFTER_GATE` для EPIC-00…47 и R2 implementation EPIC-50…52. После полного diff review и одного risk-based exact-head SourceCraft gate Task Manager может выполнить merge без повторного owner-вопроса.
- Boundary: EPIC-48 production не разрешён этим решением и требует отдельной явной release-команды; EPIC-49 post-launch operations не входят в автономный merge scope.
- Rejected: direct push в `main`; автоматический CI на каждый push/PR; скрытый production rollout; повторные STANDARD+RISKY gates одного SHA.
- Owner decision: OD-01 — `DECIDED`.
- Open owner decisions before final audit: `0`.
- Sections changed: plan metadata, Owner Decision Register, delivery inventory policy and delivery state.

## v6 REVIEW — 2026-09-23

Revision input ID: `ARCHITECT-2026-09-23-FINAL-AUDIT-V5-TASK-GRAPH`

- Source: Architect final audit of exact v5 after owner approval trigger.
- Finding `F-01` — `BLOCKER`, resolved in this revision: v5 inventory contained only 53 epic nodes and zero implementation/delivery tasks. It passed coverage validation but could not produce a Developer ready queue and did not materialize §33A Common Epic Contract.
- Accepted remediation: each autonomous implementation epic receives five task cards — `PREFLIGHT`, `IMPLEMENT`, `VERIFY`, `EVIDENCE`, `DELIVERY`; cards inherit exact epic dependency, declare repository identity, scope, acceptance, required checks, allowed actions and stop conditions. Delivery depends on every sibling implementation card. EPIC-48 production and EPIC-49 post-launch remain non-autonomous and have no imported implementation tasks.
- Audit outcome for v5: `NOT_READY`; no Task Manager import and no Developer handoff performed for v5.
- Resulting state: v6 is a new reviewable snapshot. It requires a fresh final audit and owner approval before import.
- Sections changed: §33A task materialization, audit register, delivery inventory and state.

## Final audit v6 — 2026-09-23

- Trigger: owner exact approval phrase `План утвержден`.
- Logic / completeness: `PASS`; 53/53 canonical EPIC anchors are present, R1/R2/production boundaries are separated, page/URL/metadata/design/infra contracts remain covered.
- Architecture / data / security: `PASS`; Payload remains sole schema/auth/migration owner, Public Gateway/DTO boundary is preserved, PII/secrets/production writes are isolated, starter/server/DB discovery remains read-only until its dedicated tasks.
- Dependencies / autonomy: `PASS`; no cycle or missing dependency; one initial root `EPIC-00`; 51 autonomous epics have five ordered task cards and one delivery card each; EPIC-48/49 remain outside autonomous production authority.
- Executability / evidence / delivery: `PASS`; 255 implementation/delivery cards each include parent source instruction, scope, acceptance, required checks, repository identity, stop conditions and delivery policy. `MERGE_AFTER_GATE` applies to EPIC-00…47 and EPIC-50…52 only.
- Finding register: `F-01 RESOLVED`; blockers `0`, major findings `0`, owner decisions before approval `0`.
- Night Run Readiness: `READY_WITH_LIMITS` — server/DB/Secret Master discovery is an external read-only gate with fixture-safe fallback, and production remains an explicit later owner gate. It does not block starter baseline or independent safe work.
- Owner approval: v6 approved by owner on 2026-09-23; Task Manager import and Developer handoff are authorized for this exact snapshot. Production remains excluded.

## Final audit v7 — 2026-09-24

- Trigger: owner requested final verification after the city-first correction packet; this is an Architect audit, not approval of the changed snapshot.
- Logic / completeness: `PASS`; all 66 plan epics are accounted for: 55/55 executable anchors plus seven historical and four superseded sections. `EPIC-53…65` are the exact Task Manager aliases for `RP-00…12`; R1, R2, production and post-launch boundaries remain separated.
- Architecture / data / security: `PASS`; Payload remains the only schema/auth/migration owner, Public Gateway + DTO remains the public data boundary, Platform→Project direction is explicit, and secrets/PII/server/DNS/production writes remain outside this approval.
- Dependencies / autonomy: `PASS WITH LIMIT`; no missing reference or cycle in the draft inventory. The strict RP chain is intentional; the residual main line is blocked on RP-12 and then resumes by waves.
- Executability / evidence / delivery: `PASS`; active epics have task-level contracts, completed/superseded work remains in immutable V3 evidence rather than being replayed, and EPIC-48/49 have no autonomous production tasks.
- Replacement safety: `PASS`; V4 uses `dcv4` in the existing store. The frozen V3 `dcn` graph is historical, is not rewritten and cannot be claimed by the V4 plan-scoped helper.
- Finding register: blockers `0`, unresolved major findings `0`, accepted limits `1`, owner decisions before approval `0`.
- Night Run Readiness: `READY_WITH_LIMITS` — the first thirteen RP epics are serial; server/DB/Secret Master checks stay read-only; production, DNS and destructive migrations remain separate owner gates.
- Approval state: `APPROVED` by owner on `2026-09-24T11:15:46+03:00`; exact source/inventory validation and clean reconciliation are mandatory before Developer claim.

---

# 0. СТАТУС ДОКУМЕНТА И ЕДИНСТВЕННЫЙ SOURCE OF TRUTH

Этот Master Plan — canonical execution plan и детальный contract registry. Он содержит полный SEO/URL/data/delivery baseline и не дублируется вторым master plan.

Current execution precedence: delivered v7 sections remain historical contract
evidence. During v10 assembly, revision input
`OWNER-2026-09-27-FINAL-CONFORMANCE-DOCUMENTATION` and the v10 decisions recorded
above supersede older R1/R2, indexing and execution-order statements wherever
they conflict. The former §33D program remains historical v9 execution evidence;
it is not claimable after source drift. Commercial real estate is active now,
production indexing is public, and newbuild/ЖК plus mortgage remain
`PREPARED_OFF` for 4–6 months until a separate owner-approved activation.

Области Source of Truth разделены по AMS Product Development Standard 2.0:

```text
продукт и scope                 → docs/01_PRD.md
URL / pages / flows / SEO rules → docs/02_PRODUCT_STRUCTURE.md
stack / data / security / infra → docs/03_ARCHITECTURE.md
оперативный backlog             → docs/04_BACKLOG.md
release gate                    → docs/05_RELEASE_CHECKLIST.md
UI policy                       → docs/06_DESIGN_SYSTEM.md
детальный execution contract    → этот Master Plan
```

Канонические документы ссылаются на конкретные разделы Master Plan и не копируют реестры целиком. При конфликте зависимая разработка останавливается до устранения drift в профильном Source of Truth и Master Plan.

Запрещён второй активный документ, который дублирует URL map, Title/H1/Description, facet whitelist или district SEO registry.

Разрешены только data seeds:

```text
docs/seo/SEO_REGISTRY_SEED.csv
docs/seo/DISTRICT_REGISTRY_SEED.csv
```

Они являются импортными данными, а не параллельной документацией.

---

# 1. ОБЯЗАТЕЛЬНАЯ АРХИВАЦИЯ

```text
docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V3_0.md
→ docs/archive/AMS_DON_CITY_FINAL_MASTER_PLAN_V3_0_SUPERSEDED.md
```

Historical SEO Passport and Master Plan v2.2, if discovered by RP-00, are also
moved to `docs/archive/` and marked `SUPERSEDED` without copying their rules
into a second active document.

Единственный active master plan:

```text
docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md
```

---

# 2. CHANGELOG v3.0.1 → v4.0.0

1. Listing grammar is city-first: `/{geo}/{category}/{sub}/`, maximum three segments.
2. City hub owns general property intent; Home remains brand/agency/realtor.
3. Property and future R2 entities are globally addressed without geo in path.
4. Typed grammar becomes the only URL constructor and parser.
5. Deterministic resolver order and profile statuses replace route-specific defaults.
6. Platform/Project ownership forbids DON CITY literals in portable modules.
7. Site Profile owns geo mode, activation status, thresholds and facet whitelist.
8. City/district uniqueness and collision rules are explicit and city-scoped.
9. Registry IDs and all 50 Wordstat phrases are retained but remapped to V4 owners.
10. Nearby geo gets hub/category noindex routes; nearby districts remain absent in R1.
11. Menu, breadcrumbs, gateway, cache, analytics, sitemap and IndexNow consume grammar/geo identity.
12. RP-00…RP-12 run before any remaining main-line work and prove two profiles.
13. R1 scope, tiers, Content Gate §16A, `publicUrlId`, lifecycle, NAP,
    SourceCraft/production boundaries and R2 research-first remain unchanged.

---

# 3. АРХИТЕКТУРНЫЕ ИНВАРИАНТЫ

```text
Payload = schema owner
PostgreSQL = persistence
Next.js = public application
S3 = managed media

UI → DTO → Public Gateway → Payload

Geo × Category × District/Facet × Entity

1 intent → 1 canonical owner
query filter ≠ SEO landing
one Property → one category canonical URL
published slug → immutable by default
no speculative public modules
```

---

# 4. DELIVERED V7 RELEASE 1 PRODUCT SCOPE + CURRENT EXTENSION

```text
market = secondary
dealType = sale
category = apartment | house | land
```

Core 5.5 public-indexing target after CP-02A adds `commercial` at
`/donetsk/kommercheskaya/`, subject to real inventory/content gates.

Prepared-off:

```text
room
garage
newbuild
rent
cottage_village
journal
employees
```

Until CP-02A passes, commercial remains fail-closed in runtime. It is no longer
an R2 product decision; OD-07/OD-08 already place it in the initial indexed
scope once its factual gate passes.

---

# 5. GEO MODEL

```text
Region(shortName)
→ City(nameGenitive, nameLocative, preposition, agglomerationOf?, isPublished)
→ District / Microdistrict(parent?, inflection fields, isPublished)
```

Property:

```text
Property → Region → City → District?
         → districtRaw for unmatched source text
```

Prepared newbuild:

```text
Developer → Development → Region → City → District?
Property → Development?
```

Identity constraints:

- `cities.slug` is globally unique and may not collide with `RESERVED_ROOT`;
- `districts` uses composite identity `(city, slug)`, not a global slug;
- district slugs may not collide with any configured category or facet slug;
- facet slugs may not collide with categories;
- feed district matching is always scoped to the property's resolved city;
- Donetsk grammatical forms and region short name start with
  `ownerVerified=false` and cannot make a candidate indexable until verified.

---

# 6. SINGLE_GEO MODE

Launch mode: `SINGLE_GEO`, configured only through the typed Site Profile.

Meaning:

- `/{primaryGeo}/` is the indexable city hub and owns the general intent
  `недвижимость {город}`;
- global category roots remain `200 noindex,follow`, self-canonical, absent from
  sitemap and internal promotion;
- the geo switcher component exists but is hidden;
- other actual localities remain truthful data and may expose conditional
  noindex routes under §28/RP-08;
- enabling `MULTI_GEO` changes only profile/data/registry inputs and requires
  the RP-12 two-profile proof before activation.

---

# 7. URL CONTRACT — R1

```text
/
/{geo}/
/{geo}/{category}/
/{geo}/{category}/{district-or-facet}/

/{category}/
/{category}/{semantic}-{publicUrlId}/

/prodat-nedvizhimost/
/yurist/
/o-kompanii/
/kontakty/
/politika-konfidencialnosti/
/soglasie-na-obrabotku-personalnyh-dannyh/
/spasibo/
```

Canonical examples:

```text
/donetsk/
/donetsk/kvartiry/
/donetsk/kvartiry/tekstilshchik/
/donetsk/kvartiry/odnokomnatnye/
/kvartiry/kalininskiy-2-komnatnaya-1042/
```

Category roots in `SINGLE_GEO`: `200 noindex,follow`, self-canonical, not
sitemap. Property, and later R2 Development/Developer entities, are global:
their path contains no geo and does not change when the geo hierarchy changes.

All public paths, canonical URLs, sitemap URLs, JSON-LD URLs, IndexNow URLs,
breadcrumbs, menu links, cards and lead-email links are constructed only by
the typed grammar module from RP-04. Literal catalog paths outside that module
and its tests are forbidden.

V3 category-first listing URLs are not redirected unless RP-00 proves that a
specific URL was publicly reachable on production or an indexable staging
environment. Proven legacy URLs enter one explicit manifest and receive a
single `301`; invented compatibility redirects are forbidden.

Registry IDs do not change during the canonical move. Historical category-first
paths and mapping evidence live only in the archived V3 snapshot and the
explicit legacy manifest produced by RP-00 when public exposure is proven.

---

# 8. ROUTE RESOLUTION

Resolution is deterministic and ordered:

```text
1 segment  /{x}/
  static/service → category root → published geo → 404

2 segments /{geo}/{x}/
  category with ACTIVE in geoCategoryStatus[geo] → 404

2 segments /{category}/{x}/
  x matches /^[a-z0-9-]+-\d+$/ → property by publicUrlId → 404

3 segments /{geo}/{category}/{x}/
  district of that city → category facet whitelist → 404

4+ segments
  404
```

Status behavior:

```text
ACTIVE       → normal route contract
PREPARED_OFF → 404; absent from sitemap, menu and internal linking
NOINDEX_AUTO → conditional 200 noindex,follow only when its inventory rule passes
```

Property lookup uses `publicUrlId`. Semantic-prefix mismatch or wrong category
produces exactly one `301` to the grammar-owned canonical. One trailing-slash
normalization may produce `308`; redirect chains are forbidden. District×facet
combinations are forbidden.

Collision guard inputs:

```text
RESERVED_ROOT = every category slug, every static/service slug,
api, admin, media, _next, sitemap*, robots.txt, search, poisk,
zastroyshchiki, ipoteka, otzyvy, journal
```

---

# 9. DISTRICT ENTITY MODEL

Collection `districts` fields:

```text
name
slug
type = administrative_district | microdistrict
city
parent?          # nullable relationship → districts
sortOrder
preposition?
nameLocative?
isPublished
publishedAt?
seo?
```

Database uniqueness is `(city, slug)`. URL never depends on parent. Payload
hooks and deterministic CI guards enforce the collision rules from §§5/8.

---

# 10. ТЕКСТИЛЬЩИК — HARD CONTRACT

```text
name = Текстильщик
slug = tekstilshchik
type = microdistrict
parent = null
tier = P1
broad = 137
source = wordstat_v1
preposition = на
nameLocative = Текстильщике
```

Canonical:

```text
/donetsk/kvartiry/tekstilshchik/
```

If parent is later filled, URL remains unchanged.

Breadcrumb without parent:

```text
Главная → Квартиры в Донецке → Текстильщик
```

With parent:

```text
Главная → Квартиры в Донецке → Parent district → Текстильщик
```

Feed rule: `districtRaw` containing `Текстильщик` maps to this microdistrict. Unrecognized district remains `district=null`, creates `needsReview`, but property stays visible in general catalog.

Filter UI has separate groups `Районы` and `Микрорайоны`.

---

# 11. DONETSK DISTRICT REGISTRY

Administrative districts:

```text
Будённовский
Ворошиловский
Калининский
Киевский
Кировский
Куйбышевский
Ленинский
Петровский
Пролетарский
```

Microdistrict:

```text
Текстильщик
```

Exact inflection fields are verified before index activation.

---

# 12. APARTMENT DISTRICT SEO TIERS

| Slug | Type | Tier | broad | source |
|---|---|---:|---:|---|
| `kalininskiy` | administrative_district | P1 | 147 | wordstat_v1 |
| `voroshilovskiy` | administrative_district | P1 | 145 | wordstat_v1 |
| `tekstilshchik` | microdistrict | P1 | 137 | wordstat_v1 |
| `kirovskiy` | administrative_district | P1 | 116 | wordstat_v1 |
| `proletarskiy` | administrative_district | P1 | 115 | wordstat_v1 |
| `petrovskiy` | administrative_district | P2 | 97 | wordstat_v1 |
| `leninskiy` | administrative_district | P2 | 97 | wordstat_v1 |
| `budennovskiy` | administrative_district | TEST |  | fallback_no_wordstat |
| `kievskiy` | administrative_district | TEST |  | fallback_no_wordstat |
| `kuybyshevskiy` | administrative_district | TEST |  | fallback_no_wordstat |

Fallback broad remains null/empty.

---

# 13. HOUSE DISTRICT SEO TIERS

| Slug | Tier | broad | source |
|---|---:|---:|---|
| `kuybyshevskiy` | P2 | 70 | wordstat_v1 |
| `budennovskiy` | P2 | 68 | wordstat_v1 |
| `kirovskiy` | P2 | 67 | wordstat_v1 |
| `voroshilovskiy` | TEST |  | fallback_no_wordstat |
| `kalininskiy` | TEST |  | fallback_no_wordstat |
| `kievskiy` | TEST |  | fallback_no_wordstat |
| `proletarskiy` | TEST |  | fallback_no_wordstat |
| `petrovskiy` | TEST |  | fallback_no_wordstat |
| `leninskiy` | TEST |  | fallback_no_wordstat |

---

# 14. TIER / INDEXING RULE

Tier is determined by `broad` from `wordstat_v1`:

```text
P1   = broad >= 100
P2   = broad 50–99
TEST = no broad data, source=fallback_no_wordstat
```

Fixed `seoInventoryThreshold` values:

```text
P1   = activeObjects >= 5 + Content Gate (§16A)
P2   = activeObjects >= 5 + Content Gate (§16A)
TEST = activeObjects >= 10 + Content Gate (§16A)
```

P1 and P2 differ only by content-production priority in EPIC-38; their indexing threshold is the same.

If threshold or Content Gate is not passed:

```text
200
noindex,follow
not sitemap
```

Mandatory Day-60 review in EPIC-49 uses Yandex Webmaster actual data. No frequency fabrication.

---

# 15. R1 FACET REGISTRY

Apartments:

| Slug | Intent | Tier | broad | source |
|---|---|---:|---:|---|
| `odnokomnatnye` | 1-комнатные | P1 | 184 | wordstat_v1 |
| `dvuhkomnatnye` | 2-комнатные | P1 | 145 | wordstat_v1 |
| `trehkomnatnye` | 3-комнатные | P2 | 66 | wordstat_v1 |

Disabled in R1: `vtorichka` — duplicates secondary-only `/donetsk/kvartiry/`.

Houses:

| Slug | Intent | Tier | broad | source |
|---|---|---:|---:|---|
| `dachi` | дачи | TEST |  | fallback_no_wordstat |

Land:

| Slug | Intent | Tier | broad | source |
|---|---|---:|---:|---|
| `izhs` | ИЖС | TEST |  | fallback_no_wordstat |
| `snt` | СНТ | TEST |  | fallback_no_wordstat |

Commercial is a category owner, not an apartment/house facet. Its launch route
and content/inventory gate are owned by CP-02A; EPIC-52 is superseded.

---

# 16. FACET / DISTRICT ACTIVATION + QUERY CANONICAL

Tier thresholds are fixed in §14. Indexation additionally requires Content Gate (§16A).

If exactly one active approved facet is selected, UI navigates to the path URL. Query equivalent remains `noindex,follow` and canonical points to the active path facet. If no active path owner exists, canonical points to the clean category×geo page.

District query canonicalization:

```text
/donetsk/kvartiry/?district=kalininskiy
→ /donetsk/kvartiry/kalininskiy/
```

If the corresponding district page has passed threshold + Content Gate:

```text
UI/navigation → /donetsk/{category}/{district-slug}/
query variant robots = noindex,follow
query variant canonical = district path URL
```

If the district page has not passed Gate:

```text
query variant robots = noindex,follow
query variant canonical = /donetsk/{category}/
```

---

# 16A. CONTENT GATE — SINGLE SOURCE OF TRUTH

This section is the only normative definition of Content Gate. Other sections reference §16A and do not redefine it.

## Listing pages: geo / district / facet

A listing page passes Gate only when all conditions are true:

- `activeObjects` meets the tier threshold from §14;
- exact `Title`, `Description`, and `H1` are materialized in `docs/seo/SEO_REGISTRY_SEED.csv`;
- unique introductory text is at least 600 characters and is written specifically for this page, not produced by variable substitution into one generic template;
- for district/microdistrict pages, any context block contains only verified facts with `source + checkedAt`; no invented infrastructure;
- listing is server-rendered; property links exist in HTML without requiring JavaScript.

If Gate is not passed:

```text
200
noindex,follow
not sitemap
```

## Property detail

A property page passes Gate only when all are present:

- at least 3 photos stored in project-owned S3;
- price;
- area;
- factual geolocation;
- non-empty description.

If property Gate is not passed, the page remains `200 noindex,follow` and is excluded from sitemap, subject to lifecycle rules in §20.

## Computation / override

Gate status is computed automatically from data and registry state.

Manual override is allowed only for role:

```text
owner
```

Every owner override must be auditable.

---

# 17. PAGINATION

Page 2+ uses server-rendered HTML links, is `noindex,follow`, and self-canonical. Do not canonical page 2 to page 1. All property pages must be discoverable without JS filters/map/infinite scroll.

---

# 18. PROPERTY TAXONOMY

Single `properties` collection.

Delivered v7 categories: `apartment | house | land`.

Core 5.5 launch target after CP-02A: `apartment | house | land | commercial`.

Prepared-off until its CP-02A gate: `commercial`. Deferred: `room | garage`.

`market = secondary | newbuild`; `dealType = sale | rent`.

Current public predicate target: `secondary + sale + apartment/house/land/commercial + published`, with category-specific inventory/content gates.

Actual geo is used; no global hardcoded `city=Donetsk`.

House subtype:

```text
house | cottage | townhouse | dacha | part_of_house
```

Land:

```text
plotAreaSotka
landCategory
permittedUse
communications
```

Import accepts m²/sotka/hectare and normalizes to sotka; ambiguous values → needsReview.

---

# 19. PUBLIC URL ID / SLUG

Every property has stable numeric `publicUrlId` used for public lookup.

Slug:

```text
[semantic-part]-[publicUrlId]
```

Price is forbidden in slug.

Same `feedSource + externalId` must preserve same property and publicUrlId across ordinary relisting/reactivation.

Semantic mismatch → one 301 to computed canonical; no 404 solely because semantic prefix changed.

---

# 20. PROPERTY LIFECYCLE

```text
missing → 404
active → 200 index candidate
archived retained → 200 noindex,follow
purged + exact replacement → 301
purged no replacement → 410
```

Real HTTP proof required.

---

# 21. STARTER COMPATIBILITY

Actual donor route is `/obekty/[slug]`. DON CITY does not use it as canonical. After internal href migration, remove it if never public, or keep only as one-hop 301 compatibility route when needed.

---

# 22. HOME / ALL INTENT SPLIT

Home owns `агентство недвижимости`, `риэлтор`, brand. `/donetsk/` owns general property intent. Both are indexable with distinct exact metadata from the registry.

Menu `Вся недвижимость` points to `/donetsk/`.

This ownership is identical in `SINGLE_GEO` and `MULTI_GEO`: Home never
absorbs city-hub intent, and a geo hub never becomes a brand-home alias.

---

# 23. MENU — R1

```text
Недвижимость ▾
  Вся недвижимость → buildUrl(geoHub: donetsk)       → /donetsk/
  Квартиры → buildUrl(categoryGeo: kvartiry)         → /donetsk/kvartiry/
  Дома → buildUrl(categoryGeo: doma)                 → /donetsk/doma/
  Земельные участки → buildUrl(categoryGeo: uchastki) → /donetsk/uchastki/
Продать → /prodat-nedvizhimost/
Юрист → /yurist/
О компании → /o-kompanii/
Контакты → /kontakty/
```

Logo → `/`.

Menu entries are derived from Site Profile and include only categories with
`ACTIVE` status for `primaryGeo`. Commercial appears only after CP-02A makes
its factual category gate active. No links to newbuild, mortgage,
construction, journal or rent. The geo switcher is hidden when
`geoMode=SINGLE_GEO`.

Breadcrumb contracts:

```text
Главная → Недвижимость в Донецке → Квартиры → Текстильщик
Главная → Недвижимость в Донецке → Квартиры → {parent?} → Текстильщик
Главная → Недвижимость в {cityLocative} → Квартиры → {район} → {объект}
```

Optional district parent affects breadcrumbs only and never the canonical URL.

---

# 24. SEO-РЕЕСТР — STATIC / BASE PAGES

Registry IDs remain stable across the V3→V4 canonical move. The `url` column
is a materialized value computed by RP-04 grammar from row keys and verified by
`guard:registry-url`; it is not an independent source of truth.

| ID | URL | Type | Title | Description | H1 | Robots |
|---|---|---|---|---|---|---|
| HOME | `/` | static | Агентство недвижимости «ДОН СИТИ» в Донецке, ДНР | Агентство недвижимости «ДОН СИТИ» в Донецке: квартиры, дома и земельные участки. Подбор объектов, продажа и юридическое сопровождение сделок. | Агентство недвижимости «ДОН СИТИ» в Донецке | index,follow |
| ALL | `/donetsk/` | geo/all | Недвижимость в Донецке, ДНР: квартиры, дома, участки | Недвижимость в Донецке и ДНР: квартиры, дома и земельные участки. Актуальные объекты агентства «ДОН СИТИ» и помощь в безопасной сделке. | Недвижимость в Донецке, ДНР | index,follow |
| APT_ROOT | `/kvartiry/` | global category | Квартиры \| ДОН СИТИ | Каталог квартир агентства недвижимости «ДОН СИТИ». | Квартиры | noindex,follow |
| APT_GEO | `/donetsk/kvartiry/` | category×geo | Купить квартиру в Донецке, ДНР: цены и объявления | Квартиры на продажу в Донецке, ДНР: 1-, 2- и 3-комнатные варианты в разных районах. Подбор и сопровождение сделки в «ДОН СИТИ». | Квартиры на продажу в Донецке | index,follow |
| HOUSE_ROOT | `/doma/` | global category | Дома \| ДОН СИТИ | Каталог домов агентства недвижимости «ДОН СИТИ». | Дома | noindex,follow |
| HOUSE_GEO | `/donetsk/doma/` | category×geo | Купить дом в Донецке, ДНР: дома с участками | Дома на продажу в Донецке, ДНР: частные дома и дома с земельными участками. Подбор объекта и юридическое сопровождение сделки. | Дома на продажу в Донецке | index,follow |
| LAND_ROOT | `/uchastki/` | global category | Земельные участки \| ДОН СИТИ | Каталог земельных участков агентства недвижимости «ДОН СИТИ». | Земельные участки | noindex,follow |
| LAND_GEO | `/donetsk/uchastki/` | category×geo | Купить земельный участок в Донецке, ДНР | Земельные участки на продажу в Донецке и ДНР: земля под дом и строительство. Проверка документов и сопровождение сделки. | Земельные участки в Донецке и ДНР | index,follow |
| SELL | `/prodat-nedvizhimost/` | static | Продать недвижимость в Донецке, ДНР \| ДОН СИТИ | Поможем продать квартиру, дом или участок в Донецке: оценка, подготовка, показы, переговоры и юридическое сопровождение сделки. | Продать недвижимость в Донецке | index,follow |
| LAW | `/yurist/` | static | Юрист по недвижимости в Донецке, ДНР \| ДОН СИТИ | Юрист по недвижимости в Донецке: проверка документов, сопровождение купли-продажи, наследство, регистрация права и земельные вопросы. | Юрист по недвижимости в Донецке | index,follow |
| ABOUT | `/o-kompanii/` | static | О компании «ДОН СИТИ»: агентство недвижимости в Донецке | О компании «ДОН СИТИ»: агентство недвижимости в Донецке, команда, подход к проверке объектов и сопровождению сделок. | О компании «ДОН СИТИ» | index,follow |
| CONTACTS | `/kontakty/` | static | Контакты агентства недвижимости «ДОН СИТИ» в Донецке | Адрес, телефон и график работы агентства недвижимости «ДОН СИТИ» в Донецке. Запись на консультацию и встречу. | Контакты агентства «ДОН СИТИ» | index,follow |
| PRIVACY | `/politika-konfidencialnosti/` | legal | Политика конфиденциальности \| ДОН СИТИ | Политика обработки и защиты персональных данных пользователей сайта агентства недвижимости «ДОН СИТИ». | Политика конфиденциальности | noindex,follow |
| CONSENT | `/soglasie-na-obrabotku-personalnyh-dannyh/` | legal | Согласие на обработку персональных данных \| ДОН СИТИ | Согласие пользователя на обработку персональных данных агентством недвижимости «ДОН СИТИ». | Согласие на обработку персональных данных | noindex,follow |
| THANKS | `/spasibo/` | utility | Спасибо за обращение \| ДОН СИТИ | Заявка отправлена. Специалист агентства недвижимости «ДОН СИТИ» свяжется с вами. | Спасибо за обращение | noindex,nofollow |

---

# 25. SEO-РЕЕСТР — DISTRICT / FACET / PROPERTY TEMPLATES

District canonical: `/{geo}/{category}/{district-slug}/`.

Before `indexable=true`, rendered exact Title/Description/H1 is materialized into `SEO_REGISTRY_SEED.csv` from approved district grammar. URL never depends on parent.

`nameLocative` for administrative districts is the adjective in prepositional case, for example `Калининском`, `Будённовском`. Owner verifies grammar before `indexable=true` according to §11.

## Administrative district — apartments

```text
Title: Купить квартиру в {districtLocative} районе {cityGenitive}, {regionShort} | {brandName}
H1: Квартиры в {districtLocative} районе {cityGenitive}
Description: Квартиры на продажу в {districtLocative} районе {cityGenitive}, {regionShort}: актуальные объекты, фото и цены. Подбор и сопровождение сделки в «{brandName}».
```

## Administrative district — houses

```text
Title: Купить дом в {districtLocative} районе {cityGenitive}, {regionShort} | {brandName}
H1: Дома в {districtLocative} районе {cityGenitive}
```

## Microdistrict — apartments

```text
Title: Купить квартиру {districtPreposition} {districtLocative} {cityPreposition} {cityLocative}, {regionShort} | {brandName}
H1: Квартиры {districtPreposition} {districtLocative} {cityPreposition} {cityLocative}
```

Example for Textilshchik:

```text
Title: Купить квартиру на Текстильщике в Донецке, ДНР | ДОН СИТИ
H1: Квартиры на Текстильщике в Донецке
```

Room facets:

```text
/donetsk/kvartiry/odnokomnatnye/
Title: Купить однокомнатную квартиру в Донецке, ДНР
H1: Однокомнатные квартиры в Донецке

/donetsk/kvartiry/dvuhkomnatnye/
Title: Купить двухкомнатную квартиру в Донецке, ДНР
H1: Двухкомнатные квартиры в Донецке

/donetsk/kvartiry/trehkomnatnye/
Title: Купить трёхкомнатную квартиру в Донецке, ДНР
H1: Трёхкомнатные квартиры в Донецке
```

Descriptions: category-specific factual catalog description with DON CITY accompaniment; exact rendered strings live in SEO seed data generated from this Master Plan.

TEST facet candidates:

```text
/donetsk/doma/dachi/
/donetsk/uchastki/izhs/
/donetsk/uchastki/snt/
```

All have `broad=null`, `source=fallback_no_wordstat`, `TEST`, minimum 10 objects + Gate.

Property template:

```text
URL: category canonical
Title: {Название объекта} в {actualGeo}: цена, фото | ДОН СИТИ
Description: {Тип объекта}, {площадь}, {район/микрорайон если известен}. Цена {цена}. Фото, характеристики и консультация агентства недвижимости «ДОН СИТИ».
H1: {Название объекта}
```

Only factual values render; missing optional phrases are omitted.

---

# 26. SEO-РЕЕСТР — 50 WORDSTAT ФРАЗ

Source: SEO Passport DON CITY v1.0 / Yandex Wordstat. Frequencies are research evidence, not traffic forecasts.

| № | Query | broad | Final URL owner | Registry ID |
|---:|---|---:|---|---|
| 1 | квартиры в донецке днр | 4 996 | `/donetsk/kvartiry/` | APT_GEO |
| 2 | купить квартиру в донецке днр | 2 621 | `/donetsk/kvartiry/` | APT_GEO |
| 3 | купить дом в донецке днр | 1 523 | `/donetsk/doma/` | HOUSE_GEO |
| 4 | недвижимость днр донецк | 1 405 | `/donetsk/` | ALL |
| 5 | продажа квартир в донецке днр | 301 | `/donetsk/kvartiry/` | APT_GEO |
| 6 | агентство недвижимости донецк днр | 249 | `/` | HOME |
| 7 | квартиры в днр донецк недорого | 223 | `/donetsk/kvartiry/` | APT_GEO |
| 8 | однокомнатная квартира в донецке днр | 184 | `/donetsk/kvartiry/odnokomnatnye/` | APT_ROOM_1 |
| 9 | квартиры в калининском районе донецка днр | 147 | `/donetsk/kvartiry/kalininskiy/` | APT_DIST_KALIN |
| 10 | квартиры в донецке днр ворошиловский | 145 | `/donetsk/kvartiry/voroshilovskiy/` | APT_DIST_VOR |
| 11 | купить двухкомнатную квартиру в донецке днр | 145 | `/donetsk/kvartiry/dvuhkomnatnye/` | APT_ROOM_2 |
| 12 | квартиры в донецке днр текстильщик | 137 | `/donetsk/kvartiry/tekstilshchik/` | APT_MICRO_TEXT |
| 13 | квартиры в ворошиловском районе донецка днр | 135 | `/donetsk/kvartiry/voroshilovskiy/` | APT_DIST_VOR |
| 14 | 2 комнатная квартира в донецке днр | 123 | `/donetsk/kvartiry/dvuhkomnatnye/` | APT_ROOM_2 |
| 15 | продажа недвижимости донецк днр | 120 | `/donetsk/` | ALL |
| 16 | квартира в донецке днр кировский район | 116 | `/donetsk/kvartiry/kirovskiy/` | APT_DIST_KIR |
| 17 | купить однокомнатную квартиру в донецке днр | 115 | `/donetsk/kvartiry/odnokomnatnye/` | APT_ROOM_1 |
| 18 | квартира в пролетарском районе донецк днр | 115 | `/donetsk/kvartiry/proletarskiy/` | APT_DIST_PROL |
| 19 | купить квартиру в донецке днр калининский | 114 | `/donetsk/kvartiry/kalininskiy/` | APT_DIST_KALIN |
| 20 | купить квартиру в донецке днр текстильщик | 113 | `/donetsk/kvartiry/tekstilshchik/` | APT_MICRO_TEXT |
| 21 | куплю квартиру в донецке днр ворошиловский | 106 | `/donetsk/kvartiry/voroshilovskiy/` | APT_DIST_VOR |
| 22 | купить квартиру в донецке днр калининский район | 103 | `/donetsk/kvartiry/kalininskiy/` | APT_DIST_KALIN |
| 23 | купить квартиру в донецке днр недорого | 102 | `/donetsk/kvartiry/` | APT_GEO |
| 24 | земельный участок донецк днр | 101 | `/donetsk/uchastki/` | LAND_GEO |
| 25 | купить квартиру в донецке днр петровский | 97 | `/donetsk/kvartiry/petrovskiy/` | APT_DIST_PETR |
| 26 | квартира в ленинском районе донецк днр | 97 | `/donetsk/kvartiry/leninskiy/` | APT_DIST_LEN |
| 27 | купить квартиру в донецке днр ворошиловский район | 96 | `/donetsk/kvartiry/voroshilovskiy/` | APT_DIST_VOR |
| 28 | купить дом в донецке днр недорого | 88 | `/donetsk/doma/` | HOUSE_GEO |
| 29 | купить квартиру в донецке днр пролетарский | 86 | `/donetsk/kvartiry/proletarskiy/` | APT_DIST_PROL |
| 30 | купить участок в донецке днр | 84 | `/donetsk/uchastki/` | LAND_GEO |
| 31 | купить квартиру в донецке днр кировский район | 83 | `/donetsk/kvartiry/kirovskiy/` | APT_DIST_KIR |
| 32 | купить квартиру в донецке днр кировский | 83 | `/donetsk/kvartiry/kirovskiy/` | APT_DIST_KIR |
| 33 | купить 2 квартиру в донецке днр | 79 | `/donetsk/kvartiry/dvuhkomnatnye/` | APT_ROOM_2 |
| 34 | купить квартиру в донецке днр пролетарский район | 78 | `/donetsk/kvartiry/proletarskiy/` | APT_DIST_PROL |
| 35 | купить квартиру в петровском районе донецка днр | 77 | `/donetsk/kvartiry/petrovskiy/` | APT_DIST_PETR |
| 36 | сколько стоит квартира в донецке днр | 76 | `/donetsk/kvartiry/` | APT_GEO |
| 37 | купить квартиру в донецке днр вторичка | 72 | `/donetsk/kvartiry/` | APT_GEO |
| 38 | купить дом в донецке днр куйбышевский район | 70 | `/donetsk/doma/kuybyshevskiy/` | HOUSE_DIST_KUYB |
| 39 | купить 2 комнатную квартиру в донецке днр | 69 | `/donetsk/kvartiry/dvuhkomnatnye/` | APT_ROOM_2 |
| 40 | купить дом в донецке днр буденновский район | 68 | `/donetsk/doma/budennovskiy/` | HOUSE_DIST_BUD |
| 41 | продать квартиру в донецке днр | 68 | `/prodat-nedvizhimost/` | SELL |
| 42 | купить дом в донецке днр кировский | 67 | `/donetsk/doma/kirovskiy/` | HOUSE_DIST_KIR |
| 43 | купить квартиру в донецке днр 3 комнатную | 66 | `/donetsk/kvartiry/trehkomnatnye/` | APT_ROOM_3 |
| 44 | купить квартиру в донецке днр ленинский | 64 | `/donetsk/kvartiry/leninskiy/` | APT_DIST_LEN |
| 45 | купить 1 квартиру в донецке днр | 60 | `/donetsk/kvartiry/odnokomnatnye/` | APT_ROOM_1 |
| 46 | риэлтор донецк днр | 60 | `/` | HOME |
| 47 | купить квартиру в донецке днр ленинский район | 59 | `/donetsk/kvartiry/leninskiy/` | APT_DIST_LEN |
| 48 | купить недвижимость в донецке днр | 57 | `/donetsk/` | ALL |
| 49 | купить земельный участок в донецке днр | 47 | `/donetsk/uchastki/` | LAND_GEO |
| 50 | юрист по недвижимости донецк днр | 13 | `/yurist/` | LAW |

---

# 27. TOP-50 INTERPRETATION

```text
agency/realtor/brand → HOME
general property → /donetsk/
general apartments → /donetsk/kvartiry/
apartment district → district page
1/2/3 room → active room facet
secondary/vtorichka → /donetsk/kvartiry/
houses → /donetsk/doma/ or proven district page
land → /donetsk/uchastki/
seller → /prodat-nedvizhimost/
lawyer → /yurist/
```

No R1 page for `недорого` or price-question alone.

---

# 28. ROBOTS / CANONICAL / SITEMAP

Index candidates: Home, `/donetsk/`, Donetsk category pages, district/facet after Gate, active property pages, SELL, LAW, ABOUT, CONTACTS.

Noindex: category roots in SINGLE_GEO, below-threshold district/facet, query filters, nearby geo in R1, archived property, privacy/consent.

Nearby geo route contract for `geo != donetsk`:

```text
/{geo}/ exists only if geo.isPublished=true AND activeObjects(geo) >= 1
/{geo}/{category}/ exists only if geo.isPublished=true
  AND activeObjects(geo, category) >= 1
otherwise → 404
```

When it exists in R1:

```text
200
noindex,follow
not sitemap
not menu
```

Internal links to such geo pages are allowed only from property pages belonging to that geography. Indexation decision is deferred to EPIC-49 Day-60 + MULTI_GEO review.

Nearby-district pages are absent in R1: `/{nearby}/{category}/{district}/`
returns `404`. Actual object geography is never rewritten to the primary geo.

`/spasibo/` = noindex,nofollow.

Canonical = clean trailing-slash owner URL.

Logical sitemap owners are `static`, `geo`, `catalog`, `districts`, `facets`,
`kvartiry`, `doma`, `uchastki`. Every URL comes from RP-04 grammar. Sitemap
includes only published + canonical + indexable + Gate/threshold passed pages;
nearby geo and global category roots are excluded. Listing `lastmod` is the
maximum meaningful `updatedAt` of owned objects and registry content, never
current time on every request.

---

# 29. INDEXNOW / DUPLICATE LISTING / UNIQUE CONTENT

Implement IndexNow for new publication, meaningful update, archive/removal, canonical move and gone. Do not submit all URLs on every deploy.

Primary organic targets are category×geo, district, facet and service pages (`/prodat-nedvizhimost/`, `/yurist/`); property cards remain indexable where useful but may overlap marketplace listings.

Property may carry factual unique fields such as district context, verified infrastructure context, document-check summary, agency editorial summary and transaction/viewing notes. No invented facts.

---

# 30. NAP / REAL ESTATE AGENT / YANDEX

One NAP source: `site-settings`.

Same DTO feeds header, footer, contacts and `RealEstateAgent` JSON-LD. Before production owner verifies canonical Name/Address/Phone against Yandex Business.

Release checklist: Yandex Business NAP, Yandex Webmaster verification, region Donetsk configured, sitemap submitted, robots validated, IndexNow key configured.

---

# 31. SEO DATA SEEDS

Only allowed SEO data files:

`docs/seo/SEO_REGISTRY_SEED.csv` columns:

```text
registryId,pageType,category,geoSlug,districtSlug,facetSlug,url,title,description,h1,robots,tier,broad,source,minActiveObjects,contentGateRequired,status
```

`url` is computed from the other keys through `buildUrl` and is guarded for
exact equality. Registry IDs remain stable across the replan.

`docs/seo/DISTRICT_REGISTRY_SEED.csv` columns:

```text
name,slug,type,citySlug,parentSlug,preposition,nameLocative,apartmentTier,apartmentBroad,apartmentSource,houseTier,houseBroad,houseSource,isPublished
```

Fallback `broad` is blank, not zero.

District row identity is `(citySlug, slug)`; `citySlug` is mandatory.

Textilshchik row must encode parent empty/null, `на`, `Текстильщике`, P1, 137, wordstat_v1.

---

# 32. PAYLOAD CORE / ADDITIONS

Reuse starter: users, pages, properties, feeds/imports, leads/deliveries, media, redirects, Jobs, Gateways, Safe Outbound, lifecycle, cache, contracts, UI and guards.

Add R1: site-settings, regions, cities, districts; property relations `region`, `city`, `district`, `districtRaw`, `publicUrlId`; house/land taxonomy fields.

Commercial fields are activated only through CP-02A and its schema/profile
proof. Room, garage and newbuild development relation remain prepared-off.

## 32A. Platform / Project ownership

```text
src/platform/{grammar,resolver,geo,seo,catalog,gate,sitemap,indexnow}
src/project/{site.profile.ts,seo/,content/}
```

`src/platform/**` is portable and may not contain literals `donetsk`,
`Донецк`, `ДНР`, `ДОН СИТИ` or `doncity`. Project values arrive only through
typed inputs, Site Profile and data. Platform imports from Project are
forbidden by the existing architecture guard/dependency layer; the application
composition root may inject project inputs into platform modules. RP-02 records
portable modules in `docs/UPSTREAM_CANDIDATES.md`; upstream extraction itself
is outside R1.

## 32B. Site Profile

The typed `src/project/site.profile.ts` satisfies
`src/platform/profile/types.ts` and is the sole owner of launch-mode switches:

```ts
export const siteProfile = {
  geoMode: "SINGLE_GEO",
  primaryGeo: "donetsk",
  marketStatus: { secondary: "ACTIVE", newbuild: "PREPARED_OFF" },
  categoryStatus: {
    kvartiry: "ACTIVE",
    doma: "ACTIVE",
    uchastki: "ACTIVE",
    kommercheskaya: "PREPARED_OFF",
    komnaty: "PREPARED_OFF",
    garazhi: "PREPARED_OFF",
    novostroyki: "PREPARED_OFF",
    arenda: "PREPARED_OFF",
  },
  geoCategoryStatus: {
    donetsk: { kvartiry: "ACTIVE", doma: "ACTIVE", uchastki: "ACTIVE" },
  },
  defaultNearbyGeoStatus: "NOINDEX_AUTO",
  tiers: { P1: { minBroad: 100 }, P2: { minBroad: 50 } },
  inventoryThreshold: { P1: 5, P2: 5, TEST: 10 },
  facetWhitelist: {
    kvartiry: ["odnokomnatnye", "dvuhkomnatnye", "trehkomnatnye"],
    doma: ["dachi"],
    uchastki: ["izhs", "snt"],
  },
} as const satisfies SiteProfile;
```

Allowed status values are `ACTIVE | PREPARED_OFF | NOINDEX_AUTO`.
`PREPARED_OFF` means schema/import/DTO/tests may exist while every route remains
`404` and absent from sitemap/menu/linking. Thresholds, whitelist and activation
status may not be duplicated in resolver or UI code.

---

# 33. SOURCECRAFT DELIVERY CONTRACT

SourceCraft = canonical; GitHub optional one-way mirror.

Every implementation Epic: fresh main → branch/worktree → scoped work → targeted diagnostics → commit/push → PR. При `PR_ONLY` выполнение останавливается до merge-владельца; при утверждённом `MERGE_AFTER_GATE` выполняются review → один exact-head gate → merge → verify main → safe cleanup → next Epic.

One Epic = one PR.

Expected gates: `pnpm verify:merge-standard`; UI adds `pnpm verify:ui-core`; risky adds `pnpm verify:merge-risky` + `pnpm verify:schema`; final runs full verify/client-readiness/integration/UI. Exact script names and availability are verified against the starter in EPIC-01 before becoming executable acceptance.

Replan gate policy: RP-02…RP-07 require `verify:merge-risky` plus
`verify:schema`; RP-00, RP-01 and RP-08…RP-12 use
`verify:merge-standard` unless their exact diff triggers a higher risk class.

---

# 33A. TASK MANAGER EXECUTION CONTRACT — v2 REVIEW

## Repository evidence

```text
repository_key = don-city-next
canonical_remote = https://git.sourcecraft.dev/integrator-p/don-city-next.git
default_branch = main
repository_visibility = private
workspace = current Windows checkout
replan_base_main_sha = 8dfd7a6c8568a46dc9c0c7430e99c2e75ce9bcfd
```

Repository был создан пустым без automatic CI. SourceCraft API не материализовал initial README, поэтому единственный platform bootstrap commit создал `main`; дальнейшая работа идёт только через branch/worktree и PR.

## Program boundaries

```text
REPLAN         = RP-00…RP-12, mandatory before resumed main-line work
IMPLEMENTATION = EPIC-00…47
PRODUCTION     = EPIC-48, только exact owner release command
POST-LAUNCH    = EPIC-49, только после подтверждённого production cutover
R2             = EPIC-50…52, research-first; activation не смешивается с R1
```

Approval master plan не разрешает production, destructive migration, создание/изменение secret, DNS/firewall mutation или необратимое внешнее действие. Эти действия сохраняют отдельные stop conditions.

The prior V3 Beads graph remains historical execution evidence but becomes
non-claimable immediately on V4 source drift. After exact V4 approval,
reconciliation must preserve closed-task ledgers, retire/supersede obsolete
open cards, add RP cards and rewrite affected remaining contracts. A second
task store is forbidden.

## Common Epic Contract

Каждый implementation Epic при импорте в Task Manager декомпозируется минимум на:

1. contract/preflight task;
2. implementation tasks с минимальным blocking scope;
3. targeted verification task;
4. documentation/evidence task;
5. delivery task с `PR_ONLY` либо явно утверждённым `MERGE_AFTER_GATE`.

Для каждого Epic обязательны outcome, Source of Truth, scope in/out, entry/exit, dependencies, acceptance, verification, rollback/recovery и stop conditions. Фраза из краткого списка EPIC ниже является заголовком outcome, а не полной task card.

## Dependency taxonomy

- `HARD`: downstream технически невозможно начать до конкретного contract/output.
- `CONTRACT`: downstream открывается после freeze DTO/schema/route contract, не ждёт весь Epic.
- `SOFT`: рекомендуемый порядок без блокировки ready queue.
- `EXTERNAL`: credential, legacy hosting, feed, NAP, vendor, server, DB, DNS.
- `OWNER`: заранее определяемое решение владельца.
- `PRODUCTION`: отдельная release authorization.

## Delivery waves and critical path

| Wave | Epics | Entry / key dependency | Exit evidence | Parallel safety |
|---|---|---|---|---|
| WR Replan | RP-00…RP-12 | V3 graph frozen; current `main` known | city-first contracts, migrations, routes, registry, links, gateway, sitemap and two-profile proof | serial RP order; every epic begins from fresh main |
| W0 Governance / Discovery | 00–06 | repository exists; source plan V4 | canonical docs, installed starter baseline, inventory/NAP evidence, infra preflight | completed evidence is reused; no server mutation |
| W1 Data / Contracts | 07–15 | W0 contracts; actual inventory or explicit fixture fallback | Payload migrations, DTO freeze, gateways, SEO engine, resolver proofs | schema epics merge sequentially; UI consumers may start after contract freeze |
| W2 Public Product | 16–34 | route/DTO contracts frozen | R1 pages, catalogs, property lifecycle, legal/seller/NAP/leads | page epics parallel only after shared route/design contracts; leads/data sequential where shared |
| W3 Runtime / Quality | 35–44 | representative R1 flows wired | IndexNow, sitemap, feeds, cache, analytics, performance, UI/security evidence | independent audits/tests may run after exact shared head; no production writes |
| W4 Staging / Release Candidate | 45–47 | W3 P0/P1=0; infra target verified | staging proof, crawl, rehearsal, immutable RC and rollback point | migrations/import/auth remain sequential |
| W5 Production / Operations | 48–49 | explicit release command + exact approved main SHA | production cutover, live smoke, scheduled Day-60 evidence | production is serial and cannot be bypassed |
| W6 R2 Research / Activation | 50–52 | separate research evidence and owner-approved R2 contract | newbuild, mortgage and commercial outcomes as separate streams | research may parallelize; shared schema/routes merge sequentially |

Critical path for R1:

```text
RP-00 → RP-01 → RP-02 → RP-03 → RP-04 → RP-05 → RP-06
→ RP-07 → RP-08 → RP-09 → RP-10 → RP-11 → RP-12
→ remaining V4-adjusted main-line work

00 → 01 → 02 → 03
03 → 08/09 → 10/11 → 12 → 13 → 14 → 15
15 → 18 → 21…30 → 35/36/37/38/39/40
34 + 39 + 43 + 44 → 45 → 46 → 47
47 → [PRODUCTION OWNER GATE] → 48 → 49
```

Contract-first openings:

```text
07 NAP DTO freeze           → 17, 19, 31, 32, 33 may start
08 geo contract freeze      → 12, 22, 25, 30 may start
09 taxonomy freeze          → 12, 21, 24, 26 may start
10 publicUrlId contract     → 12, 28, 29, 35 may start
12 DTO freeze               → 13, 27 and page data integration may start
14 SEO state contract       → 18, 22, 23, 25, 26, 36, 38 may start
16 design tokens/components → independent page implementation may start
```

## External prerequisite register

### EXT-01 — Existing DON CITY Timeweb server / domain identity

- Evidence: EPIC-06 read-only proof identifies the one existing Timeweb app server,
  dedicated `DonCity Server/prod` Secret Master scope and a separate Timeweb
  Managed PostgreSQL 18 service in the same provider project.
- SSH: dedicated deploy identity and host fingerprint were verified without
  persisting values in Git.
- Database: current target was verified as an empty database during EPIC-03;
  authenticated private-network attachment remains an operations prerequisite,
  not a planning assumption.
- Domain: `https://doncity-home.ru` is the owner-confirmed production origin;
  DNS/cutover remains production-only.
- Fallback: continue local/staging implementation with sanitized fixtures;
  block only tasks that require private-network DB, DNS or production.
- Stop: any ambiguous target, cross-project credential, write without backup,
  or request to print password/full database URL.

### EXT-02 — Actual inventory / feed / NAP

- Preflight: obtain authoritative feed/source sample, category counts, geo/districtRaw values and owner-verified Name/Address/Phone.
- Fallback: synthetic fixtures may prove contracts but cannot activate production SEO pages or final lead/NAP flows.
- Stop: invented business data, invented Wordstat frequency or reassignment of unknown locality to Donetsk.

### EXT-03 — SourceCraft Task Manager prerequisites

- Evidence: Beads `bd 1.2.2` is available at canonical local fallback; store is not initialized.
- Rule: `ValidateDraft` allowed in REVIEW; `Init/Import` prohibited until exact `APPROVED` plan and clean inventory reconciliation.

### EXT-04 — SourceCraft starter acquisition

- Source: `https://sourcecraft.dev/integrator-p/ams-realty-baza-starter`.
- Verified ref: `refs/heads/main` = `ca1b884d43e808d17e1eb18b05bad70ea358dd1c` on 2026-09-23.
- Preflight: authenticate read-only; fetch/clone into an isolated reference directory or temporary worktree; verify exact commit, repository identity, license, lockfile, runtime files, package versions, migrations, routes, docs and SourceCraft workflow triggers.
- Materialization: import only tracked application tree into a fresh DON CITY branch/worktree; exclude `.git`, secrets, caches, build outputs and `.beads`; preserve and reconcile DON CITY canonical docs instead of overwriting them mechanically.
- Install: use the package manager/version declared by the fetched project; run frozen-lockfile dependency installation and only the baseline checks actually defined by `package.json`.
- Fallback: if exact SHA is unavailable or runtime/doc drift is material, stop EPIC-01 and record upstream evidence; do not silently use latest or upgrade packages.
- Stop: source identity/SHA mismatch, missing lockfile, secret material, automatic CI/deploy triggers, unresolved license or destructive bootstrap action.

## Owner Decision Register

### OD-01 — Delivery mode for implementation epics

- Decision: `MERGE_AFTER_GATE` разрешён для EPIC-00…47 и R2 implementation EPIC-50…52 после exact-plan approval.
- Execution: полный diff review → risk classification → один exact-head `STANDARD` или `RISKY` SourceCraft gate → merge без повторного owner-вопроса → verify canonical main → safe cleanup.
- Production: EPIC-48 всегда исключён и требует отдельной release-команды независимо от решения.
- Post-launch: EPIC-49 не получает автономных production/operations полномочий.
- Status: DECIDED by owner on 2026-09-23.

### OD-02 — Single DON CITY Timeweb server strategy

- Decision: существует один сервер DON CITY в Timeweb; он является единственным текущим hosting contour и предполагаемым production target после проверки пригодности.
- Constraint: новый server/instance, перенос БД, Managed PostgreSQL или S3 не создаются и не навязываются автоматически. Любое такое изменение требует evidence EPIC-03/06 и отдельного owner decision.
- Discovery: определить фактическое размещение БД, сервисы, backups и capacity read-only; не считать БД локальной или managed без доказательства.
- Status: DECIDED by owner on 2026-09-23.

## Stop conditions

- plan status не `APPROVED` или source SHA изменился после inventory;
- dependency cycle, неполное epic coverage или неизвестный repository identity;
- secret/server/database target неоднозначен;
- production/DNS/migration/write требует отдельного разрешения или recovery proof;
- R1 contract пытается активировать R2 route/module без research-first contract;
- exact-head gate отсутствует/неверифицирован для CRITICAL merge;
- единственная ready work требует owner/production action; независимая safe work исчерпана.

## Final-audit finding register

| ID | Severity | Evidence | Impact | Resolution | Status |
|---|---|---|---|---|---|
| F-01 | BLOCKER | v5 inventory: `53` epic nodes, `0` task nodes; Developer role can claim only implementation tasks | no autonomous ready queue; §33A Common Epic Contract not materialized | v6 inventory creates five task cards for each autonomous epic and one delivery task depending on all sibling tasks | RESOLVED in v6; re-audit required |
| F-V4-01 | BLOCKER | canonical validator detects only `EPIC-*` headings, while owner packet names `RP-00…RP-12` | V4 draft could not prove 66/66 heading coverage | assign technical anchors `EPIC-53…65` while retaining `RP-00…12` as exact owner-facing aliases | RESOLVED in v7 |
| F-V4-02 | BLOCKER | V3 already owns stable `dcn-*` IDs in the existing Beads store | reusing the prefix would collide or mutate historical ledgers | V4 uses plan-scoped prefix `dcv4`; V3 remains immutable in the same store and is excluded from V4 claims by plan label | RESOLVED in v7 |
| F-V4-03 | MAJOR | seven epics are merged and four are explicitly replaced by RP work | full replay would duplicate finished/superseded work | keep their sections as `HISTORICAL`/`SUPERSEDED`, exclude them from V4 executable anchors and retain their original V3 nodes/ledgers unchanged | RESOLVED in v7 |
| F-V4-04 | MAJOR | RP epics touch contracts also named in the remaining V3 main line | unclear ownership could cause duplicate edits | RP owns the city-first delta and freezes the new contract; later epics implement only residual product outcome not already proven by RP evidence | RESOLVED in v7 |
| F-V4-05 | LIMIT | owner packet mandates a strict thirteen-epic RP sequence | reduced parallelism until RP-12 | retain the sequence as an explicit temporary safety boundary; resume dependency waves afterward | ACCEPTED LIMIT |

## Inventory task materialization

Technical Task Manager anchors `EPIC-53…65` map to `RP-00…12`. For every
new RP epic and every unfinished/non-superseded implementation epic, the draft
inventory contains five task cards in this order:

```text
PREFLIGHT → IMPLEMENT → VERIFY → EVIDENCE → DELIVERY
```

Each card inherits the parent epic dependency; `DELIVERY` also depends on every sibling card. `PREFLIGHT` records entry/contract/external-stop evidence, `IMPLEMENT` changes the scoped product surface, `VERIFY` proves acceptance through task-relevant checks, `EVIDENCE` records documentation/traceability without duplicating source-of-truth requirements, and `DELIVERY` follows the parent `MERGE_AFTER_GATE` policy. EPIC-48 and EPIC-49 remain represented as non-autonomous parent epics pending their separate production/post-launch authority.

Completed V3 epics `00, 01, 02, 03, 04, 06, 16` and explicitly replaced
epics `08, 15, 18, 30` remain readable in this plan as `HISTORICAL` or
`SUPERSEDED`, but are not V4 executable anchors and receive no duplicate
cards. Their original V3 nodes and ledgers remain the evidence source.
EPIC-08 WIP is neither merged nor discarded by this transition.

The V4 inventory uses prefix `dcv4` and plan label
`AMS-DON-CITY-REPLAN-V4-CITY-FIRST`. The former `dcn` graph remains in the
same `.beads` store as immutable history; V4 `Next/Claim` filters it out by
plan identity. Creating another store, rewriting old ledgers or closing old
cards without evidence is forbidden.

RP epics are a strict chain because each changes the contract consumed by the
next. This exception is intentional and temporary; after RP-12 the remaining
main-line graph may reopen independent waves. If RP evidence already satisfies
part of a later epic, that later epic records reuse and performs only the
residual acceptance scope; completed work is never re-executed merely to fill
a card.

---

# 33B. STARTER → DON CITY UI TRANSFORMATION CONTRACT

## Precedence

```text
DON CITY Product Structure + URL/SEO registry + Page Strategy
→ DON CITY Project Design System
→ verified starter token/components/assets inventory
→ UI Development Constitution 4.4
→ implementation judgment
```

Starter is a snapshot and implementation base, not an update channel and not a second product/design source of truth.

## Design preservation decision

Owner-approved visual direction is already sufficient for planning:

- primary typeface: `Manrope`; EPIC-16 verifies the actual font source/license, Cyrillic glyph coverage and required weights before scaling;
- visual character: preserve the starter's useful composition, geometry, component behavior and general theme where compatible with DON CITY page intent;
- brand accent: convert the starter's brand-red semantic role to a dark-green role; exact shades are selected only after starter token inventory and must pass contrast checks;
- semantic red remains for error, destructive and critical warning states; this is not a blind global red→green replacement;
- numeric color values live only in the project token source. `docs/06_DESIGN_SYSTEM.md` records policy, not duplicated HEX values.

No separate finished design file is required before approval. The current Design System file records intent now; EPIC-16 completes the exact palette and component decisions from the installed starter before mass page implementation.

During EPIC-16, after EPIC-01/02 have materialized and activated the starter, inventory the actual:

- `globals.css`/token source, Tailwind setup and `components.json`;
- colors, typography, Cyrillic font coverage/license, widths, spacing, section rhythm, radii, borders, shadows and motion;
- primitives, layout components, header/footer, buttons/forms, cards, catalog/filter/gallery patterns and media ratios;
- page sections, responsive behavior, accessibility states and client boundaries;
- visual assets and any embedded donor branding/content/domain references.

Every item receives one disposition:

```text
REUSE       = safe, accessible, semantically compatible, no donor coupling
VARIANT     = good foundation, but needs DON CITY token/content/domain behavior
REPLACE     = conflicts with plan, accessibility, data boundary or brand
REMOVE      = unused, duplicate, speculative or donor-only
REQUIRES_OWNER_DECISION = material visual choice that cannot be inferred safely
```

Default preservation:

- keep accessible primitives, proven container/section geometry, working gallery/form behavior and useful responsive patterns;
- normalize reusable styles into one project-owned semantic token source;
- preserve recognisable visual character only when it does not weaken hierarchy, page intent, accessibility or performance;
- use `REUSE → VARIANT → CREATE`; do not introduce a second UI library or duplicate Button/Input/Card/Dialog foundation.

Mandatory replacement regardless of visual quality:

- donor company identity, copy, navigation, URL assumptions, metadata, canonical host, analytics identifiers and legal/NAP data;
- route-derived components that contradict §§7–8/23;
- raw Payload document coupling or unsafe client data contracts;
- placeholder claims, invented evidence and stale donor links.

## Design intake and representative page

Foundation order:

```text
starter UI inventory
→ normalization/disposition register
→ DON CITY semantic token schema
→ token + shadcn representative fixture
→ Project Design System update
→ section/page ownership map
→ representative /donetsk/kvartiry/ page
→ responsive/accessibility/SEO/browser proof
→ scale all remaining routes through REUSE → VARIANT → CREATE
```

`/donetsk/kvartiry/` is representative because it exercises global shell/menu, exact metadata/H1, catalog data, cards, filters, pagination, empty/error/loading states, CTA, responsive behavior and the public DTO boundary. Home is implemented after the foundation proves fit; it does not create a second visual language.

## Component ownership

```text
primitives → layout → shared → domain → page-specific → route composition
```

Every meaningful section is a component; route files primarily compose sections. Reusable UI receives DTO/ViewModel and never imports raw Payload documents, DB clients, secrets or authorization policy.

---

# 33C. PAGE COMPLETENESS / DOMAIN / METADATA GATE

## Planned route coverage

Implementation is incomplete until every applicable R1 route from §7 is materialized and the dynamic templates cover every registry candidate:

- Home and `/donetsk/`;
- apartment/house/land roots and Donetsk catalogs;
- approved district/microdistrict/facet candidates, including Textilshchik;
- apartment/house/land property detail templates;
- seller, lawyer, company, contacts, privacy, consent and thank-you;
- meaningful 404, platform error boundary and property 410 behavior;
- conditional nearby-geo pages only under §28 rules.

No page may be closed as DONE with only an empty route, placeholder heading or copied generic section.

## Minimum meaningful composition

Every planned page has at least one page-specific semantic block beyond global header/footer. This is a floor, not the target:

- commercial/static page: intent-led Hero plus at least one offer, evidence, catalog/service or CTA block appropriate to Page Strategy;
- catalog/geo/district/facet: H1/intro state + server-rendered listing or explicit empty state + next action;
- property detail: factual object content + gallery/characteristics as available + legal CTA from EPIC-28;
- legal/privacy/consent: actual applicable text and navigation; no fabricated clauses;
- thank-you: clear result, next step and safe navigation;
- 404/410/error: explanation and route back to a relevant catalog/home path.

Page blocks follow one role, one primary intent and one primary conversion goal. Claims without evidence are omitted or marked `требует проверки`.

## Exact page acceptance

For every rendered public route/template verify:

1. exactly one logical `h1` matching the approved registry/template;
2. exact or deterministically materialized `title` and `description` from §§24–25/seed data;
3. `metadataBase`, canonical, Open Graph URLs and sitemap URLs use only `https://doncity-home.ru` and the canonical trailing-slash owner;
4. robots/indexability follows page state, threshold and Content Gate;
5. header/menu matches §23 exactly; R2 links are absent in R1;
6. internal links resolve to approved DON CITY routes, not query equivalents where a path owner exists;
7. no donor domain, `/obekty/[slug]` href, stale brand, `localhost`, preview/staging host or hardcoded foreign canonical remains in public output;
8. server-rendered HTML contains the H1, primary content and required property links without JavaScript;
9. page has mobile/tablet/desktop behavior and loading/empty/error/success states where applicable;
10. CTA has a defined result and forms send the correct context/formKind without analytics PII.

## Link and domain proof

- central site URL/domain helper owns the canonical origin;
- internal links are relative or generated from typed route builders;
- link crawler checks all planned static routes and representative dynamic fixtures;
- repository/runtime scan rejects legacy domain/route references outside explicit compatibility tests/docs;
- real HTTP proof on staging covers status, redirect chain, canonical and final host;
- EPIC-46 performs the final full SEO crawl; browser/source inspection proves H1/metadata/link output, not only unit tests.

---

# REPLAN EPICS — MANDATORY BEFORE RESUMED MAIN LINE

Common entry: exact V4 plan is `APPROVED`, replacement inventory reconciles
cleanly in the existing stealth Beads store, and the epic starts from fresh
canonical `main`. Common exit: one PR, scoped review, declared gate, exact-head
merge evidence, clean main and `EXECUTION_LEDGER_V1`. Production/DNS/server/
secret mutation and destructive database work remain forbidden.

# HISTORICAL EPIC-53 / RP-00 — CURRENT-STATE INVENTORY

Outcome: a factual impact inventory distinguishes `DONE_V3 | PARTIAL | ABSENT`
for every affected route, href builder, project literal, `/obekty/` dependency,
geo/site-settings/property field and already delivered V3 epic.

Scope: inspect `src/app/**`, public link/canonical/sitemap/lead construction,
Payload collections and current merged code. Read-only public discovery checks
whether category-first URLs were ever public/indexable and whether
`doncity-home.ru` exposes a legacy site. Only proven public URLs enter the
legacy manifest; uncertainty produces no redirect. Result:
`docs/replan/RP00_INVENTORY.md`, archived by RP-12.

Acceptance: every inventory row has status and file/runtime evidence; merged
and WIP-only surfaces are distinguished; old EPIC-08 WIP is identified but not
merged/discarded. Gate: `verify:merge-standard`.

# HISTORICAL EPIC-54 / RP-01 — V4 SOURCE OF TRUTH / ADR / ARCHIVE VERIFICATION

Outcome: active project documentation consistently references this V4 plan,
the archived V3 snapshot is marked `SUPERSEDED`, and four decisions are durable:

- `ADR-001-city-first-grammar`;
- `ADR-002-city-hub-owns-general-intent`;
- `ADR-003-platform-project-split`;
- `ADR-004-entities-global-no-geo-in-path`.

Scope: verify and reconcile §§6–8, 16, 22–26, 28, 35, Product Structure,
Architecture, Backlog, Release Checklist and changelog. This epic does not
change plan approval or Beads authority. Active docs outside archive/changelog
must contain no category-first listing owner. Gate: `verify:merge-standard`.

# HISTORICAL EPIC-55 / RP-02 — PLATFORM / PROJECT SPLIT AND HARDCODE GUARDS

Outcome: portable modules own grammar/resolver/geo/SEO/catalog/gate/sitemap/
IndexNow behavior; DON CITY values live only in Project inputs/data.

Scope: move already implemented geo/taxonomy/publicUrlId behavior without
semantic change; add `guard:platform-no-project-literals`; enforce no
Platform→Project import using existing repository architecture tooling; create
`docs/UPSTREAM_CANDIDATES.md`. Literal guard covers `donetsk`, `Донецк`, `ДНР`,
`ДОН СИТИ`, `doncity` under `src/platform/**`.

Acceptance: guards are green, dependency direction is proven, public behavior
is unchanged, no new linter is introduced solely for this rule. Gate:
`verify:merge-risky` + `verify:schema`.

# HISTORICAL EPIC-56 / RP-03 — TYPED SITE PROFILE

Outcome: §32B typed Site Profile is the single owner of geo mode, category/
market activation, thresholds, inventory gates and facet whitelist.

Acceptance: profile validation tests pass; switching `kvartiry` to
`PREPARED_OFF` in a test profile returns `404` for every geo/apartment route
without product-code edits and removes it from sitemap/menu/linking. Gate:
`verify:merge-risky` + `verify:schema`.

# HISTORICAL EPIC-57 / RP-04 — CANONICAL URL GRAMMAR

Outcome: `src/platform/grammar` exposes typed `PageKey`, `buildUrl` and
`parseUrl`; every internal/public URL consumer uses it.

`PageKey` is a discriminated union of `home | geoHub | categoryRoot |
categoryGeo | categoryGeoDistrict | categoryGeoFacet | property | static`.
Builders always emit lowercase trailing-slash paths. Replace URL construction
in menu, cards, breadcrumbs, sitemap, canonical, JSON-LD, IndexNow and lead
messages. `guard:no-literal-hrefs` rejects catalog path literals outside
grammar/tests.

Acceptance: property-based round-trip `parseUrl(buildUrl(key)) ≡ key` for every
key variant and all guards pass. Gate: `verify:merge-risky` + `verify:schema`.

# HISTORICAL EPIC-58 / RP-05 — GEO MODEL / UNIQUENESS / COLLISION MIGRATION

Outcome: Regions/Cities/Districts satisfy §5 and feed matching is city-scoped.

Scope: add city grammatical fields, `agglomerationOf`, publication state;
region `shortName`; district composite `(city, slug)` uniqueness and nullable
parent; Payload hooks/guards for reserved/category/facet collisions; seed
Donetsk forms with `ownerVerified=false`. Inventory the unfinished EPIC-08
branch, reapply only verified compatible work from fresh main, and preserve
unknown district text/visibility.

Acceptance: up/down migration passes on empty and representative non-empty
PostgreSQL 18 data; seed is idempotent; city slug `kvartiry` and district slug
`odnokomnatnye` are rejected; Textilshchik remains `parent=null`. Gate:
`verify:merge-risky` + `verify:schema`.

# HISTORICAL EPIC-59 / RP-06 — RESOLVER AND NEXT.JS ROUTES

Outcome: explicit static/service pages plus one catalog catch-all resolve only
through §§7–8 and Site Profile; `generateMetadata` consumes the same result.

Scope: remove V3 grammar routes if present; handle donor `/obekty/[slug]` only
when RP-00 proves public compatibility; property resolution uses `publicUrlId`
and canonicalizes semantic/category mismatch with one `301`; trailing slash
uses one `308`; four or more segments are `404`.

Acceptance: e2e matrix proves status/robots/canonical for every V4 owner and
negative cases: category-first Donetsk apartments, prepared newbuild,
district×facet and unknown third segment all return `404`. Gate:
`verify:merge-risky` + `verify:schema`.

# HISTORICAL EPIC-60 / RP-07 — SEO REGISTRY / SEEDS / TEMPLATES

Outcome: stable registry IDs own new city-first URLs generated by grammar; all
50 Wordstat owners resolve against fixture data.

Scope: compute/guard CSV `url`; remap owners; require district `citySlug` and
`(citySlug, slug)` identity; move reusable draft templates to Platform with
data variables; keep exact Gate-passing strings materialized in CSV.

Acceptance: Textilshchik renders exactly `Купить квартиру на Текстильщике в
Донецке, ДНР | ДОН СИТИ` from data with no platform literal; every owner URL
resolves `200` in fixtures; active registry contains no V3 URL. Gate:
`verify:merge-risky` + `verify:schema`.

# HISTORICAL EPIC-61 / RP-08 — NEARBY GEO UNDER CITY-FIRST GRAMMAR

Outcome: non-primary city hub/category pages follow §28 without false Donetsk
assignment or district publication.

Acceptance fixture `Макеевка, 2 квартиры`: `/makeevka/` and
`/makeevka/kvartiry/` are `200 noindex,follow`; `/makeevka/doma/` and any
nearby district route are `404`; inbound links exist only from properties of
that city. Replaces EPIC-30. Gate: `verify:merge-standard`.

# HISTORICAL EPIC-62 / RP-09 — NAVIGATION / BREADCRUMBS / INTERNAL LINKING

Outcome: menu, breadcrumbs and linking follow §23 and are generated through
grammar/Profile only.

Scope: Home→hub/categories; hub→active categories and Gate-passing top
districts/facets; category→district/facet/property; property→actual city,
category, district and `/yurist/`; no query link when a path owner exists.

Acceptance: fixture crawl has no internal link to `404`, `301` or owned query
equivalent; SINGLE_GEO switcher is hidden. Gate: `verify:merge-standard`.

# HISTORICAL EPIC-63 / RP-10 — GATEWAY / DTO / CACHE / ANALYTICS

Outcome: Public Gateway consumes `ParsedPath` or explicit geo/category inputs,
never an implicit Donetsk default; downstream contracts carry geo identity.

Cache tags: `geo:{slug}`, `geo:{slug}:cat:{category}`,
`district:{city}:{slug}`, `property:{publicUrlId}`. Publication/archive
invalidates the object's city, category and district. All §41 events include
`geo_slug` and `page_key` without PII.

Acceptance: DTO contract tests are updated/frozen and invalidation/analytics
tests prove exact dimensions. Gate: `verify:merge-standard` unless exact diff
changes schema or critical backend behavior, which escalates to RISKY.

# HISTORICAL EPIC-64 / RP-11 — SITEMAP / ROBOTS / INDEXNOW

Outcome: §28 logical sitemaps, robots and IndexNow expose only grammar-owned
canonical URLs and meaningful lastmod.

Acceptance: fixture sitemap snapshot and XML validation pass; no V3 owner,
nearby geo or category root leaks into sitemap; canonical move submits both
old proven legacy URL and new URL. Gate: `verify:merge-standard`.

# HISTORICAL EPIC-65 / RP-12 — TWO-PROFILE PROOF AND REPLAN CLOSURE

Outcome: `donetsk-single` and `multi-geo` fixtures prove that a second city is
enabled by profile/data/registry changes only, with no product-code edit.

Scope: run full e2e/sitemap/registry guard under both profiles; multi profile
uses Donetsk ACTIVE and Makeevka ACTIVE for apartments. Archive
`RP00_INVENTORY.md`, update §35 and `UPSTREAM_CANDIDATES.md`, write
`docs/replan/RP12_DONE.md` with exact SHA and portable-module list.

Acceptance: both matrices pass in `verify:merge-risky`; no `src/**` diff is
needed to switch the profile fixture; replacement graph can resume the
V4-adjusted main line. Delivery verification is RISKY because this is the
cross-contract closure despite its normal implementation gate.

---

# HISTORICAL EPIC-00 — SOURCECRAFT REPOSITORY / WORKSPACE

Create private client repo and separate workspace; starter untouched.

# HISTORICAL EPIC-01 — STARTER BASELINE + VERSION/DOC DRIFT

This is the first technical implementation Epic after exact plan approval.

1. Fetch/clone read-only starter `integrator-p/ams-realty-baza-starter` at exact `main@ca1b884d43e808d17e1eb18b05bad70ea358dd1c` into an isolated reference location; starter repository remains untouched.
2. Inventory tracked tree, license, `.node-version`/package-manager contract, `package.json`, lockfile, Payload/Next/React versions, migrations, actual `/obekty/[slug]`, env example, docs and SourceCraft workflows.
3. Materialize the verified tracked application tree into a fresh DON CITY branch/worktree without `.git`, secrets, caches, build outputs or `.beads`; reconcile conflicts with the already approved DON CITY docs rather than replacing them.
4. Install dependencies with the declared pnpm version and frozen lockfile. Do not start Docker/WSL or connect to production DB for baseline installation.
5. Run only existing baseline commands discovered from `package.json`; record exact versions, command results, source SHA and drift. If active starter docs repeat an older Payload version, correct only the client clone/source-of-truth and record upstream drift. No unnecessary upgrade.

Exit evidence: exact source SHA, imported tree manifest, clean lockfile install, verified runtime matrix, actual route proof and a pushed DON CITY checkpoint.

Stop conditions: source SHA/remote mismatch, missing lockfile, secret detected, undocumented destructive script, automatic push/PR CI, license uncertainty or baseline failure requiring architecture change.

# HISTORICAL EPIC-02 — CLIENT ACTIVATION

After EPIC-01 baseline PASS, set DON CITY identity, domain, locale/currency, run canonical client-clone cleanup and retain Core/guards/packages. Client activation must not erase starter provenance or weaken security/access guards.

# HISTORICAL EPIC-03 — ACTUAL INVENTORY / GEO / NAP BASELINE

After EPIC-01 baseline and EPIC-02 activation contract, recover/verify the dedicated Don City access contour and perform read-only discovery:

- SSH/hosting smoke: confirmed host identity, user, hosting type and relevant service names;
- database identity: managed/local provider, engine/version, database name alias, backup posture and read-only consumer smoke without exposing credentials or full URL;
- inventory: feed/source, category counts, actual localities, districtRaw values, subtype/unit values;
- content: canonical NAP and existing-site assets/pages that require migration.

Do not assume the database is local to the app server. Do not run migrations, import, UPDATE/DELETE, restart, DNS change or secret mutation. Do not create competing SEO docs. If dedicated access is still absent, record the blocker and continue only fixture-safe work.

# HISTORICAL EPIC-04 — FINAL SEO FREEZE FROM v1.0 + THIS MASTER PLAN

No separate SEO-dobor T-A. Materialize SEO and district seed CSVs from this embedded registry. Freeze R1 candidates, tiers, Home/ALL split, no-vtorichka and `/yurist/` only. No `/yurist/[usluga]/`.

# HISTORICAL EPIC-05 — DOCS CONSOLIDATION / ARCHIVE

Make this file the only active master/SEO source of truth. Archive old SEO Passport and v2.2, mark SUPERSEDED. Project docs may reference but not duplicate the registry.

# HISTORICAL EPIC-06 — INFRASTRUCTURE / SECRET MASTER

Using the verified identity from EPIC-03, document the actual topology of the one existing DON CITY Timeweb server: OS/runtime, Nginx, application services, database placement/version, storage, backups, capacity and one jobs owner. Reuse this server as the presumed production target when it satisfies the contract. Do not create a second server, move the database or provision Managed PostgreSQL/S3 without evidence and a separate owner decision. Staging remains separate/noindex; secrets live only in a dedicated Don City Secret Master scope. Discovery remains read-only. Secret creation, DNS and production writes require their own authorized task and recovery proof.

# HISTORICAL EPIC-07 — SITE SETTINGS / NAP

Create site-settings Global including `brandName`, one NAP DTO, RealEstateAgent input, remove starter dummy identity.

# SUPERSEDED EPIC-08 — GEO MODEL / DISTRICTS / TEXTILSHCHIK

Superseded by RP-05 for all unfinished scope. Preserve already merged evidence only; do not merge the pre-replan WIP branch directly.

# HISTORICAL EPIC-09 — PROPERTY TAXONOMY

Active apartment/house/land; prepared commercial/room/garage; houseType dacha/part_of_house; land enums/plotAreaSotka normalization.

# HISTORICAL EPIC-10 — PUBLIC URL ID

Add stable publicUrlId; preserve on same external identity; canonical semantic resolver + one 301; price forbidden.

# HISTORICAL EPIC-11 — FEED TAXONOMY + GEO NORMALIZATION

Explicit source mapping; city-scoped Textilshchik matcher; unknown districts needsReview while object remains visible.

# HISTORICAL EPIC-12 — CONTRACTS / DTO

Region/City/District + Apartment/House/Land DTO; prepared Commercial/Development DTO; freeze contracts after RP-10 geo-aware inputs.

# HISTORICAL EPIC-13 — PUBLIC GATEWAY

Consume `ParsedPath` or explicit geo/category/district/facet inputs from RP-10; property by publicUrlId; actual published geographies rather than hardcoded city.

# HISTORICAL EPIC-14 — SEO ENGINE / CONTENT GATE / SEED LOAD

Load RP-07 seed CSVs and implement Profile-owned SINGLE_GEO, P1/TEST threshold logic, Content Gate, district/facet status, query canonical mapping and sitemap eligibility.

# SUPERSEDED EPIC-15 — ROUTE RESOLVER / COLLISION GUARD / TRAILING SLASH

Superseded by RP-06. Preserve only evidence compatible with the city-first resolver.

# HISTORICAL EPIC-16 — UI INTAKE

Execute §33B completely: inventory and classify starter UI; install/verify Manrope with Cyrillic coverage; map the starter brand-red role to a contrast-safe dark-green brand role while preserving semantic error/destructive red; normalize one DON CITY token source; update Project Design System and section ownership map; compile token/shadcn fixture; then build `/donetsk/kvartiry/` as the representative page. Verify responsive, accessibility, data boundary, exact metadata/H1/canonical and performance-sensitive media before scaling. `REUSE→VARIANT→CREATE`; no second design system.

# HISTORICAL EPIC-17 — NAVIGATION SHELL

Implement RP-09/§23 Profile-generated menu on desktop/mobile, logo → `/`, active/focus/keyboard behavior, header/footer NAP via safe DTO and no R2/donor links. Visual styling may reuse or variant the starter shell; information architecture may not.

# SUPERSEDED EPIC-18 — ROUTE SKELETON

Superseded by RP-06 catch-all/static route framework and §33C acceptance harness. Remaining work is page composition, never a second route grammar.

# HISTORICAL EPIC-19 — HOME

Exact HOME metadata; agency/realtor/brand intent.

# HISTORICAL EPIC-20 — `/donetsk/` ALL PROPERTY

Implement reusable `geoHub` template; Donetsk exact ALL metadata remains indexable and menu target `Вся недвижимость`.

# HISTORICAL EPIC-21 — APARTMENT GEO CATALOG

`/kvartiry/` noindex root + `/donetsk/kvartiry/` index page; no vtorichka facet.

# HISTORICAL EPIC-22 — APARTMENT DISTRICTS / MICRODISTRICTS

Dynamic district pages; Textilshchik parent=null; TEST rule; optional parent breadcrumbs without URL change.

# HISTORICAL EPIC-23 — APARTMENT ROOM FACETS

1/2/3-room approved candidates; path navigation and query canonical ownership.

# HISTORICAL EPIC-24 — HOUSE GEO CATALOG

Root + Donetsk geo catalog with house subtype support.

# HISTORICAL EPIC-25 — HOUSE DISTRICTS / FACETS

P2 Kuibyshev/Budennovsky/Kirovsky; other six TEST with blank broad; dacha TEST.

# HISTORICAL EPIC-26 — LAND GEO / FACETS

Root + Donetsk geo; IZH/SNT TEST; land taxonomy/unit normalization.

# HISTORICAL EPIC-27 — PROPERTY CARD SYSTEM

Category-aware card, actual locality/district, category canonical href; no generic donor href.

# HISTORICAL EPIC-28 — PROPERTY DETAIL ROUTES

Apartment/house/land global category routes; publicUrlId lookup; semantic or category mismatch gets one 301; factual unique blocks.

Every property page includes a block:

```text
Юридическая проверка объекта
→ /yurist/
lead formKind=legal
```

Verification status may be shown only from `documentCheckSummary`. If `documentCheckSummary` is empty, render a neutral CTA without any statement that the object has been checked.

# HISTORICAL EPIC-29 — LIFECYCLE / DONOR ROUTE COMPATIBILITY

Prove 404/200/archived/301/410. Handle donor `/obekty/[slug]` only if compatibility is needed; no duplicate canonical.

# SUPERSEDED EPIC-30 — NEARBY GEO DATA / NOINDEX ROUTES

Superseded by RP-08. Indexing remains deferred to EPIC-49 Day-60 review.

# HISTORICAL EPIC-31 — SELLER PAGE

Exact SELL metadata and seller lead flow.

# HISTORICAL EPIC-32 — LAWYER PAGE

Only `/yurist/`, exact LAW metadata; no child service routes R1.

This route is the canonical target of the property-page block `Юридическая проверка объекта`. Legal inquiry forms use:

```text
formKind=legal
```

# HISTORICAL EPIC-33 — COMPANY / CONTACTS / LEGAL

ABOUT/CONTACTS/PRIVACY/CONSENT/THANKS, NAP from site-settings.

# HISTORICAL EPIC-34 — LEADS

Reuse starter engine; context category/district/city/property/formKind, including `formKind=legal`, with future mortgage/development fields nullable.

# HISTORICAL EPIC-35 — INDEXNOW / LASTMOD

Use RP-04 grammar and RP-11 canonical-move behavior; meaningful sitemap lastmod; no deploy-wide spam.

# HISTORICAL EPIC-36 — SITEMAPS / ROBOTS

Use RP-11 logical maps; include canonical Gate-pass pages only; no R2 maps.

# HISTORICAL EPIC-37 — INTERNAL LINKING

Use RP-09 graph: Home→geo hub/category; hub→categories; categories→district/facet/property; property→actual geo/district/category/`yurist`; never link query equivalent when a path owner exists.

# HISTORICAL EPIC-38 — CONTENT / INVENTORY ACTIVATION

Apply fixed thresholds from §14: P1>=5, P2>=5, TEST>=10; activate only pages that pass Content Gate (§16A). P1 is processed before P2 in the content queue; threshold is identical.

# HISTORICAL EPIC-39 — FEED ONBOARDING

Normalize taxonomy/geo, preserve publicUrlId, unknown values needsReview, safe first baseline run.

# HISTORICAL EPIC-40 — CACHE

Home/ALL/category/district/facet/property targets.

# HISTORICAL EPIC-41 — ANALYTICS

all_property_view, category_catalog_view, district_view, facet_view, filter_apply, property_open, lead events, no PII.

# HISTORICAL EPIC-42 — PERFORMANCE

RSC boundaries, catalog JS, pagination, media, DB/cache, LCP/CLS/INP.

# HISTORICAL EPIC-43 — UI / ACCESSIBILITY QA

Representative Home, ALL, apartment/house/land geo, P1 district, Textilshchik, room facet, property, lawyer, contacts, 404/410.

# HISTORICAL EPIC-44 — SECURITY / ARCHITECTURE AUDIT

Payload boundaries, publicUrlId, district/facet guard, feed normalization, NAP, IndexNow key, lead PII, S3, backup; P0/P1=0.

# HISTORICAL EPIC-45 — TIMEWEB STAGING

Proof all R1 routes, districts/facets, nearby locality behavior, lifecycle, feeds/jobs/leads. Staging noindex.

# HISTORICAL EPIC-46 — FULL SEO CRAWL

Verify Title/Description/H1/canonical against V4 owner mapping, absence of V3 routes, resolver precedence, query canonical, pagination, category root noindex, sitemap/robots/lastmod, JSON-LD/NAP and 301/308/404/410.

# HISTORICAL EPIC-47 — RELEASE REHEARSAL + FINAL RELEASE CANDIDATE

Simulate deploy/rollback, full verify, exact SHA, immutable artifact and rollback point. No production action.

# HISTORICAL EPIC-48 — PRODUCTION CUTOVER

Explicit owner trigger only: backup→exact SHA→artifact→migrations→jobs→Nginx→smoke→lifecycle→NAP/JSON-LD→sitemap/robots→IndexNow live→Webmaster→owner approval→public indexing.

# HISTORICAL EPIC-49 — POST-LAUNCH / DAY-60 TEST REVIEW

Monitor Day 1/3/7/14/30/60. At Day 60 use Yandex Webmaster actual queries/impressions to re-evaluate TEST apartment districts, TEST house districts, TEST facets and nearby geographies. Tier change requires new PR; never backfill invented broad.

# DEFERRED EPIC-50 — R2 NEWBUILD / ЖК RESEARCH + ACTIVATION

First task before coding: Wordstat + SERP for newbuild/ЖК/developers in Donetsk. Then define exact R2 URL/meta/thresholds and activate prepared developers/developments/property relation. No R1 assumptions.

# DEFERRED EPIC-51 — R2 MORTGAGE RESEARCH + ACTIVATION

First task: Wordstat + SERP + official program-source verification. Only then decide `/ipoteka/` and exact metadata. Every rate/eligibility has `source + checkedAt`; no blanket 2% secondary claim without proof.

# SUPERSEDED EPIC-52 — R2 COMMERCIAL RESEARCH + ACTIVATION

Superseded by OD-07/OD-08 and CP-02A. The preserved canonical launch route is
`/donetsk/kommercheskaya/`; semantic evidence may refine metadata/content but
must not reopen the route owner without a new owner decision.

---

# 33D. CORE 5.5 POST-PRODUCTION HARDENING PROGRAM — v9 APPROVED

This section is the canonical assembly draft for the owner packet received on
2026-09-27. It does not reopen delivered v7 work without evidence and does not
authorize production, indexing, a real feed, secret mutation or destructive
data operations.

## MASTER PLAN MAP

Primary goal: bring DON CITY to evidence-backed AMS Realty Platform Core 5.5
conformance and then release a complete production site with public indexing,
correct SEO contracts and operational readiness, while preserving Payload
ownership and the existing one-server topology.

Non-goals: unrelated redesign, new product modules, new server, premature
production/indexing before readiness, enabling a real feed without its own
gate, replacement of Payload, unrelated cleanup and speculative readiness flags.

Major outcomes:

- release-level noindex wins over every route-level SEO contract;
- robots/sitemap/metadata/structured data/lifecycle are deterministic and tested;
- the first-four-month indexable inventory is limited to secondary apartments,
  houses, land, commercial real estate and approved legal-department pages;
- newbuild/ЖК stays disabled, noindex and absent from sitemap until a separate
  review after four months;
- jobs, retention and delivery recovery satisfy targeted proofs A/D/E/F/G;
- media and request-path performance have measured budgets and reversible changes;
- UI roles/accessibility converge without creating a second design system;
- project/operations documentation reports facts and fail-closed unknowns;
- final staging evidence is produced without making staging externally indexable;
- one exact-main production release removes the global noindex only after every
  required SEO, monitoring, backup, delivery, rollback and owner-readiness gate.

Shared foundations: exact package versions, Core 5.5 hard contract, current
Product Structure/Architecture/Operations, Project Design System, typed URL
grammar, Public/System/Ingest gateways and existing verification scripts.

Security-sensitive areas: leads/PII, raw SQL, Payload job recovery, runtime
secrets, Origin checks, CSP, HSTS and Nginx rate limiting.

Production boundary: CP-00…CP-08 stop after PR/merge-authorized evidence. CP-09
is the dedicated production/indexing release and starts only from a clean exact
`main` after its release command and final readiness proof. Feed activation is
not implied by public indexing and keeps a separate gate.

## REVISION PACKET TRIAGE

| Packet area | Architect status | Reason |
|---|---|---|
| 1.1–1.6 indexing, sitemap, metadata, JSON-LD | `ACCEPTED_REQUIRES_PREFLIGHT` | Named surfaces exist; exact defect and route coverage require tests/runtime evidence. |
| 1.7 title/description | `ACCEPTED_WITH_ADAPTATION` | Centralize policy, but preserve registry ownership and treat length as warning except invalid/empty metadata. |
| 1.8 headings | `ACCEPTED` | Aligns with page/UI/accessibility contract. |
| 1.9 pagination/filter policy | `ALREADY_COVERED + VERIFY` | Current Source of Truth already selects `noindex,follow` and self-canonical for page 2+; invalid/page=1 behavior still needs proof. |
| 1.10 archived→gone | `ALREADY_COVERED + VERIFY` | Lifecycle contract and 100-day retention exist; boundary behavior requires regression proof. |
| 1.11 staging crawl | `ACCEPTED_WITH_ADAPTATION` | Run public-mode application crawl in an isolated contour while edge staging remains `noindex`. |
| Epic 2 media/performance | `ACCEPTED_REQUIRES_PREFLIGHT` | Select one media path after inventory; migration/backfill is dry-run-first and staging-only. |
| 3.1 raw SQL | `NEEDS_OWNER_AT_DECISION` | Inventory first; prefer supported Payload conditional operations, otherwise ADR + atomicity proof before implementation. |
| 3.2–3.6 jobs/leads/runtime | `ACCEPTED_RISKY` | Matches Core 5.5 §§9, 10, 14A and proofs A/D/E/F/G; staging and test DB are mandatory. |
| 3.7 project collections | `ACCEPTED_WITH_ADAPTATION` | Document existing modules and access matrix; `ListingContents` remains project SEO content, not silently promoted to a new platform module. |
| Epic 4 CSP/HSTS | `NEEDS_OWNER` | Nonce feasibility is version-sensitive; HSTS preload is an external irreversible commitment for applicable subdomains. |
| Epic 5 UI drift | `ACCEPTED_REQUIRES_REMEDIATION` | Canonical UI Core 5.0 is present. Reuse the current Project Design System, reduce typography/token drift, close navigation/error-boundary/starter-name gaps and extend mechanical proof before claiming conformance. |
| 6.1 PROJECT/DESIGN docs | `ACCEPTED` | Required by Core 5.5 §21; migrate unique active meaning without duplicating Source of Truth. |
| 6.2 readiness flags | `REJECTED_AS_MECHANICAL_UPDATE` | Facts become readiness only after durable evidence; current fail-closed values remain until proven. |
| 6.3 reserved namespaces | `ACCEPTED` | `/novostroyki/*` and `/komplex/*` stay reserved and non-indexable for at least the first four months. |
| First-four-month product/indexing scope | `OWNER_DECIDED` | Index only secondary apartments, houses, land, commercial real estate and approved legal-department pages; newbuild/ЖК is excluded. |

## PROVISIONAL DELIVERY WAVES

```text
W1 FOUNDATION
  CP-00 factual preflight / contract and evidence matrix

W2 SEO SAFETY + DATA/PII SAFETY
  CP-01 release-level indexing gate
  CP-03 jobs/import/leads recovery (independent RISKY stream)

W3 SEO SURFACE + MEDIA
  CP-02A first-four-month indexable scope / commercial / legal
  CP-02 sitemap/metadata/JSON-LD/lifecycle
  CP-04 media/performance/proxy

W4 UI + SECURITY DECISIONS
  CP-05 UI Core drift/accessibility
  CP-06 CSP/HSTS/transport decisions

W5 DOCUMENTATION + CLOSURE
  CP-07 Core 5.5 project/readiness documentation
  CP-08 isolated staging proof and program closure

W6 PRODUCTION + INDEXING
  CP-09 exact-main production launch and public indexing
```

CP-01 and CP-03 may proceed in separate worktrees after CP-00 freezes shared
contracts. CP-02A freezes the launch route/registry scope after evidence and
precedes CP-02 because both own metadata/robots/sitemap contracts.
CP-05 follows the metadata/heading slice of CP-02 where they share page/UI
files. CP-03 remains serial internally because it changes shared jobs, lead
state and data-recovery contracts. CP-08 depends on every accepted stream;
CP-09 depends on a clean CP-08 result and the exact-main release gate.

## COMMON STREAM CONTRACT

- Base: fresh canonical SourceCraft `main`; one independent stream = one branch/worktree = one PR.
- Entry: v8 exact plan is approved and reconciled; CP-00 evidence for the stream is available.
- Required record: goal, Source of Truth, scope in/out, risk, acceptance,
  verification, rollback/recovery, stop conditions and `EXECUTION_LEDGER_V1`.
- STANDARD delivery: full diff review, `pnpm verify:daily`, relevant targeted
  command and one exact-head STANDARD gate before merge.
- RISKY delivery: full diff review, relevant targeted commands, explicit test
  PostgreSQL/staging proof and one exact-head RISKY gate before merge.
- Stop: unknown production identity, missing test DB/staging isolation, secret
  exposure, unplanned migration, changed production indexing/feed, destructive
  operation, unsupported pinned-version API or failed rollback evidence.

## HISTORICAL EPIC-66 / CP-00 — FACTUAL PREFLIGHT AND CONTRACT FREEZE

Outcome: every owner-packet claim is classified as `CONFIRMED_DEFECT |
ALREADY_COVERED | NOT_REPRODUCED | OWNER_DECISION | EXTERNAL_PROOF`, with exact
file/test/runtime evidence and no product-code write.

Scope: inspect installed Next `16.3.5`, Payload `3.90.1`, current route/page
contracts, Core 5.5 and UI Core 5.0 sections, existing tests,
staging noindex boundary and shared-file ownership. Produce one evidence matrix
inside this plan or a linked `docs/replan/` report; do not create a competing
master plan.

Acceptance: every 1.1–6.3 item has evidence, owner-decision flag, target stream,
risk and exact verification surface; canonical source hashes and any remaining
UI conformance gaps are explicit. Gate: STANDARD docs-only checkpoint.

Assembly evidence: `docs/replan/CORE55_CP00_EVIDENCE.md` records the complete
factual matrix for repository snapshot `9087e43c1effd1a11216cf09fd1153b1248252e8`.
Confirmed high-priority defects include contradictory live robots metadata,
missing root sitemap, fail-open empty sitemap shards, incomplete social/JSON-LD
wiring, jobs/retention/recovery races and missing Core 5.5 project operations
documentation. CP-00 evidence is complete for assembly; implementation remains
blocked until exact v8 approval/import.

## HISTORICAL EPIC-67 / CP-01 — RELEASE-LEVEL INDEXING SAFETY

Outcome: `productionIndexing=noindex` deterministically forces meta robots and
`X-Robots-Tag: noindex, nofollow` for every response class without weakening
page-level policy in public mode.

Scope: central policy composition, static/marketing/legal routes, notFound/gone,
edge headers and staging configuration. Preserve staging edge-level noindex.

Acceptance: route matrix covers home, geo hub, category, district, facet,
property, static, legal, 404 and gone in both noindex/public application modes;
headers and HTML agree. Verification: targeted SEO contracts plus isolated HTTP
smoke. Rollback: restore previous metadata/header policy. Gate: RISKY because a
mistake can expose the whole live site to indexing.

## HISTORICAL EPIC-68 / CP-02A — FIRST-FOUR-MONTH INDEXABLE PRODUCT SCOPE

Outcome: the public launch exposes and indexes only the owner-approved initial
business scope: secondary apartments, houses, land plots, commercial real
estate and the legal department. Newbuild/ЖК remains disabled and non-indexable.

Scope: reconcile PRD, Product Structure, Site Profile, typed URL grammar, SEO
registry, navigation, sitemap, structured data and content gates. Move commercial
real estate from the former generic R2 bucket into the current launch scope and
preserve the owner-decided canonical route `/donetsk/kommercheskaya/`; semantic
and competitor evidence refines metadata/content rather than reopening URL ownership. Define the
approved legal-department route set and ensure each route has a real service,
content, CTA, metadata and factual structured data. Preserve `/novostroyki/*`
and `/komplex/*` as reserved namespaces without enabling pages, menu links or
sitemap entries.

Acceptance: fixtures and crawl prove apartments/houses/land/commercial/legal
owners resolve only when their data/content gates pass; no fake inventory page
is indexed; newbuild/ЖК routes are `404` or explicit `noindex` according to the
disabled-module contract and never appear in sitemap/indexable navigation;
reserved namespaces cannot be occupied by CMS pages. A dated four-month review
task exists, but it cannot activate newbuild without a new owner-approved plan.
Rollback: restore commercial to `PREPARED_OFF`, remove only CP-02A registry/menu
activation and preserve the reserved newbuild namespaces; no invented inventory
or redirect is retained.
Gate: RISKY if Site Profile/schema/grammar changes; otherwise STANDARD for
registry/content-only work.

## HISTORICAL EPIC-69 / CP-02 — SEO SURFACE, SITEMAP AND LIFECYCLE

Outcome: robots, sitemap index/shards, Open Graph/Twitter, factual JSON-LD,
title/description, headings, pagination/filter normalization and archived→gone
behavior form one deterministic page contract.

Scope: packet 1.2–1.10 after CP-00 evidence. Sitemap provider failures must not
cache a false empty success. Public media path remains crawlable without opening
private API surfaces. JSON-LD uses safe serialization and factual DTO/NAP only.

Acceptance: unit/route snapshots for both indexing policies; `/sitemap.xml`
lists only non-empty successful shards; provider failure is non-200; structured
data and headings cover every page type; lifecycle boundary at day 100 is
proven; no redirect chain or homepage fallback. Rollback: restore the previous
SEO handlers/registry projection while retaining the global noindex override;
never fall back to a false empty sitemap or homepage redirect. Gate: STANDARD unless schema,
gateway or critical runtime behavior changes, then RISKY.

## HISTORICAL EPIC-70 / CP-03 — JOBS, IMPORT AND LEAD SAFETY

Outcome: import and lead recovery are atomic, race-safe and evidence-backed;
retention removes/anonymizes linked PII; runtime secrets fail closed.

Scope: raw-SQL inventory/decision, conditional run transitions, orphan job
inspection, lead-delivery cleanup/recovery threshold, external heartbeat
visibility, runtime clock, rate-limit eviction, lead Origin/Content-Type and
Nginx rate limiting, public response minimization and collection access matrix.

Acceptance: Core 5.5 proofs A/D/E/F/G pass on an explicit test database and
isolated staging; migration/transaction and PII evidence is redacted; no raw SQL
rewrite occurs before the CP-00 decision record. Rollback: task-specific
migration/data recovery plus previous immutable application image. Gate: RISKY.

## HISTORICAL EPIC-71 / CP-04 — MEDIA AND REQUEST-PATH PERFORMANCE

Outcome: object media uses one approved responsive/format strategy with stable
cacheable URLs, existing media has an idempotent dry-run-first backfill, and
property resolution avoids duplicate expensive reads.

Scope: packet Epic 2; keep private S3 and controlled public delivery. Select
Payload sizes or an approved Next loader based on exact runtime evidence, not
both. Logo assets are right-sized without changing the approved brand original.

Acceptance: representative imported media survives backfill/rollback; cache
headers are safe for versioned URLs; before/after p95 is recorded; Lighthouse
mobile evidence covers home, catalog and property with LCP ≤2.5s and CLS ≤0.1.
Gate: RISKY for schema/media backfill; otherwise STANDARD for asset-only slice.

## HISTORICAL EPIC-72 / CP-05 — UI ROLE AND ACCESSIBILITY CONVERGENCE

Outcome: the existing DON CITY Design System has one semantic typography/token
language, project-owned component names and accessible navigation/lead forms,
without a visual redesign.

Scope: triage aliases before renaming; converge repeated arbitrary values and
navigation/chip patterns through `REUSE → VARIANT → CREATE`; fix nav semantics,
dropdown keyboard/outside-click behavior, form error relationships and starter
naming. Payload Admin remains CMS-native.

Acceptance: no second token/component system; UI/drift/a11y checks pass; mobile,
desktop, keyboard, submit/error/success and reduced-motion evidence is recorded.
Rollback: revert the affected token/component contract as one scoped change;
preserve the current Project Design System and existing accessible primitives.
Gate: STANDARD unless package public API or shared boundary changes, then RISKY.

## HISTORICAL EPIC-73 / CP-06 — TRANSPORT SECURITY DECISIONS

Outcome: CSP and HSTS have explicit evidence-backed policies for the current
Next/runtime/Nginx topology.

Scope: pinned-version nonce CSP spike; current inline-script inventory; complete
subdomain/TLS inventory for `includeSubDomains; preload`. A spike may conclude
with an approved exception, but not with an unrecorded weakening.

Acceptance: recommendation, compatibility evidence, rollout/rollback and
residual risk are recorded. HSTS preload mutation remains blocked on owner
decision. Rollback: restore the previous application/Nginx header pair and
verify one authoritative value; a spike-only conclusion has no runtime rollback.
Gate: RISKY for any runtime/header change.

## HISTORICAL EPIC-74 / CP-07 — CORE 5.5 PROJECT AND READINESS DOCUMENTATION

Outcome: `docs/PROJECT.md`, `docs/DESIGN.md`, Architecture, Operations, Backlog
and Release Checklist describe one non-duplicated Core 5.5 contract and the
actual fail-closed readiness state.

Scope: migrate unique active meaning from `06_DESIGN_SYSTEM.md` without losing
history; record profile, intervals, retention, channels/allowlists, cache mode,
S3/DB, backup/monitoring, admin access, indexing/pagination/title policy and
reserved namespaces. Validate `AMS_PROFILE` only after factual code preflight.

Acceptance: source-of-truth guard passes; no readiness flag is promoted without
linked evidence; disabled modules and reserved routes cannot be occupied by CMS
or unrelated pages. Rollback: git-revert the documentation/config slice;
fail-closed readiness values remain unchanged unless their evidence is part of
the same verified change. Gate: STANDARD, or RISKY if env/runtime validation changes.

## HISTORICAL EPIC-75 / CP-08 — ISOLATED STAGING PROOF AND PROGRAM CLOSURE

Outcome: the exact candidate proves all accepted Core 5.5 outcomes on isolated
staging while public staging remains externally noindex, and produces a release
candidate report without touching production.

Scope: run full verification, targeted proofs A/D/E/F/G, public-mode application
SEO crawl behind the isolated test contour, noindex edge smoke, sitemap/metadata/
structured-data validators, performance and rollback rehearsal. Do not change
production, DNS, feed, secrets or indexing.

Acceptance: evidence is bound to exact SHA/image; every URL/error/redirect and
proof result is recorded; unresolved owner/production gates remain explicit;
program reconciliation is clean. Gate: RISKY. Next after merge: CP-09 exact-main
production/indexing release. Feed activation remains separate even after PASS.
Rollback/recovery: restore the prior isolated staging image/config/database
snapshot, remove temporary public-mode test exposure and confirm edge noindex;
production remains untouched.

## HISTORICAL EPIC-76 / CP-09 — PRODUCTION LAUNCH AND PUBLIC INDEXING

Outcome: the complete DON CITY site runs in production from one immutable
exact-main artifact, global noindex is removed, public robots/sitemap/metadata/
canonical/structured data are correct, and indexing is observable and reversible.

Entry conditions: CP-08 PASS on the exact candidate; first production owner,
independent lead/alert channel, external uptime monitoring, durable DB/media
backup freshness and sampled restore, owner-verified NAP, healthy jobs ownership,
rollback image and clean SourceCraft `main`. The release command authorizes the
exact candidate only; any new commit invalidates the evidence.

Scope: one release workflow builds/publishes one immutable artifact, performs
backup preflight, rollout and jobs-owner handoff, switches production indexing
policy to `public`, verifies edge headers and HTML, robots/sitemap shards,
canonical/OG/JSON-LD, lead delivery, monitoring and rollback identity. Submit
only canonical URLs after the live smoke. Do not enable a real feed unless it
has separately passed its feed/allowlist/import safety gate.

Acceptance: home, catalog, representative district/facet/property/static/legal,
404 and gone routes return the intended public robots policy; `/robots.txt` and
`/sitemap.xml` are valid and consistent; all sitemap locations return expected
status; no redirect chain, duplicate canonical or false indexable route exists;
the crawl contains only gated secondary apartments/houses/land/commercial and
approved legal pages, with no newbuild/ЖК URL;
external monitoring and redacted lead delivery are live; exact SHA/image/jobs
owner/backup freshness/rollback point are recorded; post-release crawl passes.

Rollback: restore the previous immutable noindex image and previous indexing
policy without schema rollback unless the release-specific migration plan says
otherwise. Stop on failed backup freshness, health, lead delivery, queue
ownership, SEO crawl, wrong artifact identity or unavailable rollback point.
Gate: one exact-main RISKY release workflow. This is the only epic that may
remove global noindex for this program.

## V9 DEPENDENCY MATRIX

| Epic | Outcome dependency | Type / minimum blocking scope | Parallel-safe / fallback | Wave |
|---|---|---|---|---|
| CP-01 | CP-00 evidence | `CONTRACT`; only central indexing-policy implementation is gated by the frozen evidence | parallel with CP-02A/03/04/06 preflights; preserve global noindex on failure | W2 |
| CP-02A | CP-00 + OD-07/08 | `CONTRACT`; route/scope registry only | parallel with CP-01/03/04/06; keep commercial `PREPARED_OFF` until its data/content gate passes | W3 |
| CP-02 | CP-01 indexing composer + CP-02A route registry | `HARD` only for implementation touching shared metadata/robots/sitemap owners; preflight remains independent | no false empty sitemap fallback; retain noindex on provider failure | W3 |
| CP-03 | CP-00 evidence; task-local OD-03 | `OWNER` only for the affected raw-SQL decision; other recovery work is independent | continue non-SQL tasks; stop on missing test DB/staging isolation | W2 |
| CP-04 | CP-00 media/performance evidence | `CONTRACT`; schema/backfill slice is internally serial | parallel with CP-01/02A/03/06; asset-only slice may remain STANDARD | W3 |
| CP-05 | CP-02 heading/page contract | `CONTRACT` only for shared heading/page files; inventory and scanner work starts independently | preserve current Design System; no redesign fallback | W4 |
| CP-06 | pinned runtime + task-local OD-04 | `OWNER` only for HSTS preload mutation; CSP/HSTS spike is independent | conclude with documented exception/no-change if evidence rejects mutation | W4 |
| CP-07 | factual outputs of CP-01…06 | `SOFT` for early document inventory, `HARD` only for final readiness synchronization | prepare skeleton early; never promote flags without evidence | W5 |
| CP-08 | delivered CP-01…07 exact heads | `HARD`; staging proof must exercise one integrated exact candidate | no production fallback; preserve staging edge noindex | W5 |
| CP-09 | CP-08 PASS + release prerequisites + explicit release command | `PRODUCTION`; isolated from autonomous implementation graph | rollback to previous immutable noindex image; real feed remains separate | W6 |

Cycles: `0`. Shared owners are serialized only at the implementation/delivery
task that touches them; independent preflight/evidence work remains ready.
CP-03 is internally serial for jobs/lead state. CP-08 is the integration
bottleneck by design; CP-09 is an explicit production gate, not an implementation
dependency.

## V9 FINAL-AUDIT FINDING REGISTER

| ID | Severity | Evidence / impact | Resolution | Status |
|---|---|---|---|---|
| F-V8-01 | BLOCKER | Delivered v7 sections and EPIC-52 classified commercial as R2, contradicting OD-07/08 and CP-02A | §33D is current authority; EPIC-52 is superseded; `/donetsk/kommercheskaya/` is frozen for the initial launch scope | RESOLVED v9 |
| F-V8-02 | BLOCKER | `task-manager-inventory.v2.json` described approved v7 and had no CP-01…09 graph | build a new `dc55` schema-v2 draft inventory for active EPIC-67…76; keep v7 Beads history immutable | RESOLVED v9; coverage/cycle validation PASS |
| F-V8-03 | MAJOR | CP-02A said the commercial URL was still to be frozen after evidence, although OD-08 had already decided it | preserve the decided URL; research may refine metadata/content only | RESOLVED v9 |
| F-V8-04 | QUESTION | direct `bd` lookup failed because it is not on PATH | canonical helper Doctor located `bd 1.2.2` and the initialized store | RESOLVED |
| F-V8-05 | LIMIT | SourceCraft API/push works with the owner-authorized temporary PAT, while the canonical Secret Master credential is expired | rotate the PAT/Infisical machine credential before a later session; stop rather than switch provider if access disappears | ACCEPTED LIMIT |
| F-V9-01 | LIMIT | Global Task Manager protocol defines `READY_FOR_OWNER_APPROVAL`, while current canonical `ValidateDraft` accepts only `DRAFT | REVIEW | APPROVED` | keep the exact plan READY, prohibit import, run exact structural graph checks now, and require canonical `Validate` on the owner-approved snapshot before any Beads write | ACCEPTED TOOLING LIMIT |

## V9 FOUR-PASS SCORECARD

```text
Logic / Completeness
  blockers: 0 after F-V8-01/F-V8-03 remediation
  major: 0 open
  result: PASS

Architecture / Data / Security
  blockers: 0
  Payload ownership, DTO/Public Gateway, PII, migrations and production isolation: preserved
  task-local decisions: OD-03 raw SQL; OD-04 HSTS preload
  result: PASS

Dependencies / Autonomy
  cycles: 0
  active epics: EPIC-67…76; EPIC-66 historical evidence
  hard dependencies: CP-02 implementation, CP-08 integration, CP-09 production only
  independent ready waves: CP-01, CP-02A, CP-03, CP-04 and CP-06 preflights
  result: PASS WITH LIMITS

Executability / Evidence / Delivery
  CP-01…08: outcome, scope, acceptance, verification, rollback/stop and delivery gate present
  CP-09: production-only outcome with exact entry, acceptance, rollback and stop conditions
  inventory: dc55 schema v2 draft; coverage 10/10, 45 tasks
  result: PASS WITH TOOLING LIMIT; REVIEW snapshot ValidateDraft PASS,
          exact READY structural validation PASS, APPROVED Validate required before import
```

## V9 NIGHT RUN READINESS

```text
Result: READY_WITH_LIMITS
Critical path: CP-01 + CP-02A → CP-02 → CP-05/07 → CP-08 → [PRODUCTION OWNER GATE] → CP-09
Independent work: CP-03, CP-04 and CP-06 spike can proceed beside the SEO chain
Owner decisions before approval: 0
Later task-local owner decisions: OD-03, OD-04
External prerequisite: SourceCraft credential currently proven, rotation required before a later session
Tooling limit: canonical ValidateDraft enum omits READY; import remains forbidden until APPROVED Validate PASS
Production-only stop: CP-09 and any removal of global noindex
Safe bypass: a blocked raw-SQL/HSTS task releases its claim and the Developer continues another ready stream
```

## OWNER DECISION REGISTER — v9 FINAL AUDIT

| ID | Decision | Recommendation | Blocks | Deadline | Status |
|---|---|---|---|---|---|
| OD-03 | Raw SQL that cannot be replaced by a supported conditional Payload operation | Approve only a narrow ADR-backed exception with atomicity/concurrency tests | affected CP-03 implementation | before affected task | OPEN |
| OD-04 | HSTS `preload` for the domain/subdomain estate | Do not preload until every applicable subdomain and long-term HTTPS commitment are proven | CP-06 header mutation | before CP-06 delivery | OPEN |
| OD-05 | Canonical AMS UI Core 5.0 source | Use the owner-provided `AMS_UI_CORE_v5.0_FINAL.md` as the normative UI baseline; retain project-specific values in the Design System/globals.css | resolved source prerequisite; implementation conformance remains CP-05 work | decided 2026-09-27 | DECIDED: PROVIDED |
| OD-06 | End-state indexing policy | Launch the complete verified site as `public`; keep staging externally noindex and keep feed activation separate | CP-09 | decided 2026-09-27 | DECIDED: PUBLIC |
| OD-07 | First-four-month indexable product scope | Secondary apartments, houses, land, commercial real estate and legal department; newbuild/ЖК remains disabled and non-indexable | CP-02A, CP-02, CP-09 | decided 2026-09-27 | DECIDED |
| OD-08 | Exact commercial and legal route registry | Preserve `/donetsk/kommercheskaya/`; launch legal department at `/yurist/`; child legal routes stay absent/non-indexable until a factual service/content contract | CP-02A | decided 2026-09-27 | DECIDED |
| OD-09 | Collision-safe execution identity for Core 5.5 | Use `AMS-DON-CITY-CORE55-POSTPROD`; preserve the former v7 plan identity and all historical ledgers unchanged in the same `.beads` store | Task Manager import and Developer handoff | decided 2026-09-27 | DECIDED |

## FINAL-AUDIT READINESS

Current result: `READY_WITH_LIMITS`; exact v9 is owner-`APPROVED` and may enter canonical validation/import/reconciliation.

- Four independent audit passes are recorded above; blocker findings are resolved in v9.
- CP-00 factual evidence is complete and remains historical assembly evidence.
- OD-03/OD-04 block only their affected implementation decisions, not approval or independent ready work.
- Existing v7 graph/history must not be overwritten; v9 uses Plan ID
  `AMS-DON-CITY-CORE55-POSTPROD` and a new `dc55` plan-scoped inventory, with
  clean validation/reconciliation required before Developer claim.
- The temporary SourceCraft credential is a declared external limit. Loss of
  access stops Git-dependent delivery until canonical Secret Master rotation;
  it never permits a fallback provider or secret exposure.
- Production/indexing is now an explicit planned outcome in CP-09, isolated
  behind exact-main readiness and release authorization rather than excluded.

# 34. FUTURE AFTER THE CORE 5.5 PROGRAM

Possible owner-approved modules: MULTI_GEO, residential rent, room, garage, cottage villages, journal, employees, and `/yurist/[service]/` only if Webmaster + actual service portfolio justify.

---

# 35. CRITICAL ACCEPTANCE CHECKLIST

- [ ] One active Master Plan only: `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md`.
- [ ] V3 snapshot is archived and marked `SUPERSEDED`; old Task Manager graph is non-claimable.
- [ ] City-first listing grammar is the only active owner: `/{geo}/{category}/{sub}/`, maximum three segments.
- [ ] All public URL consumers use typed `buildUrl`; literal-path and registry-url guards pass.
- [ ] Platform contains no DON CITY/Donetsk literals and does not import Project.
- [ ] Site Profile is the single owner of category/geo statuses, thresholds and facet whitelist.
- [ ] `PREPARED_OFF` categories return 404 and appear in no sitemap/menu/link output.
- [ ] Global property URLs contain category + semantic + publicUrlId and no geo.
- [ ] Resolver negative matrix and single-hop redirect behavior pass.
- [ ] City slug, district slug and facet/category collision guards pass.
- [ ] District uniqueness is `(city, slug)` and feed matching is city-scoped.
- [ ] No other active doc duplicates URL map or Title/H1/Description.
- [ ] Old SEO Passport archived and marked SUPERSEDED.
- [ ] v2.2 archived and marked SUPERSEDED.
- [ ] Legacy all-property route is absent outside CHANGELOG.
- [ ] `/donetsk/` is index,follow with exact ALL metadata.
- [ ] Menu `Вся недвижимость` → `/donetsk/`.
- [ ] Textilshchik works with `parent=null`; URL independent of parent.
- [ ] Breadcrumb parent does not change canonical URL.
- [ ] Filter separates administrative districts and microdistricts.
- [ ] Textilshchik raw mapping works; unknown district does not hide property.
- [ ] Fallback broad is null/empty, never invented.
- [ ] Tier rule is explicit: P1 broad>=100, P2 broad=50–99, TEST broad missing/fallback.
- [ ] Index thresholds are numeric: P1>=5, P2>=5, TEST>=10, all plus Content Gate (§16A).
- [ ] Day-60 tier review is in EPIC-49.
- [ ] `vtorichka` facet absent R1.
- [ ] 1/2/3-room facets are candidates.
- [ ] dacha/IZH/SNT are TEST with blank broad.
- [ ] Single approved facet uses path navigation.
- [ ] Query equivalent canonical points to active path facet.
- [ ] `?district={slug}` transitions/canonicalizes to district path only after district Gate; otherwise canonical is category×Donetsk base.
- [ ] Administrative district and microdistrict metadata templates exist in §25; Textilshchik renders `на Текстильщике` correctly.
- [ ] Content Gate is defined only in §16A; other sections reference it.
- [ ] Every property page contains the `Юридическая проверка объекта` block targeting `/yurist/`, with `formKind=legal`.
- [ ] `/yurist/[service]/` absent R1.
- [ ] Newbuild/ЖК stays disabled and absent from sitemap/navigation for the first four months; any activation requires a new owner-approved plan.
- [ ] Commercial launch owner is `/donetsk/kommercheskaya/`; metadata/content and inventory gate are proved by CP-02A.
- [ ] houseType includes dacha + part_of_house.
- [ ] room + garage PREPARED_OFF.
- [ ] landCategory/permittedUse/plotAreaSotka implemented.
- [ ] property resolver uses publicUrlId.
- [ ] semantic mismatch → one 301.
- [ ] publicUrlId survives same externalId relisting.
- [ ] price absent from slug.
- [ ] IndexNow implemented.
- [ ] sitemap lastmod meaningful.
- [ ] one NAP source.
- [ ] RealEstateAgent uses same NAP.
- [ ] Webmaster region setup is release checklist.
- [ ] Nearby geo route exists only for published geo with >=1 active object in category; otherwise 404; R1 page is noindex/not sitemap/not menu.
- [ ] Nearby city hub and category rules are separate; nearby district routes are 404.
- [ ] Two-profile proof enables Makeevka without product-code changes.
- [ ] actual starter `/obekty/[slug]` handled.
- [ ] package/docs Payload drift handled EPIC-01.
- [ ] all 50 Wordstat rows embedded.
- [ ] seed CSVs are data only.
- [ ] Sitemap/robots/IndexNow contain only grammar-owned V4 canonical URLs.
- [ ] Cache tags and analytics include geo identity (`geo_slug`, `page_key`).

---

# 36. FINAL EXECUTION ORDER

```text
HISTORICAL: v7 RP-00…RP-12 and EPIC-00…49 delivery evidence is reused, not replayed.
DEFERRED: EPIC-50 newbuild/ЖК and EPIC-51 mortgage require separate owner-approved plans.
SUPERSEDED: EPIC-52 commercial activation is replaced by CP-02A.

CP-00  Factual preflight / contract freeze — completed assembly evidence
CP-01  Release-level indexing safety
CP-02A First-four-month product/indexing scope
CP-02  SEO surface / sitemap / lifecycle
CP-03  Jobs / import / lead safety
CP-04  Media / request-path performance
CP-05  UI role / accessibility convergence
CP-06  Transport-security decisions
CP-07  Core 5.5 project/readiness documentation
CP-08  Isolated staging proof / program closure
CP-09  Production launch / public indexing — explicit release command only
```

---

# 37. PR TEMPLATE

```text
Goal
Scope
Files changed
Architecture impact
Schema impact
SEO / URL impact
Seed impact
Migrations
Tests
Verification
Known limitations
Rollback
Exact PR head SHA
```

After merge: record new SourceCraft main SHA, delete branch, next Epic starts from fresh main.

---

# 38. FINAL FORMULA

```text
AMS REALTY BAZA STARTER
+
ONE MASTER PLAN
+
EMBEDDED SEO REGISTRY
+
DONETSK / DISTRICTS / TEXTILSHCHIK
+
CITY-FIRST GEO × CATEGORY
+
TYPED GRAMMAR / DETERMINISTIC RESOLVER
+
WHITELIST PATH FACETS
+
PUBLIC URL ID
+
SECONDARY INVENTORY
+
INDEXNOW / LASTMOD
+
NAP / REAL ESTATE AGENT
+
DEFERRED NEWBUILD / MORTGAGE DOMAINS
+
SOURCECRAFT
+
TIMEWEB
=
DON CITY V4
```

Главный принцип: районы и микрорайоны — полноценные SEO entities вторичного рынка, а не просто UI-фильтры.

Второй: `/donetsk/` владеет общим интентом недвижимости, Home — агентством/риелтором/брендом.

Третий: отсутствие Wordstat frequency означает пустой broad, а не выдуманное число.

Четвёртый: Textilshchik может иметь `parent=null`; parent не меняет URL.

Пятый: approved facet владеет path URL; query equivalent не становится главным внутренним SEO URL.

Шестой: newbuild/ЖК и mortgage не смешиваются с текущим запуском; commercial входит в owner-approved first-four-month scope через CP-02A.

Седьмой: единственный active master plan — `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md`.

Восьмой: Platform не знает Донецк или ДОН СИТИ; Project Profile и данные
инъецируют географию, бренд, статусы и SEO ownership.

# 39. V12 ACTIVE CONFORMANCE PROGRAM

Этот раздел является единственным активным execution contract версии v12.
Разделы §33D и §35–38 сохраняются как historical v9 evidence и не определяют
новые claims, thresholds, production status или порядок выполнения там, где
они конфликтуют с §39.

## 39.1 MASTER PLAN MAP

```text
Primary goal:
  привести публичный DON CITY к непротиворечивому LIVE_PUBLIC состоянию,
  синхронизировав продукт, runtime, SEO, geo, legal, UI и документацию.

Non-goals:
  production rollout без отдельной release-команды;
  включение real feed;
  публичная активация новостроек/ЖК, ипотеки, аренды, журнала и иных future modules;
  второй ORM/backend/auth/CMS/UI foundation;
  подмена фактической географии объектам рядом с Донецком;
  переписывание historical evidence.

Major outcomes:
  active docs и runtime различают CURRENT/TARGET/PROOF;
  public surface ограничен owner allowlist;
  commercial является active secondary-sale category;
  единый Content Gate использует minActive=3 и persistent grace state;
  Donetsk и nearby locality не смешиваются;
  legal/consent/NAP contract доказан;
  один canonical shell и одна UI foundation;
  exact candidate проверяется до release, exact live identity — после release.
```

Shared foundations:

- Payload остаётся единственным владельцем schema/auth/migrations;
- Public Gateway → explicit select → DTO остаётся единственным public data boundary;
- URL строится только через typed `buildUrl`; literal catalog href запрещён;
- один Site Profile владеет project module/indexing/gate configuration;
- один SEO registry владеет materialized page contracts;
- `src/app/globals.css` владеет числовыми design values;
- `site-settings` владеет canonical NAP/legal identity;
- active documents следуют `ONE FACT → ONE OWNER DOCUMENT`.

Data/schema changes:

- controlled idempotent repair существующих `city`/`district` relations;
- persistent `lastGatePassedAt` / `belowThresholdSince` либо эквивалентный
  project-owned SEO state без mutation из public GET;
- расширение существующей geo entity полями locality kind, coordinates,
  agglomeration membership/distance/verification; вторая geo collection запрещена;
- consent evidence использует canonical names `consentAccepted`,
  `consentVersion`, `consentedAt`, `formKind`, `sourcePage`.

Security-sensitive areas:

- schema/backfill, lead consent, PII analytics, outbound delivery, headers/CSP,
  production backup/restore и jobs ownership классифицируются `RISKY`;
- secrets и PII не входят в docs, task cards, logs и evidence;
- production mutation, DNS, indexing rollback and deploy остаются
  `PRODUCTION` dependencies.

## 39.2 ACTIVE OWNER CONTRACT

### Product and public surface

```text
ACTIVE NOW:
  market=secondary
  dealType=sale
  category=apartment|house|land|commercial
  /, /donetsk/, four Donetsk category routes,
  /prodat-nedvizhimost/, /yurist/, /o-kompanii/, /kontakty/,
  eligible property, district and approved facet pages,
  privacy, consent, thank-you and platform error surfaces.

PREPARED_OFF FOR 4–6 MONTHS:
  newbuild/ЖК, mortgage, rent, journal, rooms, garages and other future modules.
```

Prepared modules have zero menu/footer links, CTAs, home blocks, sitemap rows,
IndexNow submissions and indexable registry rows. Reserved namespaces may remain.

### Indexing and gate

- production is `LIVE_PUBLIC`; staging remains `noindex`;
- `ALWAYS_INDEX`: home, `/donetsk/`, Sell, Lawyer, About and Contacts;
- `GATED_INDEX`: category×geo, district, approved facet and later approved
  agglomeration/locality pages;
- all gated pages use `minActive=3`; P1/P2/TEST remain research/content priority only;
- gated pages also require exact registry metadata, owner-approved unique SSR
  introduction of at least 600 characters, SSR property links and clean canonical;
- a page never passing Gate is `noindex,follow` below three objects;
- a previously indexable page at zero objects becomes immediate `noindex` and
  leaves sitemap; at one or two objects it may keep indexability for at most
  30 calendar days using persistent state maintained outside public GET;
- an active property has its own quality gate: status/publishedAt/publicUrlId,
  category, price, applicable area, actual geo, factual description and at least
  three project-owned photos.

### Geo

- primary mode remains `SINGLE_GEO`, primary geo `donetsk`;
- exactly nine Donetsk administrative districts are seeded with stored inflections;
- Textilshchik remains an approved microdistrict SEO candidate;
- unknown district produces `district=null + needsReview=true`, never a default;
- nearby property never contributes to Donetsk counts or Donetsk address metadata;
- agglomeration membership requires owner whitelist, verified coordinates and
  Haversine distance not exceeding 50 km from the approved primary point;
- candidate localities are research inputs, not production whitelist;
- agglomeration routes remain non-public until SEO evidence and later owner decision.

### Legal, navigation and SEO transport

- privacy and separate consent are `200 noindex,follow`; thank-you is
  `200 noindex,nofollow`;
- `/usloviya-raboty/` is `200 noindex,follow` with a footer link only when
  approved legal content exists, otherwise it is `404` with zero links;
- contract files are managed files with `X-Robots-Tag: noindex, nofollow` and
  are excluded from sitemap;
- navigation exposes only active product routes; NAP/legal requisites come
  from one factual source;
- robots removes project dependency on `Host`, includes `fbclid` in Clean-param,
  retains media allowlist and canonical sitemap;
- sitemap contains only `200`, canonical, published, eligible, gate-passed URLs;
- mirror hosts redirect in one hop; pagination follows the v10 owner policy;
- structured data uses factual property type and actual locality.

### UI and headers

- one Header, Footer, mobile navigation and Site Shell implementation;
- shadcn/project-local primitives are the only UI foundation; speculative public
  exports are removed or isolated from the active package surface;
- the unapproved second lightbox library is replaced by an approved project-local
  Dialog/gallery composition unless the owner later records an exception;
- one H1 and logical heading hierarchy; Sell/Lawyer/About/Contacts receive
  page-specific semantic composition through reuse/variants;
- header ownership is one-per-header between Nginx and Next; enforced CSP is not
  downgraded, wildcards are not broadened, and Yandex origins are allowlisted only
  when required by actual analytics configuration.

### Simple infrastructure, database and access

- one persistent production database only: the canonical Timeweb Managed
  PostgreSQL; no second persistent cloud/staging/shadow/mirror database;
- production DB is never shared with a staging or test runtime;
- migrations and backfills are rehearsed against disposable local native
  PostgreSQL/fixtures or a temporary isolated restore contour removed before release;
- no new production server, database, broker, cache, search engine or parallel
  runtime is provisioned without a separate owner decision;
- SourceCraft is the primary Git service; Git HTTPS and SourceCraft REST access
  use only Secret Master `git-services/prod/` inside the current process;
- project server/DB/registry/application secrets use an explicitly discovered
  project-specific Secret Master scope; no credential is copied into docs, Git,
  chat, command output or another scope;
- missing/expired Secret Master access is a stop condition. Saved local Git
  credentials, MCP tokens, interactive Git Credential Manager and another secret
  project are not fallbacks.

### Final production rule

- all R1.1, R1.2, UI, legal, geo, SEO and documentation implementation merges
  converge into one exact `main` candidate;
- one exact-head final documentation audit and one `RISKY` SourceCraft gate run
  immediately before the release;
- production is the mandatory final plan stage after an explicit owner release command;
- the release stage includes artifact build, rollout, bounded live smoke/crawl,
  rollback proof and factual update of OPERATIONS/DELIVERY_STATE/checklist/backlog/
  README/changelog;
- after that release stage closes, this plan creates no additional monitoring,
  observation, Day-N, post-production reconciliation or follow-up task;
- backup/restore, one jobs owner, health and required availability readiness are
  proved before release, not scheduled as new work after it.

## 39.3 DOCUMENT OWNERSHIP

| Fact | Owner document | Runtime/code owner |
|---|---|---|
| product scope and owner decisions | `docs/01_PRD.md` | Site Profile/module policy |
| public pages, navigation and indexability | `docs/02_PRODUCT_STRUCTURE.md` | resolver/navigation/SEO projection |
| data/security/topology boundaries | `docs/03_ARCHITECTURE.md` | Payload/core/project boundaries |
| factual project configuration | `docs/PROJECT.md` | project config/Site Profile |
| live/staging identity and operations | `docs/OPERATIONS.md` + `DELIVERY_STATE.yaml` | immutable artifact/runtime |
| visual policy | `docs/DESIGN.md` | `globals.css` + canonical UI tree |
| geo/URL/SEO gate/execution detail | this Master Plan | typed grammar/registry/gate |
| current work only | `docs/04_BACKLOG.md` | Task Manager after approval |
| current release gates | `docs/05_RELEASE_CHECKLIST.md` | release workflow/evidence |

`docs/06_DESIGN_SYSTEM.md` remains a superseded pointer. Research, replan,
archive and changelog preserve history but do not own current facts.

## 39.4 COMMON EPIC CONTRACT

Every implementation epic uses:

```text
Source of Truth: §39 plus named owner documents/code surfaces
Scope out: production, DNS, secret mutation, destructive action and unrelated refactor
Entry: dependencies satisfied; fresh origin/main worktree; no source drift
Exit: deterministic acceptance + required verification + DOC IMPACT record
Delivery: one epic/independent stream = one PR; MERGE_AFTER_GATE after approval
Evidence: EXECUTION_LEDGER_V1, pushed exact head SHA, changed files and checks
Rollback: epic-specific code/config/data recovery path
Stop: unknown production identity, unsafe data mapping, missing approved copy,
      external credential/owner gate, cycle, source drift or unplanned scope
```

Schema/data/access/PII/runtime/security epics use one exact-head `RISKY` gate.
Presentation-only UI/docs epics default to `STANDARD`, unless their actual diff
touches a risky boundary. A PR is not production authorization.

## 39.5 EXECUTION EPICS

### EPIC-100 — DC10-DOC-00
### EPIC-101 — DC10-OPS-00
### EPIC-102 — DC10-R11-00
### EPIC-103 — DC10-R11-01
### EPIC-104 — DC10-R11-02
### EPIC-105 — DC10-R11-03
### EPIC-106 — DC10-R11-04
### EPIC-107 — DC10-R11-05
### EPIC-108 — DC10-R12-01
### EPIC-109 — DC10-R12-02
### EPIC-110 — DC10-R12-03
### EPIC-111 — DC10-R12-04
### EPIC-112 — DC10-R12-05
### EPIC-113 — DC10-R12-06
### EPIC-114 — DC10-UI-01
### EPIC-115 — DC10-UI-02
### EPIC-116 — DC10-UI-03
### EPIC-117 — DC10-UI-04
### EPIC-118 — DC10-UI-05
### EPIC-119 — DC10-UI-06
### EPIC-120 — DC11-DOC-FINAL
### EPIC-121 — DC11-PROD-FINAL

| Epic | Observable outcome | Depends on | Acceptance / verification | Risk |
|---|---|---|---|---|
| `DC10-DOC-00` | active docs express owner target without presenting pending code as current | none | convergence matrix; active links; zero direct status contradictions in target contract; `quality:docs-sot` extended/self-tested | STANDARD |
| `DC10-OPS-00` | required backup/restore, one jobs owner, health/availability and Secret Master access are ready before the final release | none | read-only preflight first; one persistent production DB; no secret values; no post-release monitoring task | RISKY |
| `DC10-R11-00` | exact production inventory/geo/indexability matrix exists without mutation | none | redacted factual matrix covering every published record; counts reconcile | RISKY/read-only |
| `DC10-R11-01` | published records have actual city relation and safe district mapping | R11-00 + DOC target contract | idempotent Payload migration/backfill; unknown district review path; non-empty fixture and rollback proof | RISKY |
| `DC10-R11-02` | commercial resolver returns only commercial inventory | DOC target contract | both canonical/compat routes resolve category=commercial; targeted query/route tests | STANDARD unless data boundary changes |
| `DC10-R11-03` | public HTML contains only allowlisted active product routes and DTO/buildUrl links | DOC target contract | no `/nedvizhimost`; no inactive CTA/link/sitemap/IndexNow; literal-href guard | STANDARD |
| `DC10-R11-04` | all gated owners use minActive=3 and persistent 30-day state | DOC target + R11-00 contract | registry/Site Profile/runtime/seeds equal; public GET is read-only; zero-object and grace transitions tested | RISKY |
| `DC10-R11-05` | robots/sitemap/mirrors/errors/pagination match v10 policy | R11-03 + R11-04 contracts | HTTP proof for robots, sitemap, 404/410, pagination, canonical and one-hop mirrors | STANDARD/RISKY by runtime diff |
| `DC10-R12-01` | nine Donetsk districts and Textilshchik have canonical forms and gate behavior | R11-01 + R11-04 | seed uniqueness, stored inflections, mapping and landing tests | RISKY |
| `DC10-R12-02` | existing geo model safely represents verified nearby localities without calling them Donetsk | R11-01 contract | Payload migration, Haversine/radius/whitelist/needsReview tests; no second collection | RISKY |
| `DC10-R12-03` | agglomeration activation recommendation is backed by dated search/Wordstat/SERP evidence | R12-02 contract | sources/date per claim; no invented demand numbers; recommended slug/list/priorities | STANDARD research |
| `DC10-R12-04` | only owner-approved agglomeration/locality routes can become reachable | R12-02 + R12-03 + later owner decision + R11-04 | typed URLs, separate counts, actual locality metadata, 404/no-link pre-gate behavior | RISKY |
| `DC10-R12-05` | consent/terms/NAP contract is factual, conditional and privacy-safe | DOC target contract | server rejects missing consent; canonical evidence names; conditional terms/PDF behavior; no PII analytics | RISKY |
| `DC10-R12-06` | JSON-LD uses factual property type/locality and visible service facts | R11-01 + R12-02 contracts | validator fixtures for apartment/house/land/commercial/lawyer; no invisible FAQ | STANDARD |
| `DC10-UI-01` | speculative inactive public exports are removed or isolated | DOC target contract | export/import inventory; active route build unaffected; future modules unreachable | STANDARD |
| `DC10-UI-02` | one canonical production shell owns header/footer/mobile navigation | UI-01 contract | one active implementation tree; compatibility aliases documented and non-duplicative | STANDARD |
| `DC10-UI-03` | property gallery uses approved primitives with keyboard/focus/reduced-motion proof | UI-02 contract | second library removed or explicit exception recorded; dialog/gallery interaction tests | STANDARD |
| `DC10-UI-04` | shared marketing composition has one H1 and no skipped primary levels | UI-02 contract | semantic/axe-oriented checks across representative pages | STANDARD |
| `DC10-UI-05` | Sell/Lawyer/About/Contacts have distinct factual semantic compositions | UI-04 + page briefs | page-specific acceptance, mobile states, one primary conversion each | STANDARD |
| `DC10-UI-06` | token/component drift is reduced only with mechanical evidence | UI-01…05 | tokens report, UI Core, drift and accessibility checks; no speculative token deletion | STANDARD/RISKY if primitive API changes |
| `DC11-DOC-FINAL` | one exact final candidate SHA has zero P0/P1 active-document contradictions after all R1.1/R1.2/UI work | all implementation epics | docs/registry/runtime matrix; `quality:docs-sot`, docs links/release-state/SEO-doc guards; exact candidate identity | STANDARD |

`DOC IMPACT` is mandatory inside every implementation PR and is not a separate
parallel state machine. It records documents changed, documents reviewed with no
change, owner document, CURRENT→TARGET transition and proof.

## 39.6 PRODUCTION-ONLY EPICS

These nodes have no autonomous implementation task before an explicit release command:

| Epic | Outcome | Entry | Proof |
|---|---|---|---|
| `DC11-PROD-FINAL` | the fully approved exact-main candidate is released once as the mandatory final plan stage | all implementation epics + DC11-DOC-FINAL + exact-head RISKY SourceCraft gate + explicit owner release command | immutable identity, one rollout, bounded live smoke/crawl, rollback proof and factual live-document reconciliation inside this same stage |

Public indexing remains on unless a separately authorized incident response says
otherwise. This statement does not authorize deploy, DNS, secret or database writes.

## 39.7 DEPENDENCY MATRIX AND WAVES

| Wave | Ready work | Dependency class | Parallel safety / fallback |
|---|---|---|---|
| W0 | DOC-00, OPS-00 baseline preflight, R11-00 | independent roots | each preflight commits a durable baseline/contract artifact in its own worktree; no production mutation; an external ops blocker does not stop docs/inventory |
| W1 | R11-02, R11-03, R11-04 contract/data work; R11-01 after inventory | `CONTRACT` except R11-01 `HARD` on diagnostic | resolver/surface/gate streams freeze shared URL/Site Profile owners before merge |
| W2 | R11-05, R12-01, R12-02, R12-05, UI-01 | minimal task dependencies | schema owners serialize migrations; UI stays independent of data migrations |
| W3 | R12-03 research, R12-06, UI-02…06 | contract-first | research failure does not stop legal/UI/structured-data work |
| W4 | R12-04 | `OWNER` + `HARD` on approved research/model | if blocked, continue DOC-02 and other ready work; routes remain unreachable |
| W5 | DC11-DOC-FINAL | `HARD` on all implementation delivery | returns an affected epic to implementation on contradiction |
| W6 | DC11-PROD-FINAL | `PRODUCTION` | mandatory last stage; one release; no task follows it |

Shared-file owners:

- Site Profile/SEO registry/gate: R11-04 freezes contract before R11-05/R12-04;
- Payload geo schema/migrations: R11-01 then R12-02/R12-01 in migration order;
- navigation/route registry: R11-03 before R11-05 and later R12-04;
- canonical shell/primitives: UI-01 then UI-02/03, UI-04/05, UI-06;
- active docs: DOC-00 establishes ownership; every later epic updates its owner docs.

There are no whole-epic dependencies where a contract freeze is sufficient.
Production is not on the implementation critical path.

## 39.8 OWNER DECISION REGISTER

| ID | Decision | Deadline | Status |
|---|---|---|---|
| OD10-01 | stable Plan ID remains `AMS-DON-CITY-CORE55-POSTPROD`; v11 uses collision-safe prefix `dc11` and does not overwrite v9 | before approval | SUPERSEDED by OD11-11 after the v11 final audit proved canonical import collision |
| OD10-02 | implementation epics use `MERGE_AFTER_GATE`; one mandatory final production epic requires a separate release command | before approval | DECIDED |
| OD10-03 | production state is `LIVE_PUBLIC`; global noindex is not a remediation fallback | before approval | DECIDED + HTTP-observed |
| OD10-04 | agglomeration public slug and locality whitelist | before R12-04 | OPEN LATER; recommendation after R12-03 |
| OD10-05 | approved legal terms/contract content and optional managed file | before R12-05 publication step | OPEN LATER; absent content means 404/zero links |
| OD10-06 | one final production rollout after the complete program | before DC11-PROD-FINAL | OPEN PRODUCTION GATE |
| OD10-07 | future newbuild/ЖК or mortgage activation | after 4–6 month review | OPEN FUTURE; no current work blocked |
| OD11-08 | exactly one persistent production database; no persistent staging/shadow/mirror DB | before approval | DECIDED |
| OD11-09 | SourceCraft and all credentials are read only from canonical Secret Master scopes with no fallback | before approval | DECIDED + VERIFIED: `git-services/prod/` names-only, SourceCraft REST and Git PAT transport pass |
| OD11-10 | no separate monitoring or follow-up stage after final production | before approval | DECIDED; bounded release smoke remains inside final stage |
| OD11-11 | isolate the changed v12 graph from immutable v9 managed IDs in the one existing Task Manager store | before approval | DECIDED: Plan ID `AMS-DON-CITY-LIVE-CONFORMANCE`, prefix `dc11`; preserve all v9 history |

Before-approval owner decisions: `0`. Critical external prerequisites open: `0`.

## 39.9 FINDING REGISTER

| ID | Severity | Finding and evidence | Resolution |
|---|---|---|---|
| V10-F01 | BLOCKER | v9 `APPROVED` graph conflicts with new owner contract | RESOLVED: v10 REVIEW, new identity/prefix required, no v9 claim/upgrade |
| V10-F02 | BLOCKER | multiple production/post-production nodes complicated the owner-required simple delivery path | RESOLVED in v11: one mandatory final production node; no node follows it |
| V10-F03 | MAJOR | active docs report LIVE_NOINDEX while live homepage/robots are public | ACCEPTED: DOC-00 + exact post-release reconciliation |
| V10-F04 | MAJOR | plan/runtime/seeds encode 5/10 inventory thresholds | ACCEPTED: R11-04 owns one gate and mechanical equality proof |
| V10-F05 | MAJOR | nearby route/model can misstate locality or Donetsk counts | ACCEPTED: R12-02 foundation + owner-gated R12-04 |
| V10-F06 | MAJOR | second lightbox dependency conflicts with one-foundation UI rule | ACCEPTED: UI-03; explicit exception remains possible only by owner decision |
| V10-F07 | MAJOR | owner packet listed actions but not complete task dependencies/evidence | RESOLVED: §39.4–39.7 contracts, waves and proof |
| V10-F08 | MINOR | requested docs guard script names are not all present today | ACCEPTED: DOC-00/DOC-02 must add or extend guards rather than claim they ran |
| V10-F09 | LIMIT | two legacy v6 issues remain `in_progress` in shared historical Beads store | ACCEPTED LIMIT: exclude by new plan identity; reconcile separately without rewriting ledgers |
| V11-B01 | BLOCKER | Secret Master names-only request returned `403 token expired`; SourceCraft fallback is forbidden | RESOLVED: dedicated Universal Auth credential restored; `codex-cursor-ai` joined the canonical Git Services project as Admin; local mapping corrected; names-only access, SourceCraft REST `200` and PAT-backed Git transport passed without fallback |
| V11-F02 | MAJOR | prior v10 graph had two releases and post-production reconciliation/monitoring-shaped work | RESOLVED: all implementation converges into DC11-DOC-FINAL → DC11-PROD-FINAL, and nothing follows production |
| V11-F03 | MAJOR | previous wording allowed a persistent isolated staging database | RESOLVED: one persistent production DB; disposable local/temporary isolated proof only, never shared with production |
| V11-B02 | BLOCKER | the existing single Task Manager store has 55 closed v9 managed nodes under the same Plan ID, while v11 changes the managed ID set; canonical Import must reject that drift | NEEDS_OWNER: preserve v9 history and assign v11 a new collision-safe Plan ID; do not create a second store or rewrite old ledgers |
| V11-F04 | MINOR | header and §39 still called the active v11 snapshot a v10 review/contract | RESOLVED during final audit |
| V12-F01 | BLOCKER | v11 reused the immutable v9 Plan ID and could not be imported safely | RESOLVED by owner decision: v12 uses `AMS-DON-CITY-LIVE-CONFORMANCE` with prefix `dc11` in the existing single store; v9 history remains untouched |
| V12-L01 | LIMIT | the existing single stealth Task Manager store is currently attached to another registered checkout, while the exact v12 source is in this plan worktree | ACCEPTED LIMIT: before import, attach the same store to the exact approved checkout or co-locate the exact approved source with the existing store; never initialize a second store; ambiguity is a stop condition |
| V13-B01 | BLOCKER | v12 stage cards inherited final epic acceptance while PREFLIGHT prohibited the non-empty diff required by the ledger | RESOLVED IN REVIEW: stage-specific goals, acceptance, checks and actions preserve stable IDs and make each card independently completable |
| V13-B02 | BLOCKER | plan-owned dynamic records failed when approved graph prefix differed from historical store prefix | RESOLVED EXTERNALLY: global helper `ec1db77`, SourceCraft `skill-risky` run `164`; v13 keeps the existing single store unchanged |

Open blockers: `0`. Open major findings: `0`. Needs-owner before approval: `0`.

## 39.10 V13 FINAL-AUDIT READINESS

```text
Logic / completeness:
  PASS — all implementation converges into one final candidate and one
  mandatory production stage; no stage follows production.

Architecture / data / security:
  PASS — one persistent production DB, disposable isolated proof only,
  canonical Secret Master scopes and no credential fallback are explicit.

Dependencies / autonomy:
  PASS — draft inventory validation covers 22/22 epics and 84 task cards with
  zero cycles; the single production node has no autonomous task.

Executability / evidence:
  PASS — stage-specific task contracts match exact ledger requirements; all
  84 task IDs remain stable; the cross-prefix helper repair is merged and
  independently gated. Canonical draft validation passes.

Independent safe work after approval:
  W0 docs and inventory diagnostic; delivery uses only Secret Master and stops
  fail-closed if that canonical access later becomes unavailable.

Critical path:
  DOC-00 → R11/R12/UI implementation → DC11-DOC-FINAL → DC11-PROD-FINAL.

Expected stops:
  later agglomeration/legal decisions; final explicit production authorization.

Night Run Readiness: READY_WITH_LIMITS
Reason: product, dependency, access, stable-ID upgrade and dynamic blocker
prerequisites pass. Later agglomeration/legal decisions and the final production
command remain isolated owner gates. The v13 upgrade and Developer resume require
new exact owner approval; a second store or graph re-import remains forbidden.
```

## 39.11 V13 DEFINITION OF DONE

- active documents have one owner per fact and no current-status contradictions;
- public runtime exposes only active product and factual geo;
- commercial category isolation, gate=3, grace state, sitemap/robots/canonical,
  404/410 and pagination are mechanically verified;
- nine districts, Textilshchik and nearby locality rules are proven;
- legal/consent/NAP and PII analytics boundaries are proven;
- one shell/UI foundation, semantic page composition, responsive/accessibility
  and token/drift evidence are recorded;
- every merged epic includes DOC IMPACT and exact-head ledger;
- exact candidate passes DC11-DOC-FINAL before the one release request;
- exactly one persistent production database exists; no staging/shadow/mirror DB;
- SourceCraft and other credentials are consumed only from canonical Secret Master scopes;
- final production is mandatory and last; its bounded smoke, exact identity,
  rollback and factual docs reconciliation close the plan;
- no additional monitoring, observation, post-production reconciliation or
  follow-up task is created after DC11-PROD-FINAL.

# END
