import type { MetadataRoute } from "next";
import { getPublicLogicalSitemapEntries } from "@/core/data-access/public";
import { absoluteUrl } from "@/core/seo/site";
import {
	projectRegistrySitemapEntries,
	projectSitemapDescriptors,
} from "@/project/sitemap";

export const revalidate = 3600;

function toSitemapEntries(
	entries: readonly {
		path: string;
		lastModified?: string | Date | null;
		changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
		priority?: number;
		indexable: boolean;
	}[],
): MetadataRoute.Sitemap {
	return entries
		.filter((entry) => entry.indexable)
		.map((entry) => ({
			url: absoluteUrl(entry.path),
			lastModified: entry.lastModified
				? new Date(entry.lastModified)
				: undefined,
			changeFrequency: entry.changeFrequency,
			priority: entry.priority,
		}));
}

export async function generateSitemaps() {
	return projectSitemapDescriptors.map(({ id }) => ({ id }));
}

export default async function sitemap(props: {
	id: Promise<string> | string;
}): Promise<MetadataRoute.Sitemap> {
	const rawId = typeof props.id === "string" ? props.id : await props.id;
	const descriptor = projectSitemapDescriptors.find(
		({ id }) => String(id) === rawId,
	);
	if (!descriptor) return [];

	try {
		return toSitemapEntries(
			await getPublicLogicalSitemapEntries(descriptor.owner),
		);
	} catch {
		if (descriptor.owner !== "static") return [];
		return toSitemapEntries(projectRegistrySitemapEntries("static"));
	}
}
