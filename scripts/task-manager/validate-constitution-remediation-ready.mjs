import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..', '..')
const planPath = resolve(root, 'docs/DON_CITY_FINAL_CONSTITUTION_REMEDIATION_MASTER_PLAN_V2_0.md')
const inventoryPath = resolve(root, 'docs/task-manager-inventory.v2.json')
const plan = readFileSync(planPath, 'utf8')
const inventory = JSON.parse(readFileSync(inventoryPath, 'utf8'))
const hash = createHash('sha256').update(Buffer.from(plan)).digest('hex')
const nodes = new Map(inventory.nodes.map((node) => [node.key, node]))

assert.equal(plan.match(/^Version:\s*(v\d+)\s*$/m)?.[1], 'v1')
assert.equal(plan.match(/^Status:\s*([A-Z_]+)\s*$/m)?.[1], 'APPROVED')
assert.equal(inventory.schema_version, 2)
assert.equal(inventory.beads_prefix, 'dccr')
assert.equal(inventory.source.plan_id, 'AMS-DON-CITY-CONSTITUTION-REMEDIATION')
assert.equal(inventory.source.sha256, hash)
assert.equal(inventory.nodes.filter((node) => node.type === 'epic').length, 5)
assert.equal(inventory.nodes.filter((node) => node.work_kind === 'implementation').length, 44)
assert.equal(inventory.nodes.filter((node) => node.work_kind === 'delivery').length, 5)
assert.equal(inventory.nodes.filter((node) => /PROD-0[12]/.test(node.key)).length, 0)
assert.equal(nodes.size, inventory.nodes.length, 'duplicate node key')

for (const node of inventory.nodes) {
  for (const dependency of node.depends_on) assert.ok(nodes.has(dependency), `${node.key} missing dependency ${dependency}`)
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

for (let number = 1; number <= 5; number += 1) {
  const suffix = String(number).padStart(2, '0')
  const siblings = inventory.nodes.filter((node) => node.parent_key === `EPIC-${suffix}` && node.work_kind === 'implementation')
  const delivery = nodes.get(`TASK-${suffix}-DELIVERY`)
  assert.ok(delivery, `missing EPIC-${suffix} delivery task`)
  for (const sibling of siblings) assert.ok(delivery.depends_on.includes(sibling.key), `${delivery.key} missing ${sibling.key}`)
}

console.log(JSON.stringify({ validation: 'PASS', plan: 'AMS-DON-CITY-CONSTITUTION-REMEDIATION v1 APPROVED', sha256: hash, epics: 5, implementation_tasks: 44, delivery_tasks: 5, cycles: 0, production_tasks: 0 }, null, 2))
