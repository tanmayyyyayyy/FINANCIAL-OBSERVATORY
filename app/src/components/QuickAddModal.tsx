import { useState, useEffect, useRef } from "react";
import { X, ArrowRight, Sparkles, Check, Mic } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTransactions } from "../context/TransactionsContext";
import type { PaymentMethod, TransactionType } from "../types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../data/categories";
import { containDialogFocus } from "../utils/dialogFocus";
import { useAiPreferences } from "../context/AiPreferencesContext";
import { useAuth } from "../context/AuthContext";
import { parseTransactionText, scanReceipt, type AiTransactionDraft, type ReceiptDraft } from "../firebase/ai";
import { db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { AccessibleSelect } from "./AccessibleSelect";
import { VoiceExpenseModal } from "./VoiceExpenseModal";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialType?: TransactionType;
}


export function QuickAddModal({ isOpen, onClose, onSuccess, initialType = "expense" }: QuickAddModalProps) {
  const { addTransaction } = useTransactions();
  const { enabled: aiEnabled, loading: aiLoading } = useAiPreferences();
  const { user } = useAuth();

  const [amount, setAmount] = useState("");
  const [movementType, setMovementType] = useState<TransactionType>(initialType);
  const [category, setCategory] = useState(initialType === "income" ? "Salary" : "Food & Dining");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [aiText, setAiText] = useState("");
  const [aiDrafts, setAiDrafts] = useState<AiTransactionDraft[]>([]);
  const [aiOriginalCategories, setAiOriginalCategories] = useState<Array<string | null>>([]);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [savingDraft, setSavingDraft] = useState<number | null>(null);
  const [savedDraft, setSavedDraft] = useState<number | null>(null);
  const [transactionSaved, setTransactionSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [receiptDraft, setReceiptDraft] = useState<ReceiptDraft | null>(null);
  const [receiptBusy, setReceiptBusy] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

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
      setAiText(""); setAiDrafts([]); setAiOriginalCategories([]); setAiMessage(""); setSaveError(""); setSavedDraft(null); setReceiptDraft(null); setTransactionSaved(false);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError("");
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    try {
    await addTransaction({
      type: movementType,
      amount: parsedAmount,
      category,
      description: description.trim() || category,
      paymentMethod,
      date,
    });

    setAmount("");
    setDescription("");
    setTransactionSaved(true);
    if (onSuccess) onSuccess();
    closeTimer.current = window.setTimeout(onClose, 520);
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : "Unable to save this transaction. Try again.");
    }
  }

  async function handleAiParse(event: React.FormEvent) {
    event.preventDefault();
    if (!aiEnabled || aiLoading || aiBusy) return;
    setAiBusy(true); setAiMessage(""); setAiDrafts([]);
    try {
      const drafts = await parseTransactionText(aiText);
      setAiDrafts(drafts);
      setAiOriginalCategories(drafts.map((draft) => draft.category));
    } catch (cause) {
      const code = typeof cause === "object" && cause && "code" in cause ? String(cause.code) : "";
      setAiMessage(code.includes("resource-exhausted") ? "You've reached your AI limit for now. Try again later." : code.includes("failed-precondition") ? "We couldn't safely understand that. Please try again." : "AI couldn't respond right now. Try again.");
    } finally { setAiBusy(false); }
  }

  async function confirmAiDraft(index: number) {
    const draft = aiDrafts[index];
    if (!draft || !user?.uid || savingDraft !== null || !draft.type || !draft.amount || !draft.category || !draft.paymentMethod || !draft.date) return;
    setSavingDraft(index); setAiMessage("");
    try {
      await addTransaction({ type: draft.type, amount: draft.amount, category: draft.category, description: draft.merchant || draft.note || draft.category, paymentMethod: draft.paymentMethod, date: draft.date });
      const original = aiOriginalCategories[index];
      if (db && draft.merchant && original !== draft.category) {
        // Save the category selected on the review card for future parses of this merchant.
        const key = draft.merchant.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
        if (key) {
          try { await setDoc(doc(db, "users", user.uid, "merchantOverrides", key), { category: draft.category, merchant: draft.merchant, updatedAt: new Date().toISOString() }, { merge: true }); }
          catch { setAiMessage("Transaction saved. Your merchant category preference could not be saved this time."); }
        }
      }
      setSavedDraft(index);
      setTimeout(() => {
        setAiDrafts((current) => current.filter((_, draftIndex) => draftIndex !== index));
        setAiOriginalCategories((current) => current.filter((_, draftIndex) => draftIndex !== index));
      }, 550);
    } catch (cause) { setAiMessage(cause instanceof Error ? cause.message : "Unable to save this transaction. Try again."); }
    finally { setSavingDraft(null); }
  }

  async function handleReceiptFile(file?: File) {
    if (!file || !aiEnabled || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) return;
    setReceiptBusy(true); setAiMessage(""); setReceiptDraft(null);
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Image conversion failed")), "image/jpeg", 0.72));
      if (blob.size > 700_000) throw new Error("This image is too large to process. Try a smaller or clearer picture.");
      const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Image read failed")); reader.onerror = () => reject(new Error("Image read failed")); reader.readAsDataURL(blob); });
      setReceiptDraft(await scanReceipt(dataUrl, "image/jpeg"));
    } catch (cause) {
      const code = typeof cause === "object" && cause && "code" in cause ? String(cause.code) : "";
      setAiMessage(code.includes("resource-exhausted") ? "You've reached your AI limit for now. Try again later." : cause instanceof Error && cause.message.includes("too large") ? cause.message : "AI couldn't read that image. Try a clearer picture.");
    } finally { setReceiptBusy(false); if (receiptInputRef.current) receiptInputRef.current.value = ""; }
  }

  async function confirmReceipt() {
    if (!receiptDraft || !user?.uid || !receiptDraft.type || !receiptDraft.amount || !receiptDraft.date || !receiptDraft.category || !receiptDraft.paymentMethod) return;
    try {
      await addTransaction({ type: receiptDraft.type, amount: receiptDraft.amount, category: receiptDraft.category, description: receiptDraft.merchant?.trim() || receiptDraft.note || receiptDraft.category, paymentMethod: receiptDraft.paymentMethod, date: receiptDraft.date });
      setReceiptDraft(null); setAiMessage("Receipt transaction saved.");
    } catch (cause) { setAiMessage(cause instanceof Error ? cause.message : "Unable to save this transaction. Try again."); }
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
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setVoiceModalOpen(true)}
              aria-label="Start voice expense entry"
              style={{ fontSize: "11.5px", padding: "4px 9px", display: "inline-flex", alignItems: "center", gap: "5px" }}
            >
              <Mic size={13} />
              <span>Voice</span>
            </button>
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
            {movementType === type && <motion.span className="movement-active-pill" layoutId="quickadd-movement-pill" transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }} />}
            {type === "income" ? "Money In" : "Money Out"}
          </button>)}
        </div>
        {aiEnabled && <section className="quick-ai-section" aria-label="AI transaction entry">
          <div className="quick-ai-heading"><Sparkles size={15} /><div><strong>Describe a transaction</strong><small>Review every detail before saving.</small></div></div>
          <form onSubmit={(event) => void handleAiParse(event)} className="quick-ai-form">
            <input aria-label="Describe transactions" value={aiText} onChange={(event) => setAiText(event.target.value)} placeholder="e.g. Swiggy ₹250 yesterday by UPI" maxLength={4000} />
            <button className="button button-secondary" type="submit" disabled={!aiText.trim() || aiBusy}>{aiBusy ? "Reading…" : "Review"}</button>
          </form>
          <input ref={receiptInputRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" aria-label="Choose receipt image" onChange={(event) => void handleReceiptFile(event.target.files?.[0])} />
          <button type="button" className="button button-ghost receipt-scan-button" onClick={() => receiptInputRef.current?.click()} disabled={receiptBusy}>{receiptBusy ? "Reading receipt…" : "Scan a receipt or UPI screenshot"}</button>
          {aiMessage && <p role="status" className="quick-ai-message">{aiMessage}</p>}
          {receiptDraft && <article className="ai-draft-card receipt-draft-card"><strong>Review receipt details</strong><p>Only details the image showed were extracted. Fill anything missing before saving.</p>
            <div className="ai-draft-grid">
              <label>Type<AccessibleSelect label="Money type" value={receiptDraft.type === "income" ? "Money In" : receiptDraft.type === "expense" ? "Money Out" : ""} placeholder="Choose type" options={["Money Out", "Money In"]} onChange={(value) => setReceiptDraft({ ...receiptDraft, type: value === "Money In" ? "income" : "expense" })} /></label>
              <label>Amount<input type="number" min="0.01" step="0.01" value={receiptDraft.amount ?? ""} onChange={(event) => setReceiptDraft({ ...receiptDraft, amount: event.target.value ? Number(event.target.value) : null })} /></label>
              <label>Merchant<input value={receiptDraft.merchant ?? ""} onChange={(event) => setReceiptDraft({ ...receiptDraft, merchant: event.target.value || null })} /></label>
              <label>Category<AccessibleSelect label="Transaction category" value={receiptDraft.category ?? ""} placeholder="Choose category" options={[...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].filter((value, i, list) => list.indexOf(value) === i)} onChange={(value) => setReceiptDraft({ ...receiptDraft, category: value })} /></label>
              <label>Payment method<AccessibleSelect label="Payment method" value={receiptDraft.paymentMethod ?? ""} placeholder="Choose method" options={["UPI", "Credit Card", "Debit Card", "Cash", "Bank Transfer"]} onChange={(value) => setReceiptDraft({ ...receiptDraft, paymentMethod: value as PaymentMethod })} /></label>
              <label>Date<input type="date" value={receiptDraft.date ?? ""} onChange={(event) => setReceiptDraft({ ...receiptDraft, date: event.target.value || null })} /></label>
            </div>
            {receiptDraft.items.length > 0 && <p>Items shown: {receiptDraft.items.join(", ")}</p>}
            <div className="ai-draft-actions"><span>Confidence · {Math.round(receiptDraft.confidence * 100)}%</span><button type="button" className="button button-primary" disabled={!receiptDraft.type || !receiptDraft.amount || !receiptDraft.date || !receiptDraft.category || !receiptDraft.paymentMethod} onClick={() => void confirmReceipt()}>Confirm & save</button></div>
          </article>}
          {aiDrafts.map((draft, index) => <article className="ai-draft-card" key={`${draft.date}-${draft.amount}-${index}`}>
            <strong>Review transaction</strong>
            <div className="ai-draft-grid">
              <label>Money type<AccessibleSelect label="Money type" value={draft.type === "income" ? "Money In" : "Money Out"} options={["Money Out", "Money In"]} onChange={(value) => setAiDrafts((all) => all.map((item, i) => i === index ? { ...item, type: value === "Money In" ? "income" : "expense" } : item))} /></label>
              <label>Amount<input type="number" min="0.01" step="0.01" value={draft.amount ?? ""} onChange={(event) => setAiDrafts((all) => all.map((item, i) => i === index ? { ...item, amount: event.target.value ? Number(event.target.value) : null } : item))} /></label>
              <label>Merchant<input value={draft.merchant} onChange={(event) => setAiDrafts((all) => all.map((item, i) => i === index ? { ...item, merchant: event.target.value } : item))} /></label>
              <label>Category<AccessibleSelect label="Transaction category" value={draft.category ?? ""} placeholder="Choose category" options={[...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].filter((value, i, list) => list.indexOf(value) === i)} onChange={(value) => setAiDrafts((all) => all.map((item, i) => i === index ? { ...item, category: value } : item))} /></label>
              <label>Payment<AccessibleSelect label="Payment method" value={draft.paymentMethod ?? ""} placeholder="Choose payment" options={["UPI", "Credit Card", "Debit Card", "Cash", "Bank Transfer"]} onChange={(value) => setAiDrafts((all) => all.map((item, i) => i === index ? { ...item, paymentMethod: value as PaymentMethod } : item))} /></label>
              <label>Date<input type="date" value={draft.date ?? ""} onChange={(event) => setAiDrafts((all) => all.map((item, i) => i === index ? { ...item, date: event.target.value || null } : item))} /></label>
            </div>
            <div className="ai-draft-actions"><span>AI estimate · {Math.round(draft.confidence * 100)}% confidence</span><button type="button" className="button button-primary" disabled={savingDraft !== null || !draft.type || !draft.amount || !draft.category || !draft.paymentMethod || !draft.date} onClick={() => void confirmAiDraft(index)}>{savingDraft === index ? "Saving…" : savedDraft === index ? <><Check size={14} /> Saved</> : "Confirm & save"}</button></div>
          </article>)}
        </section>}
        <form onSubmit={(event) => void handleSubmit(event)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {saveError && <p className="signal-error" role="alert">{saveError}</p>}
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
              <AccessibleSelect
                label={movementType === "income" ? "Income source" : "Transaction category"}
                value={category}
                onChange={setCategory}
                options={movementType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES}
              />
            </div>

            <div>
              <label htmlFor="modal-payment">{movementType === "income" ? "RECEIVED VIA" : "PAYMENT METHOD"}</label>
              <AccessibleSelect
                label={movementType === "income" ? "Received via" : "Payment method"}
                value={paymentMethod}
                onChange={(value) => setPaymentMethod(value as PaymentMethod)}
                options={["UPI", "Credit Card", "Debit Card", "Cash", "Bank Transfer"]}
              />
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
              <button type="submit" className="button button-primary" disabled={transactionSaved}>
                <span>{transactionSaved ? "Saved" : movementType === "income" ? "Add Money In" : "Add Money Out"}</span>
                {transactionSaved ? <Check size={14} /> : <ArrowRight size={14} />}
              </button>
            </div>
          </div>
        </form>
      </div>

      <VoiceExpenseModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onSuccess={() => {
          setTransactionSaved(true);
          onSuccess?.();
          requestClose();
        }}
      />
    </div>
  );
}
