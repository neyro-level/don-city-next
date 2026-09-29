import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
	addLeadBusinessContextDownSql,
	addLeadBusinessContextUpSql,
} from "../migrations/20260925_093100_add_lead_business_context.ts";
import { prepareLeadIntake } from "../src/core/leads/intake.ts";
import { legalConsentConfig } from "../src/project/legal.config.ts";

const prepareConfiguredLeadIntake = (
	input: Parameters<typeof prepareLeadIntake>[0],
) => prepareLeadIntake(input, { leadRetentionDays: 100 });

const base = {
	name: "Иван Петров",
	phone: "+79491101010",
	message: "Нужна консультация",
	sourcePage: "/yurist/",
	consentAccepted: true,
	consentVersion: legalConsentConfig.currentConsentVersion,
	honeypot: "",
	renderedAt: "2026-09-25T09:00:00.000Z",
	submittedAt: "2026-09-25T09:00:10.000Z",
	requestAttemptId: "11111111-1111-4111-8111-111111111111",
} as const;

const legal = prepareConfiguredLeadIntake({
	...base,
	formKind: "generic",
	context: {
		formKind: "legal",
		category: null,
		district: null,
		city: "donetsk",
		property: null,
		mortgage: null,
		development: null,
	},
});
assert.equal(legal.accepted, true);
if (legal.accepted) {
	assert.equal(legal.lead.formKind, "generic");
	assert.deepEqual(legal.lead.context, {
		formKind: "legal",
		category: undefined,
		district: undefined,
		city: "donetsk",
		property: undefined,
		mortgage: undefined,
		development: undefined,
	});
}

const catalog = prepareConfiguredLeadIntake({
	...base,
	formKind: "consultation",
	sourcePage: "/donetsk/kvartiry/kalininskiy/",
	requestAttemptId: "22222222-2222-4222-8222-222222222222",
	context: {
		formKind: "general",
		category: "apartment",
		district: "kalininskiy",
		city: "donetsk",
		property: null,
		mortgage: null,
		development: null,
	},
});
assert.equal(catalog.accepted, true);
if (catalog.accepted) {
	assert.equal(catalog.lead.context.category, "apartment");
	assert.equal(catalog.lead.context.district, "kalininskiy");
	assert.equal(catalog.lead.context.city, "donetsk");
}

const property = prepareConfiguredLeadIntake({
	...base,
	formKind: "property_request",
	sourcePage: "/kvartiry/kalininskiy-2-komnatnaya-1042/",
	requestAttemptId: "33333333-3333-4333-8333-333333333333",
	context: {
		formKind: "property",
		category: "apartment",
		district: "Калининский район",
		city: "Донецк",
		property: "1042",
		mortgage: null,
		development: null,
	},
});
assert.equal(property.accepted, true);
if (property.accepted) {
	assert.equal(property.lead.property, "1042");
	assert.equal(property.lead.context.property, "1042");
}

const legacy = prepareConfiguredLeadIntake({
	...base,
	formKind: "callback",
	sourcePage: "/kontakty/",
	requestAttemptId: "44444444-4444-4444-8444-444444444444",
});
assert.equal(legacy.accepted, true);
if (legacy.accepted) assert.equal(legacy.lead.context.formKind, "callback");

const form = readFileSync(
	"packages/ui/src/views/starter/LeadFormView.tsx",
	"utf8",
);
for (const field of [
	"formKind: context.formKind",
	"category: context.category ?? null",
	"district: context.district ?? null",
	"city: context.city ?? null",
	"property: context.property?.id ?? null",
	"mortgage: context.mortgage ?? null",
	"development: context.development ?? null",
]) {
	assert.ok(form.includes(field), `Lead form does not submit ${field}`);
}

const route = readFileSync("src/app/(site)/public-route.tsx", "utf8");
assert.ok(route.includes("category: result.catalogQuery.category"));
assert.ok(route.includes("district: result.catalogQuery.districtSlug"));
assert.ok(route.includes("city: result.catalogQuery.geoSlug"));
assert.ok(route.includes("category: result.property.category"));

const collection = readFileSync("src/project/collections/Leads.ts", "utf8");
for (const field of [
	'"formKind"',
	'"category"',
	'"district"',
	'"city"',
	'"property"',
	'"mortgage"',
	'"development"',
]) {
	assert.ok(collection.includes(field));
}

for (const column of [
	"context_form_kind",
	"context_category",
	"context_district",
	"context_city",
	"context_property_id",
	"context_mortgage",
	"context_development",
]) {
	assert.ok(addLeadBusinessContextUpSql.includes(column));
	assert.ok(addLeadBusinessContextDownSql.includes(column));
}

console.log("EPIC-34 lead business context: PASS");
