export type DailyLotFocus = "综合" | "感情" | "事业/学习" | "财运" | "人际" | "心情";

export type DailyLotLevel = "上签" | "中上签" | "中签" | "平签" | "小醒签";

export type DailyLot = {
  id: string;
  title: string;
  level: DailyLotLevel;
  poem: string;
  theme: string;
  keywords: [string, string, string];
};

export type DailyLotDrawResult = {
  nickname: string | null;
  birthDate: string;
  today: string;
  focus: DailyLotFocus;
  lot: DailyLot;
  createdAt: string;
};

export type DailyLotReadingResult = {
  lot_title: string;
  lot_level: DailyLotLevel;
  lot_poem: string;
  summary: string;
  mood: string;
  focus_reading: string;
  action_advice: string;
  lucky_keywords: [string, string, string];
  lucky_color: string;
};
