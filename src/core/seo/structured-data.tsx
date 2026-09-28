import { serializeJsonLdSafely } from "./json-ld.ts";

type JsonLd = Record<string, unknown>;

export {
	buildBreadcrumbJsonLd,
	buildCatalogItemListJsonLd,
	buildLawyerServiceJsonLd,
	buildOrganizationJsonLd,
	buildPropertyJsonLd,
	buildWebsiteJsonLd,
} from "./structured-data-builders.ts";

export function JsonLdScript({ data }: { data: JsonLd }) {
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: the canonical serializer escapes HTML-significant code points.
			dangerouslySetInnerHTML={{ __html: serializeJsonLdSafely(data) }}
		/>
	);
}
