import { CalendarClock, Mail, Sparkles, Ticket } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MEMBERSHIP_CONTACT_EMAIL,
  MEMBERSHIP_LEVEL_CONFIG,
} from "@/features/account/constants";

import type { AccountProfile } from "../types/account";

type MembershipStatusCardProps = {
  profile: AccountProfile;
};

function formatDateTime(value: string | null): string {
  if (!value) {
    return "暂未设置";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function MembershipStatusCard({ profile }: MembershipStatusCardProps) {
  const activeLevel =
    MEMBERSHIP_LEVEL_CONFIG[profile.membershipLevel as keyof typeof MEMBERSHIP_LEVEL_CONFIG] ??
    MEMBERSHIP_LEVEL_CONFIG.free;

  return (
    <Card className="w-full rounded-xl border-0 px-6 py-6 shadow-none">
      <CardHeader className="px-0 pb-4 pt-0">
        <CardTitle className="text-2xl">会员状态</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 px-0">
        <div className="grid gap-4 xl:grid-cols-3">
          {Object.entries(MEMBERSHIP_LEVEL_CONFIG).map(([key, config]) => {
            const isActive = key === profile.membershipLevel;

            return (
              <div
                key={key}
                className={`rounded-xl border p-5 transition-colors ${
                  isActive ? "border-foreground bg-background" : "bg-background/70"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-medium">{config.label}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {config.summary}
                    </p>
                  </div>
                  {isActive ? (
                    <span className="rounded-full bg-foreground px-2 py-1 text-xs text-background">
                      当前
                    </span>
                  ) : null}
                </div>
                <div className="mt-5 space-y-1">
                  <p className="text-2xl font-semibold">{config.priceLabel}</p>
                  <p className="text-sm text-muted-foreground">
                    每日 {config.dailyCredits} 次体验
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-background p-5">
            <Sparkles className="mb-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">当前等级</p>
            <p className="mt-2 text-lg font-medium">{activeLevel.label}</p>
          </div>
          <div className="rounded-xl border bg-background p-5">
            <Ticket className="mb-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">剩余次数</p>
            <p className="mt-2 text-lg font-medium">{profile.remainingCredits} 次</p>
          </div>
          <div className="rounded-xl border bg-background p-5">
            <CalendarClock className="mb-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">到期时间</p>
            <p className="mt-2 text-lg font-medium">{formatDateTime(profile.membershipExpiresAt)}</p>
          </div>
        </div>

        <div className="flex gap-3 rounded-xl border bg-muted/30 p-5 text-sm text-muted-foreground">
          <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>当前先走人工开通，如需升级会员或补充次数，请联系 {MEMBERSHIP_CONTACT_EMAIL}。</p>
        </div>
      </CardContent>
    </Card>
  );
}
