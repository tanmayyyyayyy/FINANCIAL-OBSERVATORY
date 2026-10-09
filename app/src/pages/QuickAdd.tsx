import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Check, AlertCircle, WifiOff, Mic } from "lucide-react";
import { useTransactions } from "../context/TransactionsContext";
import { useBudgets } from "../context/BudgetsContext";
import { formatCurrency } from "../utils/formatters";
import { PwaInstallPrompt } from "../components/PwaInstallPrompt";
import { VoiceExpenseModal } from "../components/VoiceExpenseModal";

interface QuickCategory {
  id: string; // Database category string
  label: string; // Display label
  icon: string; // Emoji icon
}

const BASE_CATEGORIES: QuickCategory[] = [
  { id: "Food & Dining", label: "Food", icon: "🍔" },
  { id: "Transport", label: "Travel", icon: "🚕" },
  { id: "Shopping", label: "Shopping", icon: "🛍" },
  { id: "Utilities", label: "Bills", icon: "🏠" },
  { id: "Entertainment", label: "Entertainment", icon: "🎮" },
  { id: "Health", label: "Health", icon: "💊" },
  { id: "Housing", label: "Housing", icon: "🏢" },
  { id: "Other", label: "Other", icon: "📦" },
];

const QUICK_PRESETS = [
  { amount: "100", category: "Food & Dining", note: "Coffee", label: "₹100 Coffee", icon: "☕" },
  { amount: "200", category: "Transport", note: "Travel", label: "₹200 Travel", icon: "🚕" },
  { amount: "500", category: "Food & Dining", note: "Food", label: "₹500 Food", icon: "🍔" },
];

const MAX_AMOUNT = 10_000_000; // Sensible upper bound: ₹1 Crore

export function QuickAdd() {
  const { transactions, addTransaction } = useTransactions();
  const { budgets } = useBudgets();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isOnline, setIsOnline] = useState(() => typeof navigator !== "undefined" ? navigator.onLine : true);
  const [lastSuccess, setLastSuccess] = useState<{
    amount: string;
    categoryLabel: string;
  } | null>(null);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  const amountInputRef = useRef<HTMLInputElement>(null);
  const userInteractedRef = useRef(false);

  // Derive categories from app base list + user's existing categories
  const categories = useMemo(() => {
    const existingIds = new Set(BASE_CATEGORIES.map((c) => c.id));
    const extra: QuickCategory[] = [];

    budgets.forEach((b) => {
      if (b.category && !existingIds.has(b.category)) {
        existingIds.add(b.category);
        extra.push({ id: b.category, label: b.category, icon: "🏷️" });
      }
    });

    transactions.forEach((t) => {
      if (t.category && !existingIds.has(t.category) && t.type !== "income") {
        existingIds.add(t.category);
        extra.push({ id: t.category, label: t.category, icon: "🏷️" });
      }
    });

    return [...BASE_CATEGORIES, ...extra];
  }, [budgets, transactions]);

  // Online / offline status tracking
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Autofocus amount on mount without stealing focus after interaction
  useEffect(() => {
    if (!userInteractedRef.current) {
      const timer = setTimeout(() => {
        amountInputRef.current?.focus();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-dismiss success notification after 5 seconds
  useEffect(() => {
    if (!lastSuccess) return;
    const timer = setTimeout(() => {
      setLastSuccess(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [lastSuccess]);

  // Handle amount change with strict numeric & decimal validation
  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    userInteractedRef.current = true;
    const raw = e.target.value.replace(/,/g, "");
    if (raw === "" || /^\d+(\.\d{0,2})?$/.test(raw)) {
      setAmount(raw);
      if (saveError) setSaveError("");
      if (validationError) setValidationError("");
      if (lastSuccess) setLastSuccess(null);
    }
  }

  // Handle quick presets
  function applyPreset(preset: typeof QUICK_PRESETS[number]) {
    userInteractedRef.current = true;
    setAmount(preset.amount);
    setCategory(preset.category);
    setNote(preset.note);
    if (saveError) setSaveError("");
    if (validationError) setValidationError("");
    if (lastSuccess) setLastSuccess(null);
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    userInteractedRef.current = true;

    // Prevent duplicate submission
    if (saving) return;

    if (!isOnline) {
      setSaveError("You're offline. Reconnect to save this expense.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || !isFinite(parsedAmount) || parsedAmount <= 0) {
      setValidationError("Enter a valid expense amount greater than ₹0.");
      return;
    }

    if (parsedAmount > MAX_AMOUNT) {
      setValidationError("Amount must be ₹10,000,000 or less.");
      return;
    }

    setSaving(true);
    setSaveError("");
    setValidationError("");

    try {
      const recordedCategory = category;
      const recordedDesc = note.trim() || recordedCategory;
      const todayIso = new Date().toISOString().slice(0, 10);

      await addTransaction({
        type: "expense",
        amount: parsedAmount,
        category: recordedCategory,
        description: recordedDesc,
        paymentMethod: "UPI",
        date: todayIso,
      });

      const matchedCategory = categories.find((c) => c.id === recordedCategory);
      setLastSuccess({
        amount: parsedAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 }),
        categoryLabel: matchedCategory?.label || recordedCategory,
      });

      // Clear input fields immediately for next expense
      setAmount("");
      setNote("");

      // Refocus input immediately for subsequent entry
      setTimeout(() => {
        amountInputRef.current?.focus();
      }, 50);
    } catch {
      setSaveError("Couldn't save this expense. Try again.");
    } finally {
      setSaving(false);
    }
  }

  // Filter recent expenses (latest 5, with today's prioritized)
  const todayIso = new Date().toISOString().slice(0, 10);
  const recentExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type !== "income")
      .sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime())
      .slice(0, 5);
  }, [transactions]);

  const hasExpensesToday = recentExpenses.some((t) => t.date === todayIso);

  // Helper to find category icon
  const getCategoryIcon = (catName: string, desc?: string) => {
    if (desc && desc.toLowerCase().includes("coffee")) return "☕";
    const match = BASE_CATEGORIES.find((c) => c.id === catName);
    return match ? match.icon : "🏷️";
  };

  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && isFinite(parsedAmount) && parsedAmount > 0;

  return (
    <div className="quick-page-shell">
      {/* Ambient atmospheric glow */}
      <div className="quick-ambient-glow" />

      <div className="quick-content-wrapper">
        {/* Navigation Bar */}
        <header className="quick-nav-header">
          <Link to="/dashboard" className="quick-back-button" aria-label="Return to Observatory">
            <ArrowLeft size={15} />
            <span>Observatory</span>
          </Link>
          <div className="quick-header-tag">
            <span className="dot" />
            <span>PWA UTILITY</span>
          </div>
        </header>

        {/* Optional subtle PWA Install Banner */}
        <PwaInstallPrompt />

        {/* Offline Banner */}
        {!isOnline && (
          <div className="quick-offline-alert" role="alert">
            <WifiOff size={15} />
            <span>You're offline. Reconnect to save this expense.</span>
          </div>
        )}

        {/* Success Feedback Banner */}
        {lastSuccess && (
          <div className="quick-success-banner animate-slide-up" role="status" aria-live="polite">
            <div className="quick-success-icon-wrap">
              <Check size={16} strokeWidth={3} />
            </div>
            <div className="quick-success-info">
              <strong className="quick-success-title">✓ Expense added</strong>
              <span className="quick-success-meta">
                ₹{lastSuccess.amount} · {lastSuccess.categoryLabel}
              </span>
            </div>
          </div>
        )}

        {/* Main Quick Add Utility Card */}
        <div className="observatory-card quick-main-card page-hero">
          <div className="quick-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div className="eyebrow" style={{ margin: 0 }}>FINANCIAL OBSERVATORY</div>
              <h1 className="quick-card-title">Quick Add</h1>
            </div>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setVoiceModalOpen(true)}
              aria-label="Start voice expense entry"
              style={{ fontSize: "12px", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Mic size={14} />
              <span>Voice</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="quick-entry-form" noValidate>
            {/* Validation / Server Error Alert */}
            {(saveError || validationError) && (
              <div className="quick-error-alert" role="alert">
                <AlertCircle size={15} />
                <span>{saveError || validationError}</span>
              </div>
            )}

            {/* Dominant Hero Amount Display */}
            <div
              className="quick-amount-hero"
              onClick={() => amountInputRef.current?.focus()}
              role="presentation"
            >
              <div className="quick-amount-currency" aria-hidden="true">
                ₹
              </div>
              <input
                ref={amountInputRef}
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                autoFocus
                placeholder="0"
                value={amount}
                onChange={handleAmountChange}
                disabled={saving}
                className="quick-amount-input"
                aria-label="Expense amount in Indian Rupees"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>

            {/* Quick Presets */}
            <div className="quick-presets-row" role="group" aria-label="Quick Presets">
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="quick-preset-pill"
                >
                  <span>{preset.icon}</span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>

            {/* Category Selection Grid */}
            <div className="quick-category-container">
              <div className="quick-field-label">
                <span>CATEGORY</span>
                {category && (
                  <span className="quick-selected-hint">
                    {categories.find((c) => c.id === category)?.label || category}
                  </span>
                )}
              </div>

              <div
                className="quick-category-grid"
                role="radiogroup"
                aria-label="Select expense category"
              >
                {categories.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`quick-category-chip ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        userInteractedRef.current = true;
                        setCategory(cat.id);
                      }}
                    >
                      <span className="quick-chip-icon" aria-hidden="true">
                        {cat.icon}
                      </span>
                      <span className="quick-chip-label">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Note ("What was it?") */}
            <div className="quick-note-section">
              <label htmlFor="quick-note-input" className="quick-field-label">
                <span>WHAT WAS IT? (OPTIONAL)</span>
              </label>
              <input
                id="quick-note-input"
                type="text"
                value={note}
                onChange={(e) => {
                  userInteractedRef.current = true;
                  setNote(e.target.value);
                }}
                placeholder="e.g. Lunch, Uber, Groceries"
                className="quick-note-input"
                maxLength={80}
                disabled={saving}
                autoComplete="off"
              />
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              className="button button-primary quick-submit-btn"
              disabled={saving || !isValidAmount || !isOnline}
              aria-busy={saving}
            >
              {saving ? (
                <span>Adding expense…</span>
              ) : (
                <>
                  <Plus size={18} strokeWidth={2.5} />
                  <span>Add Expense</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recent Expenses List */}
        <section className="quick-recent-section" aria-label="Recent expenses">
          <div className="quick-recent-header">
            <span className="eyebrow" style={{ margin: 0 }}>
              {hasExpensesToday ? "TODAY" : "RECENT EXPENSES"}
            </span>
            <span className="quick-recent-count">{recentExpenses.length} entries</span>
          </div>

          {recentExpenses.length === 0 ? (
            <div className="quick-recent-empty">
              <span>No recorded expenses yet. Add your first expense above.</span>
            </div>
          ) : (
            <div className="quick-recent-list">
              {recentExpenses.map((t) => (
                <div key={t.id} className="quick-recent-item">
                  <div className="quick-recent-item-left">
                    <span className="quick-recent-icon" aria-hidden="true">
                      {getCategoryIcon(t.category, t.description)}
                    </span>
                    <div className="quick-recent-item-info">
                      <span className="quick-recent-name">{t.description || t.category}</span>
                      <span className="quick-recent-date">
                        {t.date === todayIso ? "Today" : t.date}
                      </span>
                    </div>
                  </div>
                  <div className="quick-recent-amount">
                    <span>−{formatCurrency(t.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="quick-view-all-wrapper">
            <Link to="/ledger" className="quick-view-all-link">
              View all transactions →
            </Link>
          </div>
        </section>
      </div>

      <VoiceExpenseModal isOpen={voiceModalOpen} onClose={() => setVoiceModalOpen(false)} />
    </div>
  );
}
