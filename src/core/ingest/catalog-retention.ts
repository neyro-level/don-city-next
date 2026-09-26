const dayInMs = 24 * 60 * 60 * 1_000;

export function catalogRetentionThreshold(
	now: Date,
	retentionDays: number,
): Date {
	if (!Number.isInteger(retentionDays) || retentionDays <= 0) {
		throw new Error("Catalog retention days must be a positive integer.");
	}
	return new Date(now.getTime() - retentionDays * dayInMs);
}

export function isCatalogRetentionDue(
	deactivatedAt: string | Date,
	now: Date,
	retentionDays: number,
): boolean {
	const deactivated = new Date(deactivatedAt);
	if (Number.isNaN(deactivated.valueOf())) return false;
	return deactivated <= catalogRetentionThreshold(now, retentionDays);
}
