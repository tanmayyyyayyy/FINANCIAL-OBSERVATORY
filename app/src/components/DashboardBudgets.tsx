import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sliders, ArrowRight, Edit2 } from "lucide-react";
import { useBudgets } from "../context/BudgetsContext";
import { formatCurrency } from "../utils/formatters";
import type { CategorySpend } from "../utils/analytics";

interface DashboardBudgetsProps {
  categorySpends: CategorySpend[];
  totalBudget: number;
}

export function DashboardBudgets({ categorySpends, totalBudget }: DashboardBudgetsProps) {
  const { setBudgetLimit } = useBudgets();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [limitInput, setLimitInput] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Focus on top categories (with spending or existing budget)
  const displayCategories = useMemo(() => {
    return [...categorySpends].sort((a, b) => {
      // Prioritize over budget, then high percentage, then spent
      if (a.limit > 0 && a.spent > a.limit) return -1;
      if (b.limit > 0 && b.spent > b.limit) return 1;
      return b.spent - a.spent;
    });
  }, [categorySpends]);

  const handleStartEdit = (category: string, currentLimit: number) => {
    setEditingCategory(category);
    setLimitInput(currentLimit > 0 ? String(currentLimit) : "");
  };

  const handleSave = async (category: string) => {
    const val = parseFloat(limitInput);
    if (!isNaN(val) && val >= 0) {
      setSaving(true);
      try {
        await setBudgetLimit(category, val);
      } finally {
        setSaving(false);
        setEditingCategory(null);
      }
    } else {
      setEditingCategory(null);
    }
  };

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.012)",
        border: "1px solid var(--border-subtle, rgba(255, 255, 255, 0.055))",
        borderRadius: "var(--radius-card, 14px)",
        padding: "24px 22px",
        transition: "border-color var(--transition-fast)",
      }}
      onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--border-medium, rgba(255, 255, 255, 0.09))")}
      onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle, rgba(255, 255, 255, 0.055))")}
    >
      <div className="card-header" style={{ marginBottom: "18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Sliders size={13} style={{ color: "var(--accent-pos, #10b981)" }} />
            <span>BUDGET SAFEGUARDS</span>
          </div>
          <h2 style={{ fontSize: "1.4rem", marginTop: "2px", fontWeight: 600 }}>Category Budgets</h2>
          <p style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.45)", marginTop: "2px" }}>
            {totalBudget > 0 ? `Overall monthly cap: ${formatCurrency(totalBudget)}` : "Monthly limits to keep your spending controlled."}
          </p>
        </div>

        <Link
          to="/budgets"
          className="button button-ghost"
          style={{ fontSize: "12px", padding: "4px 8px", display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <span>Manage all</span>
          <ArrowRight size={12} />
        </Link>
      </div>

      {displayCategories.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px 0", color: "rgba(255, 255, 255, 0.4)", fontSize: "13px" }}>
          No category spending recorded yet this month.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {displayCategories.slice(0, 6).map((item) => {
            const hasLimit = item.limit > 0;
            const percent = hasLimit ? Math.min(100, (item.spent / item.limit) * 100) : 0;
            const isOver = hasLimit && item.spent > item.limit;
            const isNear = hasLimit && !isOver && percent >= 80;

            const barColor = isOver
              ? "var(--accent-neg, #f43f5e)"
              : isNear
              ? "var(--accent-warn, #f59e0b)"
              : "var(--accent-pos, #10b981)";

            const isEditing = editingCategory === item.category;

            return (
              <div
                key={item.category}
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  border: isOver ? "1px solid rgba(244, 63, 94, 0.25)" : "1px solid rgba(255, 255, 255, 0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "#fff" }}>
                      {item.category}
                    </span>
                    {isOver && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          padding: "1px 6px",
                          borderRadius: "4px",
                          background: "var(--accent-neg-bg, rgba(244, 63, 94, 0.1))",
                          color: "var(--accent-neg, #f43f5e)",
                          border: "1px solid var(--accent-neg-border, rgba(244, 63, 94, 0.2))",
                        }}
                      >
                        Exceeded
                      </span>
                    )}
                    {isNear && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          padding: "1px 6px",
                          borderRadius: "4px",
                          background: "var(--accent-warn-bg, rgba(245, 158, 11, 0.1))",
                          color: "var(--accent-warn, #f59e0b)",
                          border: "1px solid var(--accent-warn-border, rgba(245, 158, 11, 0.2))",
                        }}
                      >
                        {percent.toFixed(0)}% Used
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <input
                        type="number"
                        min="0"
                        value={limitInput}
                        onChange={(e) => setLimitInput(e.target.value)}
                        placeholder="Limit ₹"
                        autoFocus
                        style={{
                          width: "90px",
                          background: "rgba(0, 0, 0, 0.5)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "4px",
                          padding: "2px 6px",
                          fontSize: "12px",
                          color: "#fff",
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSave(item.category);
                          if (e.key === "Escape") setEditingCategory(null);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleSave(item.category)}
                        disabled={saving}
                        style={{
                          background: "var(--accent-pos, #10b981)",
                          color: "#000",
                          border: "none",
                          borderRadius: "4px",
                          padding: "3px 6px",
                          fontSize: "11px",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.75)", fontVariantNumeric: "tabular-nums" }}>
                        <strong>{formatCurrency(item.spent)}</strong>
                        {hasLimit ? ` / ${formatCurrency(item.limit)}` : " (No limit)"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item.category, item.limit)}
                        title="Set limit"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "rgba(255, 255, 255, 0.4)",
                          cursor: "pointer",
                          padding: "2px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Visual Progress Bar */}
                {hasLimit ? (
                  <div>
                    <div
                      style={{
                        height: "6px",
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.06)",
                        borderRadius: "3px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${percent}%`,
                          backgroundColor: barColor,
                          borderRadius: "3px",
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "11px" }}>
                      <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                        {percent.toFixed(0)}% consumed
                      </span>
                      <span style={{ color: isOver ? "var(--accent-neg, #f43f5e)" : "rgba(255, 255, 255, 0.55)" }}>
                        {isOver
                          ? `${formatCurrency(item.spent - item.limit)} over budget`
                          : `${formatCurrency(item.remaining)} remaining`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item.category, item.limit)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "rgba(99, 102, 241, 0.8)",
                      fontSize: "11.5px",
                      cursor: "pointer",
                      padding: 0,
                      textAlign: "left",
                    }}
                  >
                    + Tap to set a monthly limit
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
