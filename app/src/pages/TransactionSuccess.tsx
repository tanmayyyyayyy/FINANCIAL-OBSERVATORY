import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Plus, ShieldCheck, Activity } from "lucide-react";

export function TransactionSuccess() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        background: "#040405",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -55%)",
          pointerEvents: "none",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, #000 20%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, #000 20%, transparent 100%)",
        }}
      />

      <div
        className="observatory-card animate-slide-up"
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "40px 32px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          boxShadow:
            "0 24px 80px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
        }}
      >
        {/* Success Icon with glowing aura */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 0 28px rgba(16, 185, 129, 0.2), inset 0 0 12px rgba(16, 185, 129, 0.1)",
            }}
          >
            <CheckCircle2 size={28} color="var(--accent-pos)" />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <div className="eyebrow" style={{ margin: 0 }}>
            <span className="dot" style={{ background: "var(--accent-pos)" }} />
            <span>ALL SET</span>
          </div>
        </div>

        <h1 style={{ fontSize: "1.85rem", letterSpacing: "-0.03em", marginBottom: "10px" }}>
          Transaction added.
        </h1>
        <p
          style={{
            fontSize: "13.5px",
            color: "rgba(255, 255, 255, 0.55)",
            marginBottom: "24px",
            lineHeight: 1.6,
          }}
        >
          Your transaction was saved. Your totals and category spending now include this entry.
        </p>

        {/* Telemetry receipt box */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "8px",
            padding: "12px 14px",
            marginBottom: "28px",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span style={{ color: "rgba(255, 255, 255, 0.4)", display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={12} color="var(--accent-pos)" />
              STATE VERIFICATION
            </span>
            <span style={{ color: "#ffffff", fontWeight: 600 }}>SYNCHRONIZED</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span style={{ color: "rgba(255, 255, 255, 0.4)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Activity size={12} color="rgba(255, 255, 255, 0.5)" />
              TELEMETRY ENGINE
            </span>
            <span style={{ color: "var(--accent-pos)" }}>0ms LATENCY</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link
            to="/dashboard"
            className="button button-primary"
            style={{ width: "100%", padding: "12px", justifyContent: "center" }}
          >
            <span>Return to Observatory</span>
            <ArrowRight size={14} />
          </Link>

          <Link
            to="/quick-add"
            className="button button-secondary"
            style={{ width: "100%", padding: "12px", justifyContent: "center" }}
          >
            <Plus size={14} />
            <span>Record Another Movement</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
