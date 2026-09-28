import type { Payload, PayloadRequest } from "payload";
import { relationId } from "../../project/geo/constraints.ts";
import { resolveFeedGeo } from "../../project/geo/feed-match.ts";
import { internalAccessMode } from "../access/internal-modes.ts";
import type {
	FeedImportIssueDraft,
	FeedIngestRepository,
	FeedPropertyRecord,
	FeedPropertyWriteData,
} from "./feed-ingest.ts";

function redactIssueMessage(message: string): string {
	return message
		.replace(/<[^>]{0,400}>/g, "[redacted]")
		.replace(/https?:\/\/[^\s]+/gi, "[redacted-url]")
		.slice(0, 400);
}

function asRecord(value: unknown): FeedPropertyRecord {
	const row = value as FeedPropertyRecord & {
		regionRaw?: string | null;
		cityRaw?: string | null;
		districtRaw?: string | null;
	};
	return {
		...row,
		id: String(row.id),
		feedSource: String(relationId(row.feedSource) ?? ""),
		lastImportRun: String(relationId(row.lastImportRun) ?? ""),
		slug: String(row.slug),
		region: row.regionRaw ?? undefined,
		locality: row.cityRaw ?? undefined,
		district: row.districtRaw ?? undefined,
	};
}

async function toPropertyData(payload: Payload, data: FeedPropertyWriteData) {
	const geo = await resolveFeedGeo(payload, data);
	return {
		origin: "feed" as const,
		feedSource: Number(data.feedSource),
		externalId: data.externalId,
		importHash: data.importHash,
		firstSeenAt: data.firstSeenAt,
		lastSeenAt: data.lastSeenAt,
		lastImportRun: Number(data.lastImportRun),
		status: data.status,
		market: data.market,
		category: data.category,
		dealType: data.dealType,
		houseType: data.houseType,
		priceMinor: data.priceMinor,
		currency: data.currency,
		publicAddress: data.publicAddress,
		region: geo.region,
		city: geo.city,
		district: geo.district,
		regionRaw: geo.regionRaw,
		cityRaw: geo.cityRaw,
		districtRaw: geo.districtRaw,
		needsReview:
			geo.needsReview ||
			Boolean(data.landAreaNeedsReview) ||
			Boolean(data.taxonomyNeedsReview),
		street: data.street,
		house: data.house,
		lat: data.lat,
		lng: data.lng,
		rooms: data.rooms,
		totalArea: data.totalArea,
		livingArea: data.livingArea,
		kitchenArea: data.kitchenArea,
		plotAreaSotka: data.plotAreaSotka,
		landAreaNeedsReview: data.landAreaNeedsReview,
		landCategory: data.landCategory,
		permittedUse: data.permittedUse,
		communications: data.communications,
		floor: data.floor,
		floors: data.floors,
		pricePerMeterMinor: data.pricePerMeterMinor,
		externalComplexId: data.externalComplexId,
		externalComplexName: data.externalComplexName,
		externalBuildingId: data.externalBuildingId,
		externalLayoutId: data.externalLayoutId,
		title: data.title,
		description: data.description,
		images: data.images,
		slug: data.slug ?? "",
	};
}

export function createPayloadFeedIngestRepository(
	payload: Payload,
	feedSourceId: string,
	transactionId?: string | number,
): FeedIngestRepository {
	const importAccess = internalAccessMode("ingest", transactionId);
	const req = importAccess.req
		? ({
				...importAccess.req,
				payload,
				user: null,
			} as unknown as PayloadRequest)
		: undefined;
	return {
		async findFeedProperty({ feedSourceId: sourceId, externalId }) {
			if (sourceId !== feedSourceId) {
				throw new Error("Feed ingest repository is source-scoped.");
			}
			const found = await payload.find({
				collection: "properties",
				where: {
					and: [
						{ feedSource: { equals: Number(sourceId) } },
						{ externalId: { equals: externalId } },
						{ origin: { equals: "feed" } },
					],
				},
				limit: 1,
				depth: 0,
				req,
				overrideAccess: importAccess.overrideAccess,
				context: importAccess.context,
			});
			const doc = found.docs[0];
			return doc ? asRecord(doc) : undefined;
		},
		async createFeedProperty(data: FeedPropertyWriteData) {
			if (data.feedSource !== feedSourceId) {
				throw new Error("Feed ingest repository is source-scoped.");
			}
			const created = await payload.create({
				collection: "properties",
				draft: false,
				data: await toPropertyData(payload, data),
				req,
				overrideAccess: importAccess.overrideAccess,
				context: importAccess.context,
			});
			return asRecord(created);
		},
		async updateFeedProperty(id, data) {
			const found = await payload.find({
				collection: "properties",
				where: {
					and: [
						{ id: { equals: Number(id) } },
						{ feedSource: { equals: Number(feedSourceId) } },
						{ origin: { equals: "feed" } },
					],
				},
				limit: 1,
				depth: 0,
				req,
				overrideAccess: importAccess.overrideAccess,
				context: importAccess.context,
			});
			if (!found.docs[0]) {
				throw new Error("Feed ingest repository is source-scoped.");
			}
			if (data.market && data.market !== found.docs[0].market) {
				throw new Error(
					"Feed ingest cannot write a property outside source market.",
				);
			}
			const patch: Record<string, unknown> = { ...data };
			if (
				"region" in data ||
				"locality" in data ||
				"district" in data ||
				"landAreaNeedsReview" in data ||
				"taxonomyNeedsReview" in data
			) {
				const geo = await resolveFeedGeo(payload, {
					region: data.region ?? found.docs[0].regionRaw ?? undefined,
					locality: data.locality ?? found.docs[0].cityRaw ?? undefined,
					district: data.district ?? found.docs[0].districtRaw ?? undefined,
				});
				Object.assign(patch, geo);
				patch.needsReview =
					geo.needsReview ||
					Boolean(
						data.landAreaNeedsReview ?? found.docs[0].landAreaNeedsReview,
					) ||
					Boolean(data.taxonomyNeedsReview);
			}
			delete patch.taxonomyNeedsReview;
			delete patch.locality;
			delete patch.feedSource;
			delete patch.lastImportRun;
			delete patch.origin;
			if (data.lastImportRun) {
				patch.lastImportRun = Number(data.lastImportRun);
			}
			const updated = await payload.update({
				collection: "properties",
				id,
				draft: false,
				data: patch,
				req,
				overrideAccess: importAccess.overrideAccess,
				context: importAccess.context,
			});
			return asRecord(updated);
		},
		async createImportIssue(issue: FeedImportIssueDraft) {
			if (issue.feedSource !== feedSourceId) {
				throw new Error("Feed ingest repository is source-scoped.");
			}
			await payload.create({
				collection: "import-issues",
				data: {
					feedSource: Number(issue.feedSource),
					importRun: Number(issue.importRun),
					severity: issue.severity,
					code: issue.code,
					externalId: issue.externalId,
					field: issue.field,
					messageRedacted: redactIssueMessage(issue.messageRedacted),
				},
				req,
				overrideAccess: importAccess.overrideAccess,
				context: importAccess.context,
			});
		},
		async touchLastSeenAt({
			feedSourceId: sourceId,
			importRunId,
			externalIds,
			nowIso,
		}) {
			if (sourceId !== feedSourceId) {
				throw new Error("Feed ingest repository is source-scoped.");
			}
			if (externalIds.length === 0) return;
			await payload.update({
				collection: "properties",
				where: {
					and: [
						{ origin: { equals: "feed" } },
						{ feedSource: { equals: Number(sourceId) } },
						{ externalId: { in: externalIds } },
					],
				},
				data: {
					lastSeenAt: nowIso,
					lastImportRun: Number(importRunId),
				},
				req,
				overrideAccess: importAccess.overrideAccess,
				context: importAccess.context,
			});
		},
		async countMissingActive({ feedSourceId: sourceId, seenBeforeIso }) {
			if (sourceId !== feedSourceId) {
				throw new Error("Feed ingest repository is source-scoped.");
			}
			const result = await payload.count({
				collection: "properties",
				where: {
					and: [
						{ origin: { equals: "feed" } },
						{ feedSource: { equals: Number(sourceId) } },
						{ status: { equals: "active" } },
						{
							or: [
								{ lastSeenAt: { exists: false } },
								{ lastSeenAt: { less_than: seenBeforeIso } },
							],
						},
					],
				},
				req,
				overrideAccess: importAccess.overrideAccess,
				context: importAccess.context,
			});
			return result.totalDocs;
		},
		async deactivateMissing({
			feedSourceId: sourceId,
			importRunId,
			seenBeforeIso,
			nowIso,
		}) {
			if (sourceId !== feedSourceId) {
				throw new Error("Feed ingest repository is source-scoped.");
			}
			const result = await payload.update({
				collection: "properties",
				where: {
					and: [
						{ origin: { equals: "feed" } },
						{ feedSource: { equals: Number(sourceId) } },
						{ status: { equals: "active" } },
						{
							or: [
								{ lastSeenAt: { exists: false } },
								{ lastSeenAt: { less_than: seenBeforeIso } },
							],
						},
					],
				},
				data: {
					status: "archived",
					deactivatedAt: nowIso,
					deactivatedByRun: Number(importRunId),
				},
				req,
				overrideAccess: importAccess.overrideAccess,
				context: importAccess.context,
			});
			return result.docs.length;
		},
	};
}
