import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
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
import { Navbar } from "./components/Navbar";
import { QuickAddModal } from "./components/QuickAddModal";
import { CommandPalette } from "./components/CommandPalette";
import type { TransactionType } from "./types";

import "./index.css";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="session-loading" role="status" aria-label="Loading your account" aria-busy="true">
        <div className="skeleton" style={{ width: "180px", height: "12px", marginBottom: "18px" }} />
        <div className="skeleton" style={{ width: "min(420px, 90%)", height: "38px", marginBottom: "30px" }} />
        <div className="session-loading-metrics">
          {[0, 1, 2, 3].map((item) => <div className="skeleton" key={item} />)}
        </div>
        <div className="skeleton" style={{ width: "100%", height: "260px", marginTop: "28px" }} />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

function ObservatoryLayout() {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<TransactionType>("expense");
  const [commandOpen, setCommandOpen] = useState(false);
  const openQuickAdd = (type: TransactionType = "expense") => {
    setQuickAddType(type);
    setQuickAddOpen(true);
  };
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);
  return (
    <div className="observatory-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navbar onOpenQuickAdd={() => openQuickAdd()} onOpenCommandPalette={() => setCommandOpen(true)} />
      <Outlet context={{ openQuickAdd }} />
      <QuickAddModal isOpen={quickAddOpen} initialType={quickAddType} onClose={() => setQuickAddOpen(false)} />
      {commandOpen && <CommandPalette onClose={() => setCommandOpen(false)} onQuickAdd={() => setQuickAddOpen(true)} />}
    </div>
  );
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

  useEffect(() => {
    const timers = notices.map(({ clear }) => window.setTimeout(clear, 7000));
    return () => timers.forEach(window.clearTimeout);
  }, [authError, transactionError, budgetError]);

  if (!notices.length) return null;

  return (
    <div
      className="toast-stack"
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
          className="toast-item"
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
              <Route element={<ProtectedRoute><ObservatoryLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/budgets" element={<Budgets />} />
                <Route path="/ledger" element={<Ledger />} />
                <Route path="/prediction" element={<Prediction />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
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
