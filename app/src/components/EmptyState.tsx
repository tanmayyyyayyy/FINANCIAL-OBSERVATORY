import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  actionText,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "52px 24px",
        background: "rgba(255, 255, 255, 0.012)",
        border: "1px dashed rgba(255, 255, 255, 0.09)",
        borderRadius: "var(--radius-card)",
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255, 255, 255, 0.45)",
          marginBottom: "16px",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        }}
      >
        {icon || <Inbox size={22} />}
      </div>

      <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#ffffff", letterSpacing: "-0.01em", marginBottom: "6px" }}>
        {title}
      </h3>

      <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.45)", maxWidth: "360px", marginBottom: "20px", lineHeight: 1.55 }}>
        {description}
      </p>

      {actionText && onAction && (
        <button type="button" className="button button-secondary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}

interface SystemBadgeProps {
  children: ReactNode;
  variant?: "default" | "positive" | "negative" | "warning";
}

export function SystemBadge({ children, variant = "default" }: SystemBadgeProps) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    default: {
      bg: "rgba(255, 255, 255, 0.05)",
      color: "rgba(255, 255, 255, 0.7)",
      border: "rgba(255, 255, 255, 0.08)",
    },
    positive: {
      bg: "var(--accent-pos-bg)",
      color: "var(--accent-pos)",
      border: "var(--accent-pos-border)",
    },
    negative: {
      bg: "var(--accent-neg-bg)",
      color: "var(--accent-neg)",
      border: "var(--accent-neg-border)",
    },
    warning: {
      bg: "var(--accent-warn-bg)",
      color: "var(--accent-warn)",
      border: "var(--accent-warn-border)",
    },
  };

  const current = styles[variant] || styles.default;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "3px 8px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 500,
        fontFamily: "var(--font-mono)",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        background: current.bg,
        color: current.color,
        border: `1px solid ${current.border}`,
      }}
    >
      {children}
    </span>
  );
}
