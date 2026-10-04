import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ObservatoryMark } from "../components/ObservatoryMark";
import { useTransactions } from "../context/TransactionsContext";
import type { PaymentMethod, TransactionType } from "../types";

const expenseCategories = ["Food & Dining", "Transport", "Utilities", "Entertainment", "Shopping", "Housing", "Health", "Other"];
const incomeCategories = ["Salary", "Pocket Money", "Freelance", "Gift", "Refund", "Other"];

export function AddExpense() {
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();

  const [movementType, setMovementType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  function handleRecord(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    addTransaction({
      type: movementType,
      amount: parsedAmount,
      category,
      description: description.trim() || category,
      paymentMethod,
      date,
    });

    navigate("/transaction-success");
  }

  return (
    <div
      className="add-expense-shell"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        background: "radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 65%)",
      }}
    >
      <div
        className="observatory-card animate-fade-in add-expense-card"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "36px 32px",
          boxShadow: "0 32px 100px rgba(0, 0, 0, 0.85)",
        }}
      >
        <Link
          to="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "rgba(255, 255, 255, 0.4)",
            fontFamily: "var(--font-mono)",
            marginBottom: "24px",
          }}
        >
          <ArrowLeft size={13} />
          <span>RETURN TO OBSERVATORY</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div className="brand-icon-shield">
            <ObservatoryMark size={21} />
          </div>
          <div className="eyebrow" style={{ margin: 0 }}>
            {movementType === "income" ? "MONEY IN" : "MONEY OUT"}
          </div>
        </div>

        <h1 style={{ fontSize: "1.95rem", marginBottom: "6px" }}>
          {movementType === "income" ? "Add money coming in." : "Add money going out."}
        </h1>
        <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.5)", marginBottom: "26px" }}>
          {movementType === "income" ? "Record a deposit, gift, or refund." : "Record a purchase or payment."}
        </p>

        <div className="movement-type-switch" role="group" aria-label="Movement type">
          {(["income", "expense"] as const).map((type) => <button key={type} type="button" aria-pressed={movementType === type} className={movementType === type ? "active" : ""} onClick={() => { setMovementType(type); setCategory(type === "income" ? "Salary" : "Food & Dining"); }}>
            {type === "income" ? "Money In" : "Money Out"}
          </button>)}
        </div>
        <form className="add-expense-form" onSubmit={handleRecord} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label htmlFor="expense-amount">HOW MUCH? (INR)</label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "20px",
                  color: "rgba(255, 255, 255, 0.4)",
                  fontWeight: 600,
                  pointerEvents: "none",
                }}
              >
                ₹
              </span>
              <input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  paddingLeft: "34px",
                  fontVariantNumeric: "tabular-nums",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label htmlFor="expense-category">{movementType === "income" ? "SOURCE · WHERE DID IT COME FROM?" : "CATEGORY"}</label>
              <select
                id="expense-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {(movementType === "income" ? incomeCategories : expenseCategories).map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="expense-payment">{movementType === "income" ? "RECEIVED VIA" : "PAYMENT METHOD"}</label>
              <select
                id="expense-payment"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              >
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="expense-description">{movementType === "income" ? "NOTE (OPTIONAL)" : "DESCRIPTION / MERCHANT"}</label>
            <input
              id="expense-description"
              type="text"
              placeholder={movementType === "income" ? "Add a note (optional)" : "e.g. Swiggy, Uber, Supermarket, Electricity"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="expense-date">DATE</label>
            <input
              id="expense-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="button button-primary"
            style={{ width: "100%", padding: "12px", marginTop: "8px" }}
          >
            <span>{movementType === "income" ? "Add Money In" : "Add Money Out"}</span>
            <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
