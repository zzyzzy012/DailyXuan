"use client";

import { useState, type FormEvent } from "react";
import { Clock3, KeyRound, MailCheck } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EMAIL_REBIND_INTERVAL_DAYS } from "@/features/account/constants";

import {
  emailRebindSchema,
  passwordChangeSchema,
  type EmailRebindValues,
  type PasswordChangeValues,
} from "../schemas/accountSchema";
import {
  updateAccountEmail,
  updateAccountPassword,
} from "../services/accountService";
import type { AccountProfile } from "../types/account";

type SecuritySettingsCardProps = {
  profile: AccountProfile;
};

type EmailErrors = Partial<Record<keyof EmailRebindValues, string>>;
type PasswordErrors = Partial<Record<keyof PasswordChangeValues, string>>;

function addDays(dateString: string, days: number): Date {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date;
}

function formatDateTime(value: Date | string | null): string {
  if (!value) {
    return "现在可更换";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function SecuritySettingsCard({ profile }: SecuritySettingsCardProps) {
  const [currentTime] = useState(() => Date.now());
  const [emailValues, setEmailValues] = useState<EmailRebindValues>({ email: "" });
  const [passwordValues, setPasswordValues] = useState<PasswordChangeValues>({
    password: "",
    confirmPassword: "",
  });
  const [emailErrors, setEmailErrors] = useState<EmailErrors>({});
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const nextEmailRebindAt = profile.emailRebindRequestedAt
    ? addDays(profile.emailRebindRequestedAt, EMAIL_REBIND_INTERVAL_DAYS)
    : null;
  const isEmailLocked = nextEmailRebindAt ? nextEmailRebindAt.getTime() > currentTime : false;

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (isEmailLocked) {
      setIsSuccess(false);
      setMessage(`邮箱刚发起过换绑，请在 ${formatDateTime(nextEmailRebindAt)} 后再试。`);
      return;
    }

    const parsedValues = emailRebindSchema.safeParse(emailValues);

    if (!parsedValues.success) {
      setEmailErrors({
        email: parsedValues.error.flatten().fieldErrors.email?.[0],
      });
      return;
    }

    setEmailErrors({});
    setIsUpdatingEmail(true);

    try {
      const result = await updateAccountEmail(profile.id, parsedValues.data);
      setIsSuccess(result.success);
      setMessage(result.message);

      if (result.success) {
        window.location.reload();
      }
    } finally {
      setIsUpdatingEmail(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const parsedValues = passwordChangeSchema.safeParse(passwordValues);

    if (!parsedValues.success) {
      const fieldErrors = parsedValues.error.flatten().fieldErrors;
      setPasswordErrors({
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }

    setPasswordErrors({});
    setIsUpdatingPassword(true);

    try {
      const result = await updateAccountPassword(parsedValues.data);
      setIsSuccess(result.success);
      setMessage(result.message);

      if (result.success) {
        setPasswordValues({
          password: "",
          confirmPassword: "",
        });
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  return (
    <Card className="h-full w-full rounded-lg border-0 shadow-none px-6 py-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">安全设置</CardTitle>
      </CardHeader>
      <CardContent className="w-full space-y-6 px-0">
        <div className="rounded-lg border bg-background p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            邮箱换新每 15 天可发起一次
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            上次发起时间：{formatDateTime(profile.emailRebindRequestedAt)}
          </p>
          <p className="text-sm text-muted-foreground">
            下次可发起时间：{formatDateTime(nextEmailRebindAt)}
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleEmailSubmit}>
          <div className="flex items-center gap-2 font-medium">
            <MailCheck className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            邮箱换新
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="space-y-2">
              <Label htmlFor="new-email">新邮箱</Label>
              <Input
                id="new-email"
                type="email"
                value={emailValues.email}
                onChange={(event) => setEmailValues({ email: event.target.value })}
                placeholder="new@example.com"
                disabled={isEmailLocked || isUpdatingEmail}
              />
              {emailErrors.email ? (
                <p className="text-sm text-destructive">{emailErrors.email}</p>
              ) : null}
            </div>
            <Button className="self-end" type="submit" disabled={isUpdatingEmail || isEmailLocked}>
              {isUpdatingEmail ? "发送中..." : "发送验证"}
            </Button>
          </div>
        </form>

        <form className="space-y-3" onSubmit={handlePasswordSubmit}>
          <div className="flex items-center gap-2 font-medium">
            <KeyRound className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            修改密码
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">新密码</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={passwordValues.password}
                onChange={(event) =>
                  setPasswordValues((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
              />
              {passwordErrors.password ? (
                <p className="text-sm text-destructive">{passwordErrors.password}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">确认新密码</Label>
              <Input
                id="confirm-new-password"
                type="password"
                autoComplete="new-password"
                value={passwordValues.confirmPassword}
                onChange={(event) =>
                  setPasswordValues((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
              />
              {passwordErrors.confirmPassword ? (
                <p className="text-sm text-destructive">{passwordErrors.confirmPassword}</p>
              ) : null}
            </div>
          </div>
          <Button type="submit" variant="outline" disabled={isUpdatingPassword}>
            {isUpdatingPassword ? "更新中..." : "更新密码"}
          </Button>
        </form>

        {message ? (
          <Alert variant={isSuccess ? "default" : "destructive"}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}
