import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { getPayload } from "payload";
import config from "../payload.config.ts";
import { calculatePropertyDerivedFields } from "../src/core/ingest/derived-fields.ts";
import { requirePayloadRuntime } from "../src/project/env.ts";

type CatalogItem = {
	externalId: string;
	slug: string;
	sourceUrl: string;
	sourceTitle: string;
	sourceImageCount: number;
	publishedAt: string;
	category: "apartment" | "house";
	title: string;
	publicAddress: string;
	districtRaw: string;
	price: number;
	rooms: number;
	totalArea: number;
	kitchenArea?: number;
	lotArea?: number;
	floor?: number;
	floors?: number;
	lat?: number;
	lng?: number;
	needsReview?: boolean;
	description: string;
};

type Catalog = {
	schemaVersion: "1.0";
	collectedAt: string;
	sourceProfile: string;
	sourceIdentity: string;
	items: CatalogItem[];
};

type SourceProduct = {
	"@type": "Product";
	name: string;
	image: string[] | string;
	offers: {
		price: number;
		priceCurrency: string;
		availability: string;
	};
};

const catalogPath = join(
	process.cwd(),
	"scripts",
	"data",
	"doncity-listings.json",
);
const verifyCatalogOnly = process.argv.includes("--verify-catalog");
const sourceCheckOnly = process.argv.includes("--source-check");
const verifyImportOnly = process.argv.includes("--verify-only");
const sourceHost = "dnr.red";

function readCatalog(): Catalog {
	return JSON.parse(readFileSync(catalogPath, "utf8")) as Catalog;
}

function validateCatalog(catalog: Catalog): void {
	const errors: string[] = [];
	if (catalog.schemaVersion !== "1.0") errors.push("schemaVersion must be 1.0");
	if (catalog.items.length !== 12) errors.push("exactly 12 items are required");
	if (catalog.items.filter((item) => item.category === "house").length < 3) {
		errors.push("at least 3 house/land-attached items are required");
	}
	const externalIds = new Set<string>();
	const slugs = new Set<string>();
	for (const item of catalog.items) {
		if (externalIds.has(item.externalId))
			errors.push(`duplicate externalId ${item.externalId}`);
		if (slugs.has(item.slug)) errors.push(`duplicate slug ${item.slug}`);
		externalIds.add(item.externalId);
		slugs.add(item.slug);
		const source = new URL(item.sourceUrl);
		if (source.protocol !== "https:" || source.hostname !== sourceHost) {
			errors.push(`unapproved source URL for ${item.externalId}`);
		}
		if (!Number.isInteger(item.sourceImageCount) || item.sourceImageCount < 1) {
			errors.push(`invalid sourceImageCount for ${item.externalId}`);
		}
		if (!Number.isInteger(item.price) || item.price <= 0) {
			errors.push(`invalid price for ${item.externalId}`);
		}
		const publicCopy = `${item.title}\n${item.publicAddress}\n${item.description}`;
		if (/\+?7[\s(\-]*\d{3}/.test(publicCopy)) {
			errors.push(`phone-like PII in public copy for ${item.externalId}`);
		}
	}
	if (errors.length > 0)
		throw new Error(`DON CITY catalog invalid:\n- ${errors.join("\n- ")}`);
}

function decodeHtmlEntities(value: string): string {
	return value
		.replaceAll("&quot;", '"')
		.replaceAll("&amp;", "&")
		.replaceAll("&lt;", "<")
		.replaceAll("&gt;", ">");
}

async function fetchSourceProduct(item: CatalogItem): Promise<SourceProduct> {
	const response = await fetch(item.sourceUrl, {
		headers: { "user-agent": "DON-CITY-one-time-import/1.0" },
		signal: AbortSignal.timeout(20_000),
	});
	if (!response.ok)
		throw new Error(`${item.externalId}: source returned ${response.status}`);
	const html = await response.text();
	const scripts = [
		...html.matchAll(
			/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
		),
	];
	const products = scripts
		.map((match) => {
			try {
				return JSON.parse(decodeHtmlEntities(match[1])) as { "@type"?: string };
			} catch {
				return null;
			}
		})
		.filter((value): value is SourceProduct => value?.["@type"] === "Product");
	const product = products[0];
	if (!product)
		throw new Error(`${item.externalId}: Product JSON-LD is missing`);
	const images = Array.isArray(product.image) ? product.image : [product.image];
	if (product.name !== item.sourceTitle)
		throw new Error(`${item.externalId}: source title drift`);
	if (Number(product.offers?.price) !== item.price)
		throw new Error(`${item.externalId}: source price drift`);
	if (product.offers?.priceCurrency !== "RUB")
		throw new Error(`${item.externalId}: source currency drift`);
	if (!String(product.offers?.availability).endsWith("/InStock")) {
		throw new Error(`${item.externalId}: source listing is not active`);
	}
	if (images.length !== item.sourceImageCount) {
		throw new Error(
			`${item.externalId}: source image count drift (${images.length})`,
		);
	}
	for (const image of images) {
		const parsed = new URL(image);
		if (parsed.protocol !== "https:" || parsed.hostname !== sourceHost) {
			throw new Error(`${item.externalId}: unapproved image host`);
		}
	}
	return { ...product, image: images };
}

function fileExtension(url: string, mimeType: string): string {
	const pathnameExtension = extname(new URL(url).pathname).toLowerCase();
	if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(pathnameExtension)) {
		return pathnameExtension;
	}
	const byMime: Record<string, string> = {
		"image/jpeg": ".jpg",
		"image/png": ".png",
		"image/webp": ".webp",
		"image/gif": ".gif",
	};
	return byMime[mimeType] ?? ".jpg";
}

async function downloadImage(url: string) {
	const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
	if (!response.ok)
		throw new Error(`image returned ${response.status}: ${url}`);
	const mimeType =
		response.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
	if (!mimeType.startsWith("image/"))
		throw new Error(`image MIME is invalid: ${url}`);
	const data = Buffer.from(await response.arrayBuffer());
	if (data.length === 0 || data.length > 20 * 1024 * 1024) {
		throw new Error(`image size is invalid (${data.length}): ${url}`);
	}
	return { data, mimeType };
}

function importHash(item: CatalogItem, imageUrls: string[]): string {
	return createHash("sha256")
		.update(JSON.stringify({ item, imageUrls }))
		.digest("hex");
}

const catalog = readCatalog();
validateCatalog(catalog);

if (verifyCatalogOnly) {
	console.log(
		"DON CITY listing catalog ok: 12 active candidates, 3 house/land-attached items",
	);
	process.exit(0);
}

const sourceProducts = new Map<string, SourceProduct>();
for (const item of catalog.items) {
	sourceProducts.set(item.externalId, await fetchSourceProduct(item));
}

if (sourceCheckOnly) {
	const imageCount = [...sourceProducts.values()].reduce(
		(total, product) => total + (product.image as string[]).length,
		0,
	);
	console.log(
		`DON CITY source check ok: ${catalog.items.length} active listings, ${imageCount} images`,
	);
	process.exit(0);
}

requirePayloadRuntime();
const payload = await getPayload({ config });
const access = {
	overrideAccess: true,
	context: {
		systemGatewayOperation: "controlled-maintenance",
		source: "import",
	},
} as const;

try {
	let createdProperties = 0;
	let updatedProperties = 0;
	let createdMedia = 0;

	for (const item of catalog.items) {
		const product = sourceProducts.get(item.externalId);
		if (!product)
			throw new Error(`${item.externalId}: checked source is missing`);
		const imageUrls = product.image as string[];
		const managedImages: Array<Record<string, unknown>> = [];

		for (const [index, imageUrl] of imageUrls.entries()) {
			const baseName = `${item.externalId}-${String(index + 1).padStart(2, "0")}`;
			const existing = await payload.find({
				collection: "media",
				depth: 0,
				limit: 1,
				where: { alt: { equals: `${item.title} — фото ${index + 1}` } },
				...access,
			});
			let mediaId = existing.docs[0]?.id;
			if (!mediaId && !verifyImportOnly) {
				const image = await downloadImage(imageUrl);
				const name = `${baseName}${fileExtension(imageUrl, image.mimeType)}`;
				const media = await payload.create({
					collection: "media",
					data: { alt: `${item.title} — фото ${index + 1}` },
					file: {
						data: image.data,
						mimetype: image.mimeType,
						name,
						size: image.data.length,
					},
					...access,
				} as never);
				mediaId = media.id;
				createdMedia += 1;
			}
			if (!mediaId)
				throw new Error(
					`${item.externalId}: managed media ${index + 1} is missing`,
				);
			managedImages.push({
				kind: "managed",
				media: mediaId,
				alt: `${item.title} — фото ${index + 1}`,
				order: index,
			});
		}

		const existing = await payload.find({
			collection: "properties",
			depth: 0,
			limit: 1,
			where: {
				or: [
					{ externalId: { equals: item.externalId } },
					{ slug: { equals: item.slug } },
				],
			},
			...access,
		});
		if (verifyImportOnly) {
			if (!existing.docs[0])
				throw new Error(`${item.externalId}: imported property is missing`);
			continue;
		}

		const priceMinor = item.price * 100;
		const data = {
			origin: "manual",
			externalId: item.externalId,
			importHash: importHash(item, imageUrls),
			firstSeenAt: catalog.collectedAt,
			lastSeenAt: catalog.collectedAt,
			status: "active",
			needsReview: item.needsReview ?? false,
			publishedAt: item.publishedAt,
			slug: item.slug,
			market: "secondary",
			category: item.category,
			dealType: "sale",
			priceMinor,
			currency: "RUB",
			pricePerMeterMinor: calculatePropertyDerivedFields({
				priceMinor,
				totalArea: item.totalArea,
			}).pricePerMeterMinor,
			rooms: item.rooms,
			totalArea: item.totalArea,
			kitchenArea: item.kitchenArea,
			lotArea: item.lotArea,
			floor: item.floor,
			floors: item.floors,
			regionRaw: "Донецкая Народная Республика",
			cityRaw: "Донецк",
			districtRaw: item.districtRaw,
			publicAddress: item.publicAddress,
			lat: item.lat,
			lng: item.lng,
			title: item.title,
			description: item.description,
			images: managedImages,
			internalComment: [
				"One-time manual inventory import from the public DON CITY profile mirror.",
				`source=${item.sourceUrl}`,
				`sourceProfile=${catalog.sourceProfile}`,
				`collectedAt=${catalog.collectedAt}`,
				"Public copy is paraphrased; source phone numbers are intentionally omitted.",
			].join("\n"),
		};

		if (existing.docs[0]) {
			await payload.update({
				collection: "properties",
				id: existing.docs[0].id,
				data,
				...access,
			} as never);
			updatedProperties += 1;
		} else {
			await payload.create({
				collection: "properties",
				data,
				...access,
			} as never);
			createdProperties += 1;
		}
	}

	console.log(
		verifyImportOnly
			? "DON CITY import verification ok: 12 properties and all managed images are present"
			: `DON CITY import complete: createdProperties=${createdProperties}, updatedProperties=${updatedProperties}, createdMedia=${createdMedia}`,
	);
} finally {
	await payload.destroy();
}
