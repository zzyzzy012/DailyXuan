"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UsageLimitNotice } from "@/features/usage/components/UsageLimitNotice";
import type {
  AiReadingUsageSummary,
  UsageRecordsApiResponse,
} from "@/features/usage/types/usage";

import {
  BAZI_BIRTH_TIME_PERIOD_OPTIONS,
  BAZI_BIRTH_TIME_STATUS_OPTIONS,
  BAZI_FOCUS_AREA_OPTIONS,
  BAZI_GENDER_OPTIONS,
  BAZI_PROVINCE_OPTIONS,
  DEFAULT_BAZI_BIRTH_CITY,
  DEFAULT_BAZI_BIRTH_LOCATION_CODE,
  DEFAULT_BAZI_BIRTH_PROVINCE,
  getBaziCityOptionsByProvince,
} from "../constants";
import {
  baziReadingRequestSchema,
  type BaziReadingRequest,
  type BaziReadingResult as BaziReadingResultType,
} from "../schemas/baziSchema";
import type { BaziReadingApiResponse } from "../types/bazi";
import { BaziReadingResult } from "./BaziReadingResult";

export function BaziReadingForm() {
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<BaziReadingRequest["gender"]>("不便透露");
  const [birthDate, setBirthDate] = useState("");
  const [birthTimeStatus, setBirthTimeStatus] =
    useState<BaziReadingRequest["birthTimeStatus"]>("exact");
  const [birthTime, setBirthTime] = useState("");
  const [birthTimePeriod, setBirthTimePeriod] =
    useState<NonNullable<BaziReadingRequest["birthTimePeriod"]>>("辰时 07:00-08:59");
  const [birthProvince, setBirthProvince] =
    useState<BaziReadingRequest["birthProvince"]>(DEFAULT_BAZI_BIRTH_PROVINCE);
  const [birthCity, setBirthCity] =
    useState<BaziReadingRequest["birthCity"]>(DEFAULT_BAZI_BIRTH_CITY);
  const [birthLocationCode, setBirthLocationCode] =
    useState<BaziReadingRequest["birthLocationCode"]>(DEFAULT_BAZI_BIRTH_LOCATION_CODE);
  const [birthPlaceDetail, setBirthPlaceDetail] = useState("");
  const [focusArea, setFocusArea] = useState<BaziReadingRequest["focusArea"]>("综合");
  const [currentSituation, setCurrentSituation] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [readingResult, setReadingResult] = useState<BaziReadingResultType | null>(null);
  const [usageSummary, setUsageSummary] = useState<AiReadingUsageSummary | null>(null);

  const sharedReadingUsage = usageSummary?.sharedReading ?? null;

  const birthCityOptions = useMemo(
    () => getBaziCityOptionsByProvince(birthProvince),
    [birthProvince],
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

  function handleBirthProvinceChange(value: string) {
    const cityOptions = getBaziCityOptionsByProvince(value);
    const firstCity = cityOptions[0];

    setBirthProvince(value as BaziReadingRequest["birthProvince"]);
    setBirthCity((firstCity?.value ?? "") as BaziReadingRequest["birthCity"]);
    setBirthLocationCode((firstCity?.code ?? "") as BaziReadingRequest["birthLocationCode"]);
  }

  function handleBirthCityChange(value: string) {
    const city = birthCityOptions.find((option) => option.code === value);

    if (!city) {
      return;
    }

    setBirthCity(city.value as BaziReadingRequest["birthCity"]);
    setBirthLocationCode(city.code as BaziReadingRequest["birthLocationCode"]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedValues = baziReadingRequestSchema.safeParse({
      nickname,
      gender,
      birthDate,
      birthTimeStatus,
      birthTime: birthTimeStatus === "exact" ? birthTime : undefined,
      birthTimePeriod: birthTimeStatus === "period" ? birthTimePeriod : undefined,
      birthProvince,
      birthCity,
      birthLocationCode,
      birthPlaceDetail: birthPlaceDetail || undefined,
      focusArea,
      currentSituation: currentSituation || undefined,
    });

    if (!parsedValues.success) {
      setErrorMessage(parsedValues.error.issues[0]?.message ?? "请检查八字简批信息");
      return;
    }

    if (!sharedReadingUsage?.isAvailable) {
      setErrorMessage(sharedReadingUsage?.message ?? "AI 解读次数暂不可用");
      return;
    }

    setIsReading(true);
    setErrorMessage(null);
    setReadingResult(null);

    try {
      const response = await fetch("/api/bazi-readings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedValues.data),
      });

      const result = (await response.json()) as BaziReadingApiResponse;

      if (!result.success) {
        setErrorMessage(result.error.message);
        return;
      }

      setReadingResult(result.data);
      await refreshUsageSummary();
    } catch {
      setErrorMessage("八字简批生成失败，请稍后再试");
    } finally {
      setIsReading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-2xl">填写八字简批信息</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            本期支持公历生日和中国大陆出生城市；只知道大概时段或不知道出生时间也可以生成简批。
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bazi-nickname">昵称</Label>
                <Input
                  id="bazi-nickname"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  placeholder="例如：小满"
                />
              </div>

              <div className="space-y-2">
                <Label>性别</Label>
                <Select
                  value={gender}
                  onValueChange={(value) => setGender(value as BaziReadingRequest["gender"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择性别" />
                  </SelectTrigger>
                  <SelectContent>
                    {BAZI_GENDER_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bazi-birth-date">公历出生日期</Label>
                <Input
                  id="bazi-birth-date"
                  type="date"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>出生时间状态</Label>
                <Select
                  value={birthTimeStatus}
                  onValueChange={(value) =>
                    setBirthTimeStatus(value as BaziReadingRequest["birthTimeStatus"])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择时间状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {BAZI_BIRTH_TIME_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bazi-birth-time">出生时间</Label>
                <Input
                  id="bazi-birth-time"
                  type="time"
                  value={birthTime}
                  onChange={(event) => setBirthTime(event.target.value)}
                  disabled={birthTimeStatus !== "exact"}
                />
              </div>

              <div className="space-y-2">
                <Label>大概出生时段</Label>
                <Select
                  value={birthTimePeriod}
                  onValueChange={(value) =>
                    setBirthTimePeriod(value as NonNullable<BaziReadingRequest["birthTimePeriod"]>)
                  }
                  disabled={birthTimeStatus !== "period"}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择大概时段" />
                  </SelectTrigger>
                  <SelectContent>
                    {BAZI_BIRTH_TIME_PERIOD_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>出生城市</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Select value={birthProvince} onValueChange={handleBirthProvinceChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择省份">{birthProvince}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {BAZI_PROVINCE_OPTIONS.map((option) => (
                        <SelectItem key={option.code} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={birthLocationCode} onValueChange={handleBirthCityChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择城市">{birthCity}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {birthCityOptions.map((option) => (
                        <SelectItem key={option.code} value={option.code}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>关注方向</Label>
                <Select
                  value={focusArea}
                  onValueChange={(value) =>
                    setFocusArea(value as BaziReadingRequest["focusArea"])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择关注方向" />
                  </SelectTrigger>
                  <SelectContent>
                    {BAZI_FOCUS_AREA_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bazi-birth-place-detail">具体出生地</Label>
              <Input
                id="bazi-birth-place-detail"
                value={birthPlaceDetail}
                onChange={(event) => setBirthPlaceDetail(event.target.value)}
                placeholder="可选，例如：某区、某县或医院附近"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bazi-current-situation">当前状态或想补充的问题</Label>
              <Textarea
                id="bazi-current-situation"
                value={currentSituation}
                onChange={(event) => setCurrentSituation(event.target.value)}
                placeholder="可选，例如：最近在考虑换工作，希望更了解自己的行动节奏。"
                rows={4}
              />
            </div>

            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}

            <Button
              type="submit"
              className="w-full"
              disabled={isReading || !sharedReadingUsage?.isAvailable}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {isReading ? "简批生成中..." : "生成八字简批"}
            </Button>
            <UsageLimitNotice bucket={sharedReadingUsage} />
          </form>
        </CardContent>
      </Card>

      {readingResult ? <BaziReadingResult reading={readingResult} /> : null}
    </div>
  );
}
