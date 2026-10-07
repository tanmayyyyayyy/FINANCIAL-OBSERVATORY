import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Activity, BriefcaseBusiness, CarFront, CircleEllipsis, Clapperboard, HeartPulse, House, ShoppingBag, Utensils, WalletCards, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { ObservatoryMark } from "../components/ObservatoryMark";
import { EXPENSE_CATEGORIES } from "../data/categories";
import { useTransactions } from "../context/TransactionsContext";
import type { Transaction } from "../types";
import { formatCurrency } from "../utils/formatters";

const MAX_AMOUNT = 100_000_000;
const categoryIcons: Record<string, typeof Utensils> = {
  "Food & Dining": Utensils, Transport: CarFront, Utilities: Zap,
  Entertainment: Clapperboard, Shopping: ShoppingBag, Housing: House,
  Health: HeartPulse, Other: CircleEllipsis,
};

function localDateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isExpense(transaction: Transaction) {
  return transaction.type === undefined || transaction.type === "expense";
}

export function QuickAdd() {
  const { transactions, addTransaction } = useTransactions();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<{ amount: number; category: string } | null>(null);

  const today = localDateString(new Date());
  const categories = useMemo(() => {
    const fromTransactions = transactions.filter(isExpense).map((transaction) => transaction.category.trim()).filter(Boolean);
    return [...new Set([...EXPENSE_CATEGORIES, ...fromTransactions])];
  }, [transactions]);
  const recentExpenses = useMemo(
    () => transactions.filter((transaction) => isExpense(transaction) && transaction.date === today).slice(0, 5),
    [transactions, today],
  );

  useEffect(() => {
    if (category && !categories.includes(category)) setCategory(categories[0] ?? "Other");
  }, [categories, category]);
  useEffect(() => {
    if (!success) return;
    const timeout = window.setTimeout(() => setSuccess(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [success]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedAmount = amount.trim();
    if (!/^\d+(?:\.\d{1,2})?$/.test(normalizedAmount)) {
      setError("Enter an amount using up to two decimal places.");
      return;
    }
    const parsedAmount = Number(normalizedAmount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || parsedAmount > MAX_AMOUNT) {
      setError(`Enter an amount greater than ₹0 and no more than ${formatCurrency(MAX_AMOUNT)}.`);
      return;
    }

    setBusy(true);
    setError("");
    try {
      await addTransaction({ type: "expense", amount: parsedAmount, category, description: note.trim() || category, paymentMethod: "UPI", date: today });
      setSuccess({ amount: parsedAmount, category });
      setAmount("");
      setNote("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save this expense. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="quick-add-page">
      <div className="quick-add-wrap">
        <header className="quick-add-header">
          <Link to="/dashboard" className="quick-add-brand" aria-label="Financial Observatory dashboard">
            <span className="quick-add-mark"><ObservatoryMark size={23} /></span>
            <span><strong>Financial Observatory</strong><small>QUICK ADD</small></span>
          </Link>
          <Link className="quick-add-dashboard-link" to="/dashboard">Dashboard</Link>
        </header>

        <section className="quick-add-card" aria-labelledby="quick-add-title">
          <div className="quick-add-title-row">
            <div><div className="eyebrow"><Activity size={13} /> MONEY OUT</div><h1 id="quick-add-title">Add an expense</h1></div>
            <span className="quick-add-today">Today</span>
          </div>

          <form onSubmit={(event) => void handleSubmit(event)} noValidate>
            <label className="sr-only" htmlFor="quick-add-amount">Amount in Indian rupees</label>
            <div className="quick-add-amount-wrap">
              <span aria-hidden="true">₹</span>
              <input id="quick-add-amount" className="quick-add-amount" type="text" inputMode="decimal" autoComplete="off" placeholder="0" value={amount} aria-invalid={Boolean(error)} aria-describedby={error ? "quick-add-error" : "quick-add-amount-help"} onChange={(event) => { setAmount(event.target.value); setError(""); }} />
            </div>
            <p id="quick-add-amount-help" className="quick-add-hint">Amount in Indian rupees</p>

            <fieldset className="quick-add-category-fieldset">
              <legend>Choose a category</legend>
              <div className="quick-add-categories">
                {categories.map((item) => {
                  const Icon = categoryIcons[item] ?? BriefcaseBusiness;
                  return <button key={item} type="button" className={`quick-add-category${category === item ? " selected" : ""}`} aria-pressed={category === item} onClick={() => setCategory(item)}>
                    <Icon size={18} strokeWidth={1.8} aria-hidden="true" /><span>{item}</span>
                  </button>;
                })}
              </div>
            </fieldset>

            <label className="quick-add-note-label" htmlFor="quick-add-note">What was it? <span>Optional</span></label>
            <input id="quick-add-note" className="quick-add-note" type="text" maxLength={120} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Lunch, metro, groceries…" />

            {error && <p id="quick-add-error" className="quick-add-error" role="alert">{error}</p>}
            <button className="quick-add-submit" type="submit" disabled={busy}>{busy ? <><span className="quick-add-spinner" aria-hidden="true" /> Saving expense…</> : "+ Add Expense"}</button>
          </form>
        </section>

        <section className="quick-add-recent" aria-labelledby="quick-add-recent-title">
          <div className="quick-add-recent-heading"><h2 id="quick-add-recent-title">Today</h2><span>{recentExpenses.length} {recentExpenses.length === 1 ? "expense" : "expenses"}</span></div>
          {recentExpenses.length ? <ul>{recentExpenses.map((transaction) => {
            const Icon = categoryIcons[transaction.category] ?? WalletCards;
            return <li key={transaction.id}><span className="quick-add-recent-icon"><Icon size={17} aria-hidden="true" /></span><span className="quick-add-recent-description"><strong>{transaction.description || transaction.category}</strong><small>{transaction.category}</small></span><strong className="quick-add-recent-amount">{formatCurrency(transaction.amount)}</strong></li>;
          })}</ul> : <p className="quick-add-empty">Your expenses for today will show up here.</p>}
          <Link to="/ledger" className="quick-add-ledger-link">View all transactions <span aria-hidden="true">→</span></Link>
        </section>

        <div className="quick-add-success" role="status" aria-live="polite" aria-atomic="true">
          {success && <><span className="quick-add-success-check" aria-hidden="true">✓</span><span><strong>Expense added</strong><small>{formatCurrency(success.amount)} · {success.category}</small></span></>}
        </div>
      </div>
    </main>
  );
}
