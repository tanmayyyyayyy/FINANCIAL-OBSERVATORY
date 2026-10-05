import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { Target, Sparkles, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAiPreferences } from "../context/AiPreferencesContext";
import { parseSavingsGoal } from "../firebase/ai";
import { db } from "../firebase/firebase";
import { formatCurrency } from "../utils/formatters";

interface SavedGoal { id: string; name: string; targetAmount: number; targetDate: string; savedAmount: number; createdAt: string }

function remainingMonths(targetDate: string) {
  const now = new Date();
  const target = new Date(`${targetDate}T00:00:00Z`);
  return Math.max(1, (target.getUTCFullYear() - now.getUTCFullYear()) * 12 + target.getUTCMonth() - now.getUTCMonth() + (target.getUTCDate() > now.getUTCDate() ? 0 : 1));
}

export function GoalPlanner() {
  const { user } = useAuth();
  const { enabled, loading: aiLoading } = useAiPreferences();
  const [goals, setGoals] = useState<SavedGoal[]>([]);
  const [prompt, setPrompt] = useState("");
  const [draft, setDraft] = useState<{ name: string; targetAmount: number; targetDate: string; confidence: number; savedAmount: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.uid || !db) { setGoals([]); return; }
    return onSnapshot(collection(db, "users", user.uid, "goals"), (snapshot) => {
      setGoals(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as SavedGoal)));
    }, () => setError("Unable to load your saved goals."));
  }, [user?.uid]);

  const monthlyTarget = useMemo(() => draft ? Math.ceil(Math.max(0, draft.targetAmount - draft.savedAmount) / remainingMonths(draft.targetDate)) : 0, [draft]);

  async function parse() {
    if (!enabled || !prompt.trim() || busy) return;
    setBusy(true); setError(""); setMessage("");
    try { setDraft({ ...(await parseSavingsGoal(prompt)), savedAmount: 0 }); }
    catch (cause) {
      const code = typeof cause === "object" && cause && "code" in cause ? String(cause.code) : "";
      setError(code.includes("resource-exhausted") ? "You've reached your AI limit for now. Try again later." : "AI couldn't safely read that goal. Try again.");
    } finally { setBusy(false); }
  }

  async function saveGoal() {
    if (!user?.uid || !db || !draft || !draft.name.trim() || draft.name.length > 100 || !Number.isFinite(draft.targetAmount) || !(draft.targetAmount > 0) || draft.targetAmount > 1_000_000_000 || !Number.isFinite(draft.savedAmount) || draft.savedAmount < 0 || !draft.targetDate || draft.targetDate <= new Date().toISOString().slice(0, 10)) return;
    setBusy(true); setError("");
    try {
      await addDoc(collection(db, "users", user.uid, "goals"), {
        name: draft.name.trim(), targetAmount: draft.targetAmount, targetDate: draft.targetDate,
        savedAmount: Math.min(draft.targetAmount, Math.max(0, draft.savedAmount)), createdAt: new Date().toISOString(),
      });
      setDraft(null); setPrompt(""); setMessage("Goal saved to your account.");
    } catch { setError("Unable to save your goal. Try again."); }
    finally { setBusy(false); }
  }

  return <section className="goal-planner" aria-labelledby="goal-planner-title">
    <div className="eyebrow"><Target size={14} /> YOUR SAVING GOALS</div>
    <h2 id="goal-planner-title">Plan for something you want</h2>
    <p>Set a target and date. Your monthly amount is calculated from the numbers you confirm.</p>
    {goals.map((goal) => <div className="saved-goal" key={goal.id}><strong>{goal.name}</strong><span>{formatCurrency(goal.savedAmount)} saved of {formatCurrency(goal.targetAmount)} · by {goal.targetDate}</span><progress aria-label={`${goal.name} savings progress`} value={Math.min(goal.savedAmount, goal.targetAmount)} max={goal.targetAmount} /></div>)}
    {enabled && <form className="goal-prompt" onSubmit={(event) => { event.preventDefault(); void parse(); }}><label className="sr-only" htmlFor="goal-description">Describe a goal</label><input id="goal-description" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="e.g. ₹50,000 for a laptop by March" maxLength={1200} /><button className="button button-secondary" disabled={busy || !prompt.trim()}><Sparkles size={14} />{busy ? "Reading…" : "Create a draft"}</button></form>}
    {!enabled && !aiLoading && <p className="goal-ai-off">AI features are turned off. Your saved goals remain available.</p>}
    {draft && <div className="goal-review" aria-label="Review savings goal"><strong>Review your goal</strong><label>Name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label><div className="goal-review-grid"><label>Target amount<input type="number" min="1" value={draft.targetAmount} onChange={(event) => setDraft({ ...draft, targetAmount: event.target.value ? Number(event.target.value) : 0 })} /></label><label>Target date<input type="date" value={draft.targetDate} onChange={(event) => setDraft({ ...draft, targetDate: event.target.value })} /></label><label>Already saved<input type="number" min="0" value={draft.savedAmount} onChange={(event) => setDraft({ ...draft, savedAmount: event.target.value ? Number(event.target.value) : 0 })} /></label></div><p>About {formatCurrency(monthlyTarget)} per month for {remainingMonths(draft.targetDate)} months.</p><div><span>AI estimate · {Math.round(draft.confidence * 100)}% confidence</span><button type="button" className="button button-primary" onClick={() => void saveGoal()} disabled={busy || !draft.name.trim() || !Number.isFinite(draft.targetAmount) || !(draft.targetAmount > 0) || draft.targetAmount > 1_000_000_000 || !Number.isFinite(draft.savedAmount) || draft.savedAmount < 0 || !draft.targetDate || draft.targetDate <= new Date().toISOString().slice(0, 10)}>{busy ? "Saving…" : <><Check size={14} /> Confirm & save goal</>}</button></div></div>}
    {message && <p role="status">{message}</p>}{error && <p role="alert" className="goal-error">{error}</p>}
  </section>;
}
