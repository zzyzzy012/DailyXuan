import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TarotReadingResult as TarotReadingResultType } from "../types/tarot";

type TarotReadingResultProps = {
  reading: TarotReadingResultType;
};

export function TarotReadingResult({ reading }: TarotReadingResultProps) {
  const sections = [
    { title: "整体能量", content: reading.summary },
    { title: "现状解读", content: reading.current },
    { title: "阻碍解读", content: reading.obstacle },
    { title: "建议解读", content: reading.advice },
    { title: "最近行动建议", content: reading.action_advice },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">AI 解读</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section) => (
          <section key={section.title} className="space-y-2">
            <h3 className="text-lg font-medium">{section.title}</h3>
            <p className="text-sm leading-7 text-muted-foreground">{section.content}</p>
          </section>
        ))}

        <div className="space-y-2">
          <h3 className="text-lg font-medium">幸运关键词</h3>
          <div className="flex flex-wrap gap-2">
            {reading.lucky_keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-md bg-secondary px-2 py-1 text-sm text-secondary-foreground"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
