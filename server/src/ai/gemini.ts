import { isRecord } from "./schemas";

export const GEMINI_MODEL = "gemini-3.8-flash";

interface GenerateJsonOptions {
  prompt: string;
  schema: Record<string, unknown>;
  image?: { mimeType: "image/jpeg" | "image/png" | "image/webp"; data: string };
  tools?: Array<Record<string, unknown>>;
}

export interface ChatTurn {
  role: "user" | "model";
  text: string;
}

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  return key;
}

const RETRY_DELAY_MS = 2000;
const MAX_RETRIES = 2;

async function fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
  let lastResponse: Response | undefined;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      console.log(`[GEMINI] Retrying after 503 (attempt ${attempt}/${MAX_RETRIES})`);
    }
    let response: Response;
    try {
      response = await fetch(url, { ...init, signal: AbortSignal.timeout(30_000) });
    } catch {
      throw new Error("AI_UNAVAILABLE");
    }
    if (response.status !== 503) return response;
    lastResponse = response;
  }
  return lastResponse!;
}

export async function generateJson<T>({ prompt, schema, image, tools }: GenerateJsonOptions): Promise<T> {
  const parts: Array<Record<string, unknown>> = [{ text: prompt }];
  if (image) parts.push({ inlineData: { mimeType: image.mimeType, data: image.data } });

  let response: Response;
  try {
    response = await fetchWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": getApiKey() },
        body: JSON.stringify({
          contents: [{ parts }],
          ...(tools ? { tools } : {}),
          generationConfig: {
            temperature: 0.15,
            maxOutputTokens: 1400,
            responseMimeType: "application/json",
            responseSchema: schema,
          },
        }),
      }
    );
  } catch {
    throw new Error("AI_UNAVAILABLE");
  }

  if (!response.ok) {
    try {
      const errBody = await response.json();
      console.error("[GEMINI] generateJson error", response.status, JSON.stringify(errBody).slice(0, 400));
    } catch {
      console.error("[GEMINI] generateJson error", response.status, "(no body)");
    }
    throw new Error("AI_UNAVAILABLE");
  }

  try {
    const payload = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
    if (!text || text.length > 20_000) throw new Error("Invalid response");
    return JSON.parse(text) as T;
  } catch {
    throw new Error("INVALID_AI_OUTPUT");
  }
}

export async function generateJsonWithTools<T>(options: {
  systemInstruction?: string;
  contents: Array<{ role: "user" | "model"; parts: Array<Record<string, unknown>> }>;
  schema: Record<string, unknown>;
  tools: Array<Record<string, unknown>>;
  runTool: (name: string, args: unknown) => Promise<unknown>;
}): Promise<T> {
  let contents = options.contents;
  let hasToolResults = false;
  for (let iteration = 0; iteration < 4; iteration += 1) {
    let response: Response;
    try {
      response = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": getApiKey() },
          body: JSON.stringify({
            contents,
            ...(options.systemInstruction
              ? { systemInstruction: { parts: [{ text: options.systemInstruction }] } }
              : {}),
            ...(hasToolResults ? {} : { tools: options.tools }),
            generationConfig: hasToolResults
              ? { temperature: 0.15, maxOutputTokens: 1600, responseMimeType: "application/json", responseSchema: options.schema }
              : { temperature: 0.15, maxOutputTokens: 1600 },
          }),
        }
      );
    } catch {
      throw new Error("AI_UNAVAILABLE");
    }
    if (!response.ok) {
      try {
        const errBody = await response.json();
        console.error("[GEMINI] generateJsonWithTools error", response.status, JSON.stringify(errBody).slice(0, 400));
      } catch {
        console.error("[GEMINI] generateJsonWithTools error", response.status, "(no body)");
      }
      throw new Error("AI_UNAVAILABLE");
    }

    let candidate: { content?: { role?: "user" | "model"; parts?: Array<Record<string, unknown>> } } | undefined;
    try {
      const payload = (await response.json()) as { candidates?: Array<typeof candidate> };
      candidate = payload.candidates?.[0];
    } catch {
      throw new Error("INVALID_AI_OUTPUT");
    }
    const parts = candidate?.content?.parts ?? [];
    const calls = parts.flatMap((part) =>
      isRecord(part.functionCall) && typeof part.functionCall.name === "string"
        ? [{ name: part.functionCall.name, args: part.functionCall.args ?? {} }]
        : []
    );
    if (calls.length) {
      if (hasToolResults) throw new Error("INVALID_AI_OUTPUT");
      if (!candidate?.content || calls.length > 4) throw new Error("INVALID_AI_OUTPUT");
      contents = [...contents, { role: candidate.content.role === "user" ? "user" : "model", parts: candidate.content.parts ?? [] }];
      const functionResponses = await Promise.all(
        calls.map(async (call) => ({
          functionResponse: { name: call.name, response: { result: await options.runTool(call.name, call.args) } },
        }))
      );
      contents = [...contents, { role: "user", parts: functionResponses }];
      hasToolResults = true;
      continue;
    }

    try {
      if (!hasToolResults) throw new Error("Missing tool result");
      const text = parts.map((part) => (typeof part.text === "string" ? part.text : "")).join("").trim();
      if (!text || text.length > 20_000) throw new Error("Invalid response");
      return JSON.parse(text) as T;
    } catch {
      throw new Error("INVALID_AI_OUTPUT");
    }
  }
  throw new Error("INVALID_AI_OUTPUT");
}
