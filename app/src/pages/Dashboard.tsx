import { useMemo, useState, useEffect } from "react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  Percent,
  ArrowRight,
  Plus,
  Receipt,
  Mic,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Zap,
  Apple,
  X,
} from "lucide-react";
import { useTransactions } from "../context/TransactionsContext";
import { useAuth } from "../context/AuthContext";
import { useBudgets } from "../context/BudgetsContext";
import { useFinancialProfile } from "../context/FinancialProfileContext";
import { MetricCard } from "../components/MetricCard";
import { SpendingChart } from "../components/SpendingChart";
import { CategoryBreakdown } from "../components/CategoryBreakdown";
import { DashboardBudgets } from "../components/DashboardBudgets";
import { GoalPlanner } from "../components/GoalPlanner";
import { MobileShortcutModal } from "../components/MobileShortcutModal";
import { formatCurrency, formatDate } from "../utils/formatters";
import {
  computeFinancialSummary,
  computeDailySpendingSeries,
  calculatePeriodComparison,
  isIncomeTransaction,
} from "../utils/analytics";
import { EmptyState } from "../components/EmptyState";
import { VoiceExpenseModal } from "../components/VoiceExpenseModal";
import type { TransactionType } from "../types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { calculateFinancialSignals } from "../utils/insights";
import { generateWeeklyInsight } from "../firebase/ai";
import { useAiPreferences } from "../context/AiPreferencesContext";
import { AnimatedButton, BorderBeam } from "@/components/ui";

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { openQuickAdd, openAskYourMoney } = useOutletContext<{ openQuickAdd: (type?: TransactionType) => void; openAskYourMoney: () => void }>();
  const { transactions, addSampleData, clearSampleData } = useTransactions();
  const { budgets } = useBudgets();
  const { profile } = useFinancialProfile();
  const { user } = useAuth();
  const { enabled: aiEnabled } = useAiPreferences();
  const [weeklyInsight, setWeeklyInsight] = useState<{ summary: string; suggestions: string[] } | null>(null);
  const [setupCollapsed, setSetupCollapsed] = useState<boolean | null>(null);
  const initialAction = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("action") : null;
  const [voiceModalOpen, setVoiceModalOpen] = useState(() => initialAction === "voice");
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(() => initialAction === "shortcuts" || initialAction === "shortcut");
  const [shortcutsModalTab, setShortcutsModalTab] = useState<"ios" | "android">("ios");
  const [welcomeDismissed, setWelcomeDismissed] = useState(() => {
    try {
      return localStorage.getItem("fo_welcome_dismissed") === "true";
    } catch {
      return false;
    }
  });
  const [insightBusy, setInsightBusy] = useState(false);
  const [insightError, setInsightError] = useState("");
  const reduceMotion = useReducedMotion();

  // Handle URL shortcut triggers that require contextual handlers
  useEffect(() => {
    const action = searchParams.get("action");
    if (!action) return;
    if (action === "ask") {
      openAskYourMoney();
      setSearchParams({}, { replace: true });
    } else if (action === "quickadd") {
      openQuickAdd("expense");
      setSearchParams({}, { replace: true });
    } else if (action === "income") {
      openQuickAdd("income");
      setSearchParams({}, { replace: true });
    } else if (action === "voice" || action === "shortcuts" || action === "shortcut") {
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, openAskYourMoney, openQuickAdd, setSearchParams]);

  // Time-aware contextual greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const summary = useMemo(() => {
    return computeFinancialSummary(transactions, budgets, profile.monthlyIncome, profile.monthlyBudget);
  }, [transactions, budgets, profile.monthlyIncome, profile.monthlyBudget]);
  const comparison = useMemo(() => calculatePeriodComparison(transactions), [transactions]);
  const signals = useMemo(() => calculateFinancialSignals(transactions, budgets), [transactions, budgets]);

  async function loadWeeklyInsight() {
    if (!aiEnabled || insightBusy) return;
    setInsightBusy(true); setInsightError("");
    try { setWeeklyInsight(await generateWeeklyInsight()); }
    catch (cause) {
      const code = typeof cause === "object" && cause && "code" in cause ? String(cause.code) : "";
      setInsightError(code.includes("resource-exhausted") ? "You've reached your AI limit for now. Try again later." : "AI couldn't respond right now. Try again.");
    } finally { setInsightBusy(false); }
  }

  const chartSeries = useMemo(() => {
    return computeDailySpendingSeries(transactions, 30);
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);
  const realTransactions = transactions.filter((transaction) => transaction.isSampleData !== true);
  const hasSampleData = transactions.some((transaction) => transaction.isSampleData === true);
  const checklistItems = [
    { label: "Set income", done: profile.monthlyIncome > 0, action: () => navigate("/onboarding") },
    { label: "Set budget", done: profile.monthlyBudget > 0, action: () => navigate("/onboarding") },
    { label: "Add first expense", done: realTransactions.some((transaction) => transaction.type !== "income"), action: () => openQuickAdd("expense") },
    { label: "Set category limits", done: budgets.some((budget) => budget.limit > 0), action: () => navigate("/budgets") },
  ];
  const setupDoneCount = checklistItems.filter((item) => item.done).length;
  const setupExpanded = setupCollapsed === null ? setupDoneCount < 3 : !setupCollapsed;
  const nextSetupAction = checklistItems.find((item) => !item.done)?.action;
  const displayName = user?.displayName?.trim() || user?.email || "there";
  const trend = (change: number | null, lowerIsBetter = false) => change === null
    ? { value: "No previous period" }
    : { value: `${change > 0 ? "+" : ""}${change.toFixed(1)}%`, isPositive: lowerIsBetter ? change < 0 : change > 0, isNegative: lowerIsBetter ? change > 0 : change < 0 };

  return (
    <div className="page-wrapper">

      <main id="main-content" tabIndex={-1} className="content-wrapper">
        <div className="app-container" style={{ paddingTop: "40px" }}>
          {/* Contextual Command Center Header */}
          <div
            className="dashboard-hero animate-slide-up"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "32px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <div className="eyebrow">
                <span className="dot" />
                <span>YOUR MONEY THIS MONTH</span>
              </div>
              <h1 style={{ fontSize: "clamp(2.0rem, 3.8vw, 2.9rem)", marginBottom: "4px" }}>
                {greeting}, {displayName}.
              </h1>
              <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.48)" }}>
                Your money at a glance. See what came in and what went out.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className="dashboard-header-cta">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => {
                  setShortcutsModalTab("ios");
                  setShortcutsModalOpen(true);
                }}
                aria-label="Set up mobile shortcuts"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Smartphone size={13} />
                <span>Phone Shortcut</span>
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setVoiceModalOpen(true)}
                aria-label="Start voice expense entry"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Mic size={13} />
                <span>Voice Entry</span>
              </button>
              <AnimatedButton
                type="button"
                className="button button-primary"
                onClick={() => openQuickAdd()}
              >
                <Plus size={13} strokeWidth={2.5} />
                <span>Add transaction</span>
              </AnimatedButton>
            </div>
          </div>

          {/* Comprehensive Quick Actions Hub */}
          <div className="dashboard-quick-actions-bar" aria-label="Quick financial actions">
            <button
              type="button"
              className="quick-action-btn primary"
              onClick={() => openQuickAdd("expense")}
              aria-label="Add expense"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>+ Expense</span>
            </button>
            <button
              type="button"
              className="quick-action-btn"
              onClick={() => openQuickAdd("income")}
              aria-label="Add income"
            >
              <TrendingUp size={14} />
              <span>+ Income</span>
            </button>
            <button
              type="button"
              className="quick-action-btn"
              onClick={() => setVoiceModalOpen(true)}
              aria-label="Start voice expense entry"
            >
              <Mic size={14} />
              <span>🎙 Voice Entry</span>
            </button>
            <Link
              to="/quick-add"
              className="quick-action-btn"
              aria-label="Open 5-second Quick Add"
            >
              <Zap size={14} />
              <span>⚡ 5-Sec Add</span>
            </Link>
            <button
              type="button"
              className="quick-action-btn"
              onClick={openAskYourMoney}
              aria-label="Ask your money AI"
            >
              <Sparkles size={14} />
              <span>Ask AI</span>
            </button>
            <button
              type="button"
              className="quick-action-btn shortcut-highlight"
              onClick={() => {
                setShortcutsModalTab("ios");
                setShortcutsModalOpen(true);
              }}
              aria-label="Open mobile shortcuts modal"
            >
              <Smartphone size={14} />
              <span>📱 Phone Shortcut</span>
            </button>
          </div>

          {/* New User Welcome & Orientation Banner */}
          {!welcomeDismissed && (
            <div className="dashboard-welcome-banner animate-fade-in" role="region" aria-label="New User Guide">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                <div>
                  <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <Sparkles size={13} style={{ color: "var(--accent-pos, #10b981)" }} />
                    <span>NEW USER GUIDE · FINANCIAL OBSERVATORY</span>
                  </div>
                  <h2 style={{ fontSize: "1.35rem", fontWeight: 600, color: "#fff", margin: 0 }}>
                    Welcome to Your Financial Command Center
                  </h2>
                  <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.6)", marginTop: "4px", maxWidth: "620px" }}>
                    Everything is calculated from ground truth: <strong>Money Left = Money In − Money Out</strong>. Follow 3 simple steps to get the most clarity:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      localStorage.setItem("fo_welcome_dismissed", "true");
                    } catch {
                      // storage unavailable
                    }
                    setWelcomeDismissed(true);
                  }}
                  aria-label="Dismiss welcome guide"
                  style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255, 255, 255, 0.6)",
                    cursor: "pointer",
                  }}
                >
                  <X size={14} />
                </button>
              </div>

              <div className="dashboard-welcome-grid">
                <div className="dashboard-welcome-step">
                  <div>
                    <strong>1. Set Income & Limits</strong>
                    <p>Income: {formatCurrency(profile.monthlyIncome)} · Budget: {formatCurrency(profile.monthlyBudget)}</p>
                  </div>
                  <button
                    type="button"
                    className="button button-ghost"
                    onClick={() => navigate("/onboarding")}
                    style={{ fontSize: "11.5px", padding: "4px 8px", width: "fit-content" }}
                  >
                    Set Income / Budget →
                  </button>
                </div>

                <div className="dashboard-welcome-step">
                  <div>
                    <strong>2. Track in Seconds</strong>
                    <p>Log transactions via keyboard, scan receipts, or speak naturally.</p>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      className="button button-ghost"
                      onClick={() => openQuickAdd("expense")}
                      style={{ fontSize: "11.5px", padding: "4px 8px" }}
                    >
                      + Expense
                    </button>
                    {transactions.length === 0 && (
                      <button
                        type="button"
                        className="button button-ghost"
                        onClick={() => void addSampleData()}
                        style={{ fontSize: "11.5px", padding: "4px 8px" }}
                      >
                        Try Sample Data
                      </button>
                    )}
                  </div>
                </div>

                <div className="dashboard-welcome-step">
                  <div>
                    <strong>3. Phone Shortcuts</strong>
                    <p>Double-tap the back of your iPhone or tap 1 icon on Android.</p>
                  </div>
                  <button
                    type="button"
                    className="button button-ghost"
                    onClick={() => {
                      setShortcutsModalTab("ios");
                      setShortcutsModalOpen(true);
                    }}
                    style={{ fontSize: "11.5px", padding: "4px 8px", width: "fit-content" }}
                  >
                    Setup Phone Shortcut →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile-only quick-action strip — hidden on desktop via CSS */}
          <div className="dashboard-mobile-cta" aria-label="Track an expense quick action">
            <div className="dashboard-mobile-cta-copy">
              <strong>Track an expense</strong>
              <span>Add your latest spending in seconds.</span>
            </div>
            <div className="dashboard-mobile-cta-actions">
              <button
                type="button"
                className="dashboard-mobile-cta-btn"
                onClick={() => openQuickAdd("expense")}
                aria-label="Add expense"
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>+ Add Expense</span>
              </button>
              <button
                type="button"
                className="dashboard-mobile-cta-btn voice-btn"
                onClick={() => setVoiceModalOpen(true)}
                aria-label="Start voice expense entry"
              >
                <Mic size={15} strokeWidth={2.5} />
                <span>🎙 Speak</span>
              </button>
            </div>
          </div>

          {checklistItems.some((item) => !item.done) && (() => {
            if (!setupExpanded) {
              return (
                <motion.section
                  className="get-started-card get-started-collapsed"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  aria-labelledby="get-started-title"
                >
                  <div className="get-started-heading get-started-heading-collapsed">
                    <div className="get-started-collapsed-title">
                      <h2 id="get-started-title">Get started</h2>
                      <span>{setupDoneCount} of {checklistItems.length} done</span>
                    </div>
                    <div className="get-started-heading-actions">
                      {nextSetupAction && (
                        <button type="button" className="button button-ghost" onClick={nextSetupAction}>Resume setup</button>
                      )}
                      <button
                        type="button"
                        className="button-icon get-started-toggle"
                        aria-expanded="false"
                        aria-controls="get-started-list"
                        aria-label="Expand setup checklist"
                        onClick={() => setSetupCollapsed(false)}
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>
                </motion.section>
              );
            }
            return (
              <motion.section
                className="get-started-card"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                aria-labelledby="get-started-title"
              >
                <div className="get-started-heading">
                  <div><div className="eyebrow">A FEW SIMPLE STEPS</div><h2 id="get-started-title">Get started</h2></div>
                  <div className="get-started-heading-actions">
                    <span>{setupDoneCount} of {checklistItems.length} done</span>
                    <button
                      type="button"
                      className="button-icon get-started-toggle"
                      aria-expanded="true"
                      aria-controls="get-started-list"
                      aria-label="Collapse setup checklist"
                      onClick={() => setSetupCollapsed(true)}
                    >
                      <ChevronUp size={16} />
                    </button>
                  </div>
                </div>
                <div className="get-started-list" id="get-started-list">
                  {checklistItems.map((item) => <div className="get-started-item" key={item.label}>
                    <motion.span className={`get-started-check ${item.done ? "complete" : ""}`} initial={false} animate={{ scale: item.done ? [0.7, 1.1, 1] : 1 }} transition={{ duration: 0.28 }} aria-hidden="true">{item.done ? "✓" : ""}</motion.span>
                    <span>{item.label}</span>
                    {!item.done && <button type="button" className="button button-ghost" onClick={item.action}>Set up</button>}
                  </div>)}
                </div>
              </motion.section>
            );
          })()}

          {/* Primary Financial Metrics */}
          <section className="metrics-strip">
            <MetricCard
              label="Money Left"
              title="How much money you have left after your spending."
              value={formatCurrency(summary.netBalance)}
              numericValue={summary.netBalance}
              formatValue={formatCurrency}
              subtext="vs previous month to date"
              trend={trend(comparison.balanceChange)}
              icon={<Wallet size={14} />}
              highlight
            />
            <MetricCard
              label="Money Out"
              value={formatCurrency(summary.totalSpent)}
              numericValue={summary.totalSpent}
              formatValue={formatCurrency}
              subtext={`${summary.budgetUtilization.toFixed(0)}% of your budget`}
              trend={trend(comparison.spendingChange, true)}
              icon={<TrendingDown size={14} />}
            />
            <MetricCard
              label="Money In"
              value={formatCurrency(summary.monthlyIncome)}
              numericValue={summary.monthlyIncome}
              formatValue={formatCurrency}
              subtext="vs previous month to date"
              trend={trend(comparison.incomeChange)}
              icon={<TrendingUp size={14} />}
            />
            <MetricCard
              label="Saved"
              title="How much of your income you have kept."
              value={`${summary.savingsRate.toFixed(1)}%`}
              numericValue={summary.savingsRate}
              formatValue={formatPercent}
              subtext="vs previous month to date"
              trend={comparison.savingsRateChange === null ? { value: "No previous period" } : { value: `${comparison.savingsRateChange > 0 ? "+" : ""}${comparison.savingsRateChange.toFixed(1)} pts`, isPositive: comparison.savingsRateChange > 0, isNegative: comparison.savingsRateChange < 0 }}
              icon={<Percent size={14} />}
            />
          </section>

          <section className="dashboard-insights relative overflow-hidden" aria-labelledby="insights-title">
            <BorderBeam
              size={200}
              duration={14}
              borderWidth={1}
              colorFrom="rgba(99, 102, 241, 0.35)"
              colorTo="rgba(168, 85, 247, 0.15)"
            />
            <div className="dashboard-insights-head"><div><div className="eyebrow">YOUR RECENT ACTIVITY</div><h2 id="insights-title">Weekly money check-in</h2></div><div className="dashboard-insight-actions"><button type="button" className="button button-secondary" onClick={openAskYourMoney}>Ask your money</button>{aiEnabled && <button type="button" className="button button-secondary" onClick={() => void loadWeeklyInsight()} disabled={insightBusy}><Sparkles size={14} />{insightBusy ? "Summarizing…" : "Explain my week"}</button>}</div></div>
            <div className="dashboard-insights-grid">
              <div><span>Money out this week</span><strong>{formatCurrency(signals.weeklyExpenses)}</strong><small>{signals.previousWeekExpenses > 0 ? `${signals.weeklyExpenses > signals.previousWeekExpenses ? "Up" : "Down"} ${formatCurrency(Math.abs(signals.weeklyExpenses - signals.previousWeekExpenses))} from last week` : "Compared with your previous 7 days"}</small></div>
              <div><span>Budget reminders</span><strong>{signals.budgetAlerts.length ? signals.budgetAlerts.length : "All clear"}</strong><small>{signals.budgetAlerts[0] ? `${signals.budgetAlerts[0].category} is at ${Math.round(signals.budgetAlerts[0].spent / signals.budgetAlerts[0].limit * 100)}% with ${signals.budgetAlerts[0].daysLeft} days left` : "No category limits are close to their limit"}</small></div>
              <div><span>Activity to review</span><strong>{signals.unusual.length + signals.duplicates.length}</strong><small>{signals.duplicates.length ? `${signals.duplicates.length} possible duplicate group${signals.duplicates.length > 1 ? "s" : ""}` : signals.unusual.length ? `${signals.unusual.length} unusual charge${signals.unusual.length > 1 ? "s" : ""} for you to check` : "No unusual or repeated entries found"}</small></div>
            </div>
            {signals.budgetAlerts.slice(0, 2).map((alert) => <p className="signal-alert" key={alert.category}>{alert.category} is at {Math.round(alert.spent / alert.limit * 100)}% with {alert.daysLeft} days left.</p>)}
            {signals.unusual.map((transaction) => <p className="signal-alert" key={`unusual-${transaction.id}`}>Check {transaction.description || transaction.category} · {formatCurrency(transaction.amount)} is much higher than your past {transaction.category} entries.</p>)}
            {signals.duplicates.map((group) => <p className="signal-alert" key={`duplicate-${group[0].id}`}>Possible duplicate: {group[0].description || group[0].category} · {formatCurrency(group[0].amount)} on {formatDate(group[0].date)}. Review it in Transactions.</p>)}
            {signals.recurring.length > 0 && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "16px 18px",
                  borderRadius: "var(--radius-md, 12px)",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-pos, #10b981)" }} />
                    <strong style={{ fontSize: "12px", letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.75)" }}>
                      Active Subscriptions & Recurring Charges
                    </strong>
                  </div>
                  <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)" }}>
                    {signals.recurring.length} recurring commitment{signals.recurring.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
                  {signals.recurring.map((item) => (
                    <div
                      key={item.merchant}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "13px", fontWeight: 500, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.merchant}
                        </div>
                        <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)", marginTop: "2px" }}>
                          Every {item.intervalDays >= 26 ? "month" : "week"} · {item.count} payments
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255, 255, 255, 0.9)", fontVariantNumeric: "tabular-nums" }}>
                          {formatCurrency(item.amount)}
                        </div>
                        <span style={{ fontSize: "10px", color: "var(--accent-warn, #f59e0b)", background: "rgba(245, 158, 11, 0.1)", padding: "1px 5px", borderRadius: "3px" }}>
                          Recurring
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {weeklyInsight && (
              <div className="ai-weekly-summary relative overflow-hidden">
                <BorderBeam
                  size={140}
                  duration={9}
                  borderWidth={1.5}
                  colorFrom="var(--accent-pos)"
                  colorTo="rgba(99, 102, 241, 0.5)"
                />
                <strong>AI explanation</strong>
                <p>{weeklyInsight.summary}</p>
                {weeklyInsight.suggestions.map((item) => <p key={item}>• {item}</p>)}
              </div>
            )}
            {insightError && <p role="alert" className="signal-error">{insightError}</p>}
          </section>

          {/* Dominant Financial Terrain Visualization & Allocation Breakdown */}
          {transactions.length === 0 ? <section className="dashboard-zero-state">
            <div className="eyebrow"><span className="dot" /> YOUR PERSONAL MONEY TRACKER</div>
            <h2>Your money starts here</h2>
            <p>Add money coming in or going out and we’ll start tracking it for you.</p>
            <div className="dashboard-zero-actions">
              <button type="button" className="button button-primary" onClick={() => openQuickAdd("income")}>Money In</button>
              <button type="button" className="button button-secondary" onClick={() => openQuickAdd("expense")}>Money Out</button>
            </div>
            <button type="button" className="button button-ghost" onClick={() => void addSampleData()}>Try with sample data</button>
          </section> : <section
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.65fr) minmax(0, 1fr)",
              gap: "20px",
              marginBottom: "20px",
            }}
            className="dashboard-main-grid animate-fade-in"
          >
            <SpendingChart data={chartSeries} onLogExpense={openQuickAdd} />
            <CategoryBreakdown categories={summary.categorySpends} monthlyIncome={summary.monthlyIncome} />
          </section>}

          {/* Category Budgets & Savings Goals Hub */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)",
              gap: "20px",
              marginBottom: "20px",
            }}
            className="dashboard-budgets-goals-grid animate-fade-in"
          >
            <DashboardBudgets categorySpends={summary.categorySpends} totalBudget={summary.totalBudget} />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
              <GoalPlanner />
            </div>
          </section>

          {hasSampleData && <div className="sample-data-notice" role="status">
            <span>Sample data · these entries are examples, not your transactions.</span>
            <button type="button" className="button button-ghost" onClick={() => void clearSampleData()}>Clear sample data</button>
          </div>}

          {/* Institutional Ledger Snippet & Forward Predictive Horizon */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.65fr) minmax(0, 1fr)",
              gap: "20px",
            }}
            className="dashboard-secondary-grid animate-fade-in"
          >
            {/* Recent Movements Ledger */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.012)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-card)",
                padding: "24px 22px",
                transition: "border-color var(--transition-fast)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--border-medium)")}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
            >
              <div className="card-header" style={{ marginBottom: "18px" }}>
                <div>
                    <div className="eyebrow">RECENT ACTIVITY</div>
                    <h2 style={{ fontSize: "1.4rem", marginTop: "2px" }}>Recent activity</h2>
                </div>

                <Link
                  to="/ledger"
                  className="button button-ghost"
                  style={{ fontSize: "12px", padding: "4px 8px" }}
                >
                  <span>View all transactions</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              {recentTransactions.length === 0 ? (
                <EmptyState title="Your ledger is clear" description="Add your first transaction to see recent activity and understand your cash flow." actionText="Add transaction" onAction={() => openQuickAdd()} />
              ) : (
                <>
                <div className="ledger-table-container dashboard-recent-table">
                  <table className="ledger-table">
                    <thead>
                      <tr>
                        <th>Merchant</th>
                        <th>Track</th>
                        <th>Date</th>
                        <th>Rail</th>
                        <th style={{ textAlign: "right" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence initial={false}>
                      {recentTransactions.map((tx) => (
                        <motion.tr key={tx.id} layout initial={reduceMotion ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, scaleY: 0 }} transition={{ duration: reduceMotion ? 0 : 0.18 }} style={{ transformOrigin: "top" }}>
                          <td style={{ fontWeight: 500, color: "#ffffff" }}>
                            {tx.description || tx.category}
                            {tx.isSampleData && <span className="sample-data-badge">Sample</span>}
                          </td>
                          <td>
                            <span className="category-pill">{tx.category}</span>
                          </td>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,255,255,0.38)" }}>
                            {formatDate(tx.date)}
                          </td>
                          <td>
                            <span className="payment-method-tag">{tx.paymentMethod}</span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <span className={isIncomeTransaction(tx) ? "amount-credit" : "amount-debit"}>
                              {isIncomeTransaction(tx) ? "+" : "−"}{formatCurrency(tx.amount)}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
                <div className="dashboard-mobile-transactions">
                  <AnimatePresence initial={false}>
                  {recentTransactions.map((tx) => (
                    <motion.div layout initial={reduceMotion ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, height: 0, paddingBlock: 0 }} transition={{ duration: reduceMotion ? 0 : 0.18 }} className="dashboard-mobile-transaction" key={tx.id}>
                      <span className="transaction-category-icon" aria-hidden="true"><Receipt size={16} /></span>
                      <span className="dashboard-mobile-transaction-copy">
                      <strong>{tx.category}{tx.isSampleData && <span className="sample-data-badge">Sample</span>}</strong>
                        <span>{formatDate(tx.date)}</span>
                      </span>
                      <strong className={isIncomeTransaction(tx) ? "amount-credit" : "amount-debit"}>{isIncomeTransaction(tx) ? "+" : "−"}{formatCurrency(tx.amount)}</strong>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                </div>
                </>
              )}
            </div>

            {/* Predictive Burn Horizon Card */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.012)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-card)",
                padding: "24px 22px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "border-color var(--transition-fast)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--border-medium)")}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
            >
              <div>
                <div className="card-header" style={{ marginBottom: "16px" }}>
                  <div>
                    <div className="eyebrow">
                      <span className="dot" />
                      <span>FORWARD HORIZON</span>
                    </div>
                    <h2 title="What we expect you may spend by the end of the month." style={{ fontSize: "1.4rem", marginTop: "2px" }}>Month-end spending estimate</h2>
                  </div>
                </div>

                <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.48)", marginBottom: "20px", lineHeight: 1.65 }}>
                  Based on your spending so far, you may spend this much by the end of the month:
                </p>

                <div
                  style={{
                    padding: "18px 20px",
                    background: "rgba(255, 255, 255, 0.022)",
                    border: "1px solid rgba(255, 255, 255, 0.065)",
                    borderRadius: "var(--radius-sm)",
                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      color: "rgba(255, 255, 255, 0.38)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "6px",
                    }}
                  >
                    ESTIMATED MONTHLY SPENDING
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 600,
                      color: "#ffffff",
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}
                  >
                    {formatCurrency(summary.projectedMonthEnd)}
                  </div>
                  <div
                    style={{
                      fontSize: "11.5px",
                      color:
                        summary.projectedMonthEnd > summary.totalBudget
                          ? "var(--accent-neg)"
                          : "var(--accent-pos)",
                      marginTop: "5px",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {summary.projectedMonthEnd > summary.totalBudget
                      ? `Above budget by ${formatCurrency(
                          summary.projectedMonthEnd - summary.totalBudget
                        )}`
                      : `Under budget by ${formatCurrency(
                          summary.totalBudget - summary.projectedMonthEnd
                        )}`}
                  </div>
                </div>

                {/* Analytical micro insight strip */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    fontSize: "12.5px",
                  }}
                >
                  {[
                    {
                      label: "Daily average",
                      value: `You have spent about ${formatCurrency(summary.spendingVelocity)} per day this month.`,
                    },
                    {
                      label: "Discretionary",
                      value: `Top category (${summary.categorySpends[0]?.category || "None"}) is ${
                        summary.totalSpent > 0 && summary.categorySpends[0]
                          ? ((summary.categorySpends[0].spent / summary.totalSpent) * 100).toFixed(0)
                          : 0
                      }% of total volume.`,
                    },
                  ].map((insight) => (
                    <div
                      key={insight.label}
                      style={{
                        padding: "10px 13px",
                        borderRadius: "7px",
                        background: "rgba(255, 255, 255, 0.018)",
                        border: "1px solid rgba(255, 255, 255, 0.04)",
                        color: "rgba(255, 255, 255, 0.55)",
                      }}
                    >
                      <strong style={{ color: "#ffffff" }}>{insight.label}: </strong>
                      {insight.value}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.055)" }}>
                <Link
                  to="/prediction"
                  className="button button-secondary"
                  style={{ width: "100%", justifyContent: "center", fontSize: "12.5px" }}
                >
                  <span>Launch Prediction Engine</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </section>

          {/* Instant Mobile Shortcuts Showcase Card */}
          <section className="shortcuts-promo-card animate-fade-in" aria-label="Mobile Shortcuts Guide">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(99, 102, 241, 0.12)",
                  border: "1px solid rgba(99, 102, 241, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-pos, #10b981)",
                  flexShrink: 0,
                }}
              >
                <Zap size={22} />
              </div>
              <div>
                <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <span>INSTANT MOBILE ACCESS</span>
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#fff", margin: 0 }}>
                  Open by Double-Tapping on iPhone · 1-Tap Shortcut on Android
                </h3>
                <p style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.5)", margin: "3px 0 0" }}>
                  Configure physical iPhone Back Tap or Android home screen widget to log expenses in 5 seconds.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => {
                  setShortcutsModalTab("ios");
                  setShortcutsModalOpen(true);
                }}
                style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "5px" }}
              >
                <Apple size={13} />
                <span>iOS Double-Tap</span>
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={() => {
                  setShortcutsModalTab("android");
                  setShortcutsModalOpen(true);
                }}
                style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "5px" }}
              >
                <Smartphone size={13} />
                <span>Android Shortcut</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      <VoiceExpenseModal isOpen={voiceModalOpen} onClose={() => setVoiceModalOpen(false)} />
      <MobileShortcutModal
        isOpen={shortcutsModalOpen}
        defaultTab={shortcutsModalTab}
        onClose={() => setShortcutsModalOpen(false)}
      />
    </div>
  );
}
