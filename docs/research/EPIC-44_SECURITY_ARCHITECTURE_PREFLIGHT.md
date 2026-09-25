# EPIC-44 — security / architecture audit preflight

Plan: `AMS-DON-CITY-REPLAN-V4-CITY-FIRST v7`

Date: 2026-09-25

Base main: `28ee099e103d5d21e094fdc26a7df4cccaedc332`

## Canonical contract

EPIC-44 audits the current repository for Payload access boundaries, stable
`publicUrlId`, district/facet guards, feed normalization, NAP ownership,
IndexNow key handling, lead PII, media/S3 and backup posture. Completion requires
zero validated P0/P1 findings. The audit does not authorize production, server,
DNS, secret or database mutation.

## Entry conditions

- RP-12 and EPIC-39, EPIC-40, EPIC-41 and EPIC-43 are closed dependencies in
  the approved graph; the audit therefore starts from the integrated runtime,
  analytics, cache, accessibility and feed-onboarding state.
- `DELIVERY_PROFILE=CRITICAL`; confirmed findings are evaluated against real
  lead PII, CMS authentication and persistent catalog data risks.
- Payload is the only schema/auth owner. Public reads must use the Public
  Gateway with explicit access, selection and DTO boundaries; system overrides
  remain allowlisted operations only.
- Existing provider evidence confirms a managed PostgreSQL backup posture, but
  restore execution and production credential rotation belong to later explicit
  release work.

## Audit surfaces

| Surface | Required security invariant |
|---|---|
| Payload / gateways | Public paths cannot bypass collection access, publication filters, bounded selects or DTOs; system overrides stay allowlisted. |
| Property identity | `publicUrlId` is generated once, contains no price/PII and cannot be replaced by untrusted update input. |
| Geo / district / facets | City-scoped uniqueness, collision guards and enabled-profile rules prevent cross-geo ambiguity and unintended indexable routes. |
| Feed ingest | Parser limits, source isolation, stable external identity, taxonomy/geo review state and first-run safeguards remain effective. |
| NAP / structured data | One Site Settings owner feeds public DTO/JSON-LD; no donor identity or private contact source leaks. |
| IndexNow | Key material is environment-owned, validated and never exposed through logs, docs or unrelated public routes. |
| Leads / PII | Validation, rate limits, consent evidence, centralized redaction, outbox ownership and retention boundaries prevent unauthorized disclosure. |
| Media / S3 | Upload permissions, MIME/size boundaries and managed-storage configuration are explicit; no public write capability or embedded credential. |
| Backup / recovery | Architecture, runbook and verification commands agree on backup-before-migration and rollback proof without claiming an unexecuted restore. |

## Execution contract

1. Run one official Codex Security Standard repository scan in read-only mode
   against the exact EPIC-44 branch state. Preserve its generated report and
   source-backed coverage; do not replace it with an ad-hoc checklist.
2. Independently execute the project contracts relevant to the nine surfaces,
   including security boundaries, secrets/outbound guards, architecture,
   gateway, identity, geo/facet, feed, NAP, IndexNow, leads, topology and
   operational recovery.
3. Validate every candidate once against source and existing counter-controls.
   Record severity, confidence, attack path, file/line evidence and false
   positives. P0/P1 means validated critical/high severity, not lint noise or an
   undocumented deployment hypothesis.
4. The scan pass remains read-only. Any confirmed P0/P1 or required code fix is
   routed to a separate scoped remediation task/commit and reverified before
   EPIC-44 can claim `P0/P1=0`.
5. Produce one verification matrix that distinguishes repository proof from
   external/provider proof and clearly marks anything not executed.

## Stop conditions and safe fallbacks

- A P0/P1 candidate blocks acceptance until source validation and remediation;
  it is never downgraded merely to finish the epic.
- Missing official scan capability or incomplete source coverage is reported as
  `NOT RUN`/partial and blocks the security-scan claim; ordinary static checks
  are not presented as a substitute.
- S3 provisioning is not implied by this audit. If the repository intentionally
  uses local media before production activation, only its boundary and deferred
  production prerequisite are assessed.
- Backup evidence is limited to documented provider posture and local contract
  checks. No production backup, restore, migration or credential rotation is
  performed.
- Secrets, database URLs, PII and scan-internal sensitive values must not enter
  git, logs or the evidence documents.

## Planned acceptance evidence

- Official scan report with complete repository coverage or explicit bounded
  limitations.
- P0/P1 register with zero open validated findings.
- Surface-by-surface architecture/security matrix tied to exact commands and
  source locations.
- Clean exact diff, review, one RISKY exact-head SourceCraft gate and verified
  canonical `main`; production remains a separate owner command.
