import { getFirestore } from "firebase-admin/firestore";
import { HttpsError } from "firebase-functions/v2/https";
import { generateJson, generateJsonWithTools, GEMINI_API_KEY } from "./gemini";
import { FINANCIAL_TOOL_DECLARATIONS, runFinancialTool } from "./financialTools";
import { DETERMINISTIC_MERCHANT_CATEGORIES } from "./merchantCategories";
import {
  GOAL_SCHEMA,
  CHAT_RESPONSE_SCHEMA,
  INSIGHT_SCHEMA,
  RECEIPT_SCHEMA,
  TRANSACTION_SCHEMA,
  isRecord,
  normalizeMerchantKey,
  validateInsight,
  validateChatResponse,
  validateTransactionDrafts,
  type TransactionDraft,
} from "./schemas";
import { onAiCall } from "./security";

const MODEL_OPTIONS = { secrets: [GEMINI_API_KEY], timeoutSeconds: 60 };
const FRIENDLY_OUTPUT_ERROR = "We couldn't safely understand that. Please try again.";

function invalidInput(): never {
  throw new HttpsError("invalid-argument", "Check the information and try again.", { reason: "INVALID_INPUT" });
}

function requireText(data: unknown, maxLength: number): string {
  if (!isRecord(data) || typeof data.text !== "string") return invalidInput();
  const text = data.text.trim();
  if (!text || text.length > maxLength) return invalidInput();
  return text;
}

function applyMerchantPrecedence(transactions: TransactionDraft[], overrides: Map<string, string>): TransactionDraft[] {
  return transactions.map((transaction) => {
    const merchant = transaction.merchant.trim() || transaction.note.trim();
    const normalizedMerchant = merchant.toLowerCase();
    const learnedCategory = [...overrides.entries()].find(([key]) => key && normalizedMerchant.includes(key))?.[1];
    const deterministicCategory = Object.entries(DETERMINISTIC_MERCHANT_CATEGORIES).find(([key]) => normalizedMerchant.includes(key))?.[1];
    return {
      ...transaction,
      merchant,
      category: learnedCategory ?? deterministicCategory ?? transaction.category,
    };
  });
}

export const parseTransactionText = onAiCall<unknown, { transactions: TransactionDraft[] }>(async (uid, data) => {
  const text = requireText(data, 4000);
  const db = getFirestore();
  const overridesSnapshot = await db.collection("users").doc(uid).collection("merchantOverrides").limit(100).get();
  const overrides = new Map<string, string>();
  for (const document of overridesSnapshot.docs) {
    const merchantKey = document.id;
    const category = document.get("category");
    if (merchantKey && typeof category === "string" && category.length <= 60 && text.toLowerCase().includes(merchantKey.replaceAll("-", " ").toLowerCase())) {
      overrides.set(merchantKey.replaceAll("-", " ").toLowerCase(), category);
    }
  }
  const knownMerchantHints = Object.entries(DETERMINISTIC_MERCHANT_CATEGORIES).filter(([merchant]) => text.toLowerCase().includes(merchant)).map(([merchant, category]) => `${merchant}=${category}`);
  const learnedHints = [...overrides].map(([merchant, category]) => `${merchant}=${category}`);
  const parsed = await generateJson<unknown>({
    prompt: `Extract Indian personal finance transactions from this text. Understand Hindi, Hinglish and English. Return only the schema. Never guess missing amounts, dates, payment methods, categories or transaction types: return null for a field not supported by the text. Dates must be YYYY-MM-DD when stated or relative to today (${new Date().toISOString().slice(0, 10)}); otherwise null. Allowed expense categories: Food & Dining, Transport, Utilities, Entertainment, Shopping, Housing, Health, Education, Other. Allowed income categories: Salary, Pocket Money, Freelance, Gift, Refund, Other. Payment methods: UPI, Credit Card, Debit Card, Cash, Bank Transfer. Text: ${text}\nUser merchant categories (highest priority): ${learnedHints.join(", ") || "none"}\nKnown merchant mappings: ${knownMerchantHints.join(", ") || "none"}`,
    schema: TRANSACTION_SCHEMA,
  });
  try {
    return { transactions: applyMerchantPrecedence(validateTransactionDrafts(parsed), overrides) };
  } catch {
    throw new HttpsError("failed-precondition", FRIENDLY_OUTPUT_ERROR, { reason: "INVALID_AI_OUTPUT" });
  }
}, MODEL_OPTIONS);

function validateReceipt(value: unknown) {
  if (!isRecord(value)) throw new Error("Invalid output");
  const { type, merchant, amount, date, paymentMethod, category, items, note, confidence } = value;
  if (type !== null && type !== "income" && type !== "expense") throw new Error("Invalid output");
  if (merchant !== null && (typeof merchant !== "string" || merchant.length > 100)) throw new Error("Invalid output");
  if (amount !== null && (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0 || amount > 100_000_000)) throw new Error("Invalid output");
  if (date !== null && (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date)) throw new Error("Invalid output");
  if (paymentMethod !== null && !["UPI", "Credit Card", "Debit Card", "Cash", "Bank Transfer"].includes(String(paymentMethod))) throw new Error("Invalid output");
  if (category !== null && !["Food & Dining", "Transport", "Utilities", "Entertainment", "Shopping", "Housing", "Health", "Education", "Other"].includes(String(category))) throw new Error("Invalid output");
  if (!Array.isArray(items) || items.length > 30 || !items.every((item) => typeof item === "string" && item.length <= 120)) throw new Error("Invalid output");
  if (typeof note !== "string" || note.length > 300 || typeof confidence !== "number" || confidence < 0 || confidence > 1) throw new Error("Invalid output");
  return { type, merchant, amount, date, paymentMethod, category, items, note, confidence };
}

export const scanReceipt = onAiCall<unknown, ReturnType<typeof validateReceipt>>(async (_uid, data) => {
  if (!isRecord(data) || typeof data.imageData !== "string" || data.imageData.length > 1_000_000 || !["image/jpeg", "image/png", "image/webp"].includes(String(data.mimeType))) return invalidInput();
  const imageData = data.imageData.replace(/^data:image\/(?:jpeg|png|webp);base64,/, "");
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(imageData)) return invalidInput();
  const parsed = await generateJson<unknown>({
    prompt: "Read this receipt or UPI screenshot. Return only visible information. Use null for details you cannot read; never infer missing values. Use an ISO date only when a date is visible. Set income or expense only when the screenshot clearly shows money received or paid; otherwise use null. Classify into a common Indian expense category only when supported by the receipt.",
    schema: RECEIPT_SCHEMA,
    image: { mimeType: data.mimeType as "image/jpeg" | "image/png" | "image/webp", data: imageData },
  });
  try { return validateReceipt(parsed); } catch { throw new HttpsError("failed-precondition", FRIENDLY_OUTPUT_ERROR, { reason: "INVALID_AI_OUTPUT" }); }
}, MODEL_OPTIONS);

function validateGoal(value: unknown) {
  if (!isRecord(value) || typeof value.name !== "string" || !value.name.trim() || value.name.length > 100 || typeof value.targetAmount !== "number" || !Number.isFinite(value.targetAmount) || value.targetAmount <= 0 || value.targetAmount > 1_000_000_000 || typeof value.targetDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value.targetDate) || Number.isNaN(Date.parse(`${value.targetDate}T00:00:00Z`)) || new Date(`${value.targetDate}T00:00:00Z`).toISOString().slice(0, 10) !== value.targetDate || value.targetDate <= new Date().toISOString().slice(0, 10) || typeof value.confidence !== "number" || value.confidence < 0 || value.confidence > 1) throw new Error("Invalid output");
  return { name: value.name.trim(), targetAmount: value.targetAmount, targetDate: value.targetDate, confidence: value.confidence };
}

export const parseSavingsGoal = onAiCall<unknown, ReturnType<typeof validateGoal>>(async (_uid, data) => {
  const text = requireText(data, 1200);
  const parsed = await generateJson<unknown>({
    prompt: `Extract a savings goal from this text. Currency is INR. Do not calculate savings progress or required monthly amount. Resolve relative dates from today (${new Date().toISOString().slice(0, 10)}). Return an ISO target date and use low confidence if a required detail is unclear. Text: ${text}`,
    schema: GOAL_SCHEMA,
  });
  try { return validateGoal(parsed); } catch { throw new HttpsError("failed-precondition", FRIENDLY_OUTPUT_ERROR, { reason: "INVALID_AI_OUTPUT" }); }
}, MODEL_OPTIONS);

export const generateWeeklyInsight = onAiCall<unknown, ReturnType<typeof validateInsight>>(async (uid) => {
  const db = getFirestore();
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 6)).toISOString().slice(0, 10);
  const today = now.toISOString().slice(0, 10);
  const txSnapshot = await db.collection("users").doc(uid).collection("transactions").where("date", ">=", start).where("date", "<=", today).get();
  const categoryTotals = new Map<string, number>();
  let totalExpenses = 0;
  for (const document of txSnapshot.docs) {
    const data = document.data();
    if (data.type === "income" || typeof data.amount !== "number" || !Number.isFinite(data.amount) || data.amount < 0 || typeof data.category !== "string") continue;
    totalExpenses += data.amount;
    categoryTotals.set(data.category, (categoryTotals.get(data.category) ?? 0) + data.amount);
  }
  const summary = { totalExpenses, topCategories: [...categoryTotals].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([category, amount]) => ({ category, amount })) };
  const parsed = await generateJson<unknown>({
    prompt: `Write a brief, friendly weekly spending summary and up to three practical suggestions. Use only these deterministic values; do not invent totals or claim causation. If the values are zero, say there is not enough recorded spending yet. Data: ${JSON.stringify(summary)}`,
    schema: INSIGHT_SCHEMA,
  });
  try { return validateInsight(parsed); } catch { throw new HttpsError("failed-precondition", FRIENDLY_OUTPUT_ERROR, { reason: "INVALID_AI_OUTPUT" }); }
}, MODEL_OPTIONS);

export const askYourMoney = onAiCall<unknown, { answer: string; followups: string[]; toolResults: Array<{ tool: string; result: unknown }> }>(async (uid, data) => {
  if (!isRecord(data) || !Array.isArray(data.messages) || data.messages.length < 1 || data.messages.length > 8) return invalidInput();
  const messages = data.messages.map((message) => {
    if (!isRecord(message) || (message.role !== "user" && message.role !== "assistant") || typeof message.text !== "string" || !message.text.trim() || message.text.length > 1200) return invalidInput();
    return { role: message.role === "assistant" ? "model" as const : "user" as const, parts: [{ text: message.text.trim() }] };
  });
  if (messages[messages.length - 1].role !== "user") return invalidInput();
  const toolResults: Array<{ tool: string; result: unknown }> = [];
  const response = await generateJsonWithTools<unknown>({
    contents: [
      { role: "user", parts: [{ text: "You are Ask your money, a friendly guide for this user's finances. Use the available server tools before answering any question about their personal financial data. The tools return deterministic summaries; do not alter or invent their numbers. Do not ask for private credentials. Keep answers concise and in plain language. Return strict JSON with answer and followups." }] },
      ...messages,
    ],
    schema: CHAT_RESPONSE_SCHEMA,
    tools: FINANCIAL_TOOL_DECLARATIONS,
    runTool: async (name, args) => {
      if (!["getSpending", "getBudgetStatus", "getTrend", "getTransactions"].includes(name)) return { error: "That data tool is unavailable." };
      const result = await runFinancialTool(uid, name, args);
      toolResults.push({ tool: name, result });
      return result;
    },
  });
  try {
    return { ...validateChatResponse(response), toolResults };
  } catch {
    throw new HttpsError("failed-precondition", FRIENDLY_OUTPUT_ERROR, { reason: "INVALID_AI_OUTPUT" });
  }
}, MODEL_OPTIONS);
