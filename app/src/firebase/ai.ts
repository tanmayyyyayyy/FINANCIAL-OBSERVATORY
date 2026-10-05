import { auth } from "./firebase";

export interface AiTransactionDraft {
  type: "income" | "expense" | null;
  amount: number | null;
  category: string | null;
  merchant: string;
  paymentMethod: "UPI" | "Credit Card" | "Debit Card" | "Cash" | "Bank Transfer" | null;
  date: string | null;
  note: string;
  confidence: number;
}

export interface MoneyChatResult {
  answer: string;
  followups: string[];
  toolResults: Array<{ tool: string; result: unknown }>;
}

export interface ReceiptDraft {
  type: "income" | "expense" | null;
  merchant: string | null;
  amount: number | null;
  date: string | null;
  paymentMethod: AiTransactionDraft["paymentMethod"] | null;
  category: string | null;
  items: string[];
  note: string;
  confidence: number;
}

// Configurable Render API base URL: defaults to production backend in prod, or localhost:5001 in dev
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? "https://smart-expense-tracker-1f68.onrender.com"
    : "http://localhost:5001")
).replace(/\/$/, "");

async function getAuthToken(): Promise<string> {
  const currentUser = auth?.currentUser;
  if (!currentUser) {
    throw new Error("Please sign in to use this AI feature.");
  }
  return await currentUser.getIdToken();
}

async function postApi<T>(path: string, body: unknown): Promise<T> {
  const token = await getAuthToken();
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Unable to connect to AI server. Please verify the backend is running.");
  }

  if (!response.ok) {
    let errorMessage = "AI couldn't respond right now. Try again.";
    try {
      const errJson = (await response.json()) as { message?: string; error?: string };
      if (errJson?.message) errorMessage = errJson.message;
    } catch {
      // Use fallback
    }
    throw new Error(errorMessage);
  }

  return (await response.json()) as T;
}

export async function parseTransactionText(text: string): Promise<AiTransactionDraft[]> {
  const data = await postApi<{ transactions: AiTransactionDraft[] }>("/api/ai/parse-transaction", { text });
  return data.transactions;
}

export async function askYourMoney(
  messages: Array<{ role: "user" | "assistant"; text: string }>
): Promise<MoneyChatResult> {
  return await postApi<MoneyChatResult>("/api/ai/ask", { messages });
}

export async function generateWeeklyInsight(): Promise<{ summary: string; suggestions: string[] }> {
  return await postApi<{ summary: string; suggestions: string[] }>("/api/ai/weekly-insight", {});
}

export async function parseSavingsGoal(
  text: string
): Promise<{ name: string; targetAmount: number; targetDate: string; confidence: number }> {
  return await postApi<{ name: string; targetAmount: number; targetDate: string; confidence: number }>("/api/ai/parse-goal", { text });
}

export async function scanReceipt(imageData: string, mimeType: string): Promise<ReceiptDraft> {
  return await postApi<ReceiptDraft>("/api/ai/scan-receipt", { imageData, mimeType });
}
