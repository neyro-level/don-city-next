"use client";

import type { SiteHeaderDTO } from "@ams/realtbase-contracts";
import { PublicSiteHeaderView } from "@ams/realtbase-ui/public/site-shell";
import { usePathname } from "next/navigation";

function canonicalPath(pathname: string) {
	if (pathname === "/") return pathname;
	return `${pathname.replace(/\/+$/, "")}/`;
}

export function PublicSiteHeader({ header }: { header: SiteHeaderDTO }) {
	return (
		<PublicSiteHeaderView
			header={header}
			activePath={canonicalPath(usePathname())}
		/>
	);
}
