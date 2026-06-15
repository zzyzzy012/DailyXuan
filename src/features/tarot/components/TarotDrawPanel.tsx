"use client";

import { FormEvent, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { tarotDrawRequestSchema } from "../schemas/tarotSchema";
import type {
  TarotDrawResult as TarotDrawResultType,
  TarotReadingResult as TarotReadingResultType,
} from "../types/tarot";
import { TarotDrawResult } from "./TarotDrawResult";
import { TarotReadingResult } from "./TarotReadingResult";

type TarotDrawApiResponse =
  | {
      success: true;
      data: TarotDrawResultType;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

type TarotReadingApiResponse =
  | {
      success: true;
      data: TarotReadingResultType;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

const orientationText = {
  upright: "正位",
  reversed: "逆位",
} as const;

function createDisplayLines(result: TarotDrawResultType): string[] {
  const [firstCard, secondCard, thirdCard] = result.cards;

  return [
    `欢迎你，${result.greetingName}，你的问题是：${result.question}`,
    "正在抽取 第一张牌 ...",
    `塔罗 第一张牌｜${firstCard.position.title} - 牌: ${firstCard.card.name}（${orientationText[firstCard.orientation]}）`,
    "正在抽取 第二张牌 ...",
    `塔罗 第二张牌｜${secondCard.position.title} - 牌: ${secondCard.card.name}（${orientationText[secondCard.orientation]}）`,
    "正在抽取 第三张牌 ...",
    `塔罗 第三张牌｜${thirdCard.position.title} - 牌: ${thirdCard.card.name}（${orientationText[thirdCard.orientation]}）`,
    "占卜结束，祝你好运！",
  ];
}

export function TarotDrawPanel() {
  const [question, setQuestion] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [drawResult, setDrawResult] = useState<TarotDrawResultType | null>(null);
  const [readingResult, setReadingResult] = useState<TarotReadingResultType | null>(null);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);

  const canCreateReading = useMemo(
    () => Boolean(drawResult) && !isDrawing && !isReading,
    [drawResult, isDrawing, isReading],
  );

  async function handleDraw(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedQuestion = tarotDrawRequestSchema.safeParse({ question });

    if (!parsedQuestion.success) {
      setErrorMessage(parsedQuestion.error.issues[0]?.message ?? "请输入一个具体的问题");
      return;
    }

    setIsDrawing(true);
    setErrorMessage(null);
    setDrawResult(null);
    setReadingResult(null);
    setDisplayedLines([]);

    try {
      const response = await fetch("/api/tarot-draws", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedQuestion.data),
      });

      const result = (await response.json()) as TarotDrawApiResponse;

      if (!result.success) {
        setErrorMessage(result.error.message);
        return;
      }

      setDrawResult(result.data);

      const lines = createDisplayLines(result.data);

      for (const line of lines) {
        setDisplayedLines((currentLines) => [...currentLines, line]);
        await new Promise((resolve) => window.setTimeout(resolve, 520));
      }
    } catch {
      setErrorMessage("抽牌失败，请稍后再试");
    } finally {
      setIsDrawing(false);
    }
  }

  async function handleCreateReading() {
    if (!drawResult) {
      return;
    }

    setIsReading(true);
    setErrorMessage(null);
    setReadingResult(null);

    try {
      const response = await fetch("/api/tarot-readings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: drawResult.question,
          cards: drawResult.cards,
        }),
      });

      const result = (await response.json()) as TarotReadingApiResponse;

      if (!result.success) {
        setErrorMessage(result.error.message);
        return;
      }

      setReadingResult(result.data);
    } catch {
      setErrorMessage("解读生成失败，请稍后再试");
    } finally {
      setIsReading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">请输入你想占卜的问题</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleDraw}>
            <Textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="例如：我的事业运如何？"
              rows={5}
            />
            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
            <Button type="submit" className="w-full" disabled={isDrawing}>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {isDrawing ? "占卜中..." : "开始占卜"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">抽牌结果展示</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="min-h-72 rounded-lg border bg-muted/30 p-4 font-mono text-sm leading-7">
            {displayedLines.length > 0 ? (
              <div className="space-y-2">
                {displayedLines.map((line, index) => (
                  <p key={`${line}-${index}`}>{line}</p>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                输入问题并开始占卜后，这里会像打字流一样展示抽牌过程。
              </p>
            )}
          </div>

          {drawResult ? <TarotDrawResult cards={drawResult.cards} /> : null}

          <Button
            className="w-full"
            variant="outline"
            disabled={!canCreateReading}
            onClick={handleCreateReading}
          >
            {isReading ? "解读生成中..." : "生成解读"}
          </Button>
        </CardContent>
      </Card>

      {readingResult ? <TarotReadingResult reading={readingResult} /> : null}
    </div>
  );
}
