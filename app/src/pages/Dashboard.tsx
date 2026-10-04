import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  Percent,
  ArrowRight,
  Plus,
  Receipt,
} from "lucide-react";
import { useTransactions } from "../context/TransactionsContext";
import { useAuth } from "../context/AuthContext";
import { useBudgets } from "../context/BudgetsContext";
import { MetricCard } from "../components/MetricCard";
import { SpendingChart } from "../components/SpendingChart";
import { CategoryBreakdown } from "../components/CategoryBreakdown";
import { formatCurrency, formatDate } from "../utils/formatters";
import {
  computeFinancialSummary,
  computeDailySpendingSeries,
  calculatePeriodComparison,
  isIncomeTransaction,
} from "../utils/analytics";
import { EmptyState } from "../components/EmptyState";
import type { TransactionType } from "../types";

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export function Dashboard() {
  const { openQuickAdd } = useOutletContext<{ openQuickAdd: (type?: TransactionType) => void }>();
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();
  const { user } = useAuth();

  // Time-aware contextual greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const summary = useMemo(() => {
    return computeFinancialSummary(transactions, budgets);
  }, [transactions, budgets]);
  const comparison = useMemo(() => calculatePeriodComparison(transactions), [transactions]);

  const chartSeries = useMemo(() => {
    return computeDailySpendingSeries(transactions, 30);
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);
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
            className="animate-slide-up"
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

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                className="button button-primary"
                onClick={() => openQuickAdd()}
              >
                <Plus size={13} strokeWidth={2.5} />
                <span>Add transaction</span>
              </button>
            </div>
          </div>

          {/* Primary Financial Metrics */}
          <section className="metrics-strip">
            <MetricCard
              label="Money Left"
              value={formatCurrency(summary.netBalance)}
              numericValue={summary.netBalance}
              formatValue={formatCurrency}
              subtext="vs previous month to date"
              trend={trend(comparison.balanceChange)}
              icon={<Wallet size={14} />}
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
              value={`${summary.savingsRate.toFixed(1)}%`}
              numericValue={summary.savingsRate}
              formatValue={formatPercent}
              subtext="vs previous month to date"
              trend={comparison.savingsRateChange === null ? { value: "No previous period" } : { value: `${comparison.savingsRateChange > 0 ? "+" : ""}${comparison.savingsRateChange.toFixed(1)} pts`, isPositive: comparison.savingsRateChange > 0, isNegative: comparison.savingsRateChange < 0 }}
              icon={<Percent size={14} />}
            />
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
                  <span>Full Ledger</span>
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
                      {recentTransactions.map((tx) => (
                        <tr key={tx.id}>
                          <td style={{ fontWeight: 500, color: "#ffffff" }}>
                            {tx.description || tx.category}
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="dashboard-mobile-transactions">
                  {recentTransactions.map((tx) => (
                    <div className="dashboard-mobile-transaction" key={tx.id}>
                      <span className="transaction-category-icon" aria-hidden="true"><Receipt size={16} /></span>
                      <span className="dashboard-mobile-transaction-copy">
                        <strong>{tx.category}</strong>
                        <span>{formatDate(tx.date)}</span>
                      </span>
                      <strong className={isIncomeTransaction(tx) ? "amount-credit" : "amount-debit"}>{isIncomeTransaction(tx) ? "+" : "−"}{formatCurrency(tx.amount)}</strong>
                    </div>
                  ))}
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
                    <h2 style={{ fontSize: "1.4rem", marginTop: "2px" }}>Month-end estimate</h2>
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
        </div>
      </main>

    </div>
  );
}
