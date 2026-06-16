import type { AiReadingUsageBucketSummary } from "../types/usage";

type UsageLimitNoticeProps = {
  bucket: AiReadingUsageBucketSummary | null;
};

export function UsageLimitNotice({ bucket }: UsageLimitNoticeProps) {
  if (!bucket) {
    return <p className="text-sm text-muted-foreground">正在读取 AI 解读次数...</p>;
  }

  return (
    <p
      className={
        bucket.isAvailable
          ? "text-sm text-muted-foreground"
          : "text-sm text-destructive"
      }
    >
      {bucket.message}
    </p>
  );
}
