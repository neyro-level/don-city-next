import type { FeedIngestRepository, FeedIngestResult } from "./feed-ingest.ts";
import { ingestNormalizedFeed } from "./feed-ingest.ts";
import type { FetchFeedResult } from "./feed-fetcher.ts";
import {
	buildFeedSourceBaselinePatch,
	decideFeedRunCompletion,
	isDeactivationApprovalValid,
	type DeactivationApprovalSnapshot,
	type FeedSourceBaselinePatch,
} from "./feed-lifecycle.ts";
import { parseAllowedImageHosts } from "./image-hosts.ts";
import type {
	FeedNormalizationIssue,
	NormalizedFeedOffer,
} from "./feed-normalization.ts";
import { parseYrlFeed } from "./yrl-parser.ts";
import { startImportHeartbeat } from "./dispatch-due-feeds.ts";
import { projectConfig } from "../../project/project.config.ts";
import { projectUrls } from "../../project/url-grammar.ts";

export type ImportFeedSourceSnapshot = {
	id: string;
	code: string;
	enabled: boolean;
	market: "secondary" | "newbuild";
	feedUrlRef: string;
	lastEtag?: string | null;
	lastModified?: string | null;
	lastFeedHash?: string | null;
	lastOfferCount?: number | null;
	safetyThresholdPercent: number;
	maxDeactivationsPerRun: number;
	deactivationApproval?: DeactivationApprovalSnapshot;
};

export type ImportFeedRuntimeDeps = {
	now: () => Date;
	monotonicNow?: () => number;
	heartbeatIntervalMs?: number;
	ingestBatchSize?: number;
	maxTotalOffers?: number;
	maxTotalIssues?: number;
	maxDatabaseWorkUnits?: number;
	maxImportDurationMs?: number;
	claimQueuedImportRun: (input: {
		importRunId: string;
		now: Date;
	}) => Promise<string | undefined>;
	touchHeartbeat: (input: { importRunId: string; now: Date }) => Promise<void>;
	loadFeedSource: (feedSourceId: string) => Promise<ImportFeedSourceSnapshot>;
	resolveFeedUrl: (feedUrlRef: string) => string;
	fetchFeed: (input: {
		url: string;
		etag?: string | null;
		lastModified?: string | null;
	}) => Promise<FetchFeedResult>;
	parseFeed?: typeof parseYrlFeed;
	beginImportTransaction?: () => Promise<string | number>;
	commitImportTransaction?: (transactionId: string | number) => Promise<void>;
	rollbackImportTransaction?: (transactionId: string | number) => Promise<void>;
	createRepository: (
		feedSourceId: string,
		transactionId?: string | number,
	) => FeedIngestRepository;
	ingest?: typeof ingestNormalizedFeed;
	finishRun: (input: {
		importRunId: string;
		now: Date;
		status: "success" | "unchanged" | "suspicious" | "interrupted" | "failed";
		offeredCount?: number;
		createdCount?: number;
		updatedCount?: number;
		skippedCount?: number;
		warningCount?: number;
		errorCount?: number;
		feedHash?: string;
		lastErrorRedacted?: string;
	}) => Promise<void>;
	recordSourceContact: (input: {
		feedSourceId: string;
		patch: FeedSourceBaselinePatch;
	}) => Promise<void>;
	consumeDeactivationApproval?: (input: {
		feedSourceId: string;
		importRunId: string;
		now: Date;
	}) => Promise<boolean>;
	invalidatePublicCache?: (
		targets: FeedIngestResult["invalidatedTargets"],
	) => Promise<{ ok: boolean }>;
	allowedImageHosts: ReadonlySet<string>;
};

export type ImportFeedRuntimeResult =
	| { claimed: false }
	| {
			claimed: true;
			status: "success" | "unchanged" | "suspicious" | "interrupted" | "failed";
			ingest?: FeedIngestResult;
			cacheInvalidated?: boolean;
			maxBufferedOffersObserved?: number;
	  };

function emptyIngestResult(): FeedIngestResult {
	return {
		offeredCount: 0,
		createdCount: 0,
		updatedCount: 0,
		skippedCount: 0,
		warningCount: 0,
		errorCount: 0,
		invalidatedTargets: [],
	};
}

function mergeIngestResult(
	target: FeedIngestResult,
	batch: FeedIngestResult,
): void {
	for (const key of [
		"offeredCount",
		"createdCount",
		"updatedCount",
		"skippedCount",
		"warningCount",
		"errorCount",
	] as const) {
		target[key] += batch[key];
	}
	for (const next of batch.invalidatedTargets) {
		if (
			!target.invalidatedTargets.some(
				(current) => JSON.stringify(current) === JSON.stringify(next),
			)
		) {
			target.invalidatedTargets.push(next);
		}
	}
}

export async function runImportFeed(
	deps: ImportFeedRuntimeDeps,
	input: { feedSourceId: string; importRunId: string },
): Promise<ImportFeedRuntimeResult> {
	const now = deps.now();
	const claimedId = await deps.claimQueuedImportRun({
		importRunId: input.importRunId,
		now,
	});
	if (!claimedId) {
		return { claimed: false };
	}

	const heartbeat = startImportHeartbeat({
		intervalMs:
			deps.heartbeatIntervalMs ?? projectConfig.importHeartbeatIntervalMs,
		tick: () =>
			deps.touchHeartbeat({ importRunId: input.importRunId, now: deps.now() }),
	});
	let transactionId: string | number | undefined;
	let transactionSettled = false;
	let fetchedForCleanup:
		| Extract<FetchFeedResult, { status: "fetched" }>
		| undefined;

	try {
		const source = await deps.loadFeedSource(input.feedSourceId);
		if (!source.enabled) {
			throw new Error("Disabled feed source cannot be imported.");
		}
		const url = deps.resolveFeedUrl(source.feedUrlRef);
		const fetched = await deps.fetchFeed({
			url,
			etag: source.lastEtag,
			lastModified: source.lastModified,
		});

		if (fetched.status === "unchanged") {
			await deps.finishRun({
				importRunId: input.importRunId,
				now: deps.now(),
				status: "unchanged",
			});
			await deps.recordSourceContact({
				feedSourceId: source.id,
				patch: buildFeedSourceBaselinePatch({
					status: "unchanged",
					parserCompleted: true,
					criticalStructuralError: false,
					nowIso: deps.now().toISOString(),
					etag: fetched.etag,
					lastModified: fetched.lastModified,
				}),
			});
			return { claimed: true, status: "unchanged" };
		}
		fetchedForCleanup = fetched;
		const transactionHooks = [
			deps.beginImportTransaction,
			deps.commitImportTransaction,
			deps.rollbackImportTransaction,
		];
		if (transactionHooks.some(Boolean) && !transactionHooks.every(Boolean)) {
			throw new Error(
				"Import transaction hooks must be configured as a complete set.",
			);
		}
		transactionId = await deps.beginImportTransaction?.();

		const parse = deps.parseFeed ?? parseYrlFeed;
		const ingest = deps.ingest ?? ingestNormalizedFeed;
		const repository = deps.createRepository(source.id, transactionId);
		const batchSize = deps.ingestBatchSize ?? projectConfig.ingestBatchSize;
		const maxTotalOffers = deps.maxTotalOffers ?? 50_000;
		const maxTotalIssues = deps.maxTotalIssues ?? 10_000;
		const maxDatabaseWorkUnits = deps.maxDatabaseWorkUnits ?? 250_000;
		const maxImportDurationMs = deps.maxImportDurationMs ?? 10 * 60_000;
		const monotonicNow = deps.monotonicNow ?? (() => performance.now());
		const deadline = monotonicNow() + maxImportDurationMs;
		if (!Number.isInteger(batchSize) || batchSize < 1) {
			throw new Error("ingestBatchSize must be a positive integer.");
		}
		if (
			!Number.isInteger(maxTotalOffers) ||
			maxTotalOffers < 1 ||
			!Number.isInteger(maxTotalIssues) ||
			maxTotalIssues < 1 ||
			!Number.isInteger(maxDatabaseWorkUnits) ||
			maxDatabaseWorkUnits < 1 ||
			!Number.isFinite(maxImportDurationMs) ||
			maxImportDurationMs < 1
		) {
			throw new Error("Import budgets must be positive finite values.");
		}
		const context = {
			feedSourceId: source.id,
			feedSourceCode: source.code,
			importRunId: input.importRunId,
			market: source.market,
			nowIso: now.toISOString(),
		};
		let offerBatch: NormalizedFeedOffer[] = [];
		let issueBatch: FeedNormalizationIssue[] = [];
		const uniqueExternalIds = new Set<string>();
		let maxBufferedOffersObserved = 0;
		let totalOffers = 0;
		let totalIssues = 0;
		let databaseWorkUnits = 0;
		const ingestResult = emptyIngestResult();
		const assertImportBudget = () => {
			if (monotonicNow() > deadline) {
				throw new Error("Import duration budget exceeded.");
			}
			if (totalOffers > maxTotalOffers) {
				throw new Error("Import offer budget exceeded.");
			}
			if (totalIssues > maxTotalIssues) {
				throw new Error("Import issue budget exceeded.");
			}
			if (databaseWorkUnits > maxDatabaseWorkUnits) {
				throw new Error("Import database work budget exceeded.");
			}
		};
		const flushBatch = async () => {
			if (offerBatch.length === 0 && issueBatch.length === 0) return;
			const currentOffers = offerBatch;
			const currentIssues = issueBatch;
			offerBatch = [];
			issueBatch = [];
			// Each offer can require lookup, write and last-seen work; issue rows add
			// one write. The conservative units keep DB work bounded independently
			// from batch memory size.
			databaseWorkUnits += currentOffers.length * 4 + currentIssues.length;
			assertImportBudget();
			mergeIngestResult(
				ingestResult,
				await ingest({
					context,
					offers: currentOffers,
					issues: currentIssues,
					repository,
				}),
			);
		};
		const parsed = await parse({
			stream: fetched.body,
			allowedImageHosts: deps.allowedImageHosts,
			onOffer: async (offer) => {
				totalOffers += 1;
				assertImportBudget();
				if (uniqueExternalIds.has(offer.externalId)) {
					totalIssues += 1;
					assertImportBudget();
					issueBatch.push({
						severity: "error",
						code: "feed.offer_duplicate",
						externalId: offer.externalId,
						field: "externalId",
						messageRedacted: "Duplicate external offer identity was ignored.",
					});
					if (offerBatch.length + issueBatch.length >= batchSize)
						await flushBatch();
					return;
				}
				uniqueExternalIds.add(offer.externalId);
				offerBatch.push(offer);
				maxBufferedOffersObserved = Math.max(
					maxBufferedOffersObserved,
					offerBatch.length,
				);
				if (offerBatch.length + issueBatch.length >= batchSize)
					await flushBatch();
			},
			onIssue: async (issue) => {
				totalIssues += 1;
				assertImportBudget();
				issueBatch.push(issue);
				if (offerBatch.length + issueBatch.length >= batchSize)
					await flushBatch();
			},
			collectOffers: false,
			collectIssues: false,
		});
		await flushBatch();
		assertImportBudget();
		if (
			!parsed.stats.parserCompleted ||
			parsed.stats.criticalStructuralAnomaly
		) {
			throw new Error("Feed parser did not complete safely.");
		}
		const bodyHash = (await fetched.sha256) ?? undefined;

		const seenBefore = now;
		const plannedDeactivations = await repository.countMissingActive({
			feedSourceId: source.id,
			seenBeforeIso: seenBefore.toISOString(),
		});
		const hasValidDeactivationApproval = isDeactivationApprovalValid({
			importRunId: input.importRunId,
			nowIso: seenBefore.toISOString(),
			approval: source.deactivationApproval,
		});
		const decisionInput = {
			nowIso: seenBefore.toISOString(),
			sourceEnabled: source.enabled,
			parserCompleted: parsed.stats.parserCompleted,
			criticalStructuralError: parsed.stats.criticalStructuralAnomaly,
			identityValid: true,
			runInterrupted: false,
			isFirstFullRun: source.lastOfferCount == null,
			offeredCount: ingestResult.offeredCount,
			previousOfferCount: source.lastOfferCount ?? undefined,
			safetyThresholdPercent: source.safetyThresholdPercent,
			plannedDeactivations,
			maxDeactivationsPerRun: source.maxDeactivationsPerRun,
			hasValidDeactivationApproval,
			fetchStatus: "fetched" as const,
			feedHash: bodyHash,
			lastFeedHash: source.lastFeedHash ?? undefined,
		};
		let decision = decideFeedRunCompletion(decisionInput);
		if (decision.reason === "approved_deactivation") {
			const consumed = await deps.consumeDeactivationApproval?.({
				feedSourceId: source.id,
				importRunId: input.importRunId,
				now: seenBefore,
			});
			if (!consumed) {
				decision = decideFeedRunCompletion({
					...decisionInput,
					hasValidDeactivationApproval: false,
				});
			}
		}

		if (decision.canDeactivateMissing && plannedDeactivations > 0) {
			await repository.deactivateMissing({
				feedSourceId: source.id,
				importRunId: input.importRunId,
				seenBeforeIso: seenBefore.toISOString(),
				nowIso: deps.now().toISOString(),
			});
			if (ingestResult.invalidatedTargets.length === 0) {
				ingestResult.invalidatedTargets = [
					{ type: "tag", tag: "properties" },
					{
						type: "path",
						path: projectUrls.primaryCatalog,
						routeType: "page",
					},
				];
			}
		}

		if (transactionId !== undefined) {
			await deps.commitImportTransaction?.(transactionId);
			transactionSettled = true;
		}

		let cacheOk = true;
		if (
			ingestResult.invalidatedTargets.length > 0 &&
			deps.invalidatePublicCache
		) {
			const cacheResult = await deps.invalidatePublicCache(
				ingestResult.invalidatedTargets,
			);
			cacheOk = cacheResult.ok;
			if (!cacheOk) {
				ingestResult.warningCount += 1;
			}
		}

		await deps.finishRun({
			importRunId: input.importRunId,
			now: deps.now(),
			status: decision.status,
			offeredCount: ingestResult.offeredCount,
			createdCount: ingestResult.createdCount,
			updatedCount: ingestResult.updatedCount,
			skippedCount: ingestResult.skippedCount,
			warningCount: ingestResult.warningCount,
			errorCount: ingestResult.errorCount,
			feedHash: bodyHash,
		});
		await deps.recordSourceContact({
			feedSourceId: source.id,
			patch: buildFeedSourceBaselinePatch({
				status: decision.status,
				parserCompleted: parsed.stats.parserCompleted,
				criticalStructuralError: parsed.stats.criticalStructuralAnomaly,
				nowIso: deps.now().toISOString(),
				etag: fetched.etag,
				lastModified: fetched.lastModified,
				feedHash: bodyHash,
				offeredCount: ingestResult.offeredCount,
			}),
		});
		return {
			claimed: true,
			status: decision.status,
			ingest: ingestResult,
			cacheInvalidated: cacheOk,
			maxBufferedOffersObserved,
		};
	} catch {
		await fetchedForCleanup?.cancel?.("import failed").catch(() => undefined);
		if (transactionId !== undefined && !transactionSettled) {
			await deps
				.rollbackImportTransaction?.(transactionId)
				.catch(() => undefined);
			transactionSettled = true;
		}
		await deps.finishRun({
			importRunId: input.importRunId,
			now: deps.now(),
			status: "failed",
			lastErrorRedacted:
				"Import feed failed without exposing destination details.",
		});
		return { claimed: true, status: "failed" };
	} finally {
		heartbeat.stop();
	}
}

export function parseFeedUrlRef(
	feedUrlRef: string,
	env: NodeJS.ProcessEnv = process.env,
): string {
	const value = env[feedUrlRef];
	if (
		!value ||
		(!value.startsWith("https://") && !value.startsWith("http://"))
	) {
		throw new Error("Feed URL reference is not configured.");
	}
	return value;
}

export function parseImageHostEnv(value?: string): ReadonlySet<string> {
	return parseAllowedImageHosts(value ?? "");
}
