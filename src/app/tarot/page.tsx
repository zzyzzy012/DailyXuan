import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TarotDrawPanel } from "@/features/tarot/components/TarotDrawPanel";

export const metadata: Metadata = {
  title: "塔罗抽牌 | DailyXuan",
  description: "带着一个具体问题抽取塔罗牌阵，从牌面关系里获得一段温和、克制、可参考的提示。",
};

export default function TarotPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-sm font-medium text-muted-foreground">Tarot Reading</p>
            <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">塔罗抽牌</h1>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              带着一个具体问题抽取牌阵，从牌面关系里获得一段温和、克制、可参考的提示。
            </p>
          </div>

          <TarotDrawPanel />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
