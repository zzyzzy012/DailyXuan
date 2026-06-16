import type { AiReadingFeatureType, AiReadingQuotaBucket } from "./types/usage";

export const AI_READING_FEATURE_QUOTA_BUCKET: Record<
  AiReadingFeatureType,
  AiReadingQuotaBucket
> = {
  "daily-lot": "daily-lot",
  tarot: "shared-reading",
  dream: "shared-reading",
  bazi: "shared-reading",
};

export const FREE_AI_READING_BUCKET_LIMIT = 1;

export const BALANCE_AI_READING_MEMBERSHIP_LEVELS = ["basic", "plus"] as const;

export const AI_READING_PENDING_EXPIRE_MINUTES = 20;
