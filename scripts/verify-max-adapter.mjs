import assert from "node:assert/strict";
import { buildMaxLeadPayload, sendMaxLead } from "../src/core/leads/index.ts";

const lead = {
	id: "lead-1",
	status: "new",
	name: "Иван Петров",
	phoneRaw: "8 (916) 123-45-67",
	phoneE164: "+79161234567",
	email: "ivan@example.test",
	message: "Хочу консультацию",
	formKind: "consultation",
	sourcePage: "/kontakty",
	context: {
		formKind: "legal",
		city: "donetsk",
	},
	consent: {
		accepted: true,
		version: "privacy-2026-09",
		consentedAt: "2026-09-16T12:00:00.000Z",
	},
	idempotencyKey: "lead-key",
};

const payload = buildMaxLeadPayload(lead);
assert.equal(payload.channelId, "max");
assert.equal(payload.contact.phoneE164, "+79161234567");
assert.equal(payload.context.formKind, "legal");

const delivered = await sendMaxLead({
	lead,
	transport: async () => ({
		ok: true,
		status: 202,
		providerMessageId: "msg-1",
	}),
});
assert.equal(delivered.delivery.kind, "delivered");
assertSafe(delivered.safeLog);

const retryable = await sendMaxLead({
	lead,
	transport: async () => ({
		ok: false,
		status: 503,
		errorCode: "+79161234567 bearer-secret raw-response-body",
	}),
});
assert.equal(retryable.delivery.kind, "retryable");
assert.equal(retryable.safeLog.safeCode, "max_http_503");
assertSafe(retryable.safeLog);

const permanent = await sendMaxLead({
	lead,
	transport: async () => ({
		ok: false,
		status: 400,
		errorCode: "ivan@example.test token raw-body",
	}),
});
assert.equal(permanent.delivery.kind, "permanent");
assert.equal(permanent.safeLog.safeCode, "max_http_400");
assertSafe(permanent.safeLog);

console.log("verify-max-adapter: ok");

function assertSafe(value) {
	const serialized = JSON.stringify(value);
	for (const forbidden of [
		"Иван",
		"Петров",
		"916",
		"123-45-67",
		"ivan@example.test",
		"token",
	]) {
		assert.equal(
			serialized.includes(forbidden),
			false,
			`safe log leaked ${forbidden}`,
		);
	}
	assert.equal(value.rawPiiIncluded, false);
	assert.equal(value.secretIncluded, false);
}
