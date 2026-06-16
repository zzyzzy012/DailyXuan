"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarDays, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UsageLimitNotice } from "@/features/usage/components/UsageLimitNotice";
import type {
  AiReadingUsageSummary,
  UsageRecordsApiResponse,
} from "@/features/usage/types/usage";
import { cn } from "@/lib/utils";

import { DAILY_LOT_FOCUS_OPTIONS } from "../constants";
import { dailyLotDrawRequestSchema } from "../schemas/dailyLotSchema";
import type {
  DailyLotDrawResult as DailyLotDrawResultType,
  DailyLotFocus,
  DailyLotReadingResult as DailyLotReadingResultType,
} from "../types/dailyLot";
import { DailyLotDrawResult } from "./DailyLotDrawResult";
import { DailyLotReadingResult } from "./DailyLotReadingResult";

type DailyLotDrawApiResponse =
  | {
      success: true;
      data: DailyLotDrawResultType;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

type DailyLotReadingApiResponse =
  | {
      success: true;
      data: DailyLotReadingResultType;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

export function DailyLotPanel() {
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [focus, setFocus] = useState<DailyLotFocus>("综合");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [drawResult, setDrawResult] = useState<DailyLotDrawResultType | null>(null);
  const [readingResult, setReadingResult] = useState<DailyLotReadingResultType | null>(null);
  const [usageSummary, setUsageSummary] = useState<AiReadingUsageSummary | null>(null);

  const dailyLotUsage = usageSummary?.dailyLot ?? null;

  const canCreateReading = useMemo(
    () => Boolean(drawResult) && !isDrawing && !isReading && Boolean(dailyLotUsage?.isAvailable),
    [dailyLotUsage?.isAvailable, drawResult, isDrawing, isReading],
  );

  async function refreshUsageSummary() {
    const response = await fetch("/api/usage-records");
    const result = (await response.json()) as UsageRecordsApiResponse;

    if (result.success) {
      setUsageSummary(result.data);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshUsageSummary();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function handleDraw(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedValues = dailyLotDrawRequestSchema.safeParse({
      nickname,
      birthDate,
      focus,
    });

    if (!parsedValues.success) {
      setErrorMessage(parsedValues.error.issues[0]?.message ?? "请检查输入信息");
      return;
    }

    setIsDrawing(true);
    setErrorMessage(null);
    setDrawResult(null);
    setReadingResult(null);

    try {
      const response = await fetch("/api/daily-lot-draws", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedValues.data),
      });

      const result = (await response.json()) as DailyLotDrawApiResponse;

      if (!result.success) {
        setErrorMessage(result.error.message);
        return;
      }

      setDrawResult(result.data);
    } catch {
      setErrorMessage("抽签失败，请稍后再试");
    } finally {
      setIsDrawing(false);
    }
  }

  async function handleCreateReading() {
    if (!drawResult) {
      return;
    }

    if (!dailyLotUsage?.isAvailable) {
      setErrorMessage(dailyLotUsage?.message ?? "AI 解读次数暂不可用");
      return;
    }

    setIsReading(true);
    setErrorMessage(null);
    setReadingResult(null);

    try {
      const response = await fetch("/api/daily-lot-readings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: drawResult.nickname ?? undefined,
          birthDate: drawResult.birthDate,
          today: drawResult.today,
          focus: drawResult.focus,
          lot: drawResult.lot,
        }),
      });

      const result = (await response.json()) as DailyLotReadingApiResponse;

      if (!result.success) {
        setErrorMessage(result.error.message);
        return;
      }

      setReadingResult(result.data);
      await refreshUsageSummary();
    } catch {
      setErrorMessage("解签生成失败，请稍后再试");
    } finally {
      setIsReading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Card>
        <CardHeader className="gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Daily Lot</Badge>
            <Badge variant="secondary">抽签免费</Badge>
          </div>
          <CardTitle className="text-2xl">输入今日灵签信息</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleDraw}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="daily-lot-nickname">昵称</Label>
                <Input
                  id="daily-lot-nickname"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  placeholder="可选"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="daily-lot-birth-date">出生日期</Label>
                <Input
                  id="daily-lot-birth-date"
                  type="date"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                当前日期由系统按北京时间获取
              </div>
              <div className="flex flex-wrap gap-2" aria-label="今日关注">
                {DAILY_LOT_FOCUS_OPTIONS.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={focus === option ? "default" : "outline"}
                    size="sm"
                    className={cn("min-w-20", focus === option ? "" : "bg-background")}
                    onClick={() => setFocus(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}

            <Button type="submit" className="w-full" disabled={isDrawing}>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {isDrawing ? "正在抽取..." : "抽取今日灵签"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {drawResult ? (
        <>
          <DailyLotDrawResult result={drawResult} />
          <Button
            className="w-full"
            variant="outline"
            disabled={!canCreateReading}
            onClick={handleCreateReading}
          >
            {isReading ? "解签生成中..." : "生成解签"}
          </Button>
          <UsageLimitNotice bucket={dailyLotUsage} />
        </>
      ) : null}

      {readingResult ? <DailyLotReadingResult reading={readingResult} /> : null}
    </div>
  );
}
