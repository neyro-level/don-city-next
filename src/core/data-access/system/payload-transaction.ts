import type { Payload, PayloadRequest } from "payload";

export type PayloadTransactionExecutor = {
	execute(query: unknown): Promise<unknown>;
};

type PostgresTransactionSessionAdapter = Payload["db"] & {
	sessions?: Record<
		string,
		{
			db?: PayloadTransactionExecutor;
		}
	>;
};

export async function requirePayloadTransactionExecutor(
	payload: Payload,
	transactionID: NonNullable<PayloadRequest["transactionID"]>,
): Promise<PayloadTransactionExecutor> {
	const resolvedTransactionID = await transactionID;
	const adapter = payload.db as PostgresTransactionSessionAdapter;
	const executor = adapter.sessions?.[String(resolvedTransactionID)]?.db;

	if (!executor || typeof executor.execute !== "function") {
		throw new Error(
			"Payload PostgreSQL transaction session executor is unavailable; refusing a non-atomic raw SQL fallback.",
		);
	}

	return executor;
}
