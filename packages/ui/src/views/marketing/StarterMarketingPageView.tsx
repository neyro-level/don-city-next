import type { MarketingPageDTO } from "@ams/realtbase-contracts";
import { Button } from "../../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import { Container, Section } from "../../components/ui/layout";
import { LeadFormView } from "../starter/LeadFormView";
import {
	getMarketingCompositionKind,
	getMarketingConversionCopy,
	type MarketingCompositionKind,
} from "./marketing-page-contract";

function Breadcrumbs({ items }: MarketingPageDTO["breadcrumbs"]) {
	return (
		<nav
			aria-label="Хлебные крошки"
			className="mb-6 flex flex-wrap gap-2 text-caption text-content-default"
		>
			{items.map((item, index) => (
				<span key={`${item.href ?? "current"}-${item.label}`}>
					{index ? <span aria-hidden> / </span> : null}
					{item.href ? (
						<a href={item.href} className="hover:text-action-primary">
							{item.label}
						</a>
					) : (
						item.label
					)}
				</span>
			))}
		</nav>
	);
}

type MarketingSection = MarketingPageDTO["sections"][number];

function SectionCard({
	section,
	className,
}: {
	section: MarketingSection;
	className?: string;
}) {
	return (
		<Card elevation="raised" className={className}>
			<CardHeader>
				<CardTitle as="h2">{section.title}</CardTitle>
				<CardDescription>{section.text}</CardDescription>
			</CardHeader>
			{section.items?.length ? (
				<CardContent>
					<ul className="grid gap-2 text-body text-content-default">
						{section.items.map((item) => (
							<li key={item}>— {item}</li>
						))}
					</ul>
				</CardContent>
			) : null}
		</Card>
	);
}

function MarketingSections({
	sections,
	kind,
}: {
	sections: MarketingPageDTO["sections"];
	kind: MarketingCompositionKind;
}) {
	if (kind === "sell-process") {
		return (
			<ol
				data-marketing-composition={kind}
				className="grid gap-5 lg:grid-cols-3"
			>
				{sections.map((section, index) => (
					<li key={section.title} className="grid gap-3">
						<p className="text-label font-bold uppercase tracking-wide-role text-action-primary">
							Шаг {index + 1}
						</p>
						<SectionCard section={section} className="h-full" />
					</li>
				))}
			</ol>
		);
	}

	if (kind === "legal-services") {
		return (
			<div
				data-marketing-composition={kind}
				className="grid gap-6 md:grid-cols-2"
			>
				{sections.map((section) => (
					<article key={section.title} className="md:last:col-span-2">
						<SectionCard section={section} className="h-full" />
					</article>
				))}
			</div>
		);
	}

	if (kind === "about-trust") {
		return (
			<div
				data-marketing-composition={kind}
				className="grid gap-6 md:grid-cols-2"
			>
				{sections.map((section, index) => (
					<article
						key={section.title}
						className={index === 0 ? "md:col-span-2" : undefined}
					>
						<SectionCard section={section} className="h-full" />
					</article>
				))}
			</div>
		);
	}

	if (kind === "contacts-access") {
		return (
			<div
				data-marketing-composition={kind}
				className="grid gap-6 sm:grid-cols-2"
			>
				{sections.map((section, index) => (
					<article key={section.title}>
						<Card elevation="raised" className="h-full">
							<CardHeader>
								<CardTitle as="h2">{section.title}</CardTitle>
								{index === 0 ? (
									<address className="text-body leading-step-copy text-content-default not-italic">
										{section.text}
									</address>
								) : (
									<CardDescription>{section.text}</CardDescription>
								)}
							</CardHeader>
						</Card>
					</article>
				))}
			</div>
		);
	}

	return (
		<div
			data-marketing-composition={kind}
			className="grid gap-6 md:grid-cols-2"
		>
			{sections.map((section) => (
				<SectionCard key={section.title} section={section} />
			))}
		</div>
	);
}

export function MarketingPageView({ page }: { page: MarketingPageDTO }) {
	const compositionKind = getMarketingCompositionKind(page.slug);
	const conversionCopy = getMarketingConversionCopy(compositionKind);
	return (
		<>
			<Section
				space="hero"
				className="border-b border-border bg-surface-raised"
			>
				<Container size="narrow">
					<Breadcrumbs items={page.breadcrumbs.items} />
					<p className="text-label font-bold uppercase tracking-wide-role text-action-primary">
						{page.eyebrow}
					</p>
					<h1 className="mt-4 text-h1 font-extrabold leading-display-tight tracking-display">
						{page.title}
					</h1>
					<p className="mt-5 max-w-[var(--container-copy-measure)] text-body-lg leading-step-relaxed text-content-default">
						{page.lead}
					</p>
				</Container>
			</Section>
			<Section>
				<Container size="narrow">
					<MarketingSections sections={page.sections} kind={compositionKind} />
					{page.leadContext ? (
						<div className="mt-8">
							<LeadFormView
								context={page.leadContext}
								title={conversionCopy.title}
								description={conversionCopy.description}
								submitLabel={conversionCopy.submitLabel}
							/>
						</div>
					) : null}
					{page.primaryAction ? (
						<div className="mt-8">
							<Button asChild>
								<a href={page.primaryAction.href}>{page.primaryAction.label}</a>
							</Button>
						</div>
					) : null}
				</Container>
			</Section>
		</>
	);
}
