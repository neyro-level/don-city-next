import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
	buildFeedPropertyWriteData,
	dispatchDueFeeds,
	ingestNormalizedFeed,
	isEnabledFeedDue,
	parseYrlFeed,
	runImportFeed,
	startImportHeartbeat,
} from "../src/core/ingest/index.ts";
import { projectUrls } from "../src/project/url-grammar.ts";

const repository = createRepository();
const baseContext = {
	feedSourceId: "feed-source-a",
	feedSourceCode: "source-a",
	importRunId: "run-1",
	market: "secondary",
	nowIso: "2026-09-16T12:00:00.000Z",
};
const offer = {
	externalId: "external-1",
	title: "Квартира на Тестовой",
	category: "квартира",
	dealType: "продажа",
	priceMinor: 12_000_000_00,
	currency: "RUB",
	publicAddress: "Москва, Тестовая, 1",
	locality: "Москва",
	images: [
		{ url: "https://img.allowed.example/1.jpg", host: "img.allowed.example" },
	],
};

const knownTaxonomy = buildFeedPropertyWriteData({
	context: baseContext,
	offer,
});
assert.equal(knownTaxonomy.category, "apartment");
assert.equal(knownTaxonomy.dealType, "sale");
assert.equal(knownTaxonomy.taxonomyNeedsReview, false);

const unknownTaxonomy = buildFeedPropertyWriteData({
	context: baseContext,
	offer: {
		...offer,
		category: "неизвестный объект",
		propertyType: "экспериментальный формат",
		dealType: "обмен",
	},
});
assert.equal(unknownTaxonomy.category, "apartment");
assert.equal(unknownTaxonomy.dealType, "sale");
assert.equal(unknownTaxonomy.taxonomyNeedsReview, true);

for (const taxonomyProbe of [
	{
		category: "not a house",
		propertyType: "unknown house format",
		dealType: "not for sale",
	},
	{
		category: "не квартира",
		propertyType: "неизвестный домоформат",
		dealType: "не продажа",
	},
]) {
	const normalized = buildFeedPropertyWriteData({
		context: baseContext,
		offer: { ...offer, ...taxonomyProbe },
	});
	assert.equal(normalized.taxonomyNeedsReview, true);
}

const unsupportedCurrency = await parseYrlFeed({
	stream: [
		new TextEncoder().encode(
			'<realty-feed><offer id="foreign-currency"><title>Foreign</title><price><value>1000000</value><currency>USD</currency></price></offer></realty-feed>',
		),
	],
	allowedImageHosts: new Set(),
	collectOffers: true,
	collectIssues: true,
});
const currencyRepository = createRepository();
await ingestNormalizedFeed({
	context: { ...baseContext, importRunId: "run-unsupported-currency" },
	offers: unsupportedCurrency.offers,
	issues: unsupportedCurrency.issues,
	repository: currencyRepository,
});
assert.equal(currencyRepository.byId.size, 0);
assert.equal(currencyRepository.issues.length, 1);
assert.equal(currencyRepository.issues[0].field, "currency");

const firstRun = await ingestNormalizedFeed({
	context: baseContext,
	offers: [offer],
	issues: [
		{
			severity: "warning",
			code: "feed.image_host_disallowed",
			externalId: "external-1",
			field: "images",
			messageRedacted:
				"Feed image skipped because its URL or host is not allowed.",
		},
	],
	repository,
	invalidateCache: repository.invalidateCache,
});
assert.equal(firstRun.createdCount, 1);
assert.equal(firstRun.updatedCount, 0);
assert.equal(firstRun.warningCount, 1);
assert.equal(repository.issues.length, 1);
assert.deepEqual(firstRun.invalidatedTargets, [
	{ type: "tag", tag: "properties" },
	{ type: "path", path: projectUrls.primaryCatalog, routeType: "page" },
]);
assert.equal(repository.byId.get("property-1").pricePerMeterMinor, null);

const derivedRun = await ingestNormalizedFeed({
	context: { ...baseContext, importRunId: "run-derived" },
	offers: [{ ...offer, priceMinor: 10_000_000_00, totalArea: 50 }],
	repository,
});
assert.equal(derivedRun.updatedCount, 1);
assert.equal(repository.byId.get("property-1").pricePerMeterMinor, 20_000_000);

const priceRemovedRun = await ingestNormalizedFeed({
	context: { ...baseContext, importRunId: "run-price-removed" },
	offers: [{ ...offer, priceMinor: undefined, totalArea: 50 }],
	repository,
});
assert.equal(priceRemovedRun.updatedCount, 1);
assert.equal(repository.byId.get("property-1").pricePerMeterMinor, null);

const areaRestoredRun = await ingestNormalizedFeed({
	context: { ...baseContext, importRunId: "run-area-restored" },
	offers: [{ ...offer, priceMinor: 10_000_000_00, totalArea: 50 }],
	repository,
});
assert.equal(areaRestoredRun.updatedCount, 1);
assert.equal(repository.byId.get("property-1").pricePerMeterMinor, 20_000_000);

const areaRemovedRun = await ingestNormalizedFeed({
	context: { ...baseContext, importRunId: "run-area-removed" },
	offers: [{ ...offer, priceMinor: 10_000_000_00, totalArea: undefined }],
	repository,
});
assert.equal(areaRemovedRun.updatedCount, 1);
assert.equal(repository.byId.get("property-1").pricePerMeterMinor, null);

await ingestNormalizedFeed({
	context: { ...baseContext, importRunId: "run-restore-original" },
	offers: [offer],
	repository,
});

const sameRun = await ingestNormalizedFeed({
	context: { ...baseContext, importRunId: "run-2" },
	offers: [offer],
	repository,
	invalidateCache: repository.invalidateCache,
});
assert.equal(sameRun.createdCount, 0);
assert.equal(sameRun.updatedCount, 0);
assert.equal(sameRun.skippedCount, 1);
assert.equal(
	repository.byId.get("property-1").slug,
	"feed-source-a-external-1",
);
assert.equal(repository.touched.at(-1)?.importRunId, "run-2");

repository.byId.get("property-1").manualOverrides = [{ field: "title" }];
repository.byId.get("property-1").title = "Ручной заголовок";
const manualOverrideRun = await ingestNormalizedFeed({
	context: { ...baseContext, importRunId: "run-3" },
	offers: [
		{ ...offer, title: "Новый заголовок из feed", priceMinor: 13_000_000_00 },
	],
	repository,
});
assert.equal(manualOverrideRun.updatedCount, 1);
assert.equal(repository.byId.get("property-1").title, "Ручной заголовок");
assert.equal(repository.byId.get("property-1").priceMinor, 13_000_000_00);

const sourceIsolationRun = await ingestNormalizedFeed({
	context: {
		...baseContext,
		feedSourceId: "feed-source-b",
		feedSourceCode: "source-b",
		importRunId: "run-4",
	},
	offers: [offer],
	repository,
});
assert.equal(sourceIsolationRun.createdCount, 1);
assert.equal(repository.byId.size, 2);

const otherMarket = await ingestNormalizedFeed({
	context: { ...baseContext, market: "newbuild", importRunId: "run-market" },
	offers: [offer],
	repository,
});
assert.equal(otherMarket.errorCount, 1);
assert.equal(repository.byId.get("property-1").market, "secondary");

const firstClaim = await dispatchDueFeeds({
	now: new Date("2026-09-18T06:00:00.000Z"),
	batchSize: 3,
	claimDueFeedSources: async ({ batchSize }) => {
		assert.equal(batchSize, 3);
		return [
			{
				id: "11",
				code: "a",
				market: "secondary",
				feedUrlRef: "FEED_A_URL",
				refreshIntervalMinutes: 60,
				nextDueAt: "2026-09-18T07:00:00.000Z",
				safetyThresholdPercent: 30,
				maxDeactivationsPerRun: 50,
				enabled: true,
			},
		];
	},
	createQueuedImportRun: async ({ feedSourceId }) => ({
		id: `run-${feedSourceId}`,
	}),
	enqueueImportFeed: async () => ({ id: "job-1" }),
	attachJobId: async () => undefined,
});
assert.equal(firstClaim.dispatched.length, 1);

const secondClaimer = { calls: 0 };
const concurrent = await Promise.all([
	dispatchDueFeeds({
		now: new Date("2026-09-18T06:00:00.000Z"),
		claimDueFeedSources: async () => {
			secondClaimer.calls += 1;
			return secondClaimer.calls === 1
				? [
						{
							id: "11",
							code: "a",
							market: "secondary",
							feedUrlRef: "FEED_A_URL",
							refreshIntervalMinutes: 60,
							nextDueAt: "2026-09-18T07:00:00.000Z",
							safetyThresholdPercent: 30,
							maxDeactivationsPerRun: 50,
							enabled: true,
						},
					]
				: [];
		},
		createQueuedImportRun: async ({ feedSourceId }) => ({
			id: `run-${feedSourceId}`,
		}),
		enqueueImportFeed: async () => ({ id: "job-1" }),
		attachJobId: async () => undefined,
	}),
	dispatchDueFeeds({
		now: new Date("2026-09-18T06:00:00.000Z"),
		claimDueFeedSources: async () => [],
		createQueuedImportRun: async () => ({ id: "x" }),
		enqueueImportFeed: async () => ({ id: "y" }),
		attachJobId: async () => undefined,
	}),
]);
assert.equal(
	concurrent[0].dispatched.length + concurrent[1].dispatched.length,
	1,
);

let ticks = 0;
const heartbeat = startImportHeartbeat({
	intervalMs: 20,
	tick: async () => {
		ticks += 1;
	},
});
await new Promise((resolve) => setTimeout(resolve, 60));
heartbeat.stop();
assert.ok(ticks >= 1, "heartbeat ticks must run outside ingest work");

const ingestSource = readFileSync("src/core/ingest/feed-ingest.ts", "utf8");
assert.equal(
	ingestSource.includes("startImportHeartbeat"),
	false,
	"ingest transaction/work must not own the heartbeat timer",
);
assert.equal(
	/transaction|db\.begin|payload\.db/.test(ingestSource),
	false,
	"normalized ingest must not wrap heartbeat in a DB transaction",
);
const runtimeSource = readFileSync(
	"src/core/ingest/import-feed-runtime.ts",
	"utf8",
);
assert.ok(
	runtimeSource.includes("const heartbeat = startImportHeartbeat"),
	"heartbeat must start in import runtime, outside ingestNormalizedFeed",
);
assert.ok(
	runtimeSource.indexOf("const heartbeat = startImportHeartbeat") <
		runtimeSource.indexOf("const ingest = deps.ingest"),
	"heartbeat must be scheduled before ingest work",
);
const heartbeatSource = readFileSync(
	"src/core/ingest/dispatch-due-feeds.ts",
	"utf8",
);
assert.ok(
	heartbeatSource.includes("setInterval"),
	"heartbeat must tick on an interval outside ingest work",
);

let ingestCalls = 0;
let unchangedBookkeepingCalls = 0;
let unchangedFinishCalls = 0;
let unchangedSourceContactCalls = 0;
let unchangedRepositoryCalls = 0;
const successfulTransactionHooks = (transactionId) => ({
	beginImportTransaction: async () => transactionId,
	commitImportTransaction: async () => undefined,
	rollbackImportTransaction: async () => undefined,
});
const unchanged = await runImportFeed(
	{
		now: () => new Date("2026-09-18T06:00:00.000Z"),
		heartbeatIntervalMs: 60_000,
		claimQueuedImportRun: async () => "7",
		touchHeartbeat: async () => undefined,
		loadFeedSource: async () => ({
			id: "11",
			code: "a",
			enabled: true,
			market: "secondary",
			feedUrlRef: "FEED_A_URL",
			safetyThresholdPercent: 30,
			maxDeactivationsPerRun: 50,
		}),
		resolveFeedUrl: () => "https://feeds.example.test/a.xml",
		fetchFeed: async () => ({
			status: "unchanged",
			etag: '"next"',
		}),
		createRepository: () => {
			unchangedRepositoryCalls += 1;
			return repository;
		},
		ingest: async () => {
			ingestCalls += 1;
			throw new Error("ingest must not run on 304");
		},
		recordUnchangedRun: async (input) => {
			unchangedBookkeepingCalls += 1;
			assert.equal(input.importRunId, "7");
			assert.equal(input.feedSourceId, "11");
			assert.equal(input.patch.lastEtag, '"next"');
			assert.equal(
				input.patch.lastSuccessfulRunAt,
				"2026-09-18T06:00:00.000Z",
			);
		},
		finishRun: async () => {
			unchangedFinishCalls += 1;
		},
		recordSourceContact: async () => {
			unchangedSourceContactCalls += 1;
		},
		allowedImageHosts: new Set(["img.allowed.example"]),
	},
	{ feedSourceId: "11", importRunId: "7" },
);
assert.equal(unchanged.claimed, true);
assert.equal(unchanged.status, "unchanged");
assert.equal(ingestCalls, 0);
assert.equal(unchangedBookkeepingCalls, 1);
assert.equal(unchangedFinishCalls, 0);
assert.equal(unchangedSourceContactCalls, 0);
assert.equal(unchangedRepositoryCalls, 0);

let failedUnchangedTerminalCalls = 0;
const failedUnchanged = await runImportFeed(
	{
		now: () => new Date("2026-09-18T06:00:00.000Z"),
		claimQueuedImportRun: async () => "8",
		touchHeartbeat: async () => undefined,
		loadFeedSource: async () => ({
			id: "12",
			code: "b",
			enabled: true,
			market: "secondary",
			feedUrlRef: "FEED_B_URL",
			safetyThresholdPercent: 30,
			maxDeactivationsPerRun: 50,
		}),
		resolveFeedUrl: () => "https://feeds.example.test/b.xml",
		fetchFeed: async () => ({ status: "unchanged" }),
		createRepository: () => {
			throw new Error("repository must not be created on 304");
		},
		recordUnchangedRun: async () => {
			throw new Error("atomic unchanged bookkeeping failed");
		},
		finishRun: async ({ status }) => {
			assert.equal(status, "failed");
			failedUnchangedTerminalCalls += 1;
		},
		recordSourceContact: async () => {
			throw new Error("standalone source contact must not run on 304");
		},
		allowedImageHosts: new Set(),
	},
	{ feedSourceId: "12", importRunId: "8" },
);
assert.equal(failedUnchanged.status, "failed");
assert.equal(failedUnchangedTerminalCalls, 1);

const skipped = await runImportFeed(
	{
		now: () => new Date("2026-09-18T06:00:00.000Z"),
		claimQueuedImportRun: async () => undefined,
		touchHeartbeat: async () => {
			throw new Error("heartbeat must not start if claim failed");
		},
		loadFeedSource: async () => {
			throw new Error("source must not load if claim failed");
		},
		resolveFeedUrl: () => {
			throw new Error("url must not resolve if claim failed");
		},
		fetchFeed: async () => {
			throw new Error("fetch must not run if claim failed");
		},
		createRepository: () => repository,
		recordUnchangedRun: async () => undefined,
		finishRun: async () => undefined,
		recordSourceContact: async () => undefined,
		allowedImageHosts: new Set(),
	},
	{ feedSourceId: "11", importRunId: "7" },
);
assert.equal(skipped.claimed, false);

let largestIngestBatch = 0;
let boundedIngestCalls = 0;
let baselineDeactivationCalls = 0;
let baselinePatch;
const baselineRepository = {
	...createRepository(),
	countMissingActive: async () => 7,
	deactivateMissing: async () => {
		baselineDeactivationCalls += 1;
		return 7;
	},
};
const boundedRuntime = await runImportFeed(
	{
		now: () => new Date("2026-09-18T06:00:00.000Z"),
		ingestBatchSize: 37,
		claimQueuedImportRun: async () => "bounded-run",
		touchHeartbeat: async () => undefined,
		loadFeedSource: async () => ({
			id: "bounded-source",
			code: "bounded",
			enabled: true,
			market: "secondary",
			feedUrlRef: "BOUNDED_FEED_URL",
			lastOfferCount: null,
			safetyThresholdPercent: 30,
			maxDeactivationsPerRun: 50,
		}),
		resolveFeedUrl: () => "https://feeds.example.test/bounded.xml",
		fetchFeed: async () => ({
			status: "fetched",
			body: [],
			sha256: Promise.resolve("bounded-hash"),
			cancel: async () => undefined,
		}),
		...successfulTransactionHooks("tx-bounded"),
		parseFeed: async ({ onOffer }) => {
			for (let index = 0; index < 10_001; index += 1) {
				await onOffer?.({ ...offer, externalId: `bounded-${index}` });
			}
			return {
				offers: [],
				issues: [],
				stats: {
					offersSeen: 10_001,
					maxRetainedCharsObserved: 0,
					maxBufferedOffersObserved: 1,
					parserCompleted: true,
					criticalStructuralAnomaly: false,
				},
			};
		},
		createRepository: () => baselineRepository,
		ingest: async ({ offers, issues }) => {
			boundedIngestCalls += 1;
			largestIngestBatch = Math.max(
				largestIngestBatch,
				offers.length + issues.length,
			);
			return {
				offeredCount: offers.length,
				createdCount: offers.length,
				updatedCount: 0,
				skippedCount: 0,
				warningCount: 0,
				errorCount: 0,
				invalidatedTargets: [],
			};
		},
		finishRun: async () => undefined,
		recordSourceContact: async ({ patch }) => {
			baselinePatch = patch;
		},
		allowedImageHosts: new Set(),
	},
	{ feedSourceId: "bounded-source", importRunId: "bounded-run" },
);
assert.equal(boundedRuntime.claimed, true);
assert.equal(boundedRuntime.status, "success");
assert.equal(boundedRuntime.ingest?.offeredCount, 10_001);
assert.equal(baselineDeactivationCalls, 0);
assert.equal(baselinePatch?.lastOfferCount, 10_001);
assert.ok(
	boundedIngestCalls > 1,
	"large feed must be ingested through awaited batches",
);
assert.ok(
	largestIngestBatch <= 37,
	"ingest batch must stay within its configured bound",
);
assert.ok(
	(boundedRuntime.maxBufferedOffersObserved ?? Number.POSITIVE_INFINITY) <= 37,
	"runtime must never buffer more offers than the configured batch bound",
);

let duplicateSafetyDeactivationCalls = 0;
const duplicateSafetyRuntime = await runImportFeed(
	{
		now: () => new Date("2026-09-18T06:00:00.000Z"),
		ingestBatchSize: 17,
		claimQueuedImportRun: async () => "duplicate-safety-run",
		touchHeartbeat: async () => undefined,
		loadFeedSource: async () => ({
			id: "duplicate-safety-source",
			code: "duplicate-safety",
			enabled: true,
			market: "secondary",
			feedUrlRef: "DUPLICATE_SAFETY_FEED_URL",
			lastOfferCount: 100,
			safetyThresholdPercent: 30,
			maxDeactivationsPerRun: 50,
		}),
		resolveFeedUrl: () => "https://feeds.example.test/duplicate-safety.xml",
		fetchFeed: async () => ({
			status: "fetched",
			body: [],
			sha256: Promise.resolve("duplicate-safety-hash"),
			cancel: async () => undefined,
		}),
		...successfulTransactionHooks("tx-duplicate-safety"),
		parseFeed: async ({ onOffer }) => {
			for (let index = 0; index < 50; index += 1) {
				await onOffer?.({ ...offer, externalId: `unique-${index}` });
			}
			for (let index = 0; index < 20; index += 1) {
				await onOffer?.({ ...offer, externalId: `unique-${index}` });
			}
			return {
				offers: [],
				issues: [],
				stats: {
					offersSeen: 70,
					maxRetainedCharsObserved: 0,
					maxBufferedOffersObserved: 1,
					parserCompleted: true,
					criticalStructuralAnomaly: false,
				},
			};
		},
		createRepository: () => ({
			...createRepository(),
			countMissingActive: async () => 50,
			deactivateMissing: async () => {
				duplicateSafetyDeactivationCalls += 1;
				return 50;
			},
		}),
		ingest: async ({ offers, issues }) => ({
			offeredCount: offers.length,
			createdCount: offers.length,
			updatedCount: 0,
			skippedCount: 0,
			warningCount: 0,
			errorCount: issues.length,
			invalidatedTargets: [],
		}),
		finishRun: async () => undefined,
		recordSourceContact: async () => undefined,
		allowedImageHosts: new Set(),
	},
	{
		feedSourceId: "duplicate-safety-source",
		importRunId: "duplicate-safety-run",
	},
);
assert.equal(duplicateSafetyRuntime.ingest?.offeredCount, 50);
assert.equal(duplicateSafetyRuntime.ingest?.errorCount, 20);
assert.equal(duplicateSafetyRuntime.status, "suspicious");
assert.equal(
	duplicateSafetyDeactivationCalls,
	0,
	"duplicate externalId values must not inflate deactivation safety counts",
);

let cacheWarningFinish;
let cacheWarningReported = 0;
const cacheWarningRuntime = await runImportFeed(
	{
		now: () => new Date("2026-09-18T06:00:00.000Z"),
		claimQueuedImportRun: async () => "cache-warning-run",
		touchHeartbeat: async () => undefined,
		loadFeedSource: async () => ({
			id: "cache-warning-source",
			code: "cache-warning",
			enabled: true,
			market: "secondary",
			feedUrlRef: "CACHE_WARNING_FEED_URL",
			lastOfferCount: null,
			safetyThresholdPercent: 30,
			maxDeactivationsPerRun: 50,
		}),
		resolveFeedUrl: () => "https://feeds.example.test/cache-warning.xml",
		fetchFeed: async () => ({
			status: "fetched",
			body: [],
			sha256: Promise.resolve("cache-warning-hash"),
			cancel: async () => undefined,
		}),
		...successfulTransactionHooks("tx-cache-warning"),
		parseFeed: async ({ onOffer }) => {
			await onOffer?.(offer);
			return {
				offers: [],
				issues: [],
				stats: {
					offersSeen: 1,
					maxRetainedCharsObserved: 0,
					maxBufferedOffersObserved: 1,
					parserCompleted: true,
					criticalStructuralAnomaly: false,
				},
			};
		},
		createRepository: () => createRepository(),
		ingest: async () => ({
			offeredCount: 1,
			createdCount: 1,
			updatedCount: 0,
			skippedCount: 0,
			warningCount: 0,
			errorCount: 0,
			invalidatedTargets: [{ type: "tag", tag: "properties" }],
		}),
		invalidatePublicCache: async () => ({ ok: false }),
		reportOperationalWarning: async ({ code }) => {
			assert.equal(code, "cache_invalidation_failed");
			cacheWarningReported += 1;
		},
		finishRun: async (finish) => {
			cacheWarningFinish = finish;
		},
		recordSourceContact: async () => undefined,
		allowedImageHosts: new Set(),
	},
	{ feedSourceId: "cache-warning-source", importRunId: "cache-warning-run" },
);
assert.equal(cacheWarningRuntime.status, "success");
assert.equal(cacheWarningRuntime.cacheInvalidated, false);
assert.equal(cacheWarningRuntime.ingest?.warningCount, 1);
assert.equal(cacheWarningReported, 1);
assert.equal(cacheWarningFinish?.status, "success");
assert.equal(
	cacheWarningFinish?.warningCount,
	0,
	"post-commit cache warnings must not rewrite atomic import finalization",
);

let cacheExceptionCommitted = false;
let cacheExceptionRolledBack = false;
const cacheExceptionTerminalStatuses = [];
let cacheExceptionWarningReported = false;
const cacheExceptionRuntime = await runImportFeed(
	{
		now: () => new Date("2026-09-18T06:00:00.000Z"),
		claimQueuedImportRun: async () => "cache-exception-run",
		touchHeartbeat: async () => undefined,
		loadFeedSource: async () => ({
			id: "cache-exception-source",
			code: "cache-exception",
			enabled: true,
			market: "secondary",
			feedUrlRef: "CACHE_EXCEPTION_FEED_URL",
			lastOfferCount: null,
			safetyThresholdPercent: 30,
			maxDeactivationsPerRun: 50,
		}),
		resolveFeedUrl: () => "https://feeds.example.test/cache-exception.xml",
		fetchFeed: async () => ({
			status: "fetched",
			body: [],
			sha256: Promise.resolve("cache-exception-hash"),
			cancel: async () => undefined,
		}),
		beginImportTransaction: async () => "tx-cache-exception",
		commitImportTransaction: async () => {
			cacheExceptionCommitted = true;
		},
		rollbackImportTransaction: async () => {
			cacheExceptionRolledBack = true;
		},
		createRepository: () => createRepository(),
		parseFeed: async ({ onOffer }) => {
			await onOffer?.({ ...offer, externalId: "cache-exception-offer" });
			return {
				offers: [],
				issues: [],
				stats: {
					offersSeen: 1,
					maxRetainedCharsObserved: 0,
					maxBufferedOffersObserved: 1,
					parserCompleted: true,
					criticalStructuralAnomaly: false,
				},
			};
		},
		ingest: async () => ({
			offeredCount: 1,
			createdCount: 1,
			updatedCount: 0,
			skippedCount: 0,
			warningCount: 0,
			errorCount: 0,
			invalidatedTargets: [{ type: "tag", tag: "properties" }],
		}),
		finishRun: async ({ status }) => {
			cacheExceptionTerminalStatuses.push(status);
		},
		recordSourceContact: async () => undefined,
		invalidatePublicCache: async () => {
			throw new Error("forced post-commit cache transport failure");
		},
		reportOperationalWarning: async () => {
			cacheExceptionWarningReported = true;
		},
		allowedImageHosts: new Set(),
	},
	{
		feedSourceId: "cache-exception-source",
		importRunId: "cache-exception-run",
	},
);
assert.equal(cacheExceptionRuntime.status, "success");
assert.equal(cacheExceptionRuntime.cacheInvalidated, false);
assert.equal(cacheExceptionRuntime.ingest?.warningCount, 1);
assert.equal(cacheExceptionCommitted, true);
assert.equal(cacheExceptionRolledBack, false);
assert.deepEqual(cacheExceptionTerminalStatuses, ["success"]);
assert.equal(cacheExceptionWarningReported, true);

let approvalDeactivationCalls = 0;
let approvalFinishStatus;
const approvalRepository = {
	...createRepository(),
	countMissingActive: async () => 51,
	deactivateMissing: async () => {
		approvalDeactivationCalls += 1;
		return 51;
	},
};
const rejectedApproval = await runImportFeed(
	{
		now: () => new Date("2026-09-18T06:00:00.000Z"),
		claimQueuedImportRun: async () => "approval-run",
		touchHeartbeat: async () => undefined,
		loadFeedSource: async () => ({
			id: "approval-source",
			code: "approval",
			enabled: true,
			market: "secondary",
			feedUrlRef: "APPROVAL_FEED_URL",
			lastOfferCount: 100,
			safetyThresholdPercent: 30,
			maxDeactivationsPerRun: 50,
			deactivationApproval: {
				runId: "approval-run",
				approvedAt: "2026-09-18T05:00:00.000Z",
				expiresAt: "2026-09-18T07:00:00.000Z",
			},
		}),
		resolveFeedUrl: () => "https://feeds.example.test/approval.xml",
		fetchFeed: async () => ({
			status: "fetched",
			body: [],
			sha256: Promise.resolve("approval-hash"),
			cancel: async () => undefined,
		}),
		...successfulTransactionHooks("tx-approval"),
		parseFeed: async () => ({
			offers: [],
			issues: [],
			stats: {
				offersSeen: 100,
				maxRetainedCharsObserved: 0,
				maxBufferedOffersObserved: 0,
				parserCompleted: true,
				criticalStructuralAnomaly: false,
			},
		}),
		createRepository: () => approvalRepository,
		ingest: async () => ({
			offeredCount: 100,
			createdCount: 0,
			updatedCount: 0,
			skippedCount: 100,
			warningCount: 0,
			errorCount: 0,
			invalidatedTargets: [],
		}),
		consumeDeactivationApproval: async () => false,
		finishRun: async ({ status }) => {
			approvalFinishStatus = status;
		},
		recordSourceContact: async () => undefined,
		allowedImageHosts: new Set(),
	},
	{ feedSourceId: "approval-source", importRunId: "approval-run" },
);
assert.equal(rejectedApproval.status, "suspicious");
assert.equal(approvalFinishStatus, "suspicious");
assert.equal(
	approvalDeactivationCalls,
	0,
	"failed one-time approval consumption must prevent destructive deactivation",
);

const atomicTransactionId = "tx-atomic-finalization";
const atomicEvents = [];
const committedAtomicState = {
	inventoryWrites: 0,
	deactivations: 0,
	approvalConsumed: false,
	terminalStatus: undefined,
	baseline: undefined,
};
const stagedAtomicState = {
	inventoryWrites: 0,
	deactivations: 0,
	approvalConsumed: false,
	terminalStatus: undefined,
	baseline: undefined,
};
const atomicSuccess = await runImportFeed(
	{
		now: () => new Date("2026-09-18T06:00:00.000Z"),
		claimQueuedImportRun: async () => "atomic-run",
		touchHeartbeat: async () => undefined,
		loadFeedSource: async () => ({
			id: "atomic-source",
			code: "atomic",
			enabled: true,
			market: "secondary",
			feedUrlRef: "ATOMIC_FEED_URL",
			lastOfferCount: 100,
			safetyThresholdPercent: 30,
			maxDeactivationsPerRun: 50,
			deactivationApproval: {
				runId: "atomic-run",
				approvedAt: "2026-09-18T05:00:00.000Z",
				expiresAt: "2026-09-18T07:00:00.000Z",
			},
		}),
		resolveFeedUrl: () => "https://feeds.example.test/atomic.xml",
		fetchFeed: async () => ({
			status: "fetched",
			body: [],
			etag: '"atomic-etag"',
			lastModified: "Thu, 18 Sep 2026 06:00:00 GMT",
			sha256: Promise.resolve("atomic-hash"),
			cancel: async () => undefined,
		}),
		beginImportTransaction: async () => {
			atomicEvents.push("begin");
			return atomicTransactionId;
		},
		commitImportTransaction: async (transactionId) => {
			assert.equal(transactionId, atomicTransactionId);
			atomicEvents.push("commit");
			Object.assign(committedAtomicState, stagedAtomicState);
		},
		rollbackImportTransaction: async () => {
			throw new Error("successful atomic finalization must not roll back");
		},
		createRepository: (_feedSourceId, transactionId) => {
			assert.equal(transactionId, atomicTransactionId);
			return {
				...createRepository(),
				countMissingActive: async () => 51,
				deactivateMissing: async () => {
					atomicEvents.push("deactivate");
					stagedAtomicState.deactivations = 51;
					return 51;
				},
			};
		},
		parseFeed: async ({ onOffer }) => {
			for (let index = 0; index < 100; index += 1) {
				await onOffer?.({ ...offer, externalId: `atomic-${index}` });
			}
			return {
				offers: [],
				issues: [],
				stats: {
					offersSeen: 100,
					maxRetainedCharsObserved: 0,
					maxBufferedOffersObserved: 100,
					parserCompleted: true,
					criticalStructuralAnomaly: false,
				},
			};
		},
		ingest: async ({ offers }) => {
			atomicEvents.push("inventory");
			stagedAtomicState.inventoryWrites += offers.length;
			return {
				offeredCount: offers.length,
				createdCount: offers.length,
				updatedCount: 0,
				skippedCount: 0,
				warningCount: 0,
				errorCount: 0,
				invalidatedTargets: [],
			};
		},
		consumeDeactivationApproval: async (_input, transactionId) => {
			assert.equal(transactionId, atomicTransactionId);
			atomicEvents.push("approval");
			stagedAtomicState.approvalConsumed = true;
			return true;
		},
		finishRun: async ({ status }, transactionId) => {
			assert.equal(transactionId, atomicTransactionId);
			atomicEvents.push("terminal");
			stagedAtomicState.terminalStatus = status;
		},
		recordSourceContact: async ({ patch }, transactionId) => {
			assert.equal(transactionId, atomicTransactionId);
			atomicEvents.push("baseline");
			stagedAtomicState.baseline = patch;
		},
		invalidatePublicCache: async () => {
			atomicEvents.push("cache");
			return { ok: true };
		},
		allowedImageHosts: new Set(),
	},
	{ feedSourceId: "atomic-source", importRunId: "atomic-run" },
);
assert.equal(atomicSuccess.status, "success");
assert.equal(committedAtomicState.inventoryWrites, 100);
assert.equal(committedAtomicState.deactivations, 51);
assert.equal(committedAtomicState.approvalConsumed, true);
assert.equal(committedAtomicState.terminalStatus, "success");
assert.equal(committedAtomicState.baseline?.lastOfferCount, 100);
assert.equal(committedAtomicState.baseline?.lastFeedHash, "atomic-hash");
assert.ok(atomicEvents.indexOf("terminal") < atomicEvents.indexOf("commit"));
assert.ok(atomicEvents.indexOf("baseline") < atomicEvents.indexOf("commit"));
assert.ok(atomicEvents.indexOf("commit") < atomicEvents.indexOf("cache"));

const rolledBackState = {
	deactivations: 0,
	approvalConsumed: false,
	terminalStatus: undefined,
	baseline: undefined,
};
let stagedRollbackState = { ...rolledBackState };
const atomicFailure = await runImportFeed(
	{
		now: () => new Date("2026-09-18T06:00:00.000Z"),
		claimQueuedImportRun: async () => "rollback-run",
		touchHeartbeat: async () => undefined,
		loadFeedSource: async () => ({
			id: "rollback-source",
			code: "rollback",
			enabled: true,
			market: "secondary",
			feedUrlRef: "ROLLBACK_FEED_URL",
			lastOfferCount: 1,
			safetyThresholdPercent: 100,
			maxDeactivationsPerRun: 0,
			deactivationApproval: {
				runId: "rollback-run",
				approvedAt: "2026-09-18T05:00:00.000Z",
				expiresAt: "2026-09-18T07:00:00.000Z",
			},
		}),
		resolveFeedUrl: () => "https://feeds.example.test/rollback.xml",
		fetchFeed: async () => ({
			status: "fetched",
			body: [],
			sha256: Promise.resolve("rollback-hash"),
			cancel: async () => undefined,
		}),
		beginImportTransaction: async () => "tx-rollback-finalization",
		commitImportTransaction: async () => {
			throw new Error("forced finalization failure must not commit");
		},
		rollbackImportTransaction: async () => {
			stagedRollbackState = { ...rolledBackState };
		},
		createRepository: () => ({
			...createRepository(),
			countMissingActive: async () => 1,
			deactivateMissing: async () => {
				stagedRollbackState.deactivations = 1;
				return 1;
			},
		}),
		parseFeed: async ({ onOffer }) => {
			await onOffer?.({ ...offer, externalId: "rollback-offer" });
			return {
				offers: [],
				issues: [],
				stats: {
					offersSeen: 1,
					maxRetainedCharsObserved: 0,
					maxBufferedOffersObserved: 1,
					parserCompleted: true,
					criticalStructuralAnomaly: false,
				},
			};
		},
		ingest: async ({ offers }) => ({
			offeredCount: offers.length,
			createdCount: offers.length,
			updatedCount: 0,
			skippedCount: 0,
			warningCount: 0,
			errorCount: 0,
			invalidatedTargets: [],
		}),
		consumeDeactivationApproval: async () => {
			stagedRollbackState.approvalConsumed = true;
			return true;
		},
		finishRun: async ({ status }, transactionId) => {
			if (transactionId === undefined) {
				rolledBackState.terminalStatus = status;
				return;
			}
			stagedRollbackState.terminalStatus = status;
		},
		recordSourceContact: async ({ patch }) => {
			stagedRollbackState.baseline = patch;
			throw new Error("forced baseline persistence failure");
		},
		allowedImageHosts: new Set(),
	},
	{ feedSourceId: "rollback-source", importRunId: "rollback-run" },
);
assert.equal(atomicFailure.status, "failed");
assert.equal(rolledBackState.deactivations, 0);
assert.equal(rolledBackState.approvalConsumed, false);
assert.equal(rolledBackState.baseline, undefined);
assert.equal(rolledBackState.terminalStatus, "failed");

const { chunkCacheTargets, postBatchedHttpRevalidate } = await import(
	"../src/core/cache/http-revalidate.ts"
);
const { executeInternalRevalidation } = await import(
	"../src/core/cache/internal-route-executor.ts"
);
let unauthorizedInvalidation = false;
const unauthorized = await executeInternalRevalidation({
	expectedSecret: "expected-secret",
	providedSecret: "wrong-secret",
	body: { targets: [{ type: "tag", tag: "properties" }] },
	invalidate: async () => {
		unauthorizedInvalidation = true;
	},
});
assert.equal(unauthorized.status, 404);
assert.equal(unauthorizedInvalidation, false);
assert.equal(
	chunkCacheTargets(new Array(33).fill({ type: "tag", tag: "properties" }))
		.length,
	2,
);
let postedBodies = 0;
const httpOk = await postBatchedHttpRevalidate({
	baseUrl: "https://start-baza.ams24.ru",
	secret: "fixture-secret",
	targets: [
		{ type: "tag", tag: "properties" },
		{ type: "path", path: projectUrls.primaryCatalog, routeType: "page" },
	],
	fetchImpl: async (_url, init) => {
		postedBodies += 1;
		const body = JSON.parse(String(init.body));
		assert.equal(body.targets.length, 2);
		return new Response(JSON.stringify({ revalidated: true, count: 2 }), {
			status: 200,
		});
	},
});
assert.equal(httpOk.ok, true);
assert.equal(postedBodies, 1);
const httpFail = await postBatchedHttpRevalidate({
	baseUrl: "https://start-baza.ams24.ru",
	secret: "fixture-secret",
	targets: [{ type: "tag", tag: "properties" }],
	fetchImpl: async () => new Response("no", { status: 500 }),
});
assert.equal(httpFail.ok, false);
assert.equal(httpFail.warning, true);

assert.equal(
	isEnabledFeedDue({
		enabled: true,
		nextDueAt: null,
		nowIso: "2026-09-18T06:00:00.000Z",
	}),
	true,
);
const nullDueDispatch = await dispatchDueFeeds({
	now: new Date("2026-09-18T06:00:00.000Z"),
	claimDueFeedSources: async () =>
		isEnabledFeedDue({
			enabled: true,
			nextDueAt: null,
			nowIso: "2026-09-18T06:00:00.000Z",
		})
			? [
					{
						id: "null-due",
						code: "n",
						market: "secondary",
						feedUrlRef: "FEED_N_URL",
						refreshIntervalMinutes: 60,
						nextDueAt: "2026-09-18T06:00:00.000Z",
						safetyThresholdPercent: 30,
						maxDeactivationsPerRun: 50,
						enabled: true,
					},
				]
			: [],
	createQueuedImportRun: async ({ feedSourceId }) => ({
		id: `run-${feedSourceId}`,
	}),
	enqueueImportFeed: async () => ({ id: "job-null" }),
	attachJobId: async () => undefined,
});
assert.equal(nullDueDispatch.dispatched.length, 1);

let disabledFetchCalls = 0;
const disabledRuntime = await runImportFeed(
	{
		now: () => new Date("2026-09-18T06:00:00.000Z"),
		claimQueuedImportRun: async () => "disabled-run",
		touchHeartbeat: async () => undefined,
		loadFeedSource: async () => ({
			id: "disabled-source",
			code: "disabled",
			enabled: false,
			market: "secondary",
			feedUrlRef: "DISABLED_FEED_URL",
			lastOfferCount: null,
			safetyThresholdPercent: 30,
			maxDeactivationsPerRun: 50,
		}),
		resolveFeedUrl: () => "https://feeds.example.test/disabled.xml",
		fetchFeed: async () => {
			disabledFetchCalls += 1;
			throw new Error("disabled source must not fetch");
		},
		createRepository: () => createRepository(),
		finishRun: async ({ status }) => assert.equal(status, "failed"),
		recordSourceContact: async () => undefined,
		allowedImageHosts: new Set(),
	},
	{ feedSourceId: "disabled-source", importRunId: "disabled-run" },
);
assert.equal(disabledRuntime.status, "failed");
assert.equal(disabledFetchCalls, 0);

let rejectedFailureTransitionCalls = 0;
const rejectedFailureTransition = await runImportFeed(
	{
		now: () => new Date("2026-09-18T06:00:00.000Z"),
		claimQueuedImportRun: async () => "rejected-failure-transition-run",
		touchHeartbeat: async () => undefined,
		loadFeedSource: async () => ({
			id: "rejected-failure-transition-source",
			code: "rejected-failure-transition",
			enabled: false,
			market: "secondary",
			feedUrlRef: "REJECTED_FAILURE_TRANSITION_URL",
			safetyThresholdPercent: 30,
			maxDeactivationsPerRun: 50,
		}),
		resolveFeedUrl: () => "https://feeds.example.test/rejected.xml",
		fetchFeed: async () => {
			throw new Error("disabled source must not fetch");
		},
		createRepository: () => createRepository(),
		finishRun: async ({ status }) => {
			assert.equal(status, "failed");
			rejectedFailureTransitionCalls += 1;
			throw new Error("running-to-failed guard rejected the transition");
		},
		recordSourceContact: async () => undefined,
		allowedImageHosts: new Set(),
	},
	{
		feedSourceId: "rejected-failure-transition-source",
		importRunId: "rejected-failure-transition-run",
	},
);
assert.equal(rejectedFailureTransition.status, "failed");
assert.equal(rejectedFailureTransitionCalls, 1);

for (const transactionPreflightCase of [
	{
		name: "missing hooks",
		hooks: {},
	},
	{
		name: "invalid transaction ID",
		hooks: {
			beginImportTransaction: async () => "",
			commitImportTransaction: async () => undefined,
			rollbackImportTransaction: async () => undefined,
		},
	},
	{
		name: "missing commit hook",
		hooks: {
			beginImportTransaction: async () => "must-not-start",
			rollbackImportTransaction: async () => undefined,
		},
	},
	{
		name: "missing rollback hook",
		hooks: {
			beginImportTransaction: async () => "must-not-start",
			commitImportTransaction: async () => undefined,
		},
	},
]) {
	let repositoryCreations = 0;
	let inventoryWrites = 0;
	const result = await runImportFeed(
		{
			now: () => new Date("2026-09-18T06:00:00.000Z"),
			claimQueuedImportRun: async () => `preflight-${transactionPreflightCase.name}`,
			touchHeartbeat: async () => undefined,
			loadFeedSource: async () => ({
				id: "preflight-source",
				code: "preflight",
				enabled: true,
				market: "secondary",
				feedUrlRef: "PREFLIGHT_FEED_URL",
				lastOfferCount: null,
				safetyThresholdPercent: 30,
				maxDeactivationsPerRun: 50,
			}),
			resolveFeedUrl: () => "https://feeds.example.test/preflight.xml",
			fetchFeed: async () => ({
				status: "fetched",
				body: [],
				sha256: Promise.resolve("preflight-hash"),
				cancel: async () => undefined,
			}),
			...transactionPreflightCase.hooks,
			createRepository: () => {
				repositoryCreations += 1;
				return createRepository();
			},
			parseFeed: async ({ onOffer }) => {
				await onOffer?.(offer);
				return {
					offers: [],
					issues: [],
					stats: {
						offersSeen: 1,
						maxRetainedCharsObserved: 0,
						maxBufferedOffersObserved: 1,
						parserCompleted: true,
						criticalStructuralAnomaly: false,
					},
				};
			},
			ingest: async () => {
				inventoryWrites += 1;
				return emptyIngestResultForRuntimeTest();
			},
			finishRun: async ({ status }) => assert.equal(status, "failed"),
			recordSourceContact: async () => undefined,
			allowedImageHosts: new Set(),
		},
		{
			feedSourceId: "preflight-source",
			importRunId: `preflight-${transactionPreflightCase.name}`,
		},
	);
	assert.equal(result.status, "failed", transactionPreflightCase.name);
	assert.equal(repositoryCreations, 0, transactionPreflightCase.name);
	assert.equal(inventoryWrites, 0, transactionPreflightCase.name);
}

let transactionWrites = 0;
let transactionCommitted = false;
let transactionRolledBack = false;
let failedFeedCancelled = false;
const budgetedRuntime = await runImportFeed(
	{
		now: () => new Date("2026-09-18T06:00:00.000Z"),
		ingestBatchSize: 1,
		maxTotalOffers: 1,
		maxTotalIssues: 2,
		maxDatabaseWorkUnits: 4,
		maxImportDurationMs: 1_000,
		monotonicNow: () => 100,
		claimQueuedImportRun: async () => "budget-run",
		touchHeartbeat: async () => undefined,
		loadFeedSource: async () => ({
			id: "budget-source",
			code: "budget",
			enabled: true,
			market: "secondary",
			feedUrlRef: "BUDGET_FEED_URL",
			lastOfferCount: null,
			safetyThresholdPercent: 30,
			maxDeactivationsPerRun: 50,
		}),
		resolveFeedUrl: () => "https://feeds.example.test/budget.xml",
		fetchFeed: async () => ({
			status: "fetched",
			body: [],
			sha256: Promise.resolve("budget-hash"),
			cancel: async () => {
				failedFeedCancelled = true;
			},
		}),
		beginImportTransaction: async () => "tx-budget",
		commitImportTransaction: async () => {
			transactionCommitted = true;
		},
		rollbackImportTransaction: async () => {
			transactionRolledBack = true;
			transactionWrites = 0;
		},
		createRepository: (_feedSourceId, transactionId) => {
			assert.equal(transactionId, "tx-budget");
			return createRepository();
		},
		parseFeed: async ({ onOffer }) => {
			await onOffer?.({ ...offer, externalId: "budget-1" });
			await onOffer?.({ ...offer, externalId: "budget-2" });
			throw new Error("budget must stop before this point");
		},
		ingest: async ({ offers }) => {
			transactionWrites += offers.length;
			return {
				offeredCount: offers.length,
				createdCount: offers.length,
				updatedCount: 0,
				skippedCount: 0,
				warningCount: 0,
				errorCount: 0,
				invalidatedTargets: [],
			};
		},
		finishRun: async ({ status }) => assert.equal(status, "failed"),
		recordSourceContact: async () => undefined,
		allowedImageHosts: new Set(),
	},
	{ feedSourceId: "budget-source", importRunId: "budget-run" },
);
assert.equal(budgetedRuntime.status, "failed");
assert.equal(transactionWrites, 0, "failed import writes must be rolled back");
assert.equal(transactionCommitted, false);
assert.equal(transactionRolledBack, true);
assert.equal(failedFeedCancelled, true);

let duplicateBudgetRolledBack = false;
let duplicateIssuesPersisted = 0;
const duplicateBudgetRuntime = await runImportFeed(
	{
		now: () => new Date("2026-09-18T06:00:00.000Z"),
		ingestBatchSize: 10,
		maxTotalOffers: 10,
		maxTotalIssues: 1,
		maxDatabaseWorkUnits: 100,
		maxImportDurationMs: 1_000,
		monotonicNow: () => 100,
		claimQueuedImportRun: async () => "duplicate-budget-run",
		touchHeartbeat: async () => undefined,
		loadFeedSource: async () => ({
			id: "duplicate-budget-source",
			code: "duplicate-budget",
			enabled: true,
			market: "secondary",
			feedUrlRef: "DUPLICATE_BUDGET_FEED_URL",
			lastOfferCount: null,
			safetyThresholdPercent: 30,
			maxDeactivationsPerRun: 50,
		}),
		resolveFeedUrl: () => "https://feeds.example.test/duplicates.xml",
		fetchFeed: async () => ({
			status: "fetched",
			body: [],
			sha256: Promise.resolve("duplicate-budget-hash"),
			cancel: async () => undefined,
		}),
		beginImportTransaction: async () => "tx-duplicate-budget",
		commitImportTransaction: async () => {
			throw new Error("duplicate issue budget must not commit");
		},
		rollbackImportTransaction: async () => {
			duplicateBudgetRolledBack = true;
			duplicateIssuesPersisted = 0;
		},
		createRepository: () => createRepository(),
		parseFeed: async ({ onOffer }) => {
			await onOffer?.({ ...offer, externalId: "duplicate-budget-id" });
			await onOffer?.({ ...offer, externalId: "duplicate-budget-id" });
			await onOffer?.({ ...offer, externalId: "duplicate-budget-id" });
			throw new Error("duplicate issue budget must stop before this point");
		},
		ingest: async ({ issues }) => {
			duplicateIssuesPersisted += issues.length;
			return {
				offeredCount: 0,
				createdCount: 0,
				updatedCount: 0,
				skippedCount: 0,
				warningCount: 0,
				errorCount: issues.length,
				invalidatedTargets: [],
			};
		},
		finishRun: async ({ status }) => assert.equal(status, "failed"),
		recordSourceContact: async () => undefined,
		allowedImageHosts: new Set(),
	},
	{
		feedSourceId: "duplicate-budget-source",
		importRunId: "duplicate-budget-run",
	},
);
assert.equal(duplicateBudgetRuntime.status, "failed");
assert.equal(duplicateBudgetRolledBack, true);
assert.equal(duplicateIssuesPersisted, 0);

const importRuntime = readFileSync(
	"src/core/ingest/import-feed-runtime.ts",
	"utf8",
);
const ownerFeed = readFileSync(
	"src/core/ingest/owner-feed-operations.ts",
	"utf8",
);
assert.ok(
	importRuntime.includes(
		"safetyThresholdPercent: source.safetyThresholdPercent",
	),
	"import runtime must use source safetyThresholdPercent",
);
assert.ok(
	importRuntime.includes(
		"maxDeactivationsPerRun: source.maxDeactivationsPerRun",
	),
	"import runtime must use source maxDeactivationsPerRun",
);
assert.equal(
	ownerFeed.includes("safetyThresholdPercent: 0"),
	false,
	"manual import must not bypass safety knobs",
);
assert.ok(
	ownerFeed.includes('task: "importFeed"'),
	"manual import must enqueue the same importFeed job",
);
assert.ok(
	importRuntime.includes("beginImportTransaction") &&
		importRuntime.includes("rollbackImportTransaction"),
	"import runtime must expose an all-or-nothing transaction boundary",
);

console.log("verify-feed-ingest: ok");

function createRepository() {
	const byId = new Map();
	const issues = [];
	const cacheInvalidations = [];
	const touched = [];
	const deactivated = [];

	return {
		byId,
		issues,
		cacheInvalidations,
		touched,
		deactivated,
		async findFeedProperty({ feedSourceId, externalId }) {
			return [...byId.values()].find(
				(record) =>
					record.feedSource === feedSourceId &&
					record.externalId === externalId,
			);
		},
		async createFeedProperty(data) {
			const record = {
				...data,
				id: `property-${byId.size + 1}`,
				slug: data.slug,
				manualOverrides: [],
			};
			byId.set(record.id, record);
			return record;
		},
		async updateFeedProperty(id, data) {
			const existing = byId.get(id);
			if (data.feedSource && data.feedSource !== existing.feedSource) {
				throw new Error("Feed ingest repository is source-scoped.");
			}
			const next = { ...existing, ...data };
			byId.set(id, next);
			return next;
		},
		async createImportIssue(issue) {
			issues.push(issue);
		},
		async touchLastSeenAt(input) {
			touched.push(input);
			for (const record of byId.values()) {
				if (
					record.feedSource === input.feedSourceId &&
					input.externalIds.includes(record.externalId)
				) {
					record.lastSeenAt = input.nowIso;
					record.lastImportRun = input.importRunId;
				}
			}
		},
		async countMissingActive({ feedSourceId, seenBeforeIso }) {
			return [...byId.values()].filter(
				(record) =>
					record.feedSource === feedSourceId &&
					record.status === "active" &&
					(!record.lastSeenAt || record.lastSeenAt < seenBeforeIso),
			).length;
		},
		async deactivateMissing({
			feedSourceId,
			importRunId,
			seenBeforeIso,
			nowIso,
		}) {
			let count = 0;
			for (const record of byId.values()) {
				if (
					record.feedSource === feedSourceId &&
					record.status === "active" &&
					(!record.lastSeenAt || record.lastSeenAt < seenBeforeIso)
				) {
					record.status = "archived";
					record.deactivatedAt = nowIso;
					record.deactivatedByRun = importRunId;
					count += 1;
				}
			}
			deactivated.push({ feedSourceId, importRunId, count });
			return count;
		},
		async invalidateCache(targets) {
			cacheInvalidations.push(targets);
		},
	};
}

function emptyIngestResultForRuntimeTest() {
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
