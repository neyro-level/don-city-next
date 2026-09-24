export const indexNowReasons = [
	"publication",
	"meaningful_update",
	"archive",
	"removal",
	"gone",
	"canonical_move",
] as const;

export type IndexNowReason = (typeof indexNowReasons)[number];

export type IndexNowPayload = {
	host: string;
	key: string;
	keyLocation: string;
	urlList: string[];
};

export function buildIndexNowPayload(input: {
	canonicalOrigin: string;
	key: string;
	keyLocation?: string;
	paths: readonly string[];
}): IndexNowPayload {
	const origin = new URL(input.canonicalOrigin);
	if (origin.protocol !== "https:") {
		throw new Error("IndexNow canonical origin must use HTTPS.");
	}
	if (!input.key.trim()) throw new Error("IndexNow key is required.");

	const urlList = [...new Set(input.paths)].map((path) => {
		const url = new URL(path, origin);
		if (url.origin !== origin.origin) {
			throw new Error("IndexNow URL must belong to the canonical host.");
		}
		return url.toString();
	});
	if (urlList.length === 0 || urlList.length > 10_000) {
		throw new Error("IndexNow payload must contain 1..10000 unique URLs.");
	}

	const keyLocation = new URL(
		input.keyLocation ?? `/${input.key.trim()}.txt`,
		origin,
	);
	if (keyLocation.origin !== origin.origin) {
		throw new Error("IndexNow key location must belong to the canonical host.");
	}

	return {
		host: origin.host,
		key: input.key.trim(),
		keyLocation: keyLocation.toString(),
		urlList,
	};
}
