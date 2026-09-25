import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/core/seo/site";
import {
	buildRobots,
	getProjectIndexingPolicy,
} from "@/project/indexing-policy";
import { projectSitemapPaths } from "@/project/sitemap";

export default function robots(): MetadataRoute.Robots {
	return buildRobots(
		getProjectIndexingPolicy(),
		getSiteUrl(),
		projectSitemapPaths,
	);
}
