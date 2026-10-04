import { useState, useMemo } from "react";
import { Plus, Edit2, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { useBudgets } from "../context/BudgetsContext";
import { useTransactions } from "../context/TransactionsContext";
import { Navbar } from "../components/Navbar";
import { QuickAddModal } from "../components/QuickAddModal";
import { formatCurrency } from "../utils/formatters";
import { computeFinancialSummary } from "../utils/analytics";

export function Budgets() {
  const { budgets, setBudgetLimit } = useBudgets();
  const { transactions } = useTransactions();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newLimitValue, setNewLimitValue] = useState<string>("");

  const summary = useMemo(() => {
    return computeFinancialSummary(transactions, budgets);
  }, [transactions, budgets]);

  function handleSaveLimit(category: string) {
    const parsed = parseFloat(newLimitValue);
    if (!isNaN(parsed) && parsed >= 0) {
      setBudgetLimit(category, parsed);
    }
    setEditingCategory(null);
  }

  const alerts = useMemo(() => {
    const list: Array<{ type: "OVER BUDGET" | "ATTENTION" | "ON TRACK"; text: string }> = [];

    summary.categorySpends.forEach((cs) => {
      if (cs.limit > 0 && cs.spent > cs.limit) {
        list.push({
          type: "OVER BUDGET",
          text: `${cs.category} spending has breached the configured threshold by ${formatCurrency(
            cs.spent - cs.limit
          )}.`,
        });
      } else if (cs.limit > 0 && cs.percentage >= 80) {
        list.push({
          type: "ATTENTION",
          text: `${cs.category} has utilized ${cs.percentage.toFixed(0)}% of allocation with ${formatCurrency(
            cs.remaining
          )} headroom.`,
        });
      }
    });

    if (list.length === 0) {
      list.push({
        type: "ON TRACK",
        text: "All monitored spending tracks are operating within safe envelope limits.",
      });
    }

    return list;
  }, [summary]);

  return (
    <div className="page-wrapper">
      <Navbar onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      <main className="content-wrapper">
        <div className="app-container" style={{ paddingTop: "40px" }}>
          {/* Header */}
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
                <span>ALLOCATION TELEMETRY • CONTROL INSTRUMENTS</span>
              </div>
              <h1 style={{ fontSize: "clamp(2.0rem, 3.8vw, 2.9rem)", marginBottom: "4px" }}>
                Budget Control.
              </h1>
              <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.48)" }}>
                Calibrate thresholds and maintain disciplined guardrails on category consumption.
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

          {/* Master Envelope Summary (Airy, Open Strip) */}
          <div
            style={{
              padding: "24px 0",
              borderTop: "1px solid var(--border-subtle)",
              borderBottom: "1px solid var(--border-subtle)",
              marginBottom: "36px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "24px",
                marginBottom: "20px",
              }}
            >
              <div>
                <div className="stat-label">TOTAL MONTHLY ENVELOPE</div>
                <div style={{ fontSize: "28px", fontWeight: 600, color: "#ffffff", marginTop: "6px", letterSpacing: "-0.03em" }}>
                  {formatCurrency(summary.totalBudget)}
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.36)", marginTop: "3px", fontFamily: "var(--font-mono)" }}>
                  Cumulative allocation cap
                </div>
              </div>

              <div>
                <div className="stat-label">CONSUMED CAPITAL</div>
                <div style={{ fontSize: "28px", fontWeight: 600, color: "#ffffff", marginTop: "6px", letterSpacing: "-0.03em" }}>
                  {formatCurrency(summary.totalSpent)}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: summary.budgetUtilization > 100 ? "var(--accent-neg)" : "var(--accent-pos)",
                    marginTop: "3px",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {summary.budgetUtilization.toFixed(1)}% of ceiling utilized
                </div>
              </div>

              <div>
                <div className="stat-label">REMAINING HEADROOM</div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: 600,
                    color: summary.totalBudget >= summary.totalSpent ? "#ffffff" : "var(--accent-neg)",
                    marginTop: "6px",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {formatCurrency(Math.max(0, summary.totalBudget - summary.totalSpent))}
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.36)", marginTop: "3px", fontFamily: "var(--font-mono)" }}>
                  Available before breach
                </div>
              </div>
            </div>

            {/* Master Envelope Bar */}
            <div className="progress-track" style={{ height: "4px", margin: 0 }}>
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(summary.budgetUtilization, 100)}%`,
                  background:
                    summary.budgetUtilization > 100
                      ? "var(--accent-neg)"
                      : summary.budgetUtilization >= 80
                      ? "var(--accent-warn)"
                      : "#ffffff",
                }}
              />
            </div>
          </div>

          {/* Category Financial Instruments Grid */}
          <section style={{ marginBottom: "40px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "20px",
              }}
            >
              <div>
                <div className="eyebrow">INSTRUMENT CHASSIS</div>
                <h2 style={{ fontSize: "1.45rem", marginTop: "2px" }}>Category Instruments</h2>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255, 255, 255, 0.35)" }}>
                {budgets.length} MONITORED TRACKS
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "16px",
              }}
            >
              {summary.categorySpends.map((budget) => {
                const isOver = budget.limit > 0 && budget.spent > budget.limit;
                const isWarn = budget.limit > 0 && budget.percentage >= 80 && !isOver;

                return (
                  <div key={budget.category} className="budget-instrument-card">
                    <div className="instrument-top">
                      <div className="instrument-name">{budget.category}</div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {editingCategory === budget.category ? (
                          <div style={{ display: "flex", gap: "6px" }}>
                            <input
                              type="number"
                              value={newLimitValue}
                              onChange={(e) => setNewLimitValue(e.target.value)}
                              style={{ width: "80px", padding: "3px 6px", fontSize: "11.5px" }}
                              autoFocus
                            />
                            <button
                              type="button"
                              className="button button-primary"
                              style={{ padding: "3px 8px", fontSize: "11px" }}
                              onClick={() => handleSaveLimit(budget.category)}
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="instrument-metric">
                              <strong style={{ color: isOver ? "var(--accent-neg)" : "#ffffff" }}>
                                {formatCurrency(budget.spent)}
                              </strong>
                              <span style={{ color: "rgba(255, 255, 255, 0.35)" }}>
                                {" "}/ {budget.limit > 0 ? formatCurrency(budget.limit) : "No Limit"}
                              </span>
                            </div>

                            <button
                              type="button"
                              className="button-icon"
                              style={{ width: "24px", height: "24px" }}
                              title="Calibrate Limit"
                              onClick={() => {
                                setEditingCategory(budget.category);
                                setNewLimitValue(budget.limit.toString());
                              }}
                            >
                              <Edit2 size={11} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="progress-track" style={{ height: "3px", margin: "8px 0" }}>
                      <div
                        className={`progress-fill ${isOver ? "over" : isWarn ? "warn" : ""}`}
                        style={{
                          width: `${Math.min(budget.percentage, 100)}%`,
                        }}
                      />
                    </div>

                    <div className="instrument-footer">
                      <span>{budget.percentage.toFixed(0)}% consumed</span>
                      <span>
                        {isOver
                          ? `Deficit: ${formatCurrency(budget.spent - budget.limit)}`
                          : budget.limit > 0
                          ? `Headroom: ${formatCurrency(budget.remaining)}`
                          : "Uncapped"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Budget Intelligence Alerts */}
          <section
            style={{
              background: "rgba(255, 255, 255, 0.012)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-card)",
              padding: "24px 22px",
            }}
          >
            <div className="card-header" style={{ marginBottom: "16px" }}>
              <div>
                <div className="eyebrow">TELEMETRY DIAGNOSTICS</div>
                <h2 style={{ fontSize: "1.45rem", marginTop: "2px" }}>Instrument Status</h2>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {alerts.map((alert, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "12px 14px",
                    borderRadius: "var(--radius-sm)",
                    background:
                      alert.type === "OVER BUDGET"
                        ? "var(--accent-neg-bg)"
                        : alert.type === "ATTENTION"
                        ? "var(--accent-warn-bg)"
                        : "var(--accent-pos-bg)",
                    border:
                      alert.type === "OVER BUDGET"
                        ? "1px solid var(--accent-neg-border)"
                        : alert.type === "ATTENTION"
                        ? "1px solid var(--accent-warn-border)"
                        : "1px solid var(--accent-pos-border)",
                  }}
                >
                  <div style={{ marginTop: "1px" }}>
                    {alert.type === "OVER BUDGET" && <AlertCircle size={15} color="var(--accent-neg)" />}
                    {alert.type === "ATTENTION" && <AlertTriangle size={15} color="var(--accent-warn)" />}
                    {alert.type === "ON TRACK" && <CheckCircle2 size={15} color="var(--accent-pos)" />}
                  </div>

                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10.5px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color:
                          alert.type === "OVER BUDGET"
                            ? "var(--accent-neg)"
                            : alert.type === "ATTENTION"
                            ? "var(--accent-warn)"
                            : "var(--accent-pos)",
                        marginBottom: "1px",
                      }}
                    >
                      {alert.type}
                    </div>
                    <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.75)", margin: 0 }}>
                      {alert.text}
                    </p>
                  </div>
                </div>
              ))}
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
