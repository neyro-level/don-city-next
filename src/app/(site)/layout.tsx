import { StarterSiteFooter } from "@ams/realtbase-ui/starter/site-shell";
import type { ReactNode } from "react";
import { getPublicShell } from "@/core/data-access/public";
import { PublicSiteHeader } from "./public-site-header";

export const revalidate = 3600;

export default async function PublicSiteLayout({
	children,
}: {
	children: ReactNode;
}) {
	const shell = await getPublicShell();
	return (
		<div className="min-h-screen bg-surface-page text-content-strong">
			<a
				href="#main-content"
				className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-[var(--control-radius)] bg-action-primary px-4 py-3 font-semibold text-content-inverse shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus-visible:ring-[length:var(--focus-ring-width)] focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
			>
				Перейти к содержимому
			</a>
			<PublicSiteHeader header={shell.header} />
			<main id="main-content" tabIndex={-1}>
				{children}
			</main>
			<StarterSiteFooter footer={shell.footer} />
		</div>
	);
}
