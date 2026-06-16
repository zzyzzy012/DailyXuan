import { provinceAndCityData } from "element-china-area-data";
import type { DataItem } from "element-china-area-data";

export const BAZI_NICKNAME_MIN_LENGTH = 1;
export const BAZI_NICKNAME_MAX_LENGTH = 16;
export const BAZI_CITY_MIN_LENGTH = 2;
export const BAZI_CITY_MAX_LENGTH = 20;
export const BAZI_LOCATION_CODE_MIN_LENGTH = 2;
export const BAZI_LOCATION_CODE_MAX_LENGTH = 12;
export const BAZI_BIRTH_PLACE_DETAIL_MAX_LENGTH = 40;
export const BAZI_CURRENT_SITUATION_MAX_LENGTH = 160;

export const BAZI_GENDER_OPTIONS = ["女性", "男性", "不便透露"] as const;

export const BAZI_BIRTH_TIME_STATUS_OPTIONS = [
  {
    value: "exact",
    label: "知道具体时间",
    description: "可填写小时和分钟，报告会按信息完整版本生成。",
  },
  {
    value: "period",
    label: "只知道大概时段",
    description: "选择一个两小时左右的出生时段，报告会按时段简批。",
  },
  {
    value: "unknown",
    label: "不知道出生时间",
    description: "生成三柱简批，并提示缺少时柱的限制。",
  },
] as const;

export const BAZI_BIRTH_TIME_PERIOD_OPTIONS = [
  "子时 23:00-00:59",
  "丑时 01:00-02:59",
  "寅时 03:00-04:59",
  "卯时 05:00-06:59",
  "辰时 07:00-08:59",
  "巳时 09:00-10:59",
  "午时 11:00-12:59",
  "未时 13:00-14:59",
  "申时 15:00-16:59",
  "酉时 17:00-18:59",
  "戌时 19:00-20:59",
  "亥时 21:00-22:59",
] as const;

export const BAZI_FOCUS_AREA_OPTIONS = [
  "综合",
  "感情",
  "事业",
  "学习",
  "财富",
  "人际",
  "情绪",
  "自我成长",
] as const;

export type BaziAreaOption = {
  value: string;
  label: string;
  code: string;
};

function toAreaOption(item: DataItem): BaziAreaOption {
  return {
    value: item.label,
    label: item.label,
    code: item.value,
  };
}

export const BAZI_PROVINCE_OPTIONS = provinceAndCityData
  .filter((province) => province.children && province.children.length > 0)
  .map(toAreaOption);

export const DEFAULT_BAZI_BIRTH_PROVINCE = "浙江省";
export const DEFAULT_BAZI_BIRTH_CITY = "杭州市";

export function getBaziCityOptionsByProvince(provinceName: string): BaziAreaOption[] {
  const province = provinceAndCityData.find((item) => item.label === provinceName);

  return province?.children?.map(toAreaOption) ?? [];
}

export function getBaziCityOption(
  provinceName: string,
  cityName: string,
): BaziAreaOption | undefined {
  return getBaziCityOptionsByProvince(provinceName).find((city) => city.value === cityName);
}

export function isValidBaziBirthLocation(values: {
  birthProvince: string;
  birthCity: string;
  birthLocationCode: string;
}): boolean {
  const city = getBaziCityOption(values.birthProvince, values.birthCity);

  return Boolean(city && city.code === values.birthLocationCode);
}

export const DEFAULT_BAZI_BIRTH_LOCATION_CODE =
  getBaziCityOption(DEFAULT_BAZI_BIRTH_PROVINCE, DEFAULT_BAZI_BIRTH_CITY)?.code ?? "";
