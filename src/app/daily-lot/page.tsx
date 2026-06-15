import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { DailyLotPanel } from "@/features/daily-lot/components/DailyLotPanel";

export const metadata: Metadata = {
  title: "今日灵签 | DailyXuan",
  description: "输入出生日期并选择今日关注方向，抽取一支轻量灵签，生成温和克制的今日生活提醒。",
};

export default function DailyLotPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-sm font-medium text-muted-foreground">Daily Lot</p>
            <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">今日灵签</h1>
            <p className="text-base leading-7 text-muted-foreground">
              抽一支适合日常阅读的轻量灵签，把今日关注落在温和、具体、可行动的提醒里。
            </p>
          </div>

          <DailyLotPanel />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
