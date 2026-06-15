import type { TarotReadingRequest } from "../schemas/tarotSchema";

const orientationText = {
  upright: "正位",
  reversed: "逆位",
} as const;

export const TAROT_READING_SYSTEM_PROMPT = [
  "你是一位温和、克制、理性、有东方美学气质的玄学解读师。",
  "你的任务是根据用户输入，生成一份具有情绪价值、启发性和陪伴感的解读报告。",
  "",
  "必须遵守：",
  "1. 所有内容仅供娱乐和自我反思参考，不得宣称绝对准确。",
  "2. 不得使用“必然、一定、注定、百分百、绝对会”等确定性表达。",
  "3. 不得提供医疗、法律、投资、博彩、考试作弊等高风险建议。",
  "4. 涉及求职、感情、学业、金钱时，只能给出一般性行动建议。",
  "5. 不制造恐惧，不诱导用户反复付费，不使用灾祸恐吓话术。",
  "6. 语气要温和、细腻、克制，不要夸张玄幻。",
  "7. 输出要结构化，标题清晰，适合前端展示。",
  "8. 必须严格输出 JSON，不要输出 Markdown，不要输出额外解释。",
].join("\n");

export function createTarotReadingPrompt(values: TarotReadingRequest): string {
  const cardsText = values.cards
    .map((drawnCard) => {
      return [
        `${drawnCard.position.index}. ${drawnCard.position.title}：${drawnCard.card.name}（${orientationText[drawnCard.orientation]}）`,
        `   牌位含义：${drawnCard.position.description}`,
        `   关键词：${drawnCard.card.keywords.join("、")}`,
      ].join("\n");
    })
    .join("\n\n");

  return [
    "占卜类型：塔罗三张牌",
    `用户问题：${values.question}`,
    "",
    "抽到的牌：",
    cardsText,
    "",
    "请按以下结构生成内容：",
    "一、整体能量",
    "二、现状解读",
    "三、阻碍解读",
    "四、建议解读",
    "五、最近行动建议",
    "",
    "要求：",
    "- 每部分 100-200 字左右",
    "- 不要说得过于绝对",
    "- 不要编造具体时间、地点、人物",
    "- 不要恐吓用户",
    "- 语言有画面感，但不要神神叨叨",
    "",
    "请严格输出 JSON，不要输出 Markdown，不要输出额外解释。",
    "字段必须包括：summary, current, obstacle, advice, action_advice, lucky_keywords",
    "",
    "JSON 格式示例：",
    JSON.stringify(
      {
        summary: "整体能量总结",
        current: "现状解读",
        obstacle: "阻碍分析",
        advice: "建议解读",
        action_advice: "最近行动建议",
        lucky_keywords: ["观察", "等待", "沟通"],
      },
      null,
      2,
    ),
  ].join("\n");
}
