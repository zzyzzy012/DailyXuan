import {
  CreditCard,
  Shield,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type AccountSection = "overview" | "membership" | "profile" | "security";

export const PROFILE_UPDATE_INTERVAL_DAYS = 7;
export const EMAIL_REBIND_INTERVAL_DAYS = 15;
export const MEMBERSHIP_CONTACT_EMAIL = "zz@163.com";

export const ACCOUNT_SECTION_OPTIONS = [
  {
    value: "overview",
    label: "账号概览",
    description: "查看邮箱、等级和注册信息",
    icon: Shield,
  },
  {
    value: "membership",
    label: "会员状态",
    description: "查看三档会员与人工开通说明",
    icon: Sparkles,
  },
  {
    value: "profile",
    label: "资料设置",
    description: "更新昵称并查看冷却时间",
    icon: UserRound,
  },
  {
    value: "security",
    label: "安全设置",
    description: "邮箱换新、密码修改和退出登录",
    icon: CreditCard,
  },
] as const satisfies ReadonlyArray<{
  value: AccountSection;
  label: string;
  description: string;
  icon: LucideIcon;
}>;

export const MEMBERSHIP_LEVEL_CONFIG = {
  free: {
    label: "普通用户",
    priceLabel: "0 元",
    dailyCredits: 0,
    summary: "默认账号状态，适合先体验基础流程。",
  },
  daily_5: {
    label: "每日体验会员",
    priceLabel: "9.9 元",
    dailyCredits: 5,
    summary: "适合轻量使用，每日可体验 5 次。",
  },
  daily_15: {
    label: "深度体验会员",
    priceLabel: "19.9 元",
    dailyCredits: 15,
    summary: "适合高频使用，每日可体验 15 次。",
  },
} as const;

export type MembershipLevel = keyof typeof MEMBERSHIP_LEVEL_CONFIG;
