import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Activity } from "lucide-react";
import { ObservatoryMark } from "./ObservatoryMark";

type AuthMode = "login" | "signup";

interface AuthShellProps {
  mode: AuthMode;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const steps = [
  { step: "01", label: "Monthly income", desc: "Estimate money you receive" },
  { step: "02", label: "Spending categories", desc: "Choose what to track" },
  { step: "03", label: "Monthly budget", desc: "Set a spending limit" },
];

function FinancialViz() {
  return (
    <svg viewBox="0 0 420 132" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="authArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[26, 52, 78, 104].map((y) => (
        <line key={y} x1="0" y1={y} x2="420" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 5" />
      ))}
      <path
        d="M0 108 C58 96, 96 78, 150 82 C206 86, 244 44, 300 46 C346 48, 382 30, 420 18 L420 132 L0 132 Z"
        fill="url(#authArea)"
      />
      <path
        d="M0 108 C58 96, 96 78, 150 82 C206 86, 244 44, 300 46 C346 48, 382 30, 420 18"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="150" cy="82" r="2.6" fill="#ffffff" />
      <circle cx="300" cy="46" r="2.6" fill="#ffffff" />
      <circle cx="420" cy="18" r="4" fill="#ffffff" stroke="var(--accent-pos)" strokeWidth="1.6" />
    </svg>
  );
}

export function AuthShell({ mode, title, subtitle, children, footer }: AuthShellProps) {
  const reduceMotion = useReducedMotion();
  const isSignup = mode === "signup";

  return (
    <div className="auth-shell">
      <div className="auth-form-panel">
        <motion.div
          className="auth-form-inner"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="auth-mobile-brand">
            <div className="brand-icon-shield">
              <ObservatoryMark size={20} />
            </div>
            <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "-0.02em" }}>
              Financial Observatory
            </span>
          </div>

          <div style={{ marginBottom: "28px" }}>
            <Link to="/" className="auth-back-link">
              <ArrowLeft size={12} />
              <span>Back to home</span>
            </Link>
          </div>

          <div className="eyebrow" style={{ marginBottom: "12px" }}>
            {isSignup ? "Create your account" : "Authentication portal"}
          </div>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>

          {children}

          <div className="auth-switch">{footer}</div>
        </motion.div>
      </div>

      <aside className="auth-art-panel">
        <div className="auth-art-grid" aria-hidden="true" />
        <div className="auth-art-glow" aria-hidden="true" />

        <div className="auth-art-brand">
          <div className="brand-icon-shield">
            <ObservatoryMark size={21} />
          </div>
          <span className="auth-art-wordmark">Financial Observatory</span>
        </div>

        <div className="auth-art-body">
          <div className="eyebrow" style={{ marginBottom: "16px" }}>
            <span className="dot" />
            <span>{isSignup ? "Quick setup" : "Your money this month"}</span>
          </div>

          <h2 className="auth-art-statement">
            {isSignup ? (
              <>
                Initialize your observatory in <em>three</em> steps.
              </>
            ) : (
              <>
                Your money, in one <em>clear</em> view.
              </>
            )}
          </h2>
          <p className="auth-art-copy">
            {isSignup
              ? "Add a few details to get started. You can change your budgets and categories at any time."
              : "Track money in and out, review spending against budgets, and see where you stand — all in a single ledger."}
          </p>

          {isSignup ? (
            <div className="auth-steps">
              {steps.map((item) => (
                <div className="auth-step" key={item.step}>
                  <div className="auth-step-num">{item.step}</div>
                  <div>
                    <div className="auth-step-label">{item.label}</div>
                    <div className="auth-step-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="auth-viz">
                <FinancialViz />
                <div className="auth-viz-meta">
                  <span>Cycle start</span>
                  <span style={{ color: "var(--accent-pos)" }}>On track</span>
                </div>
              </div>
              <div className="auth-meta-row">
                <span>Private by default</span>
                <span>Sub-second ledger</span>
                <span>Built for clarity</span>
              </div>
            </>
          )}
        </div>

        <div className="auth-art-footer">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <Activity size={10} color="var(--accent-pos)" />
            Encrypted
          </span>
          <span>Build 2.1</span>
        </div>
      </aside>
    </div>
  );
}
