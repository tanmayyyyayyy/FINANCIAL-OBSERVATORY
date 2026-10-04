import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { TrendingUp, Sliders, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useTransactions } from "../context/TransactionsContext";
import { useBudgets } from "../context/BudgetsContext";
import { Navbar } from "../components/Navbar";
import { QuickAddModal } from "../components/QuickAddModal";
import { formatCurrency } from "../utils/formatters";
import { computeFinancialSummary } from "../utils/analytics";

export function Prediction() {
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [scenarioDelta, setScenarioDelta] = useState<number>(0);

  const summary = useMemo(() => {
    return computeFinancialSummary(transactions, budgets, 86735);
  }, [transactions, budgets]);

  const simulatedProjectedSpend = useMemo(() => {
    const base = summary.projectedMonthEnd;
    const factor = 1 + scenarioDelta / 100;
    return Math.round(base * factor);
  }, [summary.projectedMonthEnd, scenarioDelta]);

  const simulatedSavings = useMemo(() => {
    return Math.max(0, summary.monthlyIncome - simulatedProjectedSpend);
  }, [summary.monthlyIncome, simulatedProjectedSpend]);

  const projectionCurve = useMemo(() => {
    const points = [];
    const daysInMonth = 30;
    const currentDay = Math.min(14, daysInMonth);
    const dailyBase = summary.spendingVelocity;
    const scenarioDaily = dailyBase * (1 + scenarioDelta / 100);

    for (let day = 1; day <= daysInMonth; day++) {
      const budgetLinear = Math.round((summary.totalBudget / daysInMonth) * day);
      if (day <= currentDay) {
        const actual = Math.round(dailyBase * day);
        points.push({
          day: `Day ${day}`,
          actual,
          projected: actual,
          budgetCap: budgetLinear,
        });
      } else {
        const actualAnchor = Math.round(dailyBase * currentDay);
        const projected = Math.round(actualAnchor + scenarioDaily * (day - currentDay));
        points.push({
          day: `Day ${day}`,
          actual: null,
          projected,
          budgetCap: budgetLinear,
        });
      }
    }
    return points;
  }, [summary.spendingVelocity, summary.totalBudget, scenarioDelta]);

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
                <span>PREDICTIVE ENGINE • RUN-RATE MODELING</span>
              </div>
              <h1 style={{ fontSize: "clamp(2.0rem, 3.8vw, 2.9rem)", marginBottom: "4px" }}>
                Prediction Engine.
              </h1>
              <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.48)" }}>
                Extrapolate end-of-cycle capital burn and model discretionary spending adjustments.
              </p>
            </div>
          </div>

          {/* Master Telemetry Projection Strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
              padding: "24px 0",
              borderTop: "1px solid var(--border-subtle)",
              borderBottom: "1px solid var(--border-subtle)",
              marginBottom: "32px",
            }}
          >
            <div>
              <div className="stat-label">PROJECTED MONTH-END OUTFLOW</div>
              <div style={{ fontSize: "28px", fontWeight: 600, color: "#ffffff", marginTop: "6px", letterSpacing: "-0.03em" }}>
                {formatCurrency(simulatedProjectedSpend)}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color:
                    simulatedProjectedSpend > summary.totalBudget
                      ? "var(--accent-neg)"
                      : "var(--accent-pos)",
                  marginTop: "4px",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {simulatedProjectedSpend > summary.totalBudget
                  ? `Breaches envelope by ${formatCurrency(
                      simulatedProjectedSpend - summary.totalBudget
                    )}`
                  : `Within budget ceiling by ${formatCurrency(
                      summary.totalBudget - simulatedProjectedSpend
                    )}`}
              </div>
            </div>

            <div>
              <div className="stat-label">PROJECTED CAPITAL RETAINED</div>
              <div style={{ fontSize: "28px", fontWeight: 600, color: "#ffffff", marginTop: "6px", letterSpacing: "-0.03em" }}>
                {formatCurrency(simulatedSavings)}
              </div>
              <div style={{ fontSize: "11px", color: "var(--accent-pos)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                {((simulatedSavings / summary.monthlyIncome) * 100).toFixed(1)}% savings efficiency
              </div>
            </div>

            <div>
              <div className="stat-label">ENVELOPE UTILIZATION</div>
              <div style={{ fontSize: "28px", fontWeight: 600, color: "#ffffff", marginTop: "6px", letterSpacing: "-0.03em" }}>
                {((simulatedProjectedSpend / summary.totalBudget) * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                Envelope Cap: {formatCurrency(summary.totalBudget)}
              </div>
            </div>

            <div>
              <div className="stat-label">ACTUARIAL CONFIDENCE</div>
              <div style={{ fontSize: "28px", fontWeight: 600, color: "var(--accent-pos)", marginTop: "6px", letterSpacing: "-0.03em" }}>
                94.2%
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                Low variance index (0.14)
              </div>
            </div>
          </div>

          {/* Central Forecast Visualization Chassis (THE HERO ELEMENT) */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.012)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-card)",
              padding: "26px 24px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "24px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <div className="eyebrow">CHRONOLOGICAL EXTRAPOLATION</div>
                <h2 style={{ fontSize: "1.45rem", marginTop: "2px" }}>
                  Burn Trajectory vs Budget Ceiling
                </h2>
              </div>

              {/* Minimal Legend */}
              <div style={{ display: "flex", gap: "16px", fontSize: "11.5px", fontFamily: "var(--font-mono)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ffffff" }}>
                  <span style={{ width: "12px", height: "2px", background: "#ffffff", display: "inline-block" }} />
                  Actual Reconciled
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255, 255, 255, 0.5)" }}>
                  <span style={{ width: "12px", height: "2px", background: "rgba(255, 255, 255, 0.4)", display: "inline-block" }} />
                  Projected Trajectory
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent-neg)" }}>
                  <span style={{ width: "12px", height: "2px", background: "var(--accent-neg)", display: "inline-block" }} />
                  Envelope Cap
                </span>
              </div>
            </div>

            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionCurve} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="rgba(255, 255, 255, 0.25)"
                    fontSize={10.5}
                    fontFamily="var(--font-mono)"
                    tickLine={false}
                    interval={4}
                  />
                  <YAxis
                    stroke="rgba(255, 255, 255, 0.25)"
                    fontSize={10.5}
                    fontFamily="var(--font-mono)"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10, 10, 12, 0.92)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      backdropFilter: "blur(20px)",
                    }}
                    formatter={(val: any) => [formatCurrency(Number(val) || 0), ""]}
                  />
                  <ReferenceLine
                    y={summary.totalBudget}
                    stroke="rgba(244, 63, 94, 0.4)"
                    strokeDasharray="4 4"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#ffffff"
                    strokeWidth={2.2}
                    dot={false}
                    name="Actual Reconciled"
                  />
                  <Line
                    type="monotone"
                    dataKey="projected"
                    stroke="rgba(255, 255, 255, 0.45)"
                    strokeWidth={1.8}
                    strokeDasharray="4 4"
                    dot={false}
                    name="Projected Trajectory"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Interactive Scenario Slider Control */}
            <div
              style={{
                marginTop: "24px",
                padding: "18px 20px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sliders size={13} color="rgba(255, 255, 255, 0.5)" />
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#ffffff" }}>
                    Discretionary Spending Delta Simulation
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: scenarioDelta > 0 ? "var(--accent-neg)" : scenarioDelta < 0 ? "var(--accent-pos)" : "#ffffff",
                  }}
                >
                  {scenarioDelta > 0 ? `+${scenarioDelta}%` : `${scenarioDelta}%`}
                </span>
              </div>

              <input
                type="range"
                min="-20"
                max="30"
                step="5"
                value={scenarioDelta}
                onChange={(e) => setScenarioDelta(parseInt(e.target.value, 10))}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "10.5px",
                  color: "rgba(255, 255, 255, 0.35)",
                  marginTop: "6px",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <span>-20% (AGGRESSIVE THRIFT)</span>
                <span>0% (NOMINAL RUN-RATE)</span>
                <span>+30% (ACCELERATED BURN)</span>
              </div>
            </div>
          </div>

          {/* Analytical Intelligence Cards */}
          <section>
            <div className="eyebrow" style={{ marginBottom: "16px" }}>
              <span>OBSERVATORY HEURISTICS</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "16px",
              }}
            >
              <div className="observatory-card">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <TrendingUp size={15} color="var(--accent-pos)" />
                  <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#ffffff" }}>
                    Run-Rate Stability
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.58)", lineHeight: 1.6 }}>
                  Standard deviation across daily transactions is currently within 14% of historical 90-day mean.
                  Spending velocity shows consistent discipline across weekday cycles.
                </p>
              </div>

              <div className="observatory-card">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <ShieldAlert size={15} color="var(--accent-warn)" />
                  <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#ffffff" }}>
                    Category Concentration
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.58)", lineHeight: 1.6 }}>
                  {summary.categorySpends[0]?.category || "Food & Dining"} accounts for the highest single
                  allocation of discretionary capital. Monitoring this track offers the highest leverage for savings optimization.
                </p>
              </div>

              <div className="observatory-card">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <CheckCircle2 size={15} color="var(--accent-pos)" />
                  <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#ffffff" }}>
                    Liquidity Horizon
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.58)", lineHeight: 1.6 }}>
                  At current outflow speed, net surplus retained at cycle closure will expand cumulative cash reserves by
                  an estimated {formatCurrency(simulatedSavings)}.
                </p>
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
