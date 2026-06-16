import { NextResponse } from "next/server";

import { getAiReadingUsageSummary } from "@/features/usage/services/usageService";

export async function GET() {
  try {
    const summary = await getAiReadingUsageSummary();

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "AI_USAGE_SUMMARY_FAILED",
          message: "AI 解读次数读取失败，请稍后再试",
        },
      },
      { status: 500 },
    );
  }
}
