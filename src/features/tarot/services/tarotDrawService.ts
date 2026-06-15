import { randomInt } from "node:crypto";

import { TAROT_CARDS, TAROT_SPREAD_POSITIONS } from "../constants";
import type { TarotDrawResult, TarotDrawnCard, TarotOrientation } from "../types/tarot";

function getRandomOrientation(): TarotOrientation {
  return randomInt(2) === 0 ? "upright" : "reversed";
}

export function createTarotDraw(question: string): TarotDrawResult {
  const remainingCards = [...TAROT_CARDS];

  const cards: TarotDrawnCard[] = TAROT_SPREAD_POSITIONS.map((position) => {
    const cardIndex = randomInt(remainingCards.length);
    const [card] = remainingCards.splice(cardIndex, 1);

    return {
      position,
      card,
      orientation: getRandomOrientation(),
    };
  });

  return {
    question,
    greetingName: "来访的朋友",
    cards,
    createdAt: new Date().toISOString(),
  };
}
