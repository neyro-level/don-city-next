import type { PayloadRequest, TaskConfig } from "payload";
import { invalidatePublicCache } from "../../core/cache/invalidator.ts";
import {
	claimDueFeedSources,
	claimQueuedImportRun,
	consumeDeactivationApproval,
	finishImportRun,
	interruptRecoverableImportRun,
	touchImportRunHeartbeat,
} from "../../core/data-access/ingest/sql/index.ts";
import { countPublicCatalogProperties } from "../../core/data-access/public/catalog.ts";
import { buildListingCatalogQuery } from "../../core/data-access/public/listing-catalog-query.ts";
import { createSystemJobPayloadGateway } from "../../core/data-access/system/job-payload.ts";
import {
	inspectPayloadJob,
	listPayloadJobsByConcurrencyKey,
} from "../../core/data-access/system/jobs/index.ts";
import { systemQueueJob } from "../../core/data-access/system/queue-job.ts";
import {
	claimPendingDeliveryRecoveryLease,
	recoverStaleSendingDeliveryIfStillStale,
} from "../../core/data-access/system/sql/index.ts";
import { catalogRetentionThreshold } from "../../core/ingest/catalog-retention.ts";
import { dispatchDueFeeds } from "../../core/ingest/dispatch-due-feeds.ts";
import { fetchConditionalFeed } from "../../core/ingest/feed-fetcher.ts";
import {
	parseFeedUrlRef,
	parseImageHostEnv,
	runImportFeed,
} from "../../core/ingest/import-feed-runtime.ts";
import { decideImportRunRecovery } from "../../core/ingest/import-recovery.ts";
import { createPayloadFeedIngestRepository } from "../../core/ingest/payload-feed-ingest-repository.ts";
import { runDeliverLeadTask } from "../../core/leads/deliver-lead.ts";
import {
	type LeadDeliveryStateRecord,
	recoverStaleSendingDelivery,
} from "../../core/leads/delivery-state.ts";
import { isLiveFuturePayloadJob } from "../../core/leads/job-liveness.ts";
import {
	anonymizeLeadFields,
	isConfiguredRetentionDays,
	planLeadRetentionRun,
	purgeDeliveryDiagnostics,
} from "../../core/leads/retention.ts";
import {
	importStaleThresholdMs,
	observedSuccessfulDurationMs,
	pendingDeliveryOrphanThresholdMs,
	queuedImportOrphanThresholdMs,
} from "../../core/operations/recovery-thresholds.ts";
import {
	createSafeFeedOutboundFetch,
	parseOutboundHostList,
} from "../../core/security/safe-outbound-client.ts";
import { parseTestApprovedOrigins } from "../../core/security/test-destinations.ts";
import { getRuntimeClock } from "../../core/time/clock.ts";
import { nextListingInventoryGateState } from "../../platform/seo/content-gate-state.ts";
import { runtimeEnv } from "../env.ts";
import { projectConfig } from "../project.config.ts";
import { seoRegistryById } from "../seo-registry.generated.ts";
import { siteProfile } from "../site.profile.ts";
import {
	type PayloadJobTaskSlug,
	payloadJobQueues,
	payloadJobRegistry,
	payloadJobTaskSlugs,
} from "./registry.ts";

type GenericPayloadJobTask = TaskConfig<{
	input: Record<string, unknown>;
	output: Record<string, unknown>;
}>;

const minuteInMs = 60_000;
const pendingDeliveryRecoveryLeaseMinutes = 5;
function nowDate() {
	return getRuntimeClock().now();
}

function nowIso() {
	return getRuntimeClock().nowIso();
}

function addMinutes(date: Date, minutes: number) {
	return new Date(date.getTime() + minutes * minuteInMs);
}

async function applyLeadRetentionTransaction({
	req,
	leadId,
	retentionMode,
	purgedAt,
}: {
	req: PayloadRequest;
	leadId: number | string;
	retentionMode: "delete" | "anonymize";
	purgedAt: string;
}) {
	const transactionID = await req.payload.db.beginTransaction();
	if (transactionID == null) {
		throw new Error(
			"Payload Postgres did not start a lead retention transaction.",
		);
	}
	const transactionReq = { ...req, transactionID } as PayloadRequest;
	const systemPayload = createSystemJobPayloadGateway(req.payload);

	try {
		const deliveries = await systemPayload.find({
			collection: "lead-deliveries",
			where: { lead: { equals: leadId } },
			pagination: false,
			depth: 0,
			req: transactionReq,
		});

		for (const delivery of deliveries.docs) {
			if (retentionMode === "delete") {
				await systemPayload.delete({
					collection: "lead-deliveries",
					id: delivery.id,
					req: transactionReq,
				});
				continue;
			}
			await systemPayload.update({
				collection: "lead-deliveries",
				id: delivery.id,
				data: purgeDeliveryDiagnostics(purgedAt),
				req: transactionReq,
			});
		}

		if (retentionMode === "delete") {
			await systemPayload.delete({
				collection: "leads",
				id: leadId,
				req: transactionReq,
			});
		} else {
			await systemPayload.update({
				collection: "leads",
				id: leadId,
				data: anonymizeLeadFields(purgedAt),
				req: transactionReq,
			});
		}

		await req.payload.db.commitTransaction(transactionID);
		return { deliveries: deliveries.docs.length };
	} catch (error) {
		await req.payload.db
			.rollbackTransaction(transactionID)
			.catch(() => undefined);
		throw error;
	}
}

export function computeNextDueAt({
	now,
	previousNextDueAt,
	refreshIntervalMinutes,
}: {
	now: Date;
	previousNextDueAt?: null | string;
	refreshIntervalMinutes: number;
}) {
	const nextFromNow = addMinutes(now, refreshIntervalMinutes);
	const previous = previousNextDueAt ? new Date(previousNextDueAt) : undefined;
	const nextFromPrevious = previous
		? addMinutes(previous, refreshIntervalMinutes)
		: undefined;

	if (nextFromPrevious && nextFromPrevious > nextFromNow) {
		return nextFromPrevious.toISOString();
	}

	return nextFromNow.toISOString();
}

function getStaticSchedule(slug: PayloadJobTaskSlug) {
	const task = payloadJobRegistry.find((entry) => entry.slug === slug);

	if (task?.trigger !== "static" || !task.cron) {
		throw new Error(`Task "${slug}" is not a static scheduled task.`);
	}

	return [{ cron: task.cron, queue: task.queue }];
}

async function queueTask({
	req,
	task,
	queue,
	input,
	waitUntil,
}: {
	req: PayloadRequest;
	task: PayloadJobTaskSlug;
	queue: string;
	input: Record<string, unknown>;
	waitUntil?: Date;
}) {
	return systemQueueJob({
		req,
		task: task as never,
		queue,
		input: input as never,
		waitUntil,
	});
}

export const payloadJobTasks: GenericPayloadJobTask[] = [
	{
		slug: payloadJobTaskSlugs.dispatchDueFeeds,
		label: "Dispatch due feeds",
		schedule: getStaticSchedule(payloadJobTaskSlugs.dispatchDueFeeds),
		handler: async ({ req }) => {
			const now = nowDate();
			const systemPayload = createSystemJobPayloadGateway(req.payload);
			const result = await dispatchDueFeeds({
				now,
				batchSize: projectConfig.dispatchBatchSize,
				claimDueFeedSources: (input) => claimDueFeedSources(req.payload, input),
				createQueuedImportRun: async ({ feedSourceId, now: queuedAt }) => {
					const created = await systemPayload.create({
						collection: "import-runs",
						data: {
							feedSource: Number(feedSourceId),
							status: "queued",
							queuedAt: queuedAt.toISOString(),
							heartbeatAt: queuedAt.toISOString(),
						},
					});
					return { id: String(created.id) };
				},
				enqueueImportFeed: async (input) => {
					const queuedJob = (await queueTask({
						req,
						task: payloadJobTaskSlugs.importFeed,
						queue: payloadJobQueues.imports,
						input,
					})) as { id: number | string };
					return { id: String(queuedJob.id) };
				},
				attachJobId: async ({ importRunId, jobId }) => {
					await systemPayload.update({
						collection: "import-runs",
						id: importRunId,
						data: { jobId },
					});
				},
			});

			return {
				output: {
					dispatched: result.dispatched.length > 0,
					count: result.dispatched.length,
					items: result.dispatched,
				},
			};
		},
	},
	{
		slug: payloadJobTaskSlugs.importFeed,
		label: "Import feed",
		retries: 0,
		inputSchema: [
			{ name: "feedSourceId", type: "text", required: true },
			{ name: "importRunId", type: "text", required: true },
		],
		concurrency: {
			key: ({ input }) => `import:feed:${input.feedSourceId}`,
			exclusive: true,
			supersedes: false,
		},
		handler: async ({ req, input }) => {
			const payload = req.payload;
			const systemPayload = createSystemJobPayloadGateway(payload);
			const testOrigins = parseTestApprovedOrigins(process.env);
			const testHosts = [
				...new Set(testOrigins.map((origin) => new URL(origin).hostname)),
			];
			const result = await runImportFeed(
				{
					now: () => nowDate(),
					claimQueuedImportRun: (claim) => claimQueuedImportRun(payload, claim),
					touchHeartbeat: async (tick) => {
						await touchImportRunHeartbeat(payload, tick);
					},
					loadFeedSource: async (feedSourceId) => {
						const source = await systemPayload.findByID({
							collection: "feed-sources",
							id: feedSourceId,
							depth: 0,
						});
						return {
							id: String(source.id),
							code: source.code,
							enabled: Boolean(source.enabled),
							market: source.market,
							feedUrlRef: source.feedUrlRef,
							lastEtag: source.lastEtag,
							lastModified: source.lastModified,
							lastFeedHash: source.lastFeedHash,
							lastOfferCount: source.lastOfferCount,
							safetyThresholdPercent: source.safetyThresholdPercent,
							maxDeactivationsPerRun: source.maxDeactivationsPerRun,
							deactivationApproval: {
								runId:
									typeof source.deactivationApproval?.runId === "object" &&
									source.deactivationApproval.runId
										? String(source.deactivationApproval.runId.id)
										: source.deactivationApproval?.runId == null
											? undefined
											: String(source.deactivationApproval.runId),
								approvedAt: source.deactivationApproval?.approvedAt,
								expiresAt: source.deactivationApproval?.expiresAt,
								consumedAt: source.deactivationApproval?.consumedAt,
							},
						};
					},
					resolveFeedUrl: parseFeedUrlRef,
					fetchFeed: ({ url, etag, lastModified }) =>
						fetchConditionalFeed({
							url,
							etag,
							lastModified,
							outboundFetch: createSafeFeedOutboundFetch({
								allowedHosts: [
									...parseOutboundHostList(runtimeEnv.OUTBOUND_ALLOWED_HOSTS),
									...testHosts,
								],
								approvedHttpHosts: testHosts,
								approvedExactOrigins: testOrigins,
								maxBytes: 64 * 1024 * 1024,
							}),
						}),
					beginImportTransaction: async () => {
						const transactionId = await payload.db.beginTransaction();
						if (transactionId == null) {
							throw new Error(
								"Payload Postgres did not start an import transaction.",
							);
						}
						return transactionId;
					},
					commitImportTransaction: (transactionId) =>
						payload.db.commitTransaction(transactionId),
					rollbackImportTransaction: (transactionId) =>
						payload.db.rollbackTransaction(transactionId),
					createRepository: (feedSourceId, transactionId) =>
						createPayloadFeedIngestRepository(
							payload,
							feedSourceId,
							transactionId,
						),
					finishRun: async (finish, transactionId) => {
						const transitioned = await finishImportRun(
							payload,
							finish,
							transactionId,
						);
						if (!transitioned) {
							throw new Error(
								"Import run terminal transition rejected because it is no longer running.",
							);
						}
					},
					recordSourceContact: async (
						{ feedSourceId, patch },
						transactionId,
					) => {
						if (Object.keys(patch).length === 0) return;
						await systemPayload.update({
							collection: "feed-sources",
							id: feedSourceId,
							data: patch,
							req:
								transactionId === undefined
									? undefined
									: ({
											...req,
											transactionID: transactionId,
										} as PayloadRequest),
						});
					},
					consumeDeactivationApproval: (input, transactionId) =>
						consumeDeactivationApproval(payload, input, transactionId),
					invalidatePublicCache: async (targets) => {
						const result = await invalidatePublicCache({
							baseUrl: runtimeEnv.INTERNAL_REVALIDATE_BASE_URL,
							secret: runtimeEnv.REVALIDATE_SECRET,
							targets,
							reason: "import-feed",
						});
						return { ok: result.ok };
					},
					reportOperationalWarning: async (warning) => {
						payload.logger.warn({
							msg: "Post-commit public cache invalidation failed.",
							...warning,
						});
					},
					allowedImageHosts: parseImageHostEnv(runtimeEnv.EXTERNAL_IMAGE_HOSTS),
				},
				{
					feedSourceId: String(input.feedSourceId),
					importRunId: String(input.importRunId),
				},
			);

			return { output: result };
		},
	},
	{
		slug: payloadJobTaskSlugs.jobsJanitor,
		label: "Jobs janitor",
		schedule: getStaticSchedule(payloadJobTaskSlugs.jobsJanitor),
		handler: async ({ req }) => {
			const systemPayload = createSystemJobPayloadGateway(req.payload);
			const recentSuccess = await systemPayload.find({
				collection: "import-runs",
				where: { status: { equals: "success" } },
				sort: "-finishedAt",
				limit: 5,
				depth: 0,
				req,
			});
			const importStaleMs = importStaleThresholdMs(
				observedSuccessfulDurationMs(recentSuccess.docs),
			);
			const queuedOrphanMs = queuedImportOrphanThresholdMs(
				projectConfig.dispatcherIntervalMinutes,
			);
			const importStaleBefore = new Date(
				nowDate().getTime() - importStaleMs,
			).toISOString();
			const queuedOrphanBefore = new Date(
				nowDate().getTime() - queuedOrphanMs,
			).toISOString();
			const staleRuns = await systemPayload.find({
				collection: "import-runs",
				where: {
					or: [
						{
							and: [
								{ status: { equals: "running" } },
								{ heartbeatAt: { less_than: importStaleBefore } },
							],
						},
						{
							and: [
								{ status: { equals: "running" } },
								{ heartbeatAt: { exists: false } },
								{ startedAt: { less_than: importStaleBefore } },
							],
						},
						{
							and: [
								{ status: { equals: "queued" } },
								{ queuedAt: { less_than: queuedOrphanBefore } },
							],
						},
					],
				},
				limit: 20,
				depth: 0,
				req,
			});

			let interruptedRuns = 0;
			for (const run of staleRuns.docs) {
				let referencedJob:
					| {
							waitUntil?: string | null;
							completedAt?: string | null;
							processing?: boolean | null;
					  }
					| null
					| undefined;
				if (run.status === "queued" && run.jobId) {
					try {
						const job = await inspectPayloadJob(req.payload, String(run.jobId));
						referencedJob = {
							waitUntil:
								typeof job.waitUntil === "string" ? job.waitUntil : null,
							completedAt:
								typeof job.completedAt === "string" ? job.completedAt : null,
							processing: Boolean((job as { processing?: boolean }).processing),
						};
					} catch {
						referencedJob = null;
					}
				}
				const decision = decideImportRunRecovery({
					run: {
						status: run.status,
						queuedAt: run.queuedAt,
						startedAt: run.startedAt,
						heartbeatAt: run.heartbeatAt,
						jobId: run.jobId,
					},
					importStaleBefore,
					queuedOrphanBefore,
					job: referencedJob,
					now: nowDate(),
				});
				if (!decision.interrupt) continue;
				const interruptedId = await interruptRecoverableImportRun(req.payload, {
					importRunId: String(run.id),
					expectedStatus: run.status === "queued" ? "queued" : "running",
					staleBefore: new Date(
						run.status === "queued" ? queuedOrphanBefore : importStaleBefore,
					),
					now: nowDate(),
					reason: decision.reason,
				});
				if (interruptedId) interruptedRuns += 1;
			}

			return { output: { interruptedRuns } };
		},
	},
	{
		slug: payloadJobTaskSlugs.leadRetentionCleanup,
		label: "Lead retention cleanup",
		schedule: getStaticSchedule(payloadJobTaskSlugs.leadRetentionCleanup),
		handler: async ({ req }) => {
			const systemPayload = createSystemJobPayloadGateway(req.payload);
			const decision = planLeadRetentionRun(projectConfig.leadRetentionDays);
			if (!decision.destructive) {
				return {
					output: {
						purgedLeads: 0,
						skipped: decision.reason,
						alert: decision.alert.code,
					},
				};
			}

			const expiredLeads = await systemPayload.find({
				collection: "leads",
				where: {
					and: [
						{ retentionUntil: { less_than_equal: nowIso() } },
						{ piiPurgedAt: { exists: false } },
					],
				},
				limit: 20,
				depth: 0,
				req,
			});
			const purgedAt = nowIso();
			let deleted = 0;
			let anonymized = 0;
			let purgedDeliveries = 0;

			for (const lead of expiredLeads.docs) {
				const result = await applyLeadRetentionTransaction({
					req,
					leadId: lead.id,
					retentionMode: lead.retentionMode,
					purgedAt,
				});
				purgedDeliveries += result.deliveries;

				if (lead.retentionMode === "delete") {
					deleted += 1;
					continue;
				}
				anonymized += 1;
			}

			return {
				output: {
					purgedLeads: deleted + anonymized,
					deleted,
					anonymized,
					purgedDeliveries,
				},
			};
		},
	},
	{
		slug: payloadJobTaskSlugs.catalogLifecycle,
		label: "Catalog lifecycle",
		schedule: getStaticSchedule(payloadJobTaskSlugs.catalogLifecycle),
		handler: async ({ req }) => {
			const systemPayload = createSystemJobPayloadGateway(req.payload);
			const retentionDays = projectConfig.archiveRetentionDays;
			if (!isConfiguredRetentionDays(retentionDays)) {
				return {
					output: {
						purgedProperties: 0,
						skipped: "missing_policy",
					},
				};
			}
			const threshold = catalogRetentionThreshold(
				nowDate(),
				retentionDays,
			).toISOString();
			const archivedProperties = await systemPayload.find({
				collection: "properties",
				where: {
					and: [
						{ status: { equals: "archived" } },
						{ contentPurgedAt: { exists: false } },
						{ deactivatedAt: { less_than_equal: threshold } },
					],
				},
				limit: 20,
				depth: 0,
				req,
			});
			const purgedAt = nowIso();

			for (const property of archivedProperties.docs) {
				await systemPayload.update({
					collection: "properties",
					id: property.id,
					data: {
						description: null,
						images: [],
						contentPurgedAt: purgedAt,
					},
					req,
				});
				// Purge never writes a homepage redirect; public path becomes 410
				// unless an explicit redirects.from row already exists.
			}

			return { output: { purgedProperties: archivedProperties.docs.length } };
		},
	},
	{
		slug: payloadJobTaskSlugs.refreshListingContentGate,
		label: "Refresh listing Content Gate state",
		schedule: getStaticSchedule(payloadJobTaskSlugs.refreshListingContentGate),
		handler: async ({ req }) => {
			const systemPayload = createSystemJobPayloadGateway(req.payload);
			const rows = await systemPayload.find({
				collection: "listing-contents",
				where: { status: { equals: "approved" } },
				pagination: false,
				depth: 0,
				req,
			});
			const evaluatedAt = nowDate();
			let updated = 0;

			for (const row of rows.docs) {
				const entry = seoRegistryById.get(row.registryId);
				const query = entry ? buildListingCatalogQuery(entry) : null;
				if (!entry?.tier || !query) continue;
				const threshold =
					siteProfile.inventoryThreshold[
						entry.tier as keyof typeof siteProfile.inventoryThreshold
					];
				if (!Number.isInteger(threshold)) continue;
				const activeObjects = await countPublicCatalogProperties(
					req.payload,
					query,
				);
				const state = nextListingInventoryGateState({
					activeObjects,
					threshold,
					now: evaluatedAt,
					lastThresholdPassedAt: row.lastThresholdPassedAt,
				});
				await systemPayload.update({
					collection: "listing-contents",
					id: row.id,
					data: state,
					req,
				});
				updated += 1;
			}

			return { output: { evaluated: rows.docs.length, updated } };
		},
	},
	{
		slug: payloadJobTaskSlugs.recoverLeadDeliveries,
		label: "Recover lead deliveries",
		schedule: getStaticSchedule(payloadJobTaskSlugs.recoverLeadDeliveries),
		handler: async ({ req }) => {
			const systemPayload = createSystemJobPayloadGateway(req.payload);
			const recoveryNowIso = nowIso();
			const pendingOrphanBefore = new Date(
				nowDate().getTime() -
					pendingDeliveryOrphanThresholdMs(
						projectConfig.maintenanceIntervalMinutes,
					),
			).toISOString();
			const staleThreshold = new Date(
				nowDate().getTime() -
					projectConfig.leadDelivery.staleSendingThresholdMinutes * 60_000,
			).toISOString();
			const staleSending = await systemPayload.find({
				collection: "lead-deliveries",
				where: {
					and: [
						{ status: { equals: "sending" } },
						{ heartbeatAt: { less_than: staleThreshold } },
					],
				},
				limit: 20,
				depth: 0,
				req,
			});

			let recoveredSending = 0;
			for (const delivery of staleSending.docs) {
				const recovered = recoverStaleSendingDelivery(
					{
						id: String(delivery.id),
						lead: String(delivery.lead),
						channelId: delivery.channelId,
						status: "sending",
						attempts: delivery.attempts,
						nextAttemptAt: delivery.nextAttemptAt ?? undefined,
						jobId: delivery.jobId ?? undefined,
						claimedAt: delivery.claimedAt ?? undefined,
						heartbeatAt: delivery.heartbeatAt ?? undefined,
						attemptLog:
							(delivery.attemptLog as LeadDeliveryStateRecord["attemptLog"]) ??
							undefined,
					},
					recoveryNowIso,
					projectConfig.leadDelivery,
				);
				if (!recovered) continue;
				const recoveredId = await recoverStaleSendingDeliveryIfStillStale(
					req.payload,
					{
						deliveryId: String(delivery.id),
						staleBeforeIso: staleThreshold,
						nowIso: recovered.nextAttemptAt ?? recoveryNowIso,
						maxAttemptLogEntries:
							projectConfig.leadDelivery.maxAttemptLogEntries,
					},
				);
				if (recoveredId) recoveredSending += 1;
			}

			const duePending = await systemPayload.find({
				collection: "lead-deliveries",
				where: {
					and: [
						{ status: { equals: "pending" } },
						{ nextAttemptAt: { less_than_equal: pendingOrphanBefore } },
					],
				},
				limit: 20,
				depth: 0,
				req,
			});

			let queuedPending = 0;
			for (const delivery of duePending.docs) {
				let liveJobId: string | undefined;
				if (delivery.jobId) {
					try {
						const job = await inspectPayloadJob(
							req.payload,
							String(delivery.jobId),
						);
						if (
							isLiveFuturePayloadJob(
								{
									waitUntil:
										typeof job.waitUntil === "string" ? job.waitUntil : null,
									completedAt:
										typeof job.completedAt === "string"
											? job.completedAt
											: null,
									processing: Boolean(
										(job as { processing?: boolean }).processing,
									),
								},
								nowDate(),
							)
						) {
							liveJobId = String(job.id);
						}
					} catch {
						liveJobId = undefined;
					}
				}

				if (!liveJobId) {
					const matchingJobs = await listPayloadJobsByConcurrencyKey(
						req.payload,
						{
							concurrencyKey: `lead-delivery:${delivery.id}`,
							taskSlug: payloadJobTaskSlugs.deliverLead,
						},
					);
					const liveJob = matchingJobs.docs.find((job) =>
						isLiveFuturePayloadJob(
							{
								waitUntil: job.waitUntil,
								completedAt: job.completedAt,
								processing: job.processing,
							},
							nowDate(),
						),
					);
					liveJobId = liveJob ? String(liveJob.id) : undefined;
				}

				if (liveJobId) {
					if (String(delivery.jobId ?? "") !== liveJobId) {
						await systemPayload.update({
							collection: "lead-deliveries",
							id: delivery.id,
							data: { jobId: liveJobId },
							req,
						});
					}
					continue;
				}

				const recoveryLeaseUntil = addMinutes(
					new Date(recoveryNowIso),
					pendingDeliveryRecoveryLeaseMinutes,
				);
				const leasedId = await claimPendingDeliveryRecoveryLease(req.payload, {
					deliveryId: String(delivery.id),
					orphanBefore: new Date(pendingOrphanBefore),
					leaseUntil: recoveryLeaseUntil,
					now: new Date(recoveryNowIso),
				});
				if (!leasedId) continue;

				const queuedJob = (await queueTask({
					req,
					task: payloadJobTaskSlugs.deliverLead,
					queue: payloadJobQueues.leadDeliveries,
					input: { leadDeliveryId: leasedId },
					waitUntil: recoveryLeaseUntil,
				})) as { id: number | string };

				await systemPayload.update({
					collection: "lead-deliveries",
					id: leasedId,
					data: {
						jobId: String(queuedJob.id),
					},
					req,
				});
				queuedPending += 1;
			}

			return {
				output: {
					recoveredSending,
					queuedPending,
				},
			};
		},
	},
	{
		slug: payloadJobTaskSlugs.deliverLead,
		label: "Deliver lead",
		inputSchema: [{ name: "leadDeliveryId", type: "text", required: true }],
		retries: 0,
		concurrency: {
			key: ({ input }) => `lead-delivery:${input.leadDeliveryId}`,
			exclusive: true,
			supersedes: false,
		},
		handler: async ({ input, req }) => {
			const result = await runDeliverLeadTask({
				payload: req.payload,
				leadDeliveryId: String(input.leadDeliveryId),
				nowIso: nowIso(),
				policy: projectConfig.leadDelivery,
				env: {
					LEAD_OUTBOUND_HOSTS: runtimeEnv.LEAD_OUTBOUND_HOSTS,
					MAX_API_URL: runtimeEnv.MAX_API_URL,
					MAX_BOT_TOKEN: runtimeEnv.MAX_BOT_TOKEN,
					MAX_CHAT_ID: runtimeEnv.MAX_CHAT_ID,
					CUSTOM_WEBHOOK_URL: runtimeEnv.CUSTOM_WEBHOOK_URL,
					CUSTOM_WEBHOOK_HMAC_SECRET: runtimeEnv.CUSTOM_WEBHOOK_HMAC_SECRET,
				},
				queueRetry: async ({ leadDeliveryId, waitUntil }) => {
					const queued = (await queueTask({
						req,
						task: payloadJobTaskSlugs.deliverLead,
						queue: payloadJobQueues.leadDeliveries,
						input: { leadDeliveryId },
						waitUntil,
					})) as { id: number | string };
					return String(queued.id);
				},
			});
			return result;
		},
	},
];
