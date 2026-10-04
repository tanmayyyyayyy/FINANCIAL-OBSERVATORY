import { formatCurrency } from "../utils/formatters";
import type { CategorySpend } from "../utils/analytics";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { EmptyState } from "./EmptyState";
import { useEffect, useState } from "react";

interface CategoryBreakdownProps {
  categories: CategorySpend[];
  monthlyIncome: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "#f59e0b",
  Transport: "#38bdf8",
  Utilities: "#a855f7",
  Entertainment: "#ec4899",
  Shopping: "#10b981",
  Housing: "#6366f1",
  Health: "#14b8a6",
  Other: "#94a3b8",
};
const FALLBACK_COLORS = ["#cbd5e1", "#60a5fa", "#34d399", "#fbbf24", "#c084fc"];

export function CategoryBreakdown({ categories, monthlyIncome }: CategoryBreakdownProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const donutCategories = categories.filter((category) => category.spent > 0);
  const topCategories = donutCategories.slice(0, 5);
  const totalSpent = categories.reduce((acc, c) => acc + c.spent, 0);
  const colorFor = (category: string) => {
    if (CATEGORY_COLORS[category]) return CATEGORY_COLORS[category];
    const hash = [...category.toLowerCase()].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 7);
    return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
  };

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.012)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-card)",
        padding: "24px 22px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 12px 36px rgba(0, 0, 0, 0.4)",
      }}
    >
      <div>
        <div className="card-header" style={{ marginBottom: "18px" }}>
          <div>
            <div className="eyebrow">SPENDING BREAKDOWN</div>
            <h2 style={{ fontSize: "1.45rem", letterSpacing: "-0.02em", marginTop: "2px" }}>
              Where Your Money Goes
            </h2>
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "rgba(255, 255, 255, 0.35)",
              letterSpacing: "0.04em",
            }}
          >
            {categories.length} TRACKS
          </span>
        </div>

        {topCategories.length === 0 ? <EmptyState title="Nothing to break down yet" description="Category totals will appear after you record expenses." /> : <>
        <div className="category-donut-row">
          <div className="category-donut" role="img" aria-label={`Spending categories total ${formatCurrency(totalSpent)}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutCategories} dataKey="spent" nameKey="category" innerRadius="68%" outerRadius="94%" paddingAngle={2} stroke="none" isAnimationActive={!prefersReducedMotion}>
                  {donutCategories.map((item) => <Cell key={item.category} fill={colorFor(item.category)} />)}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#111214", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="category-donut-total"><strong>{formatCurrency(totalSpent)}</strong><span>SPENT</span></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
          {topCategories.map((item) => {
            const share = totalSpent > 0 ? (item.spent / totalSpent) * 100 : 0;
            const accentColor = colorFor(item.category);
            const isOver = item.isOver && item.limit > 0;

            return (
              <div
                key={item.category}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  transition: "background 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "13px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: accentColor,
                        boxShadow: `0 0 8px ${accentColor}60`,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: "#ffffff", fontWeight: 500, letterSpacing: "-0.01em" }}>
                      {item.category}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10.5px",
                        color: "rgba(255, 255, 255, 0.3)",
                      }}
                    >
                      ({item.transactionCount})
                    </span>
                    {isOver && (
                      <span
                        style={{
                          fontSize: "9px",
                          fontFamily: "var(--font-mono)",
                          background: "var(--accent-neg-bg)",
                          color: "var(--accent-neg)",
                          border: "1px solid var(--accent-neg-border)",
                          padding: "1px 5px",
                          borderRadius: "3px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        EXCEEDED
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11.5px",
                        color: "rgba(255, 255, 255, 0.45)",
                      }}
                    >
                      {share.toFixed(1)}%
                    </span>
                    <strong
                      style={{
                        fontWeight: 600,
                        color: "#ffffff",
                        fontVariantNumeric: "tabular-nums",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {formatCurrency(item.spent)}
                    </strong>
                  </div>
                </div>

                <div
                  className="progress-track"
                  style={{
                    height: "3px",
                    margin: 0,
                    background: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(share, 100)}%`,
                      background: isOver
                        ? "var(--accent-neg)"
                        : `linear-gradient(90deg, ${accentColor}aa, ${accentColor})`,
                      boxShadow: isOver ? "0 0 8px rgba(244, 63, 94, 0.4)" : "none",
                      transition: "width 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        </div></>}
      </div>

      <div
        style={{
          marginTop: "20px",
          paddingTop: "14px",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "11px",
          fontFamily: "var(--font-mono)",
          color: "rgba(255, 255, 255, 0.35)",
        }}
      >
        <span>DISCRETIONARY ALLOCATION</span>
        <span>{(monthlyIncome > 0 ? (totalSpent / monthlyIncome) * 100 : 0).toFixed(1)}% OF INFLOW</span>
      </div>
    </div>
  );
}
