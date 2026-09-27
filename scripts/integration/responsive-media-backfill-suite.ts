import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import type { Media } from "../../src/project/payload-types.ts";

type StoredObject = { body: Buffer; contentType: string };

function collectRequestBody(request: NodeJS.ReadableStream): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		request.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
		request.on("end", () => resolve(Buffer.concat(chunks)));
		request.on("error", reject);
	});
}

function runBackfill(args: string[], env: NodeJS.ProcessEnv) {
	return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
		const child = spawn(
			process.execPath,
			[
				"--conditions=react-server",
				"--experimental-strip-types",
				"scripts/backfill-responsive-media.ts",
				...args,
			],
			{ cwd: process.cwd(), env, stdio: ["ignore", "pipe", "pipe"] },
		);
		let stdout = "";
		let stderr = "";
		child.stdout.on("data", (chunk) => (stdout += String(chunk)));
		child.stderr.on("data", (chunk) => (stderr += String(chunk)));
		child.on("error", reject);
		child.on("exit", (code) => {
			if (code === 0) resolve({ stdout, stderr });
			else reject(new Error(`Backfill exited ${code}: ${stderr || stdout}`));
		});
	});
}

function assert(condition: unknown, message: string): asserts condition {
	if (!condition) throw new Error(message);
}

const objects = new Map<string, StoredObject>();
const server = createServer(async (request, response) => {
	try {
		const url = new URL(request.url ?? "/", "http://127.0.0.1");
		const key = decodeURIComponent(url.pathname.replace(/^\//, ""));
		if (!key.includes("/")) {
			response.writeHead(404, { "content-type": "application/xml" });
			response.end("<Error><Code>NoSuchBucket</Code></Error>");
			return;
		}
		if (request.method === "PUT") {
			objects.set(key, {
				body: await collectRequestBody(request),
				contentType: String(
					request.headers["content-type"] ?? "application/octet-stream",
				),
			});
			response.writeHead(200, { etag: '"local-test-etag"' });
			response.end();
			return;
		}
		if (request.method === "DELETE") {
			objects.delete(key);
			response.writeHead(204);
			response.end();
			return;
		}
		const stored = objects.get(key);
		if (!stored) {
			response.writeHead(404, { "content-type": "application/xml" });
			response.end("<Error><Code>NoSuchKey</Code></Error>");
			return;
		}
		if (request.method === "HEAD") {
			response.writeHead(200, {
				"content-length": stored.body.byteLength,
				"content-type": stored.contentType,
				etag: '"local-test-etag"',
			});
			response.end();
			return;
		}
		if (request.method === "GET") {
			response.writeHead(200, {
				"content-length": stored.body.byteLength,
				"content-type": stored.contentType,
			});
			response.end(stored.body);
			return;
		}
		response.writeHead(405);
		response.end();
	} catch (error) {
		response.writeHead(500);
		response.end(String(error));
	}
});

await new Promise<void>((resolve, reject) => {
	server.once("error", reject);
	server.listen(0, "127.0.0.1", resolve);
});

const address = server.address();
assert(address && typeof address === "object", "Local S3 server did not bind.");
const bucket = "don-city-cp04-test";
const prefix = "cp04-test";
const endpoint = `http://127.0.0.1:${address.port}`;
const testEnv: NodeJS.ProcessEnv = {
	...process.env,
	NODE_ENV: "test",
	JOBS_AUTORUN: "false",
	PAYLOAD_DB_PUSH: "false",
	S3_ENDPOINT: endpoint,
	S3_REGION: "test",
	S3_BUCKET: bucket,
	S3_ACCESS_KEY_ID: "local-test-access",
	S3_SECRET_ACCESS_KEY: "local-test-secret",
	S3_PREFIX: prefix,
	MEDIA_BACKFILL_CONFIRM: `test:${bucket}:${prefix}`,
};
Object.assign(process.env, testEnv);

const temporaryDirectory = await mkdtemp(
	path.join(tmpdir(), "don-city-cp04-media-"),
);
const manifestPath = path.join(temporaryDirectory, "manifest.json");
let payload: Awaited<
	ReturnType<typeof import("payload")["getPayload"]>
> | null = null;
let mediaId: number | null = null;

try {
	const [{ getPayload }, { default: config }, { systemOverrideAccess }] =
		await Promise.all([
			import("payload"),
			import("../../payload.config.ts"),
			import("../../src/core/data-access/system/overrides.ts"),
		]);
	payload = await getPayload({ config });
	const access = systemOverrideAccess("controlled-maintenance");
	const image = await sharp({
		create: {
			width: 1600,
			height: 1200,
			channels: 3,
			background: { r: 24, g: 96, b: 64 },
		},
	})
		.jpeg({ quality: 85 })
		.toBuffer();
	const created = (await payload.create({
		collection: "media",
		data: { alt: "CP-04 isolated responsive-media proof" },
		file: {
			data: image,
			mimetype: "image/jpeg",
			name: "cp04-proof.jpg",
			size: image.byteLength,
		},
		...access,
	} as never)) as unknown as Media;
	mediaId = Number(created.id);
	const originalKey = `${prefix}/${created.filename}`;
	assert(objects.has(`${bucket}/${originalKey}`), "Original was not uploaded.");
	for (const size of Object.values(created.sizes ?? {})) {
		if (size?.filename) {
			objects.delete(`${bucket}/${prefix}/${size.filename}`);
		}
	}
	await payload.update({
		collection: "media",
		id: created.id,
		data: {
			sizes: Object.fromEntries(
				["thumb", "card", "detail"].map((name) => [
					name,
					{
						url: null,
						width: null,
						height: null,
						mimeType: null,
						filesize: null,
						filename: null,
					},
				]),
			),
		} as never,
		...access,
	});
	const legacy = await payload.findByID({
		collection: "media",
		id: created.id,
		depth: 0,
		...access,
	});
	assert(
		Object.values(legacy.sizes ?? {}).every((size) => !size?.filename),
		"Fixture did not clear generated size metadata.",
	);

	const dryRun = await runBackfill(["--environment=test"], testEnv);
	assert(
		dryRun.stdout.includes(String(created.id)),
		"Dry-run did not report the legacy media candidate.",
	);
	await runBackfill(
		["--environment=test", "--apply", `--manifest=${manifestPath}`],
		testEnv,
	);
	const afterApply = await payload.findByID({
		collection: "media",
		id: created.id,
		depth: 0,
		...access,
	});
	for (const name of ["thumb", "card", "detail"] as const) {
		const size = afterApply.sizes?.[name];
		assert(size?.filename, `${name} metadata was not created.`);
		assert(
			objects.has(`${bucket}/${prefix}/${size.filename}`),
			`${name} object was not created in isolated storage; stored keys: ${[
				...objects.keys(),
			].join(", ")}.`,
		);
	}
	const rerun = await runBackfill(["--environment=test"], testEnv);
	assert(
		rerun.stdout.includes('"needsBackfill":[]'),
		"Backfill rerun is not idempotent.",
	);
	await runBackfill(
		["--environment=test", "--rollback", `--manifest=${manifestPath}`],
		testEnv,
	);
	const afterRollback = await payload.findByID({
		collection: "media",
		id: created.id,
		depth: 0,
		...access,
	});
	assert(
		Object.values(afterRollback.sizes ?? {}).every((size) => !size?.filename),
		"Rollback did not restore the prior empty size metadata.",
	);
	const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as {
		entries: Array<{ createdKeys: string[] }>;
	};
	for (const key of manifest.entries.flatMap((entry) => entry.createdKeys)) {
		assert(!objects.has(`${bucket}/${key}`), `Rollback left ${key} behind.`);
	}
	assert(
		objects.has(`${bucket}/${originalKey}`),
		"Rollback deleted the original.",
	);

	console.log(
		JSON.stringify({
			status: "PASS",
			mediaId: created.id,
			variants: 3,
			originalPreserved: true,
			idempotentRerun: true,
			rollback: true,
		}),
	);
} finally {
	if (payload && mediaId !== null) {
		try {
			const { systemOverrideAccess } = await import(
				"../../src/core/data-access/system/overrides.ts"
			);
			await payload.delete({
				collection: "media",
				id: mediaId,
				...systemOverrideAccess("controlled-maintenance"),
			});
		} catch {
			// The disposable test database keeps cleanup isolated if delete fails.
		}
	}
	await payload?.destroy();
	await new Promise<void>((resolve) => server.close(() => resolve()));
	await rm(temporaryDirectory, { recursive: true, force: true });
}

process.exit(0);
