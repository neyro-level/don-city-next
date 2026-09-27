import type { CollectionConfig } from "payload";
import { ownersOnly } from "../../core/access/roles.ts";
import { publicMediaReadAccess } from "../../core/data-access/public/access-mode.ts";
import {
	ensureMediaDirectory,
	mediaFileExists,
	mediaOverwriteDisabled,
	uniqueMediaFilename,
} from "../../core/storage/local-fs.ts";
import { clientReadinessConfig } from "../client-readiness.config.ts";

const allowedMimeTypes = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
	"application/pdf",
];

const usesRemoteMediaStorage =
	clientReadinessConfig.mediaStorage === "timeweb-s3";

function versionedVariantName({
	extension,
	originalName,
	sizeName,
	width,
}: {
	extension: string;
	originalName: string;
	sizeName: string;
	width: number;
}) {
	return `${originalName}-${sizeName}-${width}w.${extension}`;
}

const responsiveImageSizes = [
	{ name: "thumb", width: 320 },
	{ name: "card", width: 640 },
	{ name: "detail", width: 1280 },
].map(({ name, width }) => ({
	name,
	width,
	withoutEnlargement: true,
	formatOptions: {
		format: "webp" as const,
		options: { quality: 82 },
	},
	generateImageName: versionedVariantName,
}));

export const Media: CollectionConfig = {
	slug: "media",
	upload: {
		...(usesRemoteMediaStorage ? {} : { staticDir: ensureMediaDirectory() }),
		mimeTypes: allowedMimeTypes,
		adminThumbnail: "thumb",
		imageSizes: responsiveImageSizes,
	},
	admin: {
		useAsTitle: "alt",
		defaultColumns: ["alt", "mimeType", "updatedAt"],
	},
	access: {
		create: ownersOnly,
		read: publicMediaReadAccess,
		update: ownersOnly,
		delete: ownersOnly,
	},
	hooks: {
		beforeValidate: [
			({ data, originalDoc }) => {
				if (data?.filename && !originalDoc) {
					data.filename = uniqueMediaFilename(String(data.filename));
					if (
						!usesRemoteMediaStorage &&
						mediaOverwriteDisabled &&
						mediaFileExists(data.filename)
					) {
						throw new Error("Media overwrite is disabled.");
					}
				}
				return data;
			},
		],
	},
	fields: [
		{
			name: "alt",
			type: "text",
			required: true,
		},
	],
};
