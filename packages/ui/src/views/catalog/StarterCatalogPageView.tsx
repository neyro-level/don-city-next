import type {
	BreadcrumbItemDTO,
	LeadFormContext,
	PropertyFilterDTO,
	PropertyListDTO,
	PublicPageIdentityDTO,
} from "@ams/realtbase-contracts";
import {
	type AnalyticsFilterKey,
	AnalyticsViewEvent,
	type CatalogViewAnalyticsEvent,
} from "../../analytics";
import { Badge } from "../../components/ui/badge";
import { Container, Section, SectionHeader } from "../../components/ui/layout";
import { PublicPropertyCard } from "../property/StarterPropertyCardView";
import { LeadFormView } from "../starter/LeadFormView";

export type CatalogPageCopy = {
	eyebrow: string;
	title: string;
	description: string;
	introduction?: string;
	emptyMessage: string;
	ctaTitle: string;
	ctaDescription?: string;
	ctaSubmitLabel?: string;
};

export type CatalogPaginationItem = {
	key: string;
	label: string;
	href?: string;
	current?: boolean;
};

const defaultCopy: CatalogPageCopy = {
	eyebrow: "Каталог",
	title: "Недвижимость",
	description:
		"Актуальные объекты агентства. Фильтры и карточки отражают опубликованный каталог.",
	emptyMessage:
		"Подходящих объектов пока нет. Измените запрос или оставьте заявку — подберём варианты.",
	ctaTitle: "Нужна помощь с подбором?",
};

export function CatalogPageView({
	list,
	filters,
	leadContext,
	copy = defaultCopy,
	breadcrumbs = [],
	contextLinks = [],
	pagination = [],
	pageIdentity,
	analyticsEvent,
	analyticsFilterKeys = [],
}: {
	list: PropertyListDTO;
	filters: PropertyFilterDTO;
	leadContext: LeadFormContext;
	copy?: CatalogPageCopy;
	breadcrumbs?: readonly BreadcrumbItemDTO[];
	contextLinks?: readonly { label: string; href: string }[];
	pagination?: readonly CatalogPaginationItem[];
	pageIdentity?: PublicPageIdentityDTO;
	analyticsEvent: CatalogViewAnalyticsEvent;
	analyticsFilterKeys?: readonly AnalyticsFilterKey[];
}) {
	return (
		<>
			<AnalyticsViewEvent
				event={{
					event: analyticsEvent,
					pageKey: pageIdentity?.pageKey,
					geoSlug: pageIdentity?.geoSlug,
					category: pageIdentity?.category,
				}}
			/>
			{analyticsFilterKeys.length ? (
				<AnalyticsViewEvent
					event={{
						event: "filter_apply",
						pageKey: pageIdentity?.pageKey,
						geoSlug: pageIdentity?.geoSlug,
						category: pageIdentity?.category,
						filterKeys: analyticsFilterKeys,
					}}
				/>
			) : null}
			<section
				id="section-catalog-hero"
				className="border-b border-border bg-surface-raised py-[var(--section-space-md)]"
				data-analytics-event={analyticsEvent}
				data-analytics-geo-slug={pageIdentity?.geoSlug}
				data-analytics-page-key={pageIdentity?.pageKey}
			>
				<Container>
					{breadcrumbs.length ? (
						<nav
							aria-label="Хлебные крошки"
							className="mb-6 flex flex-wrap gap-2 text-caption text-content-default"
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
					) : null}
					<p className="text-label font-bold uppercase tracking-wide-role text-action-primary">
						{copy.eyebrow}
					</p>
					<h1 className="mt-4 text-display font-extrabold tracking-display">
						{copy.title}
					</h1>
					<p className="mt-4 max-w-2xl text-body-large text-content-default">
						{copy.description}
					</p>
				</Container>
			</section>
			{copy.introduction ? (
				<section id="section-catalog-introduction">
					<Section>
						<Container size="narrow">
							<p className="whitespace-pre-line text-body-large text-content-default">
								{copy.introduction}
							</p>
						</Container>
					</Section>
				</section>
			) : null}
			<section id="section-catalog-filters" aria-label="Фильтры">
				<Section>
					<Container>
						<fieldset className="mb-8 flex flex-wrap gap-2">
							<legend className="sr-only">Доступные фильтры</legend>
							{filters.rooms.map((room) => (
								<Badge key={room} variant="outline">
									{room}-комнатные
								</Badge>
							))}
							<Badge variant="outline">Продажа</Badge>
						</fieldset>
					</Container>
				</Section>
			</section>
			{contextLinks.length ? (
				<nav aria-label="Разделы каталога" className="border-b border-border">
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
				</nav>
			) : null}
			<section id="section-catalog-toolbar" aria-label="Результаты">
				<Container>
					<SectionHeader
						title={`Найдено: ${filters.resultLabel}`}
						description="Показываем только подтверждённые характеристики объекта."
					/>
				</Container>
			</section>
			<section id="section-catalog-grid">
				<Section>
					<Container>
						{list.items.length ? (
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{list.items.map((property) => (
									<PublicPropertyCard key={property.id} property={property} />
								))}
							</div>
						) : (
							<p
								id="section-catalog-empty"
								className="text-body-large text-content-default"
							>
								{copy.emptyMessage}
							</p>
						)}
						{pagination.length ? (
							<nav
								aria-label="Страницы каталога"
								className="mt-10 flex flex-wrap justify-center gap-2"
							>
								{pagination.map((item) =>
									item.href ? (
										<a
											key={item.key}
											href={item.href}
											aria-current={item.current ? "page" : undefined}
											className={`grid min-h-11 min-w-11 place-items-center rounded-md border px-3 font-semibold ${item.current ? "border-action-primary bg-action-primary text-white" : "border-border bg-surface-raised hover:border-action-primary hover:text-action-primary"}`}
										>
											{item.label}
										</a>
									) : (
										<span
											key={item.key}
											aria-hidden
											className="grid min-h-11 min-w-11 place-items-center"
										>
											{item.label}
										</span>
									),
								)}
							</nav>
						) : null}
					</Container>
				</Section>
			</section>
			<section id="section-catalog-cta">
				<Section className="bg-surface-subtle">
					<Container size="narrow">
						<LeadFormView
							context={leadContext}
							title={copy.ctaTitle}
							description={copy.ctaDescription}
							submitLabel={copy.ctaSubmitLabel}
						/>
					</Container>
				</Section>
			</section>
		</>
	);
}
