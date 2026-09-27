"use client";

import { useEffect } from "react";

export default function GlobalRouteError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Public route boundary", {
			name: error.name,
			digest: error.digest,
		});
	}, [error]);

	return (
		<section
			aria-labelledby="route-error-title"
			className="mx-auto grid min-h-[60vh] max-w-3xl place-content-center gap-5 px-5 py-section-lg text-center"
		>
			<p className="text-overline font-bold uppercase tracking-overline text-content-default">
				Ошибка загрузки
			</p>
			<h1 id="route-error-title" className="text-section font-bold">
				Страница временно недоступна
			</h1>
			<p className="text-body-large leading-body text-content-default">
				Повторите попытку. Если ошибка сохранится, вернитесь на главную
				страницу.
			</p>
			<div className="flex flex-wrap justify-center gap-3">
				<button
					type="button"
					onClick={reset}
					className="min-h-control-md rounded-control bg-action-primary px-control-md font-semibold text-content-inverse hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
				>
					Повторить
				</button>
				<a
					href="/"
					className="min-h-control-md rounded-control border border-border px-control-md py-2.5 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
				>
					На главную
				</a>
			</div>
		</section>
	);
}
