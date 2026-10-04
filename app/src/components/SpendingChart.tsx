import { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { formatCurrency } from "../utils/formatters";
import type { DaySpendPoint } from "../utils/analytics";
import { EmptyState } from "./EmptyState";

interface SpendingChartProps {
  data: DaySpendPoint[];
  onLogExpense?: () => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; payload: DaySpendPoint }>;
  label?: string;
}

function GlassTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const dayData = payload[0].payload;
    return (
      <div
        style={{
          background: "rgba(10, 10, 12, 0.92)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "8px",
          padding: "10px 14px",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.8)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10.5px",
            color: "rgba(255, 255, 255, 0.4)",
            marginBottom: "4px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "17px",
            fontWeight: 600,
            color: "#ffffff",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
          }}
        >
          {formatCurrency(dayData.cumulative)}
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "rgba(255, 255, 255, 0.5)",
            marginTop: "2px",
          }}
        >
          Activity: {formatCurrency(dayData.amount)}
        </div>
      </div>
    );
  }
  return null;
}

export function SpendingChart({ data, onLogExpense }: SpendingChartProps) {
  const [activeRange, setActiveRange] = useState<"7D" | "14D" | "30D">("14D");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const hasAnimated = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => { hasAnimated.current = true; }, []);

  const filteredData =
    activeRange === "7D"
      ? data.slice(-7)
      : activeRange === "14D"
      ? data.slice(-14)
      : data;
  const hasSpend = filteredData.some((point) => point.amount > 0);

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
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <div className="eyebrow">
            <span className="dot" />
            <span>FINANCIAL TERRAIN • CUMULATIVE VELOCITY</span>
          </div>
          <h2 style={{ fontSize: "1.4rem", marginTop: "2px", letterSpacing: "-0.026em" }}>Spending Velocity</h2>
        </div>

        {/* Range Selector Pill */}
        <div
          className="spending-range-selector"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "2px",
            background: "rgba(255, 255, 255, 0.025)",
            padding: "2px",
            borderRadius: "6px",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          {(["7D", "14D", "30D"] as const).map((range) => (
            <button
              key={range}
              type="button"
              aria-pressed={activeRange === range}
              onClick={() => setActiveRange(range)}
              style={{
                padding: "3px 9px",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
                borderRadius: "4px",
                color:
                  activeRange === range
                    ? "#ffffff"
                    : "rgba(255, 255, 255, 0.45)",
                background:
                  activeRange === range
                    ? "rgba(255, 255, 255, 0.08)"
                    : "transparent",
                transition: "all 140ms ease",
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {!hasSpend ? <EmptyState title="No spending in this range" description="Once you record money going out, your daily activity will appear here." actionText={onLogExpense ? "Add transaction" : undefined} onAction={onLogExpense} /> : <div className="spending-chart-area" style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            accessibilityLayer
            data={filteredData}
            margin={{ top: 8, right: 6, left: -22, bottom: 0 }}
          >
            <defs>
              <linearGradient id="spendWaveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.18} />
                <stop offset="50%" stopColor="#ffffff" stopOpacity={0.04} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.03)"
              vertical={false}
            />

            <XAxis
              dataKey="dayLabel"
              stroke="rgba(255, 255, 255, 0.25)"
              fontSize={10.5}
              fontFamily="var(--font-mono)"
              tickLine={false}
              axisLine={{ stroke: "rgba(255, 255, 255, 0.06)" }}
              dy={6}
              interval="preserveStartEnd"
            />

            <YAxis
              stroke="rgba(255, 255, 255, 0.25)"
              fontSize={10.5}
              fontFamily="var(--font-mono)"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              dx={-4}
            />

            <Tooltip content={<GlassTooltip />} cursor={{ stroke: "rgba(255,255,255,.28)", strokeDasharray: "3 4" }} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,.10)" />

            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#ffffff"
              strokeWidth={1.8}
              fill="url(#spendWaveGradient)"
              activeDot={{
                r: 4,
                fill: "#ffffff",
                stroke: "#070708",
                strokeWidth: 2,
              }}
              isAnimationActive={!prefersReducedMotion && !hasAnimated.current}
              animationDuration={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "16px",
          paddingTop: "14px",
          borderTop: "1px solid rgba(255, 255, 255, 0.055)",
          fontSize: "10.5px",
          fontFamily: "var(--font-mono)",
          color: "rgba(255, 255, 255, 0.3)",
          letterSpacing: "0.05em",
        }}
      >
        <span>STATUS: {hasSpend ? "RECONCILED ACTIVITY" : "AWAITING ACTIVITY"}</span>
        <span>RESOLUTION: DAILY ACCRUAL</span>
      </div>
    </div>
  );
}
