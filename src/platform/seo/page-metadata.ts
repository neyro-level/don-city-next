import type { PageSEOContract } from "@ams/realtbase-contracts";
import type { Metadata } from "next";

type MetadataContext = {
	absoluteUrl: (path: string) => string;
	brandName: string;
	locale: string;
};

export function toMetadata(
	seo: PageSEOContract,
	context?: MetadataContext,
): Metadata {
	const title = seo.openGraph?.title ?? seo.title;
	const description = seo.openGraph?.description ?? seo.description;
	const canonicalUrl = context?.absoluteUrl(seo.canonicalPath);
	const image = seo.openGraph?.image;
	const images =
		context && image
			? [
					{
						url: context.absoluteUrl(image.src),
						alt: image.alt,
						...(image.width ? { width: image.width } : {}),
						...(image.height ? { height: image.height } : {}),
					},
				]
			: undefined;
	return {
		title: seo.title,
		description: seo.description,
		alternates: { canonical: seo.canonicalPath },
		robots: {
			index: seo.indexing === "index",
			follow: seo.following === "follow",
		},
		openGraph: context
			? {
					title,
					description,
					url: canonicalUrl,
					type: "website",
					locale: context.locale.replace("-", "_"),
					siteName: context.brandName,
					images,
				}
			: seo.openGraph
				? { title, description }
				: undefined,
		twitter: context
			? {
					card: images ? "summary_large_image" : "summary",
					title,
					description,
					images: images?.map(({ url, alt }) => ({ url, alt })),
				}
			: undefined,
	};
}
