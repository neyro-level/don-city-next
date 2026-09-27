# DC11 R12-05 Preflight — legal, consent and NAP

Status: `PREFLIGHT COMPLETE`

Task: `dc11-task-112-preflight`

Plan: `AMS-DON-CITY-LIVE-CONFORMANCE` v13 (`APPROVED`)

Epic: `DC10-R12-05` / `EPIC-112`

Baseline: `origin/main@7a0ad70254dc9da220915c02701ca917e8295491`

## 1. Purpose and boundary

This preflight freezes the current owners and the implementation/verification
contract for consent, legal terms, an optional managed contract file, canonical
NAP and privacy-safe analytics. It does not publish legal content, invent legal
or company facts, mutate Payload data, change secrets, deploy, alter DNS or
touch production.

Owner decision `OD10-05` remains open: approved terms/contract content and an
optional managed file have not been supplied. Therefore the only safe current
public behavior for those absent resources is `404` with zero navigation,
footer, sitemap and page links. Implementation may make this absence explicit;
it must not manufacture copy or a file.

## 2. Current ownership map

| Concern | Current owner | Observed baseline |
|---|---|---|
| Consent version and public href | `src/project/legal.config.ts` | One project-owned current version, required flag and canonical consent URL are propagated through `leadConsentContext()` to public DTOs. |
| Browser consent control | `packages/ui/src/lead-consent-field.tsx`, `packages/ui/src/views/starter/LeadFormView.tsx`, request modal views | Forms expose a controlled required checkbox and submit the displayed version. |
| Server enforcement | `src/core/leads/intake.ts`, `src/core/data-access/public/leads.ts`, `src/app/api/public/leads/route.ts` | The input schema accepts only literal `true`; the server compares the submitted version with the project-owned current version before persistence. Missing or false consent is rejected before a lead is created. |
| Immutable consent evidence | `src/project/collections/Leads.ts`, `src/core/data-access/leads/payload-outbox-repository.ts` | Payload stores the canonical group `consent.accepted`, `consent.version`, `consent.consentedAt`; intake evidence cannot be updated through the collection. |
| Published privacy/consent copy | `src/project/legal-documents.ts`, `src/project/static-page-composition.ts`, the two explicit legal routes | Only privacy policy and personal-data consent are implemented. They use project NAP/company fields and the current consent version. |
| Terms and optional managed contract | no active owner | No typed publication state, route, managed-file owner or public link exists. The absence happens implicitly rather than through a verified conditional contract. |
| Canonical NAP | `src/project/site-settings.ts`, public gateway DTO mapping, `src/project/company-profile.ts` | Runtime has one project-owned fallback plus CMS mapping. Active documentation still marks external owner/Yandex Business verification as pending, so this preflight does not call the values externally verified. |
| Analytics privacy | `packages/ui/src/analytics-contract.ts`, `src/platform/analytics/event.ts` | Browser events are normalized through an explicit field allowlist; server event dimensions reject PII-like keys. Existing tests inject hostile free-text/PII-shaped fields and require them to be dropped or rejected. |

Graph navigation confirms that `leadConsentContext()` feeds the public route,
static page composition, public DTOs and their verification scripts. Therefore
the implementation must change the project legal contract first and keep all
consumers aligned; a page-only change would be incomplete.

## 3. Baseline gaps and fail-first cases

| ID | Current gap | Fail-first proof required before or with implementation | Target |
|---|---|---|---|
| `LGL-01` | Missing/false consent is rejected as generic `lead.invalid_payload`; the declared `lead.consent_required` result is not emitted. | Submit payloads with the field missing and `false`; assert no repository write and the dedicated safe rejection code. | Server returns `lead.consent_required` without echoing form values or PII. |
| `LGL-02` | Terms/contract absence is implicit and has no typed single owner. | Request the reserved terms route and inspect all public navigation/link owners while the state is absent. | Explicit project-owned `ABSENT` state yields `404` and zero public links. |
| `LGL-03` | There is no conditional managed PDF contract. | Attempt to resolve a file when no approved managed asset exists. | No URL is emitted; a future `PUBLISHED` state requires an owner-approved managed asset and safe public metadata. |
| `LGL-04` | Consent evidence names are spread across browser input and stored Payload shape. | Verify request-to-storage mapping for accepted state, version and server timestamp; reject caller-supplied timestamps. | One documented canonical evidence mapping with immutable server-owned time. |
| `LGL-05` | NAP values exist, but external factual verification remains pending. | Verify the DTO/page/schema owners use the same field set without copying raw values into evidence logs. | One canonical NAP source and named provenance/status; no claim of external verification until evidence exists. |
| `LGL-06` | Privacy protection is split between browser normalization and server dimension checks. | Feed name, phone, email, address, message, comment, contact and arbitrary free text through both boundaries. | No PII/free text reaches analytics records or diagnostics. |

## 4. Implementation contract

The IMPLEMENT stage will:

1. add one project-owned typed legal-publication contract covering privacy,
   consent, conditional terms and the optional managed file;
2. preserve the two already published legal routes and make the absent
   terms/file state explicit, unreachable and unlinked;
3. return the dedicated safe rejection for missing consent before any database
   or delivery work while retaining exact version matching and server-owned
   `consentedAt`;
4. codify the canonical request-to-storage evidence mapping without widening
   public DTOs or Payload access;
5. add deterministic guards for conditional routes/links/file metadata and for
   analytics PII rejection;
6. add NAP evidence status/provenance names without embedding external evidence
   values or asserting that the pending owner check has passed;
7. update the relevant Source of Truth and record `DOC IMPACT`.

No new collection, ORM, database, persistent environment, analytics payload,
public route or managed file may be activated by default. Any later publication
requires the explicit owner decision recorded by `OD10-05`.

## 5. Verification matrix

| Final criterion | Required exact-head evidence |
|---|---|
| Server rejects missing consent | Targeted intake test covers omitted/false/current/mismatched consent and proves the repository is not called on rejection. |
| Canonical evidence names | Contract test proves request `consentAccepted` + `consentVersion` map only to stored `consent.accepted` + `consent.version`, while `consent.consentedAt` is server-owned. |
| Conditional terms/PDF behavior | Route and navigation tests prove `ABSENT -> 404 + zero links + no file URL`; published fixtures remain synthetic and cannot activate runtime. |
| Factual NAP behavior | Site settings, public DTO, visible page and schema tests agree on the canonical field set and evidence status without logging values. |
| No PII analytics | Browser allowlist and server dimension tests reject/drop the full hostile key set and arbitrary free text. |
| Platform boundaries | Payload remains the sole schema/auth owner; public reads remain through DTOs; no secret, production or second-database change. |

Planned focused checks: `verify:lead-intake`,
`verify:company-contacts-legal`, `verify:site-settings`, `verify:analytics`, the new
legal-contract verifier, targeted typecheck/lint, documentation guard, Task
Manager `Validate` and `Reconcile`.

During baseline verification, `quality:docs-sot` exposed a Windows-only defect
in the guard delivered by `DC10-DOC-00`: a multiline required fragment used LF
while a normal Windows checkout supplied CRLF. The rule now normalizes text
line endings before evaluation, and its self-test covers a complete CRLF input.
This is a guard portability fix only; no Source of Truth content or runtime
behavior changed.

## 6. Unknowns and stop conditions

- Approved terms copy, contract copy and optional managed file are absent. This
  is a deliberate `ABSENT` runtime state, not permission to draft legal text.
- External confirmation of the existing NAP values is still pending. A mismatch
  must become owner-reviewed work; the implementation must not silently choose
  between sources.
- Any request to publish a new legal route/file, mutate Payload data, expose PII,
  change secrets/DNS or touch production stops this implementation stage.

## 7. DOC IMPACT

- Owner document: `docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md`, `EPIC-112`.
- Reviewed now: PRD, Product Structure, Architecture, Release Checklist and
  project legal/consent/NAP runtime owners.
- Changed in PREFLIGHT: this evidence artifact only.
- Planned transition: implicit absence and scattered proof -> explicit
  conditional legal-publication contract with deterministic privacy evidence.
