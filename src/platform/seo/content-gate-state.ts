export type ListingInventoryGateState = {
	inventorySnapshot: number;
	inventoryEvaluatedAt: string;
	lastThresholdPassedAt: string | null;
};

export function nextListingInventoryGateState(input: {
	activeObjects: number;
	threshold: number;
	now: Date;
	lastThresholdPassedAt?: string | null;
}): ListingInventoryGateState {
	if (!Number.isInteger(input.activeObjects) || input.activeObjects < 0) {
		throw new Error("Content Gate inventory snapshot must be a non-negative integer.");
	}
	if (!Number.isInteger(input.threshold) || input.threshold < 1) {
		throw new Error("Content Gate threshold must be a positive integer.");
	}
	if (!Number.isFinite(input.now.getTime())) {
		throw new Error("Content Gate evaluation time must be valid.");
	}

	return {
		inventorySnapshot: input.activeObjects,
		inventoryEvaluatedAt: input.now.toISOString(),
		lastThresholdPassedAt:
			input.activeObjects >= input.threshold
				? input.now.toISOString()
				: (input.lastThresholdPassedAt ?? null),
	};
}
