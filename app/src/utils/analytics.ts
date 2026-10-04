import type { Budget, Transaction } from "../types";

export interface CategorySpend {
  category: string;
  spent: number;
  limit: number;
  percentage: number;
  remaining: number;
  isOver: boolean;
  transactionCount: number;
}

export interface DaySpendPoint {
  date: string;
  dayLabel: string;
  amount: number;
  cumulative: number;
  projectedRunRate: number;
}

export interface FinancialSummary {
  totalSpent: number;
  totalBudget: number;
  budgetUtilization: number;
  projectedMonthEnd: number;
  savingsRate: number;
  netBalance: number;
  monthlyIncome: number;
  categorySpends: CategorySpend[];
  spendingVelocity: number; // per day
}

export function computeFinancialSummary(
  transactions: Transaction[],
  budgets: Budget[],
  monthlyIncome: number = 85000
): FinancialSummary {
  const totalSpent = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  const totalBudget = budgets.reduce((acc, b) => acc + (b.limit || 0), 0);
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Assume active cycle day calculation (e.g. day 12 of a 30-day month or based on current date)
  const now = new Date();
  const currentDay = Math.max(1, now.getDate());
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const spendingVelocity = totalSpent / currentDay;
  const projectedMonthEnd = Math.round(spendingVelocity * daysInMonth);

  const netBalance = Math.max(0, monthlyIncome - totalSpent);
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - totalSpent) / monthlyIncome) * 100 : 0;

  // Category spends
  const categorySpends: CategorySpend[] = budgets.map((b) => {
    const matching = transactions.filter(
      (t) => t.category.toLowerCase().trim() === b.category.toLowerCase().trim()
    );
    const spent = matching.reduce((acc, t) => acc + t.amount, 0);
    const percentage = b.limit > 0 ? (spent / b.limit) * 100 : 0;
    const remaining = Math.max(0, b.limit - spent);
    return {
      category: b.category,
      spent,
      limit: b.limit,
      percentage,
      remaining,
      isOver: spent > b.limit,
      transactionCount: matching.length,
    };
  });

  // Include categories from transactions that might not have an explicit budget entry
  transactions.forEach((t) => {
    const exists = categorySpends.some(
      (cs) => cs.category.toLowerCase().trim() === t.category.toLowerCase().trim()
    );
    if (!exists) {
      const matching = transactions.filter(
        (tx) => tx.category.toLowerCase().trim() === t.category.toLowerCase().trim()
      );
      const spent = matching.reduce((acc, tx) => acc + tx.amount, 0);
      categorySpends.push({
        category: t.category,
        spent,
        limit: 0,
        percentage: 100,
        remaining: 0,
        isOver: true,
        transactionCount: matching.length,
      });
    }
  });

  return {
    totalSpent,
    totalBudget,
    budgetUtilization,
    projectedMonthEnd,
    savingsRate,
    netBalance,
    monthlyIncome,
    categorySpends: categorySpends.sort((a, b) => b.spent - a.spent),
    spendingVelocity,
  };
}

export function computeDailySpendingSeries(
  transactions: Transaction[],
  daysCount: number = 14
): DaySpendPoint[] {
  const points: DaySpendPoint[] = [];
  const now = new Date();
  let cumulative = 0;

  // Build sorted daily timeline for the last `daysCount` days
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const dayTransactions = transactions.filter((t) => t.date === dateStr);
    const dayAmount = dayTransactions.reduce((acc, t) => acc + t.amount, 0);
    cumulative += dayAmount;

    // Linear projected pace anchor
    const projectedRunRate = Math.round((22000 / 30) * (daysCount - i));

    points.push({
      date: dateStr,
      dayLabel,
      amount: dayAmount,
      cumulative,
      projectedRunRate,
    });
  }

  return points;
}
