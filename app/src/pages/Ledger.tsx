import { useState, useMemo, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, Plus, Trash2, Filter, Receipt } from "lucide-react";
import { useTransactions } from "../context/TransactionsContext";
import { EmptyState } from "../components/EmptyState";
import { isIncomeTransaction } from "../utils/analytics";
import { formatCurrency, formatDate } from "../utils/formatters";
import { containDialogFocus } from "../utils/dialogFocus";

export function Ledger() {
  const { openQuickAdd } = useOutletContext<{ openQuickAdd: () => void }>();
  const { transactions, deleteTransaction } = useTransactions();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedMethod, setSelectedMethod] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest">("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterSheetRef = useRef<HTMLElement>(null);

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
            className="animate-slide-up"
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
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                style={{ width: "auto", padding: "6px 10px", fontSize: "12.5px" }}
              >
                <option value="ALL">All Rails</option>
                {paymentMethods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select
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
              title="No Reconciled Movements Found"
              description="No transaction records match the specified filters or search query."
              actionText="Log New Movement"
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
                    <th>Settlement Rail</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                    <th style={{ textAlign: "right", width: "36px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id}>
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
                          title="Purge transaction"
                          onClick={() => {
                            if (confirm("Delete this transaction entry from the ledger?")) {
                              deleteTransaction(tx.id);
                            }
                          }}
                        >
                          <Trash2 size={12} color="rgba(244, 63, 94, 0.65)" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mobile-transaction-list">
              {filteredTransactions.map((tx) => (
                <article className="mobile-transaction-card" key={tx.id}>
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
                      if (confirm("Delete this transaction entry from the ledger?")) deleteTransaction(tx.id);
                    }}
                  ><Trash2 size={15} /></button>
                </article>
              ))}
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
            <button type="button" className="button button-primary filter-sheet-done" onClick={() => setFiltersOpen(false)}>Show {filteredTransactions.length} transactions</button>
          </section>
        </div>
      )}

    </div>
  );
}
