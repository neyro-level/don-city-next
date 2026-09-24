import {
	generateResolvedRouteMetadata,
	ResolvedPublicRoutePage,
} from "../public-route";

const segments = ["soglasie-na-obrabotku-personalnyh-dannyh"] as const;

export const revalidate = 3600;

export function generateMetadata() {
	return generateResolvedRouteMetadata(segments);
}
export default function Page() {
	return <ResolvedPublicRoutePage segments={segments} />;
}
