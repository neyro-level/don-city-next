import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { getSiteUrl } from "@/core/seo/site";
import { siteConfig } from "@/project/site.config";
import { ProjectAnalyticsBoundary } from "@/project/analytics-boundary";

import "./globals.css";

const manrope = Manrope({
	display: "swap",
	subsets: ["cyrillic", "latin"],
	variable: "--font-manrope",
});

export const metadata: Metadata = {
	metadataBase: new URL(getSiteUrl()),
	title: siteConfig.defaultTitle,
	description: siteConfig.defaultDescription,
	// Robots are route-owned. A root robots value survives Next.js notFound()
	// merging and would conflict with the framework's automatic noindex tag.
	icons: { icon: "/icon.png", apple: "/apple-icon.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang={siteConfig.locale}>
			<body className={manrope.variable}>
				<ProjectAnalyticsBoundary>{children}</ProjectAnalyticsBoundary>
			</body>
		</html>
	);
}
