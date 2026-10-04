import { Link } from "react-router-dom";
import { ArrowRight, Activity, Terminal, Zap, Lock, BarChart2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ObservatoryMark } from "../components/ObservatoryMark";
import { UserAvatar } from "../components/UserAvatar";

export function Landing() {
  const { user, loading } = useAuth();
  return (
    <div className="page-wrapper" style={{ position: "relative", overflow: "hidden" }}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      {/* Ambient atmospheric orbs */}
      <div
        className="hero-orb"
        style={{
          width: "700px",
          height: "400px",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "radial-gradient(circle, rgba(255,255,255,0.035) 0%, transparent 70%)",
          animationDuration: "14s",
        }}
      />
      <div
        className="hero-orb"
        style={{
          width: "400px",
          height: "300px",
          bottom: "20%",
          right: "-100px",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.04) 0%, transparent 70%)",
          animationDuration: "18s",
          animationDirection: "alternate-reverse",
        }}
      />
      <div
        className="hero-orb"
        style={{
          width: "320px",
          height: "250px",
          top: "40%",
          left: "-80px",
          background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)",
          animationDuration: "16s",
          animationDelay: "2s",
        }}
      />

      {/* Top Floating Glass Navigation */}
      <header className="top-navbar-wrapper">
        <div className="top-navbar">
          <Link to={user ? "/dashboard" : "/"} className="landing-brand" aria-label="Financial Observatory home">
            <span className="brand-icon-shield">
              <ObservatoryMark size={21} />
            </span>
            <span className="landing-brand-name">
              Financial Observatory
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {!loading && (user ? <>
              <UserAvatar user={user} />
              <span className="landing-user-name">{user.displayName || user.email}</span>
              <Link to="/dashboard" className="button button-primary" style={{ fontSize: "12.5px" }}>Go to Dashboard <ArrowRight size={13} /></Link>
            </> : <>
              <Link to="/login" className="button button-ghost" style={{ fontSize: "12.5px" }}>Sign In</Link>
            <Link to="/signup" className="button button-primary" style={{ fontSize: "12.5px" }}><span>Create Account</span><ArrowRight size={13} strokeWidth={2.4} /></Link>
            </>)}
          </div>
        </div>
      </header>

      {/* Hero Section — cinematic, editorial, generous */}
      <section
        id="main-content"
        tabIndex={-1}
        className="animate-slide-up"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "140px 24px 80px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="eyebrow" style={{ marginBottom: "22px" }}>
          <span className="dot" />
          <span>PERSONAL FINANCES, CLEARLY</span>
        </div>

        <h1
          style={{
            fontSize: "clamp(3.2rem, 7vw, 5.4rem)",
            fontWeight: 600,
            lineHeight: 1.03,
            letterSpacing: "-0.045em",
            maxWidth: "900px",
            marginBottom: "28px",
            background: "linear-gradient(180deg, #ffffff 60%, rgba(255,255,255,0.55) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          See where your<br />money goes.
        </h1>

        <p
          style={{
            fontSize: "clamp(1.05rem, 1.8vw, 1.22rem)",
            color: "rgba(255, 255, 255, 0.52)",
            maxWidth: "580px",
            lineHeight: 1.7,
            marginBottom: "44px",
          }}
        >
          Track money coming in and going out, see what you spend, and understand what you have left.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          {!loading && <Link
            to={user ? "/dashboard" : "/signup"}
            className="button button-primary"
            style={{ padding: "12px 30px", fontSize: "13.5px" }}
          >
            <span>{user ? "Go to Dashboard" : "Create Account"}</span>
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>}

          {!loading && <Link
            to={user ? "/ledger" : "/login"}
            className="button button-secondary"
            style={{ padding: "12px 24px", fontSize: "13.5px" }}
          >
            <span>{user ? "View Transactions" : "Sign In"}</span>
          </Link>}
        </div>

        {/* Quiet telemetry pill */}
        <div
          className="landing-feature-pill"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px 14px",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "100%",
            marginTop: "52px",
            padding: "9px 20px",
            borderRadius: "999px",
            background: "rgba(255, 255, 255, 0.022)",
            border: "1px solid rgba(255, 255, 255, 0.055)",
            fontSize: "10.5px",
            fontFamily: "var(--font-mono)",
            color: "rgba(255, 255, 255, 0.42)",
            letterSpacing: "0.08em",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Activity size={11} color="var(--accent-pos)" />
            <span>MONEY IN / MONEY OUT</span>
          </span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span>PRIVATE ACCOUNT DATA</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span>LIVE DATA SYNC</span>
        </div>
      </section>

      {/* Atmospheric Financial Terrain Visualization */}
      <section
        className="animate-slide-up-delayed"
        style={{
          maxWidth: "1160px",
          margin: "0 auto 120px",
          padding: "0 24px",
          width: "100%",
        }}
      >
        <div
          className="landing-preview-card"
          style={{
            position: "relative",
            background: "linear-gradient(180deg, rgba(14, 14, 16, 0.85) 0%, rgba(7, 7, 8, 0.98) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.09)",
            borderRadius: "var(--radius-xl)",
            padding: "32px",
            boxShadow: "0 40px 120px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255,255,255,0.04) inset",
            overflow: "hidden",
          }}
        >
          {/* Ambient backlight */}
          <div
            style={{
              position: "absolute",
              top: "-80px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "700px",
              height: "250px",
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.055) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />

          {/* Top corner gradient highlight */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
            }}
          />

          {/* Terminal Status Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "28px",
              paddingBottom: "16px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.055)",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Terminal size={13} color="rgba(255, 255, 255, 0.35)" />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10.5px",
                  color: "rgba(255, 255, 255, 0.4)",
                  letterSpacing: "0.09em",
                }}
              >
                PERSONAL FINANCIAL DASHBOARD
              </span>
            </div>

            <div style={{ display: "flex", gap: "24px", fontFamily: "var(--font-mono)", fontSize: "11.5px" }}>
              <div>
                <span style={{ color: "rgba(255, 255, 255, 0.35)" }}>MONEY LEFT: </span>
                <strong style={{ color: "#ffffff" }}>YOUR DATA</strong>
              </div>
              <div>
                <span style={{ color: "rgba(255, 255, 255, 0.35)" }}>MONTH-END ESTIMATE: </span>
                <strong style={{ color: "var(--accent-pos)" }}>PRIVATE</strong>
              </div>
            </div>
          </div>

          <div className="landing-preview-disclaimer">ILLUSTRATIVE PREVIEW · SAMPLE VALUES</div>

          {/* SVG Financial Terrain Waveform */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "280px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(0, 0, 0, 0.3)",
              overflow: "hidden",
            }}
          >
            <svg
              viewBox="0 0 1000 280"
              style={{ width: "100%", height: "100%", display: "block" }}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="terrainGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
                  <stop offset="55%" stopColor="#ffffff" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="terrainGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.055" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                </linearGradient>
                <pattern id="observatoryGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.028)" strokeWidth="1" />
                </pattern>
              </defs>

              <rect width="1000" height="280" fill="url(#observatoryGrid)" />

              {/* Benchmark reference lines */}
              <line x1="0" y1="200" x2="1000" y2="200" stroke="rgba(255, 255, 255, 0.045)" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="1000" y2="120" stroke="rgba(255, 255, 255, 0.045)" strokeDasharray="4 4" />

              {/* Background waveform */}
              <path
                d="M 0 240 C 150 230, 260 170, 400 185 C 540 200, 680 130, 820 145 C 920 155, 960 110, 1000 95 L 1000 280 L 0 280 Z"
                fill="url(#terrainGrad2)"
              />
              <path
                d="M 0 240 C 150 230, 260 170, 400 185 C 540 200, 680 130, 820 145 C 920 155, 960 110, 1000 95"
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
                strokeDasharray="4 3"
              />

              {/* Foreground dominant waveform */}
              <path
                d="M 0 250 C 140 235, 240 178, 360 190 C 480 200, 580 108, 720 118 C 840 128, 920 62, 1000 48 L 1000 280 L 0 280 Z"
                fill="url(#terrainGrad1)"
              />
              <path
                d="M 0 250 C 140 235, 240 178, 360 190 C 480 200, 580 108, 720 118 C 840 128, 920 62, 1000 48"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Node markers */}
              <circle cx="360" cy="190" r="3.5" fill="#ffffff" stroke="#040405" strokeWidth="2" />
              <circle cx="720" cy="118" r="3.5" fill="#ffffff" stroke="#040405" strokeWidth="2" />
              <circle cx="1000" cy="48" r="5" fill="#ffffff" stroke="var(--accent-pos)" strokeWidth="2.5" />

              {/* Glow at final point */}
              <circle cx="1000" cy="48" r="12" fill="rgba(16, 185, 129, 0.08)" />
            </svg>

            {/* Glass node badge */}
            <div
              style={{
                position: "absolute",
                top: "36px",
                right: "28px",
                background: "rgba(12, 12, 15, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                padding: "7px 14px",
                borderRadius: "8px",
                fontSize: "11.5px",
                fontFamily: "var(--font-mono)",
                color: "#ffffff",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", marginRight: "6px" }}>CYCLE BURN</span>
              DAILY ACTIVITY
            </div>
          </div>

          {/* Bottom telemetry metrics strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "24px",
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255, 255, 255, 0.055)",
            }}
          >
            {[
              { label: "PRIVATE RECONCILIATION", value: "YOUR DATA", sub: "Connected to your account", subColor: "rgba(255,255,255,0.4)" },
              { label: "SPENDING PLAN", value: "YOUR BUDGETS", sub: "Organized by your categories", subColor: "rgba(255,255,255,0.4)" },
              { label: "FORWARD HORIZON", value: "PERSONAL FORECAST", sub: "Calculated from your activity", subColor: "rgba(255,255,255,0.4)" },
              { label: "CASH FLOW", value: "ACTUAL ACTIVITY", sub: "Based on recorded transactions", subColor: "rgba(255,255,255,0.4)" },
            ].map((item) => (
              <div key={item.label}>
                <div className="stat-label">{item.label}</div>
                <div style={{ fontSize: "22px", fontWeight: 600, color: "#ffffff", marginTop: "4px", letterSpacing: "-0.03em" }}>
                  {item.value}
                </div>
                <div style={{ fontSize: "11px", color: item.subColor, marginTop: "3px", fontFamily: "var(--font-mono)" }}>
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Intelligence Pillars */}
      <section
        style={{
          maxWidth: "1160px",
          margin: "0 auto 140px",
          padding: "0 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div className="eyebrow">MADE FOR EVERYDAY MONEY</div>
          <h2 style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.1rem)", letterSpacing: "-0.03em" }}>
            A clearer picture of<br />your money.
          </h2>
        </div>

        <div
          className="landing-feature-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            {
              num: "01",
              section: "RECORD",
              icon: <Zap size={16} />,
              title: "Add money in or out",
              desc: "Record income, purchases, and payments in a few simple steps.",
            },
            {
              num: "02",
              section: "UNDERSTAND",
              icon: <BarChart2 size={16} />,
              title: "See where it goes",
              desc: "Review spending by category and compare it with your monthly budgets.",
            },
            {
              num: "03",
              section: "PLAN",
              icon: <Lock size={16} />,
              title: "Plan for the month",
              desc: "Use your recorded activity to estimate spending by month-end.",
            },
          ].map((card) => (
            <div
              key={card.num}
              className="observatory-card"
              style={{ padding: "28px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: "rgba(255, 255, 255, 0.28)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {card.num} / {card.section}
                </span>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {card.icon}
                </div>
              </div>
              <h3 style={{ fontSize: "17px", color: "#ffffff", marginBottom: "10px", fontWeight: 600 }}>
                {card.title}
              </h3>
              <p style={{ fontSize: "13.5px", color: "rgba(255, 255, 255, 0.52)", lineHeight: 1.65 }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.055)",
          padding: "32px 24px",
          color: "rgba(255, 255, 255, 0.36)",
          fontSize: "12.5px",
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ObservatoryMark size={16} />
            <span>Financial Observatory</span>
            <span style={{ opacity: 0.4 }}>•</span>
          </div>

          {!loading && <nav className="landing-footer-links" aria-label="Footer navigation">
            {user ? <>
              <Link className="landing-footer-link" to="/dashboard">Dashboard</Link>
              <Link className="landing-footer-link" to="/budgets">Budgets</Link>
              <Link className="landing-footer-link" to="/ledger">Transactions</Link>
              <Link className="landing-footer-link" to="/settings">Settings</Link>
            </> : <>
              <Link className="landing-footer-link" to="/login">Sign In</Link>
              <Link className="landing-footer-link" to="/signup">Create Account</Link>
            </>}
          </nav>}
        </div>
      </footer>
    </div>
  );
}
