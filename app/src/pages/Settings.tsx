import { useState } from "react";
import { User, Bell, Tag, Download, RefreshCw, Check } from "lucide-react";
import { useTransactions } from "../context/TransactionsContext";
import { useBudgets } from "../context/BudgetsContext";
import { Navbar } from "../components/Navbar";

export function Settings() {
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();

  const [name, setName] = useState("Tanmay Jain");
  const [email, setEmail] = useState("tanmay@example.com");
  const [categories, setCategories] = useState([
    "Food & Dining",
    "Transport",
    "Utilities",
    "Entertainment",
    "Shopping",
    "Housing",
    "Health",
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [weeklyInsights, setWeeklyInsights] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  }

  function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setNewCategory("");
    }
  }

  function handleRemoveCategory(cat: string) {
    setCategories(categories.filter((c) => c !== cat));
  }

  function handleExportData() {
    const data = {
      exportedAt: new Date().toISOString(),
      user: { name, email },
      transactions,
      budgets,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-observatory-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleResetSeed() {
    if (
      confirm(
        "Purge and restore initial deterministic seed database? Current local movements will be reset."
      )
    ) {
      localStorage.removeItem("expense-tracker:transactions");
      localStorage.removeItem("expense-tracker:budgets");
      window.location.reload();
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="content-wrapper">
        <div className="app-container" style={{ paddingTop: "40px", maxWidth: "860px" }}>
          {/* Header */}
          <div className="animate-slide-up" style={{ marginBottom: "36px" }}>
            <div className="eyebrow">
              <span className="dot" />
              <span>SYSTEM CONFIGURATION • PARAMETERS</span>
            </div>
            <h1 style={{ fontSize: "clamp(2.0rem, 3.8vw, 2.9rem)", marginBottom: "4px" }}>
              Settings.
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.52)" }}>
              Configure your personal observer profile, category taxonomy, and telemetry preferences.
            </p>
          </div>

          {/* Editorial Section 1: Profile */}
          <section
            style={{
              padding: "28px 0",
              borderTop: "1px solid var(--border-subtle)",
              display: "grid",
              gridTemplateColumns: "240px 1fr",
              gap: "32px",
            }}
            className="settings-section"
          >
            <div>
              <div className="eyebrow">
                <User size={12} />
                <span>IDENTITY</span>
              </div>
              <h2 style={{ fontSize: "1.2rem", marginTop: "2px" }}>Observer Profile</h2>
              <p style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.45)", marginTop: "6px" }}>
                Name and credential anchors used across telemetry statements.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label htmlFor="settings-name">FULL NAME</label>
                  <input
                    id="settings-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="settings-email">EMAIL ADDRESS</label>
                  <input
                    id="settings-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                <button type="submit" className="button button-primary" style={{ padding: "8px 18px" }}>
                  Save Profile
                </button>
                {saveSuccess && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "var(--accent-pos)",
                      fontSize: "12.5px",
                    }}
                  >
                    <Check size={13} /> Saved to local registry
                  </span>
                )}
              </div>
            </form>
          </section>

          {/* Editorial Section 2: Expense Categories Taxonomy */}
          <section
            style={{
              padding: "28px 0",
              borderTop: "1px solid var(--border-subtle)",
              display: "grid",
              gridTemplateColumns: "240px 1fr",
              gap: "32px",
            }}
            className="settings-section"
          >
            <div>
              <div className="eyebrow">
                <Tag size={12} />
                <span>TAXONOMY</span>
              </div>
              <h2 style={{ fontSize: "1.2rem", marginTop: "2px" }}>Category Tracks</h2>
              <p style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.45)", marginTop: "6px" }}>
                Active channels monitored by the capital allocation engine.
              </p>
            </div>

            <div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "18px" }}>
                {categories.map((cat) => (
                  <div
                    key={cat}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      fontSize: "12.5px",
                      color: "#ffffff",
                    }}
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(cat)}
                      style={{
                        color: "rgba(255, 255, 255, 0.35)",
                        fontSize: "14px",
                        lineHeight: 1,
                      }}
                      title={`Remove ${cat}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleAddCategory}
                style={{ display: "flex", gap: "8px", maxWidth: "380px" }}
              >
                <input
                  type="text"
                  placeholder="New track label..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ flex: 1, padding: "7px 11px", fontSize: "12.5px" }}
                />
                <button type="submit" className="button button-secondary" style={{ padding: "7px 14px", fontSize: "12.5px" }}>
                  Add Track
                </button>
              </form>
            </div>
          </section>

          {/* Editorial Section 3: Telemetry Preferences */}
          <section
            style={{
              padding: "28px 0",
              borderTop: "1px solid var(--border-subtle)",
              display: "grid",
              gridTemplateColumns: "240px 1fr",
              gap: "32px",
            }}
            className="settings-section"
          >
            <div>
              <div className="eyebrow">
                <Bell size={12} />
                <span>DIAGNOSTICS</span>
              </div>
              <h2 style={{ fontSize: "1.2rem", marginTop: "2px" }}>Preferences</h2>
              <p style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.45)", marginTop: "6px" }}>
                Autonomous telemetry and variance notifications.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "14px",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "#ffffff", fontSize: "14px" }}>
                    Velocity Over-run Warnings
                  </div>
                  <div style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.45)" }}>
                    Trigger warnings when daily burn velocity projects an envelope deficit.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications(!notifications)}
                  className={`button ${notifications ? "button-primary" : "button-secondary"}`}
                  style={{ minWidth: "56px", padding: "5px 12px", fontSize: "11.5px" }}
                >
                  {notifications ? "ON" : "OFF"}
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "#ffffff", fontSize: "14px" }}>
                    Weekly Telemetry Digest
                  </div>
                  <div style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.45)" }}>
                    Generate consolidated analytical overview of weekly capital allocation.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWeeklyInsights(!weeklyInsights)}
                  className={`button ${weeklyInsights ? "button-primary" : "button-secondary"}`}
                  style={{ minWidth: "56px", padding: "5px 12px", fontSize: "11.5px" }}
                >
                  {weeklyInsights ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          </section>

          {/* Editorial Section 4: Data Portability & Hazard Separation */}
          <section
            style={{
              padding: "28px 0",
              borderTop: "1px solid var(--border-subtle)",
              borderBottom: "1px solid var(--border-subtle)",
              display: "grid",
              gridTemplateColumns: "240px 1fr",
              gap: "32px",
            }}
            className="settings-section"
          >
            <div>
              <div className="eyebrow">
                <Download size={12} />
                <span>PERSISTENCE</span>
              </div>
              <h2 style={{ fontSize: "1.2rem", marginTop: "2px" }}>Data & Safety</h2>
              <p style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.45)", marginTop: "6px" }}>
                Export local database snapshot or restore initial pristine seed state.
              </p>
            </div>

            <div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleExportData}
                  style={{ fontSize: "12.5px" }}
                >
                  <Download size={13} />
                  <span>Export JSON Archive</span>
                </button>

                <button
                  type="button"
                  className="button button-danger"
                  onClick={handleResetSeed}
                  style={{ fontSize: "12.5px" }}
                >
                  <RefreshCw size={13} />
                  <span>Reset Seed Database</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
