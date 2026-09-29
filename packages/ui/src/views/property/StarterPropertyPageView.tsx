import type {
	BreadcrumbItemDTO,
	MarketingPageDTO,
	PropertyDetailsDTO,
	PublicPageIdentityDTO,
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
import { PublicPropertyCard } from "./StarterPropertyCardView";
import { PublicPropertyMediaGallery } from "./StarterPropertyMediaGallery";

export function PropertyPageView({
	property,
	leadContext,
	breadcrumbs = [],
	contextLinks = [],
	pageIdentity,
	legalSupport,
}: {
	property: PropertyDetailsDTO;
	leadContext: MarketingPageDTO["leadContext"];
	breadcrumbs?: readonly BreadcrumbItemDTO[];
	contextLinks?: readonly { href: string; label: string }[];
	pageIdentity?: PublicPageIdentityDTO;
	legalSupport?: { href: string; formKind: "legal" };
}) {
	return (
		<>
			<section
				id="section-property-gallery"
				data-analytics-view="property_open"
				data-analytics-geo-slug={pageIdentity?.geoSlug}
				data-analytics-page-key={pageIdentity?.pageKey}
				data-analytics-category={pageIdentity?.category}
			>
				<Section as="div" space="hero">
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
								<div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-surface-subtle">
									<PublicPropertyMediaGallery
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
									<h1 className="mt-8 text-h1 font-extrabold leading-heading">
										{property.title}
									</h1>
									<p className="mt-2 text-body-lg text-content-default">
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
									<p className="mt-8 text-body-lg text-content-default">
										{property.description}
									</p>
								</section>
							</div>
							<aside id="section-property-actions">
								<Card elevation="raised" className="sticky top-32">
									<CardHeader>
										<p className="text-h1 font-semibold leading-tight-copy">
											{property.price?.label ?? "Цена по запросу"}
										</p>
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
			{legalSupport ? (
				<section
					id="section-property-legal-check"
					className="bg-surface-raised"
				>
					<Section as="div">
						<Container size="narrow">
							<Card>
								<CardHeader>
									<h2 className="text-h1 font-semibold leading-tight-copy">
										Юридическая проверка объекта
									</h2>
									<CardDescription>
										Перед сделкой можно обсудить документы и юридические вопросы
										по вашей ситуации.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Button asChild>
										<a
											href={legalSupport.href}
											data-lead-form-kind={legalSupport.formKind}
										>
											Перейти к юристу
										</a>
									</Button>
								</CardContent>
							</Card>
						</Container>
					</Section>
				</section>
			) : null}
			<section
				id="section-property-related"
				aria-labelledby="property-related-title"
				className="bg-surface-subtle"
			>
				<Section as="div">
					<Container>
						<SectionHeader
							titleId="property-related-title"
							title="Похожие объекты"
						/>
						{property.related.length ? (
							<div className="mt-8 grid gap-6 md:grid-cols-2">
								{property.related.map((item) => (
									<PublicPropertyCard key={item.id} property={item} />
								))}
							</div>
						) : (
							<p className="mt-8 text-body-lg text-content-default">
								Похожие объекты появятся, когда в каталоге будет достаточно
								опубликованных предложений.
							</p>
						)}
					</Container>
				</Section>
			</section>
			<section id="section-property-lead">
				<Section as="div">
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
