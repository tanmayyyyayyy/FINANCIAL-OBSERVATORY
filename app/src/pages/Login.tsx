import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Compass, ArrowRight, ArrowLeft, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { firebaseErrorMessage } from "../firebase/errors";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(destination || "/dashboard", { replace: true });
    } catch (cause) {
      clearError();
      setError(firebaseErrorMessage(cause, "Unable to sign in. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
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
      {/* Left panel — branding, ambient art */}
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
        {/* Ambient orb */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 65%)",
            pointerEvents: "none",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)",
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
          {/* Mini terrain visualization */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "var(--radius-md)",
              padding: "20px",
              marginBottom: "32px",
              overflow: "hidden",
            }}
          >
            <svg viewBox="0 0 400 120" style={{ width: "100%", display: "block" }} preserveAspectRatio="none">
              <defs>
                <linearGradient id="loginGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 100 C 80 85, 130 55, 200 65 C 270 75, 320 30, 400 18 L 400 120 L 0 120 Z"
                fill="url(#loginGrad)"
              />
              <path
                d="M 0 100 C 80 85, 130 55, 200 65 C 270 75, 320 30, 400 18"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <circle cx="200" cy="65" r="3" fill="#ffffff" stroke="#040405" strokeWidth="1.5" />
              <circle cx="400" cy="18" r="4" fill="#ffffff" stroke="var(--accent-pos)" strokeWidth="1.5" />
            </svg>
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.08em",
              }}
            >
              <span>CYCLE START</span>
              <span style={{ color: "var(--accent-pos)" }}>LIVE — NOMINAL</span>
            </div>
          </div>

          <div className="eyebrow" style={{ marginBottom: "14px" }}>
            <span className="dot" />
            <span>FINANCIAL OBSERVATORY</span>
          </div>
          <h2 style={{ fontSize: "1.6rem", marginBottom: "10px", lineHeight: 1.2 }}>
            Your capital intelligence<br />command center.
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
            Observe spending patterns, predict burn trajectories, and maintain
            disciplined capital allocation — all in one precise instrument.
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
            <span>SUB-SECOND</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,255,255,0.2)", position: "relative", zIndex: 1 }}>
          BUILD 2.1 • PRODUCTION
        </div>
      </div>

      {/* Right panel — auth form */}
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
        <div style={{ width: "100%", maxWidth: "380px" }}>
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
            AUTHENTICATION PORTAL
          </div>
          <h1 style={{ fontSize: "2.1rem", marginBottom: "8px" }}>Welcome back.</h1>
          <p style={{ fontSize: "13.5px", color: "rgba(255, 255, 255, 0.45)", marginBottom: "32px", lineHeight: 1.6 }}>
            Enter your observer credentials to access your financial telemetry.
          </p>

          {error && (
            <div
              role="alert"
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

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label htmlFor="login-email">EMAIL ADDRESS</label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="intel@domain.com"
              />
            </div>

            <div>
              <label htmlFor="login-password">PASSPHRASE</label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="button button-primary"
              disabled={isSubmitting}
              style={{ width: "100%", padding: "12px", marginTop: "8px" }}
            >
              <span>{isSubmitting ? "Signing In..." : "Sign In"}</span>
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
            Don't have an observatory?{" "}
            <Link to="/signup" style={{ color: "#ffffff", fontWeight: 500 }}>
              Create one
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
