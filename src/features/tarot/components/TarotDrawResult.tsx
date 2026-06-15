import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TarotDrawnCard } from "../types/tarot";

type TarotDrawResultProps = {
  cards: TarotDrawnCard[];
};

const orientationText = {
  upright: "正位",
  reversed: "逆位",
} as const;

export function TarotDrawResult({ cards }: TarotDrawResultProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((drawnCard) => (
        <Card key={`${drawnCard.position.index}-${drawnCard.card.id}`}>
          <CardHeader>
            <p className="text-sm text-muted-foreground">
              第 {drawnCard.position.index} 张牌｜{drawnCard.position.title}
            </p>
            <CardTitle className="text-xl">
              {drawnCard.card.name}（{orientationText[drawnCard.orientation]}）
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-6 text-muted-foreground">
              {drawnCard.position.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {drawnCard.card.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
