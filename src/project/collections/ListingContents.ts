import type { CollectionConfig } from "payload";
import { isDeepStrictEqual } from "node:util";
import {
	adminsAndOwners,
	hasRole,
	ownersOnly,
} from "../../core/access/roles.ts";
import { publicListingContentReadAccess } from "../../core/data-access/public/access-mode.ts";
import { invalidateProjectPublicCache } from "../cache-invalidation.ts";
import { publicCacheTags } from "../cache-tags.ts";
import { buildListingContentQueue } from "../listing-content-queue.ts";
import { seoRegistry } from "../seo-registry.generated.ts";

const listingRegistryOptions = buildListingContentQueue(seoRegistry).map(
	(entry) => ({
		label: `${entry.h1} (${entry.registryId})`,
		value: entry.registryId,
	}),
);

function validCheckedAt(value: unknown): boolean {
	return (
		typeof value === "string" && Number.isFinite(new Date(value).valueOf())
	);
}

export const ListingContents: CollectionConfig = {
	slug: "listing-contents",
	admin: {
		group: "SEO",
		useAsTitle: "registryId",
		defaultColumns: ["registryId", "status", "approvedAt", "updatedAt"],
	},
	access: {
		create: adminsAndOwners,
		read: publicListingContentReadAccess,
		update: adminsAndOwners,
		delete: ownersOnly,
	},
	hooks: {
		beforeChange: [
			async ({ data, originalDoc, req }) => {
				const systemOperation = (
					req.context as { systemGatewayOperation?: string } | undefined
				)?.systemGatewayOperation;
				const inventoryStateFields = new Set([
					"inventorySnapshot",
					"inventoryEvaluatedAt",
					"lastThresholdPassedAt",
					"updatedAt",
				]);
				const inventoryStateWrite =
					systemOperation === "system-job" &&
					originalDoc != null &&
					Object.entries(data).every(
						([key, value]) =>
							inventoryStateFields.has(key) ||
							isDeepStrictEqual(
								value,
								(originalDoc as Record<string, unknown>)[key],
							),
					);
				if (inventoryStateWrite) return data;
				const nextStatus = data.status ?? originalDoc?.status ?? "draft";
				const touchesApprovedContent =
					nextStatus === "approved" || originalDoc?.status === "approved";
				if (touchesApprovedContent && !hasRole(req.user, ["owner"])) {
					throw new Error(
						"Only an owner can approve or edit approved listing content.",
					);
				}
				if (nextStatus !== "approved") return data;

				const introduction = String(
					data.introduction ?? originalDoc?.introduction ?? "",
				).trim();
				if (introduction.length < 600) {
					throw new Error(
						"Approved listing introduction must contain at least 600 characters.",
					);
				}
				const duplicate = await req.payload.find({
					collection: "listing-contents",
					where: { introduction: { equals: introduction } },
					limit: 2,
					depth: 0,
					req,
					overrideAccess: false,
				});
				if (
					duplicate.docs.some(
						(content) => String(content.id) !== String(originalDoc?.id ?? ""),
					)
				) {
					throw new Error(
						"Approved listing introduction must be unique to this registry page.",
					);
				}
				const facts = (data.contextFacts ??
					originalDoc?.contextFacts ??
					[]) as {
					source?: unknown;
					checkedAt?: unknown;
				}[];
				if (
					facts.some(
						(fact) =>
							typeof fact.source !== "string" ||
							!fact.source.trim() ||
							!validCheckedAt(fact.checkedAt),
					)
				) {
					throw new Error(
						"Every listing context fact requires source and checkedAt.",
					);
				}
				data.approvedAt = new Date().toISOString();
				data.approvedBy = req.user?.id;
				return data;
			},
		],
		afterChange: [
			async ({ doc }) => {
				await invalidateProjectPublicCache(
					[
						{ type: "tag", tag: publicCacheTags.site },
						{ type: "tag", tag: publicCacheTags.properties },
					],
					"listing_content_changed",
				);
				return doc;
			},
		],
		afterDelete: [
			async ({ doc }) => {
				await invalidateProjectPublicCache(
					[
						{ type: "tag", tag: publicCacheTags.site },
						{ type: "tag", tag: publicCacheTags.properties },
					],
					"listing_content_deleted",
				);
				return doc;
			},
		],
	},
	fields: [
		{
			name: "registryId",
			type: "select",
			required: true,
			unique: true,
			index: true,
			options: listingRegistryOptions,
		},
		{
			name: "status",
			type: "select",
			required: true,
			defaultValue: "draft",
			index: true,
			options: [
				{ label: "Draft", value: "draft" },
				{ label: "Owner approved", value: "approved" },
			],
		},
		{
			name: "introduction",
			type: "textarea",
			required: true,
			admin: {
				description:
					"Unique page-specific introduction. Approval requires at least 600 characters.",
			},
		},
		{
			name: "contextFacts",
			type: "array",
			fields: [
				{ name: "source", type: "text", required: true },
				{ name: "checkedAt", type: "date", required: true },
			],
		},
		{ name: "approvedAt", type: "date", admin: { readOnly: true } },
		{
			name: "inventorySnapshot",
			type: "number",
			min: 0,
			admin: { readOnly: true },
		},
		{
			name: "inventoryEvaluatedAt",
			type: "date",
			admin: { readOnly: true },
		},
		{
			name: "lastThresholdPassedAt",
			type: "date",
			admin: { readOnly: true },
		},
		{
			name: "approvedBy",
			type: "relationship",
			relationTo: "users",
			admin: { readOnly: true },
		},
	],
};
