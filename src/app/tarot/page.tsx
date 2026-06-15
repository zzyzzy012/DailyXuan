import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TarotDrawPanel } from "@/features/tarot/components/TarotDrawPanel";

export const metadata: Metadata = {
  title: "塔罗抽牌 | DailyXuan",
  description: "输入一个具体问题，随机抽取三张塔罗牌，查看现状、阻碍与建议。",
};

export default function TarotPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">塔罗抽牌</h1>
          </div>

          <TarotDrawPanel />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
