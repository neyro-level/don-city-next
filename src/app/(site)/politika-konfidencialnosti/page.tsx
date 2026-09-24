import {
	generateResolvedRouteMetadata,
	ResolvedPublicRoutePage,
} from "../public-route";

const segments = ["politika-konfidencialnosti"] as const;

export const revalidate = 3600;

export function generateMetadata() {
	return generateResolvedRouteMetadata(segments);
}
export default function Page() {
	return <ResolvedPublicRoutePage segments={segments} />;
}
