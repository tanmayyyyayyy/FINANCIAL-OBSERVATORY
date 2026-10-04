import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { useTransactions } from "../context/TransactionsContext";
import type { PaymentMethod } from "../types";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function QuickAddModal({ isOpen, onClose, onSuccess }: QuickAddModalProps) {
  const { addTransaction } = useTransactions();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
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

    setAmount("");
    setDescription("");
    if (onSuccess) onSuccess();
    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-panel">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "24px",
            right: "24px",
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
          }}
        >
          <div>
            <div className="eyebrow">
              <span className="dot" />
              <span>RECORD OUTFLOW</span>
            </div>
            <h2 style={{ fontSize: "1.35rem", letterSpacing: "-0.02em" }}>Log Transaction</h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "rgba(255, 255, 255, 0.3)",
                padding: "2px 6px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "4px",
              }}
            >
              ESC
            </span>
            <button
              type="button"
              className="button-icon"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label htmlFor="modal-amount">AMOUNT (INR)</label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "18px",
                  color: "rgba(255, 255, 255, 0.4)",
                  fontWeight: 600,
                  pointerEvents: "none",
                }}
              >
                ₹
              </span>
              <input
                id="modal-amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  paddingLeft: "32px",
                  fontVariantNumeric: "tabular-nums",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label htmlFor="modal-category">CATEGORY</label>
              <select
                id="modal-category"
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
              <label htmlFor="modal-payment">PAYMENT METHOD</label>
              <select
                id="modal-payment"
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
            <label htmlFor="modal-description">MERCHANT / DESCRIPTION</label>
            <input
              id="modal-description"
              type="text"
              placeholder="e.g. Swiggy, Uber, Amazon, Netflix"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="modal-date">DATE</label>
            <input
              id="modal-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "8px",
              paddingTop: "12px",
              borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10.5px",
                color: "rgba(255, 255, 255, 0.35)",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span
                style={{
                  padding: "1px 5px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "3px",
                  fontSize: "10px",
                }}
              >
                ↵ ENTER
              </span>
              to commit
            </span>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" className="button button-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="button button-primary">
                <span>Commit Entry</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
