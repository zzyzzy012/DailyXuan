import { z } from "zod";

import {
  DREAM_FOCUS_POINT_MAX_LENGTH,
  DREAM_INTERPRETATION_STYLE_OPTIONS,
  DREAM_RECENT_STATE_MAX_LENGTH,
  DREAM_TEXT_MAX_LENGTH,
  DREAM_TEXT_MIN_LENGTH,
  DREAM_WAKEUP_FEELING_MAX_LENGTH,
} from "../constants";

const optionalTextSchema = (maxLength: number, message: string) =>
  z
    .string()
    .trim()
    .max(maxLength, message)
    .optional()
    .transform((value) => (value ? value : undefined));

export const dreamInterpretationStyleSchema = z.enum(DREAM_INTERPRETATION_STYLE_OPTIONS);

export const dreamReadingRequestSchema = z.object({
  dreamText: z
    .string()
    .trim()
    .min(DREAM_TEXT_MIN_LENGTH, `梦境内容至少需要 ${DREAM_TEXT_MIN_LENGTH} 个字，请补充一些细节`)
    .max(DREAM_TEXT_MAX_LENGTH, `梦境内容不能超过 ${DREAM_TEXT_MAX_LENGTH} 个字`),
  recentState: optionalTextSchema(
    DREAM_RECENT_STATE_MAX_LENGTH,
    `近期状态不能超过 ${DREAM_RECENT_STATE_MAX_LENGTH} 个字`,
  ),
  wakeupFeeling: optionalTextSchema(
    DREAM_WAKEUP_FEELING_MAX_LENGTH,
    `醒后感受不能超过 ${DREAM_WAKEUP_FEELING_MAX_LENGTH} 个字`,
  ),
  focusPoint: optionalTextSchema(
    DREAM_FOCUS_POINT_MAX_LENGTH,
    `重点片段不能超过 ${DREAM_FOCUS_POINT_MAX_LENGTH} 个字`,
  ),
  interpretationStyle: dreamInterpretationStyleSchema.default("情绪陪伴与象征结合"),
});

export const dreamReadingResultSchema = z.object({
  keywords: z.tuple([
    z.string().min(1).max(8),
    z.string().min(1).max(8),
    z.string().min(1).max(8),
    z.string().min(1).max(8),
  ]),
  coreEmotion: z.string().min(30).max(220),
  symbolicReading: z.string().min(60).max(320),
  realLifeReflection: z.string().min(60).max(320),
  gentleReminder: z.string().min(40).max(240),
  actionSuggestion: z.string().min(40).max(240),
  selfQuestion: z.string().min(10).max(80),
  disclaimer: z.string().min(20).max(120),
});

export type DreamReadingRequest = z.infer<typeof dreamReadingRequestSchema>;
export type DreamReadingResult = z.infer<typeof dreamReadingResultSchema>;
