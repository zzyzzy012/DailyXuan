import {
  dailyLotReadingResultSchema,
  type DailyLotReadingRequest,
  type DailyLotReadingResult,
} from "../schemas/dailyLotSchema";
import {
  createDailyLotReadingPrompt,
  DAILY_LOT_READING_SYSTEM_PROMPT,
} from "./dailyLotPromptService";

type DeepSeekChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export class DailyLotReadingServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "DailyLotReadingServiceError";
  }
}

function getDeepSeekConfig() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";
  const model = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

  if (!apiKey) {
    throw new DailyLotReadingServiceError("AI 解签服务尚未配置", "AI_SERVICE_NOT_CONFIGURED");
  }

  return { apiKey, baseUrl, model };
}

function parseDeepSeekJson(content: string): DailyLotReadingResult {
  let parsedContent: unknown;

  try {
    parsedContent = JSON.parse(content);
  } catch {
    throw new DailyLotReadingServiceError("AI 返回格式异常，请稍后再试", "AI_RESPONSE_INVALID_JSON");
  }

  const result = dailyLotReadingResultSchema.safeParse(parsedContent);

  if (!result.success) {
    throw new DailyLotReadingServiceError("AI 返回内容不完整，请稍后再试", "AI_RESPONSE_SCHEMA_INVALID");
  }

  return result.data;
}

async function createDeepSeekRequestError(response: Response): Promise<DailyLotReadingServiceError> {
  if (response.status === 401 || response.status === 403) {
    return new DailyLotReadingServiceError("DeepSeek API Key 无效或无权限", "AI_SERVICE_UNAUTHORIZED");
  }

  if (response.status === 402) {
    return new DailyLotReadingServiceError("DeepSeek 账户额度不足或计费不可用", "AI_SERVICE_QUOTA_UNAVAILABLE");
  }

  if (response.status === 429) {
    return new DailyLotReadingServiceError("DeepSeek 请求过于频繁，请稍后再试", "AI_SERVICE_RATE_LIMITED");
  }

  const responseText = await response.text().catch(() => "");

  return new DailyLotReadingServiceError(
    responseText ? "DeepSeek 服务返回异常" : "DeepSeek 请求失败",
    "AI_SERVICE_REQUEST_FAILED",
  );
}

export async function createDailyLotReading(
  values: DailyLotReadingRequest,
): Promise<DailyLotReadingResult> {
  const { apiKey, baseUrl, model } = getDeepSeekConfig();

  // DeepSeek 使用 OpenAI-compatible chat completions 接口；解签成功后才适合接入后续次数扣减。
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: DAILY_LOT_READING_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: createDailyLotReadingPrompt(values),
        },
      ],
      response_format: {
        type: "json_object",
      },
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw await createDeepSeekRequestError(response);
  }

  const data = (await response.json()) as DeepSeekChatResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new DailyLotReadingServiceError("AI 返回内容为空，请稍后再试", "AI_RESPONSE_EMPTY");
  }

  return parseDeepSeekJson(content);
}
