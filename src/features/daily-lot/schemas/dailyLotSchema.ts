import { z } from "zod";

import {
  DAILY_LOT_FOCUS_OPTIONS,
  DAILY_LOT_NICKNAME_MAX_LENGTH,
} from "../constants";

const dailyLotFocusSchema = z.enum(DAILY_LOT_FOCUS_OPTIONS);

const dailyLotLevelSchema = z.enum(["上签", "中上签", "中签", "平签", "小醒签"]);

const dailyLotSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(20),
  level: dailyLotLevelSchema,
  poem: z.string().min(6).max(40),
  theme: z.string().min(1).max(12),
  keywords: z.tuple([
    z.string().min(1).max(8),
    z.string().min(1).max(8),
    z.string().min(1).max(8),
  ]),
});

export const dailyLotDrawRequestSchema = z.object({
  nickname: z
    .string()
    .trim()
    .max(DAILY_LOT_NICKNAME_MAX_LENGTH, `昵称不能超过 ${DAILY_LOT_NICKNAME_MAX_LENGTH} 个字`)
    .optional()
    .transform((value) => (value ? value : undefined)),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "请选择出生日期"),
  focus: dailyLotFocusSchema.default("综合"),
});

export const dailyLotDrawResultSchema = z.object({
  nickname: z.string().min(1).max(DAILY_LOT_NICKNAME_MAX_LENGTH).nullable(),
  birthDate: dailyLotDrawRequestSchema.shape.birthDate,
  today: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  focus: dailyLotFocusSchema,
  lot: dailyLotSchema,
  createdAt: z.string().datetime(),
});

export const dailyLotReadingRequestSchema = z.object({
  nickname: dailyLotDrawRequestSchema.shape.nickname,
  birthDate: dailyLotDrawRequestSchema.shape.birthDate,
  today: dailyLotDrawResultSchema.shape.today,
  focus: dailyLotFocusSchema,
  lot: dailyLotSchema,
});

export const dailyLotReadingResultSchema = z.object({
  lot_title: z.string().min(1).max(20),
  lot_level: dailyLotLevelSchema,
  lot_poem: z.string().min(6).max(40),
  summary: z.string().min(40).max(220),
  mood: z.string().min(40).max(220),
  focus_reading: z.string().min(40).max(220),
  action_advice: z.string().min(40).max(220),
  lucky_keywords: z.tuple([
    z.string().min(1).max(8),
    z.string().min(1).max(8),
    z.string().min(1).max(8),
  ]),
  lucky_color: z.string().min(2).max(12),
});

export type DailyLotDrawRequest = z.infer<typeof dailyLotDrawRequestSchema>;
export type DailyLotReadingRequest = z.infer<typeof dailyLotReadingRequestSchema>;
export type DailyLotReadingResult = z.infer<typeof dailyLotReadingResultSchema>;
