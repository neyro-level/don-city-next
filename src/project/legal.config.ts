import type { SiteNavItemDTO } from "@ams/realtbase-contracts";
import { parseProjectUrl, projectUrls } from "./url-grammar.ts";

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

export const consentEvidenceFields = {
	request: {
		accepted: "consentAccepted",
		version: "consentVersion",
	},
	storage: {
		group: "consent",
		accepted: "accepted",
		version: "version",
		consentedAt: "consentedAt",
	},
} as const;

type AbsentLegalResource = {
	status: "ABSENT";
	href: null;
	label: null;
};

type PublishedLegalTerms = {
	status: "PUBLISHED";
	ownerApproved: true;
	href: `/${string}`;
	label: string;
};

type PublishedManagedContract = {
	status: "PUBLISHED";
	ownerApproved: true;
	mediaId: string;
	fileName: `${string}.pdf`;
	mimeType: "application/pdf";
	href: `/api/media/file/${string}`;
	label: string;
};

export type LegalPublicationConfig = {
	terms: AbsentLegalResource | PublishedLegalTerms;
	managedContract: AbsentLegalResource | PublishedManagedContract;
};

export const legalPublicationConfig = {
	terms: { status: "ABSENT", href: null, label: null },
	managedContract: { status: "ABSENT", href: null, label: null },
} as const satisfies LegalPublicationConfig;

export const napEvidenceContract = {
	status: "PENDING_EXTERNAL_VERIFICATION",
	requiredSourceNames: ["owner-confirmation", "yandex-business"],
	verifiedAt: null,
} as const;

export function leadConsentContext() {
	return {
		consentVersion: legalConsentConfig.currentConsentVersion,
		consentHref: legalConsentConfig.consentHref,
		consentRequired: legalConsentConfig.consentRequired,
	} as const;
}

export function buildProjectLegalLinks(
	config: LegalPublicationConfig = legalPublicationConfig,
): readonly SiteNavItemDTO[] {
	return [
		{
			label: "Политика конфиденциальности",
			href: projectUrls.privacy,
		},
		{
			label: "Согласие на обработку данных",
			href: projectUrls.consent,
		},
		...resolveOptionalLegalLinks(config),
	];
}

export function resolveOptionalLegalLinks(
	config: LegalPublicationConfig = legalPublicationConfig,
): readonly SiteNavItemDTO[] {
	const links: SiteNavItemDTO[] = [];

	if (config.terms.status === "PUBLISHED") {
		assertInternalCanonicalHref(config.terms.href, "terms");
		assertNonEmpty(config.terms.label, "terms label");
		if (parseProjectUrl(config.terms.href)?.kind !== "static") {
			throw new Error("Published terms must use a registered static route.");
		}
		links.push({ label: config.terms.label, href: config.terms.href });
	}

	if (config.managedContract.status === "PUBLISHED") {
		assertNonEmpty(config.managedContract.mediaId, "managed contract mediaId");
		assertNonEmpty(config.managedContract.label, "managed contract label");
		if (
			!config.managedContract.fileName.toLowerCase().endsWith(".pdf") ||
			config.managedContract.mimeType !== "application/pdf"
		) {
			throw new Error("Managed legal contract must be a PDF.");
		}
		assertInternalCanonicalHref(
			config.managedContract.href,
			"managed contract",
		);
		if (!config.managedContract.href.startsWith("/api/media/file/")) {
			throw new Error(
				"Managed legal contract must use the controlled media route.",
			);
		}
		links.push({
			label: config.managedContract.label,
			href: config.managedContract.href,
		});
	}

	return links;
}

function assertInternalCanonicalHref(value: string, owner: string) {
	const url = new URL(value, "https://internal.invalid");
	if (
		url.origin !== "https://internal.invalid" ||
		url.search ||
		url.hash ||
		url.pathname !== value
	) {
		throw new Error(`${owner} href must be an internal canonical pathname.`);
	}
}

function assertNonEmpty(value: string, owner: string) {
	if (!value.trim()) throw new Error(`${owner} must not be empty.`);
}
