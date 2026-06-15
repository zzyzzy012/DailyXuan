import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { DailyLotDrawResult as DailyLotDrawResultType } from "../types/dailyLot";

type DailyLotDrawResultProps = {
  result: DailyLotDrawResultType;
};

export function DailyLotDrawResult({ result }: DailyLotDrawResultProps) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-2xl">{result.lot.title}</CardTitle>
          <Badge variant="secondary">{result.lot.level}</Badge>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span>今日关注：{result.focus}</span>
          <span>北京时间：{result.today}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <blockquote className="rounded-lg border-l-4 border-primary bg-muted/40 px-4 py-4 text-lg leading-8">
          {result.lot.poem}
        </blockquote>

        <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr]">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">今日签意</p>
            <p className="mt-2 text-lg font-medium">{result.lot.theme}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">关键词</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.lot.keywords.map((keyword) => (
                <Badge key={keyword} variant="outline">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
