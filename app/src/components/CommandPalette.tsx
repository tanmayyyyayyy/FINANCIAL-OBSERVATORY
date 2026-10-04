import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, LayoutDashboard, PieChart, BookOpen, TrendingUp, Settings, Plus, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { containDialogFocus } from "../utils/dialogFocus";

const commands = [
  { label: "Overview", hint: "Go to dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Budgets", hint: "Review category limits", path: "/budgets", icon: PieChart },
  { label: "Transactions", hint: "Open your ledger", path: "/ledger", icon: BookOpen },
  { label: "Plan", hint: "View your forecast", path: "/prediction", icon: TrendingUp },
  { label: "Settings", hint: "Manage your account", path: "/settings", icon: Settings },
  { label: "Log a movement", hint: "Add a transaction", path: "/add-expense", icon: Plus },
];

export function CommandPalette({ onClose, onQuickAdd }: { onClose: () => void; onQuickAdd: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const filtered = useMemo(() => commands.filter((command) => `${command.label} ${command.hint}`.toLowerCase().includes(query.toLowerCase())), [query]);

  useEffect(() => {
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!paletteRef.current) return;
    return containDialogFocus(paletteRef.current);
  }, []);

  function activate(path?: string) {
    onClose();
    if (path === "/add-expense") { onQuickAdd(); return; }
    if (path) navigate(path);
  }

  return (
    <div className="command-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={paletteRef} tabIndex={-1} className="command-palette" role="dialog" aria-modal="true" aria-labelledby="command-title">
        <h2 id="command-title" className="sr-only">Quick navigation</h2>
        <label className="command-input-wrap"><span className="sr-only">Search commands</span><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Where would you like to go?" /><kbd>ESC</kbd></label>
        <div className="command-results">
          {filtered.map(({ label, hint, path, icon: Icon }) => <button type="button" className="command-result" key={path} onClick={() => activate(path)}><Icon size={16} /><span><strong>{label}</strong><small>{hint}</small></span><ArrowRight size={14} /></button>)}
          {filtered.length === 0 && <p className="command-empty">No matching commands.</p>}
        </div>
        <div className="command-footer"><span>Navigate anywhere in your observatory</span><button type="button" onClick={() => { onClose(); void signOut().catch(() => undefined); }}><LogOut size={13} /> Sign out</button></div>
      </section>
    </div>
  );
}
