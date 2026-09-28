import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..', '..')
const planPath = 'docs/DON_CITY_FINAL_CONSTITUTION_REMEDIATION_MASTER_PLAN_V2_0.md'
const inventoryPath = resolve(root, 'docs/task-manager-inventory.v2.json')
const plan = readFileSync(resolve(root, planPath), 'utf8')

const sourceVersion = plan.match(/^Version:\s*(v\d+)\s*$/m)?.[1]
const sourceStatus = plan.match(/^Status:\s*(DRAFT|REVIEW|READY_FOR_OWNER_APPROVAL|APPROVED)\s*$/m)?.[1]
const approvedBy = plan.match(/^Approved by:\s*(\S+)\s*$/m)?.[1] ?? null
const approvedAt = plan.match(/^Approved at:\s*(\S+)\s*$/m)?.[1] ?? null
if (!sourceVersion || !sourceStatus) throw new Error('Plan version/status is missing or unsupported')
if (sourceStatus === 'APPROVED' && (!approvedBy || !approvedAt)) throw new Error('Approved plan must declare Approved by/at')

const epicMatches = [...plan.matchAll(/^# (EPIC-(\d{2})) — (.+)$/gm)]
  .filter((match) => Number(match[2]) >= 1 && Number(match[2]) <= 5)
if (epicMatches.length !== 5) throw new Error(`Expected 5 implementation epics, found ${epicMatches.length}`)

const taskMatches = [...plan.matchAll(/^## (TASK-(\d{2})\.(\d+)) — (.+)$/gm)]
if (taskMatches.length !== 44) throw new Error(`Expected 44 implementation tasks, found ${taskMatches.length}`)

const commonContext = [
  planPath,
  'AGENTS.md',
  'docs/README.md',
  'docs/01_PRD.md',
  'docs/02_PRODUCT_STRUCTURE.md',
  'docs/03_ARCHITECTURE.md',
  'docs/04_BACKLOG.md',
  'docs/05_RELEASE_CHECKLIST.md',
  'docs/DESIGN.md',
  'docs/OPERATIONS.md',
  'AMS_REALTY_PLATFORM_CORE_STANDARD_5.5_SOLO_AI_FINAL.md',
  'AMS_UI_CORE_v5.0_FINAL.md',
]

const explicitDependencies = new Map([
  ['TASK-01.2', ['TASK-01.1']],
  ['TASK-01.3', ['TASK-01.2']],
  ['TASK-01.4', ['TASK-01.3']],
  ['TASK-01.5', ['TASK-01.3']],
  ['TASK-01.9', ['TASK-01.2', 'TASK-01.3', 'TASK-01.4', 'TASK-01.5', 'TASK-01.6', 'TASK-01.7', 'TASK-01.8']],
  ['TASK-02.1', ['TASK-01.1']],
  ['TASK-02.2', ['TASK-02.1']],
  ['TASK-02.4', ['TASK-01.7']],
  ['TASK-02.7', ['TASK-02.1', 'TASK-02.2', 'TASK-02.3', 'TASK-02.4', 'TASK-02.5', 'TASK-02.6']],
  ['TASK-03.7', ['TASK-03.1', 'TASK-03.2', 'TASK-03.3', 'TASK-03.4', 'TASK-03.5', 'TASK-03.6']],
  ['TASK-04.2', ['TASK-04.1']],
  ['TASK-04.3', ['TASK-04.1']],
  ['TASK-04.4', ['TASK-03.7', 'TASK-04.1']],
  ['TASK-04.5', ['TASK-04.1']],
  ['TASK-04.7', ['TASK-04.2', 'TASK-04.3', 'TASK-04.4']],
  ['TASK-04.8', ['TASK-04.1']],
  ['TASK-04.10', ['TASK-04.1']],
  ['TASK-04.11', ['TASK-04.1']],
  ['TASK-04.12', ['TASK-04.2', 'TASK-04.3', 'TASK-04.4', 'TASK-04.5', 'TASK-04.6', 'TASK-04.7', 'TASK-04.8', 'TASK-04.9', 'TASK-04.10', 'TASK-04.11']],
  ['TASK-05.4', ['TASK-01-DELIVERY', 'TASK-02-DELIVERY', 'TASK-03-DELIVERY', 'TASK-04-DELIVERY', 'TASK-05.3']],
  ['TASK-05.8', ['TASK-01-DELIVERY', 'TASK-02-DELIVERY', 'TASK-03-DELIVERY', 'TASK-04-DELIVERY']],
  ['TASK-05.9', ['TASK-05.1', 'TASK-05.2', 'TASK-05.3', 'TASK-05.4', 'TASK-05.5', 'TASK-05.6', 'TASK-05.7', 'TASK-05.8']],
])

const nodes = []
for (const match of epicMatches) {
  const [, epicKey, epicNumber, title] = match
  nodes.push({
    key: epicKey,
    title: title.trim(),
    type: 'epic',
    source_anchor: epicKey,
    goal: `Deliver the complete ${epicKey} outcome defined by the approved plan.`,
    scope: [`Execute ${epicKey} as one SourceCraft stream and one PR; do not perform production.`],
    acceptance_criteria: [`Every task and required check under ${epicKey} is evidenced before delivery.`],
    depends_on: [],
    delivery_mode: 'MERGE_AFTER_GATE',
    propagate_dependencies_to_children: false,
    required_context: commonContext,
    allowed_actions: ['read', 'plan'],
    stop_conditions: ['source or inventory drift', 'production/DNS/secret mutation', 'destructive production data action'],
    priority: 1,
    labels: ['wave:constitution-remediation', `epic:${epicNumber}`],
  })
}

for (const match of taskMatches) {
  const [, taskKey, epicNumber, taskNumber, title] = match
  nodes.push({
    key: taskKey,
    title: title.trim(),
    type: 'task',
    role: 'implementation',
    work_kind: 'implementation',
    repository_key: 'don-city-next',
    parent_key: `EPIC-${epicNumber}`,
    source_anchor: taskKey,
    goal: `Implement and prove ${taskKey}: ${title.trim()}.`,
    scope: [`The exact ${taskKey} section in the approved plan is authoritative.`, 'Keep production, DNS, real feed activation and secret mutation out of this task.'],
    acceptance_criteria: [`All acceptance statements and negative cases in ${taskKey} are satisfied with concrete evidence.`, 'EXECUTION_LEDGER_V1 records exact branch/base/head, changed files, checks and deviations.'],
    required_checks: [`Run only the existing package scripts and focused proof named by ${taskKey} and its epic contract.`, 'Map every task acceptance item to observed evidence.'],
    depends_on: explicitDependencies.get(taskKey) ?? [],
    required_context: commonContext,
    allowed_actions: ['read', 'edit', 'test', 'commit', 'push'],
    stop_conditions: ['source or inventory drift', 'production identity where test identity is required', 'unapproved destructive or external action'],
    priority: 1,
    labels: ['wave:constitution-remediation', `epic:${epicNumber}`, `task:${taskNumber}`],
  })
}

for (const match of epicMatches) {
  const [, epicKey, epicNumber, title] = match
  const siblingKeys = nodes.filter((node) => node.parent_key === epicKey && node.work_kind === 'implementation').map((node) => node.key)
  nodes.push({
    key: `TASK-${epicNumber}-DELIVERY`,
    title: `Deliver ${epicKey}: ${title.trim()}`,
    type: 'task',
    role: 'implementation',
    work_kind: 'delivery',
    repository_key: 'don-city-next',
    parent_key: epicKey,
    source_anchor: epicKey,
    goal: `Review, prove, deliver and merge the exact ${epicKey} stream without production.`,
    scope: ['Create one SourceCraft PR, perform full diff review, run one exact-head risk-based gate and merge only the approved epic scope.'],
    acceptance_criteria: ['PR source/target/head are verified.', 'Required exact-head SourceCraft gate is green.', 'Merge SHA and gate evidence are recorded in EXECUTION_LEDGER_V1.'],
    required_checks: ['Full diff review against the approved plan and Source of Truth.', `Gate policy: ${epicNumber === '03' ? 'STANDARD unless exact diff promotes to RISKY' : 'RISKY'}.`],
    depends_on: siblingKeys,
    required_context: commonContext,
    allowed_actions: ['read', 'test', 'commit', 'push', 'create_pr', 'merge_after_gate'],
    stop_conditions: ['source or inventory drift', 'failed or unverified exact-head gate', 'production release request absent'],
    priority: 1,
    labels: ['wave:constitution-remediation', `epic:${epicNumber}`, 'delivery:merge-after-gate'],
  })
}

nodes.sort((a, b) => a.key.localeCompare(b.key, 'en'))
const inventory = {
  schema_version: 2,
  beads_prefix: 'dccr',
  source: {
    plan_id: 'AMS-DON-CITY-CONSTITUTION-REMEDIATION',
    path: planPath,
    version: sourceVersion,
    status: sourceStatus,
    approved_by: approvedBy,
    approved_at: approvedAt,
    sha256: createHash('sha256').update(Buffer.from(plan)).digest('hex'),
    epic_anchors: epicMatches.map((match) => match[1]),
  },
  repositories: [{ key: 'don-city-next', remote: 'https://git.sourcecraft.dev/integrator-p/don-city-next.git', default_branch: 'main' }],
  nodes,
}

writeFileSync(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8')
process.stdout.write(`${JSON.stringify({ version: sourceVersion, status: sourceStatus, epics: 5, implementation_tasks: 44, delivery_tasks: 5, production_tasks: 0 })}\n`)
