import { AccountShell } from "./AccountShell";
import { AccountOverviewCard } from "./AccountOverviewCard";
import { MembershipStatusCard } from "./MembershipStatusCard";
import { ProfileSettingsForm } from "./ProfileSettingsForm";
import { SecuritySettingsCard } from "./SecuritySettingsCard";
import type { AccountProfile, AccountUser } from "../types/account";
import type { AiReadingUsageSummary } from "@/features/usage/types/usage";

type AccountPageContentProps = {
  user: AccountUser;
  profile: AccountProfile;
  usageSummary: AiReadingUsageSummary;
};

export function AccountPageContent({
  user,
  profile,
  usageSummary,
}: AccountPageContentProps) {
  return (
    <main className="flex-1 bg-muted/30">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="text-sm text-muted-foreground">Account Center</p>
          <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">个人中心</h1>
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">
            管理账号资料、会员状态和安全设置。
          </p>
        </div>

        <AccountShell
          sections={{
            overview: (
              <AccountOverviewCard
                user={user}
                profile={profile}
                usageSummary={usageSummary}
              />
            ),
            membership: (
              <MembershipStatusCard
                profile={profile}
                usageSummary={usageSummary}
              />
            ),
            profile: <ProfileSettingsForm profile={profile} />,
            security: <SecuritySettingsCard profile={profile} />,
          }}
        />
      </section>
    </main>
  );
}
