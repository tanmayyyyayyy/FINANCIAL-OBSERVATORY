import { useState } from "react";
import { User, Bell, Tag, Download, RefreshCw, Check, Sparkles, Puzzle, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { useTransactions } from "../context/TransactionsContext";
import { useBudgets } from "../context/BudgetsContext";
import { useAuth } from "../context/AuthContext";
import { useAiPreferences } from "../context/AiPreferencesContext";
import { StatementImport } from "../components/StatementImport";

const AI_PRIVACY_EXPLANATION = "AI features can send the information needed for the feature you use, such as transaction text, merchant names, amounts, dates, budget summaries, or uploaded receipt images. Your request passes through a Firebase server function to the configured AI provider. Your browser never receives the AI provider's secret key. Provider data handling is governed by that provider's terms.";

export function Settings() {
  const { transactions, addTransaction } = useTransactions();
  const { budgets } = useBudgets();
  const { user, updateDisplayName } = useAuth();
  const { enabled: aiEnabled, loading: aiPreferenceLoading, saving: aiPreferenceSaving, error: aiPreferenceError, setEnabled: setAiEnabled } = useAiPreferences();

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
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [aiActionError, setAiActionError] = useState("");
  const [showExtensionGuide, setShowExtensionGuide] = useState(false);
  const [copiedExtensionPath, setCopiedExtensionPath] = useState(false);

  function handleCopyPath() {
    navigator.clipboard?.writeText("extension/");
    setCopiedExtensionPath(true);
    setTimeout(() => setCopiedExtensionPath(false), 2000);
  }

  async function handleToggleAi() {
    setAiActionError("");
    try {
      await setAiEnabled(!aiEnabled);
    } catch (cause) {
      setAiActionError(cause instanceof Error ? cause.message : "Unable to save your AI preference.");
    }
  }

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
        "Clear saved data on this device? This removes only older transaction and budget data stored in this browser. Your Firebase account data will not be deleted."
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
                    See a weekly spending summary, budget reminders, and activity worth reviewing.
                  </div>
                </div>
                <Link to="/dashboard" className="button button-secondary">View weekly check-in</Link>
              </div>
            </div>
          </section>

          {/* AI privacy preference */}
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
                <Sparkles size={12} />
                <span>AI FEATURES</span>
              </div>
              <h2 style={{ fontSize: "1.2rem", marginTop: "2px" }}>AI features</h2>
              <p style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.45)", marginTop: "6px" }}>
                AI is off by default. Your choice is saved to your account.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                <div>
                  <div style={{ fontWeight: 600, color: "#ffffff", fontSize: "14px" }}>Allow AI features</div>
                  <div style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.45)" }}>
                    AI requests run only when this setting is on and you choose an AI feature.
                  </div>
                </div>
                <button
                  type="button"
                  aria-pressed={aiEnabled}
                  aria-label={`AI features ${aiEnabled ? "on" : "off"}`}
                  disabled={aiPreferenceLoading || aiPreferenceSaving}
                  onClick={handleToggleAi}
                  className={`button ${aiEnabled ? "button-primary" : "button-secondary"}`}
                  style={{ minWidth: "56px", padding: "5px 12px", fontSize: "11.5px", flexShrink: 0 }}
                >
                  {aiPreferenceSaving ? "SAVING" : aiEnabled ? "ON" : "OFF"}
                </button>
              </div>

              {aiEnabled && <p style={{ fontSize: "12.5px", lineHeight: 1.65, color: "rgba(255, 255, 255, 0.62)", margin: 0 }}>
                {AI_PRIVACY_EXPLANATION}
              </p>}
              <details style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.58)" }}>
                <summary style={{ cursor: "pointer", width: "fit-content", color: "rgba(255, 255, 255, 0.78)" }}>Review AI data use</summary>
                <p style={{ lineHeight: 1.65, marginTop: "8px" }}>{AI_PRIVACY_EXPLANATION}</p>
              </details>
              {(aiPreferenceError || aiActionError) && <div role="alert" style={{ color: "var(--accent-neg)", fontSize: "12px" }}>{aiActionError || aiPreferenceError}</div>}
            </div>
          </section>

          {/* Chrome Extension (Desktop Only) */}
          <section
            className="settings-section chrome-extension-section"
            style={{
              padding: "28px 0",
              borderTop: "1px solid var(--border-subtle)",
              display: "grid",
              gridTemplateColumns: "240px 1fr",
              gap: "32px",
            }}
          >
            <div>
              <div className="eyebrow">
                <Puzzle size={12} />
                <span>DESKTOP COMPANION</span>
              </div>
              <h2 style={{ fontSize: "1.2rem", marginTop: "2px" }}>Chrome Extension</h2>
              <p style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.45)", marginTop: "6px" }}>
                Add expenses directly from your browser.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div
                style={{
                  background: "linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.015) 100%)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md, 8px)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 600, color: "#ffffff", fontSize: "14.5px" }}>
                        Financial Observatory for Chrome
                      </span>
                      <span
                        style={{
                          fontSize: "10.5px",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          padding: "2px 7px",
                          borderRadius: "4px",
                          background: "rgba(99, 102, 241, 0.15)",
                          color: "var(--accent-primary, #818cf8)",
                          border: "1px solid rgba(99, 102, 241, 0.25)",
                          fontWeight: 500,
                        }}
                      >
                        Manifest V3
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.6)", margin: 0, lineHeight: 1.5 }}>
                      Log transactions in seconds without leaving your current tab. Syncs directly to your account.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowExtensionGuide((prev) => !prev)}
                    className="button button-primary"
                    style={{
                      fontSize: "12.5px",
                      padding: "8px 14px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      whiteSpace: "nowrap",
                    }}
                    aria-expanded={showExtensionGuide}
                  >
                    <Puzzle size={13} />
                    <span>Get Chrome Extension</span>
                    {showExtensionGuide ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>

                {showExtensionGuide && (
                  <div
                    style={{
                      marginTop: "4px",
                      paddingTop: "16px",
                      borderTop: "1px solid var(--border-subtle)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                      fontSize: "13px",
                      lineHeight: 1.6,
                      color: "rgba(255, 255, 255, 0.75)",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.45)" }}>
                      Manual Installation Steps (Developer Mode)
                    </div>

                    <ol style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <li>
                        Open Chrome and go to <code style={{ background: "rgba(255, 255, 255, 0.08)", padding: "2px 6px", borderRadius: "4px", color: "#e2e8f0" }}>chrome://extensions</code>
                      </li>
                      <li>
                        Turn on <strong style={{ color: "#ffffff" }}>Developer mode</strong> using the toggle in the top-right corner.
                      </li>
                      <li>
                        Click the <strong style={{ color: "#ffffff" }}>Load unpacked</strong> button on the top-left.
                      </li>
                      <li>
                        Select the <code style={{ background: "rgba(255, 255, 255, 0.08)", padding: "2px 6px", borderRadius: "4px", color: "#e2e8f0" }}>extension/</code> folder in this repository.
                      </li>
                    </ol>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        background: "rgba(0, 0, 0, 0.35)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "6px",
                        gap: "10px",
                        fontSize: "12px",
                      }}
                    >
                      <span style={{ color: "rgba(255, 255, 255, 0.6)", fontFamily: "monospace" }}>
                        Directory: extension/
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyPath}
                        className="button button-secondary"
                        style={{ padding: "4px 8px", fontSize: "11.5px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        {copiedExtensionPath ? <Check size={11} color="var(--accent-pos, #34d399)" /> : <Copy size={11} />}
                        <span>{copiedExtensionPath ? "Copied" : "Copy path"}</span>
                      </button>
                    </div>

                    <p style={{ margin: 0, fontSize: "12px", color: "rgba(255, 255, 255, 0.45)" }}>
                      Pin the extension to your Chrome toolbar, then log in using your account credentials to start adding expenses instantly.
                    </p>
                  </div>
                )}
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
              <StatementImport onSave={async (draft) => {
                if (!draft.type || draft.amount === "" || !draft.category || !draft.date || !draft.paymentMethod) throw new Error("Complete all transaction details before importing.");
                await addTransaction({ type: draft.type, amount: draft.amount, category: draft.category, description: draft.description, paymentMethod: draft.paymentMethod, date: draft.date });
              }} />
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
                  <span>Clear saved data on this device</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
