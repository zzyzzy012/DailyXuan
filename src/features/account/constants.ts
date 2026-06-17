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
export const MEMBERSHIP_CONTACT_EMAIL = "DailyXuan@zanaya.cc";

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
    label: "免费体验",
    priceLabel: "免费体验",
    dailyCredits: 0,
    quotaLabel: "共 2 次免费 AI 解读",
    summary: "登录后可体验 2 次 AI 解读：今日灵签 1 次，梦境、塔罗、八字共享 1 次。",
  },
  basic: {
    label: "每日体验会员",
    priceLabel: "9.9 元/月",
    dailyCredits: 5,
    quotaLabel: "每日 5 次 AI 解读",
    summary: "适合轻量使用，每天可生成 5 次 AI 解读，覆盖灵签、梦境、塔罗和八字。",
  },
  plus: {
    label: "深度体验会员",
    priceLabel: "19.9 元/月",
    dailyCredits: 15,
    quotaLabel: "每日 15 次 AI 解读",
    summary: "适合高频使用，每天可生成 15 次 AI 解读，适合经常探索多个模块。",
  },
} as const;

export type MembershipLevel = keyof typeof MEMBERSHIP_LEVEL_CONFIG;
