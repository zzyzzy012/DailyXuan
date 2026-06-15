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
