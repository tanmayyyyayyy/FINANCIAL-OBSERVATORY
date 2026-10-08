import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, X, Check, RefreshCw } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTransactions } from "../context/TransactionsContext";
import { parseVoiceExpense, type VoiceParsedExpense } from "../utils/voiceParser";
import { EXPENSE_CATEGORIES } from "../data/categories";
import type { PaymentMethod } from "../types";
import { containDialogFocus } from "../utils/dialogFocus";

export type VoiceState =
  | "IDLE"
  | "LISTENING"
  | "PROCESSING"
  | "REVIEW"
  | "SUCCESS"
  | "ERROR"
  | "PERMISSION_DENIED"
  | "UNSUPPORTED"
  | "CANCELLED";

interface VoiceExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Typing for Web Speech API
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

const PAYMENT_METHODS: PaymentMethod[] = ["UPI", "Credit Card", "Debit Card", "Cash", "Bank Transfer"];

/** Returns today's local date as YYYY-MM-DD (correct in any timezone, including IST). */
function getLocalDateString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function VoiceExpenseModal({ isOpen, onClose, onSuccess }: VoiceExpenseModalProps) {
  const { addTransaction } = useTransactions();
  const reduceMotion = useReducedMotion();

  const [state, setState] = useState<VoiceState>("IDLE");
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // Review state fields
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("Food & Dining");
  const [description, setDescription] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [date, setDate] = useState<string>(getLocalDateString());

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  /**
   * sessionTokenRef: incremented each time a new listening session starts.
   * Event handlers capture the token at creation time and verify it matches
   * the current value before mutating state. Prevents stale onresult/onend
   * from a cancelled session from having any effect.
   */
  const sessionTokenRef = useRef<number>(0);
  /** Final transcript captured in a ref so onend reads it synchronously. */
  const transcriptRef = useRef<string>("");
  /** 350ms processing timer — cleared on abort/close. */
  const processingTimerRef = useRef<number | null>(null);
  /** Auto-close timer after SUCCESS — cleared on abort/close. */
  const closingTimerRef = useRef<number | null>(null);
  /** Ref-based double-save guard (faster than waiting for setState). */
  const savingRef = useRef<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    const restore = modalRef.current ? containDialogFocus(modalRef.current) : undefined;
    return () => restore?.();
  }, [isOpen, state]);

  // Check support on mount
  const isSupported = typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Abort the active recognition session and invalidate all in-flight handlers.
  // Uses abort() so the browser does not fire a final onend with real results.
  // The session token increment ensures any racing handlers are ignored anyway.
  const abortListening = useCallback(() => {
    sessionTokenRef.current += 1; // invalidate all handlers for the current session
    if (processingTimerRef.current !== null) {
      clearTimeout(processingTimerRef.current);
      processingTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // already stopped — safe to ignore
      }
      recognitionRef.current = null;
    }
  }, []);

  // Reset when opening / clean up when closing
  useEffect(() => {
    if (isOpen) {
      if (!isSupported) {
        setState("UNSUPPORTED");
      } else {
        setState("IDLE");
        setTranscript("");
        transcriptRef.current = "";
        setErrorMessage("");
        setSaving(false);
        savingRef.current = false;
        setDate(getLocalDateString());
      }
    } else {
      abortListening();
      if (closingTimerRef.current !== null) {
        clearTimeout(closingTimerRef.current);
        closingTimerRef.current = null;
      }
    }
    return () => {
      abortListening();
      if (closingTimerRef.current !== null) {
        clearTimeout(closingTimerRef.current);
        closingTimerRef.current = null;
      }
    };
  }, [isOpen, abortListening]);

  const handleClose = useCallback(() => {
    // If saving is actively in progress, prevent accidental close while commit is happening
    if (savingRef.current && state !== "SUCCESS") return;

    abortListening();
    if (closingTimerRef.current !== null) {
      clearTimeout(closingTimerRef.current);
      closingTimerRef.current = null;
    }
    onClose();
  }, [abortListening, onClose, state]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  function startListening() {
    if (!isSupported) {
      setState("UNSUPPORTED");
      return;
    }

    // Abort any existing session before starting a new one
    abortListening();
    setTranscript("");
    transcriptRef.current = "";
    setErrorMessage("");

    // Capture a new session token; all event handlers verify against this value
    sessionTokenRef.current += 1;
    const myToken = sessionTokenRef.current;

    try {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition!;
      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-IN"; // Default to Indian English / INR colloquial speech

      recognition.onstart = () => {
        if (sessionTokenRef.current !== myToken) return;
        setState("LISTENING");
      };

      recognition.onresult = (event: any) => {
        if (sessionTokenRef.current !== myToken) return;
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        // Keep the ref in sync so onend can read the final value synchronously
        transcriptRef.current = currentTranscript;
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        if (sessionTokenRef.current !== myToken) return;
        const error = event.error;
        if (error === "not-allowed" || error === "service-not-allowed") {
          setState("PERMISSION_DENIED");
          setErrorMessage("Microphone permission is required");
        } else if (error === "no-speech") {
          setState("ERROR");
          setErrorMessage("Couldn't hear anything. Tap to speak again.");
        } else if (error === "aborted") {
          // Intentional abort — do not change state
        } else {
          setState("ERROR");
          setErrorMessage("Couldn't understand that");
        }
      };

      recognition.onend = () => {
        // Guard: ignore if this session was superseded or aborted intentionally
        if (sessionTokenRef.current !== myToken) return;
        recognitionRef.current = null;

        const finalTranscript = transcriptRef.current.trim();
        if (finalTranscript) {
          handleProcessTranscript(finalTranscript, myToken);
        } else {
          setState((prev) => (prev === "LISTENING" ? "ERROR" : prev));
          setErrorMessage((prev) => prev || "Couldn't hear anything. Tap to speak again.");
        }
      };

      recognition.start();
    } catch {
      if (sessionTokenRef.current !== myToken) return;
      setState("ERROR");
      setErrorMessage("Could not access microphone");
    }
  }

  function handleProcessTranscript(text: string, token: number) {
    if (sessionTokenRef.current !== token) return;
    setState("PROCESSING");

    processingTimerRef.current = window.setTimeout(() => {
      processingTimerRef.current = null;
      // Re-check token after async delay
      if (sessionTokenRef.current !== token) return;

      const parsed: VoiceParsedExpense = parseVoiceExpense(text);

      if (parsed.amount && parsed.amount > 0) {
        setAmount(String(parsed.amount));
        setCategory(parsed.category);
        setDescription(parsed.description);
        setPaymentMethod(parsed.paymentMethod);
        setDate(parsed.date);
        setState("REVIEW");
      } else {
        setState("ERROR");
        setErrorMessage("Couldn't understand that amount. Please speak clearly or enter manually.");
      }
    }, 350);
  }

  async function handleConfirmSave() {
    // Double-save guard: ref check is synchronous and beats the React re-render cycle
    if (saving || savingRef.current) return;

    const numAmount = parseFloat(amount);
    if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage("Please enter a valid amount.");
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setErrorMessage("");

    try {
      await addTransaction({
        amount: numAmount,
        category: category.trim() || "Food & Dining",
        description: description.trim() || category,
        paymentMethod,
        date: date || getLocalDateString(),
        type: "expense",
      });

      if (!isMountedRef.current) return;
      setState("SUCCESS");
      onSuccess?.();
      closingTimerRef.current = window.setTimeout(() => {
        closingTimerRef.current = null;
        if (isMountedRef.current) {
          onClose();
        }
      }, 1200);
    } catch (err: any) {
      if (!isMountedRef.current) return;
      setErrorMessage(err?.message || "Failed to save transaction.");
      setSaving(false);
      savingRef.current = false;
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-modal-title"
        className="modal-panel"
        style={{ maxWidth: "460px", width: "100%", padding: "28px 24px" }}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96, y: 12 }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: "2px" }}>
              <span className="dot" />
              <span>VOICE EXPENSE</span>
            </div>
            <h2 id="voice-modal-title" style={{ fontSize: "1.3rem", fontWeight: 600, color: "#ffffff" }}>
              {state === "REVIEW" ? "Review expense" : state === "SUCCESS" ? "Expense added" : "Speak your expense"}
            </h2>
          </div>
          <button
            type="button"
            className="button-icon"
            onClick={handleClose}
            disabled={saving && state !== "SUCCESS"}
            aria-label="Close voice entry"
            style={{
              width: "32px",
              height: "32px",
              opacity: saving && state !== "SUCCESS" ? 0.5 : 1,
              cursor: saving && state !== "SUCCESS" ? "not-allowed" : "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Live Status Announcer */}
        <div className="sr-only" aria-live="polite">
          {state === "LISTENING" && "Listening for expense..."}
          {state === "PROCESSING" && "Understanding your expense..."}
          {state === "REVIEW" && `Review expense: ${amount} rupees for ${description}`}
          {state === "SUCCESS" && "Expense added successfully"}
          {state === "ERROR" && (errorMessage || "Couldn't understand that")}
          {state === "PERMISSION_DENIED" && "Microphone permission is required"}
          {state === "UNSUPPORTED" && "Voice entry is not supported on this device"}
        </div>

        {/* Content per state */}
        <div style={{ minHeight: "180px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* IDLE / LISTENING / ERROR / PERMISSION_DENIED / UNSUPPORTED */}
          {state !== "REVIEW" && state !== "SUCCESS" && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              {/* Mic Visualizer Button */}
              <div style={{ position: "relative", display: "inline-block", marginBottom: "20px" }}>
                {state === "LISTENING" && (
                  <motion.div
                    animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.15, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    style={{
                      position: "absolute",
                      inset: "-12px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, var(--accent-pos, #10b981) 0%, transparent 70%)",
                      pointerEvents: "none",
                    }}
                  />
                )}
                <button
                  type="button"
                  aria-label={state === "LISTENING" ? "Stop listening" : "Start voice expense entry"}
                  aria-pressed={state === "LISTENING"}
                  disabled={state === "UNSUPPORTED" || state === "PROCESSING"}
                  onClick={() => {
                    if (state === "LISTENING") {
                      abortListening();
                      setState("IDLE");
                    } else {
                      startListening();
                    }
                  }}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background:
                      state === "LISTENING"
                        ? "var(--accent-pos, #10b981)"
                        : state === "ERROR" || state === "PERMISSION_DENIED"
                        ? "rgba(244, 63, 94, 0.15)"
                        : "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                    border:
                      state === "LISTENING"
                        ? "2px solid #ffffff"
                        : state === "ERROR" || state === "PERMISSION_DENIED"
                        ? "1px solid rgba(244, 63, 94, 0.4)"
                        : "1px solid var(--border-medium)",
                    color: state === "LISTENING" ? "#000000" : "#ffffff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: state === "UNSUPPORTED" ? "not-allowed" : "pointer",
                    boxShadow: state === "LISTENING" ? "0 0 30px rgba(16, 185, 129, 0.4)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {state === "PERMISSION_DENIED" || state === "UNSUPPORTED" ? (
                    <MicOff size={32} />
                  ) : (
                    <Mic size={32} />
                  )}
                </button>
              </div>

              {/* Status Message */}
              <div style={{ marginBottom: "12px" }}>
                {state === "IDLE" && (
                  <>
                    <div style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff", marginBottom: "4px" }}>
                      Tap to speak
                    </div>
                    <div style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.45)" }}>
                      Say: “Spent 450 on dinner” or “120 Uber using UPI”
                    </div>
                  </>
                )}

                {state === "LISTENING" && (
                  <>
                    <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--accent-pos, #10b981)", marginBottom: "4px" }}>
                      Listening...
                    </div>
                    <div style={{ fontSize: "13.5px", color: "#ffffff", minHeight: "22px", fontStyle: transcript ? "normal" : "italic" }}>
                      {transcript ? `“${transcript}”` : "Speak now..."}
                    </div>
                  </>
                )}

                {state === "PROCESSING" && (
                  <>
                    <div style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff", marginBottom: "4px" }}>
                      Understanding your expense...
                    </div>
                    <div style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.45)" }}>
                      {transcript ? `“${transcript}”` : "Extracting amount and category..."}
                    </div>
                  </>
                )}

                {state === "ERROR" && (
                  <>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--accent-neg, #f43f5e)", marginBottom: "4px" }}>
                      Couldn't understand that
                    </div>
                    <div style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>
                      {errorMessage || "Try speaking clearly with an amount and item."}
                    </div>
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={startListening}
                      style={{ fontSize: "12.5px", padding: "6px 14px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <RefreshCw size={12} />
                      <span>Try again</span>
                    </button>
                  </>
                )}

                {state === "PERMISSION_DENIED" && (
                  <>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--accent-neg, #f43f5e)", marginBottom: "4px" }}>
                      Microphone permission is required
                    </div>
                    <div style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.5)" }}>
                      Please enable microphone permissions in your browser settings to use voice entry.
                    </div>
                  </>
                )}

                {state === "UNSUPPORTED" && (
                  <>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
                      Voice entry isn't supported on this device
                    </div>
                    <div style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.45)" }}>
                      Speech recognition is available on Chrome, Edge, and Safari 14.1+ (desktop/iOS).
                    </div>
                  </>
                )}

                {state === "CANCELLED" && (
                  <>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
                      Voice entry cancelled
                    </div>
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={startListening}
                      style={{ fontSize: "12.5px", padding: "6px 14px", marginTop: "8px" }}
                    >
                      <span>Tap to speak again</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* REVIEW STATE */}
          {state === "REVIEW" && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* Spoken Quote Banner */}
              {transcript && (
                <div
                  style={{
                    padding: "8px 12px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "8px",
                    fontSize: "12.5px",
                    color: "rgba(255, 255, 255, 0.65)",
                    fontStyle: "italic",
                  }}
                >
                  “{transcript}”
                </div>
              )}

              {/* Editable Amount */}
              <div>
                <label htmlFor="voice-amount" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", display: "block", marginBottom: "4px" }}>
                  Amount (₹)
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "18px", color: "#ffffff", fontWeight: 600 }}>
                    ₹
                  </span>
                  <input
                    id="voice-amount"
                    type="number"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{
                      paddingLeft: "32px",
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "#ffffff",
                    }}
                    autoFocus
                  />
                </div>
              </div>

              {/* Description & Category */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label htmlFor="voice-desc" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", display: "block", marginBottom: "4px" }}>
                    Description
                  </label>
                  <input
                    id="voice-desc"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Merchant or item"
                  />
                </div>
                <div>
                  <label htmlFor="voice-cat" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", display: "block", marginBottom: "4px" }}>
                    Category
                  </label>
                  <select
                    id="voice-cat"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Method & Date */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label htmlFor="voice-payment" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", display: "block", marginBottom: "4px" }}>
                    Payment Method
                  </label>
                  <select
                    id="voice-payment"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="voice-date" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", display: "block", marginBottom: "4px" }}>
                    Date
                  </label>
                  <input
                    id="voice-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              {errorMessage && (
                <div role="alert" style={{ fontSize: "12px", color: "var(--accent-neg, #f43f5e)" }}>
                  {errorMessage}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={startListening}
                  disabled={saving}
                  style={{ flex: "0 0 auto", fontSize: "12.5px" }}
                >
                  <Mic size={13} />
                  <span>Speak again</span>
                </button>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleConfirmSave}
                  disabled={saving || !amount}
                  aria-busy={saving}
                  style={{ flex: 1, fontSize: "13px", justifyContent: "center" }}
                >
                  {saving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Confirm & Save Expense</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* SUCCESS STATE */}
          {state === "SUCCESS" && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", padding: "24px 0" }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid var(--accent-pos, #10b981)",
                  color: "var(--accent-pos, #10b981)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                }}
              >
                <Check size={28} />
              </div>
              <div style={{ fontSize: "18px", fontWeight: 600, color: "#ffffff", marginBottom: "4px" }}>
                Expense added
              </div>
              <div style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.6)" }}>
                ₹{amount} · {description || category} ({paymentMethod})
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
