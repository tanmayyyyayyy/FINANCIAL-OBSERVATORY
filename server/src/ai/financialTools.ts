import { type DocumentData } from "firebase-admin/firestore";
import { getFirestore } from "../firebase";
import { isRecord } from "./schemas";

type Period = "thisMonth" | "lastMonth";

function monthBounds(period: Period) {
  const now = new Date();
  const offset = period === "lastMonth" ? 1 : 0;
  const first = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
  const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0));
  return {
    start: first.toISOString().slice(0, 10),
    end: period === "thisMonth" ? now.toISOString().slice(0, 10) : last.toISOString().slice(0, 10),
  };
}

function isExpense(document: DocumentData): boolean {
  return document.type === undefined || document.type === "expense";
}

async function periodExpenses(uid: string, period: Period) {
  const { start, end } = monthBounds(period);
  const snapshot = await getFirestore()
    .collection("users")
    .doc(uid)
    .collection("transactions")
    .where("date", ">=", start)
    .where("date", "<=", end)
    .get();
  return snapshot.docs
    .map((document) => document.data())
    .filter(
      (transaction) =>
        isExpense(transaction) &&
        typeof transaction.amount === "number" &&
        Number.isFinite(transaction.amount) &&
        transaction.amount >= 0 &&
        typeof transaction.category === "string"
    );
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
  const topCategories = [...totals]
    .map(([name, amount]) => ({ category: name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);
  return { total: topCategories.reduce((sum, item) => sum + item.amount, 0), categories: topCategories };
}

export const FINANCIAL_TOOL_DECLARATIONS = [
  {
    functionDeclarations: [
      {
        name: "getSpending",
        description: "Get deterministic expense totals by category in INR (₹) for this month or last month.",
        parameters: {
          type: "object",
          properties: {
            period: { type: "string", enum: ["thisMonth", "lastMonth"] },
            category: { type: "string" },
          },
          required: ["period"],
        },
      },
      {
        name: "getBudgetStatus",
        description: "Get deterministic budget limits and actual spending in INR (₹) for the user's categories.",
        parameters: { type: "object", properties: {} },
      },
      {
        name: "getTrend",
        description: "Get deterministic monthly expense totals in INR (₹) for up to six recent months.",
        parameters: { type: "object", properties: {} },
      },
      {
        name: "getTransactions",
        description: "Get at most ten recent matching expense entries in INR (₹) with only merchant, amount, category, and date.",
        parameters: {
          type: "object",
          properties: {
            period: { type: "string", enum: ["thisMonth", "lastMonth"] },
            category: { type: "string" },
          },
          required: ["period"],
        },
      },
    ],
  },
];

export async function runFinancialTool(uid: string, name: string, args: unknown): Promise<unknown> {
  const period = validPeriod(args);
  const category = validCategory(args);
  if (name === "getSpending") {
    const transactions = await periodExpenses(uid, period);
    return summarizeByCategory(transactions, category);
  }
  if (name === "getBudgetStatus") {
    const firestore = getFirestore();
    const budgetsSnapshot = await firestore.collection("users").doc(uid).collection("budgets").get();
    const limits = new Map<string, number>();
    for (const document of budgetsSnapshot.docs) {
      const data = document.data();
      if (typeof data.category === "string" && typeof data.limit === "number" && data.limit > 0) {
        limits.set(data.category, data.limit);
      }
    }
    const transactions = await periodExpenses(uid, "thisMonth");
    const spends = new Map<string, number>();
    for (const transaction of transactions) {
      spends.set(transaction.category, (spends.get(transaction.category) ?? 0) + transaction.amount);
    }
    const categories = Array.from(new Set([...limits.keys(), ...spends.keys()])).slice(0, 8);
    return categories.map((cat) => {
      const limit = limits.get(cat) ?? null;
      const spent = spends.get(cat) ?? 0;
      return {
        category: cat,
        limit,
        spent,
        remaining: limit !== null ? limit - spent : null,
        status: limit === null ? "no_budget" : spent > limit ? "exceeded" : spent >= limit * 0.8 ? "warning" : "ok",
      };
    });
  }
  if (name === "getTrend") {
    const firestore = getFirestore();
    const now = new Date();
    const months: Array<{ key: string; label: string; start: string; end: string }> = [];
    for (let index = 5; index >= 0; index -= 1) {
      const first = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - index, 1));
      const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0));
      months.push({
        key: first.toISOString().slice(0, 7),
        label: first.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
        start: first.toISOString().slice(0, 10),
        end: last.toISOString().slice(0, 10),
      });
    }
    const snapshot = await firestore
      .collection("users")
      .doc(uid)
      .collection("transactions")
      .where("date", ">=", months[0].start)
      .where("date", "<=", months[months.length - 1].end)
      .get();
    const totals = new Map<string, number>();
    for (const document of snapshot.docs) {
      const data = document.data();
      if (!isExpense(data) || typeof data.amount !== "number" || typeof data.date !== "string") continue;
      const monthKey = data.date.slice(0, 7);
      totals.set(monthKey, (totals.get(monthKey) ?? 0) + data.amount);
    }
    return months.map((month) => ({ month: month.label, total: totals.get(month.key) ?? 0 }));
  }
  if (name === "getTransactions") {
    const transactions = await periodExpenses(uid, period);
    const filtered = category
      ? transactions.filter((t) => t.category.trim().toLowerCase() === category)
      : transactions;
    return filtered
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
      .slice(0, 10)
      .map((t) => ({
        merchant: typeof t.description === "string" ? t.description : t.category,
        amount: t.amount,
        category: t.category,
        date: t.date,
      }));
  }
  return { error: "Unknown tool" };
}
