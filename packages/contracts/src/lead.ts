export type LeadFormKind =
	| "general"
	| "callback"
	| "property"
	| "mortgage"
	| "sell"
	| "legal"
	| "rent";

export type LeadPropertyContextDTO = {
	id: string;
	slug: string;
	title: string;
};

export type LeadFormContext = {
	formKind: LeadFormKind;
	sourcePage: string;
	category?: string;
	district?: string;
	city?: string;
	property?: LeadPropertyContextDTO;
	mortgage?: string | null;
	development?: string | null;
	consentVersion: string;
	consentHref: string;
	consentRequired: boolean;
};
