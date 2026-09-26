import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..', '..')
const planPath = 'docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md'
const inventoryPath = resolve(root, 'docs/task-manager-inventory.v2.json')
const plan = readFileSync(resolve(root, planPath), 'utf8')
const previous = JSON.parse(readFileSync(inventoryPath, 'utf8'))

const sourceVersion = plan.match(/^Version:\s*(v\d+)\s*$/m)?.[1]
const sourceStatus = plan.match(/^Status:\s*(DRAFT|REVIEW|READY_FOR_OWNER_APPROVAL|APPROVED)\s*$/m)?.[1]
if (!sourceVersion || !sourceStatus) throw new Error('Plan version/status is missing or unsupported')
const approvedBy = plan.match(/^\*\*Approved by:\*\*\s*`([^`]+)`\s*$/m)?.[1] ?? null
const approvedAt = plan.match(/^\*\*Approved at:\*\*\s*`([^`]+)`\s*$/m)?.[1] ?? null

const epicTitles = new Map()
for (const match of plan.matchAll(/^## (EPIC-(?:6[7-9]|7[0-6])) \/ (CP-[0-9A-Z]+) — (.+)$/gm)) {
  epicTitles.set(match[1], { alias: match[2], title: match[3].trim() })
}
if (epicTitles.size !== 10) throw new Error(`Expected 10 active Core 5.5 epics, found ${epicTitles.size}`)

const commonContext = [
  planPath,
  'docs/replan/CORE55_CP00_EVIDENCE.md',
  'docs/01_PRD.md',
  'docs/02_PRODUCT_STRUCTURE.md',
  'docs/03_ARCHITECTURE.md',
  'docs/04_BACKLOG.md',
  'docs/05_RELEASE_CHECKLIST.md',
  'docs/06_DESIGN_SYSTEM.md',
  'AMS_REALTY_PLATFORM_CORE_STANDARD_5.5_SOLO_AI_FINAL.md',
  'AMS_UI_CORE_v5.0_FINAL.md',
]

const repositories = previous.repositories?.length
  ? previous.repositories
  : [{ key: 'don-city-next', remote: 'https://git.sourcecraft.dev/integrator-p/don-city-next.git', default_branch: 'main' }]

const taskContractDependencies = new Map([
  ['EPIC-69', ['TASK-67-DELIVERY', 'TASK-68-DELIVERY']],
  ['EPIC-72', ['TASK-69-DELIVERY']],
  ['EPIC-74', ['TASK-67-DELIVERY', 'TASK-68-DELIVERY', 'TASK-69-DELIVERY', 'TASK-70-DELIVERY', 'TASK-71-DELIVERY', 'TASK-72-DELIVERY', 'TASK-73-DELIVERY']],
  ['EPIC-75', ['TASK-67-DELIVERY', 'TASK-68-DELIVERY', 'TASK-69-DELIVERY', 'TASK-70-DELIVERY', 'TASK-71-DELIVERY', 'TASK-72-DELIVERY', 'TASK-73-DELIVERY', 'TASK-74-DELIVERY']],
])

const stages = [
  ['PREFLIGHT', 'implementation', 'Freeze exact scope, shared owners, entry evidence and stop conditions.', ['read', 'plan']],
  ['IMPLEMENT', 'implementation', 'Implement the epic outcome within its approved boundaries.', ['read', 'edit', 'test', 'commit', 'push']],
  ['VERIFY', 'implementation', 'Prove the epic acceptance on the required local/test/staging surface.', ['read', 'test', 'commit', 'push']],
  ['EVIDENCE', 'implementation', 'Record traceability, exact checks and residual risks without duplicating Source of Truth.', ['read', 'edit', 'commit', 'push']],
  ['DELIVERY', 'delivery', 'Create/review the epic PR, run one exact-head risk-based gate and merge without production.', ['read', 'test', 'commit', 'push', 'create_pr', 'merge_after_gate']],
]

const nodes = []

for (let number = 67; number <= 76; number += 1) {
  const key = `EPIC-${number}`
  const { alias, title } = epicTitles.get(key)
  const productionOnly = number === 76
  const epicDependencies = number === 76 ? ['EPIC-75'] : []

  nodes.push({
    key,
    title: `${alias} — ${title}`,
    type: 'epic',
    source_anchor: key,
    goal: `Достичь проверяемого outcome ${alias} «${title}» по Core 5.5 plan v9.`,
    scope: [`Выполнить ${alias} строго по одноимённому разделу §33D master plan.`],
    acceptance_criteria: [`Все acceptance условия ${alias} доказаны артефактами и проверками.`],
    depends_on: epicDependencies,
    delivery_mode: productionOnly ? 'PR_ONLY' : 'MERGE_AFTER_GATE',
    required_context: commonContext,
    allowed_actions: ['read', 'plan'],
    stop_conditions: productionOnly
      ? ['missing explicit production release command', 'source or inventory drift', 'failed CP-08 or release prerequisite']
      : ['source or inventory drift', 'production/indexing/feed/secret mutation', 'destructive migration without explicit owner authority'],
    priority: productionOnly ? 2 : 1,
    labels: ['wave:core55', `alias:${alias.toLowerCase()}`, ...(productionOnly ? ['needs-owner', 'production-only'] : [])],
  })

  if (productionOnly) continue

  const siblingKeys = []
  for (const [stage, workKind, stageGoal, allowedActions] of stages) {
    const taskKey = `TASK-${number}-${stage}`
    const dependencies = []
    if (stage !== 'PREFLIGHT') dependencies.push(siblingKeys.at(-1))
    if (stage === 'IMPLEMENT') dependencies.push(...(taskContractDependencies.get(key) ?? []))
    if (workKind === 'delivery') dependencies.push(...siblingKeys.filter((item) => !dependencies.includes(item)))

    const gate = [67, 68, 70, 71, 73, 75].includes(number)
      ? 'RISKY or risk-sliced exact-head gate per §33D'
      : 'STANDARD unless the exact diff triggers RISKY'

    nodes.push({
      key: taskKey,
      title: `${alias} ${stage.toLowerCase()}`,
      type: 'task',
      role: 'implementation',
      work_kind: workKind,
      repository_key: 'don-city-next',
      parent_key: key,
      source_anchor: key,
      goal: `${stageGoal} Epic: ${alias} — ${title}.`,
      scope: [`Canonical instruction: ${alias} — ${title}.`, 'Do not perform production, public indexing, real-feed activation or unapproved secret/data mutations.'],
      acceptance_criteria: [`Acceptance ${alias} from §33D is proven for stage ${stage}.`, 'EXECUTION_LEDGER_V1 records exact branch/base/head and checks actually run.'],
      required_checks: [`Verify the exact ${alias} acceptance surface.`, `Gate policy: ${gate}.`],
      depends_on: [...new Set(dependencies)],
      required_context: commonContext,
      allowed_actions: allowedActions,
      stop_conditions: ['source or inventory drift', 'unknown production/test identity', 'production/indexing/feed/secret mutation', 'destructive migration without explicit owner authority'],
      priority: 1,
      labels: ['wave:core55', `alias:${alias.toLowerCase()}`, `stage:${stage.toLowerCase()}`],
    })
    siblingKeys.push(taskKey)
  }
}

nodes.sort((a, b) => a.key.localeCompare(b.key, 'en'))
const epicAnchors = nodes.filter((node) => node.type === 'epic').map((node) => node.source_anchor).sort((a, b) => a.localeCompare(b, 'en'))
const approved = sourceStatus === 'APPROVED'
if (approved && (!approvedBy || !approvedAt)) throw new Error('Approved plan must declare Approved by/at')
const inventory = {
  schema_version: 2,
  beads_prefix: 'dc55',
  source: {
    plan_id: 'AMS-DON-CITY-CORE55-POSTPROD',
    path: planPath,
    version: sourceVersion,
    status: sourceStatus,
    approved_by: approved ? approvedBy : null,
    approved_at: approved ? approvedAt : null,
    sha256: createHash('sha256').update(Buffer.from(plan)).digest('hex'),
    epic_anchors: epicAnchors,
  },
  repositories,
  nodes,
}

writeFileSync(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8')
const counts = nodes.reduce((result, node) => ({ ...result, [node.type]: (result[node.type] ?? 0) + 1 }), {})
process.stdout.write(`${JSON.stringify({ version: sourceVersion, status: sourceStatus, epicAnchors: epicAnchors.length, ...counts })}\n`)
