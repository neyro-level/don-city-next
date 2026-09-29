import { Button } from "../../components/ui/button";
import { Container, Section } from "../../components/ui/layout";

export function GonePropertyPageView({
	slug,
	catalogHref,
}: {
	slug: string;
	catalogHref: string;
}) {
	return (
		<Section as="main" space="hero" className="flex min-h-[60vh] items-center">
			<Container size="narrow" className="text-center">
				<p className="mb-3 text-label font-medium uppercase text-content-muted">
					410
				</p>
				<h1 className="text-balance text-h2 font-semibold text-content-default md:text-h1">
					Объект снят с публикации
				</h1>
				<p className="mx-auto mt-4 max-w-2xl text-balance text-body-lg text-content-muted">
					Страница объекта {slug} больше не содержит публичные данные после
					окончания retention-периода. Автоматический редирект на главную не
					выполняется.
				</p>
				<Button asChild className="mt-8 rounded-full">
					<a href={catalogHref}>Смотреть актуальные объекты</a>
				</Button>
			</Container>
		</Section>
	);
}
