import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import type { Budget } from "../types";
import { useAuth } from "./AuthContext";
import { db } from "../firebase/firebase";
import { firebaseErrorMessage } from "../firebase/errors";

interface BudgetsContextValue {
  budgets: Budget[];
  error: string | null;
  clearError: () => void;
  createBudget: (category: string, limit: number) => Promise<void>;
  updateBudget: (category: string, limit: number) => Promise<void>;
  deleteBudget: (category: string) => Promise<void>;
  setBudgetLimit: (category: string, limit: number) => Promise<void>;
}

const BudgetsContext = createContext<BudgetsContextValue | undefined>(undefined);

function budgetDocumentId(category: string) {
  return encodeURIComponent(category.trim());
}

export function BudgetsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.uid ?? null;
  const [savedBudgets, setSavedBudgets] = useState<{
    userId: string | null;
    budgets: Budget[];
  }>({ userId: null, budgets: [] });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (!userId) {
      setSavedBudgets({ userId: null, budgets: [] });
      return;
    }
    if (!db) {
      setError("Firebase web configuration is incomplete. Add the Firebase web app values to app/.env.");
      return;
    }

    return onSnapshot(
      collection(db, "users", userId, "budgets"),
      (snapshot) => {
        setSavedBudgets({
          userId,
          budgets: snapshot.docs.map((budgetDocument) => budgetDocument.data() as Budget),
        });
      },
      (cause) => setError(firebaseErrorMessage(cause, "Unable to load budgets.")),
    );
  }, [userId]);

  async function saveBudget(category: string, limit: number) {
    const normalizedCategory = category.trim();
    if (!userId || !db) {
      setError("Sign in with a configured Firebase account to save budgets.");
      return;
    }
    if (!normalizedCategory || !Number.isFinite(limit) || limit < 0) {
      setError("Enter a category and a valid non-negative budget limit.");
      return;
    }
    try {
      await setDoc(doc(db, "users", userId, "budgets", budgetDocumentId(normalizedCategory)), {
        category: normalizedCategory,
        limit,
      });
      setError(null);
    } catch (cause) {
      setError(firebaseErrorMessage(cause, "Unable to save this budget."));
    }
  }

  async function deleteBudget(category: string) {
    if (!userId || !db) {
      setError("Sign in with a configured Firebase account to delete budgets.");
      return;
    }
    try {
      await deleteDoc(doc(db, "users", userId, "budgets", budgetDocumentId(category)));
      setError(null);
    } catch (cause) {
      setError(firebaseErrorMessage(cause, "Unable to delete this budget."));
    }
  }

  const budgets = savedBudgets.userId === userId ? savedBudgets.budgets : [];

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        error,
        clearError: () => setError(null),
        createBudget: saveBudget,
        updateBudget: saveBudget,
        deleteBudget,
        setBudgetLimit: saveBudget,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
}

export function useBudgets() {
  const ctx = useContext(BudgetsContext);
  if (!ctx) throw new Error("useBudgets must be used within a BudgetsProvider");
  return ctx;
}
