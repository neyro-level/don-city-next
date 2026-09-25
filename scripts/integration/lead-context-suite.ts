import assert from "node:assert/strict";
import { getPayload } from "payload";

import config from "../../payload.config.ts";
import { createPayloadLeadOutboxRepository } from "../../src/core/data-access/leads/payload-outbox-repository.ts";
import { systemOverrideAccess } from "../../src/core/data-access/system/overrides.ts";
import {
	commitLeadOutbox,
	prepareLeadIntake,
} from "../../src/core/leads/index.ts";
import { requirePayloadRuntime } from "../../src/project/env.ts";
import { legalConsentConfig } from "../../src/project/legal.config.ts";

requirePayloadRuntime();

const payload = await getPayload({ config });
const phone = "+79491101010";
const requestAttemptId = "55555555-5555-4555-8555-555555555555";
const intake = prepareLeadIntake(
	{
		name: "EPIC 34 Test",
		phone,
		message: "Юридическая консультация",
		formKind: "generic",
		sourcePage: "/yurist",
		context: {
			formKind: "legal",
			category: null,
			district: null,
			city: "donetsk",
			property: null,
			mortgage: null,
			development: null,
		},
		consentAccepted: true,
		consentVersion: legalConsentConfig.currentConsentVersion,
		honeypot: "",
		renderedAt: "2026-09-25T09:00:00.000Z",
		submittedAt: "2026-09-25T09:00:10.000Z",
		requestAttemptId,
	},
	{
		nowIso: "2026-09-25T09:00:10.000Z",
		currentConsentVersion: legalConsentConfig.currentConsentVersion,
		leadRetentionDays: 180,
	},
);
assert.equal(intake.accepted, true);
if (!intake.accepted) throw new Error("Lead context fixture was rejected.");
const committed = await commitLeadOutbox({
	intake,
	channels: [],
	repository: createPayloadLeadOutboxRepository(payload),
	nowIso: "2026-09-25T09:00:10.000Z",
});
assert.equal(committed.reusedExistingLead, false);

const found = await payload.find({
	collection: "leads",
	where: { phoneE164: { equals: phone } },
	limit: 2,
	depth: 0,
	...systemOverrideAccess("trusted-inspection"),
});
assert.equal(found.totalDocs, 1);
const lead = found.docs[0];
assert.equal(lead.formKind, "generic");
assert.equal(lead.context?.formKind, "legal");
assert.equal(lead.context?.city, "donetsk");
assert.equal(lead.context?.category, null);
assert.equal(lead.context?.district, null);
assert.equal(lead.context?.property, null);
assert.equal(lead.context?.mortgage, null);
assert.equal(lead.context?.development, null);

await payload.delete({
	collection: "leads",
	id: lead.id,
	...systemOverrideAccess("controlled-maintenance"),
});

await payload.destroy();
console.log("EPIC-34 lead context PostgreSQL integration: PASS");
