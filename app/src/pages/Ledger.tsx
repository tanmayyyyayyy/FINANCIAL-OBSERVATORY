import { useState, useMemo } from "react";
import { Search, Plus, Trash2, Filter } from "lucide-react";
import { useTransactions } from "../context/TransactionsContext";
import { Navbar } from "../components/Navbar";
import { QuickAddModal } from "../components/QuickAddModal";
import { EmptyState } from "../components/EmptyState";
import { formatCurrency, formatDate } from "../utils/formatters";

export function Ledger() {
  const { transactions, deleteTransaction } = useTransactions();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedMethod, setSelectedMethod] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest">("newest");

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
      <Navbar onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      <main className="content-wrapper">
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
                <span>AUDIT TRAIL • GENERAL LEDGER</span>
              </div>
              <h1 style={{ fontSize: "clamp(2.0rem, 3.8vw, 2.9rem)", marginBottom: "4px" }}>
                Detailed Ledger.
              </h1>
              <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.52)" }}>
                Granular reconciliation log of all capital movements, merchants, and settlement rails.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                className="button button-primary"
                onClick={() => setIsQuickAddOpen(true)}
              >
                <Plus size={13} strokeWidth={2.5} />
                <span>Record Movement</span>
              </button>
            </div>
          </div>

          {/* Airy Quick Metrics Strip */}
          <div
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
              <div className="stat-label">RECONCILED MOVEMENTS</div>
              <div style={{ fontSize: "24px", fontWeight: 600, color: "#ffffff", marginTop: "6px", letterSpacing: "-0.03em" }}>
                {stats.count} entries
              </div>
            </div>

            <div>
              <div className="stat-label">AGGREGATE SUM</div>
              <div style={{ fontSize: "24px", fontWeight: 600, color: "#ffffff", marginTop: "6px", letterSpacing: "-0.03em" }}>
                {formatCurrency(stats.total)}
              </div>
            </div>

            <div>
              <div className="stat-label">AVERAGE TICKET SIZE</div>
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
            <div style={{ position: "relative", minWidth: "260px", flex: 1 }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
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
          </div>

          {/* Terminal Table Chassis */}
          {filteredTransactions.length === 0 ? (
            <EmptyState
              title="No Reconciled Movements Found"
              description="No transaction records match the specified filters or search query."
              actionText="Log New Movement"
              onAction={() => setIsQuickAddOpen(true)}
            />
          ) : (
            <div className="ledger-table-container">
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
                        <span className="amount-debit">
                          −{formatCurrency(tx.amount)}
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
          )}
        </div>
      </main>

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </div>
  );
}
