import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TransactionsProvider } from "./context/TransactionsContext";
import { BudgetsProvider } from "./context/BudgetsContext";

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

export default function App() {
  return (
    <TransactionsProvider>
      <BudgetsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/ledger" element={<Ledger />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/transaction-success" element={<TransactionSuccess />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </BudgetsProvider>
    </TransactionsProvider>
  );
}