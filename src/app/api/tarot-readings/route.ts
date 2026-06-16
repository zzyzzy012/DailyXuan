import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { tarotReadingRequestSchema } from "@/features/tarot/schemas/tarotSchema";
import {
  createTarotReading,
  TarotReadingServiceError,
} from "@/features/tarot/services/tarotReadingService";
import {
  UsageServiceError,
  withAiReadingUsage,
} from "@/features/usage/services/usageService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const values = tarotReadingRequestSchema.parse(body);
    const reading = await withAiReadingUsage({
      featureType: "tarot",
      action: () => createTarotReading(values),
    });

    return NextResponse.json({
      success: true,
      data: reading,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_TAROT_READING_REQUEST",
            message: "解读参数不完整，请重新抽牌后再试",
          },
        },
        { status: 400 },
      );
    }

    if (error instanceof TarotReadingServiceError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: 500 },
      );
    }

    if (error instanceof UsageServiceError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TAROT_READING_FAILED",
          message: "解读生成失败，请稍后再试",
        },
      },
      { status: 500 },
    );
  }
}
