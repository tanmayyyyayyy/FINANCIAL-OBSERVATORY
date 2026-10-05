export const PAYMENT_METHODS = ["UPI", "Credit Card", "Debit Card", "Cash", "Bank Transfer"] as const;
export const CATEGORIES = ["Food & Dining", "Transport", "Utilities", "Entertainment", "Shopping", "Housing", "Health", "Education", "Other"] as const;
export const INCOME_CATEGORIES = ["Salary", "Pocket Money", "Freelance", "Gift", "Refund", "Other"] as const;

export interface TransactionDraft {
  type: "income" | "expense" | null;
  amount: number | null;
  category: string | null;
  merchant: string;
  paymentMethod: (typeof PAYMENT_METHODS)[number] | null;
  date: string | null;
  note: string;
  confidence: number;
}

export const TRANSACTION_SCHEMA = {
  type: "object",
  properties: {
    transactions: {
      type: "array",
      minItems: 1,
      maxItems: 10,
      items: {
        type: "object",
        properties: {
          type: { type: ["string", "null"], enum: ["income", "expense", null] },
          amount: { type: ["number", "null"], minimum: 0.01, maximum: 100000000 },
          category: { type: ["string", "null"], enum: [...CATEGORIES, ...INCOME_CATEGORIES, null] },
          merchant: { type: "string" },
          paymentMethod: { type: ["string", "null"], enum: [...PAYMENT_METHODS, null] },
          date: { type: ["string", "null"] },
          note: { type: "string" },
          confidence: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["type", "amount", "category", "merchant", "paymentMethod", "date", "note", "confidence"],
      },
    },
  },
  required: ["transactions"],
} as const;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeMerchantKey(value: string): string {
  return value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

export function validateTransactionDrafts(value: unknown): TransactionDraft[] {
  if (!isRecord(value) || !Array.isArray(value.transactions) || value.transactions.length < 1 || value.transactions.length > 10) throw new Error("Invalid output");
  return value.transactions.map((item): TransactionDraft => {
    if (!isRecord(item)) throw new Error("Invalid output");
    const { type, amount, category, merchant, paymentMethod, date, note, confidence } = item;
    if (type !== null && type !== "income" && type !== "expense") throw new Error("Invalid output");
    if (amount !== null && (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0 || amount > 100_000_000)) throw new Error("Invalid output");
    if (category !== null && typeof category !== "string") throw new Error("Invalid output");
    if (category !== null && ![...CATEGORIES, ...INCOME_CATEGORIES].includes(category as (typeof CATEGORIES)[number] | (typeof INCOME_CATEGORIES)[number])) throw new Error("Invalid output");
    if (typeof merchant !== "string" || merchant.length > 100) throw new Error("Invalid output");
    if (paymentMethod !== null && (typeof paymentMethod !== "string" || !PAYMENT_METHODS.includes(paymentMethod as (typeof PAYMENT_METHODS)[number]))) throw new Error("Invalid output");
    if (date !== null && (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date)) throw new Error("Invalid output");
    if (typeof note !== "string" || note.length > 300) throw new Error("Invalid output");
    if (typeof confidence !== "number" || !Number.isFinite(confidence) || confidence < 0 || confidence > 1) throw new Error("Invalid output");
    return { type, amount: amount as number | null, category: category as string | null, merchant, paymentMethod: paymentMethod as TransactionDraft["paymentMethod"], date: date as string | null, note, confidence };
  });
}

export const TRANSACTION_DRAFT_SCHEMA = {
  type: "object",
  properties: {
    type: { type: ["string", "null"], enum: ["income", "expense", null] },
    amount: { type: "number", minimum: 0.01, maximum: 100000000 },
    category: { type: "string" },
    merchant: { type: "string" },
    paymentMethod: { type: "string", enum: [...PAYMENT_METHODS] },
    date: { type: "string" },
    note: { type: "string" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["type", "amount", "category", "merchant", "paymentMethod", "date", "note", "confidence"],
} as const;

export const RECEIPT_SCHEMA = {
  type: "object",
  properties: {
    type: { type: ["string", "null"], enum: ["income", "expense", null] },
    merchant: { type: ["string", "null"] },
    amount: { type: ["number", "null"] },
    date: { type: ["string", "null"] },
    paymentMethod: { type: ["string", "null"], enum: [...PAYMENT_METHODS, null] },
    category: { type: ["string", "null"], enum: [...CATEGORIES, null] },
    items: { type: "array", items: { type: "string" }, maxItems: 30 },
    note: { type: "string" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["type", "merchant", "amount", "date", "paymentMethod", "category", "items", "note", "confidence"],
} as const;

export const CHAT_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    answer: { type: "string" },
    followups: { type: "array", items: { type: "string" }, maxItems: 5 },
  },
  required: ["answer", "followups"],
} as const;

export function validateChatResponse(value: unknown): { answer: string; followups: string[] } {
  if (!isRecord(value) || typeof value.answer !== "string" || value.answer.length > 3000 || !Array.isArray(value.followups) || value.followups.length > 5 || !value.followups.every((item) => typeof item === "string" && item.length <= 100)) throw new Error("Invalid output");
  return { answer: value.answer, followups: value.followups };
}

export const GOAL_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string" },
    targetAmount: { type: "number", minimum: 1, maximum: 1000000000 },
    targetDate: { type: "string" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["name", "targetAmount", "targetDate", "confidence"],
} as const;

export const INSIGHT_SCHEMA = {
  type: "object",
  properties: { summary: { type: "string" }, suggestions: { type: "array", items: { type: "string" }, maxItems: 3 } },
  required: ["summary", "suggestions"],
} as const;

export function validateInsight(value: unknown): { summary: string; suggestions: string[] } {
  if (!isRecord(value) || typeof value.summary !== "string" || value.summary.length > 600 || !Array.isArray(value.suggestions) || value.suggestions.length > 3 || !value.suggestions.every((item) => typeof item === "string" && item.length <= 180)) throw new Error("Invalid output");
  return { summary: value.summary, suggestions: value.suggestions };
}
