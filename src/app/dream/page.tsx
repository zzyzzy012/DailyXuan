import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { DreamReadingPanel } from "@/features/dream/components/DreamReadingPanel";

export const metadata: Metadata = {
  title: "梦境解析 | DailyXuan",
  description: "输入完整梦境和醒后感受，生成温和克制、兼具情绪陪伴与象征意味的梦境解析。",
};

export default function DreamPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-sm font-medium text-muted-foreground">Dream Reading</p>
            <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">梦境解析</h1>
            <p className="text-base leading-7 text-muted-foreground">
              把梦里的画面、醒后的感觉和近期状态放在一起，读出更贴近当下的情绪线索。
            </p>
          </div>

          <DreamReadingPanel />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
