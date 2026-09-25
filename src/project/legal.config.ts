import { projectUrls } from "./url-grammar.ts";

export type LegalConsentConfig = {
	currentConsentVersion: string;
	consentHref: `/${string}`;
	consentRequired: true;
};

export const legalConsentConfig = {
	currentConsentVersion: "pd-2026-09-25",
	consentHref: projectUrls.consent,
	consentRequired: true,
} as const satisfies LegalConsentConfig;

export function leadConsentContext() {
	return {
		consentVersion: legalConsentConfig.currentConsentVersion,
		consentHref: legalConsentConfig.consentHref,
		consentRequired: legalConsentConfig.consentRequired,
	} as const;
}
