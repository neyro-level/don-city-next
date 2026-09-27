const contentAddressedMediaName =
	/(?:^|-)[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}(?:-[a-z0-9-]+-\d+w)?\.[a-z0-9]+$/i;

export const immutableMediaCacheControl = "public, max-age=31536000, immutable";

export function cacheControlForMediaPath(pathname: string): string | null {
	if (!pathname.startsWith("/api/media/file/")) return null;
	const encodedName = pathname.slice("/api/media/file/".length);
	if (!encodedName || encodedName.includes("/")) return null;
	let filename: string;
	try {
		filename = decodeURIComponent(encodedName);
	} catch {
		return null;
	}
	return contentAddressedMediaName.test(filename)
		? immutableMediaCacheControl
		: null;
}
