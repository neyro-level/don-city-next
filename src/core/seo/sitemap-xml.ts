import type { PublicUrlEntry } from "./site.ts";

function escapeXml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

export function renderSitemapIndex(urls: readonly string[]): string {
	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...urls.map((url) => `<sitemap><loc>${escapeXml(url)}</loc></sitemap>`),
		"</sitemapindex>",
	].join("");
}

export function renderUrlSet(entries: readonly PublicUrlEntry[]): string {
	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...entries.map((entry) => {
			const fields = [`<loc>${escapeXml(entry.path)}</loc>`];
			if (entry.lastModified) {
				fields.push(
					`<lastmod>${escapeXml(new Date(entry.lastModified).toISOString())}</lastmod>`,
				);
			}
			if (entry.changeFrequency) {
				fields.push(`<changefreq>${entry.changeFrequency}</changefreq>`);
			}
			if (entry.priority !== undefined) {
				fields.push(`<priority>${entry.priority}</priority>`);
			}
			return `<url>${fields.join("")}</url>`;
		}),
		"</urlset>",
	].join("");
}

export const sitemapXmlHeaders = {
	"Content-Type": "application/xml; charset=utf-8",
	"Cache-Control": "private, no-store",
} as const;

export function sitemapUnavailableResponse(): Response {
	return new Response("Sitemap source unavailable", {
		status: 503,
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "private, no-store",
			"Retry-After": "300",
		},
	});
}
