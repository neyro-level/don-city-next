import { createSiteSeo, type PublicUrlEntry } from "../../platform/seo/site.ts";
import { siteConfig } from "../../project/site.config.ts";
import { projectSitemapEntries } from "../../project/sitemap.ts";

export type { PublicUrlEntry } from "../../platform/seo/site.ts";

const siteSeo = createSiteSeo(siteConfig);

export const siteBrandName = siteSeo.siteBrandName;
export const getSiteUrl = siteSeo.getSiteUrl;
export const absoluteUrl = siteSeo.absoluteUrl;

export const staticPublicUrlEntries: readonly PublicUrlEntry[] =
	projectSitemapEntries;
