export type TarotArcana = "major" | "minor";

export type TarotSuit = "major" | "wands" | "cups" | "swords" | "pentacles";

export type TarotOrientation = "upright" | "reversed";

export type TarotCard = {
  id: string;
  name: string;
  englishName: string;
  arcana: TarotArcana;
  suit: TarotSuit;
  keywords: string[];
};

export type TarotSpreadPosition = {
  index: number;
  title: string;
  description: string;
};

export type TarotDrawnCard = {
  position: TarotSpreadPosition;
  card: TarotCard;
  orientation: TarotOrientation;
};

export type TarotDrawResult = {
  question: string;
  greetingName: string;
  cards: TarotDrawnCard[];
  createdAt: string;
};

export type TarotReadingResult = {
  summary: string;
  current: string;
  obstacle: string;
  advice: string;
  action_advice: string;
  lucky_keywords: [string, string, string];
};
