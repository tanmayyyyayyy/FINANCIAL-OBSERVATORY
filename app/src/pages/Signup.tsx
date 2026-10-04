import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, ArrowRight, ArrowLeft, Activity } from "lucide-react";

export function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("Tanmay Jain");
  const [email, setEmail] = useState("tanmay@example.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password && confirmPassword && password !== confirmPassword) {
      setError("Passphrases do not match");
      return;
    }
    navigate("/onboarding");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        overflow: "hidden",
      }}
    >
      {/* Left panel — branding */}
      <div
        style={{
          position: "relative",
          background: "linear-gradient(160deg, rgba(14, 14, 16, 0.98) 0%, rgba(7, 7, 8, 1) 100%)",
          borderRight: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "36px 48px",
          overflow: "hidden",
        }}
        className="auth-left-panel"
      >
        {/* Ambient orbs */}
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-80px",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 65%)",
            pointerEvents: "none",
            filter: "blur(50px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "-60px",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.045) 0%, transparent 70%)",
            pointerEvents: "none",
            filter: "blur(50px)",
          }}
        />

        {/* Brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative", zIndex: 1 }}>
          <div className="brand-icon-shield">
            <Compass size={13} strokeWidth={2.2} />
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "-0.02em" }}>
            Financial Observatory
          </span>
        </div>

        {/* Central content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* 3-step progress preview */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "var(--radius-md)",
              padding: "20px 22px",
              marginBottom: "32px",
            }}
          >
            {[
              { step: "01", label: "Financial Baseline", desc: "Set your monthly income" },
              { step: "02", label: "Category Taxonomy", desc: "Choose your expense tracks" },
              { step: "03", label: "Budget Threshold", desc: "Establish spending ceiling" },
            ].map((item, idx) => (
              <div
                key={item.step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: idx < 2 ? "0 0 14px" : "0",
                  borderBottom: idx < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  marginBottom: idx < 2 ? "14px" : "0",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.25)",
                    minWidth: "24px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.step}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#ffffff" }}>{item.label}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", marginTop: "1px" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="eyebrow" style={{ marginBottom: "14px" }}>
            <span className="dot" />
            <span>QUICK SETUP</span>
          </div>
          <h2 style={{ fontSize: "1.6rem", marginBottom: "10px", lineHeight: 1.2 }}>
            Initialize your financial<br />observatory in 3 steps.
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
            Configure your income baseline, select the categories you want to track,
            and set your monthly budget ceiling.
          </p>

          <div
            style={{
              marginTop: "28px",
              display: "flex",
              gap: "18px",
              fontFamily: "var(--font-mono)",
              fontSize: "10.5px",
              color: "rgba(255,255,255,0.38)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Activity size={10} color="var(--accent-pos)" />
              LOCAL STORAGE
            </span>
            <span>ZERO CLOUD</span>
            <span>FREE</span>
          </div>
        </div>

        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,255,255,0.2)", position: "relative", zIndex: 1 }}>
          BUILD 2.1 • PRODUCTION
        </div>
      </div>

      {/* Right panel — form */}
      <div
        className="animate-fade-in"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 32px",
          background: "var(--bg-app)",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <div style={{ marginBottom: "28px" }}>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "11.5px",
                color: "rgba(255, 255, 255, 0.38)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.04em",
                transition: "color var(--transition-fast)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
            >
              <ArrowLeft size={12} />
              <span>BACK TO ROOT</span>
            </Link>
          </div>

          <div className="eyebrow" style={{ marginBottom: "12px" }}>
            OBSERVER INITIALIZATION
          </div>
          <h1 style={{ fontSize: "2.0rem", marginBottom: "8px" }}>Build your observatory.</h1>
          <p style={{ fontSize: "13.5px", color: "rgba(255, 255, 255, 0.45)", marginBottom: "28px", lineHeight: 1.6 }}>
            Configure your dedicated financial intelligence environment.
          </p>

          {error && (
            <div
              style={{
                padding: "10px 14px",
                background: "var(--accent-neg-bg)",
                border: "1px solid var(--accent-neg-border)",
                borderRadius: "var(--radius-sm)",
                color: "var(--accent-neg)",
                fontSize: "13px",
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label htmlFor="signup-name">FULL NAME</label>
              <input
                id="signup-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tanmay Jain"
              />
            </div>

            <div>
              <label htmlFor="signup-email">EMAIL ADDRESS</label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label htmlFor="signup-password">PASSPHRASE</label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="signup-confirm">CONFIRM</label>
                <input
                  id="signup-confirm"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="button button-primary"
              style={{ width: "100%", padding: "12px", marginTop: "8px" }}
            >
              <span>Initialize Account</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div
            style={{
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: "1px solid var(--border-subtle)",
              textAlign: "center",
              fontSize: "13px",
              color: "rgba(255, 255, 255, 0.38)",
            }}
          >
            Already registered?{" "}
            <Link to="/login" style={{ color: "#ffffff", fontWeight: 500 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-left-panel { display: none; }
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
