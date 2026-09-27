import { evaluateLeadRateLimit, type LeadIntakeRejected } from "./intake.ts";

export function createInProcessLeadRateLimiter({
	windowMs = 60_000,
	maxBuckets = 10_000,
}: {
	windowMs?: number;
	maxBuckets?: number;
} = {}) {
	const buckets = new Map<string, { count: number; resetAt: number }>();

	function pruneBuckets(now: number): void {
		for (const [key, bucket] of buckets) {
			if (bucket.resetAt <= now) buckets.delete(key);
		}

		while (buckets.size >= maxBuckets) {
			let oldestKey: string | undefined;
			let oldestResetAt = Number.POSITIVE_INFINITY;
			for (const [key, bucket] of buckets) {
				if (bucket.resetAt < oldestResetAt) {
					oldestKey = key;
					oldestResetAt = bucket.resetAt;
				}
			}
			if (!oldestKey) break;
			buckets.delete(oldestKey);
		}
	}

	return function hit({
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
	};
}

export const hitInProcessLeadRateLimit = createInProcessLeadRateLimiter();
