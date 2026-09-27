import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..', '..')
const planPath = 'docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md'
const plan = readFileSync(resolve(root, planPath), 'utf8')

const sourceVersion = plan.match(/^Version:\s*(v\d+)\s*$/m)?.[1]
const sourceStatus = plan.match(/^Status:\s*(DRAFT|REVIEW|READY_FOR_OWNER_APPROVAL|APPROVED)\s*$/m)?.[1]
if (!sourceVersion || !sourceStatus) throw new Error('Plan version/status is missing or unsupported')
const inventoryPath = resolve(
  root,
  sourceStatus === 'APPROVED' ? 'docs/task-manager-inventory.v2.json' : `docs/task-manager-inventory.${sourceVersion}.draft.json`,
)
const approvedBy = plan.match(/^\*\*Approved by:\*\*\s*`([^`]+)`\s*$/m)?.[1] ?? null
const approvedAt = plan.match(/^\*\*Approved at:\*\*\s*`([^`]+)`\s*$/m)?.[1] ?? null
if (sourceStatus === 'APPROVED' && (!approvedBy || !approvedAt)) {
  throw new Error('Approved plan must contain Approved by and Approved at metadata')
}

const epics = [
  { n: 100, alias: 'DC10-DOC-00', title: 'Initial Source-of-Truth reconciliation', outcome: 'Active documents express the v10 target without presenting pending implementation as current.', checks: 'Convergence matrix, active-link checks, extended quality:docs-sot self-test.', deps: [] },
  { n: 101, alias: 'DC10-OPS-00', title: 'Pre-release operational and access readiness', outcome: 'Backup/restore, one jobs owner, health/availability and Secret Master access are proven before the final release without a post-production monitoring task.', checks: 'Names-only Secret Master access, one persistent production DB, redacted readiness evidence and no production mutation before release.', deps: [], risky: true },
  { n: 102, alias: 'DC10-R11-00', title: 'Exact production inventory diagnostic', outcome: 'Every published record has a redacted factual category/geo/URL/indexability row without mutation.', checks: 'Inventory counts reconcile and no PII or secret enters evidence.', deps: [] },
  { n: 103, alias: 'DC10-R11-01', title: 'Geo relation repair', outcome: 'Published records have actual city relations and safe district mapping.', checks: 'Idempotent Payload migration/backfill, non-empty fixture and rollback proof.', deps: [100, 102], risky: true },
  { n: 104, alias: 'DC10-R11-02', title: 'Commercial filter repair', outcome: 'Commercial routes resolve only commercial inventory.', checks: 'Canonical and compatibility route/query tests assert category=commercial.', deps: [100] },
  { n: 105, alias: 'DC10-R11-03', title: 'Public surface cleanup', outcome: 'Public HTML exposes only allowlisted active routes through DTO/buildUrl.', checks: 'No /nedvizhimost or inactive CTA/link/sitemap/IndexNow; href guard passes.', deps: [100] },
  { n: 106, alias: 'DC10-R11-04', title: 'Unified Content Gate', outcome: 'Registry, Site Profile, runtime and seeds use minActive=3 with persistent 30-day state.', checks: 'Equality guards, transition tests and proof that public GET is read-only.', deps: [100, 102], risky: true },
  { n: 107, alias: 'DC10-R11-05', title: 'Robots, sitemap, mirrors and HTTP policy', outcome: 'Robots, sitemap, mirrors, errors, pagination and canonicals match v10.', checks: 'HTTP proof for robots, sitemap, 404/410, pagination, canonical and one-hop mirrors.', deps: [104, 105, 106] },
  { n: 108, alias: 'DC10-R12-01', title: 'Donetsk district completion', outcome: 'Nine districts and Textilshchik have canonical forms, mapping and Gate behavior.', checks: 'Seed uniqueness, stored inflections, mapping and landing tests.', deps: [103, 106], risky: true },
  { n: 109, alias: 'DC10-R12-02', title: 'Agglomeration data model', outcome: 'The existing geo model represents verified nearby localities without calling them Donetsk.', checks: 'Payload migration and radius/whitelist/needsReview tests; no second geo collection.', deps: [103], risky: true },
  { n: 110, alias: 'DC10-R12-03', title: 'Agglomeration SEO research', outcome: 'A dated evidence-backed activation recommendation exists without invented demand data.', checks: 'Sources and dates per claim; recommended intent, slug, locality list and priorities.', deps: [109] },
  { n: 111, alias: 'DC10-R12-04', title: 'Agglomeration public routes', outcome: 'Only owner-approved locality routes can become reachable and use actual locality metadata.', checks: 'Typed URLs, separate counts, actual locality JSON-LD and pre-gate 404/no-link proof.', deps: [106, 109, 110], ownerGate: true, risky: true },
  { n: 112, alias: 'DC10-R12-05', title: 'Legal and consent expansion', outcome: 'Consent, terms, managed contract and NAP behavior are factual, conditional and privacy-safe.', checks: 'Missing-consent rejection, canonical evidence fields, conditional route/file and no-PII analytics tests.', deps: [100], risky: true },
  { n: 113, alias: 'DC10-R12-06', title: 'Factual structured data', outcome: 'JSON-LD uses factual property types, localities and visible service facts.', checks: 'Validator fixtures cover apartment, house, land, commercial and lawyer.', deps: [103, 109] },
  { n: 114, alias: 'DC10-UI-01', title: 'Remove speculative public UI', outcome: 'Inactive speculative exports are removed or isolated from the public package surface.', checks: 'Export/import inventory and active-route build proof.', deps: [100] },
  { n: 115, alias: 'DC10-UI-02', title: 'One canonical shell', outcome: 'One active shell owns header, footer and mobile navigation.', checks: 'One active implementation tree; compatibility aliases are documented and non-duplicative.', deps: [114] },
  { n: 116, alias: 'DC10-UI-03', title: 'Lightbox primitive conformance', outcome: 'The gallery uses approved primitives with keyboard, focus and reduced-motion behavior.', checks: 'Second library removed or owner exception recorded; dialog/gallery interaction proof.', deps: [115] },
  { n: 117, alias: 'DC10-UI-04', title: 'Marketing semantic hierarchy', outcome: 'Representative marketing pages have one H1 and no skipped primary heading level.', checks: 'Semantic and accessibility-oriented page checks.', deps: [115] },
  { n: 118, alias: 'DC10-UI-05', title: 'Page-specific compositions', outcome: 'Sell, Lawyer, About and Contacts have distinct factual semantic compositions.', checks: 'Page-specific desktop/mobile/state acceptance and one primary conversion per page.', deps: [117] },
  { n: 119, alias: 'DC10-UI-06', title: 'Token and dead UI audit', outcome: 'Token/component drift is reduced only with mechanical evidence.', checks: 'tokens:report, verify:ui-core, verify:drift and verify:a11y-starter.', deps: [114, 115, 116, 117, 118] },
  { n: 120, alias: 'DC11-DOC-FINAL', title: 'Final exact-head documentation audit', outcome: 'The one final candidate SHA has zero P0/P1 active-document contradictions after all implementation work.', checks: 'Docs/registry/runtime matrix, exact-head documentation guards and exact candidate identity.', deps: [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119] },
  { n: 121, alias: 'DC11-PROD-FINAL', title: 'Mandatory final production release', outcome: 'The fully approved exact-main candidate is released once as the last plan stage, with no task after it.', checks: 'Production-only: one artifact/rollout, bounded live smoke/crawl, exact identity, rollback and factual live-document reconciliation inside this stage.', deps: [120], production: true },
]

const commonContext = [
  planPath,
  'docs/README.md',
  'docs/01_PRD.md',
  'docs/02_PRODUCT_STRUCTURE.md',
  'docs/03_ARCHITECTURE.md',
  'docs/04_BACKLOG.md',
  'docs/05_RELEASE_CHECKLIST.md',
  'docs/PROJECT.md',
  'docs/OPERATIONS.md',
  'docs/DESIGN.md',
  'AMS_REALTY_PLATFORM_CORE_STANDARD_5.5_SOLO_AI_FINAL.md',
  'AMS_UI_CORE_v5.0_FINAL.md',
]

const repositories = [{ key: 'don-city-next', remote: 'https://git.sourcecraft.dev/integrator-p/don-city-next.git', default_branch: 'main' }]
const nodes = []
const deliveryKey = (number) => `TASK-${number}-DELIVERY`

for (const epic of epics) {
  const key = `EPIC-${epic.n}`
  nodes.push({
    key,
    title: `${epic.alias} — ${epic.title}`,
    type: 'epic',
    source_anchor: key,
    goal: epic.outcome,
    scope: [`Execute ${epic.alias} strictly under §39.`, 'Preserve Payload-only, DTO, PII, secret and production boundaries.'],
    acceptance_criteria: [epic.outcome, epic.checks],
    depends_on: epic.production ? epic.deps.map((number) => `EPIC-${number}`) : [],
    delivery_mode: epic.production ? 'PR_ONLY' : 'MERGE_AFTER_GATE',
    required_context: commonContext,
    allowed_actions: ['read', 'plan'],
    stop_conditions: epic.production
      ? ['missing explicit production release command', 'source or inventory drift', 'failed exact-head prerequisite']
      : ['source or inventory drift', 'production/DNS/secret mutation', 'unapproved destructive or external action'],
    priority: epic.production ? 2 : 1,
    labels: [`alias:${epic.alias.toLowerCase()}`, epic.production ? 'wave:production' : 'wave:v10', ...(epic.production ? ['needs-owner', 'production-only'] : [])],
  })

  if (epic.production) continue

  const taskDefs = [
    {
      stage: 'PREFLIGHT',
      workKind: 'implementation',
      allowedActions: ['read', 'plan', 'edit', 'test', 'commit', 'push'],
      goal: `Establish the exact baseline and durable implementation contract for ${epic.outcome}`,
      scope: [
        'Commit a factual baseline, convergence matrix, fail-first guard/fixture or redacted diagnostic artifact owned by this epic.',
        'Map every final epic criterion to planned implementation and verification evidence without claiming the final outcome is already complete.',
      ],
      acceptance: [
        `The exact baseline and affected owners for ${epic.alias} are recorded in a project-owned artifact.`,
        'Unknowns and blockers are explicit; production, DNS, secrets and irreversible data are unchanged.',
        'A non-empty pushed Git diff provides durable preflight evidence.',
      ],
      checks: ['Baseline/source links resolve and the committed preflight evidence contains no secret or PII values.'],
    },
    {
      stage: 'IMPLEMENT',
      workKind: 'implementation',
      allowedActions: ['read', 'edit', 'test', 'commit', 'push'],
      goal: `Implement the observable outcome: ${epic.outcome}`,
      scope: ['Implement only the canonical epic outcome against the committed preflight contract.'],
      acceptance: [epic.outcome, 'The implementation is represented by a non-empty pushed Git diff and preserves all project invariants.'],
      checks: [epic.checks],
    },
    {
      stage: 'VERIFY',
      workKind: 'implementation',
      allowedActions: ['read', 'edit', 'test', 'commit', 'push'],
      goal: `Prove and harden the implemented outcome at an exact pushed head: ${epic.outcome}`,
      scope: [
        'Run the required changed-path proof and commit a durable regression guard, fixture, redacted evidence artifact or verification-driven correction.',
        'Do not duplicate the final Merge Gate or claim production evidence.',
      ],
      acceptance: [
        epic.outcome,
        epic.checks,
        'A non-empty pushed Git diff records durable verification or a verification-driven correction.',
      ],
      checks: [epic.checks, 'Verification evidence maps observed results to the exact head without secrets or PII.'],
    },
    {
      stage: 'DELIVERY',
      workKind: 'delivery',
      allowedActions: ['read', 'test', 'commit', 'push', 'create_pr', 'merge_after_gate'],
      goal: `Deliver the verified exact-head epic outcome: ${epic.outcome}`,
      scope: ['Create the canonical PR, perform full diff review and the one required exact-head gate, then merge only under MERGE_AFTER_GATE.'],
      acceptance: [epic.outcome, epic.checks, 'PR, exact head, gate and merge state are recorded in DELIVERY ledger evidence.'],
      checks: [epic.checks, `Merge Gate: ${epic.risky ? 'RISKY' : 'STANDARD unless the exact diff triggers RISKY'}.`],
    },
  ]
  const siblingKeys = []
  for (const taskDef of taskDefs) {
    const { stage, workKind, allowedActions } = taskDef
    const taskKey = `TASK-${epic.n}-${stage}`
    const dependencies = []
    if (stage === 'PREFLIGHT') dependencies.push(...epic.deps.map(deliveryKey))
    if (stage !== 'PREFLIGHT') dependencies.push(siblingKeys.at(-1))
    if (stage === 'DELIVERY') dependencies.push(...siblingKeys)
    nodes.push({
      key: taskKey,
      title: `${epic.alias} ${stage.toLowerCase()}`,
      type: 'task',
      role: 'implementation',
      work_kind: workKind,
      repository_key: 'don-city-next',
      parent_key: key,
      source_anchor: key,
      goal: `${stage}: ${taskDef.goal}`,
      scope: [
        `Canonical epic: ${epic.alias} — ${epic.title}.`,
        ...taskDef.scope,
        'Record DOC IMPACT and keep production outside implementation.',
      ],
      acceptance_criteria: [...taskDef.acceptance, 'EXECUTION_LEDGER_V1 records exact branch/base/head and checks actually run.'],
      required_checks: taskDef.checks,
      depends_on: [...new Set(dependencies.filter(Boolean))],
      required_context: commonContext,
      allowed_actions: allowedActions,
      stop_conditions: ['source or inventory drift', 'unknown runtime/data identity', 'production/DNS/secret mutation', ...(epic.ownerGate ? ['missing owner decision required by this epic'] : [])],
      priority: 1,
      labels: [`alias:${epic.alias.toLowerCase()}`, `stage:${stage.toLowerCase()}`, ...(epic.ownerGate ? ['needs-owner-later'] : [])],
    })
    siblingKeys.push(taskKey)
  }
}

nodes.sort((a, b) => a.key.localeCompare(b.key, 'en'))
const epicAnchors = epics.map((epic) => `EPIC-${epic.n}`)
const inventory = {
  schema_version: 2,
  beads_prefix: 'dc11',
  source: {
    plan_id: 'AMS-DON-CITY-LIVE-CONFORMANCE',
    path: planPath,
    version: sourceVersion,
    status: sourceStatus,
    approved_by: approvedBy,
    approved_at: approvedAt,
    sha256: createHash('sha256').update(Buffer.from(plan)).digest('hex'),
    epic_anchors: epicAnchors,
  },
  repositories,
  nodes,
}

writeFileSync(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8')
const counts = {}
for (const node of nodes) counts[node.type] = (counts[node.type] ?? 0) + 1
process.stdout.write(`${JSON.stringify({ version: sourceVersion, status: sourceStatus, epicAnchors: epicAnchors.length, ...counts })}\n`)
