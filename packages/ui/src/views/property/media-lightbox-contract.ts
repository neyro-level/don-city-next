export function galleryKeyDelta(key: string): -1 | 0 | 1 {
	if (key === "ArrowLeft") return -1;
	if (key === "ArrowRight") return 1;
	return 0;
}

export function nextGalleryIndex(
	current: number,
	delta: -1 | 1,
	length: number,
) {
	if (length <= 1) return 0;
	return (current + delta + length) % length;
}
