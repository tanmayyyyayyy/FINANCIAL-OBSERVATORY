import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TransactionsProvider, useTransactions } from "./context/TransactionsContext";
import { BudgetsProvider, useBudgets } from "./context/BudgetsContext";

import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Onboarding } from "./pages/Onboarding";
import { Dashboard } from "./pages/Dashboard";
import { Budgets } from "./pages/Budgets";
import { Ledger } from "./pages/Ledger";
import { Prediction } from "./pages/Prediction";
import { Settings } from "./pages/Settings";
import { AddExpense } from "./pages/AddExpense";
import { TransactionSuccess } from "./pages/TransactionSuccess";

import "./index.css";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        role="status"
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          color: "rgba(255, 255, 255, 0.5)",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
        }}
      >
        VERIFYING OBSERVER SESSION...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

function FirebaseErrorNotices() {
  const { error: authError, clearError: clearAuthError } = useAuth();
  const { error: transactionError, clearError: clearTransactionError } = useTransactions();
  const { error: budgetError, clearError: clearBudgetError } = useBudgets();
  const notices = [
    { message: authError, clear: clearAuthError },
    { message: transactionError, clear: clearTransactionError },
    { message: budgetError, clear: clearBudgetError },
  ].filter((notice): notice is { message: string; clear: () => void } => Boolean(notice.message));

  if (!notices.length) return null;

  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: 1000,
        width: "min(420px, calc(100vw - 32px))",
        display: "grid",
        gap: "8px",
      }}
    >
      {notices.map(({ message, clear }, index) => (
        <div
          key={`${index}-${message}`}
          role="alert"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            background: "var(--accent-neg-bg)",
            border: "1px solid var(--accent-neg-border)",
            borderRadius: "var(--radius-sm)",
            color: "var(--accent-neg)",
            fontSize: "13px",
          }}
        >
          <span>{message}</span>
          <button type="button" onClick={clear} aria-label="Dismiss message">×</button>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TransactionsProvider>
        <BudgetsProvider>
          <BrowserRouter>
            <FirebaseErrorNotices />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
              <Route path="/ledger" element={<ProtectedRoute><Ledger /></ProtectedRoute>} />
              <Route path="/prediction" element={<ProtectedRoute><Prediction /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/add-expense" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
              <Route path="/transaction-success" element={<ProtectedRoute><TransactionSuccess /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </BudgetsProvider>
      </TransactionsProvider>
    </AuthProvider>
  );
}