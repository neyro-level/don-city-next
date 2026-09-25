import type { CacheTarget } from "../core/cache/revalidation-contract.ts";
import { invalidatePublicCache } from "../core/cache/invalidator.ts";
import { runtimeEnv } from "./env.ts";

export async function invalidateProjectPublicCache(
	targets: CacheTarget[],
	reason: string,
): Promise<void> {
	await invalidatePublicCache({
		baseUrl: runtimeEnv.INTERNAL_REVALIDATE_BASE_URL,
		secret: runtimeEnv.REVALIDATE_SECRET,
		targets,
		reason,
	});
}
