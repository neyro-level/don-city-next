import assert from "node:assert/strict";
import { createPayloadLeadOutboxRepository } from "../src/core/data-access/leads/payload-outbox-repository.ts";
import {
	accelerateCommittedLeadDeliveryJobs,
	commitLeadOutbox,
	planRecoverableLeadDeliveryJobs,
	prepareLeadIntake,
} from "../src/core/leads/index.ts";
import { legalConsentConfig } from "../src/project/legal.config.ts";

const intake = prepareLeadIntake(
	{
		name: "Иван Петров",
		phone: "8 (916) 123-45-67",
		formKind: "consultation",
		sourcePage: "/kontakty",
		consentAccepted: true,
		consentVersion: legalConsentConfig.currentConsentVersion,
		honeypot: "",
		renderedAt: "2026-09-16T11:59:50.000Z",
		submittedAt: "2026-09-16T12:00:00.000Z",
		requestAttemptId: "11111111-1111-4111-8111-111111111111",
	},
	{ nowIso: "2026-09-16T12:00:00.000Z", leadRetentionDays: 100 },
);
assert.equal(intake.accepted, true);

const repository = createRepository();
const channels = [
	{ id: "max", kind: "messenger", enabled: true },
	{ id: "crm-main", kind: "crm", enabled: true },
	{ id: "disabled-channel", kind: "crm", enabled: false },
];

const zeroChannelRepository = createRepository();
const zeroChannelCommitted = await commitLeadOutbox({
	intake,
	channels: [],
	repository: zeroChannelRepository,
	nowIso: "2026-09-16T12:00:00.000Z",
});
assert.equal(zeroChannelCommitted.reusedExistingLead, false);
assert.equal(zeroChannelCommitted.lead.id, "lead-1");
assert.deepEqual(zeroChannelCommitted.deliveries, []);
assert.equal(zeroChannelRepository.leads.length, 1);
assert.equal(
	zeroChannelRepository.transactions,
	1,
	"zero outbound channels must not reject a safely persisted local lead",
);

const committed = await commitLeadOutbox({
	intake,
	channels,
	repository,
	nowIso: "2026-09-16T12:00:00.000Z",
});
assert.equal(repository.transactions, 1);
assert.equal(committed.reusedExistingLead, false);
assert.equal(committed.lead.id, "lead-1");
assert.equal(committed.deliveries.length, 2);
assert.deepEqual(
	committed.deliveries.map((delivery) => delivery.channelId).sort(),
	["crm-main", "max"],
);
assert.equal(
	repository.externalCalls,
	0,
	"Outbox commit must not call external channels.",
);

const repeated = await commitLeadOutbox({
	intake,
	channels,
	repository,
	nowIso: "2026-09-16T12:05:00.000Z",
});
assert.equal(repeated.reusedExistingLead, true);
assert.equal(repository.leads.length, 1);
assert.equal(repository.deliveries.length, 2);

const recoveryPlan = await planRecoverableLeadDeliveryJobs(
	repository,
	"2026-09-16T12:10:00.000Z",
);
assert.equal(recoveryPlan.length, 2);
assert.deepEqual(recoveryPlan[0], {
	deliveryId: "delivery-1",
	task: "deliverLead",
	queue: "lead-deliveries",
	input: { leadDeliveryId: "delivery-1" },
});

repository.deliveries[0].jobId = "queued-job-1";
const afterEnqueueRecoveryPlan = await planRecoverableLeadDeliveryJobs(
	repository,
	"2026-09-16T12:10:00.000Z",
);
assert.equal(afterEnqueueRecoveryPlan.length, 1);
assert.equal(afterEnqueueRecoveryPlan[0].deliveryId, "delivery-2");

repository.deliveries.push({
	id: "delivery-b-orphan",
	lead: "lead-b",
	channelId: "crm-main",
	channelKind: "crm",
	status: "pending",
	attempts: 0,
	nextAttemptAt: "2026-09-16T12:00:00.000Z",
	idempotencyKey: "lead:b:channel:crm-main",
});
const enqueuedIds = [];
await accelerateCommittedLeadDeliveryJobs({
	deliveries: committed.deliveries,
	repository,
	enqueue: async (deliveryId) => {
		enqueuedIds.push(deliveryId);
		return `job-${deliveryId}`;
	},
});
assert.deepEqual(enqueuedIds, ["delivery-2"]);
assert.equal(enqueuedIds.includes("delivery-b-orphan"), false);
repository.deliveries = repository.deliveries.filter(
	(delivery) => delivery.id !== "delivery-b-orphan",
);

let enqueueFailures = 0;
await accelerateCommittedLeadDeliveryJobs({
	deliveries: [{ ...committed.deliveries[1], jobId: undefined }],
	repository,
	enqueue: async () => {
		enqueueFailures += 1;
		throw new Error("enqueue unavailable");
	},
});
assert.equal(enqueueFailures, 1);
assert.equal(
	repository.leads.length,
	1,
	"Enqueue failure must not roll back the lead.",
);

const secondAttempt = prepareLeadIntake(
	{
		name: "Иван Петров",
		phone: "8 (916) 123-45-67",
		formKind: "consultation",
		sourcePage: "/kontakty",
		consentAccepted: true,
		consentVersion: legalConsentConfig.currentConsentVersion,
		honeypot: "",
		renderedAt: "2026-09-16T12:09:50.000Z",
		submittedAt: "2026-09-16T12:10:00.000Z",
		requestAttemptId: "22222222-2222-4222-8222-222222222222",
	},
	{ nowIso: "2026-09-16T12:10:00.000Z", leadRetentionDays: 100 },
);
assert.equal(secondAttempt.accepted, true);
const secondCommitted = await commitLeadOutbox({
	intake: secondAttempt,
	channels,
	repository,
	nowIso: "2026-09-16T12:10:00.000Z",
});
assert.equal(secondCommitted.reusedExistingLead, false);
assert.equal(repository.leads.length, 2);
assert.equal(repository.deliveries.length, 4);

for (const fixture of [
	{ name: "missing begin", db: transactionDb({ begin: undefined }) },
	{ name: "missing commit", db: transactionDb({ commit: undefined }) },
	{ name: "missing rollback", db: transactionDb({ rollback: undefined }) },
	{ name: "false transaction", db: transactionDb({ transactionId: false }) },
	{ name: "null transaction", db: transactionDb({ transactionId: null }) },
	{ name: "empty transaction", db: transactionDb({ transactionId: "" }) },
	{
		name: "invalid numeric transaction",
		db: transactionDb({ transactionId: Number.NaN }),
	},
]) {
	const payload = createPayloadFixture(fixture.db);
	await assert.rejects(
		() =>
			createPayloadLeadOutboxRepository(payload).transaction(async (tx) => {
				await tx.createLead({ ...intake.lead, status: "new" });
			}),
		/Lead intake transaction/,
		fixture.name,
	);
	assert.equal(
		payload.writes.length,
		0,
		`${fixture.name}: writes must stay zero`,
	);
}

const commitDb = transactionDb({});
const commitPayload = createPayloadFixture(commitDb);
await createPayloadLeadOutboxRepository(commitPayload).transaction(
	async (tx) => {
		const lead = await tx.createLead({ ...intake.lead, status: "new" });
		await tx.createLeadDelivery({
			lead: lead.id,
			channelId: "max",
			channelKind: "messenger",
			status: "pending",
			attempts: 0,
			nextAttemptAt: "2026-09-16T12:00:00.000Z",
			idempotencyKey: "lead:1:channel:max",
		});
	},
);
assert.equal(commitDb.commits, 1);
assert.equal(commitDb.rollbacks, 0);
assert.equal(commitPayload.writes.length, 2);

const rollbackDb = transactionDb({});
const rollbackPayload = createPayloadFixture(rollbackDb, {
	failDelivery: true,
});
await assert.rejects(
	() =>
		createPayloadLeadOutboxRepository(rollbackPayload).transaction(
			async (tx) => {
				const lead = await tx.createLead({ ...intake.lead, status: "new" });
				await tx.createLeadDelivery({
					lead: lead.id,
					channelId: "max",
					channelKind: "messenger",
					status: "pending",
					attempts: 0,
					nextAttemptAt: "2026-09-16T12:00:00.000Z",
					idempotencyKey: "lead:1:channel:max",
				});
			},
		),
	/delivery write failed/,
);
assert.equal(rollbackDb.commits, 0);
assert.equal(rollbackDb.rollbacks, 1);
assert.equal(rollbackPayload.writes.length, 0);

const failedCommitDb = transactionDb({
	commit: async () => {
		throw new Error("commit failed");
	},
});
const failedCommitPayload = createPayloadFixture(failedCommitDb);
await assert.rejects(
	() =>
		createPayloadLeadOutboxRepository(failedCommitPayload).transaction(
			async (tx) => {
				await tx.createLead({ ...intake.lead, status: "new" });
			},
		),
	/commit failed/,
);
assert.equal(failedCommitDb.commits, 1);
assert.equal(failedCommitDb.rollbacks, 1);
assert.equal(failedCommitPayload.writes.length, 0);

console.log("verify-lead-outbox: ok");

function transactionDb(options) {
	let begin = Object.hasOwn(options, "begin")
		? options.begin
		: async () => "lead-tx-1";
	const commit = Object.hasOwn(options, "commit")
		? options.commit
		: async () => undefined;
	const rollback = Object.hasOwn(options, "rollback")
		? options.rollback
		: async () => undefined;
	const state = { commits: 0, rollbacks: 0 };
	if (Object.hasOwn(options, "transactionId")) {
		begin = async () => options.transactionId;
	}
	if (begin !== undefined) state.beginTransaction = begin;
	if (commit !== undefined) {
		state.commitTransaction = async (id) => {
			state.commits += 1;
			return commit(id);
		};
	}
	if (rollback !== undefined) {
		state.rollbackTransaction = async (id) => {
			state.rollbacks += 1;
			return rollback(id);
		};
	}
	return state;
}

function createPayloadFixture(db, { failDelivery = false } = {}) {
	const writes = [];
	const payload = {
		db,
		writes,
		async create({ collection, data, req }) {
			assert.equal(req?.transactionID, "lead-tx-1");
			if (collection === "lead-deliveries" && failDelivery) {
				writes.length = 0;
				throw new Error("delivery write failed");
			}
			const record = {
				...data,
				id: collection === "leads" ? 1 : 2,
			};
			writes.push(record);
			return record;
		},
	};
	const originalRollback = db.rollbackTransaction;
	if (originalRollback) {
		db.rollbackTransaction = async (id) => {
			writes.length = 0;
			return originalRollback(id);
		};
	}
	return payload;
}

function createRepository() {
	const state = {
		leads: [],
		deliveries: [],
		transactions: 0,
		externalCalls: 0,
		async transaction(operation) {
			this.transactions += 1;
			const leadSnapshot = [...this.leads];
			const deliverySnapshot = [...this.deliveries];
			try {
				return await operation({
					createLead: async (input) => {
						const record = { ...input, id: `lead-${this.leads.length + 1}` };
						this.leads.push(record);
						return record;
					},
					createLeadDelivery: async (input) => {
						const record = {
							...input,
							id: `delivery-${this.deliveries.length + 1}`,
						};
						this.deliveries.push(record);
						return record;
					},
				});
			} catch (error) {
				this.leads = leadSnapshot;
				this.deliveries = deliverySnapshot;
				throw error;
			}
		},
		async findLeadByIdempotencyKey(idempotencyKey) {
			return this.leads.find((lead) => lead.idempotencyKey === idempotencyKey);
		},
		async findLeadDeliveries(leadId) {
			return this.deliveries.filter((delivery) => delivery.lead === leadId);
		},
		async findPendingDeliveriesWithoutJob(nowIso) {
			return this.deliveries.filter(
				(delivery) =>
					delivery.status === "pending" &&
					!delivery.jobId &&
					new Date(delivery.nextAttemptAt) <= new Date(nowIso),
			);
		},
	};
	return state;
}
