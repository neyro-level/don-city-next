import {
	generateResolvedRouteMetadata,
	ResolvedPublicRoutePage,
} from "../public-route";

export const dynamic = "force-dynamic";

type CatchAllProps = { params: Promise<{ segments: string[] }> };

export async function generateMetadata({ params }: CatchAllProps) {
	const { segments } = await params;
	return generateResolvedRouteMetadata(segments);
}

export default async function PublicCatchAllPage({ params }: CatchAllProps) {
	const { segments } = await params;
	return <ResolvedPublicRoutePage segments={segments} />;
}
