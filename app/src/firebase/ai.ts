import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebase";

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

const functions = firebaseApp ? getFunctions(firebaseApp, "asia-south1") : null;

function callable<Input, Output>(name: string) {
  if (!functions) throw new Error("AI features are unavailable until Firebase is configured.");
  return httpsCallable<Input, Output>(functions, name);
}

export async function parseTransactionText(text: string) {
  const response = await callable<{ text: string }, { transactions: AiTransactionDraft[] }>("parseTransactionText")({ text });
  return response.data.transactions;
}

export async function askYourMoney(messages: Array<{ role: "user" | "assistant"; text: string }>) {
  const response = await callable<{ messages: Array<{ role: "user" | "assistant"; text: string }> }, MoneyChatResult>("askYourMoney")({ messages });
  return response.data;
}

export async function generateWeeklyInsight() {
  const response = await callable<Record<string, never>, { summary: string; suggestions: string[] }>("generateWeeklyInsight")({});
  return response.data;
}

export async function parseSavingsGoal(text: string) {
  const response = await callable<{ text: string }, { name: string; targetAmount: number; targetDate: string; confidence: number }>("parseSavingsGoal")({ text });
  return response.data;
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

export async function scanReceipt(imageData: string, mimeType: string): Promise<ReceiptDraft> {
  const response = await callable<{ imageData: string; mimeType: string }, ReceiptDraft>("scanReceipt")({ imageData, mimeType });
  return response.data;
}
