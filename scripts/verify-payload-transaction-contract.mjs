import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { readFileSync } from "node:fs";

const root = process.cwd();
const projectRequire = createRequire(import.meta.url);
const dbIndex = projectRequire.resolve("@payloadcms/db-postgres");
const dbRequire = createRequire(dbIndex);
const drizzleIndex = dbRequire.resolve("@payloadcms/drizzle");
const drizzleRoot = dirname(dirname(drizzleIndex));

const payloadPackage = JSON.parse(
	readFileSync(resolve(projectRequire.resolve("payload"), "../../package.json"), "utf8"),
);
const dbPackage = JSON.parse(
	readFileSync(resolve(dbIndex, "../../package.json"), "utf8"),
);
const drizzlePackage = JSON.parse(
	readFileSync(join(drizzleRoot, "package.json"), "utf8"),
);

for (const [name, version] of [
	[payloadPackage.name, payloadPackage.version],
	[dbPackage.name, dbPackage.version],
	[drizzlePackage.name, drizzlePackage.version],
]) {
	assert.equal(version, "3.90.1", `${name} must stay pinned to 3.90.1`);
}

const beginSource = readFileSync(
	join(drizzleRoot, "dist/transactions/beginTransaction.js"),
	"utf8",
);
const transactionLookupSource = readFileSync(
	join(drizzleRoot, "dist/utilities/getTransaction.js"),
	"utf8",
);
const projectHelper = readFileSync(
	join(root, "src/core/data-access/system/payload-transaction.ts"),
	"utf8",
);

assert.match(beginSource, /this\.sessions\[id\]\s*=\s*\{[\s\S]*?db:\s*transaction/);
assert.match(
	transactionLookupSource,
	/adapter\.sessions\[await req\.transactionID\]\?\.db \|\| adapter\.drizzle/,
);
assert.match(projectHelper, /adapter\.sessions\?\.\[String\(resolvedTransactionID\)\]\?\.db/);
assert.doesNotMatch(projectHelper, /adapter\.drizzle|payload\.db\.drizzle/);
assert.match(projectHelper, /refusing a non-atomic raw SQL fallback/);

console.log(
	"Payload 3.90.1 transaction contract: PASS (transactionID -> sessions[id].db; default drizzle fallback forbidden)",
);
