import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import sharp from "sharp";
import {
	cacheControlForMediaPath,
	immutableMediaCacheControl,
} from "../src/core/media/cache-policy.ts";

assert.equal(
	cacheControlForMediaPath(
		"/api/media/file/listing-123e4567-e89b-42d3-a456-426614174000-card-640w.webp",
	),
	immutableMediaCacheControl,
);
assert.equal(
	cacheControlForMediaPath(
		"/api/media/file/listing-123e4567-e89b-42d3-a456-426614174000.jpg",
	),
	immutableMediaCacheControl,
);
assert.equal(cacheControlForMediaPath("/api/media/file/legacy.jpg"), null);
assert.equal(cacheControlForMediaPath("/api/properties/1"), null);
assert.equal(cacheControlForMediaPath("/api/media/file/%E0%A4%A"), null);

const mediaCollection = readFileSync(
	"src/project/collections/Media.ts",
	"utf8",
);
assert.match(mediaCollection, /name: "thumb", width: 320/);
assert.match(mediaCollection, /name: "card", width: 640/);
assert.match(mediaCollection, /name: "detail", width: 1280/);
assert.match(mediaCollection, /withoutEnlargement: true/);
assert.match(mediaCollection, /format: "webp"/);
assert.doesNotMatch(mediaCollection, /next\/image/);

const publicCatalog = readFileSync(
	"src/core/data-access/public/catalog.ts",
	"utf8",
);
assert.match(publicCatalog, /sizes: true/);
assert.match(publicCatalog, /managed\.variants/);
const imageRenderer = readFileSync(
	"packages/ui/src/lib/starter-image.tsx",
	"utf8",
);
assert.match(imageRenderer, /srcSet=\{srcSet\}/);

const proxy = readFileSync("src/proxy.ts", "utf8");
assert.match(proxy, /getPublicPropertyEdgeState/);
assert.doesNotMatch(proxy, /getPublicPropertyByPublicUrlId/);
assert.match(proxy, /cacheControlForMediaPath/);

const backfill = readFileSync("scripts/backfill-responsive-media.ts", "utf8");
assert.match(backfill, /mode: "dry-run"/);
assert.match(backfill, /MEDIA_BACKFILL_CONFIRM/);
assert.match(backfill, /blocked in production/);
assert.match(backfill, /previousSizes/);
assert.match(backfill, /createdKeys/);
assert.match(backfill, /DeleteObjectCommand/);
assert.match(backfill, /objectKeyForMedia\(doc, prefix\)/);

const migration = readFileSync(
	"migrations/20260927_000349_core55_responsive_media_sizes.ts",
	"utf8",
);
assert.match(migration, /sizes_thumb_filename/);
assert.match(migration, /sizes_card_filename/);
assert.match(migration, /sizes_detail_filename/);
assert.doesNotMatch(migration, /listing_contents/);
assert.doesNotMatch(migration, /ADD COLUMN "prefix"/);

const markMetadata = await sharp(
	"public/brand/don-city-mark-ui.webp",
).metadata();
assert.equal(markMetadata.width, 88);
assert.equal(markMetadata.height, 88);
assert.ok(statSync("public/brand/don-city-mark-ui.webp").size < 20_000);
const footerMetadata = await sharp(
	"public/brand/don-city-logo-footer.webp",
).metadata();
assert.equal(footerMetadata.width, 320);
assert.equal(footerMetadata.height, 400);
assert.ok(statSync("public/brand/don-city-logo-footer.webp").size < 30_000);

console.log("CP-04 responsive media and request-path contract: PASS");
