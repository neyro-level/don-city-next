import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";

const root = process.cwd();
const outputDir = join(root, ".release");
const outputFile = join(outputDir, "release-manifest.json");

function git(args) {
	return execFileSync("git", args, {
		cwd: root,
		encoding: "utf8",
		stdio: ["ignore", "pipe", "pipe"],
	}).trim();
}
async function sha256(path) {
	const content = await readFile(join(root, path));
	return createHash("sha256").update(content).digest("hex");
}

const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const migrations = (await readdir(join(root, "migrations")))
	.filter((file) => file.endsWith(".ts") || file.endsWith(".json"))
	.sort();
const status = git(["status", "--short"]);
const branch = git(["branch", "--show-current"]);
const commit = git(["rev-parse", "HEAD"]);
const originMain = git(["rev-parse", "origin/main"]);

assert.equal(branch, "main", "RELEASE manifest requires the canonical main branch");
assert.equal(commit, originMain, "RELEASE manifest requires exact origin/main");
assert.equal(status, "", "RELEASE manifest requires a clean worktree");

const manifest = {
	project: packageJson.name,
	version: packageJson.version,
	profile: "REALTY_CATALOG",
	deliveryProfile: "CRITICAL",
	mode: "RELEASE",
	source: { branch, commit, originMain, clean: true },
	runtime: {
		node: packageJson.engines?.node,
		packageManager: packageJson.packageManager,
		nextRuntime: "next-start-full-image",
		jobsAutorunOwner: "single production runtime only",
		indexing: "public",
	},
	artifact: {
		format: "docker-image",
		imageName: "don-city-next",
		dockerfile: "Dockerfile",
	},
	migrations: migrations.map((file) => basename(file)),
	checksums: {
		"package.json": await sha256("package.json"),
		"pnpm-lock.yaml": await sha256("pnpm-lock.yaml"),
		Dockerfile: await sha256("Dockerfile"),
		"next.config.ts": await sha256("next.config.ts"),
	},
	rollback: {
		strategy: "switch the single production Compose service to the recorded previous immutable image",
	},
	generatedAt: new Date().toISOString(),
};

await mkdir(outputDir, { recursive: true });
await writeFile(outputFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Release manifest written: ${outputFile}`);
