export type CatalogSearchParamValue = string | string[] | undefined;
export type CatalogSearchParams = Record<string, CatalogSearchParamValue>;

export type PortableCatalogQuery = {
	page: number;
	limit: number;
	rooms?: number[];
	[key: string]: string | number | number[] | undefined;
};

export type PortableCatalogSeoDecision = {
	canonicalPath: string;
	index: boolean;
	follow: boolean;
	reason:
		| "base"
		| "whitelisted_filter"
		| "control_or_nonindex_filter"
		| "unknown_param";
	query: PortableCatalogQuery;
};

const allowedControlKeys = ["page", "sort", "view"] as const;
const nonIndexableFilterKeys = [
	"query",
	"limit",
	"priceFromMinor",
	"priceToMinor",
	"areaFrom",
	"areaTo",
] as const;

export function buildPortableCatalogSeoDecision(
	indexedFilterKeys: readonly string[],
	searchParams: CatalogSearchParams = {},
): PortableCatalogSeoDecision {
	const entries = normalizeSearchParams(searchParams);
	const knownKeys = new Set<string>([
		...indexedFilterKeys,
		...allowedControlKeys,
		...nonIndexableFilterKeys,
	]);
	const hasUnknownParam = entries.some(([key]) => !knownKeys.has(key));
	const hasNonIndexParam = entries.some(([key]) =>
		(
			[...allowedControlKeys, ...nonIndexableFilterKeys] as readonly string[]
		).includes(key),
	);
	const indexedEntries = entries.filter(([key]) =>
		indexedFilterKeys.includes(key),
	);
	const canonicalPath = buildCatalogCanonicalPath(indexedEntries);
	const query = buildCatalogQuery(entries);

	if (hasUnknownParam)
		return {
			canonicalPath,
			index: false,
			follow: true,
			reason: "unknown_param",
			query,
		};
	if (hasNonIndexParam)
		return {
			canonicalPath,
			index: false,
			follow: true,
			reason: "control_or_nonindex_filter",
			query,
		};
	return {
		canonicalPath,
		index: true,
		follow: true,
		reason: indexedEntries.length ? "whitelisted_filter" : "base",
		query,
	};
}

function normalizeSearchParams(
	searchParams: CatalogSearchParams,
): [string, string][] {
	const entries: [string, string][] = [];
	for (const [key, raw] of Object.entries(searchParams)) {
		for (const value of Array.isArray(raw) ? raw : [raw]) {
			if (typeof value === "string" && value.trim())
				entries.push([key, value.trim()]);
		}
	}
	return entries.sort(([leftKey, leftValue], [rightKey, rightValue]) =>
		leftKey === rightKey
			? leftValue.localeCompare(rightValue)
			: leftKey.localeCompare(rightKey),
	);
}

function buildCatalogCanonicalPath(entries: [string, string][]): string {
	if (!entries.length) return "/nedvizhimost";
	const params = new URLSearchParams();
	for (const [key, value] of entries) params.append(key, value);
	return `/nedvizhimost?${params.toString()}`;
}

function buildCatalogQuery(entries: [string, string][]): PortableCatalogQuery {
	const query: PortableCatalogQuery = { page: 1, limit: 24 };
	const rooms: number[] = [];
	for (const [key, value] of entries) {
		if (key === "rooms") {
			const room = Number(value);
			if (Number.isInteger(room) && room > 0) rooms.push(room);
			continue;
		}
		if (
			[
				"category",
				"dealType",
				"city",
				"district",
				"query",
				"sort",
				"view",
			].includes(key)
		) {
			query[key] = value;
			continue;
		}
		if (
			[
				"page",
				"limit",
				"priceFromMinor",
				"priceToMinor",
				"areaFrom",
				"areaTo",
			].includes(key)
		) {
			const numeric = Number(value);
			if (Number.isFinite(numeric)) query[key] = numeric;
		}
	}
	if (rooms.length) query.rooms = rooms;
	return query;
}
