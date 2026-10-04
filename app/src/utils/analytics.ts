import type { Budget, Transaction } from "../types";

export interface FinancialSummaryResult {
  balance: number;
  income: number;
  spending: number;
  savings: number;
  savingsRate: number;
  transactionCount: number;
}

export interface ForecastResult {
  currentRunRate: number;
  projectedSpend: number;
  projectedSavings: number;
  confidence: "low" | "medium" | "high";
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
}

export interface BudgetPerformance {
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
}

export interface MonthlySummaryResult {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  topCategories: CategorySummary[];
  budgetPerformance: BudgetPerformance[];
}

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
}

export interface PeriodComparison {
  incomeChange: number | null;
  spendingChange: number | null;
  balanceChange: number | null;
  savingsRateChange: number | null;
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
  spendingVelocity: number;
}

function parsedDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
}

function validTransactions(transactions: Transaction[]): Transaction[] {
  return transactions.filter((transaction) =>
    Number.isFinite(transaction.amount) && transaction.amount >= 0 &&
    typeof transaction.category === "string" && transaction.category.trim() !== "" &&
    parsedDate(transaction.date) !== null,
  );
}

export function isIncomeTransaction(transaction: Transaction): boolean {
  return transaction.type === "income";
}

export function isExpenseTransaction(transaction: Transaction): boolean {
  return transaction.type === undefined || transaction.type === "expense";
}

function currentMonthKey(now = new Date()): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function calculateFinancialSummary(transactions: Transaction[]): FinancialSummaryResult {
  const valid = validTransactions(transactions);
  const income = valid.filter(isIncomeTransaction).reduce((sum, transaction) => sum + transaction.amount, 0);
  const spending = valid.filter((transaction) => isExpenseTransaction(transaction))
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const savings = income - spending;
  return {
    balance: savings,
    income,
    spending,
    savings,
    savingsRate: income > 0 ? (savings / income) * 100 : 0,
    transactionCount: valid.length,
  };
}

export function calculateForecast(transactions: Transaction[], now = new Date()): ForecastResult {
  const valid = validTransactions(transactions);
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const monthDays = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const elapsedDays = Math.max(1, now.getUTCDate());
  const thisMonthKey = currentMonthKey(now);
  const currentExpenses = valid.filter((transaction) => {
    const date = parsedDate(transaction.date)!;
    return isExpenseTransaction(transaction) && `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}` === thisMonthKey;
  });
  const currentSpend = currentExpenses.reduce((sum, transaction) => sum + transaction.amount, 0);
  const currentRunRate = (currentSpend / elapsedDays) * monthDays;

  const completedMonths = new Map<string, number>();
  for (const transaction of valid) {
    if (isIncomeTransaction(transaction)) continue;
    const date = parsedDate(transaction.date)!;
    const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    if (key !== thisMonthKey) completedMonths.set(key, (completedMonths.get(key) ?? 0) + transaction.amount);
  }
  const historicSpends = [...completedMonths.values()];
  const historicAverage = historicSpends.length
    ? historicSpends.reduce((sum, amount) => sum + amount, 0) / historicSpends.length
    : null;
  const projectedSpend = historicAverage === null ? currentRunRate : (historicAverage + currentRunRate) / 2;
  const currentIncome = valid.filter((transaction) => {
    const date = parsedDate(transaction.date)!;
    return isIncomeTransaction(transaction) && `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}` === thisMonthKey;
  }).reduce((sum, transaction) => sum + transaction.amount, 0);
  const projectedIncome = currentIncome > 0 ? currentIncome : calculateFinancialSummary(valid).income;

  return {
    currentRunRate,
    projectedSpend,
    projectedSavings: projectedIncome - projectedSpend,
    confidence: historicSpends.length >= 4 ? "high" : historicSpends.length >= 2 ? "medium" : "low",
  };
}

export function calculateMonthlySummary(
  transactions: Transaction[],
  budgets: Budget[],
  month = currentMonthKey(),
): MonthlySummaryResult {
  const [yearText, monthText] = month.split("-");
  const year = Number(yearText);
  const monthNumber = Number(monthText);
  const inMonth = validTransactions(transactions).filter((transaction) => {
    const date = parsedDate(transaction.date)!;
    return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === monthNumber;
  });
  const income = inMonth.filter(isIncomeTransaction).reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenses = inMonth.filter((transaction) => isExpenseTransaction(transaction));
  const totalExpenses = expenses.reduce((sum, transaction) => sum + transaction.amount, 0);
  const categoryTotals = new Map<string, number>();
  for (const transaction of expenses) {
    const category = transaction.category.trim();
    categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + transaction.amount);
  }
  const topCategories = [...categoryTotals.entries()]
    .map(([category, amount]) => ({ category, amount, percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0 }))
    .sort((left, right) => right.amount - left.amount);
  const budgetPerformance = budgets
    .filter((budget) => typeof budget.category === "string" && Number.isFinite(budget.limit) && budget.limit >= 0)
    .map((budget) => {
      const spent = expenses.filter((transaction) => transaction.category.trim().toLowerCase() === budget.category.trim().toLowerCase())
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      return {
        category: budget.category,
        budget: budget.limit,
        spent,
        remaining: budget.limit - spent,
        percentageUsed: budget.limit > 0 ? (spent / budget.limit) * 100 : 0,
      };
    });

  return { totalIncome: income, totalExpenses, savings: income - totalExpenses, topCategories, budgetPerformance };
}

export function calculatePeriodComparison(transactions: Transaction[], now = new Date()): PeriodComparison {
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth();
  const day = now.getUTCDate();
  const previousMonthDate = new Date(Date.UTC(currentYear, currentMonth - 1, 1));
  const previousYear = previousMonthDate.getUTCFullYear();
  const previousMonth = previousMonthDate.getUTCMonth();
  const previousMonthDays = new Date(Date.UTC(previousYear, previousMonth + 1, 0)).getUTCDate();
  const periodDays = Math.min(day, previousMonthDays);
  const valid = validTransactions(transactions);
  const periodSummary = (year: number, month: number, days: number) => {
    const period = valid.filter((transaction) => {
      const date = parsedDate(transaction.date)!;
      return date.getUTCFullYear() === year && date.getUTCMonth() === month && date.getUTCDate() <= days;
    });
    const income = period.filter(isIncomeTransaction).reduce((sum, tx) => sum + tx.amount, 0);
    const spending = period.filter((tx) => isExpenseTransaction(tx)).reduce((sum, tx) => sum + tx.amount, 0);
    return { income, spending, balance: income - spending, savingsRate: income > 0 ? ((income - spending) / income) * 100 : 0, count: period.length };
  };
  const current = periodSummary(currentYear, currentMonth, day);
  const previous = periodSummary(previousYear, previousMonth, periodDays);
  if (!previous.count) return { incomeChange: null, spendingChange: null, balanceChange: null, savingsRateChange: null };
  const percentChange = (currentValue: number, previousValue: number) => previousValue === 0 ? null : ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
  return {
    incomeChange: percentChange(current.income, previous.income),
    spendingChange: percentChange(current.spending, previous.spending),
    balanceChange: percentChange(current.balance, previous.balance),
    savingsRateChange: previous.income > 0 ? current.savingsRate - previous.savingsRate : null,
  };
}

export function computeFinancialSummary(transactions: Transaction[], budgets: Budget[]): FinancialSummary {
  const monthly = calculateMonthlySummary(transactions, budgets);
  const forecast = calculateForecast(transactions);
  const totalBudget = budgets.reduce((sum, budget) => sum + (Number.isFinite(budget.limit) ? budget.limit : 0), 0);
  const categorySpends: CategorySpend[] = monthly.budgetPerformance.map((item) => ({
    category: item.category,
    spent: item.spent,
    limit: item.budget,
    percentage: item.percentageUsed,
    remaining: Math.max(0, item.remaining),
    isOver: item.spent > item.budget,
    transactionCount: transactions.filter((transaction) => isExpenseTransaction(transaction) &&
      transaction.category.trim().toLowerCase() === item.category.trim().toLowerCase() &&
      parsedDate(transaction.date)?.toISOString().slice(0, 7) === currentMonthKey(),
    ).length,
  }));
  for (const item of monthly.topCategories) {
    if (categorySpends.some((category) => category.category.trim().toLowerCase() === item.category.trim().toLowerCase())) continue;
    categorySpends.push({
      category: item.category,
      spent: item.amount,
      limit: 0,
      percentage: 100,
      remaining: 0,
      isOver: true,
      transactionCount: transactions.filter((transaction) => isExpenseTransaction(transaction) &&
        transaction.category.trim().toLowerCase() === item.category.trim().toLowerCase() &&
        parsedDate(transaction.date)?.toISOString().slice(0, 7) === currentMonthKey(),
      ).length,
    });
  }
  const now = new Date();
  const currentDay = Math.max(1, now.getUTCDate());
  const spendingVelocity = monthly.totalExpenses / currentDay;

  return {
    totalSpent: monthly.totalExpenses,
    totalBudget,
    budgetUtilization: totalBudget > 0 ? (monthly.totalExpenses / totalBudget) * 100 : 0,
    projectedMonthEnd: forecast.projectedSpend,
    savingsRate: monthly.totalIncome > 0 ? (monthly.savings / monthly.totalIncome) * 100 : 0,
    netBalance: monthly.savings,
    monthlyIncome: monthly.totalIncome,
    categorySpends: categorySpends.sort((left, right) => right.spent - left.spent),
    spendingVelocity,
  };
}

export function computeDailySpendingSeries(transactions: Transaction[], daysCount = 14): DaySpendPoint[] {
  const points: DaySpendPoint[] = [];
  const now = new Date();
  let cumulative = 0;
  for (let i = daysCount - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dateString = date.toISOString().slice(0, 10);
    const dayTransactions = transactions.filter((transaction) =>
      isExpenseTransaction(transaction) && transaction.date === dateString,
    );
    const amount = dayTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    cumulative += amount;
    points.push({
      date: dateString,
      dayLabel: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      amount,
      cumulative,
    });
  }
  return points;
}
