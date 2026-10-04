import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Budget } from "../types";

const STORAGE_KEY = "expense-tracker:budgets";

const seedBudgets: Budget[] = [
  { category: "Food & Dining", limit: 6000 },
  { category: "Transport", limit: 3000 },
  { category: "Entertainment", limit: 4000 },
  { category: "Shopping", limit: 3500 },
  { category: "Utilities", limit: 3000 },
];

interface BudgetsContextValue {
  budgets: Budget[];
  setBudgetLimit: (category: string, limit: number) => void;
}

const BudgetsContext = createContext<BudgetsContextValue | undefined>(undefined);

function loadInitial(): Budget[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Budget[];
  } catch {
    // ignore corrupt storage, fall through to seed
  }
  return seedBudgets;
}

export function BudgetsProvider({ children }: { children: ReactNode }) {
  const [budgets, setBudgets] = useState<Budget[]>(loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
  }, [budgets]);

  function setBudgetLimit(category: string, limit: number) {
    setBudgets((prev) =>
      prev.some((b) => b.category === category)
        ? prev.map((b) => (b.category === category ? { ...b, limit } : b))
        : [...prev, { category, limit }]
    );
  }

  return (
    <BudgetsContext.Provider value={{ budgets, setBudgetLimit }}>
      {children}
    </BudgetsContext.Provider>
  );
}

export function useBudgets() {
  const ctx = useContext(BudgetsContext);
  if (!ctx) throw new Error("useBudgets must be used within a BudgetsProvider");
  return ctx;
}
