import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..', '..')
const planPath = resolve(root, 'docs/AMS_DON_CITY_FINAL_MASTER_PLAN_V4_0.md')
const inventoryPath = resolve(root, 'docs/task-manager-inventory.v2.json')
const plan = readFileSync(planPath, 'utf8')
const inventory = JSON.parse(readFileSync(inventoryPath, 'utf8'))

const version = plan.match(/^Version:\s*(v\d+)\s*$/m)?.[1]
const status = plan.match(/^Status:\s*([A-Z_]+)\s*$/m)?.[1]
const sha256 = createHash('sha256').update(Buffer.from(plan)).digest('hex')
const anchors = [...plan.matchAll(/^## (EPIC-(?:6[7-9]|7[0-6])) \/ CP-[0-9A-Z]+ — /gm)]
  .map((match) => match[1])
  .sort((a, b) => a.localeCompare(b, 'en'))

assert.equal(version, 'v9')
assert.equal(status, 'APPROVED')
assert.equal(inventory.schema_version, 2)
assert.equal(inventory.beads_prefix, 'dc55')
assert.equal(inventory.source.plan_id, 'AMS-DON-CITY-CORE55-POSTPROD')
assert.equal(inventory.source.version, version)
assert.equal(inventory.source.status, status)
assert.equal(inventory.source.approved_by, 'owner')
assert.equal(inventory.source.approved_at, '2026-09-27T01:23:46+03:00')
assert.equal(inventory.source.sha256, sha256)
assert.deepEqual(inventory.source.epic_anchors, anchors)

const nodes = new Map(inventory.nodes.map((node) => [node.key, node]))
assert.equal(nodes.size, inventory.nodes.length, 'duplicate node key')
assert.equal(inventory.nodes.filter((node) => node.type === 'epic').length, 10)
assert.equal(inventory.nodes.filter((node) => node.type === 'task').length, 45)

for (const node of inventory.nodes) {
  for (const field of ['key', 'title', 'type', 'source_anchor', 'goal', 'scope', 'acceptance_criteria', 'depends_on', 'required_context', 'allowed_actions', 'stop_conditions']) {
    assert.ok(node[field] !== undefined, `${node.key} missing ${field}`)
  }
  for (const dependency of node.depends_on) {
    assert.ok(nodes.has(dependency), `${node.key} has missing dependency ${dependency}`)
  }
}

const visiting = new Set()
const visited = new Set()
const visit = (key) => {
  if (visited.has(key)) return
  assert.ok(!visiting.has(key), `dependency cycle at ${key}`)
  visiting.add(key)
  for (const dependency of nodes.get(key).depends_on) visit(dependency)
  visiting.delete(key)
  visited.add(key)
}
for (const key of nodes.keys()) visit(key)

for (let number = 67; number <= 75; number += 1) {
  const tasks = inventory.nodes.filter((node) => node.parent_key === `EPIC-${number}`)
  assert.equal(tasks.length, 5, `EPIC-${number} task count`)
  assert.ok(tasks.some((node) => node.key === `TASK-${number}-DELIVERY` && node.work_kind === 'delivery'))
}
assert.equal(inventory.nodes.filter((node) => node.parent_key === 'EPIC-76').length, 0, 'production epic must not have autonomous tasks')

console.log(JSON.stringify({
  validation: 'PASS',
  version,
  status,
  sha256,
  coverage: `${anchors.length}/${anchors.length}`,
  epics: 10,
  tasks: 45,
  cycles: 0,
  production_tasks: 0,
}, null, 2))
