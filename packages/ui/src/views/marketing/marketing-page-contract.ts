export type MarketingCompositionKind =
	| "sell-process"
	| "legal-services"
	| "about-trust"
	| "contacts-access"
	| "generic";

export function getMarketingCompositionKind(
	slug: string,
): MarketingCompositionKind {
	if (slug === "prodat-nedvizhimost") return "sell-process";
	if (slug === "yurist") return "legal-services";
	if (slug === "o-kompanii") return "about-trust";
	if (slug === "kontakty") return "contacts-access";
	return "generic";
}

export function getMarketingConversionCopy(kind: MarketingCompositionKind) {
	if (kind === "sell-process") {
		return {
			title: "Обсудить продажу",
			description:
				"Опишите объект и задачу — уточним исходные данные и следующий шаг.",
			submitLabel: "Обсудить продажу",
		};
	}
	if (kind === "legal-services") {
		return {
			title: "Запросить консультацию",
			description:
				"Опишите ситуацию — уточним вопрос и подходящий формат консультации.",
			submitLabel: "Запросить консультацию",
		};
	}
	if (kind === "about-trust") {
		return {
			title: "Задать вопрос о компании",
			description:
				"Оставьте контакты и вопрос — специалист ДОН СИТИ свяжется с вами.",
			submitLabel: "Задать вопрос",
		};
	}
	if (kind === "contacts-access") {
		return {
			title: "Связаться с ДОН СИТИ",
			description:
				"Оставьте контакты и сообщение — ответим по указанному вопросу.",
			submitLabel: "Отправить сообщение",
		};
	}
	return {
		title: "Оставить заявку",
		description: "Перезвоним и уточним задачу.",
		submitLabel: "Отправить заявку",
	};
}
