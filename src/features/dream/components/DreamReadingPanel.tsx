"use client";

import { FormEvent, useState } from "react";
import { Moon, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { DREAM_INTERPRETATION_STYLE_OPTIONS } from "../constants";
import { dreamReadingRequestSchema } from "../schemas/dreamSchema";
import type {
  DreamInterpretationStyle,
  DreamReadingResult as DreamReadingResultType,
} from "../types/dream";
import { DreamReadingResult } from "./DreamReadingResult";

type DreamReadingApiResponse =
  | {
      success: true;
      data: DreamReadingResultType;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

export function DreamReadingPanel() {
  const [dreamText, setDreamText] = useState("");
  const [recentState, setRecentState] = useState("");
  const [wakeupFeeling, setWakeupFeeling] = useState("");
  const [focusPoint, setFocusPoint] = useState("");
  const [interpretationStyle, setInterpretationStyle] =
    useState<DreamInterpretationStyle>("情绪陪伴与象征结合");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [readingResult, setReadingResult] = useState<DreamReadingResultType | null>(null);

  async function handleCreateReading(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedValues = dreamReadingRequestSchema.safeParse({
      dreamText,
      recentState,
      wakeupFeeling,
      focusPoint,
      interpretationStyle,
    });

    if (!parsedValues.success) {
      setErrorMessage(parsedValues.error.issues[0]?.message ?? "请检查梦境内容");
      return;
    }

    setIsReading(true);
    setErrorMessage(null);
    setReadingResult(null);

    try {
      const response = await fetch("/api/dream-readings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedValues.data),
      });

      const result = (await response.json()) as DreamReadingApiResponse;

      if (!result.success) {
        setErrorMessage(result.error.message);
        return;
      }

      setReadingResult(result.data);
    } catch {
      setErrorMessage("梦境解析失败，请稍后再试");
    } finally {
      setIsReading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Card>
        <CardHeader className="gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Dream Reading</Badge>
            <Badge variant="secondary">首版免费</Badge>
          </div>
          <CardTitle className="text-2xl">写下你的梦</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleCreateReading}>
            <div className="space-y-2">
              <Label htmlFor="dream-text">梦境内容</Label>
              <Textarea
                id="dream-text"
                value={dreamText}
                onChange={(event) => setDreamText(event.target.value)}
                placeholder="尽量写完整：梦里发生了什么、出现了谁、你最强烈的感受是什么。"
                rows={8}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="recent-state">近期状态</Label>
                <Textarea
                  id="recent-state"
                  value={recentState}
                  onChange={(event) => setRecentState(event.target.value)}
                  placeholder="例如：工作压力有点大，最近睡眠不太稳。"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wakeup-feeling">醒后感受</Label>
                <Textarea
                  id="wakeup-feeling"
                  value={wakeupFeeling}
                  onChange={(event) => setWakeupFeeling(event.target.value)}
                  placeholder="例如：醒来后有点慌，也有一点想念。"
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="focus-point">最想解析的片段</Label>
              <Textarea
                id="focus-point"
                value={focusPoint}
                onChange={(event) => setFocusPoint(event.target.value)}
                placeholder="可选：写下梦里最让你在意的一幕。"
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Moon className="h-4 w-4" aria-hidden="true" />
                选择这次更想靠近的解析角度
              </div>
              <div className="flex flex-wrap gap-2" aria-label="解析侧重点">
                {DREAM_INTERPRETATION_STYLE_OPTIONS.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={interpretationStyle === option ? "default" : "outline"}
                    size="sm"
                    className={cn("min-w-24", interpretationStyle === option ? "" : "bg-background")}
                    onClick={() => setInterpretationStyle(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}

            <Button type="submit" className="w-full" disabled={isReading}>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {isReading ? "解析中..." : "解析梦境"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {readingResult ? <DreamReadingResult reading={readingResult} /> : null}
    </div>
  );
}
