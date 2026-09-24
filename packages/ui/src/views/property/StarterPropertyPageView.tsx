import type {
	BreadcrumbItemDTO,
	MarketingPageDTO,
	PropertyDetailsDTO,
} from "@ams/realtbase-contracts";
import { Button } from "../../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "../../components/ui/card";
import { Container, Section, SectionHeader } from "../../components/ui/layout";
import { LeadFormView } from "../starter/LeadFormView";
import { StarterPropertyCard } from "./StarterPropertyCardView";
import { StarterPropertyMediaGallery } from "./StarterPropertyMediaGallery";

export function PropertyPageView({
	property,
	leadContext,
	breadcrumbs = [],
	contextLinks = [],
}: {
	property: PropertyDetailsDTO;
	leadContext: MarketingPageDTO["leadContext"];
	breadcrumbs?: readonly BreadcrumbItemDTO[];
	contextLinks?: readonly { href: string; label: string }[];
}) {
	return (
		<>
			<section id="section-property-gallery">
				<Section space="hero">
					<Container>
						<nav
							aria-label="Хлебные крошки"
							className="mb-6 text-caption text-content-default"
						>
							{breadcrumbs.map((item, index) => (
								<span key={`${item.href ?? "current"}-${item.label}`}>
									{index ? <span aria-hidden> / </span> : null}
									{item.href ? (
										<a href={item.href}>{item.label}</a>
									) : (
										item.label
									)}
								</span>
							))}
						</nav>
						<div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
							<div>
								<div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] bg-surface-subtle">
									<StarterPropertyMediaGallery
										images={
											property.gallery.length
												? property.gallery
												: property.primaryMedia
													? [property.primaryMedia]
													: []
										}
										title={property.title}
									/>
								</div>
								<section id="section-property-summary">
									<h1 className="mt-8 text-display-small font-extrabold leading-heading">
										{property.title}
									</h1>
									<p className="mt-2 text-body-large text-content-default">
										{property.address}
									</p>
								</section>
								<section id="section-property-characteristics">
									<dl className="mt-8 grid gap-4 sm:grid-cols-2">
										{property.characteristics.map((item) => (
											<div
												key={item.label}
												className="border-b border-border pb-3"
											>
												<dt className="text-label text-content-default">
													{item.label}
												</dt>
												<dd className="mt-1 font-semibold">{item.value}</dd>
											</div>
										))}
									</dl>
								</section>
								<section id="section-property-description">
									<p className="mt-8 text-body-large text-content-default">
										{property.description}
									</p>
								</section>
							</div>
							<aside id="section-property-actions">
								<Card elevation="raised" className="sticky top-32">
									<CardHeader>
										<h2 className="text-display-small font-semibold leading-tight-copy">
											{property.price?.label ?? "Цена по запросу"}
										</h2>
										<CardDescription>{property.address}</CardDescription>
									</CardHeader>
									<CardContent>
										<Button asChild className="w-full">
											<a href="#lead-form">Записаться на просмотр</a>
										</Button>
									</CardContent>
								</Card>
							</aside>
						</div>
					</Container>
				</Section>
			</section>
			{contextLinks.length ? (
				<section
					id="section-property-context"
					className="border-y border-border bg-surface-raised"
				>
					<Container className="flex flex-wrap gap-3 py-5">
						{contextLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="rounded-md bg-surface-subtle px-3 py-2 text-label font-semibold hover:text-action-primary"
							>
								{link.label}
							</a>
						))}
					</Container>
				</section>
			) : null}
			<section id="section-property-related" className="bg-surface-subtle">
				<Section>
					<Container>
						<SectionHeader title="Похожие объекты" />
						{property.related.length ? (
							<div className="mt-8 grid gap-6 md:grid-cols-2">
								{property.related.map((item) => (
									<StarterPropertyCard key={item.id} property={item} />
								))}
							</div>
						) : (
							<p className="mt-8 text-body-large text-content-default">
								Похожие объекты появятся, когда в каталоге будет достаточно
								опубликованных предложений.
							</p>
						)}
					</Container>
				</Section>
			</section>
			<section id="section-property-lead">
				<Section>
					<Container size="narrow">
						{leadContext ? (
							<LeadFormView
								context={leadContext}
								title="Записаться на просмотр"
								submitLabel="Отправить заявку"
							/>
						) : null}
					</Container>
				</Section>
			</section>
		</>
	);
}
