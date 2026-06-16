import {
  baziReadingResultSchema,
  type BaziReadingRequest,
  type BaziReadingResult,
} from "../schemas/baziSchema";
import {
  BAZI_READING_SYSTEM_PROMPT,
  createBaziReadingPrompt,
} from "./baziPromptService";

type DeepSeekChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export class BaziReadingServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "BaziReadingServiceError";
  }
}

function getDeepSeekConfig() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";
  const model = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

  if (!apiKey) {
    throw new BaziReadingServiceError("AI 解读服务尚未配置", "AI_SERVICE_NOT_CONFIGURED");
  }

  return { apiKey, baseUrl, model };
}

function parseDeepSeekJson(content: string): BaziReadingResult {
  let parsedContent: unknown;

  try {
    parsedContent = JSON.parse(content);
  } catch {
    throw new BaziReadingServiceError("AI 返回格式异常，请稍后再试", "AI_RESPONSE_INVALID_JSON");
  }

  const result = baziReadingResultSchema.safeParse(parsedContent);

  if (!result.success) {
    throw new BaziReadingServiceError("AI 返回内容不完整，请稍后再试", "AI_RESPONSE_SCHEMA_INVALID");
  }

  return result.data;
}

async function createDeepSeekRequestError(response: Response): Promise<BaziReadingServiceError> {
  if (response.status === 401 || response.status === 403) {
    return new BaziReadingServiceError("DeepSeek API Key 无效或无权限", "AI_SERVICE_UNAUTHORIZED");
  }

  if (response.status === 402) {
    return new BaziReadingServiceError("DeepSeek 账户额度不足或计费不可用", "AI_SERVICE_QUOTA_UNAVAILABLE");
  }

  if (response.status === 429) {
    return new BaziReadingServiceError("DeepSeek 请求过于频繁，请稍后再试", "AI_SERVICE_RATE_LIMITED");
  }

  const responseText = await response.text().catch(() => "");

  return new BaziReadingServiceError(
    responseText ? "DeepSeek 服务返回异常" : "DeepSeek 请求失败",
    "AI_SERVICE_REQUEST_FAILED",
  );
}

export async function createBaziReading(values: BaziReadingRequest): Promise<BaziReadingResult> {
  const { apiKey, baseUrl, model } = getDeepSeekConfig();

  // 本期八字简批不做专业排盘，AI 只负责把已校验输入组织成娱乐向结构化解读。
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
          content: BAZI_READING_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: createBaziReadingPrompt(values),
        },
      ],
      response_format: {
        type: "json_object",
      },
      temperature: 0.65,
    }),
  });

  if (!response.ok) {
    throw await createDeepSeekRequestError(response);
  }

  const data = (await response.json()) as DeepSeekChatResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new BaziReadingServiceError("AI 返回内容为空，请稍后再试", "AI_RESPONSE_EMPTY");
  }

  return parseDeepSeekJson(content);
}
