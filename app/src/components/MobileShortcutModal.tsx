import { useState } from "react";
import { X, Smartphone, Apple, Copy, Check, Zap, ArrowRight, Download } from "lucide-react";
import { usePwaInstall } from "../utils/usePwaInstall";

interface MobileShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "ios" | "android";
}

export function MobileShortcutModal({ isOpen, onClose, defaultTab = "ios" }: MobileShortcutModalProps) {
  const [activeTab, setActiveTab] = useState<"ios" | "android">(defaultTab);
  const [copied, setCopied] = useState(false);
  const { canInstall, installApp } = usePwaInstall();

  if (!isOpen) return null;

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://financial-observatory-1b20e.web.app";
  const quickAddUrl = `${currentOrigin}/quick-add`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(quickAddUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-shortcuts-title"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        padding: "16px",
      }}
    >
      <div
        className="mobile-shortcut-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0c0d10",
          border: "1px solid var(--border-medium, rgba(255, 255, 255, 0.1))",
          borderRadius: "var(--radius-card, 16px)",
          maxWidth: "580px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "24px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.8)",
          color: "#fff",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <Zap size={13} style={{ color: "var(--accent-pos, #10b981)" }} />
              <span>INSTANT MOBILE SHORTCUTS</span>
            </div>
            <h2 id="mobile-shortcuts-title" style={{ fontSize: "1.45rem", fontWeight: 600, color: "#fff" }}>
              Open in 1-Second on Your Phone
            </h2>
            <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.55)", marginTop: "4px" }}>
              Log expenses instantly without unlocking or searching for the app.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255, 255, 255, 0.7)",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Device Switcher Tabs */}
        <div
          role="tablist"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.03)",
            padding: "4px",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            marginBottom: "20px",
          }}
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "ios"}
            onClick={() => setActiveTab("ios")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              background: activeTab === "ios" ? "rgba(255, 255, 255, 0.1)" : "transparent",
              color: activeTab === "ios" ? "#fff" : "rgba(255, 255, 255, 0.5)",
              border: activeTab === "ios" ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid transparent",
            }}
          >
            <Apple size={16} />
            <span>iPhone Double-Tap</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "android"}
            onClick={() => setActiveTab("android")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              background: activeTab === "android" ? "rgba(255, 255, 255, 0.1)" : "transparent",
              color: activeTab === "android" ? "#fff" : "rgba(255, 255, 255, 0.5)",
              border: activeTab === "android" ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid transparent",
            }}
          >
            <Smartphone size={16} />
            <span>Android Shortcut</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "ios" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                background: "rgba(99, 102, 241, 0.08)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                fontSize: "13px",
                lineHeight: 1.5,
                color: "rgba(255, 255, 255, 0.85)",
              }}
            >
              💡 <strong>How it works:</strong> Tap the physical back of your iPhone <strong>2 times</strong> to instantly launch the Quick Add screen from anywhere!
            </div>

            {/* Step 1: Copy Link */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "10px",
                padding: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  1
                </span>
                <strong style={{ fontSize: "13px" }}>Copy your Quick Add URL</strong>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="text"
                  readOnly
                  value={quickAddUrl}
                  style={{
                    flex: 1,
                    background: "rgba(0, 0, 0, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "6px",
                    padding: "8px 10px",
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: "var(--font-mono)",
                  }}
                />
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleCopyUrl}
                  style={{ fontSize: "12px", padding: "8px 12px", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Step 2: Shortcuts App */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "10px",
                padding: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  2
                </span>
                <strong style={{ fontSize: "13px" }}>Create shortcut in Apple Shortcuts app</strong>
              </div>
              <ol style={{ paddingLeft: "26px", fontSize: "12.5px", color: "rgba(255, 255, 255, 0.65)", display: "flex", flexDirection: "column", gap: "4px" }}>
                <li>Open the pre-installed <strong>Shortcuts</strong> app on your iPhone.</li>
                <li>Tap <strong>+</strong> in the top-right corner to make a new shortcut.</li>
                <li>Tap <strong>Add Action</strong> → search for <strong>Open URLs</strong>.</li>
                <li>Paste your copied URL into the URL field and name the shortcut <strong>Quick Add</strong>.</li>
              </ol>
            </div>

            {/* Step 3: Back Tap in Settings */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "10px",
                padding: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  3
                </span>
                <strong style={{ fontSize: "13px" }}>Assign to iPhone Double-Tap</strong>
              </div>
              <ol style={{ paddingLeft: "26px", fontSize: "12.5px", color: "rgba(255, 255, 255, 0.65)", display: "flex", flexDirection: "column", gap: "4px" }}>
                <li>Open iPhone <strong>Settings → Accessibility → Touch</strong>.</li>
                <li>Scroll to the bottom and tap <strong>Back Tap</strong>.</li>
                <li>Select <strong>Double Tap</strong>, then scroll down to Shortcuts and tap <strong>Quick Add</strong>.</li>
              </ol>
            </div>

            {/* Safari Tip */}
            <div
              style={{
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.45)",
                padding: "10px 12px",
                background: "rgba(255, 255, 255, 0.015)",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.04)",
              }}
            >
              📌 <strong>Home Screen App:</strong> In Safari, tap the <strong>Share icon</strong> (square with arrow) → tap <strong>Add to Home Screen</strong> to run full-screen like a native app.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                fontSize: "13px",
                lineHeight: 1.5,
                color: "rgba(255, 255, 255, 0.85)",
              }}
            >
              🚀 <strong>Android 1-Tap Access:</strong> Install Financial Observatory directly to your home screen or long-press the app icon for instant shortcuts!
            </div>

            {canInstall && (
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--accent-pos-border, rgba(16, 185, 129, 0.3))",
                  borderRadius: "10px",
                  padding: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div>
                  <strong style={{ fontSize: "13.5px", color: "#fff", display: "block" }}>
                    1-Tap Install on Android
                  </strong>
                  <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)" }}>
                    Installs instantly to your home screen.
                  </span>
                </div>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={installApp}
                  style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px" }}
                >
                  <Download size={14} />
                  <span>Install Now</span>
                </button>
              </div>
            )}

            {/* Android Step 1: Add to Home Screen via Chrome */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "10px",
                padding: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  1
                </span>
                <strong style={{ fontSize: "13px" }}>Add to Home Screen from Browser</strong>
              </div>
              <ol style={{ paddingLeft: "26px", fontSize: "12.5px", color: "rgba(255, 255, 255, 0.65)", display: "flex", flexDirection: "column", gap: "4px" }}>
                <li>In Chrome or your Android browser, tap the <strong>three dots (⋮)</strong> menu in the top right.</li>
                <li>Tap <strong>Add to Home screen</strong> or <strong>Install app</strong>.</li>
                <li>Tap <strong>Install</strong> to add the native icon to your phone.</li>
              </ol>
            </div>

            {/* Android Step 2: App Shortcuts */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "10px",
                padding: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  2
                </span>
                <strong style={{ fontSize: "13px" }}>Long-Press App Icon for Instant Actions</strong>
              </div>
              <p style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.65)", marginBottom: "8px" }}>
                Long-press the Financial Observatory icon on your home screen to show quick shortcuts:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                <div style={{ padding: "6px 10px", borderRadius: "6px", background: "rgba(255, 255, 255, 0.04)", fontSize: "12px" }}>
                  ⚡ Quick Add (5s)
                </div>
                <div style={{ padding: "6px 10px", borderRadius: "6px", background: "rgba(255, 255, 255, 0.04)", fontSize: "12px" }}>
                  🎙 Voice Expense
                </div>
                <div style={{ padding: "6px 10px", borderRadius: "6px", background: "rgba(255, 255, 255, 0.04)", fontSize: "12px" }}>
                  💬 Ask AI
                </div>
                <div style={{ padding: "6px 10px", borderRadius: "6px", background: "rgba(255, 255, 255, 0.04)", fontSize: "12px" }}>
                  📊 Dashboard
                </div>
              </div>
              <p style={{ fontSize: "11.5px", color: "rgba(255, 255, 255, 0.4)", marginTop: "8px" }}>
                💡 Tip: You can drag any of these shortcuts directly onto your home screen!
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <a
            href="/quick-add"
            className="button button-ghost"
            style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <span>Test Quick Add Screen</span>
            <ArrowRight size={12} />
          </a>
          <button
            type="button"
            className="button button-primary"
            onClick={onClose}
            style={{ fontSize: "13px", padding: "8px 18px" }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
