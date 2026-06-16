import { ArrowRight, History, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
      <div className="flex flex-col justify-center gap-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">日常玄学陪伴</Badge>
          <Badge variant="outline">每日免费体验</Badge>
        </div>

        <div className="space-y-5">
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl lg:text-6xl">
            愿每一次抽签与占卜，都能成为照见自己的片刻
          </h1>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            DailyXuan 汇集灵签、塔罗、解梦与运势解读。当你感到迷茫、犹豫或只是想寻找一点生活的提示时，这里会为你带来一份温和的回应。答案不一定来自未来，而可能来自你早已拥有却尚未察觉的内心。
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" variant="outline" asChild>
            <a href="daily-lot">
              查看今日运势
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
          <Button size="lg" asChild>
            <a href="tarot">
              先抽一张牌
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <p className="text-sm text-muted-foreground">今日体验</p>
            <h2 className="mt-1 text-2xl font-semibold">先从一个具体问题开始</h2>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
            <History className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>

        <div className="grid gap-4 pt-5">
          {[
            ["感情", "这段关系里，我真正需要看清的是什么？"],
            ["事业", "面对最近的选择，我可以先留意哪些信号？"],
            ["情绪", "这个反复出现的梦，可能在提醒我什么？"],
          ].map(([label, content]) => (
            <div key={label} className="rounded-md border bg-background p-4">
              <p className="text-sm font-medium">{label}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
