import { evaluateLeadRateLimit, type LeadIntakeRejected } from "./intake.ts";

const windowMs = 60_000;
const maxBuckets = 10_000;
const buckets = new Map<string, { count: number; resetAt: number }>();

function pruneBuckets(now: number): void {
	for (const [key, bucket] of buckets) {
		if (bucket.resetAt <= now || buckets.size >= maxBuckets) {
			buckets.delete(key);
		}
		if (buckets.size < maxBuckets) break;
	}
}

export function hitInProcessLeadRateLimit({
	key,
	limit,
	now = Date.now(),
}: {
	key: string;
	limit: number;
	now?: number;
}): LeadIntakeRejected | undefined {
	pruneBuckets(now);
	const current = buckets.get(key);
	if (!current || current.resetAt <= now) {
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return undefined;
	}

	current.count += 1;
	return evaluateLeadRateLimit({
		windowHits: current.count,
		limit,
	});
}
