import { type ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";

interface MetricCardProps {
  label: string;
  title?: string;
  value: string;
  numericValue?: number;
  formatValue?: (value: number) => string;
  subtext: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNegative?: boolean;
  };
  icon?: ReactNode;
  highlight?: boolean;
}

export function MetricCard({
  label,
  title,
  value,
  subtext,
  trend,
  icon,
  numericValue,
  formatValue,
  highlight,
}: MetricCardProps) {
  const displayValue = numericValue !== undefined && formatValue ? formatValue(numericValue) : value;

  return (
    <div className={`metric-column ${highlight ? "relative" : ""}`}>
      {highlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-3 rounded-2xl opacity-60 -z-10"
          style={{
            background: "radial-gradient(180px circle at 50% 25%, rgba(99, 102, 241, 0.12), transparent 70%)",
          }}
        />
      )}
      <div className="metric-header">
        <span className="metric-title" title={title}>{label}</span>
        {icon && <div style={{ color: "rgba(255, 255, 255, 0.35)" }}>{icon}</div>}
      </div>

      <div className="metric-value tabular-numbers" aria-live="off">
        <AnimatedNumber value={displayValue} />
      </div>

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
