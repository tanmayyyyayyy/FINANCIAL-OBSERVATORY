import { useState } from "react";
import { FileUp } from "lucide-react";
import type { PaymentMethod, TransactionType } from "../types";

export interface ImportedTransactionDraft {
  type: TransactionType | "";
  amount: number | "";
  category: string;
  description: string;
  paymentMethod: PaymentMethod | "";
  date: string;
  source: string;
}

const paymentMethods: PaymentMethod[] = ["UPI", "Credit Card", "Debit Card", "Cash", "Bank Transfer"];
const categories = ["Food & Dining", "Transport", "Utilities", "Entertainment", "Shopping", "Housing", "Health", "Education", "Other"];

function parseDate(value: string): string {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return Number.isNaN(Date.parse(`${trimmed}T00:00:00Z`)) || new Date(`${trimmed}T00:00:00Z`).toISOString().slice(0, 10) !== trimmed ? "" : trimmed;
  const numeric = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (numeric) {
    const iso = `${numeric[3]}-${numeric[2].padStart(2, "0")}-${numeric[1].padStart(2, "0")}`;
    return Number.isNaN(Date.parse(`${iso}T00:00:00Z`)) || new Date(`${iso}T00:00:00Z`).toISOString().slice(0, 10) !== iso ? "" : iso;
  }
  const named = trimmed.match(/^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/);
  if (named) {
    const month = new Date(`${named[2]} 1, 2000`).getMonth() + 1;
    if (month > 0) {
      const iso = `${named[3]}-${String(month).padStart(2, "0")}-${named[1].padStart(2, "0")}`;
      return Number.isNaN(Date.parse(`${iso}T00:00:00Z`)) || new Date(`${iso}T00:00:00Z`).toISOString().slice(0, 10) !== iso ? "" : iso;
    }
  }
  return "";
}

function splitCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"' && quoted && text[index + 1] === '"') { cell += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(cell.trim()); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell.trim()); cell = "";
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else cell += char;
  }
  row.push(cell.trim()); if (row.some(Boolean)) rows.push(row);
  return rows;
}

function draftFromCsv(headers: string[], cells: string[], source: string): ImportedTransactionDraft | null {
  const get = (...names: string[]) => {
    const index = headers.findIndex((header) => names.some((name) => header.includes(name)));
    return index >= 0 ? cells[index] ?? "" : "";
  };
  const date = parseDate(get("date", "transaction date", "value date"));
  const description = get("description", "narration", "merchant", "details", "particulars", "remarks").replace(/\s+/g, " ").trim().slice(0, 160);
  const debit = get("debit", "withdrawal", "paid out", "money out").replace(/[₹,\s]/g, "");
  const credit = get("credit", "deposit", "paid in", "money in").replace(/[₹,\s]/g, "");
  const amountText = get("amount", "transaction amount").replace(/[₹,\s]/g, "");
  const rawType = get("transaction type", "type", "dr cr", "debit credit").toLowerCase();
  const debitAmount = Number(debit), creditAmount = Number(credit), generic = Number(amountText);
  let type: ImportedTransactionDraft["type"] = "";
  let amount: ImportedTransactionDraft["amount"] = "";
  if (debit && Number.isFinite(debitAmount) && debitAmount > 0) { type = "expense"; amount = debitAmount; }
  else if (credit && Number.isFinite(creditAmount) && creditAmount > 0) { type = "income"; amount = creditAmount; }
  else if (amountText && Number.isFinite(generic) && generic !== 0) { type = generic < 0 ? "expense" : /\b(debit|withdrawal|expense|out)\b/.test(rawType) ? "expense" : /\b(credit|deposit|income|in)\b/.test(rawType) ? "income" : ""; amount = Math.abs(generic); }
  if (!date || !description || amount === "") return null;
  const importedCategory = get("category").trim();
  const category = categories.find((item) => item.toLowerCase() === importedCategory.toLowerCase()) ?? "";
  const importedMethod = get("payment method", "payment mode", "mode").trim();
  const paymentMethod = paymentMethods.find((item) => item.toLowerCase() === importedMethod.toLowerCase()) ?? "";
  return { type, amount, date, description, category, paymentMethod, source };
}

function draftFromPdfLine(line: string): ImportedTransactionDraft | null {
  const dateMatch = line.match(/\b(?:\d{4}-\d{2}-\d{2}|\d{1,2}[/-]\d{1,2}[/-]\d{4}|\d{1,2}\s+[A-Za-z]{3,}\s+\d{4})\b/);
  if (!dateMatch) return null;
  const dateEnd = dateMatch.index! + dateMatch[0].length;
  const remainder = line.slice(dateEnd);
  const moneyMatches = [...remainder.matchAll(/(?:₹\s*)?(-?(?:\d{1,3}(?:,\d{3})+|\d+)\.\d{2})/g)];
  if (!moneyMatches.length) return null;
  const date = parseDate(dateMatch[0]);
  const description = remainder.slice(0, moneyMatches[0].index).replace(/[|\s-]+$/g, "").trim().slice(0, 160);
  if (!date || !description) return null;
  const lower = line.toLowerCase();
  const values = moneyMatches.map((match) => Math.abs(Number(match[1].replace(/,/g, ""))));
  let amount = values.length >= 3 ? values[values.length - 3] : values[0];
  let type: ImportedTransactionDraft["type"] = "";
  if (values.length >= 3) {
    const debit = values[values.length - 3], credit = values[values.length - 2];
    if (debit > 0 && credit === 0) { type = "expense"; amount = debit; }
    else if (credit > 0 && debit === 0) { type = "income"; amount = credit; }
  } else if (/\b(credit|deposit|received|refund)\b/.test(lower)) type = "income";
  else if (/\b(debit|withdrawal|paid|purchase)\b/.test(lower)) type = "expense";
  if (!(amount > 0)) return null;
  return { type, amount, date, description, category: "", paymentMethod: "", source: line.slice(0, 240) };
}

export function StatementImport({ onSave }: { onSave: (draft: ImportedTransactionDraft) => Promise<void> }) {
  const [drafts, setDrafts] = useState<ImportedTransactionDraft[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function readFile(file?: File) {
    if (!file) return;
    setBusy(true); setError(""); setMessage(""); setDrafts([]);
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error("Choose a statement smaller than 5 MB.");
      let parsed: ImportedTransactionDraft[];
      if (file.name.toLowerCase().endsWith(".csv") || file.type === "text/csv") {
        const rows = splitCsv(await file.text());
        if (rows.length < 2) throw new Error("This CSV does not contain transaction rows.");
        const headers = rows[0].map((header) => header.toLowerCase().replace(/[^a-z0-9 ]/g, " ").trim());
        parsed = rows.slice(1).map((row, index) => draftFromCsv(headers, row, `CSV row ${index + 2}`)).filter((row): row is ImportedTransactionDraft => Boolean(row));
      } else if (file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf") {
        const [pdfjs, pdfWorker] = await Promise.all([import("pdfjs-dist"), import("pdfjs-dist/build/pdf.worker.min.mjs?url")]);
        pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker.default;
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), maxImageSize: 1_000_000 }).promise;
        if (pdf.numPages > 50) throw new Error("This PDF has more than 50 pages. Split it into smaller statements first.");
        const lines: string[] = [];
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const content = await page.getTextContent();
          const items = content.items.filter((item): item is typeof item & { str: string } => "str" in item && typeof item.str === "string");
          lines.push(items.map((item) => item.str).join(" "));
        }
        parsed = lines.flatMap((line) => line.split(/(?=\b(?:\d{4}-\d{2}-\d{2}|\d{1,2}[/-]\d{1,2}[/-]\d{4}|\d{1,2}\s+[A-Za-z]{3,}\s+\d{4})\b)/g)).map(draftFromPdfLine).filter((row): row is ImportedTransactionDraft => Boolean(row)).slice(0, 100);
      } else throw new Error("Choose a CSV or text-based PDF bank statement.");
      if (!parsed.length) throw new Error("No supported transaction rows were found. Check that the statement has dates, descriptions, and amounts.");
      setDrafts(parsed.slice(0, 100));
      if (parsed.length > 100) setMessage("Showing the first 100 rows. Import another part of the file for the rest.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to read this statement."); }
    finally { setBusy(false); }
  }

  async function confirmImport() {
    const valid = drafts.filter((draft) => draft.type && draft.amount !== "" && draft.amount > 0 && draft.date && draft.description.trim() && draft.category && draft.paymentMethod);
    if (!valid.length || busy) { setError("Review each row and choose Money In or Money Out before importing."); return; }
    setBusy(true); setError("");
    let imported = 0;
    try {
      for (const draft of valid) {
        await onSave(draft);
        imported += 1;
        setDrafts((current) => current.filter((item) => item !== draft));
      }
      setMessage(`${imported} transaction${imported === 1 ? "" : "s"} added.`);
    } catch { setError(`${imported} added. One row could not be saved; the remaining rows are still here for review.`); }
    finally { setBusy(false); }
  }

  function update(index: number, patch: Partial<ImportedTransactionDraft>) {
    setDrafts((current) => current.map((draft, draftIndex) => draftIndex === index ? { ...draft, ...patch } : draft));
  }

  return <section className="statement-import" aria-labelledby="statement-import-title">
    <div><div className="eyebrow"><FileUp size={13} /> TRANSACTION IMPORT</div><h3 id="statement-import-title">Import a CSV or PDF statement</h3><p>Files are read in this browser. Rows stay here for review. Nothing is saved until you confirm.</p></div>
    <label className="button button-secondary statement-file-button">{busy ? "Reading…" : "Choose statement"}<input type="file" accept=".csv,.pdf,text/csv,application/pdf" disabled={busy} onChange={(event) => void readFile(event.target.files?.[0])} /></label>
    {message && <p role="status">{message}</p>}{error && <p role="alert" className="statement-error">{error}</p>}
    {drafts.length > 0 && <><div className="statement-review-heading"><strong>Review {drafts.length} rows</strong><button className="button button-primary" type="button" disabled={busy} onClick={() => void confirmImport()}>{busy ? "Adding…" : "Confirm import"}</button></div><div className="statement-review-list">{drafts.map((draft, index) => <article className="statement-row" key={`${draft.source}-${index}`}><div className="statement-row-top"><span>{draft.source}</span><button type="button" className="button button-ghost" onClick={() => setDrafts((current) => current.filter((_, rowIndex) => rowIndex !== index))}>Remove</button></div><div className="ai-draft-grid"><label>Type<select value={draft.type} onChange={(event) => update(index, { type: event.target.value as TransactionType | "" })}><option value="">Choose type</option><option value="expense">Money Out</option><option value="income">Money In</option></select></label><label>Amount<input type="number" min="0.01" step="0.01" value={draft.amount} onChange={(event) => update(index, { amount: event.target.value ? Number(event.target.value) : "" })} /></label><label>Category<select value={draft.category} onChange={(event) => update(index, { category: event.target.value })}><option value="">Choose category</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>Merchant<input value={draft.description} onChange={(event) => update(index, { description: event.target.value })} /></label><label>Payment method<select value={draft.paymentMethod} onChange={(event) => update(index, { paymentMethod: event.target.value as PaymentMethod | "" })}><option value="">Choose method</option>{paymentMethods.map((method) => <option key={method}>{method}</option>)}</select></label><label>Date<input type="date" value={draft.date} onChange={(event) => update(index, { date: event.target.value })} /></label></div></article>)}</div></>}
  </section>;
}
