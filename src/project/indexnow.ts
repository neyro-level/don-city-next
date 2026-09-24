import {
	buildIndexNowPayload,
	type IndexNowPayload,
	type IndexNowReason,
} from "../platform/indexnow/payload.ts";
import { siteConfig } from "./site.config.ts";
import { buildProjectUrl, parseProjectUrl } from "./url-grammar.ts";

type ProjectIndexNowEvent = {
	reason: Exclude<IndexNowReason, "canonical_move">;
	canonicalPath: string;
};

type ProjectCanonicalMoveEvent = {
	reason: "canonical_move";
	canonicalPath: string;
	previousCanonicalPath: string;
	previousUrlEvidence: "persisted_canonical";
};

function assertCurrentCanonicalPath(path: string): void {
	const key = parseProjectUrl(path);
	if (!key || buildProjectUrl(key) !== path) {
		throw new Error(
			"IndexNow current URL must be owned by the project grammar.",
		);
	}
}

function assertHistoricalCanonicalPath(path: string): void {
	if (!/^\/[a-z0-9][a-z0-9/-]*\/$/.test(path) || path.includes("//")) {
		throw new Error("IndexNow historical URL must be a clean canonical path.");
	}
}

export function buildProjectIndexNowPayload(
	event: ProjectIndexNowEvent | ProjectCanonicalMoveEvent,
	key: string,
): IndexNowPayload {
	assertCurrentCanonicalPath(event.canonicalPath);
	const paths = [event.canonicalPath];
	if (event.reason === "canonical_move") {
		assertHistoricalCanonicalPath(event.previousCanonicalPath);
		if (event.previousCanonicalPath === event.canonicalPath) {
			throw new Error("Canonical move must change the URL.");
		}
		paths.unshift(event.previousCanonicalPath);
	}

	return buildIndexNowPayload({
		canonicalOrigin: siteConfig.canonicalOrigin,
		key,
		paths,
	});
}
