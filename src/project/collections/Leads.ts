import type { Access, CollectionConfig, FieldAccess } from "payload";
import {
	hasInternalAccessMode,
	leadIntakeOnly,
} from "../../core/access/internal-modes.ts";
import { hasRole, ownersOnly } from "../../core/access/roles.ts";
import { consentEvidenceFields } from "../legal.config.ts";

const ownerPiiFieldAccess: FieldAccess = ({ req }) =>
	hasRole(req.user, ["owner"]);
const leadIntakePiiCreateAccess: FieldAccess = ({ req }) =>
	hasInternalAccessMode(req, "lead-intake");
const immutableIntakeUpdateAccess: FieldAccess = () => false;
const ownersOrLeadIntake: Access = (args) =>
	ownersOnly(args) || leadIntakeOnly(args);

const piiFieldAccess: {
	read: FieldAccess;
	create: FieldAccess;
	update: FieldAccess;
} = {
	read: ownerPiiFieldAccess,
	create: leadIntakePiiCreateAccess,
	update: ownerPiiFieldAccess,
};

export const Leads: CollectionConfig = {
	slug: "leads",
	// Public intake is POST /api/public/leads via Public Gateway.
	// Generic collection create stays closed to anonymous traffic; the gateway supplies
	// the explicit lead-intake access context without bypassing access control.
	versions: false,
	admin: {
		group: "Operations",
		useAsTitle: "name",
		defaultColumns: ["name", "phoneE164", "status", "formKind", "createdAt"],
		description:
			"Owner operations: agency workflow status and PII retention. External delivery state lives in Lead Deliveries.",
	},
	access: {
		create: leadIntakeOnly,
		read: ownersOrLeadIntake,
		update: ownersOnly,
		delete: ownersOnly,
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			access: piiFieldAccess,
		},
		{
			name: "phoneRaw",
			type: "text",
			access: piiFieldAccess,
			admin: {
				description:
					"Optional operator/audit value. Canonical integration and dedup identity is phoneE164.",
			},
		},
		{
			name: "phoneE164",
			type: "text",
			required: true,
			index: true,
			access: piiFieldAccess,
			admin: {
				description:
					"Strictly normalized E.164 phone. Invalid phone must not create a lead.",
			},
		},
		{
			name: "email",
			type: "email",
			access: piiFieldAccess,
		},
		{
			name: "message",
			type: "textarea",
			access: piiFieldAccess,
		},
		{
			name: "formKind",
			type: "select",
			required: true,
			index: true,
			options: [
				{ label: "Property request", value: "property_request" },
				{ label: "Callback", value: "callback" },
				{ label: "Consultation", value: "consultation" },
				{ label: "Generic", value: "generic" },
			],
		},
		{
			name: "sourcePage",
			type: "text",
			required: true,
			index: true,
		},
		{
			name: "referrer",
			type: "text",
		},
		{
			name: "property",
			type: "relationship",
			relationTo: "properties",
			index: true,
		},
		{
			name: "context",
			type: "group",
			admin: {
				description:
					"Typed business context captured by the public form. Future mortgage/development values remain nullable until their modules are activated.",
			},
			fields: [
				{
					name: "formKind",
					type: "select",
					options: [
						{ label: "General", value: "general" },
						{ label: "Callback", value: "callback" },
						{ label: "Property", value: "property" },
						{ label: "Mortgage", value: "mortgage" },
						{ label: "Sell", value: "sell" },
						{ label: "Legal", value: "legal" },
						{ label: "Rent", value: "rent" },
					],
				},
				{ name: "category", type: "text" },
				{ name: "district", type: "text" },
				{ name: "city", type: "text" },
				{
					name: "property",
					type: "relationship",
					relationTo: "properties",
					index: true,
				},
				{ name: "mortgage", type: "text" },
				{ name: "development", type: "text" },
			],
		},
		{
			name: "utm",
			type: "group",
			fields: [
				{ name: "source", type: "text" },
				{ name: "medium", type: "text" },
				{ name: "campaign", type: "text" },
				{ name: "content", type: "text" },
				{ name: "term", type: "text" },
			],
		},
		{
			name: consentEvidenceFields.storage.group,
			type: "group",
			access: { update: immutableIntakeUpdateAccess },
			admin: {
				description:
					"Immutable intake evidence for personal data processing consent.",
			},
			fields: [
				{
					name: consentEvidenceFields.storage.accepted,
					type: "checkbox",
					required: true,
					defaultValue: false,
				},
				{
					name: consentEvidenceFields.storage.version,
					type: "text",
					required: true,
					index: true,
				},
				{
					name: consentEvidenceFields.storage.consentedAt,
					type: "date",
					required: true,
				},
			],
		},
		{
			name: "status",
			type: "select",
			required: true,
			defaultValue: "new",
			index: true,
			admin: {
				description:
					"Agency workflow status only. External delivery state lives in lead-deliveries.",
			},
			options: [
				{ label: "New", value: "new" },
				{ label: "In progress", value: "in_progress" },
				{ label: "Processed", value: "processed" },
				{ label: "Rejected", value: "rejected" },
			],
		},
		{
			name: "idempotencyKey",
			type: "text",
			required: true,
			unique: true,
			index: true,
		},
		{
			name: "retentionMode",
			type: "select",
			required: true,
			defaultValue: "delete",
			options: [
				{ label: "Delete", value: "delete" },
				{ label: "Anonymize", value: "anonymize" },
			],
		},
		{
			name: "retentionUntil",
			type: "date",
			required: true,
			index: true,
			admin: {
				description:
					"Mandatory per-row PII retention boundary derived from the canonical project policy.",
			},
		},
		{
			name: "piiPurgedAt",
			type: "date",
			index: true,
			admin: {
				description:
					"Set when leadRetentionCleanup deleted/anonymized PII for this lead.",
			},
		},
		{
			name: "fraudFingerprint",
			type: "text",
			access: piiFieldAccess,
			admin: {
				description:
					"Optional irreversible keyed/HMAC marker. Raw IP/User-Agent are intentionally not stored.",
			},
		},
	],
};
