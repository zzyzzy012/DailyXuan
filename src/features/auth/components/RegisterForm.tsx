"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Mail, LockKeyhole, Sparkles } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/features/auth/schemas/authSchema";
import { signUpWithEmail } from "@/features/auth/services/authService";
import type { RegisterFormValues } from "@/features/auth/types/auth";

type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>;

const defaultValues: RegisterFormValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm() {
  const [values, setValues] = useState<RegisterFormValues>(defaultValues);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsSuccess(false);

    const parsedValues = registerSchema.safeParse(values);

    if (!parsedValues.success) {
      const fieldErrors = parsedValues.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await signUpWithEmail(parsedValues.data);
      setMessage(result.message ?? null);
      setIsSuccess(result.success);

      if (result.success) {
        setValues(defaultValues);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md rounded-lg">
      <CardHeader className="space-y-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl">创建 DailyXuan 账号</CardTitle>
          <p className="text-sm text-muted-foreground">
            注册后请前往邮箱点击确认链接完成激活。
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                className="pl-9"
                value={values.email}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
            </div>
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <div className="relative">
              <LockKeyhole
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                className="pl-9"
                value={values.password}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
              />
            </div>
            {errors.password ? (
              <p className="text-sm text-destructive">{errors.password}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认密码</Label>
            <div className="relative">
              <LockKeyhole
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="pl-9"
                value={values.confirmPassword}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
              />
            </div>
            {errors.confirmPassword ? (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            ) : null}
          </div>

          {message ? (
            <Alert variant={isSuccess ? "default" : "destructive"}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "注册中..." : "注册"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          已有账号？{" "}
          <Link href="/login" className="font-medium text-foreground underline">
            去登录
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
