import { useState, useEffect, useRef } from "react";
import { X, ArrowRight } from "lucide-react";
import { useTransactions } from "../context/TransactionsContext";
import type { PaymentMethod, TransactionType } from "../types";
import { containDialogFocus } from "../utils/dialogFocus";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialType?: TransactionType;
}

const expenseCategories = ["Food & Dining", "Transport", "Utilities", "Entertainment", "Shopping", "Housing", "Health", "Other"];
const incomeCategories = ["Salary", "Pocket Money", "Freelance", "Gift", "Refund", "Other"];

export function QuickAddModal({ isOpen, onClose, onSuccess, initialType = "expense" }: QuickAddModalProps) {
  const { addTransaction } = useTransactions();

  const [amount, setAmount] = useState("");
  const [movementType, setMovementType] = useState<TransactionType>(initialType);
  const [category, setCategory] = useState(initialType === "income" ? "Salary" : "Food & Dining");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function requestClose() {
    if (closing) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(onClose, 170);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape" && isOpen) {
          requestClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, closing]);

  useEffect(() => {
    if (isOpen) {
      setClosing(false);
      setMovementType(initialType);
      setCategory(initialType === "income" ? "Salary" : "Food & Dining");
    }
    return () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    };
  }, [isOpen, initialType]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    return containDialogFocus(panelRef.current);
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
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

    setAmount("");
    setDescription("");
    if (onSuccess) onSuccess();
    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      data-closing={closing ? "true" : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-add-title"
    >
      <div className="modal-panel" ref={panelRef} tabIndex={-1}>
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
              <span>{movementType === "income" ? "RECORD MONEY IN" : "RECORD MONEY OUT"}</span>
            </div>
            <h2 id="quick-add-title" style={{ fontSize: "1.35rem", letterSpacing: "-0.02em" }}>{movementType === "income" ? "Add Money In" : "Add Money Out"}</h2>
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
              onClick={requestClose}
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="movement-type-switch" role="group" aria-label="Movement type">
          {(["income", "expense"] as const).map((type) => <button key={type} type="button" aria-pressed={movementType === type} className={movementType === type ? "active" : ""} onClick={() => { setMovementType(type); setCategory(type === "income" ? "Salary" : "Food & Dining"); }}>
            {type === "income" ? "Money In" : "Money Out"}
          </button>)}
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label htmlFor="modal-amount">HOW MUCH? (INR)</label>
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
              <label htmlFor="modal-category">{movementType === "income" ? "SOURCE · WHERE DID IT COME FROM?" : "CATEGORY"}</label>
              <select
                id="modal-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {(movementType === "income" ? incomeCategories : expenseCategories).map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="modal-payment">{movementType === "income" ? "RECEIVED VIA" : "PAYMENT METHOD"}</label>
              <select
                id="modal-payment"
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
            <label htmlFor="modal-description">{movementType === "income" ? "NOTE (OPTIONAL)" : "MERCHANT / DESCRIPTION"}</label>
            <input
              id="modal-description"
              type="text"
              placeholder={movementType === "income" ? "Add a note (optional)" : "e.g. Swiggy, Uber, Amazon, Netflix"}
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
              <button type="button" className="button button-ghost" onClick={requestClose}>
                Cancel
              </button>
              <button type="submit" className="button button-primary">
                <span>{movementType === "income" ? "Add Money In" : "Add Money Out"}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
