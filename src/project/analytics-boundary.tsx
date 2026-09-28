"use client";
import { useEffect, type ReactNode } from "react";
import { emitAnalyticsEvent } from "@/platform/analytics/browser";
import { analyticsEventNames, type AnalyticsEventName, type AnalyticsFilterKey } from "@/platform/analytics/contract";

const allowed = new Set<string>(analyticsEventNames);
function emitElement(element: HTMLElement, key: "analyticsView" | "analyticsEvent") {
	const event = element.dataset[key];
	if (!event || !allowed.has(event)) return;
	emitAnalyticsEvent({
		event: event as AnalyticsEventName,
		pageKey: element.dataset.analyticsPageKey,
		geoSlug: element.dataset.analyticsGeoSlug,
		category: element.dataset.analyticsCategory,
		formKind: element.dataset.analyticsFormKind as never,
		filterKeys: element.dataset.analyticsFilterKeys?.split(",").filter(Boolean) as AnalyticsFilterKey[] | undefined,
		context: element.dataset.analyticsContext,
		item: element.dataset.analyticsItem,
	});
}

export function ProjectAnalyticsBoundary({ children }: { children: ReactNode }) {
	useEffect(() => {
		document
			.querySelectorAll<HTMLElement>("[data-analytics-view]")
			.forEach((element) => {
				emitElement(element, "analyticsView");
			});
		const onClick = (event: MouseEvent) => {
			const element = (event.target as Element | null)?.closest<HTMLElement>("[data-analytics-event]");
			if (element) emitElement(element, "analyticsEvent");
		};
		const onIntent = (event: Event) => {
			const detail = (event as CustomEvent).detail as { kind?: string; phase?: string; pageKey?: string; formKind?: string; outcome?: string };
			if (detail.kind !== "lead-form" || !detail.pageKey || !detail.formKind) return;
			const eventName = detail.phase === "submit" ? "lead_submit" : detail.phase === "success" ? "lead_success" : "lead_error";
			emitAnalyticsEvent({ event: eventName, pageKey: detail.pageKey, formKind: detail.formKind as never, outcomeCode: detail.outcome as never });
		};
		document.addEventListener("click", onClick);
		window.addEventListener("ams:ui-intent", onIntent);
		return () => { document.removeEventListener("click", onClick); window.removeEventListener("ams:ui-intent", onIntent); };
	}, []);
	return children;
}
