import type { PropertyCardDTO } from "@ams/realtbase-contracts";
import type { baseContractFixture } from "@ams/realtbase-contracts/fixtures";
import type { JournalArticleCardDTO } from "@ams/realtbase-contracts/journal";
import type { AnalyticsViewEvent } from "@ams/realtbase-ui/analytics";
import type { Button } from "@ams/realtbase-ui/primitives";
import type { HomeHeroSection } from "@ams/realtbase-ui/public/home-page";

export type WorkspaceConsumptionProof = {
	property: PropertyCardDTO;
	journal: JournalArticleCardDTO;
	fixture: typeof baseContractFixture;
	analytics: typeof AnalyticsViewEvent;
	button: typeof Button;
	homeHero: typeof HomeHeroSection;
};
