import { getFirestore, type DocumentData } from "firebase-admin/firestore";
import { isRecord } from "./schemas";

type Period = "thisMonth" | "lastMonth";

function monthBounds(period: Period) {
  const now = new Date();
  const offset = period === "lastMonth" ? 1 : 0;
  const first = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
  const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0));
  return { start: first.toISOString().slice(0, 10), end: period === "thisMonth" ? now.toISOString().slice(0, 10) : last.toISOString().slice(0, 10) };
}

function isExpense(document: DocumentData): boolean {
  return document.type === undefined || document.type === "expense";
}

async function periodExpenses(uid: string, period: Period) {
  const { start, end } = monthBounds(period);
  const snapshot = await getFirestore().collection("users").doc(uid).collection("transactions")
    .where("date", ">=", start).where("date", "<=", end).get();
  return snapshot.docs.map((document) => document.data()).filter((transaction) => isExpense(transaction)
    && typeof transaction.amount === "number" && Number.isFinite(transaction.amount) && transaction.amount >= 0
    && typeof transaction.category === "string");
}

function validPeriod(args: unknown): Period {
  if (!isRecord(args) || (args.period !== "thisMonth" && args.period !== "lastMonth")) return "thisMonth";
  return args.period;
}

function validCategory(args: unknown): string | null {
  if (!isRecord(args) || args.category === undefined) return null;
  return typeof args.category === "string" && args.category.length <= 60 ? args.category.trim().toLowerCase() : null;
}

function summarizeByCategory(transactions: DocumentData[], category: string | null) {
  const totals = new Map<string, number>();
  for (const transaction of transactions) {
    if (category && transaction.category.trim().toLowerCase() !== category) continue;
    totals.set(transaction.category, (totals.get(transaction.category) ?? 0) + transaction.amount);
  }
  const topCategories = [...totals].map(([name, amount]) => ({ category: name, amount })).sort((a, b) => b.amount - a.amount).slice(0, 8);
  return { total: topCategories.reduce((sum, item) => sum + item.amount, 0), categories: topCategories };
}

export const FINANCIAL_TOOL_DECLARATIONS = [{
  functionDeclarations: [
    { name: "getSpending", description: "Get deterministic expense totals by category for this month or last month.", parameters: { type: "object", properties: { period: { type: "string", enum: ["thisMonth", "lastMonth"] }, category: { type: "string" } }, required: ["period"] } },
    { name: "getBudgetStatus", description: "Get deterministic budget limits and actual spending for the user's categories.", parameters: { type: "object", properties: {} } },
    { name: "getTrend", description: "Get deterministic monthly expense totals for up to six recent months.", parameters: { type: "object", properties: {} } },
    { name: "getTransactions", description: "Get at most ten recent matching expense entries with only merchant, amount, category, and date.", parameters: { type: "object", properties: { period: { type: "string", enum: ["thisMonth", "lastMonth"] }, category: { type: "string" } }, required: ["period"] } },
  ],
}];

export async function runFinancialTool(uid: string, name: string, args: unknown): Promise<unknown> {
  const period = validPeriod(args);
  const category = validCategory(args);
  if (name === "getSpending") {
    const transactions = await periodExpenses(uid, period);
    return { period, ...summarizeByCategory(transactions, category) };
  }

  if (name === "getBudgetStatus") {
    const [transactions, budgetsSnapshot, profileSnapshot] = await Promise.all([
      periodExpenses(uid, "thisMonth"),
      getFirestore().collection("users").doc(uid).collection("budgets").get(),
      getFirestore().doc(`users/${uid}`).get(),
    ]);
    const spends = summarizeByCategory(transactions, null).categories;
    const budgets = budgetsSnapshot.docs.map((budget) => ({ category: budget.get("category"), limit: budget.get("limit") }))
      .filter((item) => typeof item.category === "string" && typeof item.limit === "number" && Number.isFinite(item.limit))
      .map((budget) => ({ ...budget, spent: spends.find((item) => item.category.toLowerCase() === budget.category.toLowerCase())?.amount ?? 0 }));
    return { monthlyBudget: profileSnapshot.get("monthlyBudget") ?? 0, categories: budgets.slice(0, 30) };
  }

  if (name === "getTrend") {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1)).toISOString().slice(0, 10);
    const today = now.toISOString().slice(0, 10);
    const snapshot = await getFirestore().collection("users").doc(uid).collection("transactions").where("date", ">=", start).where("date", "<=", today).get();
    const months = new Map<string, number>();
    for (const item of snapshot.docs) {
      const transaction = item.data();
      if (!isExpense(transaction) || typeof transaction.amount !== "number" || !Number.isFinite(transaction.amount) || transaction.amount < 0 || typeof transaction.date !== "string") continue;
      const month = transaction.date.slice(0, 7);
      months.set(month, (months.get(month) ?? 0) + transaction.amount);
    }
    return { months: [...months].sort(([a], [b]) => a.localeCompare(b)).map(([month, total]) => ({ month, total })) };
  }

  if (name === "getTransactions") {
    const { start, end } = monthBounds(period);
    const snapshot = await getFirestore().collection("users").doc(uid).collection("transactions")
      .where("date", ">=", start).where("date", "<=", end).orderBy("date", "desc").limit(20).get();
    const result = snapshot.docs.map((item) => {
      const transaction = item.data();
      return { amount: transaction.amount, category: transaction.category, date: transaction.date, merchant: transaction.description ?? transaction.category };
    }).filter((transaction) => typeof transaction.amount === "number" && typeof transaction.category === "string" && (!category || transaction.category.toLowerCase() === category));
    return { period, transactions: result.slice(0, 10) };
  }

  return { error: "That data tool is unavailable." };
}
