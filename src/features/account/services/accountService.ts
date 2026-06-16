"use client";

import type { AuthError } from "@supabase/supabase-js";

import { signOut } from "@/features/auth/services/authService";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import type {
  EmailRebindValues,
  PasswordChangeValues,
  ProfileSettingsValues,
} from "../schemas/accountSchema";
import type { AccountActionResult } from "../types/account";

function getAccountErrorMessage(error: AuthError): string {
  if (error.message.includes("New email should be different")) {
    return "新邮箱不能和当前邮箱相同";
  }

  if (error.message.includes("Password should be at least")) {
    return "新密码长度不符合要求";
  }

  return "操作失败，请稍后再试";
}

function getProfileUpdateErrorMessage(message: string): string {
  if (message.includes("PROFILE_UPDATE_COOLDOWN")) {
    return "资料刚更新过，请 7 天后再修改昵称";
  }

  return "资料保存失败，请稍后再试";
}

function getSupabaseClientResult():
  | AccountActionResult
  | ReturnType<typeof createSupabaseBrowserClient> {
  try {
    return createSupabaseBrowserClient();
  } catch {
    return {
      success: false,
      message: "认证服务暂未配置，请稍后再试",
    };
  }
}

export async function updateProfileSettings(
  values: ProfileSettingsValues,
): Promise<AccountActionResult> {
  const supabase = getSupabaseClientResult();

  if ("success" in supabase) {
    return supabase;
  }

  const { error } = await supabase.rpc("update_own_profile_settings", {
    input_nickname: values.nickname,
  });

  if (error) {
    return {
      success: false,
      message: getProfileUpdateErrorMessage(error.message),
    };
  }

  return {
    success: true,
    message: "资料已更新",
  };
}

export async function updateAccountEmail(
  userId: string,
  values: EmailRebindValues,
): Promise<AccountActionResult> {
  const supabase = getSupabaseClientResult();

  if ("success" in supabase) {
    return supabase;
  }

  const { error } = await supabase.auth.updateUser({
    email: values.email,
  });

  if (error) {
    return {
      success: false,
      message: getAccountErrorMessage(error),
    };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      email_rebind_requested_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (profileError) {
    return {
      success: false,
      message: "邮箱验证邮件已发送，但冷却时间记录失败，请稍后刷新页面确认",
    };
  }

  return {
    success: true,
    message: "验证邮件已发送，请前往新邮箱完成确认",
  };
}

export async function updateAccountPassword(
  values: PasswordChangeValues,
): Promise<AccountActionResult> {
  const supabase = getSupabaseClientResult();

  if ("success" in supabase) {
    return supabase;
  }

  const { error } = await supabase.auth.updateUser({
    password: values.password,
  });

  if (error) {
    return {
      success: false,
      message: getAccountErrorMessage(error),
    };
  }

  return {
    success: true,
    message: "密码已更新",
  };
}

export async function signOutAccount(): Promise<AccountActionResult> {
  const result = await signOut();

  if (!result.success) {
    return result;
  }

  return {
    success: true,
    message: "已退出登录",
  };
}
