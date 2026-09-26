import type { PublicUrlEntry } from "./site.ts";
import {
	renderSitemapIndex,
	renderUrlSet,
	sitemapUnavailableResponse,
	sitemapXmlHeaders,
} from "./sitemap-xml.ts";

export type SitemapDescriptor<Owner> = { id: number; owner: Owner };

export async function createSitemapIndexResponse<Owner>(input: {
	descriptors: readonly SitemapDescriptor<Owner>[];
	loadEntries: (owner: Owner) => Promise<readonly PublicUrlEntry[]>;
	absoluteShardUrl: (id: number) => string;
}): Promise<Response> {
	try {
		const shards = await Promise.all(
			input.descriptors.map(async (descriptor) => ({
				descriptor,
				entries: await input.loadEntries(descriptor.owner),
			})),
		);
		const urls = shards
			.filter(({ entries }) => entries.some((entry) => entry.indexable))
			.map(({ descriptor }) => input.absoluteShardUrl(descriptor.id));
		return new Response(renderSitemapIndex(urls), {
			status: 200,
			headers: sitemapXmlHeaders,
		});
	} catch {
		return sitemapUnavailableResponse();
	}
}

export async function createSitemapShardResponse<Owner>(input: {
	id: string;
	descriptors: readonly SitemapDescriptor<Owner>[];
	loadEntries: (owner: Owner) => Promise<readonly PublicUrlEntry[]>;
	absoluteUrl: (path: string) => string;
}): Promise<Response> {
	const match = /^(\d+)\.xml$/.exec(input.id);
	const descriptor = match
		? input.descriptors.find((candidate) => String(candidate.id) === match[1])
		: undefined;
	if (!descriptor) {
		return new Response("Not Found", {
			status: 404,
			headers: { "Cache-Control": "private, no-store" },
		});
	}

	try {
		const entries = (await input.loadEntries(descriptor.owner)).filter(
			(entry) => entry.indexable,
		);
		if (!entries.length) {
			return new Response("Not Found", {
				status: 404,
				headers: { "Cache-Control": "private, no-store" },
			});
		}
		return new Response(
			renderUrlSet(
				entries.map((entry) => ({
					...entry,
					path: input.absoluteUrl(entry.path),
				})),
			),
			{ status: 200, headers: sitemapXmlHeaders },
		);
	} catch {
		return sitemapUnavailableResponse();
	}
}
