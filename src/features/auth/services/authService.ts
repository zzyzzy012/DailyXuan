"use client";

import type { AuthError } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type {
  AuthActionResult,
  LoginFormValues,
  RegisterFormValues,
} from "@/features/auth/types/auth";

function getAuthErrorMessage(error: AuthError): string {
  if (error.message.includes("Invalid login credentials")) {
    return "邮箱或密码不正确，请检查后重试";
  }

  if (error.message.includes("Email not confirmed")) {
    return "邮箱还没有完成验证，请先查看邮箱中的确认链接";
  }

  if (error.message.includes("User already registered")) {
    return "这个邮箱已经注册过，请直接登录";
  }

  return "操作失败，请稍后再试";
}

function getSupabaseClientResult(): AuthActionResult | ReturnType<typeof createSupabaseBrowserClient> {
  try {
    return createSupabaseBrowserClient();
  } catch {
    return {
      success: false,
      message: "认证服务暂未配置，请稍后再试",
    };
  }
}

export async function signUpWithEmail(
  values: RegisterFormValues,
): Promise<AuthActionResult> {
  const supabase = getSupabaseClientResult();

  if ("success" in supabase) {
    return supabase;
  }

  const emailRedirectTo = `${window.location.origin}/auth/callback`;

  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    return {
      success: false,
      message: getAuthErrorMessage(error),
    };
  }

  return {
    success: true,
    message: "注册成功，请查收邮箱并点击确认链接完成激活",
  };
}

export async function signInWithEmail(
  values: LoginFormValues,
): Promise<AuthActionResult> {
  const supabase = getSupabaseClientResult();

  if ("success" in supabase) {
    return supabase;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    return {
      success: false,
      message: getAuthErrorMessage(error),
    };
  }

  return {
    success: true,
  };
}

export async function signOut(): Promise<AuthActionResult> {
  const supabase = getSupabaseClientResult();

  if ("success" in supabase) {
    return supabase;
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      message: getAuthErrorMessage(error),
    };
  }

  return {
    success: true,
  };
}
