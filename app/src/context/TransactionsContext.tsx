import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, setDoc, writeBatch } from "firebase/firestore";
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
  addSampleData: () => Promise<boolean>;
  clearSampleData: () => Promise<void>;
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
      throw new Error("Sign in with a configured Firebase account to add transactions.");
    }
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(transaction.date)
      && !Number.isNaN(Date.parse(`${transaction.date}T00:00:00Z`))
      && new Date(`${transaction.date}T00:00:00Z`).toISOString().slice(0, 10) === transaction.date;
    if (!Number.isFinite(transaction.amount) || transaction.amount <= 0 || !validDate || !transaction.category.trim() || !["UPI", "Credit Card", "Debit Card", "Cash", "Bank Transfer"].includes(transaction.paymentMethod) || (transaction.type !== undefined && transaction.type !== "income" && transaction.type !== "expense")) {
      const message = "Check the amount, date, category, and payment method before saving.";
      setError(message);
      throw new Error(message);
    }
    const storedTransaction = { ...transaction, type: transaction.type ?? "expense" };
    const createdAt = new Date().toISOString();
    const reference = doc(collection(db, "users", userId, "transactions"));
    const optimistic = { ...storedTransaction, id: reference.id, createdAt } as Transaction;
    setSavedTransactions((current) => ({
      userId,
      transactions: [optimistic, ...(current.userId === userId ? current.transactions : [])],
    }));
    setError(null);

    setDoc(reference, {
      ...storedTransaction,
      createdAt,
    })
      .then(() => {
        setSavedTransactions((current) =>
          current.userId !== userId
            ? current
            : {
                userId,
                transactions: current.transactions.map((item) =>
                  item.id === reference.id ? optimistic : item
                ),
              }
        );
      })
      .catch((cause) => {
        const message = firebaseErrorMessage(cause, "Unable to save this transaction.");
        setSavedTransactions((current) =>
          current.userId !== userId
            ? current
            : {
                userId,
                transactions: current.transactions.filter((item) => item.id !== reference.id),
              }
        );
        setError(message);
      });
  }

  async function deleteTransaction(id: string) {
    if (!userId || !db) {
      setError("Sign in with a configured Firebase account to delete transactions.");
      throw new Error("Sign in with a configured Firebase account to delete transactions.");
    }
    const previous = savedTransactions;
    setSavedTransactions((current) => ({
      userId,
      transactions: current.userId === userId ? current.transactions.filter((transaction) => transaction.id !== id) : [],
    }));
    try {
      await deleteDoc(doc(db, "users", userId, "transactions", id));
      setError(null);
    } catch (cause) {
      setSavedTransactions(previous.userId === userId ? previous : savedTransactions);
      const message = firebaseErrorMessage(cause, "Unable to delete this transaction.");
      setError(message);
      throw new Error(message);
    }
  }

  async function addSampleData(): Promise<boolean> {
    if (!userId || !db) {
      setError("Sign in with a configured Firebase account to add sample data.");
      return false;
    }
    const currentTransactions = savedTransactions.userId === userId ? savedTransactions.transactions : [];
    if (currentTransactions.some((transaction) => !transaction.isSampleData)) {
      setError("Sample data is only available before you add your own transactions.");
      return false;
    }
    const sampleRows = [
      { amount: 240, category: "Food & Dining", description: "Sample · Cafe visit", paymentMethod: "UPI" as const, daysAgo: 0 },
      { amount: 120, category: "Transport", description: "Sample · Metro ride", paymentMethod: "Cash" as const, daysAgo: 1 },
      { amount: 890, category: "Shopping", description: "Sample · Household items", paymentMethod: "Debit Card" as const, daysAgo: 2 },
    ];
    const database = db;
    try {
      const sampleRefs = sampleRows.map((_, index) => doc(database, "users", userId, "transactions", `sample-data-${index + 1}`));
      const existing = await Promise.all(sampleRefs.map((reference) => getDoc(reference)));
      if (existing.some((snapshot) => snapshot.exists() && snapshot.data().isSampleData !== true)) {
        setError("Sample data could not be added because a transaction already uses a reserved sample entry.");
        return false;
      }
      const batch = writeBatch(db);
      sampleRows.forEach((sample, index) => {
        const date = new Date();
        date.setDate(date.getDate() - sample.daysAgo);
        batch.set(sampleRefs[index], {
          type: "expense",
          amount: sample.amount,
          category: sample.category,
          description: sample.description,
          paymentMethod: sample.paymentMethod,
          date: date.toISOString().slice(0, 10),
          createdAt: date.toISOString(),
          isSampleData: true,
        });
      });
      await batch.commit();
      setError(null);
      return true;
    } catch (cause) {
      setError(firebaseErrorMessage(cause, "Unable to add sample data."));
      return false;
    }
  }

  async function clearSampleData() {
    if (!userId || !db) {
      setError("Sign in with a configured Firebase account to clear sample data.");
      return;
    }
    const currentTransactions = savedTransactions.userId === userId ? savedTransactions.transactions : [];
    const sampleTransactions = currentTransactions.filter((transaction) => transaction.isSampleData === true && transaction.id.startsWith("sample-data-"));
    if (!sampleTransactions.length) return;
    const database = db;
    try {
      const batch = writeBatch(db);
      sampleTransactions.forEach((transaction) => batch.delete(doc(database, "users", userId, "transactions", transaction.id)));
      await batch.commit();
      setError(null);
    } catch (cause) {
      setError(firebaseErrorMessage(cause, "Unable to clear sample data."));
    }
  }

  const transactions = savedTransactions.userId === userId ? savedTransactions.transactions : [];

  return (
    <TransactionsContext.Provider
      value={{ transactions, error, clearError: () => setError(null), addTransaction, deleteTransaction, addSampleData, clearSampleData }}
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
