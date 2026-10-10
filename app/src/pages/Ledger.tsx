import { useState, useMemo, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, Plus, Trash2, Filter, Receipt, Download, RotateCcw, Check } from "lucide-react";
import { useTransactions } from "../context/TransactionsContext";
import type { Transaction } from "../types";
import { EmptyState } from "../components/EmptyState";
import { isIncomeTransaction } from "../utils/analytics";
import { formatCurrency, formatDate } from "../utils/formatters";
import { containDialogFocus } from "../utils/dialogFocus";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function Ledger() {
  const { openQuickAdd } = useOutletContext<{ openQuickAdd: () => void }>();
  const { transactions, deleteTransaction, addTransaction } = useTransactions();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedMethod, setSelectedMethod] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest">("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [deletedTx, setDeletedTx] = useState<Transaction | null>(null);
  const [exportedSuccess, setExportedSuccess] = useState(false);
  const undoTimeoutRef = useRef<number | null>(null);
  const filterSheetRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  function escapeCsvField(val: string | number) {
    const raw = String(val);
    const trimmed = raw.replace(/^[ \t\r\n]+/, "");
    const hasLeadingDanger = /^[=+\-@]/.test(trimmed);
    const s = raw.replace(/\t/g, " ").replace(/\r/g, " ").replace(/\n/g, " ");
    if (hasLeadingDanger || /^[=+\-@]/.test(s)) {
      return "'" + s;
    }
    if (s.includes(",") || s.includes('"')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleExportCsv() {
    const dataToExport = filteredTransactions.length > 0 ? filteredTransactions : transactions;
    if (dataToExport.length === 0) return;

    const headers = ["Date", "Type", "Amount", "Category", "Description", "Payment Method"];
    const rows = dataToExport.map((t) => [
      escapeCsvField(t.date),
      escapeCsvField(t.type || "expense"),
      escapeCsvField(t.amount.toFixed(2)),
      escapeCsvField(t.category || ""),
      escapeCsvField(t.description || ""),
      escapeCsvField(t.paymentMethod || ""),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const filename = `financial-observatory-ledger-${new Date().toISOString().slice(0, 10)}.csv`;

    // Try Web Share on mobile if supported
    if (typeof navigator !== "undefined" && navigator.canShare && typeof File !== "undefined") {
      try {
        const file = new File([blob], filename, { type: "text/csv" });
        if (navigator.canShare({ files: [file] })) {
          navigator.share({
            files: [file],
            title: "Financial Observatory Transactions",
            text: `Export of ${dataToExport.length} transactions from Financial Observatory.`,
          }).catch(() => downloadBlob(blob, filename));
          setExportedSuccess(true);
          setTimeout(() => setExportedSuccess(false), 2500);
          return;
        }
      } catch {
        // Fallback
      }
    }

    downloadBlob(blob, filename);
    setExportedSuccess(true);
    setTimeout(() => setExportedSuccess(false), 2500);
  }

  async function handleDelete(tx: Transaction) {
    if (confirm("Delete this transaction entry from the ledger?")) {
      try {
        await deleteTransaction(tx.id);
        setDeletedTx(tx);
        if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
        undoTimeoutRef.current = window.setTimeout(() => setDeletedTx(null), 6000);
      } catch {
        // Handled in context
      }
    }
  }

  async function handleUndo() {
    if (!deletedTx) return;
    try {
      const { id, createdAt, ...rest } = deletedTx;
      void id;
      void createdAt;
      await addTransaction(rest);
      setDeletedTx(null);
    } catch {
      // Handled
    }
  }

  useEffect(() => {
    if (!filtersOpen) return;
    const restoreFocus = filterSheetRef.current ? containDialogFocus(filterSheetRef.current) : undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setFiltersOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      restoreFocus?.();
    };
  }, [filtersOpen]);

  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return Array.from(set);
  }, [transactions]);

  const paymentMethods = useMemo(() => {
    const set = new Set(transactions.map((t) => t.paymentMethod));
    return Array.from(set);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let result = transactions.filter((t) => {
      const matchSearch =
        (t.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === "ALL" || t.category === selectedCategory;
      const matchMethod = selectedMethod === "ALL" || t.paymentMethod === selectedMethod;
      return matchSearch && matchCat && matchMethod;
    });

    if (sortOrder === "newest") {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortOrder === "oldest") {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortOrder === "highest") {
      result.sort((a, b) => b.amount - a.amount);
    }

    return result;
  }, [transactions, searchQuery, selectedCategory, selectedMethod, sortOrder]);

  const stats = useMemo(() => {
    const total = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);
    const count = filteredTransactions.length;
    const avg = count > 0 ? total / count : 0;
    return { total, count, avg };
  }, [filteredTransactions]);

  return (
    <div className="page-wrapper">

      <main id="main-content" tabIndex={-1} className="content-wrapper">
        <div className="app-container" style={{ paddingTop: "40px" }}>
          {/* Header */}
          <div
            className="page-hero animate-slide-up"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "32px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <div className="eyebrow">
                <span className="dot" />
                <span>YOUR TRANSACTIONS</span>
              </div>
              <h1 style={{ fontSize: "clamp(2.0rem, 3.8vw, 2.9rem)", marginBottom: "4px" }}>
                Your Transactions.
              </h1>
              <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.52)" }}>
                Search and review money coming in and going out.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                className="button button-secondary"
                onClick={handleExportCsv}
                title="Export transactions to CSV"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px" }}
              >
                {exportedSuccess ? <Check size={13} color="var(--accent-pos, #10b981)" /> : <Download size={13} />}
                <span>{exportedSuccess ? "Exported" : "Export CSV"}</span>
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={openQuickAdd}
              >
                <Plus size={13} strokeWidth={2.5} />
                <span>Add transaction</span>
              </button>
            </div>
          </div>

          {/* Airy Quick Metrics Strip */}
          <div
            className="ledger-toolbar"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "24px",
              marginBottom: "28px",
              paddingBottom: "20px",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <div>
              <div className="stat-label">TRANSACTIONS</div>
              <div style={{ fontSize: "24px", fontWeight: 600, color: "#ffffff", marginTop: "6px", letterSpacing: "-0.03em" }}>
                {stats.count} entries
              </div>
            </div>

            <div>
              <div className="stat-label">TOTAL IN RESULTS</div>
              <div style={{ fontSize: "24px", fontWeight: 600, color: "#ffffff", marginTop: "6px", letterSpacing: "-0.03em" }}>
                {formatCurrency(stats.total)}
              </div>
            </div>

            <div>
              <div className="stat-label">AVERAGE TRANSACTION</div>
              <div style={{ fontSize: "24px", fontWeight: 600, color: "#ffffff", marginTop: "6px", letterSpacing: "-0.03em" }}>
                {formatCurrency(stats.avg)}
              </div>
            </div>
          </div>

          {/* Minimalist Search & Filter Toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            {/* Search Input */}
            <div className="ledger-search-field" style={{ position: "relative", minWidth: "260px", flex: 1 }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255, 255, 255, 0.35)",
                }}
              />
              <input
                type="text"
                aria-label="Search transactions"
                placeholder="Search merchant, category, or note..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: "34px",
                  paddingTop: "7px",
                  paddingBottom: "7px",
                  fontSize: "13px",
                  maxWidth: "400px",
                }}
              />
            </div>

            {/* Filter Selectors */}
            <div className="ledger-filters" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Filter size={13} color="rgba(255, 255, 255, 0.4)" />
                <select
                  aria-label="Filter by category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ width: "auto", padding: "6px 10px", fontSize: "12.5px" }}
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <select
                aria-label="Filter by payment method"
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                style={{ width: "auto", padding: "6px 10px", fontSize: "12.5px" }}
              >
                <option value="ALL">All payment methods</option>
                {paymentMethods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                aria-label="Sort transactions"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest" | "highest")}
                style={{ width: "auto", padding: "6px 10px", fontSize: "12.5px" }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
              </select>
            </div>
            <button type="button" className="button button-secondary ledger-filter-button" aria-haspopup="dialog" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(true)}>
              <Filter size={15} />
              <span>Filters</span>
            </button>
          </div>

          {/* Terminal Table Chassis */}
          {filteredTransactions.length === 0 ? (
            <EmptyState
              title="No transactions found"
              description="No transaction records match the specified filters or search query."
              actionText="Add transaction"
              onAction={openQuickAdd}
            />
          ) : (
            <>
            <div className="ledger-table-container desktop-ledger-table">
              <table className="ledger-table">
                <thead>
                  <tr>
                    <th>Merchant / Description</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Payment method</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                    <th style={{ textAlign: "right", width: "36px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                  {filteredTransactions.map((tx) => (
                    <motion.tr key={tx.id} layout initial={reduceMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, scaleY: 0 }} transition={{ duration: reduceMotion ? 0 : 0.18 }} style={{ transformOrigin: "top" }}>
                      <td style={{ fontWeight: 500, color: "#ffffff" }}>
                        {tx.description || tx.category}
                      </td>
                      <td>
                        <span className="category-pill">{tx.category}</span>
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px" }}>
                        {formatDate(tx.date)}
                      </td>
                      <td>
                        <span className="payment-method-tag">{tx.paymentMethod}</span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span className={isIncomeTransaction(tx) ? "amount-credit" : "amount-debit"}>
                          {isIncomeTransaction(tx) ? "+" : "−"}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="button-icon"
                          style={{ width: "26px", height: "26px" }}
                          title="Delete transaction"
                          onClick={() => void handleDelete(tx)}
                        >
                          <Trash2 size={12} color="rgba(244, 63, 94, 0.65)" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            <div className="mobile-transaction-list">
              <AnimatePresence initial={false}>
              {filteredTransactions.map((tx) => (
                <motion.article layout initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, height: 0, margin: 0, paddingBlock: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} className="mobile-transaction-card" key={tx.id}>
                  <span className="transaction-category-icon" aria-hidden="true"><Receipt size={17} /></span>
                  <div className="mobile-transaction-copy">
                    <strong>{tx.category}</strong>
                    <span>{formatDate(tx.date)}{tx.description ? ` · ${tx.description}` : ""}</span>
                  </div>
                  <strong className={`mobile-transaction-amount ${isIncomeTransaction(tx) ? "amount-credit" : "amount-debit"}`}>{isIncomeTransaction(tx) ? "+" : "−"}{formatCurrency(tx.amount)}</strong>
                  <button
                    type="button"
                    className="button-icon mobile-transaction-delete"
                    aria-label={`Delete ${tx.description || tx.category}`}
                    onClick={() => {
                      if (confirm("Delete this transaction entry from the ledger?")) void deleteTransaction(tx.id).catch(() => undefined);
                    }}
                  ><Trash2 size={15} /></button>
                </motion.article>
              ))}
              </AnimatePresence>
            </div>
            </>
          )}
        </div>
      </main>

      {filtersOpen && (
        <div className="filter-sheet-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setFiltersOpen(false); }}>
          <section ref={filterSheetRef} tabIndex={-1} className="filter-sheet" role="dialog" aria-modal="true" aria-labelledby="filter-sheet-title">
            <div className="filter-sheet-heading">
              <h2 id="filter-sheet-title">Filter transactions</h2>
              <button type="button" className="button-icon" aria-label="Close filters" onClick={() => setFiltersOpen(false)}>×</button>
            </div>
            <label htmlFor="mobile-category-filter">Category</label>
            <select id="mobile-category-filter" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
              <option value="ALL">All Categories</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <label htmlFor="mobile-method-filter">Payment method</label>
            <select id="mobile-method-filter" value={selectedMethod} onChange={(event) => setSelectedMethod(event.target.value)}>
              <option value="ALL">All Methods</option>
              {paymentMethods.map((method) => <option key={method} value={method}>{method}</option>)}
            </select>
            <label htmlFor="mobile-sort-filter">Sort by</label>
            <select id="mobile-sort-filter" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest" | "highest")}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
            </select>
            <button type="button" className="button button-secondary" onClick={handleExportCsv} style={{ width: "100%", justifyContent: "center", marginTop: "10px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Download size={14} />
              <span>Export CSV ({filteredTransactions.length})</span>
            </button>
            <button type="button" className="button button-primary filter-sheet-done" onClick={() => setFiltersOpen(false)} style={{ marginTop: "8px" }}>Show {filteredTransactions.length} transactions</button>
          </section>
        </div>
      )}

      {/* Undo Delete Toast */}
      {deletedTx && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 16px",
            background: "rgba(18, 18, 22, 0.96)",
            border: "1px solid var(--border-medium)",
            borderRadius: "12px",
            boxShadow: "var(--shadow-modal)",
            backdropFilter: "blur(12px)",
            fontSize: "13px",
            color: "#ffffff",
          }}
        >
          <span>Transaction removed</span>
          <button
            type="button"
            onClick={handleUndo}
            className="button button-secondary"
            style={{ padding: "4px 10px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--accent-pos, #10b981)" }}
          >
            <RotateCcw size={12} />
            <span>Undo</span>
          </button>
        </div>
      )}

    </div>
  );
}
