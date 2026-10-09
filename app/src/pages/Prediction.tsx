import { useState, useMemo, useEffect, useRef } from "react";
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
import { useFinancialProfile } from "../context/FinancialProfileContext";
import { formatCurrency } from "../utils/formatters";
import { calculateForecast, computeFinancialSummary, isExpenseTransaction } from "../utils/analytics";
import { useOutletContext } from "react-router-dom";
import type { TransactionType } from "../types";
import { EmptyState } from "../components/EmptyState";
import { GoalPlanner } from "../components/GoalPlanner";

export function Prediction() {
  const { openQuickAdd } = useOutletContext<{ openQuickAdd: (type?: TransactionType) => void }>();
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();
  const { profile } = useFinancialProfile();
  const [scenarioDelta, setScenarioDelta] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryReduction, setCategoryReduction] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const chartHasAnimated = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => { chartHasAnimated.current = true; }, []);
  const summary = useMemo(() => {
    return computeFinancialSummary(transactions, budgets, profile.monthlyIncome, profile.monthlyBudget);
  }, [transactions, budgets, profile.monthlyIncome, profile.monthlyBudget]);
  const forecast = useMemo(() => calculateForecast(transactions, new Date(), profile.monthlyIncome), [transactions, profile.monthlyIncome]);
  const expenseCount = transactions.filter(isExpenseTransaction).length;
  const scenarioCategories = summary.categorySpends.filter((item) => item.spent > 0);
  const activeScenarioCategory = scenarioCategories.find((item) => item.category === selectedCategory) ?? scenarioCategories[0];
  const currentMonthCategorySpend = transactions.filter((transaction) => isExpenseTransaction(transaction) && transaction.category === activeScenarioCategory?.category && transaction.date.startsWith(new Date().toISOString().slice(0, 7))).reduce((sum, transaction) => sum + transaction.amount, 0);
  const projectedCategorySpend = currentMonthCategorySpend / Math.max(1, new Date().getUTCDate()) * new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() + 1, 0)).getUTCDate();

  const simulatedProjectedSpend = useMemo(() => {
    const base = forecast.projectedSpend;
    const factor = 1 + scenarioDelta / 100;
    return Math.max(0, Math.round(base * factor - projectedCategorySpend * categoryReduction / 100));
  }, [forecast.projectedSpend, scenarioDelta, projectedCategorySpend, categoryReduction]);

  const simulatedSavings = useMemo(() => {
    return forecast.projectedSavings + forecast.projectedSpend - simulatedProjectedSpend;
  }, [forecast.projectedSavings, forecast.projectedSpend, simulatedProjectedSpend]);

  const projectionCurve = useMemo(() => {
    const points = [];
    const now = new Date();
    const daysInMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate();
    const currentDay = Math.min(now.getUTCDate(), daysInMonth);
    const dailyBase = summary.spendingVelocity;
    const categoryDaily = currentMonthCategorySpend / Math.max(1, currentDay);
    const scenarioDaily = Math.max(0, dailyBase * (1 + scenarioDelta / 100) - categoryDaily * categoryReduction / 100);
    const dailyActual = new Map<string, number>();
    transactions.forEach((transaction) => {
      if (isExpenseTransaction(transaction) && transaction.date.startsWith(now.toISOString().slice(0, 7))) dailyActual.set(transaction.date, (dailyActual.get(transaction.date) ?? 0) + transaction.amount);
    });
    let cumulative = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${now.toISOString().slice(0, 7)}-${String(day).padStart(2, "0")}`;
      const budgetLinear = Math.round((summary.totalBudget / daysInMonth) * day);
      if (day <= currentDay) {
        cumulative += dailyActual.get(date) ?? 0;
        const actual = Math.round(cumulative);
        points.push({
          day: `Day ${day}`,
          actual,
          projected: actual,
          budgetCap: budgetLinear,
        });
      } else {
        const projected = Math.round(cumulative + scenarioDaily * (day - currentDay));
        points.push({
          day: `Day ${day}`,
          actual: null,
          projected,
          budgetCap: budgetLinear,
        });
      }
    }
    return points;
  }, [transactions, summary.spendingVelocity, summary.totalBudget, scenarioDelta, categoryReduction, currentMonthCategorySpend]);

  return (
    <div className="page-wrapper">

      <main id="main-content" tabIndex={-1} className="content-wrapper">
        <div className="app-container" style={{ paddingTop: "40px" }}>
          {/* Header */}
          <div
            className="page-hero animate-slide-up"
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
                <span>YOUR SPENDING OUTLOOK</span>
              </div>
              <h1 style={{ fontSize: "clamp(2.0rem, 3.8vw, 2.9rem)", marginBottom: "4px" }}>
                Your plan
              </h1>
              <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.48)" }}>
                See your spending pace and explore how small changes could shape the month.
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
              <div className="stat-label">ESTIMATED SPENDING</div>
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
                  ? `Above budget by ${formatCurrency(
                      simulatedProjectedSpend - summary.totalBudget
                    )}`
                  : `Under budget by ${formatCurrency(
                      summary.totalBudget - simulatedProjectedSpend
                    )}`}
              </div>
            </div>

            <div>
              <div className="stat-label" title="What we expect you may have left at the end of the month.">ESTIMATED MONEY LEFT</div>
              <div style={{ fontSize: "28px", fontWeight: 600, color: "#ffffff", marginTop: "6px", letterSpacing: "-0.03em" }}>
                {formatCurrency(simulatedSavings)}
              </div>
              <div style={{ fontSize: "11px", color: "var(--accent-pos)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                {(summary.monthlyIncome > 0 ? (simulatedSavings / summary.monthlyIncome) * 100 : 0).toFixed(1)}% savings efficiency
              </div>
            </div>

            <div>
              <div className="stat-label">SHARE OF BUDGET USED</div>
              <div style={{ fontSize: "28px", fontWeight: 600, color: "#ffffff", marginTop: "6px", letterSpacing: "-0.03em" }}>
                {(summary.totalBudget > 0 ? (simulatedProjectedSpend / summary.totalBudget) * 100 : 0).toFixed(1)}%
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                  Of {formatCurrency(summary.totalBudget)} planned this month
              </div>
            </div>

            <div>
                <div className="stat-label">ESTIMATE CONFIDENCE</div>
              <div style={{ fontSize: "28px", fontWeight: 600, color: "var(--accent-pos)", marginTop: "6px", letterSpacing: "-0.03em" }}>
                {forecast.confidence === "low" ? "Low" : forecast.confidence === "medium" ? "Medium" : "High"}
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                {forecast.confidence === "low" ? "Add more expenses for a steadier estimate" : forecast.confidence === "medium" ? "Forming from recent spending" : "Based on a consistent spending history"}
              </div>
            </div>
          </div>

          {/* Central forecast and scenario controls */}
          {expenseCount < 3 ? <EmptyState title="Your plan needs a little more activity" description="Add 3 or more expenses to see your forecast" actionText="Add transaction" onAction={() => openQuickAdd("expense")} /> : <div
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
                <div className="eyebrow">YOUR SPENDING PACE</div>
                <h2 style={{ fontSize: "1.45rem", marginTop: "2px" }}>
                  Spending vs. your budget
                </h2>
              </div>

              {/* Minimal Legend */}
              <div style={{ display: "flex", gap: "16px", fontSize: "11.5px", fontFamily: "var(--font-mono)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ffffff" }}>
                  <span style={{ width: "12px", height: "2px", background: "#ffffff", display: "inline-block" }} />
                  Actual spending
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255, 255, 255, 0.5)" }}>
                  <span style={{ width: "12px", height: "2px", background: "rgba(255, 255, 255, 0.4)", display: "inline-block" }} />
                  Estimate
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent-neg)" }}>
                  <span style={{ width: "12px", height: "2px", background: "var(--accent-neg)", display: "inline-block" }} />
                  Monthly budget
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
                    interval="preserveStartEnd"
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
                    name="Actual spending"
                    isAnimationActive={!prefersReducedMotion && !chartHasAnimated.current}
                  />
                  <Line
                    type="monotone"
                    dataKey="projected"
                    stroke="rgba(255, 255, 255, 0.45)"
                    strokeWidth={1.8}
                    strokeDasharray="4 4"
                    dot={false}
                    name="Estimate"
                    isAnimationActive={!prefersReducedMotion && !chartHasAnimated.current}
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
                    Adjust your spending estimate
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

              {scenarioCategories.length > 0 && <div className="category-what-if">
                <label htmlFor="scenario-category">Try reducing</label>
                <select id="scenario-category" value={activeScenarioCategory?.category ?? ""} onChange={(event) => setSelectedCategory(event.target.value)}>{scenarioCategories.map((item) => <option key={item.category} value={item.category}>{item.category}</option>)}</select>
                <label htmlFor="scenario-reduction">Monthly reduction: {categoryReduction}%</label>
                <input id="scenario-reduction" type="range" min="0" max="50" step="5" value={categoryReduction} onChange={(event) => setCategoryReduction(Number(event.target.value))} aria-valuetext={`${categoryReduction}% less ${activeScenarioCategory?.category ?? "spending"}`} />
                <p>That could change your month-end estimate by about {formatCurrency(projectedCategorySpend * categoryReduction / 100)}.</p>
              </div>}

              <input
                id="global-scenario-change"
                type="range"
                min="-20"
                max="30"
                step="5"
                value={scenarioDelta}
                onChange={(e) => setScenarioDelta(parseInt(e.target.value, 10))}
                aria-label="Overall spending change scenario"
                aria-valuetext={`${scenarioDelta}% overall spending change`}
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
                <span>−20% (SPEND LESS)</span>
                <span>0% (NO CHANGE)</span>
                <span>+30% (SPEND MORE)</span>
              </div>
            </div>
          </div>}

          {/* Analytical Intelligence Cards */}
          <section>
            <div className="eyebrow" style={{ marginBottom: "16px" }}>
              <span>OBSERVATORY HEURISTICS</span>
            </div>

            <div
              className="prediction-insights-grid"
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
                    Spending so far
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.58)", lineHeight: 1.6 }}>
                  {summary.totalSpent > 0
                    ? `You have spent an average of ${formatCurrency(summary.spendingVelocity)} per day this month.`
                    : "Add an expense to see your average spending for the month."}
                </p>
              </div>

              <div className="observatory-card">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <ShieldAlert size={15} color="var(--accent-warn)" />
                  <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#ffffff" }}>
                    Top spending category
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.58)", lineHeight: 1.6 }}>
                  {summary.categorySpends[0]?.spent > 0
                    ? `${summary.categorySpends[0].category} is your largest spending category this month.`
                    : "Your category breakdown will appear after you record an expense."}
                </p>
              </div>

              <div className="observatory-card">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <CheckCircle2 size={15} color="var(--accent-pos)" />
                  <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#ffffff" }}>
                    Estimated money left
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.58)", lineHeight: 1.6 }}>
                  Based on your spending estimate, you may have {formatCurrency(simulatedSavings)} left at month-end.
                </p>
              </div>
            </div>
          </section>
          <GoalPlanner />
        </div>
      </main>

    </div>
  );
}
