export type AiReadingFeatureType = "daily-lot" | "tarot" | "dream" | "bazi";

export type AiReadingQuotaBucket = "daily-lot" | "shared-reading";

export type AiUsageStatus = "pending" | "completed" | "refunded";

export type AiMembershipLevel = "free" | "basic" | "plus";

export type AiReadingUsageBucketSummary = {
  quotaBucket: AiReadingQuotaBucket;
  limit: number;
  used: number;
  remaining: number;
  resetAt: string | null;
  isAvailable: boolean;
  message: string;
};

export type AiReadingUsageSummary =
  | {
      isAuthenticated: false;
      membershipLevel: null;
      dailyLot: AiReadingUsageBucketSummary;
      sharedReading: AiReadingUsageBucketSummary;
    }
  | {
      isAuthenticated: true;
      membershipLevel: AiMembershipLevel;
      dailyLot: AiReadingUsageBucketSummary;
      sharedReading: AiReadingUsageBucketSummary;
    };

export type AiReadingUsageReservation = {
  usageRecordId: string;
  membershipLevel: AiMembershipLevel;
  quotaBucket: AiReadingQuotaBucket;
};

export type UsageRecordsApiResponse =
  | {
      success: true;
      data: AiReadingUsageSummary;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };
