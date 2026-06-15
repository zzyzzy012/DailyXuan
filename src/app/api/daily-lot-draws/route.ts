import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { dailyLotDrawRequestSchema } from "@/features/daily-lot/schemas/dailyLotSchema";
import { createDailyLotDraw } from "@/features/daily-lot/services/dailyLotDrawService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const values = dailyLotDrawRequestSchema.parse(body);

    return NextResponse.json({
      success: true,
      data: createDailyLotDraw(values),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_DAILY_LOT_DRAW_REQUEST",
            message: error.issues[0]?.message ?? "请检查灵签输入信息",
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DAILY_LOT_DRAW_FAILED",
          message: "抽签失败，请稍后再试",
        },
      },
      { status: 500 },
    );
  }
}
