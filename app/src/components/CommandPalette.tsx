import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, LayoutDashboard, PieChart, BookOpen, TrendingUp, Settings, Plus, LogOut, MessageCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { containDialogFocus } from "../utils/dialogFocus";

const commands = [
  { label: "Overview", hint: "Go to dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Budgets", hint: "Review category limits", path: "/budgets", icon: PieChart },
  { label: "Transactions", hint: "Open your ledger", path: "/ledger", icon: BookOpen },
  { label: "Plan", hint: "View your forecast", path: "/prediction", icon: TrendingUp },
  { label: "Settings", hint: "Manage your account", path: "/settings", icon: Settings },
  { label: "Add transaction", hint: "Record money in or out", path: "/add-expense", icon: Plus },
  { label: "Ask your money", hint: "Ask about your spending", path: "#ask", icon: MessageCircle },
];

export function CommandPalette({ open, onClose, onQuickAdd, onAskYourMoney }: { open: boolean; onClose: () => void; onQuickAdd: () => void; onAskYourMoney: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const reduceMotion = useReducedMotion();
  const filtered = useMemo(() => commands.filter((command) => `${command.label} ${command.hint}`.toLowerCase().includes(query.toLowerCase())), [query]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (open && event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    if (!open || !paletteRef.current) return;
    return containDialogFocus(paletteRef.current);
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  function activate(path?: string) {
    onClose();
    if (path === "/add-expense") { onQuickAdd(); return; }
    if (path === "#ask") { onAskYourMoney(); return; }
    if (path) navigate(path);
  }

  return <AnimatePresence>
    {open && <motion.div className="command-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.16 }}>
      <motion.section ref={paletteRef} tabIndex={-1} className="command-palette" role="dialog" aria-modal="true" aria-labelledby="command-title" initial={reduceMotion ? false : { opacity: 0, y: -12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.97 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}>
        <h2 id="command-title" className="sr-only">Quick navigation</h2>
        <label className="command-input-wrap"><span className="sr-only">Search commands</span><input ref={inputRef} value={query} aria-activedescendant={filtered.length ? `command-${activeIndex}` : undefined} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setActiveIndex((index) => (index + 1) % filtered.length); } else if (event.key === "ArrowUp") { event.preventDefault(); setActiveIndex((index) => (index + filtered.length - 1) % filtered.length); } else if (event.key === "Enter" && filtered[activeIndex]) { event.preventDefault(); activate(filtered[activeIndex].path); } }} placeholder="Where would you like to go?" /><kbd>ESC</kbd></label>
        <div className="command-results">
          {filtered.map(({ label, hint, path, icon: Icon }, index) => <button id={`command-${index}`} type="button" aria-selected={activeIndex === index} className="command-result" key={path} onMouseEnter={() => setActiveIndex(index)} onClick={() => activate(path)}><Icon size={16} /><span><strong>{label}</strong><small>{hint}</small></span><ArrowRight size={14} />{activeIndex === index && <motion.span className="command-active-indicator" layoutId="command-highlight" />}</button>)}
          {filtered.length === 0 && <p className="command-empty">No matching commands.</p>}
        </div>
        <div className="command-footer"><span>Navigate anywhere in your observatory</span><button type="button" onClick={() => { onClose(); void signOut().catch(() => undefined); }}><LogOut size={13} /> Sign out</button></div>
      </motion.section>
    </motion.div>}
  </AnimatePresence>;
}
