import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const blueprintRoot = path.join(root, "deploy/clients/timeweb");
const requiredFiles = [
	"README.md",
	"env.client.example",
	"payload/s3-plugin.example.ts",
	"payload/activation.patch.md",
	"compose/client.compose.yml.example",
	"nginx/site.conf.example",
	"backup/README.md",
	"monitoring/README.md",
	"proofs/CLIENT_TIMEWEB_PROOF.md",
	"staging/compose.staging.yml.example",
	"staging/env.staging.example",
	"staging/nginx.staging.conf.example",
	"proofs/STAGING_PROOF.md",
];

export function validateBlueprint(input) {
	const errors = [];
	const add = (message) => {
		if (!errors.includes(message)) errors.push(message);
	};
	const allText = [...input.files.values()].join("\n");
	const compose = input.files.get("compose/client.compose.yml.example") ?? "";
	const nginx = input.files.get("nginx/site.conf.example") ?? "";
	const proof = input.files.get("proofs/CLIENT_TIMEWEB_PROOF.md") ?? "";
	const stagingCompose =
		input.files.get("staging/compose.staging.yml.example") ?? "";
	const stagingEnv = input.files.get("staging/env.staging.example") ?? "";
	const stagingNginx =
		input.files.get("staging/nginx.staging.conf.example") ?? "";

	for (const file of requiredFiles)
		if (!input.files.has(file)) add(`missing:${file}`);
	if (allText.includes("start-baza.ams24.ru")) add("starter-demo-domain");
	if (/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/.test(allText))
		add("credential-shaped-value");
	if (
		/^[ \t]*(?:DATABASE_URI|PAYLOAD_SECRET|S3_SECRET_ACCESS_KEY)[ \t]*=[ \t]*\S+/m.test(
			allText,
		)
	) {
		add("secret-example-value");
	}
	if (!compose.includes('image: "${IMAGE:?')) add("immutable-image-missing");
	if (/^\s*build\s*:/m.test(compose) || /git pull|pnpm build/i.test(compose))
		add("server-build-path");
	if ((compose.match(/JOBS_AUTORUN:\s*["']?true/g) ?? []).length !== 1)
		add("jobs-owner-count");
	if (!stagingCompose.includes('image: "${IMAGE:?'))
		add("staging-immutable-image-missing");
	if (/^\s*build\s*:/m.test(stagingCompose) || /git pull|pnpm build/i.test(stagingCompose))
		add("staging-server-build-path");
	if (!/JOBS_AUTORUN:\s*["']false["']/.test(stagingCompose))
		add("staging-jobs-must-be-disabled");
	if (!/^JOBS_AUTORUN=false$/m.test(stagingEnv))
		add("staging-env-jobs-must-be-disabled");
	if (!stagingNginx.includes('X-Robots-Tag "noindex, nofollow" always'))
		add("staging-noindex-header-missing");
	if (!stagingNginx.includes("__STAGING_DOMAIN__"))
		add("staging-domain-placeholder-missing");
	for (const marker of [
		"127.0.0.1:3100:3000",
		"__ADMIN_OR_RUNTIME_CIDR__",
		"__ADMIN_ACCESS_POLICY__",
		"location = /api/public/leads",
		"location = /api/internal/revalidate",
		"staging_login",
		"staging_leads",
		"staging_internal",
	]) {
		const source = marker === "127.0.0.1:3100:3000" ? stagingCompose : stagingNginx;
		if (!source.includes(marker)) add(`staging-security-marker:${marker}`);
	}
	if (
		/alias\s+[^;]*media/i.test(nginx) ||
		/location\s+[^\n]*\/media\//i.test(nginx)
	)
		add("local-media-alias");
	for (const marker of [
		"__CLIENT_DOMAIN__",
		"Strict-Transport-Security",
		"X-Content-Type-Options",
		"Referrer-Policy",
		"X-Frame-Options",
		"__ADMIN_ACCESS_POLICY__",
	]) {
		if (!nginx.includes(marker)) add(`nginx-marker:${marker}`);
	}
	for (const marker of [
		"Managed PostgreSQL",
		"S3-compatible",
		"Secret Master",
		"immutable image",
		"Exactly one runtime",
	]) {
		if (!allText.includes(marker)) add(`contract-marker:${marker}`);
	}
	for (const marker of [
		"Real Managed PostgreSQL connection | NOT PROVEN",
		"Real Payload Admin S3 upload | NOT PROVEN",
		"Restore drill | NOT PROVEN",
	]) {
		if (!proof.includes(marker)) add(`proof-marker:${marker}`);
	}
	const hasStorageAdapter = Boolean(
		input.packageJson.dependencies?.["@payloadcms/storage-s3"] ||
			input.packageJson.devDependencies?.["@payloadcms/storage-s3"],
	);
	if (input.projectKind !== "client" && hasStorageAdapter) {
		add("starter-storage-s3-dependency");
	}
	return errors;
}

const files = new Map(
	requiredFiles
		.filter((file) => fs.existsSync(path.join(blueprintRoot, file)))
		.map((file) => [
			file,
			fs.readFileSync(path.join(blueprintRoot, file), "utf8"),
		]),
);
const packageJson = JSON.parse(
	fs.readFileSync(path.join(root, "package.json"), "utf8"),
);
const siteConfig = fs.readFileSync(
	path.join(root, "src/project/site.config.ts"),
	"utf8",
);
const projectKind = siteConfig.includes('projectKind: "client"')
	? "client"
	: "starter-demo";
assert.deepEqual(validateBlueprint({ files, packageJson, projectKind }), []);

const invalidFiles = new Map(files);
invalidFiles.set(
	"compose/client.compose.yml.example",
	`${invalidFiles.get("compose/client.compose.yml.example")}\nservices:\n  second-owner:\n    environment:\n      JOBS_AUTORUN: true\n`,
);
assert.ok(
	validateBlueprint({ files: invalidFiles, packageJson, projectKind }).includes(
		"jobs-owner-count",
	),
	"negative fixture must reject a second jobs owner",
);

const invalidStagingFiles = new Map(files);
invalidStagingFiles.set(
	"staging/compose.staging.yml.example",
	(invalidStagingFiles.get("staging/compose.staging.yml.example") ?? "").replace(
		'JOBS_AUTORUN: "false"',
		'JOBS_AUTORUN: "true"',
	),
);
invalidStagingFiles.set(
	"staging/nginx.staging.conf.example",
	(invalidStagingFiles.get("staging/nginx.staging.conf.example") ?? "").replace(
		'add_header X-Robots-Tag "noindex, nofollow" always;',
		"",
	),
);
const invalidStagingErrors = validateBlueprint({
	files: invalidStagingFiles,
	packageJson,
	projectKind,
});
assert.ok(
	invalidStagingErrors.includes("staging-jobs-must-be-disabled"),
	"negative fixture must reject an active staging jobs owner",
);
assert.ok(
	invalidStagingErrors.includes("staging-noindex-header-missing"),
	"negative fixture must reject staging without a noindex header",
);

console.log(
	"verify:timeweb-blueprint: PASS (static contract; live provider states NOT PROVEN)",
);
