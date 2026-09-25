"use client";

import {
	type AnalyticsEventInput,
	type AnalyticsEventRecord,
	normalizeAnalyticsEvent,
} from "./analytics-contract.ts";

declare global {
	interface Window {
		amsAnalyticsQueue?: AnalyticsEventRecord[];
	}
}

export const analyticsBrowserEventName = "ams:analytics" as const;

export function emitAnalyticsEvent(input: AnalyticsEventInput): void {
	if (typeof window === "undefined") return;
	const record = normalizeAnalyticsEvent(input);
	window.amsAnalyticsQueue ??= [];
	window.amsAnalyticsQueue.push(record);
	window.dispatchEvent(
		new CustomEvent<AnalyticsEventRecord>(analyticsBrowserEventName, {
			detail: record,
		}),
	);
}
