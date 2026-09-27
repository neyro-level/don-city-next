import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
	galleryKeyDelta,
	nextGalleryIndex,
} from "../packages/ui/src/views/property/media-lightbox-contract.ts";

const read = (path: string) => readFileSync(path, "utf8");
const lightbox = read("packages/ui/src/views/property/MediaLightbox.tsx");
const gallery = read("packages/ui/src/views/property/MediaGallery.tsx");
const uiPackage = read("packages/ui/package.json");
const lockfile = read("pnpm-lock.yaml");
const styles = read("packages/ui/src/styles.css");
const globals = read("src/app/globals.css");

for (const source of [lightbox, uiPackage, lockfile, styles]) {
	assert.doesNotMatch(source, /yet-another-react-lightbox/);
}
assert.match(lightbox, /from "\.\.\/\.\.\/components\/ui\/dialog"/);
assert.match(lightbox, /from "\.\.\/\.\.\/components\/ui\/button"/);
assert.match(lightbox, /onCloseAutoFocus/);
assert.match(lightbox, /document\.fullscreenEnabled/);
assert.match(lightbox, /requestFullscreen/);
assert.match(lightbox, /duration-\[var\(--motion-duration-fast\)\]/);
assert.match(globals, /prefers-reduced-motion:\s*reduce/);
assert.match(gallery, /onExited=\{\(\) => openerRef\.current\?\.focus\(\)\}/);

for (const label of [
	"Предыдущее фото",
	"Следующее фото",
	"Увеличить фото",
	"На весь экран",
	"Миниатюры фотографий",
]) {
	assert.ok(lightbox.includes(label), `missing labelled interaction: ${label}`);
}

assert.equal(galleryKeyDelta("ArrowLeft"), -1);
assert.equal(galleryKeyDelta("ArrowRight"), 1);
assert.equal(galleryKeyDelta("Escape"), 0, "Radix Dialog owns Escape close");
assert.equal(nextGalleryIndex(0, -1, 3), 2);
assert.equal(nextGalleryIndex(2, 1, 3), 0);
assert.equal(nextGalleryIndex(0, 1, 1), 0);

console.log(
	"verify:media-lightbox: ok (Dialog/Button, keyboard, focus, reduced motion)",
);
