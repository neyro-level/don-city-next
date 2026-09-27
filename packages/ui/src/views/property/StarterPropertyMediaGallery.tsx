"use client";

import { PublicFeedImage } from "../../lib/starter-image";
import { MediaFallback } from "../starter/MediaFallback";
import { MediaGallery } from "./MediaGallery";

type PublicPropertyMediaGalleryProps = {
	images: ReadonlyArray<{
		src: string;
		alt?: string | null;
		variants?: readonly { src: string; width: number }[];
	}>;
	title: string;
};

export function PublicPropertyMediaGallery({
	images,
	title,
}: PublicPropertyMediaGalleryProps) {
	return (
		<MediaGallery
			images={images.map((image) => ({
				src: image.src,
				alt: image.alt || title,
				browserSrcSet: image.variants
					?.map((variant) => `${variant.src} ${variant.width}w`)
					.join(", "),
			}))}
			imageRenderer={PublicFeedImage}
			imageSizes="(min-width: 1024px) 62vw, 100vw"
			priority
			shouldOptimizeImage={(src) =>
				src.startsWith("/") && !src.startsWith("//")
			}
			emptyContent={<MediaFallback className="absolute inset-0 min-h-full" />}
		/>
	);
}

/** @deprecated Use PublicPropertyMediaGallery. */
export const StarterPropertyMediaGallery = PublicPropertyMediaGallery;
