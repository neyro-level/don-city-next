import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(relative) {
	return readFileSync(relative, "utf8");
}

const leadForm = read("packages/ui/src/views/starter/LeadFormView.tsx");
assert.ok(leadForm.includes("FieldLabel htmlFor={ids.name}"));
assert.ok(leadForm.includes("FieldLabel htmlFor={ids.phone}"));
assert.ok(leadForm.includes("FieldError"));
assert.ok(leadForm.includes("successRef.current?.focus()"));

const starterHome = read("packages/ui/src/views/home/StarterHomePageView.tsx");
const starterPages = [
	starterHome,
	read("packages/ui/src/views/catalog/StarterCatalogPageView.tsx"),
	read("packages/ui/src/views/property/StarterPropertyPageView.tsx"),
	read("packages/ui/src/views/marketing/StarterMarketingPageView.tsx"),
].join("\n");
assert.equal([...starterPages.matchAll(/<h1\b/g)].length >= 4, true);
assert.ok(starterHome.includes("export function HomeHeroSection"));
assert.ok(starterHome.includes("export function HomeServicesSection"));

const homePage = read("src/app/(site)/page.tsx");
assert.equal(
	homePage.includes("<HomePageView"),
	false,
	"home page must compose sections, not a single HomePageView tree",
);
assert.ok(homePage.includes("<HomeHeroSection"));
assert.ok(homePage.includes("<HomeServicesSection"));

const layout = read("src/app/(site)/layout.tsx");
assert.ok(layout.includes("<PublicSiteHeader"));
assert.ok(layout.includes('href="#main-content"'));
assert.ok(layout.includes('id="main-content"'));
assert.ok(layout.includes("tabIndex={-1}"));
assert.ok(layout.includes("<StarterSiteFooter"));

const notFound = read("src/app/not-found.tsx");
assert.equal(
	notFound.includes("<main"),
	false,
	"404 content must use the public shell main landmark",
);
assert.ok(notFound.includes("<h1"));

const publicRoute = read("src/app/(site)/public-route.tsx");
assert.ok(publicRoute.includes("Страница не найдена | ДОН СИТИ"));
assert.ok(publicRoute.includes("Объект снят с публикации | ДОН СИТИ"));

const goneResponse = read("src/core/http/property-gone-response.ts");
assert.ok(goneResponse.includes('<html lang="ru">'));
assert.ok(goneResponse.includes('name="viewport"'));
assert.ok(goneResponse.includes("<main>"));
assert.ok(goneResponse.includes("<h1>Объект снят с публикации</h1>"));
assert.ok(goneResponse.includes('status: 410'));

const globals = read("src/app/globals.css");
assert.ok(globals.includes("prefers-reduced-motion"));
assert.equal(
	/html[^>]*className=["'][^"']*dark/.test(read("src/app/layout.tsx")),
	false,
	"root html must not enable a dark theme class",
);
const rootLayout = read("src/app/layout.tsx");
assert.ok(rootLayout.includes('icon: "/icon.png"'));
assert.ok(rootLayout.includes('apple: "/apple-icon.png"'));

const fallback = read("packages/ui/src/views/starter/MediaFallback.tsx");
assert.ok(fallback.includes("aria-hidden"));

const focus = read("packages/ui/src/components/ui/button.tsx");
assert.ok(focus.includes("focus-visible"));

console.log("verify:a11y-starter: ok");
