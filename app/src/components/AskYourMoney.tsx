import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Bot, X } from "lucide-react";
import { askYourMoney } from "../firebase/ai";
import { useAiPreferences } from "../context/AiPreferencesContext";
import { containDialogFocus } from "../utils/dialogFocus";

type Message = { role: "user" | "assistant"; text: string };
const followupOptions = ["Compare with last month", "Show my top categories", "Where can I save?", "Check my budgets", "Show recent transactions"];

export function AskYourMoney({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { enabled, loading: preferenceLoading } = useAiPreferences();
  const reduceMotion = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [followups, setFollowups] = useState<string[]>(followupOptions);
  const [latestTools, setLatestTools] = useState<Array<{ tool: string; result: unknown }>>([]);
  const chartCategories = latestTools.flatMap((tool) => {
    if (!tool.result || typeof tool.result !== "object" || !("categories" in tool.result) || !Array.isArray(tool.result.categories)) return [];
    return tool.result.categories.filter((item): item is { category: string; amount: number } => Boolean(item) && typeof item === "object" && "category" in item && typeof item.category === "string" && "amount" in item && typeof item.amount === "number").slice(0, 5);
  }).slice(0, 5);
  const maxChartAmount = Math.max(1, ...chartCategories.map((item) => item.amount));
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    return containDialogFocus(panelRef.current);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open, onClose]);

  async function send(text = input) {
    const trimmed = text.trim();
    if (!trimmed || busy || !enabled) return;
    const next = [...messages, { role: "user" as const, text: trimmed }].slice(-8);
    setMessages(next); setInput(""); setBusy(true); setError("");
    try {
      const response = await askYourMoney(next);
      setMessages([...next, { role: "assistant", text: response.answer }]);
      setFollowups(response.followups.length ? response.followups : followupOptions);
      setLatestTools(response.toolResults);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "AI couldn't respond right now. Try again.");
      setMessages(messages);
    } finally { setBusy(false); }
  }

  return <AnimatePresence>
    {open && <>
      <motion.button type="button" aria-label="Close Ask your money" className="ai-sheet-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} />
      <motion.aside ref={panelRef} className="ai-chat-sheet" role="dialog" aria-modal="true" aria-labelledby="ai-chat-title" tabIndex={-1} initial={reduceMotion ? false : { x: 32, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={reduceMotion ? undefined : { x: 32, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
        <header className="ai-chat-header"><div><div className="eyebrow"><Bot size={14} /> YOUR MONEY ASSISTANT</div><h2 id="ai-chat-title">Ask your money</h2></div><button className="button-icon" type="button" onClick={onClose} aria-label="Close"><X size={18} /></button></header>
        {!preferenceLoading && !enabled ? <div className="ai-chat-off" role="status"><h3>AI features are turned off.</h3><p>You can enable them any time in Settings. Your core money tools will keep working.</p></div> : <>
          <div className="ai-chat-messages" aria-live="polite">{messages.length === 0 && <p className="ai-chat-intro">Ask about your spending, budgets, or recent transactions. Answers use summaries from your own account.</p>}{messages.map((message, index) => <div className={`ai-message ${message.role}`} key={`${index}-${message.text}`}><span>{message.text}</span></div>)}{busy && <div className="ai-message assistant" role="status">Checking your numbers…</div>}{error && <p className="ai-chat-error" role="alert">{error}</p>}</div>
          {latestTools.length > 0 && <div className="ai-tool-summary" aria-label="Data used to answer">Based on {latestTools.map((tool) => tool.tool.replace(/^get/, "")).join(", ")} from your account.</div>}
          {chartCategories.length > 0 && <div className="ai-inline-chart" role="img" aria-label={`Category spending: ${chartCategories.map((item) => `${item.category} ${item.amount}`).join(", ")}`}>{chartCategories.map((item) => <div className="ai-inline-chart-row" key={item.category}><span>{item.category}</span><span className="ai-inline-chart-track"><span style={{ width: `${Math.max(2, item.amount / maxChartAmount * 100)}%` }} /></span><strong>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(item.amount)}</strong></div>)}</div>}
          <div className="ai-followups">{followups.map((item) => <button type="button" className="ai-followup" key={item} onClick={() => void send(item)} disabled={busy}>{item}</button>)}</div>
          <form className="ai-chat-composer" onSubmit={(event) => { event.preventDefault(); void send(); }}><label className="sr-only" htmlFor="ai-chat-input">Ask about your money</label><textarea id="ai-chat-input" rows={2} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about your spending…" maxLength={1200} disabled={busy} /><button className="button button-primary" type="submit" disabled={!input.trim() || busy} aria-label="Send question"><ArrowUp size={18} /></button></form>
        </>}
      </motion.aside>
    </>}
  </AnimatePresence>;
}
