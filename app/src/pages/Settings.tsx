import { useState } from "react";
import { User, Bell, Tag, Download, RefreshCw, Check } from "lucide-react";
import { useTransactions } from "../context/TransactionsContext";
import { useBudgets } from "../context/BudgetsContext";
import { useAuth } from "../context/AuthContext";

export function Settings() {
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();
  const { user, updateDisplayName } = useAuth();

  const [name, setName] = useState(user?.displayName || "");
  const email = user?.email || "";
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
  const [profileError, setProfileError] = useState("");

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");
    try {
      await updateDisplayName(name);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (cause) {
      setProfileError(cause instanceof Error ? cause.message : "Unable to update your name.");
    }
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
        "Clear older browser data? Transactions and budgets saved to your Firebase account will not be deleted."
      )
    ) {
      localStorage.removeItem("expense-tracker:transactions");
      localStorage.removeItem("expense-tracker:budgets");
      window.location.reload();
    }
  }

  return (
    <div className="page-wrapper">

      <main id="main-content" tabIndex={-1} className="content-wrapper">
        <div className="app-container" style={{ paddingTop: "40px", maxWidth: "860px" }}>
          {/* Header */}
          <div className="animate-slide-up" style={{ marginBottom: "36px" }}>
            <div className="eyebrow">
              <span className="dot" />
              <span>YOUR ACCOUNT</span>
            </div>
            <h1 style={{ fontSize: "clamp(2.0rem, 3.8vw, 2.9rem)", marginBottom: "4px" }}>
              Settings.
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.52)" }}>
              Update your account name, spending categories, and preferences.
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
                <span>ACCOUNT DETAILS</span>
              </div>
              <h2 style={{ fontSize: "1.2rem", marginTop: "2px" }}>Observer Profile</h2>
              <p style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.45)", marginTop: "6px" }}>
                Choose the name you want to see in the app.
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
                    readOnly
                  />
                </div>
              </div>

              {profileError && <div role="alert" style={{ color: "var(--accent-neg)", fontSize: "12px" }}>{profileError}</div>}

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
                    <Check size={13} /> Name saved to your account
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
                <span>SPENDING CATEGORIES</span>
              </div>
              <h2 style={{ fontSize: "1.2rem", marginTop: "2px" }}>Categories</h2>
              <p style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.45)", marginTop: "6px" }}>
                Use categories to organize and review your spending.
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
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ flex: 1, padding: "7px 11px", fontSize: "12.5px" }}
                />
                <button type="submit" className="button button-secondary" style={{ padding: "7px 14px", fontSize: "12.5px" }}>
                  Add category
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
                <span>REMINDERS</span>
              </div>
              <h2 style={{ fontSize: "1.2rem", marginTop: "2px" }}>Preferences</h2>
              <p style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.45)", marginTop: "6px" }}>
                Choose which reminders and weekly summaries you want.
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
                    Budget reminders
                  </div>
                  <div style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.45)" }}>
                    Get a reminder when spending is close to a category budget.
                  </div>
                </div>
                <button
                  type="button"
                  aria-pressed={notifications}
                  aria-label={`Budget reminders ${notifications ? "on" : "off"}`}
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
                    Weekly summary
                  </div>
                  <div style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.45)" }}>
                    Review a summary of the money you recorded each week.
                  </div>
                </div>
                <button
                  type="button"
                  aria-pressed={weeklyInsights}
                  aria-label={`Weekly summary ${weeklyInsights ? "on" : "off"}`}
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
                <span>YOUR DATA</span>
              </div>
              <h2 style={{ fontSize: "1.2rem", marginTop: "2px" }}>Data & Safety</h2>
              <p style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.45)", marginTop: "6px" }}>
                Download a copy of your recorded transactions and budgets.
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
                  className="button button-secondary"
                  onClick={handleResetSeed}
                  style={{ fontSize: "12.5px" }}
                >
                  <RefreshCw size={13} />
                  <span>Clear Old Browser Data</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
