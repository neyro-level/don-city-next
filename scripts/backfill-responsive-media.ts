import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
	DeleteObjectCommand,
	GetObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getPayload } from "payload";
import sharp from "sharp";
import config from "../payload.config.ts";
import { systemOverrideAccess } from "../src/core/data-access/system/overrides.ts";
import type { Media } from "../src/project/payload-types.ts";

const variantSpecs = [
	{ name: "thumb", width: 320 },
	{ name: "card", width: 640 },
	{ name: "detail", width: 1280 },
] as const;
const maintenanceAccess = systemOverrideAccess("controlled-maintenance");

type VariantName = (typeof variantSpecs)[number]["name"];
type StoredSize = NonNullable<Media["sizes"]>[VariantName];
type ManifestEntry = {
	mediaId: number;
	previousSizes: Media["sizes"];
	createdKeys: string[];
};
type Manifest = {
	version: 1;
	runId: string;
	environment: "staging" | "test";
	bucket: string;
	prefix: string;
	createdAt: string;
	entries: ManifestEntry[];
};

function argument(name: string) {
	const prefix = `--${name}=`;
	return process.argv
		.find((value) => value.startsWith(prefix))
		?.slice(prefix.length);
}

function required(value: string | undefined, name: string) {
	if (!value?.trim()) throw new Error(`${name} is required.`);
	return value.trim();
}

function objectKeyForVariant(originalKey: string, filename: string) {
	const directory = path.posix.dirname(originalKey);
	return directory === "." ? filename : `${directory}/${filename}`;
}

function variantFilename(
	originalFilename: string,
	spec: (typeof variantSpecs)[number],
	actualWidth: number,
) {
	const extension = path.extname(originalFilename);
	const stem = path.basename(originalFilename, extension);
	return `${stem}-${spec.name}-${actualWidth}w.webp`;
}

async function bodyBuffer(body: unknown): Promise<Buffer> {
	if (
		body &&
		typeof body === "object" &&
		"transformToByteArray" in body &&
		typeof body.transformToByteArray === "function"
	) {
		return Buffer.from(await body.transformToByteArray());
	}
	throw new Error("S3 response body cannot be converted to a buffer.");
}

async function objectExists(client: S3Client, bucket: string, key: string) {
	try {
		await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
		return true;
	} catch (error) {
		if (
			error &&
			typeof error === "object" &&
			"$metadata" in error &&
			(error as { $metadata?: { httpStatusCode?: number } }).$metadata
				?.httpStatusCode === 404
		) {
			return false;
		}
		throw error;
	}
}

function parseEnvironment(): "staging" | "test" {
	const value = argument("environment");
	if (value !== "staging" && value !== "test") {
		throw new Error("--environment must be staging or test.");
	}
	return value;
}

function assertMutationBoundary(input: {
	environment: "staging" | "test";
	bucket: string;
	prefix: string;
}) {
	if (process.env.NODE_ENV === "production") {
		throw new Error("Responsive media backfill is blocked in production.");
	}
	if (!input.prefix.toLowerCase().includes(input.environment)) {
		throw new Error(
			"S3_PREFIX must explicitly contain the selected environment.",
		);
	}
	const expected = `${input.environment}:${input.bucket}:${input.prefix}`;
	if (process.env.MEDIA_BACKFILL_CONFIRM !== expected) {
		throw new Error(
			`Set MEDIA_BACKFILL_CONFIRM to the exact isolated target: ${expected}`,
		);
	}
}

async function saveManifest(filename: string, manifest: Manifest) {
	await mkdir(path.dirname(filename), { recursive: true });
	await writeFile(filename, `${JSON.stringify(manifest, null, 2)}\n`, {
		encoding: "utf8",
		flag: "wx",
	});
}

async function updateManifest(filename: string, manifest: Manifest) {
	await writeFile(filename, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

async function main() {
	const apply = process.argv.includes("--apply");
	const rollback = process.argv.includes("--rollback");
	if (apply && rollback)
		throw new Error("Choose either --apply or --rollback.");
	const environment = parseEnvironment();
	const manifestPath =
		argument("manifest") ??
		path.resolve(
			"artifacts",
			`media-backfill-${environment}-${randomUUID()}.json`,
		);
	const payload = await getPayload({ config });

	const docs: Media[] = [];
	for (let page = 1; ; page += 1) {
		const result = await payload.find({
			collection: "media",
			page,
			limit: 100,
			depth: 0,
			...maintenanceAccess,
		});
		docs.push(...result.docs);
		if (!result.hasNextPage) break;
	}
	const candidates = docs.filter(
		(doc) =>
			doc.mimeType?.startsWith("image/") && doc.filename && doc._objectKey,
	);
	const incomplete = candidates.filter((doc) =>
		variantSpecs.some((spec) => !doc.sizes?.[spec.name]?.filename),
	);
	if (!apply && !rollback) {
		console.log(
			JSON.stringify({
				mode: "dry-run",
				environment,
				totalMedia: docs.length,
				imageCandidates: candidates.length,
				needsBackfill: incomplete.map((doc) => doc.id),
			}),
		);
		return;
	}

	const endpoint = required(process.env.S3_ENDPOINT, "S3_ENDPOINT");
	const region = required(process.env.S3_REGION, "S3_REGION");
	const bucket = required(process.env.S3_BUCKET, "S3_BUCKET");
	const accessKeyId = required(
		process.env.S3_ACCESS_KEY_ID,
		"S3_ACCESS_KEY_ID",
	);
	const secretAccessKey = required(
		process.env.S3_SECRET_ACCESS_KEY,
		"S3_SECRET_ACCESS_KEY",
	);
	const prefix = required(process.env.S3_PREFIX, "S3_PREFIX");
	const client = new S3Client({
		endpoint,
		region,
		forcePathStyle: true,
		credentials: { accessKeyId, secretAccessKey },
	});

	if (rollback) {
		assertMutationBoundary({ environment, bucket, prefix });
		const manifest = JSON.parse(
			await readFile(required(argument("manifest"), "--manifest"), "utf8"),
		) as Manifest;
		if (
			manifest.version !== 1 ||
			manifest.environment !== environment ||
			manifest.bucket !== bucket ||
			manifest.prefix !== prefix
		) {
			throw new Error(
				"Manifest target does not match the isolated runtime target.",
			);
		}
		for (const entry of [...manifest.entries].reverse()) {
			await payload.update({
				collection: "media",
				id: entry.mediaId,
				data: { sizes: entry.previousSizes } as never,
				...maintenanceAccess,
			});
			for (const key of entry.createdKeys) {
				await client.send(
					new DeleteObjectCommand({ Bucket: bucket, Key: key }),
				);
			}
		}
		console.log(
			JSON.stringify({ mode: "rollback", restored: manifest.entries.length }),
		);
		return;
	}

	assertMutationBoundary({ environment, bucket, prefix });
	const manifest: Manifest = {
		version: 1,
		runId: randomUUID(),
		environment,
		bucket,
		prefix,
		createdAt: new Date().toISOString(),
		entries: [],
	};
	await saveManifest(manifestPath, manifest);

	for (const doc of incomplete) {
		const originalKey = required(
			doc._objectKey ?? undefined,
			"media._objectKey",
		);
		if (!originalKey.startsWith(`${prefix.replace(/\/$/, "")}/`)) {
			throw new Error(`Media ${doc.id} is outside the approved prefix.`);
		}
		const original = await client.send(
			new GetObjectCommand({ Bucket: bucket, Key: originalKey }),
		);
		const source = await bodyBuffer(original.Body);
		const nextSizes: NonNullable<Media["sizes"]> = { ...(doc.sizes ?? {}) };
		const createdKeys: string[] = [];
		try {
			for (const spec of variantSpecs) {
				const output = await sharp(source)
					.resize({ width: spec.width, withoutEnlargement: true })
					.webp({ quality: 82 })
					.toBuffer({ resolveWithObject: true });
				const filename = variantFilename(
					doc.filename ?? "media",
					spec,
					output.info.width,
				);
				const key = objectKeyForVariant(originalKey, filename);
				if (!(await objectExists(client, bucket, key))) {
					await client.send(
						new PutObjectCommand({
							Bucket: bucket,
							Key: key,
							Body: output.data,
							ContentType: "image/webp",
						}),
					);
					createdKeys.push(key);
				}
				nextSizes[spec.name] = {
					filename,
					width: output.info.width,
					height: output.info.height,
					mimeType: "image/webp",
					filesize: output.data.byteLength,
				} satisfies StoredSize;
			}
			manifest.entries.push({
				mediaId: doc.id,
				previousSizes: doc.sizes,
				createdKeys,
			});
			await updateManifest(manifestPath, manifest);
			await payload.update({
				collection: "media",
				id: doc.id,
				data: { sizes: nextSizes } as never,
				...maintenanceAccess,
			});
		} catch (error) {
			for (const key of createdKeys) {
				await client.send(
					new DeleteObjectCommand({ Bucket: bucket, Key: key }),
				);
			}
			throw error;
		}
	}
	console.log(
		JSON.stringify({
			mode: "apply",
			updated: manifest.entries.length,
			manifestPath,
		}),
	);
}

await main();
