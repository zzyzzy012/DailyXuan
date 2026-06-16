import {
  BookOpenText,
  CalendarHeart,
  Coins,
  CreditCard,
  Moon,
  Sparkles,
} from "lucide-react";

export const SITE_NAME = "DailyXuan";

export const SITE_DESCRIPTION =
  "汇集灵签、塔罗、解梦与运势解读的日常玄学陪伴工具。";

export const NAV_ITEMS = [
  { label: "今日灵签", href: "/daily-lot" },
  { label: "梦境解析", href: "/dream" },
  { label: "塔罗占卜", href: "/tarot" },
  { label: "八字简批", href: "/bazi" },
  { label: "会员/次数", href: "#membership" },
] as const;

export const FEATURE_ENTRIES = [
  {
    id: "daily-lot",
    title: "今日灵签",
    description: "给今天一句提醒。在忙碌与琐碎之间，为自己保留片刻停顿。一支灵签，一份今日启发。",
    icon: CalendarHeart,
    badge: "今日启示",
    cta: "抽取灵签",
    href: "/daily-lot",
  },
  {
    id: "dream",
    title: "梦境解析",
    description: "听听潜意识的声音。梦境并非预言，而是情绪与记忆的映照。从梦中寻找那些被忽略的线索。",
    icon: Moon,
    badge: "梦境探索",
    cta: "解析梦境",
    href: "/dream",
  },
  {
    id: "tarot",
    title: "塔罗占卜",
    description: "换一个角度看问题。围绕此刻最关心的事，获得一次清晰而克制的解读。答案仍在你手中。",
    icon: Sparkles,
    badge: "问题解读",
    cta: "开始抽牌",
    href: "/tarot",
  },
  {
    id: "bazi",
    title: "八字简批",
    description: "认识自己，而非定义自己。从出生信息出发，探索性格特质与人生节奏。仅供参考，也值得思考。",
    icon: BookOpenText,
    badge: "自我观察",
    cta: "了解简批",
    href: "/bazi",
  },
] as const;

export const USAGE_RULES = [
  {
    title: "今日灵签",
    description: "今日灵签可先免费抽取；如需 AI 解读，普通用户有每日 1 次独立免费机会。",
    icon: CalendarHeart,
  },
  {
    title: "梦境/塔罗/八字",
    description: "梦境解析、塔罗占卜、八字简批每日共享 1 次免费 AI 解读机会。",
    icon: Coins,
  },
  {
    title: "会员次数",
    description: "免费机会用完后，可开通会员或补充次数继续生成 AI 解读。",
    icon: CreditCard,
  },
] as const;

export const DISCLAIMER_TEXT =
  "DailyXuan 的灵签、梦境、塔罗与八字内容仅供娱乐、情绪整理与自我探索参考，不构成医疗、法律、投资或重大人生决策建议；重要事项请结合现实情况独立判断。";
