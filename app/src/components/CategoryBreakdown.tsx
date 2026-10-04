import { formatCurrency } from "../utils/formatters";
import type { CategorySpend } from "../utils/analytics";

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

export function CategoryBreakdown({ categories, monthlyIncome }: CategoryBreakdownProps) {
  const topCategories = categories.slice(0, 5);
  const totalSpent = categories.reduce((acc, c) => acc + c.spent, 0);

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
            <div className="eyebrow">CAPITAL CONCENTRATION</div>
            <h2 style={{ fontSize: "1.45rem", letterSpacing: "-0.02em", marginTop: "2px" }}>
              Expense Allocation
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

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {topCategories.map((item) => {
            const share = totalSpent > 0 ? (item.spent / totalSpent) * 100 : 0;
            const accentColor = CATEGORY_COLORS[item.category] || "#ffffff";
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
