import { z } from "zod";

import {
  TAROT_QUESTION_MAX_LENGTH,
  TAROT_QUESTION_MIN_LENGTH,
} from "../constants";

export const tarotDrawRequestSchema = z.object({
  question: z
    .string()
    .trim()
    .min(TAROT_QUESTION_MIN_LENGTH, `问题至少需要 ${TAROT_QUESTION_MIN_LENGTH} 个字`)
    .max(TAROT_QUESTION_MAX_LENGTH, `问题不能超过 ${TAROT_QUESTION_MAX_LENGTH} 个字`),
});

export type TarotDrawRequest = z.infer<typeof tarotDrawRequestSchema>;

export const tarotReadingRequestSchema = z.object({
  question: tarotDrawRequestSchema.shape.question,
  cards: z
    .array(
      z.object({
        position: z.object({
          index: z.number().int().min(1).max(3),
          title: z.string().min(1),
          description: z.string().min(1),
        }),
        card: z.object({
          id: z.string().min(1),
          name: z.string().min(1),
          englishName: z.string().min(1),
          arcana: z.enum(["major", "minor"]),
          suit: z.enum(["major", "wands", "cups", "swords", "pentacles"]),
          keywords: z.array(z.string().min(1)).min(1),
        }),
        orientation: z.enum(["upright", "reversed"]),
      }),
    )
    .length(3),
});

export const tarotReadingResultSchema = z.object({
  summary: z.string().min(40).max(320),
  current: z.string().min(60).max(360),
  obstacle: z.string().min(60).max(360),
  advice: z.string().min(60).max(360),
  action_advice: z.string().min(60).max(360),
  lucky_keywords: z.tuple([
    z.string().min(1).max(8),
    z.string().min(1).max(8),
    z.string().min(1).max(8),
  ]),
});

export type TarotReadingRequest = z.infer<typeof tarotReadingRequestSchema>;
export type TarotReadingResult = z.infer<typeof tarotReadingResultSchema>;
