"use client";

import {
	ChevronLeft,
	ChevronRight,
	Maximize2,
	Minimize2,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "../../components/ui/dialog";
import {
	galleryKeyDelta,
	nextGalleryIndex,
} from "./media-lightbox-contract";
import type { MediaGalleryImage } from "./media-gallery.types";

export function MediaLightbox({
	open,
	index,
	slides,
	hasMany,
	onClose,
	onView,
	onExited,
}: {
	open: boolean;
	index: number;
	slides: MediaGalleryImage[];
	hasMany: boolean;
	onClose: () => void;
	onView: (index: number) => void;
	onExited: () => void;
}) {
	const frameRef = useRef<HTMLDivElement>(null);
	const [zoomed, setZoomed] = useState(false);
	const [fullscreenAvailable, setFullscreenAvailable] = useState(false);
	const [fullscreen, setFullscreen] = useState(false);
	const activeSlide = slides[index];

	useEffect(() => {
		setFullscreenAvailable(Boolean(document.fullscreenEnabled));
		const syncFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
		document.addEventListener("fullscreenchange", syncFullscreen);
		return () => document.removeEventListener("fullscreenchange", syncFullscreen);
	}, []);

	const move = (delta: -1 | 1) => {
		if (!hasMany) return;
		setZoomed(false);
		onView(nextGalleryIndex(index, delta, slides.length));
	};

	const toggleFullscreen = async () => {
		if (!fullscreenAvailable || !frameRef.current) return;
		if (document.fullscreenElement) await document.exitFullscreen();
		else await frameRef.current.requestFullscreen();
	};

	return (
		<Dialog
			open={open}
				onOpenChange={(nextOpen) => {
				if (nextOpen) return;
				setZoomed(false);
				if (document.fullscreenElement) void document.exitFullscreen();
				onClose();
			}}
		>
			<DialogContent
				className="left-0 top-0 h-dvh w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-surface-inverse p-0 text-content-inverse shadow-none md:p-0"
				overlayClassName="bg-surface-inverse/92 backdrop-blur-md"
				onCloseAutoFocus={(event) => {
					event.preventDefault();
					onExited();
				}}
				onKeyDown={(event) => {
					const delta = galleryKeyDelta(event.key);
					if (!delta) return;
					event.preventDefault();
					move(delta);
				}}
			>
				<DialogTitle className="sr-only">Просмотр фотографий объекта</DialogTitle>
				<DialogDescription className="sr-only">
					Используйте стрелки влево и вправо для переключения фотографий,
					Escape — для закрытия.
				</DialogDescription>

				<div ref={frameRef} className="grid h-full min-h-0 grid-rows-[auto_1fr_auto] bg-surface-inverse">
					<div className="flex min-h-control-lg items-center justify-between gap-3 px-4 pr-16 text-label sm:px-6 sm:pr-20">
						<p aria-live="polite" className="font-semibold tabular-nums">
							{index + 1} / {slides.length}
						</p>
						<div className="flex items-center gap-2">
							<Button
								type="button"
								variant="plain"
								className="inline-flex size-10 items-center justify-center rounded-lg bg-surface-raised/12 transition-colors duration-200 ease-in-out hover:bg-surface-raised/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
								onClick={() => setZoomed((value) => !value)}
								aria-label={zoomed ? "Уменьшить фото" : "Увеличить фото"}
								aria-pressed={zoomed}
							>
								{zoomed ? <ZoomOut aria-hidden /> : <ZoomIn aria-hidden />}
							</Button>
							{fullscreenAvailable ? (
								<Button
									type="button"
									variant="plain"
									className="inline-flex size-10 items-center justify-center rounded-lg bg-surface-raised/12 transition-colors duration-200 ease-in-out hover:bg-surface-raised/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
									onClick={() => void toggleFullscreen()}
									aria-label={fullscreen ? "Выйти из полноэкранного режима" : "На весь экран"}
								>
									{fullscreen ? <Minimize2 aria-hidden /> : <Maximize2 aria-hidden />}
								</Button>
							) : null}
						</div>
					</div>

					<div className="relative grid min-h-0 place-items-center overflow-hidden px-14 py-4 sm:px-20">
						{activeSlide ? (
							<button
								type="button"
								className="grid h-full w-full cursor-zoom-in place-items-center overflow-auto rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
								onClick={() => setZoomed((value) => !value)}
								aria-label={zoomed ? "Уменьшить фото" : "Увеличить фото"}
							>
								<img
									src={activeSlide.src}
									srcSet={activeSlide.browserSrcSet}
									alt={activeSlide.alt}
									className={`max-h-full max-w-full object-contain transition-transform duration-200 ease-in-out ${zoomed ? "scale-150 cursor-zoom-out" : "scale-100"}`}
								/>
							</button>
						) : null}

						{hasMany ? (
							<>
								<Button
									type="button"
									variant="plain"
									className="absolute left-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-lg bg-surface-raised/12 transition-colors duration-200 ease-in-out hover:bg-surface-raised/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary sm:left-5"
									onClick={() => move(-1)}
									aria-label="Предыдущее фото"
								>
									<ChevronLeft aria-hidden />
								</Button>
								<Button
									type="button"
									variant="plain"
									className="absolute right-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-lg bg-surface-raised/12 transition-colors duration-200 ease-in-out hover:bg-surface-raised/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary sm:right-5"
									onClick={() => move(1)}
									aria-label="Следующее фото"
								>
									<ChevronRight aria-hidden />
								</Button>
							</>
						) : null}
					</div>

					{hasMany ? (
						<fieldset className="m-0 flex min-h-20 gap-2 overflow-x-auto border-0 px-4 py-3 sm:px-6">
							<legend className="sr-only">Миниатюры фотографий</legend>
							{slides.map((slide, slideIndex) => (
								<Button
									key={slide.src}
									type="button"
									variant="plain"
									className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary ${slideIndex === index ? "border-action-primary" : "border-transparent"}`}
									onClick={() => {
										setZoomed(false);
										onView(slideIndex);
									}}
									aria-label={`Показать фото ${slideIndex + 1}`}
									aria-current={slideIndex === index ? "true" : undefined}
								>
									<img src={slide.src} alt="" className="h-full w-full object-cover" />
								</Button>
							))}
						</fieldset>
					) : (
						<div />
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
