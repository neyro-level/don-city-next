import { buildRegistrySitemapEntries } from "../platform/sitemap/registry.ts";
import { seoRegistry } from "./seo-registry.generated.ts";
import { buildProjectUrl, parseProjectUrl } from "./url-grammar.ts";

// Reviewed registry content revision. It is deliberately not request time.
export const registryContentUpdatedAt = "2026-09-24T00:00:00.000Z";

export const projectSitemapEntries = buildRegistrySitemapEntries(seoRegistry, {
	contentUpdatedAt: registryContentUpdatedAt,
	isCanonicalPath(path) {
		const key = parseProjectUrl(path);
		return key !== null && buildProjectUrl(key) === path;
	},
});
