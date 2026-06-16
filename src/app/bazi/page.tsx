import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BaziReadingForm } from "@/features/bazi/components/BaziReadingForm";

export const metadata: Metadata = {
  title: "八字简批 | DailyXuan",
  description: "填写公历出生信息，生成娱乐向八字简批和日常行动建议。",
};

export default function BaziPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-sm font-medium text-muted-foreground">Bazi Reading</p>
            <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">八字简批</h1>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              以公历生日、出生城市和当前关注为线索，生成一份轻量、温和、适合自我观察的娱乐向简批。
            </p>
          </div>

          <BaziReadingForm />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
