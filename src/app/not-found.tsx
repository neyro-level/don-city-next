import { Button, Container, Section } from "@ams/realtbase-ui/primitives";
import Link from "next/link";
import { projectUrls } from "@/project/url-grammar";

export default function NotFound() {
	return (
		<Section space="hero">
			<Container size="narrow" className="text-center">
				<p className="text-label font-bold uppercase text-action-primary">
					Ошибка 404
				</p>
				<h1 className="mt-4 text-h1 font-extrabold">
					Страница не найдена
				</h1>
				<p className="mx-auto mt-4 max-w-xl text-body-lg text-content-default">
					Адрес мог измениться. Вернитесь на главную или откройте каталог
					недвижимости.
				</p>
				<div className="mt-7 flex justify-center gap-3">
					<Button asChild>
						<Link href={projectUrls.home}>На главную</Link>
					</Button>
					<Button asChild variant="outline">
						<Link href={projectUrls.primaryCatalog}>В каталог</Link>
					</Button>
				</div>
			</Container>
		</Section>
	);
}
