import "server-only";

import type { Payload } from "payload";
import type { ListingContextFact } from "../../../platform/seo/content-gate.ts";
import { publicGatewayPolicy } from "./policy.ts";

export type ApprovedListingContent = {
	registryId: string;
	introduction: string;
	contextFacts: readonly ListingContextFact[];
};

export async function findApprovedListingContent(
	payload: Payload,
	registryId: string,
): Promise<ApprovedListingContent | null> {
	const result = await payload.find({
		collection: "listing-contents",
		where: {
			and: [
				{ registryId: { equals: registryId } },
				{ status: { equals: "approved" } },
				{ approvedAt: { exists: true } },
			],
		},
		limit: 1,
		page: 1,
		depth: 0,
		select: {
			registryId: true,
			introduction: true,
			contextFacts: { source: true, checkedAt: true },
		},
		overrideAccess: publicGatewayPolicy.overrideAccess,
		context: publicGatewayPolicy.context,
	});
	const content = result.docs[0];
	if (!content) return null;
	return {
		registryId: content.registryId,
		introduction: content.introduction,
		contextFacts:
			content.contextFacts?.map((fact) => ({
				source: fact.source,
				checkedAt: fact.checkedAt,
			})) ?? [],
	};
}
