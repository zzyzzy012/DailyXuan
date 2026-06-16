import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { DreamReadingResult as DreamReadingResultType } from "../types/dream";

type DreamReadingResultProps = {
  reading: DreamReadingResultType;
};

const readingSections = [
  { key: "coreEmotion", title: "核心情绪" },
  { key: "symbolicReading", title: "象征解读" },
  { key: "realLifeReflection", title: "现实映射" },
  { key: "gentleReminder", title: "温柔提醒" },
  { key: "actionSuggestion", title: "行动建议" },
] as const;

export function DreamReadingResult({ reading }: DreamReadingResultProps) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-2xl">梦境解析</CardTitle>
          <div className="flex flex-wrap gap-2">
            {reading.keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
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

        <section className="rounded-lg border bg-muted/30 p-4">
          <h3 className="font-medium">留给自己的问题</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{reading.selfQuestion}</p>
        </section>

        <p className="text-xs leading-6 text-muted-foreground">{reading.disclaimer}</p>
      </CardContent>
    </Card>
  );
}
