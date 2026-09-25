"use client";

import { useEffect, useRef } from "react";
import { emitAnalyticsEvent } from "./analytics-browser";
import type { AnalyticsEventInput } from "./analytics-contract";

export {
	analyticsBrowserEventName,
	emitAnalyticsEvent,
} from "./analytics-browser";

export function AnalyticsViewEvent({ event }: { event: AnalyticsEventInput }) {
	const emitted = useRef(false);
	useEffect(() => {
		if (emitted.current) return;
		emitted.current = true;
		emitAnalyticsEvent(event);
	}, [event]);
	return null;
}

export type {
	AnalyticsEventInput,
	AnalyticsEventName,
	AnalyticsEventRecord,
	AnalyticsFilterKey,
	CatalogViewAnalyticsEvent,
} from "./analytics-contract";
