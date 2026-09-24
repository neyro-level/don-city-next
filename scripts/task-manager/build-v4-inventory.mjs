import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..', '..')
const planPath = 'docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md'
const inventoryPath = resolve(root, 'docs/task-manager-inventory.v2.json')
const plan = readFileSync(resolve(root, planPath), 'utf8')
const previous = JSON.parse(readFileSync(inventoryPath, 'utf8'))
const sourceStatus = plan.match(/^Status:\s*(DRAFT|REVIEW|APPROVED)\s*$/m)?.[1]
if (!sourceStatus) throw new Error('Plan status is missing or unsupported')

const excluded = new Set(['00', '01', '02', '03', '04', '06', '08', '15', '16', '18', '30'])
const rpTitles = new Map()
for (const match of plan.matchAll(/^# (EPIC-(?:5[3-9]|6[0-5])) \/ (RP-\d{2}) — (.+)$/gm)) {
  rpTitles.set(match[1], { alias: match[2], title: match[3].trim() })
}
if (rpTitles.size !== 13) throw new Error(`Expected 13 RP aliases, found ${rpTitles.size}`)

const oldEpicNodes = previous.nodes.filter((node) => node.type === 'epic')
const oldTaskNodes = previous.nodes.filter((node) => node.type === 'task')
const activeOldEpics = oldEpicNodes.filter((node) => {
  const number = Number(node.key.slice(-2))
  return number <= 52 && !excluded.has(node.key.slice(-2))
})
const activeOldKeys = new Set(activeOldEpics.map((node) => node.key))
const activeKeys = new Set([...activeOldKeys, ...rpTitles.keys()])

const commonContext = [
  planPath,
  'docs/03_ARCHITECTURE.md',
  'docs/04_BACKLOG.md',
  'docs/05_RELEASE_CHECKLIST.md',
]

const cleanDependencies = (dependencies = []) => dependencies.filter((key) => activeKeys.has(key) || key.startsWith('TASK-'))
const nodes = []

for (const oldEpic of activeOldEpics) {
  const node = structuredClone(oldEpic)
  node.required_context = commonContext
  node.depends_on = cleanDependencies(node.depends_on)
  if (node.key === 'EPIC-49') {
    node.depends_on = ['EPIC-48']
  } else if (!node.depends_on.includes('EPIC-65')) {
    node.depends_on.unshift('EPIC-65')
  }
  nodes.push(node)
}

for (const oldTask of oldTaskNodes.filter((node) => activeOldKeys.has(node.parent_key))) {
  const node = structuredClone(oldTask)
  node.required_context = commonContext
  node.depends_on = cleanDependencies(node.depends_on)
  if (node.parent_key !== 'EPIC-49' && !node.depends_on.includes('EPIC-65')) {
    node.depends_on.unshift('EPIC-65')
  }
  nodes.push(node)
}

const stages = [
  ['PREFLIGHT', 'implementation', 'Подтвердить входные условия, точный scope, зависимости и stop conditions.', ['read', 'plan']],
  ['IMPLEMENT', 'implementation', 'Реализовать outcome эпика строго в его границах.', ['read', 'edit', 'test', 'commit', 'push']],
  ['VERIFY', 'implementation', 'Доказать acceptance эпика релевантными проверками и артефактами.', ['read', 'test', 'commit', 'push']],
  ['EVIDENCE', 'implementation', 'Зафиксировать traceability, результаты проверок и отклонения без дублирования Source of Truth.', ['read', 'edit', 'commit', 'push']],
  ['DELIVERY', 'delivery', 'Провести review, один exact-head risk-based gate и merge по MERGE_AFTER_GATE без production.', ['read', 'test', 'commit', 'push', 'create_pr', 'merge_after_gate']],
]

for (let number = 53; number <= 65; number += 1) {
  const key = `EPIC-${number}`
  const { alias, title } = rpTitles.get(key)
  const previousEpic = number > 53 ? `EPIC-${number - 1}` : null
  nodes.push({
    key,
    title: `${alias} — ${title}`,
    type: 'epic',
    source_anchor: key,
    goal: `Достичь проверяемого outcome ${alias} «${title}» по V4 city-first plan.`,
    scope: [`Выполнить ${alias} строго по одноимённому разделу master plan.`],
    acceptance_criteria: [`Все acceptance условия ${alias} доказаны артефактами и проверками.`],
    depends_on: previousEpic ? [previousEpic] : [],
    delivery_mode: 'MERGE_AFTER_GATE',
    required_context: commonContext,
    allowed_actions: ['read', 'plan'],
    stop_conditions: ['source or inventory drift', 'production, DNS, secret mutation or destructive external action'],
    priority: 1,
    labels: ['wave:v4-replan', `alias:${alias.toLowerCase()}`],
  })

  const siblingKeys = []
  for (const [stage, workKind, stageGoal, allowedActions] of stages) {
    const taskKey = `TASK-${number}-${stage}`
    const dependencies = []
    if (previousEpic) dependencies.push(previousEpic)
    if (stage !== 'PREFLIGHT') dependencies.push(siblingKeys.at(-1))
    if (workKind === 'delivery') dependencies.push(...siblingKeys.filter((item) => !dependencies.includes(item)))
    const gate = number >= 55 && number <= 60 ? 'RISKY plus verify:schema' : number === 65 ? 'RISKY closure' : 'STANDARD unless the exact diff requires escalation'
    nodes.push({
      key: taskKey,
      title: `${alias} ${stage.toLowerCase()}`,
      type: 'task',
      role: 'implementation',
      work_kind: workKind,
      repository_key: 'don-city-next',
      parent_key: key,
      source_anchor: key,
      goal: `${stageGoal} Эпик: ${alias} — ${title}.`,
      scope: [`Canonical instruction: ${alias} — ${title}.`, `Работать только в scope ${alias}; не выполнять production или скрытые внешние mutations.`],
      acceptance_criteria: [`Acceptance ${alias} из master plan доказан для стадии ${stage}.`, 'Execution evidence contains exact branch/base/head and real check results.'],
      required_checks: [`Проверить acceptance раздела ${alias}.`, `Gate policy: ${gate}.`],
      depends_on: dependencies,
      required_context: commonContext,
      allowed_actions: allowedActions,
      stop_conditions: ['source or inventory drift', 'production/DNS/secret mutation', 'destructive migration without explicit owner authority'],
      priority: 1,
      labels: ['wave:v4-replan', `alias:${alias.toLowerCase()}`, `stage:${stage.toLowerCase()}`],
    })
    siblingKeys.push(taskKey)
  }
}

nodes.sort((a, b) => a.key.localeCompare(b.key, 'en'))
const epicAnchors = nodes.filter((node) => node.type === 'epic').map((node) => node.source_anchor).sort((a, b) => a.localeCompare(b, 'en'))
const inventory = {
  schema_version: 2,
  beads_prefix: 'dcv4',
  source: {
    plan_id: 'AMS-DON-CITY-REPLAN-V4-CITY-FIRST',
    path: planPath,
    version: 'v7',
    status: sourceStatus,
    approved_by: sourceStatus === 'APPROVED' ? 'owner' : null,
    approved_at: sourceStatus === 'APPROVED' ? '2026-09-24T11:15:46+03:00' : null,
    sha256: createHash('sha256').update(Buffer.from(plan)).digest('hex'),
    epic_anchors: epicAnchors,
  },
  repositories: previous.repositories,
  nodes,
}

writeFileSync(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8')
const counts = nodes.reduce((result, node) => ({ ...result, [node.type]: (result[node.type] ?? 0) + 1 }), {})
process.stdout.write(`${JSON.stringify({ epicAnchors: epicAnchors.length, ...counts })}\n`)
