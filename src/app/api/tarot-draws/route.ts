import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { tarotDrawRequestSchema } from "@/features/tarot/schemas/tarotSchema";
import { createTarotDraw } from "@/features/tarot/services/tarotDrawService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const values = tarotDrawRequestSchema.parse(body);

    return NextResponse.json({
      success: true,
      data: createTarotDraw(values.question),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_TAROT_QUESTION",
            message: error.issues[0]?.message ?? "请输入一个具体的问题",
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TAROT_DRAW_FAILED",
          message: "抽牌失败，请稍后再试",
        },
      },
      { status: 500 },
    );
  }
}
