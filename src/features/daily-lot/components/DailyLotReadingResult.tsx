import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { DailyLotReadingResult as DailyLotReadingResultType } from "../types/dailyLot";

type DailyLotReadingResultProps = {
  reading: DailyLotReadingResultType;
};

const readingSections = [
  { key: "summary", title: "整体签意" },
  { key: "mood", title: "今日心境" },
  { key: "focus_reading", title: "今日关注" },
  { key: "action_advice", title: "行动建议" },
] as const;

export function DailyLotReadingResult({ reading }: DailyLotReadingResultProps) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-2xl">今日解签</CardTitle>
          <Badge variant="secondary">{reading.lot_level}</Badge>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {reading.lot_title}：{reading.lot_poem}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {readingSections.map((section) => (
            <section key={section.key} className="rounded-lg border p-4">
              <h3 className="font-medium">{section.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{reading[section.key]}</p>
            </section>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">幸运关键词</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {reading.lucky_keywords.map((keyword) => (
                <Badge key={keyword} variant="outline">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">今日幸运色</p>
            <p className="mt-2 text-lg font-medium">{reading.lucky_color}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
