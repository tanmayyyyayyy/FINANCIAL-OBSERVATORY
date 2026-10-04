import { Link } from "react-router-dom";
import { Compass, ArrowRight, Activity, Terminal, Zap, Lock, BarChart2 } from "lucide-react";

export function Landing() {
  return (
    <div className="page-wrapper" style={{ position: "relative", overflow: "hidden" }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="brand-icon-shield">
              <Compass size={13} strokeWidth={2.3} />
            </div>
            <span style={{ fontSize: "13.5px", fontWeight: 600, letterSpacing: "-0.02em" }}>
              Financial Observatory
            </span>
            <span className="brand-badge">SYSTEM V2.1</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link to="/login" className="button button-ghost" style={{ fontSize: "12.5px" }}>
              Sign In
            </Link>
            <Link to="/dashboard" className="button button-primary" style={{ fontSize: "12.5px" }}>
              <span>Open Observatory</span>
              <ArrowRight size={13} strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section — cinematic, editorial, generous */}
      <section
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
          <span>FINANCIAL OBSERVATORY / SPATIAL CAPITAL TELEMETRY</span>
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
          An intentional financial instrument designed for continuous spatial awareness,
          predictive burn telemetry, and quiet capital control.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            to="/dashboard"
            className="button button-primary"
            style={{ padding: "12px 30px", fontSize: "13.5px" }}
          >
            <span>Open Observatory</span>
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>

          <Link
            to="/ledger"
            className="button button-secondary"
            style={{ padding: "12px 24px", fontSize: "13.5px" }}
          >
            <span>Explore Ledger</span>
          </Link>
        </div>

        {/* Quiet telemetry pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "18px",
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
            <span>LOCAL RECONCILIATION</span>
          </span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span>ZERO CLOUD LEAKAGE</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span>SUB-SECOND LATENCY</span>
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
                STATION ID: 0x9F4 • CAPITAL VELOCITY OBSERVATORY
              </span>
            </div>

            <div style={{ display: "flex", gap: "24px", fontFamily: "var(--font-mono)", fontSize: "11.5px" }}>
              <div>
                <span style={{ color: "rgba(255, 255, 255, 0.35)" }}>NET BALANCE: </span>
                <strong style={{ color: "#ffffff" }}>₹72,450</strong>
              </div>
              <div>
                <span style={{ color: "rgba(255, 255, 255, 0.35)" }}>RUN-RATE: </span>
                <strong style={{ color: "var(--accent-pos)" }}>NOMINAL</strong>
              </div>
            </div>
          </div>

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
              ₹14,285
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
              { label: "NET BALANCE", value: "₹72,450", sub: "+8.4% vs last cycle", subColor: "var(--accent-pos)" },
              { label: "ENVELOPE UTILIZATION", value: "57.1%", sub: "₹14,285 of ₹25,000 cap", subColor: "rgba(255,255,255,0.4)" },
              { label: "PROJECTED RUNWAY", value: "₹21,450", sub: "Confidence: High (94%)", subColor: "rgba(255,255,255,0.4)" },
              { label: "SAVINGS VELOCITY", value: "32.4%", sub: "+4.2% acceleration", subColor: "var(--accent-pos)" },
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
          <div className="eyebrow">OBSERVATORY ARCHITECTURE</div>
          <h2 style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.1rem)", letterSpacing: "-0.03em" }}>
            Engineered for disciplined<br />capital allocation.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            {
              num: "01",
              section: "INGESTION",
              icon: <Zap size={16} />,
              title: "Instant Multi-Rail Capture",
              desc: "Log payments across UPI, credit cards, debit cards, and cash with sub-second keyboard entry. Zero friction, zero cloud latency.",
            },
            {
              num: "02",
              section: "COGNITION",
              icon: <BarChart2 size={16} />,
              title: "Spatial Category Intelligence",
              desc: "Observe proportional capital movements in real-time. Understand how micro-transactions aggregate into systemic monthly consumption.",
            },
            {
              num: "03",
              section: "PROJECTION",
              icon: <Lock size={16} />,
              title: "Predictive Burn Modeling",
              desc: "Anticipate month-end balances using adaptive burn rate modeling before budgets breach. Objective mathematical forecasts.",
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
            <Compass size={12} />
            <span>Financial Observatory</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em" }}>BUILD 2.1</span>
          </div>

          <div style={{ display: "flex", gap: "20px", fontSize: "12px" }}>
            <Link to="/dashboard" style={{ transition: "color 160ms ease" }} onMouseOver={(e) => (e.currentTarget.style.color = "#fff")} onMouseOut={(e) => (e.currentTarget.style.color = "")}>Dashboard</Link>
            <Link to="/budgets" style={{ transition: "color 160ms ease" }} onMouseOver={(e) => (e.currentTarget.style.color = "#fff")} onMouseOut={(e) => (e.currentTarget.style.color = "")}>Budgets</Link>
            <Link to="/ledger" style={{ transition: "color 160ms ease" }} onMouseOver={(e) => (e.currentTarget.style.color = "#fff")} onMouseOut={(e) => (e.currentTarget.style.color = "")}>Ledger</Link>
            <Link to="/prediction" style={{ transition: "color 160ms ease" }} onMouseOver={(e) => (e.currentTarget.style.color = "#fff")} onMouseOut={(e) => (e.currentTarget.style.color = "")}>Predictions</Link>
            <Link to="/settings" style={{ transition: "color 160ms ease" }} onMouseOver={(e) => (e.currentTarget.style.color = "#fff")} onMouseOut={(e) => (e.currentTarget.style.color = "")}>Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
