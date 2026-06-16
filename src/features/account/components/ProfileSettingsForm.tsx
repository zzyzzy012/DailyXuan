"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Clock3, Save, UserRound } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROFILE_UPDATE_INTERVAL_DAYS } from "@/features/account/constants";

import { profileSettingsSchema, type ProfileSettingsValues } from "../schemas/accountSchema";
import { updateProfileSettings } from "../services/accountService";
import type { AccountProfile } from "../types/account";

type ProfileSettingsFormProps = {
  profile: AccountProfile;
};

type ProfileSettingsErrors = Partial<Record<keyof ProfileSettingsValues, string>>;

function addDays(dateString: string, days: number): Date {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date;
}

function formatDateTime(value: Date | string | null): string {
  if (!value) {
    return "现在可更新";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function ProfileSettingsForm({ profile }: ProfileSettingsFormProps) {
  const router = useRouter();
  const [currentTime] = useState(() => Date.now());
  const [values, setValues] = useState<ProfileSettingsValues>({
    nickname: profile.nickname ?? "",
  });
  const [errors, setErrors] = useState<ProfileSettingsErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextAvailableAt = profile.profileUpdatedAt
    ? addDays(profile.profileUpdatedAt, PROFILE_UPDATE_INTERVAL_DAYS)
    : null;
  const isLocked = nextAvailableAt ? nextAvailableAt.getTime() > currentTime : false;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (isLocked) {
      setIsSuccess(false);
      setMessage(`资料刚更新过，请在 ${formatDateTime(nextAvailableAt)} 后再修改昵称。`);
      return;
    }

    const parsedValues = profileSettingsSchema.safeParse(values);

    if (!parsedValues.success) {
      const fieldErrors = parsedValues.error.flatten().fieldErrors;
      setErrors({
        nickname: fieldErrors.nickname?.[0],
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await updateProfileSettings(parsedValues.data);
      setIsSuccess(result.success);
      setMessage(result.message);

      if (result.success) {
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full rounded-xl border-0 px-6 py-6 shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">资料设置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 rounded-xl border bg-background p-5 md:grid-cols-[88px_minmax(0,1fr)]">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-muted">
              <UserRound className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">昵称每 7 天可修改一次</p>
              <p className="text-sm leading-6 text-muted-foreground">
                上次更新时间：{formatDateTime(profile.profileUpdatedAt)}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                下次可更新时间：{formatDateTime(nextAvailableAt)}
              </p>
            </div>
          </div>

          <div className="w-full space-y-3">
            <Label htmlFor="nickname">昵称</Label>
            <Input
              id="nickname"
              value={values.nickname}
              maxLength={30}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  nickname: event.target.value,
                }))
              }
              placeholder="给自己取一个轻松的名字"
              disabled={isLocked || isSubmitting}
            />
            {errors.nickname ? (
              <p className="text-sm text-destructive">{errors.nickname}</p>
            ) : null}
          </div>

          {message ? (
            <Alert variant={isSuccess ? "default" : "destructive"}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={isSubmitting || isLocked}>
              <Save className="h-4 w-4" aria-hidden="true" />
              {isSubmitting ? "保存中..." : "保存昵称"}
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              修改成功后会进入 7 天冷却期
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
