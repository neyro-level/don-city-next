import { type NextRequest, NextResponse } from "next/server";
import { invalidateInProcessCacheTargets } from "../../../../core/cache/in-process.ts";
import { executeInternalRevalidation } from "../../../../core/cache/internal-route-executor.ts";
import { redactRecord } from "../../../../core/security/redaction.ts";
import { getTrustedClientAddress } from "../../../../core/security/trusted-client-address.ts";
import { readBoundedJsonBody } from "../../../../core/security/bounded-json-body.ts";
import { runtimeEnv } from "../../../../project/env.ts";

export const runtime = "nodejs";

const rateWindowMs = 60_000;
const maxRateBuckets = 2_000;
const maxRevalidateBodyBytes = 32 * 1024;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function rateLimited(request: NextRequest): boolean {
	if (
		runtimeEnv.REVALIDATE_SECRET &&
		request.headers.get("x-ams-revalidate-secret") ===
			runtimeEnv.REVALIDATE_SECRET
	) {
		return false;
	}

	const key = getTrustedClientAddress(request);
	const now = Date.now();
	for (const [bucketKey, bucket] of rateBuckets) {
		if (bucket.resetAt <= now || rateBuckets.size >= maxRateBuckets) {
			rateBuckets.delete(bucketKey);
		}
		if (rateBuckets.size < maxRateBuckets) break;
	}
	const current = rateBuckets.get(key);
	if (!current || current.resetAt <= now) {
		rateBuckets.set(key, { count: 1, resetAt: now + rateWindowMs });
		return false;
	}
	current.count += 1;
	return current.count > runtimeEnv.REVALIDATE_RATE_LIMIT_PER_MINUTE;
}

export async function POST(request: NextRequest) {
	if (rateLimited(request)) {
		return NextResponse.json({ error: "rate_limited" }, { status: 429 });
	}
	const providedSecret = request.headers.get("x-ams-revalidate-secret");
	if (
		!runtimeEnv.REVALIDATE_SECRET ||
		!providedSecret ||
		providedSecret !== runtimeEnv.REVALIDATE_SECRET
	) {
		return NextResponse.json({ error: "not_found" }, { status: 404 });
	}

	const parsed = await readBoundedJsonBody(request, maxRevalidateBodyBytes);
	if (!parsed.ok) {
		return NextResponse.json(
			{ error: "invalid_payload" },
			{ status: parsed.reason === "too_large" ? 413 : 400 },
		);
	}

	const result = await executeInternalRevalidation({
		expectedSecret: runtimeEnv.REVALIDATE_SECRET,
		providedSecret,
		body: parsed.value,
		invalidate: invalidateInProcessCacheTargets,
	});

	if (result.deniedTargets) {
		console.warn(
			"cache revalidation denied",
			redactRecord({ targets: result.deniedTargets }),
		);
	}

	return NextResponse.json(result.body, { status: result.status });
}
