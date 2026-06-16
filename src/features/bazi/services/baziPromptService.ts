import type { BaziReadingRequest } from "../schemas/baziSchema";

const monthSeasonText = {
  spring: "春季气息偏重，适合从生发、主动、表达与成长角度解读。",
  summer: "夏季气息偏重，适合从热情、行动、外放与节奏角度解读。",
  autumn: "秋季气息偏重，适合从收束、判断、秩序与边界角度解读。",
  winter: "冬季气息偏重，适合从沉静、蓄力、观察与安全感角度解读。",
} as const;

function getSeasonKey(birthDate: string): keyof typeof monthSeasonText {
  const month = Number(birthDate.slice(5, 7));

  if (month >= 3 && month <= 5) {
    return "spring";
  }

  if (month >= 6 && month <= 8) {
    return "summer";
  }

  if (month >= 9 && month <= 11) {
    return "autumn";
  }

  return "winter";
}

function getTimeCompletenessText(values: BaziReadingRequest): string {
  if (values.birthTimeStatus === "exact" && values.birthTime) {
    return `用户提供了出生时间 ${values.birthTime}，可以生成信息较完整的轻量简批。`;
  }

  if (values.birthTimeStatus === "period" && values.birthTimePeriod) {
    return `用户只知道大概出生时段：${values.birthTimePeriod}，需要按时段信息生成轻量简批，并提示精度不如具体时间。`;
  }

  return "用户不知道出生时间，只能生成三柱简批，必须明确提示缺少时柱，结果更偏概览。";
}

export const BAZI_READING_SYSTEM_PROMPT = [
  "你是 DailyXuan 的八字简批解读助手。",
  "你的定位是中文玄学娱乐、自我探索和情感陪伴，不提供医疗、法律、投资、婚姻等重大人生决策建议。",
  "",
  "必须遵守：",
  "1. 本期没有专业八字排盘结果，不得编造四柱、十神、大运、流年、神煞或具体灾祸。",
  "2. 可以基于用户提供的公历出生日期、出生时间完整度、出生地和关注方向，生成轻量娱乐向生日信息简批。",
  "3. 不得使用“必然、一定、注定、百分百、绝对会”等确定性表达。",
  "4. 不得制造恐惧，不得暗示用户必须付费继续解读。",
  "5. 涉及感情、事业、学习、财富时，只能给一般性生活观察和行动建议。",
  "6. 语气温和、克制、有人情味，像陪用户整理状态，而不是严肃断命。",
  "7. 必须严格输出 JSON，不要输出 Markdown，不要输出额外解释。",
].join("\n");

export function createBaziReadingPrompt(values: BaziReadingRequest): string {
  const seasonKey = getSeasonKey(values.birthDate);
  const currentSituation = values.currentSituation || "用户没有补充当前状态。";

  return [
    "请根据以下用户信息，生成一份轻量八字简批报告。",
    "",
    "用户信息：",
    `- 昵称：${values.nickname}`,
    `- 性别：${values.gender}`,
    `- 公历出生日期：${values.birthDate}`,
    `- 出生时间状态：${getTimeCompletenessText(values)}`,
    `- 出生城市：中国大陆，${values.birthCity}`,
    `- 具体出生地：${values.birthPlaceDetail || "用户未填写，不能自行推断。"}`,
    `- 当前关注方向：${values.focusArea}`,
    `- 当前状态补充：${currentSituation}`,
    "- 输出语气：由系统统一控制为温和、克制、轻量娱乐，不由用户选择。",
    "",
    "可使用的轻量参考：",
    `- 季节倾向：${monthSeasonText[seasonKey]}`,
    "- 出生地仅用于增强表达的生活贴近感，不要推断具体隐私或现实事件。",
    "",
    "内容要求：",
    "- 不要声称已经完成专业排盘。",
    "- 不要编造年柱、月柱、日柱、时柱。",
    "- 如果用户只知道大概时段，必须在 confidence_note 中说明时间精度限制。",
    "- 如果用户不知道出生时间，必须在 confidence_note 中说明这是三柱简批，缺少时柱。",
    "- 建议要具体、温和、可执行。",
    "- 所有内容仅供娱乐和自我探索参考。",
    "",
    "JSON 字段必须包含：",
    "greeting, input_summary, profile_keywords, personality_overview, element_tendency, focus_reading, action_suggestions, confidence_note, reminder",
    "",
    "JSON 格式示例：",
    JSON.stringify(
      {
        greeting: "温柔开场，称呼用户昵称。",
        input_summary: "对用户出生信息和关注方向的摘要。",
        profile_keywords: ["关键词一", "关键词二", "关键词三"],
        personality_overview: "性格与关系模式的轻量解读。",
        element_tendency: "基于季节倾向的五行式表达，但不声称专业排盘。",
        focus_reading: "围绕用户关注方向的解读。",
        action_suggestions: ["建议一", "建议二", "建议三"],
        confidence_note: "信息完整度说明。",
        reminder: "娱乐向边界提醒。",
      },
      null,
      2,
    ),
  ].join("\n");
}
