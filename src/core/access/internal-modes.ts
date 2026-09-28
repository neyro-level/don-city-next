import type { Access, PayloadRequest } from "payload";

export type InternalAccessMode = "ingest" | "lead-intake";

export function hasInternalAccessMode(
	req: Pick<PayloadRequest, "context">,
	mode: InternalAccessMode,
): boolean {
	return (
		(req.context as { internalAccessMode?: string } | undefined)
			?.internalAccessMode === mode
	);
}

export const ingestGatewayOnly: Access = ({ req }) =>
	hasInternalAccessMode(req, "ingest");

export const leadIntakeOnly: Access = ({ req }) =>
	hasInternalAccessMode(req, "lead-intake");

export function internalAccessMode(
	mode: InternalAccessMode,
	transactionID?: string | number,
) {
	const context = { internalAccessMode: mode } as const;
	return {
		overrideAccess: false as const,
		context,
		req:
			transactionID === undefined
				? undefined
				: ({ context, transactionID } as unknown as PayloadRequest),
	};
}
