import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import type { Transaction } from "../types";
import { useAuth } from "./AuthContext";
import { db } from "../firebase/firebase";
import { firebaseErrorMessage } from "../firebase/errors";

interface TransactionsContextValue {
  transactions: Transaction[];
  error: string | null;
  clearError: () => void;
  addTransaction: (t: Omit<Transaction, "id" | "createdAt">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.uid ?? null;
  const [savedTransactions, setSavedTransactions] = useState<{
    userId: string | null;
    transactions: Transaction[];
  }>({ userId: null, transactions: [] });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (!userId) {
      setSavedTransactions({ userId: null, transactions: [] });
      return;
    }
    if (!db) {
      setError("Firebase web configuration is incomplete. Add the Firebase web app values to app/.env.");
      return;
    }

    const database = db;
    const transactionsQuery = query(
      collection(database, "users", userId, "transactions"),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(
      transactionsQuery,
      (snapshot) => {
        setSavedTransactions({
          userId,
          transactions: snapshot.docs.map(
            (transactionDocument) =>
              ({ ...transactionDocument.data(), id: transactionDocument.id }) as Transaction,
          ),
        });
      },
      (cause) => setError(firebaseErrorMessage(cause, "Unable to load transactions.")),
    );
  }, [userId]);

  async function addTransaction(transaction: Omit<Transaction, "id" | "createdAt">) {
    if (!userId || !db) {
      setError("Sign in with a configured Firebase account to add transactions.");
      return;
    }
    try {
      const storedTransaction = { ...transaction, type: transaction.type ?? "expense" };
      await addDoc(collection(db, "users", userId, "transactions"), {
        ...storedTransaction,
        createdAt: new Date().toISOString(),
      });
      setError(null);
    } catch (cause) {
      setError(firebaseErrorMessage(cause, "Unable to save this transaction."));
    }
  }

  async function deleteTransaction(id: string) {
    if (!userId || !db) {
      setError("Sign in with a configured Firebase account to delete transactions.");
      return;
    }
    try {
      await deleteDoc(doc(db, "users", userId, "transactions", id));
      setError(null);
    } catch (cause) {
      setError(firebaseErrorMessage(cause, "Unable to delete this transaction."));
    }
  }

  const transactions = savedTransactions.userId === userId ? savedTransactions.transactions : [];

  return (
    <TransactionsContext.Provider
      value={{ transactions, error, clearError: () => setError(null), addTransaction, deleteTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error("useTransactions must be used within a TransactionsProvider");
  return ctx;
}
