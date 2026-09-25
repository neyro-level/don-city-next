import type { Payload, PayloadRequest } from "payload";
import { systemOverrideAccess } from "./overrides.ts";

export async function initializePropertyPublicUrlId(input: {
	payload: Payload;
	propertyId: string | number;
	publicUrlId: number;
	req: PayloadRequest;
	context?: Record<string, unknown>;
}) {
	const systemAccess = systemOverrideAccess("controlled-maintenance");
	return input.payload.update({
		collection: "properties",
		id: input.propertyId,
		data: { publicUrlId: input.publicUrlId },
		req: input.req,
		...systemAccess,
		context: {
			...input.context,
			...systemAccess.context,
			publicUrlIdInitialized: true,
		},
	});
}
