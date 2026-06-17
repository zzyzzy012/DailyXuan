import { redirect } from "next/navigation";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AccountPageContent } from "@/features/account/components/AccountPageContent";
import type { AccountProfile, AccountUser } from "@/features/account/types/account";
import { getAiReadingUsageSummary } from "@/features/usage/services/usageService";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfileRow = {
  id: string;
  nickname: string | null;
  membership_level: string;
  remaining_credits: number;
  membership_expires_at: string | null;
  profile_updated_at: string | null;
  email_rebind_requested_at: string | null;
  created_at: string;
};

type LegacyProfileRow = {
  id: string;
  nickname: string | null;
  membership_level: string;
  remaining_credits: number;
  membership_expires_at?: string | null;
  created_at: string;
};

async function loadAccountProfile(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
): Promise<AccountProfile | null> {
  const fullProfileQuery = await supabase
    .from("profiles")
    .select(
      "id,nickname,membership_level,remaining_credits,membership_expires_at,profile_updated_at,email_rebind_requested_at,created_at",
    )
    .eq("id", userId)
    .maybeSingle<ProfileRow>();

  if (fullProfileQuery.data) {
    return {
      id: fullProfileQuery.data.id,
      nickname: fullProfileQuery.data.nickname,
      membershipLevel: fullProfileQuery.data.membership_level,
      remainingCredits: fullProfileQuery.data.remaining_credits,
      membershipExpiresAt: fullProfileQuery.data.membership_expires_at,
      profileUpdatedAt: fullProfileQuery.data.profile_updated_at,
      emailRebindRequestedAt: fullProfileQuery.data.email_rebind_requested_at,
      createdAt: fullProfileQuery.data.created_at,
    };
  }

  const legacyProfileQuery = await supabase
    .from("profiles")
    .select("id,nickname,membership_level,remaining_credits,membership_expires_at,created_at")
    .eq("id", userId)
    .maybeSingle<LegacyProfileRow>();

  if (legacyProfileQuery.data) {
    return {
      id: legacyProfileQuery.data.id,
      nickname: legacyProfileQuery.data.nickname,
      membershipLevel: legacyProfileQuery.data.membership_level,
      remainingCredits: legacyProfileQuery.data.remaining_credits,
      membershipExpiresAt: legacyProfileQuery.data.membership_expires_at ?? null,
      profileUpdatedAt: null,
      emailRebindRequestedAt: null,
      createdAt: legacyProfileQuery.data.created_at,
    };
  }

  return null;
}

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await loadAccountProfile(supabase, user.id);

  const accountUser: AccountUser = {
    id: user.id,
    email: user.email ?? null,
    emailConfirmedAt: user.email_confirmed_at ?? null,
    createdAt: user.created_at,
  };

  const accountProfile: AccountProfile = profile ?? {
    id: user.id,
    nickname: null,
    membershipLevel: "free",
    remainingCredits: 0,
    membershipExpiresAt: null,
    profileUpdatedAt: null,
    emailRebindRequestedAt: null,
    createdAt: user.created_at,
  };
  const usageSummary = await getAiReadingUsageSummary();

  return (
    <>
      <SiteHeader />
      <AccountPageContent
        user={accountUser}
        profile={accountProfile}
        usageSummary={usageSummary}
      />
      <SiteFooter />
    </>
  );
}
