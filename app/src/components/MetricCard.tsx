import type { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  subtext: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNegative?: boolean;
  };
  icon?: ReactNode;
}

export function MetricCard({
  label,
  value,
  subtext,
  trend,
  icon,
}: MetricCardProps) {
  return (
    <div className="metric-column">
      <div className="metric-header">
        <span className="metric-title">{label}</span>
        {icon && <div style={{ color: "rgba(255, 255, 255, 0.35)" }}>{icon}</div>}
      </div>

      <div className="metric-value tabular-numbers">{value}</div>

      <div className="metric-footer">
        {trend && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "2px",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 600,
              color: trend.isPositive
                ? "var(--accent-pos)"
                : trend.isNegative
                ? "var(--accent-neg)"
                : "rgba(255, 255, 255, 0.5)",
            }}
          >
            {trend.isPositive && <ArrowUpRight size={12} strokeWidth={2.5} />}
            {trend.isNegative && <ArrowDownRight size={12} strokeWidth={2.5} />}
            {!trend.isPositive && !trend.isNegative && (
              <Minus size={12} strokeWidth={2.5} />
            )}
            <span>{trend.value}</span>
          </span>
        )}
        <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "11.5px" }}>
          {subtext}
        </span>
      </div>
    </div>
  );
}
