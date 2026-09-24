export function publicUrlIdFromPayloadId(value: number | string): number {
	if (typeof value === "string" && !/^\d+$/u.test(value)) {
		throw new Error("Property publicUrlId requires a decimal Payload id.");
	}

	const publicUrlId = Number(value);
	if (!Number.isSafeInteger(publicUrlId) || publicUrlId < 1) {
		throw new Error("Property publicUrlId requires a positive numeric id.");
	}

	return publicUrlId;
}
