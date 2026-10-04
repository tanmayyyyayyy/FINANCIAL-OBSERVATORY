import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  Percent,
  ArrowRight,
  Plus,
  Compass,
} from "lucide-react";
import { useTransactions } from "../context/TransactionsContext";
import { useBudgets } from "../context/BudgetsContext";
import { Navbar } from "../components/Navbar";
import { MetricCard } from "../components/MetricCard";
import { SpendingChart } from "../components/SpendingChart";
import { CategoryBreakdown } from "../components/CategoryBreakdown";
import { QuickAddModal } from "../components/QuickAddModal";
import { formatCurrency, formatDate } from "../utils/formatters";
import {
  computeFinancialSummary,
  computeDailySpendingSeries,
} from "../utils/analytics";

export function Dashboard() {
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Time-aware contextual greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const summary = useMemo(() => {
    return computeFinancialSummary(transactions, budgets, 86735);
  }, [transactions, budgets]);

  const chartSeries = useMemo(() => {
    return computeDailySpendingSeries(transactions, 14);
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="page-wrapper">
      <Navbar onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      <main className="content-wrapper">
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
                <span>OBSERVATORY TELEMETRY • LIVE RECONCILIATION</span>
              </div>
              <h1 style={{ fontSize: "clamp(2.0rem, 3.8vw, 2.9rem)", marginBottom: "4px" }}>
                {greeting}, Tanmay.
              </h1>
              <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.48)" }}>
                Your financial picture, at a glance. Capital velocity and burn rates are nominal.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                className="button button-primary"
                onClick={() => setIsQuickAddOpen(true)}
              >
                <Plus size={13} strokeWidth={2.5} />
                <span>Log Movement</span>
              </button>
            </div>
          </div>

          {/* Primary Financial Metrics */}
          <section className="metrics-strip">
            <MetricCard
              label="Net Balance"
              value={formatCurrency(summary.netBalance)}
              subtext="vs previous cycle"
              trend={{ value: "+8.4%", isPositive: true }}
              icon={<Wallet size={14} />}
            />
            <MetricCard
              label="Monthly Outflow"
              value={formatCurrency(summary.totalSpent)}
              subtext={`${summary.budgetUtilization.toFixed(0)}% of envelope`}
              trend={{
                value: `${summary.budgetUtilization > 100 ? "Over Budget" : "Nominal"}`,
                isNegative: summary.budgetUtilization > 100,
                isPositive: summary.budgetUtilization <= 100,
              }}
              icon={<TrendingDown size={14} />}
            />
            <MetricCard
              label="Monthly Inflow"
              value={formatCurrency(summary.monthlyIncome)}
              subtext="reconciled deposits"
              trend={{ value: "+0.0%", isPositive: false }}
              icon={<TrendingUp size={14} />}
            />
            <MetricCard
              label="Savings Ratio"
              value={`${summary.savingsRate.toFixed(1)}%`}
              subtext="capital retained"
              trend={{ value: "+4.2%", isPositive: true }}
              icon={<Percent size={14} />}
            />
          </section>

          {/* Dominant Financial Terrain Visualization & Allocation Breakdown */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.65fr) minmax(0, 1fr)",
              gap: "20px",
              marginBottom: "20px",
            }}
            className="dashboard-main-grid animate-fade-in"
          >
            <SpendingChart data={chartSeries} />
            <CategoryBreakdown categories={summary.categorySpends} />
          </section>

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
                  <div className="eyebrow">TRANSACTION LOG</div>
                  <h2 style={{ fontSize: "1.4rem", marginTop: "2px" }}>Recent Movements</h2>
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
                <div style={{ textAlign: "center", padding: "36px 0", color: "rgba(255,255,255,0.3)" }}>
                  <div style={{ fontSize: "13px" }}>No transactions recorded in this cycle.</div>
                </div>
              ) : (
                <div className="ledger-table-container">
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
                            <span className="amount-debit">
                              −{formatCurrency(tx.amount)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                      <Compass size={11} />
                      <span>FORWARD HORIZON</span>
                    </div>
                    <h2 style={{ fontSize: "1.4rem", marginTop: "2px" }}>Predictive Burn</h2>
                  </div>
                </div>

                <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.48)", marginBottom: "20px", lineHeight: 1.65 }}>
                  Based on current velocity, your projected month-end expenditure is:
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
                    PROJECTED OUTFLOW
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
                      ? `Exceeds budget envelope by ${formatCurrency(
                          summary.projectedMonthEnd - summary.totalBudget
                        )}`
                      : `Within budget ceiling by ${formatCurrency(
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
                      label: "Velocity",
                      value: `Current burn rate is ${formatCurrency(summary.spendingVelocity)}/day.`,
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

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </div>
  );
}
