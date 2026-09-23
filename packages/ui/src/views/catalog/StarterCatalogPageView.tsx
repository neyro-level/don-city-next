import type {
	LeadFormContext,
	PropertyFilterDTO,
	PropertyListDTO,
} from "@ams/realtbase-contracts";
import { Badge } from "../../components/ui/badge";
import { Container, Section, SectionHeader } from "../../components/ui/layout";
import { StarterPropertyCard } from "../property/StarterPropertyCardView";
import { LeadFormView } from "../starter/LeadFormView";

export type CatalogPageCopy = {
	eyebrow: string;
	title: string;
	description: string;
	emptyMessage: string;
	ctaTitle: string;
	ctaDescription?: string;
	ctaSubmitLabel?: string;
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
}: {
	list: PropertyListDTO;
	filters: PropertyFilterDTO;
	leadContext: LeadFormContext;
	copy?: CatalogPageCopy;
}) {
	return (
		<>
			<section
				id="section-catalog-hero"
				className="border-b border-border bg-surface-raised py-[var(--section-space-md)]"
			>
				<Container>
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
									<StarterPropertyCard key={property.id} property={property} />
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
