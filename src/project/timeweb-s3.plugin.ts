// Activated from the version-pinned Timeweb client storage source.
// Exact compatibility: @payloadcms/storage-s3@3.90.1 + payload@3.90.1.
import { s3Storage } from "@payloadcms/storage-s3";
import { runtimeEnv } from "./env.ts";

const configured = (name: string): string | undefined => {
	const value = runtimeEnv[name as keyof typeof runtimeEnv];
	return value ? String(value).trim() : undefined;
};

const endpoint = configured("S3_ENDPOINT");
const region = configured("S3_REGION");
const bucket = configured("S3_BUCKET");
const accessKeyId = configured("S3_ACCESS_KEY_ID");
const secretAccessKey = configured("S3_SECRET_ACCESS_KEY");
const prefix = configured("S3_PREFIX");
const enabled = Boolean(
	endpoint && region && bucket && accessKeyId && secretAccessKey && prefix,
);

export const timewebS3Plugin = s3Storage({
	enabled,
	alwaysInsertFields: true,
	collections: {
		media: prefix ? { prefix } : true,
	},
	bucket: bucket ?? "build-disabled",
	disableLocalStorage: true,
	useCompositePrefixes: false,
	config: {
		// Timeweb Cloud S3-compatible endpoint, for example https://s3.twcstorage.ru.
		endpoint: endpoint ?? "https://s3.invalid",
		region: region ?? "build",
		forcePathStyle: true,
		credentials: {
			accessKeyId: accessKeyId ?? "build-disabled",
			secretAccessKey: secretAccessKey ?? "build-disabled",
		},
	},
});
