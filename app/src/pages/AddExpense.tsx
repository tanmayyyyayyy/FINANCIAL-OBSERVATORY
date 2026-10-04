import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Compass } from "lucide-react";
import { useTransactions } from "../context/TransactionsContext";
import type { PaymentMethod } from "../types";

export function AddExpense() {
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();

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
        className="observatory-card animate-fade-in"
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
            <Compass size={14} />
          </div>
          <div className="eyebrow" style={{ margin: 0 }}>
            TRANSACTION INTELLIGENCE
          </div>
        </div>

        <h1 style={{ fontSize: "1.95rem", marginBottom: "6px" }}>
          Record a transaction.
        </h1>
        <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.5)", marginBottom: "26px" }}>
          Log the movement. The observatory will automatically reconcile trajectory.
        </p>

        <form onSubmit={handleRecord} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label htmlFor="expense-amount">AMOUNT (INR)</label>
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
              <label htmlFor="expense-category">CATEGORY</label>
              <select
                id="expense-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Food & Dining">Food & Dining</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Housing">Housing</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="expense-payment">PAYMENT METHOD</label>
              <select
                id="expense-payment"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              >
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="expense-description">DESCRIPTION / MERCHANT</label>
            <input
              id="expense-description"
              type="text"
              placeholder="e.g. Swiggy, Uber, Supermarket, Electricity"
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
            <span>Record Movement</span>
            <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
