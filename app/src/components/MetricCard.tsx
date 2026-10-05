import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

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
}: MetricCardProps) {
  const [animatedValue, setAnimatedValue] = useState(numericValue ?? 0);
  useEffect(() => {
    if (numericValue === undefined || !formatValue) return;
    const target = Number.isFinite(numericValue) ? numericValue : 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimatedValue(target);
      return;
    }
    let frame = 0;
    let start = 0;
    const from = 0;
    const duration = 650;
    const tick = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min(1, (timestamp - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(from + (target - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [numericValue, formatValue]);
  const displayValue = numericValue !== undefined && formatValue ? formatValue(animatedValue) : value;
  return (
    <div className="metric-column">
      <div className="metric-header">
        <span className="metric-title" title={title}>{label}</span>
        {icon && <div style={{ color: "rgba(255, 255, 255, 0.35)" }}>{icon}</div>}
      </div>

      <div className="metric-value tabular-numbers" aria-live="off">{displayValue}</div>

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
