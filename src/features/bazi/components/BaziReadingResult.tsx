import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BaziReadingResult as BaziReadingResultType } from "../schemas/baziSchema";

type BaziReadingResultProps = {
  reading: BaziReadingResultType;
};

export function BaziReadingResult({ reading }: BaziReadingResultProps) {
  const sections = [
    { title: "输入摘要", content: reading.input_summary },
    { title: "整体气质", content: reading.personality_overview },
    { title: "五行式倾向", content: reading.element_tendency },
    { title: "关注方向", content: reading.focus_reading },
    { title: "信息完整度", content: reading.confidence_note },
    { title: "温和提醒", content: reading.reminder },
  ];

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap gap-2">
          {reading.profile_keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary">
              {keyword}
            </Badge>
          ))}
        </div>
        <CardTitle className="text-2xl">八字简批报告</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm leading-7 text-muted-foreground">{reading.greeting}</p>

        {sections.map((section) => (
          <section key={section.title} className="space-y-2">
            <h3 className="text-lg font-medium">{section.title}</h3>
            <p className="text-sm leading-7 text-muted-foreground">{section.content}</p>
          </section>
        ))}

        <section className="space-y-3">
          <h3 className="text-lg font-medium">最近可以尝试的小行动</h3>
          <div className="grid gap-3">
            {reading.action_suggestions.map((suggestion) => (
              <div key={suggestion} className="rounded-md border bg-muted/20 p-3 text-sm leading-6">
                {suggestion}
              </div>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
