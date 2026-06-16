import { FeatureEntryGrid } from "@/components/home/FeatureEntryGrid";
import { FreeUsagePanel } from "@/components/home/FreeUsagePanel";
import { HomeHero } from "@/components/home/HomeHero";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <HomeHero />
        <FeatureEntryGrid />
        <FreeUsagePanel />
      </main>
      <SiteFooter />
    </div>
  );
}
