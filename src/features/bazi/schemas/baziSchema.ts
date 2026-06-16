import { z } from "zod";

import {
  BAZI_BIRTH_PLACE_DETAIL_MAX_LENGTH,
  BAZI_BIRTH_TIME_PERIOD_OPTIONS,
  BAZI_BIRTH_TIME_STATUS_OPTIONS,
  BAZI_CITY_MAX_LENGTH,
  BAZI_CITY_MIN_LENGTH,
  BAZI_CURRENT_SITUATION_MAX_LENGTH,
  BAZI_FOCUS_AREA_OPTIONS,
  BAZI_GENDER_OPTIONS,
  BAZI_LOCATION_CODE_MAX_LENGTH,
  BAZI_LOCATION_CODE_MIN_LENGTH,
  BAZI_NICKNAME_MAX_LENGTH,
  BAZI_NICKNAME_MIN_LENGTH,
  isValidBaziBirthLocation,
} from "../constants";

const birthTimeStatusValues = BAZI_BIRTH_TIME_STATUS_OPTIONS.map((option) => option.value) as [
  "exact",
  "period",
  "unknown",
];

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^\d{2}:\d{2}$/;

function isReasonableBirthDate(value: string): boolean {
  if (!datePattern.test(value)) {
    return false;
  }

  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return false;
  }

  const today = new Date();

  return year >= 1900 && date <= today;
}

function isValidBirthTime(value: string): boolean {
  if (!timePattern.test(value)) {
    return false;
  }

  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

export const baziReadingRequestSchema = z
  .object({
    nickname: z
      .string()
      .trim()
      .min(BAZI_NICKNAME_MIN_LENGTH, "请输入昵称")
      .max(BAZI_NICKNAME_MAX_LENGTH, `昵称不能超过 ${BAZI_NICKNAME_MAX_LENGTH} 个字`),
    gender: z.enum(BAZI_GENDER_OPTIONS),
    birthDate: z.string().trim().refine(isReasonableBirthDate, "请选择有效的公历出生日期"),
    birthTimeStatus: z.enum(birthTimeStatusValues),
    birthTime: z.string().trim().refine(isValidBirthTime, "请选择有效的出生时间").optional(),
    birthTimePeriod: z.enum(BAZI_BIRTH_TIME_PERIOD_OPTIONS).optional(),
    birthProvince: z
      .string()
      .trim()
      .min(BAZI_CITY_MIN_LENGTH, "请选择出生省份")
      .max(BAZI_CITY_MAX_LENGTH, `出生省份不能超过 ${BAZI_CITY_MAX_LENGTH} 个字`),
    birthCity: z
      .string()
      .trim()
      .min(BAZI_CITY_MIN_LENGTH, "请选择出生城市")
      .max(BAZI_CITY_MAX_LENGTH, `出生城市不能超过 ${BAZI_CITY_MAX_LENGTH} 个字`),
    birthLocationCode: z
      .string()
      .trim()
      .min(BAZI_LOCATION_CODE_MIN_LENGTH, "请选择有效的出生城市")
      .max(BAZI_LOCATION_CODE_MAX_LENGTH, "出生城市编码格式异常"),
    birthPlaceDetail: z
      .string()
      .trim()
      .max(BAZI_BIRTH_PLACE_DETAIL_MAX_LENGTH, `具体出生地不能超过 ${BAZI_BIRTH_PLACE_DETAIL_MAX_LENGTH} 个字`)
      .optional(),
    focusArea: z.enum(BAZI_FOCUS_AREA_OPTIONS),
    currentSituation: z
      .string()
      .trim()
      .max(BAZI_CURRENT_SITUATION_MAX_LENGTH, `补充内容不能超过 ${BAZI_CURRENT_SITUATION_MAX_LENGTH} 个字`)
      .optional(),
  })
  .superRefine((values, context) => {
    if (values.birthTimeStatus === "exact" && !values.birthTime) {
      context.addIssue({
        code: "custom",
        path: ["birthTime"],
        message: "知道具体时间时，请选择出生时间",
      });
    }

    if (values.birthTimeStatus === "period" && !values.birthTimePeriod) {
      context.addIssue({
        code: "custom",
        path: ["birthTimePeriod"],
        message: "只知道大概时段时，请选择出生时段",
      });
    }

    if (!isValidBaziBirthLocation(values)) {
      context.addIssue({
        code: "custom",
        path: ["birthCity"],
        message: "请选择有效的出生省市",
      });
    }
  });

export const baziReadingResultSchema = z.object({
  greeting: z.string().min(20).max(220),
  input_summary: z.string().min(20).max(260),
  profile_keywords: z.tuple([
    z.string().min(1).max(8),
    z.string().min(1).max(8),
    z.string().min(1).max(8),
  ]),
  personality_overview: z.string().min(80).max(420),
  element_tendency: z.string().min(80).max(420),
  focus_reading: z.string().min(80).max(420),
  action_suggestions: z.tuple([
    z.string().min(20).max(160),
    z.string().min(20).max(160),
    z.string().min(20).max(160),
  ]),
  confidence_note: z.string().min(30).max(260),
  reminder: z.string().min(30).max(260),
});

export type BaziReadingRequest = z.infer<typeof baziReadingRequestSchema>;
export type BaziReadingResult = z.infer<typeof baziReadingResultSchema>;
