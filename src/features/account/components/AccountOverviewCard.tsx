import { BadgeCheck, Mail, ShieldCheck, Sparkles, Ticket } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MEMBERSHIP_LEVEL_CONFIG } from "@/features/account/constants";
import type { AiReadingUsageSummary } from "@/features/usage/types/usage";

import type { AccountProfile, AccountUser } from "../types/account";

type AccountOverviewCardProps = {
  user: AccountUser;
  profile: AccountProfile;
  usageSummary: AiReadingUsageSummary;
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

function getMembershipLabel(level: string): string {
  return MEMBERSHIP_LEVEL_CONFIG[level as keyof typeof MEMBERSHIP_LEVEL_CONFIG]?.label ?? level;
}

function getRemainingUsageText(
  profile: AccountProfile,
  usageSummary: AiReadingUsageSummary,
): string {
  if (usageSummary.membershipLevel === "basic" || usageSummary.membershipLevel === "plus") {
    return `${profile.remainingCredits} 次`;
  }

  return `今日剩余 ${
    usageSummary.dailyLot.remaining + usageSummary.sharedReading.remaining
  }/2 次`;
}

export function AccountOverviewCard({
  user,
  profile,
  usageSummary,
}: AccountOverviewCardProps) {
  const items = [
    {
      icon: Mail,
      label: "邮箱",
      value: user.email ?? "暂未绑定",
    },
    {
      icon: BadgeCheck,
      label: "邮箱验证",
      value: user.emailConfirmedAt ? "已验证" : "未验证",
      badge: user.emailConfirmedAt ? "default" : "secondary",
    },
    {
      icon: Sparkles,
      label: "会员等级",
      value: getMembershipLabel(profile.membershipLevel),
    },
    {
      icon: Ticket,
      label: "剩余次数",
      value: getRemainingUsageText(profile, usageSummary),
    },
    {
      icon: ShieldCheck,
      label: "注册时间",
      value: formatDateTime(profile.createdAt || user.createdAt),
    },
  ] as const;

  return (
    <Card className="w-full rounded-xl border-0 px-6 py-6 shadow-none">
      <CardHeader className="px-0 pb-4 pt-0">
        <CardTitle className="text-2xl">账号概览</CardTitle>
      </CardHeader>
      <CardContent className="px-0 grid gap-4 md:grid-cols-3 xl:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex min-h-28 items-start gap-4 rounded-xl border bg-background p-5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 space-y-2">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {item.label}
              </p>
              {"badge" in item ? (
                <Badge variant={item.badge}>{item.value}</Badge>
              ) : (
                <p className="break-words text-lg font-medium leading-7">{item.value}</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
