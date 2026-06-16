import type { BaziReadingResult } from "../schemas/baziSchema";

export type BaziReadingApiResponse =
  | {
      success: true;
      data: BaziReadingResult;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };
