import type { Budget, Transaction } from "../types";
import { isExpenseTransaction } from "./analytics";

export interface FinancialSignals {
  weeklyExpenses: number;
  previousWeekExpenses: number;
  monthExpenses: number;
  unusual: Transaction[];
  duplicates: Transaction[][];
  recurring: Array<{ merchant: string; amount: number; intervalDays: number; count: number }>;
  budgetAlerts: Array<{ category: string; spent: number; limit: number; daysLeft: number }>;
}

export function calculateFinancialSignals(transactions: Transaction[], budgets: Budget[], now = new Date()): FinancialSignals {
  const real = transactions.filter((transaction) => transaction.isSampleData !== true && Number.isFinite(transaction.amount) && transaction.amount > 0 && /^\d{4}-\d{2}-\d{2}$/.test(transaction.date));
  const expenses = real.filter(isExpenseTransaction);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const days = (date: string) => Math.round((today - Date.parse(`${date}T00:00:00Z`)) / 86_400_000);
  const thisWeek = expenses.filter((transaction) => days(transaction.date) >= 0 && days(transaction.date) < 7);
  const previousWeek = expenses.filter((transaction) => days(transaction.date) >= 7 && days(transaction.date) < 14);
  const monthKey = now.toISOString().slice(0, 7);
  const currentMonth = expenses.filter((transaction) => transaction.date.startsWith(monthKey));

  const unusual = currentMonth.filter((transaction) => {
    const prior = expenses.filter((item) => item.category === transaction.category && item.id !== transaction.id && days(item.date) > 0 && days(item.date) <= 90).map((item) => item.amount).sort((a, b) => a - b);
    if (prior.length < 5) return false;
    const median = prior[Math.floor(prior.length / 2)];
    return transaction.amount >= Math.max(median * 2.5, median + 1000);
  }).slice(0, 3);

  const duplicateMap = new Map<string, Transaction[]>();
  expenses.forEach((transaction) => {
    const merchant = (transaction.description || transaction.category).trim().toLowerCase().replace(/\s+/g, " ");
    const key = `${transaction.date}|${Math.round(transaction.amount * 100)}|${merchant}`;
    duplicateMap.set(key, [...(duplicateMap.get(key) ?? []), transaction]);
  });
  const duplicates = [...duplicateMap.values()].filter((items) => items.length > 1);

  const merchantGroups = new Map<string, Transaction[]>();
  expenses.forEach((transaction) => {
    const key = (transaction.description || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (key) merchantGroups.set(key, [...(merchantGroups.get(key) ?? []), transaction]);
  });
  const recurring = [...merchantGroups.entries()].flatMap(([merchant, items]) => {
    const chronological = [...items].sort((a, b) => a.date.localeCompare(b.date));
    if (chronological.length < 3) return [];
    const lastThree = chronological.slice(-3);
    const amounts = lastThree.map((item) => item.amount);
    if (Math.max(...amounts) > Math.min(...amounts) * 1.1) return [];
    const intervals = [1, 2].map((index) => Math.round((Date.parse(`${lastThree[index].date}T00:00:00Z`) - Date.parse(`${lastThree[index - 1].date}T00:00:00Z`)) / 86_400_000));
    const intervalDays = Math.round((intervals[0] + intervals[1]) / 2);
    const regular = intervals.every((interval) => Math.abs(interval - intervalDays) <= 4) && ((intervalDays >= 26 && intervalDays <= 35) || (intervalDays >= 5 && intervalDays <= 9));
    return regular ? [{ merchant: chronological.at(-1)?.description || merchant, amount: Math.round(amounts.reduce((a, b) => a + b, 0) / 3), intervalDays, count: chronological.length }] : [];
  }).slice(0, 5);

  const dayOfMonth = now.getUTCDate();
  const daysLeft = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate() - dayOfMonth;
  const budgetAlerts = budgets.flatMap((budget) => {
    if (!(budget.limit > 0)) return [];
    const spent = currentMonth.filter((item) => item.category.toLowerCase() === budget.category.toLowerCase()).reduce((sum, item) => sum + item.amount, 0);
    return spent / budget.limit >= 0.8 ? [{ category: budget.category, spent, limit: budget.limit, daysLeft }] : [];
  });

  return {
    weeklyExpenses: thisWeek.reduce((sum, item) => sum + item.amount, 0),
    previousWeekExpenses: previousWeek.reduce((sum, item) => sum + item.amount, 0),
    monthExpenses: currentMonth.reduce((sum, item) => sum + item.amount, 0),
    unusual,
    duplicates,
    recurring,
    budgetAlerts,
  };
}
