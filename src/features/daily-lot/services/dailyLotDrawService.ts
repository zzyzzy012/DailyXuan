import { randomInt } from "node:crypto";

import { DAILY_LOT_POOL } from "../constants";
import type { DailyLotDrawRequest } from "../schemas/dailyLotSchema";
import type { DailyLotDrawResult } from "../types/dailyLot";

function getBeijingDateText(date: Date): string {
  const dateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = dateParts.find((part) => part.type === "year")?.value;
  const month = dateParts.find((part) => part.type === "month")?.value;
  const day = dateParts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("无法获取北京时间日期");
  }

  return `${year}-${month}-${day}`;
}

export function createDailyLotDraw(values: DailyLotDrawRequest): DailyLotDrawResult {
  const lot = DAILY_LOT_POOL[randomInt(DAILY_LOT_POOL.length)];

  return {
    nickname: values.nickname ?? null,
    birthDate: values.birthDate,
    today: getBeijingDateText(new Date()),
    focus: values.focus,
    lot,
    createdAt: new Date().toISOString(),
  };
}
