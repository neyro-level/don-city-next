import {
	generateResolvedRouteMetadata,
	ResolvedPublicRoutePage,
} from "../public-route";

export const dynamic = "force-dynamic";

type CatchAllProps = {
	params: Promise<{ segments: string[] }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
	params,
	searchParams,
}: CatchAllProps) {
	const [{ segments }, query] = await Promise.all([params, searchParams]);
	return generateResolvedRouteMetadata(segments, query);
}

export default async function PublicCatchAllPage({
	params,
	searchParams,
}: CatchAllProps) {
	const [{ segments }, query] = await Promise.all([params, searchParams]);
	return <ResolvedPublicRoutePage segments={segments} searchParams={query} />;
}
