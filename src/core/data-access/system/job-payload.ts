import type { Payload } from "payload";
import { systemOverrideAccess } from "./overrides.ts";

type PayloadOperation = (args: never) => unknown;

function bindSystemJobOperation<T extends PayloadOperation>(operation: T): T {
	const access = systemOverrideAccess("system-job");
	return ((args: never) =>
		operation({
			...(args as object),
			...access,
		} as never)) as T;
}

/**
 * Named System Gateway for trusted Payload job operations.
 * The privileged flag is applied only at the physical Local API call boundary.
 */
export function createSystemJobPayloadGateway(payload: Payload) {
	return {
		create: bindSystemJobOperation(payload.create.bind(payload)),
		delete: bindSystemJobOperation(payload.delete.bind(payload)),
		find: bindSystemJobOperation(payload.find.bind(payload)),
		findByID: bindSystemJobOperation(payload.findByID.bind(payload)),
		update: bindSystemJobOperation(payload.update.bind(payload)),
	};
}
