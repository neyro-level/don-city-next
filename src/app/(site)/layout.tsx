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
			<PublicSiteHeader header={shell.header} />
			<main>{children}</main>
			<StarterSiteFooter footer={shell.footer} />
		</div>
	);
}
