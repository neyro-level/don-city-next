import { getPublicLogicalSitemapEntries } from "@/core/data-access/public";
import { absoluteUrl } from "@/core/seo/site";
import { createSitemapShardResponse } from "@/core/seo/sitemap-http";
import { projectSitemapDescriptors } from "@/project/sitemap";

export const dynamic = "force-dynamic";

export async function GET(
	_request: Request,
	context: { params: Promise<{ id: string[] }> },
) {
	const { id } = await context.params;
	return createSitemapShardResponse({
		id: id.length === 1 ? (id[0] ?? "") : "",
		descriptors: projectSitemapDescriptors,
		loadEntries: getPublicLogicalSitemapEntries,
		absoluteUrl,
	});
}
