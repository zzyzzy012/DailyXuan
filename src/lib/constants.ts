import {
  BookOpenText,
  CalendarHeart,
  Coins,
  CreditCard,
  History,
  Moon,
  Sparkles,
} from "lucide-react";

export const SITE_NAME = "DailyXuan";

export const SITE_DESCRIPTION =
  "轻量级玄学娱乐与自我探索工具，提供今日灵签、梦境解析、塔罗占卜与八字简批。";

export const NAV_ITEMS = [
  { label: "今日灵签", href: "/daily-lot" },
  { label: "梦境解析", href: "/dream" },
  { label: "塔罗占卜", href: "/tarot" },
  { label: "八字简批", href: "#bazi" },
  { label: "历史报告", href: "#history" },
  { label: "会员/次数", href: "#membership" },
] as const;

export const FEATURE_ENTRIES = [
  {
    id: "daily-lot",
    title: "今日灵签",
    description: "输入出生日期并选择今日关注，抽取一支适合日常阅读的轻量灵签。",
    icon: CalendarHeart,
    badge: "每日免费",
    cta: "抽取灵签",
    href: "/daily-lot",
  },
  {
    id: "dream",
    title: "梦境解析",
    description: "把梦境内容、醒来感受和近期压力，转成更贴近生活的情绪提示。",
    icon: Moon,
    badge: "共享免费",
    cta: "解析梦境",
    href: "/dream",
  },
  {
    id: "tarot",
    title: "塔罗占卜",
    description: "围绕一个具体问题抽取 1、3 或 5 张牌，生成牌面解读和行动建议。",
    icon: Sparkles,
    badge: "优先开发",
    cta: "开始抽牌",
    href: "/tarot",
  },
  {
    id: "bazi",
    title: "八字简批",
    description: "基于出生年月日时、出生地和性别，提供娱乐向性格与近期提醒。",
    icon: BookOpenText,
    badge: "娱乐简析",
    cta: "了解简批",
    href: "#bazi",
  },
] as const;

export const USAGE_RULES = [
  {
    title: "今日灵签",
    description: "抽签本身免费，AI 解签成功后再按后续规则消耗次数。",
    icon: CalendarHeart,
  },
  {
    title: "其他解读",
    description: "梦境解析、塔罗占卜、八字简批共享每日 1 次免费额度。",
    icon: Coins,
  },
  {
    title: "历史报告",
    description: "登录后可保存和复看历史报告，复看不消耗免费或付费次数。",
    icon: History,
  },
  {
    title: "会员/次数",
    description: "免费额度用完后，可通过会员或次数包继续生成深度解读。",
    icon: CreditCard,
  },
] as const;

export const DISCLAIMER_TEXT =
  "本站内容仅供娱乐与自我探索参考，不构成医疗、法律、投资或重大人生决策建议。";
