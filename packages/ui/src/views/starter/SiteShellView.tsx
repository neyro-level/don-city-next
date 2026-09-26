import type { SiteFooterDTO, SiteHeaderDTO } from "@ams/realtbase-contracts";
import type { ReactNode } from "react";
import { Button } from "../../components/ui/button";
import { Container } from "../../components/ui/layout";

function isCurrentPath(href: string, activePath?: string) {
	return Boolean(activePath && href === activePath);
}

function navLinkClass(active: boolean, mobile = false) {
	const base = mobile
		? "whitespace-nowrap rounded-md bg-surface-subtle px-3 py-2 text-label font-semibold"
		: "rounded-md px-3 py-2 text-label font-semibold text-content-default transition-colors";
	return `${base} ${
		active
			? "bg-surface-subtle text-action-primary"
			: "hover:bg-surface-subtle hover:text-action-primary"
	} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary`;
}

export function StarterSiteHeader({
	header,
	activePath,
}: {
	header: SiteHeaderDTO;
	activePath?: string;
}) {
	return (
		<header className="sticky top-0 z-40 border-b border-[var(--brand-copper-soft)] bg-[var(--surface-card)]/95 shadow-[var(--site-header-shadow-tertiary)] backdrop-blur-xl">
			<Container className="flex min-h-17 items-center gap-5 py-3">
				<a
					href={header.homeHref}
					className="group flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
					aria-label={`${header.brandName} — на главную`}
				>
					<img
						src={header.logo.src}
						alt=""
						width={header.logo.width}
						height={header.logo.height}
						className="size-11 object-contain transition-transform duration-200 group-hover:scale-[1.03]"
						aria-hidden
					/>
					<span className="text-body font-extrabold tracking-caps text-content-strong">
						{header.brandName}
					</span>
				</a>
				<nav
					className="ml-auto hidden items-center gap-1 lg:flex"
					aria-label="Основная навигация"
				>
					{header.navigation.map((item) => {
						const itemActive = isCurrentPath(item.href, activePath);
						const childActive = item.children?.some((child) =>
							isCurrentPath(child.href, activePath),
						);
						return item.children?.length ? (
							<details className="group relative" key={item.href}>
								<summary
									className={`cursor-pointer list-none ${navLinkClass(
										Boolean(itemActive || childActive),
									)}`}
									aria-label={`Раздел ${item.label}`}
								>
									{item.label} <span aria-hidden>▾</span>
								</summary>
								<div className="absolute left-0 top-full z-50 mt-2 grid min-w-64 gap-1 rounded-lg border border-border bg-surface-card p-2 shadow-lg">
									{item.children.map((child) => {
										const active = isCurrentPath(child.href, activePath);
										return (
											<a
												key={child.href}
												href={child.href}
												className={navLinkClass(active)}
												aria-current={active ? "page" : undefined}
											>
												{child.label}
											</a>
										);
									})}
								</div>
							</details>
						) : (
							<a
								key={item.href}
								href={item.href}
								className={navLinkClass(itemActive)}
								aria-current={itemActive ? "page" : undefined}
							>
								{item.label}
							</a>
						);
					})}
				</nav>
				{header.phone ? (
					<a
						href={header.phone.href}
						className="hidden text-label font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary md:inline"
					>
						{header.phone.label}
					</a>
				) : null}
				{header.primaryAction ? (
					<Button asChild size="sm" className="hidden sm:inline-flex">
						<a href={header.primaryAction.href}>{header.primaryAction.label}</a>
					</Button>
				) : null}
			</Container>
			<Container
				className="flex gap-2 overflow-x-auto pb-3 lg:hidden"
				aria-label="Мобильная навигация"
			>
				{header.navigation
					.flatMap((item) => item.children ?? [item])
					.map((item) => {
						const active = isCurrentPath(item.href, activePath);
						return (
							<a
								key={item.href}
								href={item.href}
								className={navLinkClass(active, true)}
								aria-current={active ? "page" : undefined}
							>
								{item.label}
							</a>
						);
					})}
				{header.geoSwitcher?.map((item) => {
					const active = isCurrentPath(item.href, activePath);
					return (
						<a
							key={item.href}
							href={item.href}
							className={navLinkClass(active, true)}
							aria-current={active ? "page" : undefined}
						>
							{item.label}
						</a>
					);
				})}
			</Container>
		</header>
	);
}

export function StarterSiteFooter({ footer }: { footer: SiteFooterDTO }) {
	return (
		<footer className="border-t border-[var(--brand-copper)] bg-surface-inverse py-12 text-content-inverse">
			<Container>
				<div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
					<div>
						<img
							src={footer.logo.src}
							alt={footer.logo.alt}
							width={footer.logo.width}
							height={footer.logo.height}
							className="h-auto w-40 rounded-lg border border-[var(--dark-border)] object-cover shadow-[var(--site-header-shadow-primary)]"
							loading="lazy"
						/>
						<p className="mt-3 max-w-sm text-label leading-step-copy text-[var(--text-dark)]">
							Агентство недвижимости: подбор объектов, проверка документов и
							сопровождение сделки.
						</p>
					</div>
					<div className="grid gap-8 sm:grid-cols-3">
						{footer.groups.map((group) => (
							<nav key={group.title} aria-label={group.title}>
								<p className="mb-3 text-label font-bold">{group.title}</p>
								<div className="grid gap-2 text-label text-[var(--text-dark)]">
									{group.links.map((link) => (
										<a
											key={link.href}
											href={link.href}
											className="hover:text-content-inverse focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
										>
											{link.label}
										</a>
									))}
								</div>
							</nav>
						))}
						{footer.contacts.length ? (
							<nav aria-label="Контакты">
								<p className="mb-3 text-label font-bold">Контакты</p>
								<div className="grid gap-2 text-label text-[var(--text-dark)]">
									{footer.contacts.map((contact) => (
										<a
											key={`${contact.href}-${contact.label}`}
											href={contact.href}
											className="hover:text-content-inverse focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
										>
											{contact.label}
										</a>
									))}
								</div>
							</nav>
						) : null}
					</div>
				</div>
				<div className="mt-10 flex flex-col gap-3 border-t border-[var(--dark-border)] pt-6 text-caption text-[var(--text-dark)] md:flex-row md:items-center md:justify-between">
					<p>{footer.copyright}</p>
					<nav
						className="flex flex-wrap gap-4"
						aria-label="Правовая информация"
					>
						{footer.legalLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="hover:text-content-inverse focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
							>
								{link.label}
							</a>
						))}
					</nav>
				</div>
			</Container>
		</footer>
	);
}

export function SiteShellView({
	header,
	footer,
	children,
}: {
	header: SiteHeaderDTO;
	footer: SiteFooterDTO;
	children: ReactNode;
}) {
	return (
		<div className="min-h-screen bg-surface-page text-content-strong">
			<StarterSiteHeader header={header} />
			<main>{children}</main>
			<StarterSiteFooter footer={footer} />
		</div>
	);
}
