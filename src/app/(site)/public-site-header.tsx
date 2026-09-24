"use client";

import type { SiteHeaderDTO } from "@ams/realtbase-contracts";
import { StarterSiteHeader } from "@ams/realtbase-ui";
import { usePathname } from "next/navigation";

function canonicalPath(pathname: string) {
	if (pathname === "/") return pathname;
	return `${pathname.replace(/\/+$/, "")}/`;
}

export function PublicSiteHeader({ header }: { header: SiteHeaderDTO }) {
	return (
		<StarterSiteHeader
			header={header}
			activePath={canonicalPath(usePathname())}
		/>
	);
}
