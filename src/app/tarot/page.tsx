import type { Metadata } from "next";

import { TarotDrawPanel } from "@/features/tarot/components/TarotDrawPanel";

export const metadata: Metadata = {
  title: "塔罗占卜 | DailyXuan",
  description: "输入一个具体问题，随机抽取三张塔罗牌，查看现状、阻碍与建议。",
};

export default function TarotPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-medium text-muted-foreground">塔罗抽牌</p>
          <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">
            为一个具体问题抽取三张牌
          </h1>
          <p className="text-base leading-8 text-muted-foreground">
            本阶段只展示抽牌过程和牌面结果，不调用 AI，也不消耗每日免费解读次数。
            后续点击“生成解读”时，才会进入 AI 解读、次数检查和报告保存流程。
          </p>
        </div>

        <TarotDrawPanel />
      </section>
    </main>
  );
}
