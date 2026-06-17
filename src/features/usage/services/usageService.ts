import {
  BALANCE_AI_READING_MEMBERSHIP_LEVELS,
} from "../constants";
import type {
  AiMembershipLevel,
  AiReadingFeatureType,
  AiReadingQuotaBucket,
  AiReadingUsageBucketSummary,
  AiReadingUsageReservation,
  AiReadingUsageSummary,
} from "../types/usage";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type UsageRpcSuccess = {
  success: true;
  usageRecordId: string;
  membershipLevel: AiMembershipLevel;
  quotaBucket: AiReadingQuotaBucket;
};

type UsageRpcFailure = {
  success: false;
  code: string;
  message?: string;
};

type UsageRpcResult = UsageRpcSuccess | UsageRpcFailure;

type ProfileUsageSource = {
  membership_level: string;
  remaining_credits: number;
};

type UsageRecordSource = {
  quota_bucket: AiReadingQuotaBucket;
  status: "pending" | "completed" | "refunded";
  usage_date: string;
  expires_at: string;
};

type WithAiReadingUsageOptions<TResult> = {
  featureType: AiReadingFeatureType;
  action: () => Promise<TResult>;
};

const AUTH_REQUIRED_MESSAGE = "登录后才可以使用 AI 解读，抽签功能仍可继续使用";
const DAILY_LOT_FREE_LIMIT_MESSAGE = "每日灵签的免费 AI 解读机会已用完";
const SHARED_FREE_LIMIT_MESSAGE = "塔罗、梦境解析、八字简析共享的免费 AI 解读机会已用完";
const BALANCE_LIMIT_MESSAGE = "AI 解读次数已用完，请补充次数后继续使用";

export class UsageServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "UsageServiceError";
  }
}

function getQuotaBucket(featureType: AiReadingFeatureType): AiReadingQuotaBucket {
  return featureType === "daily-lot" ? "daily-lot" : "shared-reading";
}

function normalizeMembershipLevel(
  membershipLevel: string | null | undefined,
): AiMembershipLevel {
  if (
    membershipLevel &&
    BALANCE_AI_READING_MEMBERSHIP_LEVELS.includes(
      membershipLevel as (typeof BALANCE_AI_READING_MEMBERSHIP_LEVELS)[number],
    )
  ) {
    return membershipLevel as AiMembershipLevel;
  }

  return "free";
}

function createUnauthenticatedBucket(
  quotaBucket: AiReadingQuotaBucket,
): AiReadingUsageBucketSummary {
  return {
    quotaBucket,
    limit: 0,
    used: 0,
    remaining: 0,
    resetAt: null,
    isAvailable: false,
    message: AUTH_REQUIRED_MESSAGE,
  };
}

function createFreeBucketSummary(
  quotaBucket: AiReadingQuotaBucket,
  used: number,
): AiReadingUsageBucketSummary {
  const remaining = Math.max(1 - used, 0);

  return {
    quotaBucket,
    limit: 1,
    used,
    remaining,
    resetAt: null,
    isAvailable: remaining > 0,
    message:
      remaining > 0
        ? `免费 AI 解读剩余 ${remaining} 次`
        : quotaBucket === "daily-lot"
          ? DAILY_LOT_FREE_LIMIT_MESSAGE
          : SHARED_FREE_LIMIT_MESSAGE,
  };
}

function createBalanceBucketSummary(
  quotaBucket: AiReadingQuotaBucket,
  remainingCredits: number,
  activePendingCount: number,
): AiReadingUsageBucketSummary {
  const remaining = Math.max(remainingCredits - activePendingCount, 0);

  return {
    quotaBucket,
    limit: remainingCredits,
    used: 0,
    remaining,
    resetAt: null,
    isAvailable: remaining > 0,
    message:
      remaining > 0 ? `AI 解读剩余 ${remaining} 次` : BALANCE_LIMIT_MESSAGE,
    };
}

function getCurrentAiUsageDate(): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function parseUsageRpcResult(value: unknown): UsageRpcResult {
  if (!value || typeof value !== "object" || !("success" in value)) {
    return {
      success: false,
      code: "AI_USAGE_RESERVATION_FAILED",
      message: "AI 解读次数检查失败，请稍后再试",
    };
  }

  const result = value as Record<string, unknown>;

  if (result.success === true) {
    return {
      success: true,
      usageRecordId: String(result.usageRecordId),
      membershipLevel: result.membershipLevel as AiMembershipLevel,
      quotaBucket: result.quotaBucket as AiReadingQuotaBucket,
    };
  }

  return {
    success: false,
    code: typeof result.code === "string" ? result.code : "AI_USAGE_RESERVATION_FAILED",
    message:
      typeof result.message === "string"
        ? result.message
        : "AI 解读次数检查失败，请稍后再试",
  };
}

function getUsageErrorStatus(code: string): number {
  if (code === "AUTH_REQUIRED") {
    return 401;
  }

  if (code === "AI_USAGE_LIMIT_REACHED") {
    return 403;
  }

  return 500;
}

export async function getAiReadingUsageSummary(): Promise<AiReadingUsageSummary> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isAuthenticated: false,
      membershipLevel: null,
      dailyLot: createUnauthenticatedBucket("daily-lot"),
      sharedReading: createUnauthenticatedBucket("shared-reading"),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_level,remaining_credits")
    .eq("id", user.id)
    .maybeSingle<ProfileUsageSource>();

  const membershipLevel = normalizeMembershipLevel(
    profile?.membership_level,
  );

  const nowIso = new Date().toISOString();
  const { data: usageRecords } = await supabase
    .from("usage_records")
    .select("quota_bucket,status,usage_date,expires_at")
    .eq("user_id", user.id)
    .in("status", ["pending", "completed"])
    .returns<UsageRecordSource[]>();

  const records = usageRecords ?? [];
  const currentUsageDate = getCurrentAiUsageDate();

  if (membershipLevel === "basic" || membershipLevel === "plus") {
    const activePendingCount = records.filter(
      (record) => record.status === "pending" && record.expires_at > nowIso,
    ).length;
    const remainingCredits = profile?.remaining_credits ?? 0;

    return {
      isAuthenticated: true,
      membershipLevel,
      dailyLot: createBalanceBucketSummary(
        "daily-lot",
        remainingCredits,
        activePendingCount,
      ),
      sharedReading: createBalanceBucketSummary(
        "shared-reading",
        remainingCredits,
        activePendingCount,
      ),
    };
  }

  const dailyLotUsed = records.filter(
    (record) =>
      record.quota_bucket === "daily-lot" &&
      record.usage_date === currentUsageDate &&
      (record.status === "completed" ||
        (record.status === "pending" && record.expires_at > nowIso)),
  ).length;
  const sharedReadingUsed = records.filter(
    (record) =>
      record.quota_bucket === "shared-reading" &&
      record.usage_date === currentUsageDate &&
      (record.status === "completed" ||
        (record.status === "pending" && record.expires_at > nowIso)),
  ).length;

  return {
    isAuthenticated: true,
    membershipLevel,
    dailyLot: createFreeBucketSummary("daily-lot", dailyLotUsed),
    sharedReading: createFreeBucketSummary("shared-reading", sharedReadingUsed),
  };
}

export async function reserveAiReadingUsage(
  featureType: AiReadingFeatureType,
): Promise<AiReadingUsageReservation> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("reserve_ai_reading_usage", {
    input_feature_type: featureType,
  });

  if (error) {
    throw new UsageServiceError(
      "AI 解读次数检查失败，请稍后再试",
      "AI_USAGE_RESERVATION_FAILED",
      500,
    );
  }

  const result = parseUsageRpcResult(data);

  if (!result.success) {
    throw new UsageServiceError(
      result.message ?? "AI 解读次数检查失败，请稍后再试",
      result.code,
      getUsageErrorStatus(result.code),
    );
  }

  return {
    usageRecordId: result.usageRecordId,
    membershipLevel: result.membershipLevel,
    quotaBucket: result.quotaBucket,
  };
}

export async function completeAiReadingUsage(usageRecordId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("complete_ai_reading_usage", {
    input_usage_record_id: usageRecordId,
  });

  const result = parseUsageRpcResult(data);

  if (error || !result.success) {
    throw new UsageServiceError(
      "AI 解读次数确认失败，请稍后再试",
      "AI_USAGE_COMPLETE_FAILED",
      500,
    );
  }
}

export async function refundAiReadingUsage(usageRecordId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.rpc("refund_ai_reading_usage", {
    input_usage_record_id: usageRecordId,
  });
}

export async function withAiReadingUsage<TResult>({
  featureType,
  action,
}: WithAiReadingUsageOptions<TResult>): Promise<TResult> {
  const reservation = await reserveAiReadingUsage(featureType);

  try {
    const result = await action();
    await completeAiReadingUsage(reservation.usageRecordId);
    return result;
  } catch (error) {
    await refundAiReadingUsage(reservation.usageRecordId);
    throw error;
  }
}

export function getAiReadingQuotaBucket(
  featureType: AiReadingFeatureType,
): AiReadingQuotaBucket {
  return getQuotaBucket(featureType);
}
