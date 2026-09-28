"use client";
import { normalizeAnalyticsEvent, type AnalyticsEventInput, type AnalyticsEventRecord } from "./contract.ts";
declare global { interface Window { amsAnalyticsQueue?: AnalyticsEventRecord[] } }
export const analyticsBrowserEventName = "ams:analytics" as const;
export function emitAnalyticsEvent(input: AnalyticsEventInput): void {
	const record = normalizeAnalyticsEvent(input);
	window.amsAnalyticsQueue ??= [];
	window.amsAnalyticsQueue.push(record);
	window.dispatchEvent(new CustomEvent(analyticsBrowserEventName, { detail: record }));
}
