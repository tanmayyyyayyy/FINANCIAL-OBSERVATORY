import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Transaction } from "../types";

const STORAGE_KEY = "expense-tracker:transactions";

const seedTransactions: Transaction[] = [
  { id: "seed-1", amount: 840, category: "Food & Dining", description: "", paymentMethod: "UPI", date: "2026-08-01", createdAt: "2026-08-01T09:00:00.000Z" },
  { id: "seed-2", amount: 320, category: "Transport", description: "", paymentMethod: "UPI", date: "2026-08-03", createdAt: "2026-08-03T09:00:00.000Z" },
  { id: "seed-3", amount: 1200, category: "Entertainment", description: "", paymentMethod: "Credit Card", date: "2026-08-05", createdAt: "2026-08-05T09:00:00.000Z" },
  { id: "seed-4", amount: 2450, category: "Utilities", description: "", paymentMethod: "Debit Card", date: "2026-08-07", createdAt: "2026-08-07T09:00:00.000Z" },
  { id: "seed-5", amount: 1890, category: "Shopping", description: "", paymentMethod: "Credit Card", date: "2026-08-08", createdAt: "2026-08-08T09:00:00.000Z" },
  { id: "seed-6", amount: 560, category: "Food & Dining", description: "", paymentMethod: "Cash", date: "2026-08-09", createdAt: "2026-08-09T09:00:00.000Z" },
];

interface TransactionsContextValue {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id" | "createdAt">) => void;
  deleteTransaction: (id: string) => void;
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined);

function loadInitial(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Transaction[];
  } catch {
    // ignore corrupt storage, fall through to seed
  }
  return seedTransactions;
}

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  function addTransaction(t: Omit<Transaction, "id" | "createdAt">) {
    const newTransaction: Transaction = {
      ...t,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  }

  function deleteTransaction(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, deleteTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error("useTransactions must be used within a TransactionsProvider");
  return ctx;
}
