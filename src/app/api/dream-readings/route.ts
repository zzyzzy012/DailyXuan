import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { dreamReadingRequestSchema } from "@/features/dream/schemas/dreamSchema";
import {
  createDreamReading,
  DreamReadingServiceError,
} from "@/features/dream/services/dreamReadingService";
import {
  UsageServiceError,
  withAiReadingUsage,
} from "@/features/usage/services/usageService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const values = dreamReadingRequestSchema.parse(body);
    const reading = await withAiReadingUsage({
      featureType: "dream",
      action: () => createDreamReading(values),
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
            code: "INVALID_DREAM_READING_REQUEST",
            message: error.issues[0]?.message ?? "梦境内容不完整，请检查后再试",
          },
        },
        { status: 400 },
      );
    }

    if (error instanceof DreamReadingServiceError) {
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
          code: "DREAM_READING_FAILED",
          message: "梦境解析失败，请稍后再试",
        },
      },
      { status: 500 },
    );
  }
}
