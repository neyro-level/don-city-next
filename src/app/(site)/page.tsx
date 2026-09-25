import {
	HomeFeaturedSection,
	HomeHeroSection,
	HomeLeadSection,
	HomeProcessSection,
	HomeServicesSection,
	HomeTrustSection,
} from "@ams/realtbase-ui";
import { toMetadata } from "@/core/seo/page-metadata";
import {
	getCachedPublicHomePage,
	getCachedPublicNap,
} from "@/core/data-access/public/cached-provider";
import {
	buildOrganizationJsonLd,
	buildWebsiteJsonLd,
	JsonLdScript,
} from "@/core/seo/structured-data";

export const revalidate = 3600;

export async function generateMetadata() {
	const home = await getCachedPublicHomePage();
	return toMetadata(home.page.seo);
}

export default async function HomePage() {
	const [home, nap] = await Promise.all([
		getCachedPublicHomePage(),
		getCachedPublicNap(),
	]);
	return (
		<>
			<JsonLdScript data={buildOrganizationJsonLd(nap)} />
			<JsonLdScript data={buildWebsiteJsonLd(home.page)} />
			<HomeHeroSection page={home.page} featured={home.featured} />
			<HomeServicesSection page={home.page} />
			<HomeFeaturedSection featured={home.featured} />
			<HomeProcessSection page={home.page} />
			<HomeTrustSection />
			<HomeLeadSection page={home.page} />
		</>
	);
}
