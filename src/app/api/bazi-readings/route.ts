import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { baziReadingRequestSchema } from "@/features/bazi/schemas/baziSchema";
import {
  BaziReadingServiceError,
  createBaziReading,
} from "@/features/bazi/services/baziReadingService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const values = baziReadingRequestSchema.parse(body);
    const reading = await createBaziReading(values);

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
            code: "INVALID_BAZI_READING_REQUEST",
            message: "八字简批信息不完整，请检查后再试",
          },
        },
        { status: 400 },
      );
    }

    if (error instanceof BaziReadingServiceError) {
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
          code: "BAZI_READING_FAILED",
          message: "八字简批生成失败，请稍后再试",
        },
      },
      { status: 500 },
    );
  }
}
