import { getPublicLogicalSitemapEntries } from "@/core/data-access/public";
import { absoluteUrl } from "@/core/seo/site";
import { createSitemapIndexResponse } from "@/core/seo/sitemap-http";
import {
	projectSitemapDescriptors,
	projectSitemapPath,
} from "@/project/sitemap";

export const dynamic = "force-dynamic";

export async function GET() {
	return createSitemapIndexResponse({
		descriptors: projectSitemapDescriptors,
		loadEntries: getPublicLogicalSitemapEntries,
		absoluteShardUrl: (id) => absoluteUrl(projectSitemapPath(id)),
	});
}
