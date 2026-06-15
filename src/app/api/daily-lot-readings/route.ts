import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { dailyLotReadingRequestSchema } from "@/features/daily-lot/schemas/dailyLotSchema";
import {
  createDailyLotReading,
  DailyLotReadingServiceError,
} from "@/features/daily-lot/services/dailyLotReadingService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const values = dailyLotReadingRequestSchema.parse(body);
    const reading = await createDailyLotReading(values);

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
            code: "INVALID_DAILY_LOT_READING_REQUEST",
            message: "解签参数不完整，请重新抽签后再试",
          },
        },
        { status: 400 },
      );
    }

    if (error instanceof DailyLotReadingServiceError) {
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

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DAILY_LOT_READING_FAILED",
          message: "解签生成失败，请稍后再试",
        },
      },
      { status: 500 },
    );
  }
}
