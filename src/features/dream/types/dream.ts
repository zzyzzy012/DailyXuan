import type { DREAM_INTERPRETATION_STYLE_OPTIONS } from "../constants";

export type DreamInterpretationStyle = (typeof DREAM_INTERPRETATION_STYLE_OPTIONS)[number];

export type DreamReadingRequest = {
  dreamText: string;
  recentState?: string;
  wakeupFeeling?: string;
  focusPoint?: string;
  interpretationStyle: DreamInterpretationStyle;
};

export type DreamReadingResult = {
  keywords: [string, string, string, string];
  coreEmotion: string;
  symbolicReading: string;
  realLifeReflection: string;
  gentleReminder: string;
  actionSuggestion: string;
  selfQuestion: string;
  disclaimer: string;
};
