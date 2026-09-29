import { createHash, createHmac } from "node:crypto";
import { z } from "zod";
import { legalConsentConfig } from "../../project/legal.config.ts";
import { isConfiguredRetentionDays } from "./retention.ts";

export type LeadFormKind =
	| "property_request"
	| "callback"
	| "consultation"
	| "generic";

export type LeadBusinessFormKind =
	| "general"
	| "callback"
	| "property"
	| "mortgage"
	| "sell"
	| "legal"
	| "rent";

export type LeadBusinessContext = {
	formKind: LeadBusinessFormKind;
	category?: string;
	district?: string;
	city?: string;
	property?: string;
	mortgage?: string;
	development?: string;
};

export type LeadIntakeAccepted = {
	accepted: true;
	lead: {
		name: string;
		phoneRaw: string;
		phoneE164: string;
		email?: string;
		message?: string;
		formKind: LeadFormKind;
		sourcePage: string;
		referrer?: string;
		property?: string;
		context: LeadBusinessContext;
		utm?: {
			source?: string;
			medium?: string;
			campaign?: string;
			content?: string;
			term?: string;
		};
		consent: {
			accepted: true;
			version: string;
			consentedAt: string;
		};
		idempotencyKey: string;
		retentionUntil: string;
		fraudFingerprint?: string;
	};
	safeDiagnostics: LeadIntakeDiagnostics;
};

export type LeadIntakeRejected = {
	accepted: false;
	status: 400 | 429;
	code:
		| "lead.invalid_payload"
		| "lead.invalid_phone"
		| "lead.consent_required"
		| "lead.consent_version_mismatch"
		| "lead.source_page_invalid"
		| "lead.honeypot"
		| "lead.fill_time_invalid"
		| "lead.rate_limited";
	safeDiagnostics: LeadIntakeDiagnostics;
};

export type LeadIntakeResult = LeadIntakeAccepted | LeadIntakeRejected;

export type LeadIntakeDiagnostics = {
	code: string;
	formKind?: LeadFormKind;
	sourcePage?: string;
	reason: string;
	rawPiiIncluded: false;
};

export type LeadRateLimitInput = {
	windowHits: number;
	limit: number;
};

const minimumFillTimeMs = 2500;
const maximumFillTimeMs = 24 * 60 * 60 * 1000;
export const leadFraudHmacKeyContext = "don-city:lead-fraud:v1";

const leadIntakeSchema = z.object({
	name: z.string().trim().min(2).max(120),
	phone: z.string().trim().min(5).max(40),
	email: z.string().trim().email().max(160).optional().or(z.literal("")),
	message: z.string().trim().max(2000).optional().or(z.literal("")),
	formKind: z.enum(["property_request", "callback", "consultation", "generic"]),
	sourcePage: z.string().trim().min(1).max(512),
	referrer: z.string().trim().max(512).optional().or(z.literal("")),
	property: z.string().trim().max(128).optional().or(z.literal("")),
	context: z
		.object({
			formKind: z.enum([
				"general",
				"callback",
				"property",
				"mortgage",
				"sell",
				"legal",
				"rent",
			]),
			category: nullableContextValue(),
			district: nullableContextValue(),
			city: nullableContextValue(),
			property: nullableContextValue(128),
			mortgage: nullableContextValue(),
			development: nullableContextValue(),
		})
		.optional(),
	utm: z
		.object({
			source: z.string().trim().max(120).optional().or(z.literal("")),
			medium: z.string().trim().max(120).optional().or(z.literal("")),
			campaign: z.string().trim().max(160).optional().or(z.literal("")),
			content: z.string().trim().max(160).optional().or(z.literal("")),
			term: z.string().trim().max(160).optional().or(z.literal("")),
		})
		.optional(),
	consentAccepted: z.boolean().optional(),
	consentVersion: z.string().trim().min(1).max(120),
	honeypot: z.string().trim().max(200).optional().or(z.literal("")),
	renderedAt: z.string().datetime(),
	submittedAt: z.string().datetime(),
	requestAttemptId: z.string().uuid(),
});

export function prepareLeadIntake(
	input: unknown,
	options?: {
		fraudHmacKey?: string;
		nowIso?: string;
		currentConsentVersion?: string;
		leadRetentionDays?: number | null;
	},
): LeadIntakeResult {
	const parsed = leadIntakeSchema.safeParse(input);
	if (!parsed.success) {
		return reject("lead.invalid_payload", "Payload failed validation.");
	}

	const payload = parsed.data;
	if (payload.consentAccepted !== true) {
		return reject(
			"lead.consent_required",
			"Explicit personal data processing consent is required.",
			payload,
		);
	}
	const businessContext = payload.context;
	const currentConsentVersion =
		options?.currentConsentVersion ?? legalConsentConfig.currentConsentVersion;
	if (payload.consentVersion !== currentConsentVersion) {
		return reject(
			"lead.consent_version_mismatch",
			"Displayed consent version is not current.",
			payload,
		);
	}

	const sourcePage = normalizeCanonicalSourcePage(payload.sourcePage);
	if (!sourcePage) {
		return reject(
			"lead.source_page_invalid",
			"Source page is not an internal canonical pathname.",
			payload,
		);
	}
	if (payload.honeypot) {
		return reject(
			"lead.honeypot",
			"Anti-spam honeypot field is not empty.",
			payload,
		);
	}

	if (!isFillTimeAcceptable(payload.renderedAt, payload.submittedAt)) {
		return reject(
			"lead.fill_time_invalid",
			"Lead form fill time is outside allowed bounds.",
			payload,
		);
	}

	const phoneE164 = normalizePhoneToE164(payload.phone);
	if (!phoneE164) {
		return reject(
			"lead.invalid_phone",
			"Phone cannot be normalized to E.164.",
			payload,
		);
	}

	const consentedAt = options?.nowIso ?? new Date().toISOString();
	return {
		accepted: true,
		lead: {
			name: payload.name,
			phoneRaw: payload.phone,
			phoneE164,
			email: emptyToUndefined(payload.email),
			message: emptyToUndefined(payload.message),
			formKind: payload.formKind,
			sourcePage,
			referrer: emptyToUndefined(payload.referrer),
			property:
				payload.formKind === "property_request"
					? nullableToUndefined(businessContext?.property ?? payload.property)
					: undefined,
			context: {
				formKind:
					businessContext?.formKind ??
					fallbackBusinessFormKind(payload.formKind),
				category: nullableToUndefined(businessContext?.category),
				district: nullableToUndefined(businessContext?.district),
				city: nullableToUndefined(businessContext?.city),
				property: nullableToUndefined(
					businessContext?.property ?? payload.property,
				),
				mortgage: nullableToUndefined(businessContext?.mortgage),
				development: nullableToUndefined(businessContext?.development),
			},
			utm: normalizeUtm(payload.utm),
			consent: {
				accepted: true,
				version: currentConsentVersion,
				consentedAt,
			},
			idempotencyKey: buildLeadIdempotencyKey(payload.requestAttemptId),
			retentionUntil: retentionUntil(consentedAt, options?.leadRetentionDays),
			fraudFingerprint: buildFraudFingerprint(
				{
					phoneE164,
					sourcePage,
					submittedAt: payload.submittedAt,
				},
				options?.fraudHmacKey,
			),
		},
		safeDiagnostics: diagnostics(
			"lead.accepted",
			"Lead intake accepted.",
			payload,
		),
	};
}

export function evaluateLeadRateLimit({
	windowHits,
	limit,
}: LeadRateLimitInput): LeadIntakeRejected | undefined {
	if (windowHits < limit) {
		return undefined;
	}

	return reject(
		"lead.rate_limited",
		"Lead intake rate limit exceeded.",
		undefined,
		429,
	);
}

export function normalizePhoneToE164(value: string): string | undefined {
	const compact = value.replace(/[^\d+]/g, "");
	if (!compact) {
		return undefined;
	}

	if (compact.startsWith("+")) {
		const digits = compact.slice(1);
		return /^\d{10,15}$/.test(digits) ? `+${digits}` : undefined;
	}

	const digits = compact.replace(/\D/g, "");
	if (/^8\d{10}$/.test(digits)) {
		return `+7${digits.slice(1)}`;
	}
	if (/^7\d{10}$/.test(digits)) {
		return `+${digits}`;
	}
	if (/^9\d{9}$/.test(digits)) {
		return `+7${digits}`;
	}
	return /^\d{10,15}$/.test(digits) ? `+${digits}` : undefined;
}

export function buildLeadIdempotencyKey(requestAttemptId: string): string {
	return `lead:${requestAttemptId.toLowerCase()}`;
}

/**
 * Derive a dedicated fraud-fingerprint key without adding another operational
 * secret. The fixed versioned context prevents PAYLOAD_SECRET reuse across
 * unrelated cryptographic purposes.
 */
export function deriveLeadFraudHmacKey(payloadSecret: string): string {
	if (!payloadSecret.trim()) {
		throw new Error("PAYLOAD_SECRET is required for fraud key derivation.");
	}

	return createHmac("sha256", payloadSecret)
		.update(leadFraudHmacKeyContext, "utf8")
		.digest("base64url");
}

function retentionUntil(nowIso: string, days?: number | null): string {
	if (!isConfiguredRetentionDays(days)) {
		throw new Error("Lead retention policy must be configured before intake.");
	}
	return new Date(new Date(nowIso).getTime() + days * 86_400_000).toISOString();
}

export function normalizeCanonicalSourcePage(
	value: string,
): string | undefined {
	if (
		!value.startsWith("/") ||
		value.startsWith("//") ||
		value.includes("\\")
	) {
		return undefined;
	}
	try {
		const url = new URL(value, "https://internal.invalid");
		if (
			url.origin !== "https://internal.invalid" ||
			url.search ||
			url.hash ||
			url.pathname !== value
		) {
			return undefined;
		}
		return value !== "/" && value.endsWith("/") ? value.slice(0, -1) : value;
	} catch {
		return undefined;
	}
}

export function buildFraudFingerprint(
	input: {
		phoneE164: string;
		sourcePage: string;
		submittedAt: string;
	},
	hmacKey?: string,
): string {
	const submittedDate = input.submittedAt.slice(0, 10);
	const material = [input.phoneE164, input.sourcePage, submittedDate];
	const digest = hmacKey?.trim()
		? createHmac("sha256", hmacKey).update(material.join("\0")).digest("hex")
		: hashSafe(material);
	return `lead-fraud:${digest}`;
}

function isFillTimeAcceptable(
	renderedAt: string,
	submittedAt: string,
): boolean {
	const rendered = new Date(renderedAt).getTime();
	const submitted = new Date(submittedAt).getTime();
	const duration = submitted - rendered;
	return duration >= minimumFillTimeMs && duration <= maximumFillTimeMs;
}

function reject(
	code: LeadIntakeRejected["code"],
	reason: string,
	payload?: z.output<typeof leadIntakeSchema>,
	status: 400 | 429 = 400,
): LeadIntakeRejected {
	return {
		accepted: false,
		status,
		code,
		safeDiagnostics: diagnostics(code, reason, payload),
	};
}

function diagnostics(
	code: string,
	reason: string,
	payload?: Pick<z.output<typeof leadIntakeSchema>, "formKind" | "sourcePage">,
): LeadIntakeDiagnostics {
	return {
		code,
		formKind: payload?.formKind,
		sourcePage: payload?.sourcePage,
		reason,
		rawPiiIncluded: false,
	};
}

function normalizeUtm(input: z.output<typeof leadIntakeSchema>["utm"]) {
	if (!input) {
		return undefined;
	}
	const utm = {
		source: emptyToUndefined(input.source),
		medium: emptyToUndefined(input.medium),
		campaign: emptyToUndefined(input.campaign),
		content: emptyToUndefined(input.content),
		term: emptyToUndefined(input.term),
	};
	return Object.values(utm).some(Boolean) ? utm : undefined;
}

function emptyToUndefined(value: string | undefined): string | undefined {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
}

function nullableToUndefined(
	value: string | null | undefined,
): string | undefined {
	return emptyToUndefined(value ?? undefined);
}

function nullableContextValue(max = 80) {
	return z.string().trim().min(1).max(max).nullable().optional();
}

function fallbackBusinessFormKind(kind: LeadFormKind): LeadBusinessFormKind {
	if (kind === "property_request") return "property";
	if (kind === "callback") return "callback";
	return "general";
}

function hashSafe(parts: string[]): string {
	return createHash("sha256").update(parts.join("\0")).digest("hex");
}
