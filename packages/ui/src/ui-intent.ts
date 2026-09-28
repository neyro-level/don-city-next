"use client";

import type { LeadFormKind } from "@ams/realtbase-contracts";

export type LeadFormIntent = {
	kind: "lead-form";
	phase: "submit" | "success" | "error";
	pageKey: string;
	formKind: LeadFormKind;
	outcome?: "accepted" | "rejected" | "network_error";
};

export const uiIntentEventName = "ams:ui-intent" as const;

export function emitUiIntent(intent: LeadFormIntent): void {
	window.dispatchEvent(new CustomEvent(uiIntentEventName, { detail: intent }));
}
