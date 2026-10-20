import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TransactionsProvider, useTransactions } from "./context/TransactionsContext";
import { BudgetsProvider, useBudgets } from "./context/BudgetsContext";
import { FinancialProfileProvider, useFinancialProfile } from "./context/FinancialProfileContext";
import { AiPreferencesProvider } from "./context/AiPreferencesContext";

import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Onboarding } from "./pages/Onboarding";
import { Navbar } from "./components/Navbar";
import { QuickAddModal } from "./components/QuickAddModal";
import { CommandPalette } from "./components/CommandPalette";
import { AskYourMoney } from "./components/AskYourMoney";
import { PwaInstallPrompt } from "./components/PwaInstallPrompt";
import { useIdleTimeout } from "./utils/useIdleTimeout";
import { usePrivacyShield } from "./utils/usePrivacyShield";
import type { TransactionType } from "./types";

import "./index.css";

// ── Code-split heavy routes to reduce initial bundle (traffic scalability) ──
const Dashboard = lazy(() => import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const Budgets = lazy(() => import("./pages/Budgets").then((m) => ({ default: m.Budgets })));
const Ledger = lazy(() => import("./pages/Ledger").then((m) => ({ default: m.Ledger })));
const Prediction = lazy(() => import("./pages/Prediction").then((m) => ({ default: m.Prediction })));
const Settings = lazy(() => import("./pages/Settings").then((m) => ({ default: m.Settings })));
const AddExpense = lazy(() => import("./pages/AddExpense").then((m) => ({ default: m.AddExpense })));
const QuickAdd = lazy(() => import("./pages/QuickAdd").then((m) => ({ default: m.QuickAdd })));
const TransactionSuccess = lazy(() => import("./pages/TransactionSuccess").then((m) => ({ default: m.TransactionSuccess })));

function RouteFallback() {
  return (
    <div className="session-loading" role="status" aria-label="Loading page" aria-busy="true">
      <div className="skeleton" style={{ width: "180px", height: "12px", marginBottom: "18px" }} />
      <div className="skeleton" style={{ width: "min(420px, 90%)", height: "38px", marginBottom: "30px" }} />
      <div className="skeleton" style={{ width: "100%", height: "260px", marginTop: "28px" }} />
    </div>
  );
}

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
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<TransactionType>("expense");
  const [commandOpen, setCommandOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const openQuickAdd = (type: TransactionType = "expense") => {
    setQuickAddType(type);
    setQuickAddOpen(true);
  };

  // Idle session timeout — auto-logout after 30 min inactivity (security)
  useIdleTimeout(30 * 60 * 1000);

  // Privacy shield & background screen protection
  const { isPrivacyMode, togglePrivacyMode } = usePrivacyShield();

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
      <Navbar
        onOpenQuickAdd={() => openQuickAdd()}
        onOpenCommandPalette={() => setCommandOpen(true)}
        onAskYourMoney={() => setAskOpen(true)}
        onTogglePrivacy={togglePrivacyMode}
        isPrivacyMode={isPrivacyMode}
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={location.pathname} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -4 }} transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}>
          <Suspense fallback={<RouteFallback />}>
            <Outlet context={{ openQuickAdd, openAskYourMoney: () => setAskOpen(true) }} />
          </Suspense>
        </motion.div>
      </AnimatePresence>
      <QuickAddModal isOpen={quickAddOpen} initialType={quickAddType} onClose={() => setQuickAddOpen(false)} />
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onQuickAdd={() => { setCommandOpen(false); openQuickAdd(); }}
        onAskYourMoney={() => { setCommandOpen(false); setAskOpen(true); }}
        onTogglePrivacy={togglePrivacyMode}
      />
      <AskYourMoney open={askOpen} onClose={() => setAskOpen(false)} />
    </div>
  );
}

function FirebaseErrorNotices() {
  const { error: authError, clearError: clearAuthError } = useAuth();
  const { error: transactionError, clearError: clearTransactionError } = useTransactions();
  const { error: budgetError, clearError: clearBudgetError } = useBudgets();
  const { error: profileError, clearError: clearProfileError } = useFinancialProfile();
  const notices = [
    { message: authError, clear: clearAuthError },
    { message: transactionError, clear: clearTransactionError },
    { message: budgetError, clear: clearBudgetError },
    { message: profileError, clear: clearProfileError },
  ].filter((notice): notice is { message: string; clear: () => void } => Boolean(notice.message));

  useEffect(() => {
    const timers = notices.map(({ clear }) => window.setTimeout(clear, 7000));
    return () => timers.forEach(window.clearTimeout);
  }, [authError, transactionError, budgetError, profileError]);

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
      <FinancialProfileProvider>
        <AiPreferencesProvider>
          <TransactionsProvider>
            <BudgetsProvider>
              <BrowserRouter>
            <FirebaseErrorNotices />
            <PwaInstallPrompt />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route element={<ProtectedRoute><ObservatoryLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Suspense fallback={<RouteFallback />}><Dashboard /></Suspense>} />
                <Route path="/budgets" element={<Suspense fallback={<RouteFallback />}><Budgets /></Suspense>} />
                <Route path="/ledger" element={<Suspense fallback={<RouteFallback />}><Ledger /></Suspense>} />
                <Route path="/prediction" element={<Suspense fallback={<RouteFallback />}><Prediction /></Suspense>} />
                <Route path="/settings" element={<Suspense fallback={<RouteFallback />}><Settings /></Suspense>} />
              </Route>
              <Route path="/quick-add" element={<ProtectedRoute><Suspense fallback={<RouteFallback />}><QuickAdd /></Suspense></ProtectedRoute>} />
              <Route path="/add-expense" element={<ProtectedRoute><Suspense fallback={<RouteFallback />}><AddExpense /></Suspense></ProtectedRoute>} />
              <Route path="/transaction-success" element={<ProtectedRoute><Suspense fallback={<RouteFallback />}><TransactionSuccess /></Suspense></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
              </BrowserRouter>
            </BudgetsProvider>
          </TransactionsProvider>
        </AiPreferencesProvider>
      </FinancialProfileProvider>
    </AuthProvider>
  );
}
