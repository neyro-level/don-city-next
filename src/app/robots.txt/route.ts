import { getSiteUrl } from "@/core/seo/site";
import {
	buildRobotsText,
	getProjectIndexingPolicy,
} from "@/project/indexing-policy";

export const dynamic = "force-dynamic";

export function GET() {
	return new Response(
		buildRobotsText(getProjectIndexingPolicy(), getSiteUrl()),
		{
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Cache-Control": "private, no-store",
			},
		},
	);
}
