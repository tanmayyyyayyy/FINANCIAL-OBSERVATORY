# Application Architecture Specification

**Product:** Smart Expense Tracker / Financial Observatory  
**Runtime:** Client-Side Single Page Application (SPA)  
**Toolchain:** Vite 8 + React 19 + TypeScript 6 / 7  

---

## 1. High-Level Architecture

Financial Observatory operates as an offline-first, client-rendered Single Page Application running in modern web browsers. All state is maintained locally in the client through React Context and persisted reactively into the browser's `localStorage` engine.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Browser Client Layer                          │
├────────────────────────────────────────────────────────────────────────┤
│                             React Router 7                             │
│       (/, /login, /signup, /onboarding, /dashboard, /budgets, ...)     │
├───────────────────────────────────┬────────────────────────────────────┤
│       BudgetsContext Provider     │    TransactionsContext Provider    │
│  - Category limits                │  - Transaction ledger              │
│  - Budget consumption             │  - Ingestion / Deletion            │
│  - Alert state evaluation         │  - Spend aggregation               │
├───────────────────────────────────┴────────────────────────────────────┤
│                         Persistence Engine                             │
│             localStorage ("expense-tracker:budgets",                   │
│                          "expense-tracker:transactions")               │
├────────────────────────────────────────────────────────────────────────┤
│                        Design & Rendering Engine                       │
│    - Design Tokens (CSS Variables in index.css)                        │
│    - Recharts Data Visualizer (SVG / Canvas)                           │
│    - Lucide Iconography                                                │
│    - Apple/Linear Micro-Motion Engine (Hardware Accelerated CSS)       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
Smart-Expense-Tracker/
├── prd.md                     # Product Requirements Document
├── task.md                    # Implementation & QA Checklist
├── rules.md                   # Strict Agent Coding Rules
├── architecture.md            # System Architecture & Data Flow
├── design.md                  # Design Tokens & UI Guidelines
├── package.json               # Root dev configuration
└── app/
    ├── index.html             # Application entry point & meta tags
    ├── package.json           # Runtime dependencies & scripts
    ├── vite.config.ts         # Vite build configuration
    ├── tsconfig.json          # TypeScript workspace configuration
    ├── public/
    │   ├── favicon.svg        # Observatory reticle icon
    │   └── stitch_financial_observatory_terminal/ # Reference artifacts
    └── src/
        ├── main.tsx           # React root mounting
        ├── App.tsx            # Main router and shell layout
        ├── types.ts           # Domain models and TypeScript contracts
        ├── index.css          # Design system tokens and global styles
        ├── context/
        │   ├── BudgetsContext.tsx      # Budget state & mutations
        │   └── TransactionsContext.tsx # Ledger state & mutations
        ├── components/
        │   ├── Navbar.tsx             # Floating glass header & mobile dock
        │   ├── MetricCard.tsx         # KPI telemetry display card
        │   ├── SpendingChart.tsx      # Recharts financial terrain visualizer
        │   ├── CategoryBreakdown.tsx  # Proportional category allocation bars
        │   ├── QuickAddModal.tsx      # Instant transaction entry modal
        │   ├── EmptyState.tsx         # Standardized empty state presentation
        │   └── SystemBadge.tsx        # Status and category indicator tags
        ├── pages/
        │   ├── Landing.tsx            # Editorial marketing hero & visualization
        │   ├── Login.tsx              # Minimal authentication screen
        │   ├── Signup.tsx             # New observer registration screen
        │   ├── Onboarding.tsx         # 3-step setup flow
        │   ├── Dashboard.tsx          # Central telemetry observatory
        │   ├── Budgets.tsx            # Budget control & velocity instruments
        │   ├── Ledger.tsx             # Filterable transaction ledger
        │   ├── Prediction.tsx         # Predictive burn-rate & scenario engine
        │   ├── Settings.tsx           # Preferences & category taxonomy
        │   ├── AddExpense.tsx         # Dedicated transaction logging page
        │   └── TransactionSuccess.tsx # Confirmation screen
        └── utils/
            ├── formatters.ts          # INR currency and date formatting
            ├── analytics.ts           # Run-rate, savings rate, and forecast math
            └── seed.ts                # Deterministic fallback financial data
```

---

## 3. Data Layer & State Management

### 3.1 Domain Models (`types.ts`)
```typescript
export type PaymentMethod = "UPI" | "Credit Card" | "Debit Card" | "Cash";

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  date: string;      // ISO format: YYYY-MM-DD
  createdAt: string; // ISO timestamp: YYYY-MM-DDTHH:mm:ss.sssZ
}

export interface Budget {
  category: string;
  limit: number;
}
```

### 3.2 State Flow
1. **Transactions Lifecycle:**
   - User inputs a transaction via `AddExpense` page or `QuickAddModal`.
   - `TransactionsContext.addTransaction()` generates a UUID (`crypto.randomUUID()`) and appends it to state.
   - State hook automatically syncs to `localStorage.getItem("expense-tracker:transactions")`.
   - `Dashboard`, `Ledger`, and `Budgets` immediately re-render using computed aggregations.
2. **Budgets Lifecycle:**
   - Configured limits are stored in `BudgetsContext`.
   - Budget consumption is derived dynamically by filtering transactions within the active billing cycle matching the category.

---

## 4. Charting & Visualization Layer
- Powered by `recharts` wrapped inside responsive container wrappers.
- Color palette utilizes monotonic gradients (`rgba(255,255,255,0.15)` to `rgba(255,255,255,0.01)`) for clean financial waveforms.
- Custom tooltip component (`ChartTooltip`) renders with blur backing and tabular typography, replacing generic recharts default tooltips.

---

## 5. Styling Architecture
- **Vanilla CSS System:** No runtime CSS-in-JS overhead; zero Tailwind build bloat.
- **Tokens in `:root`:** Unified values for background layers, surface depths, border opacities, and typographic sizing.
- **Glassmorphism:** Layered using `backdrop-filter: blur(16px)` and ultra-subtle borders (`rgba(255, 255, 255, 0.08)`).
- **GPU Acceleration:** All interactive animations utilize `transform` and `opacity` with CSS transitions parameterized by `cubic-bezier(0.22, 1, 0.36, 1)`.

---

## 6. Future Backend Integration Path
While currently running as a local client-first application, the context contracts (`TransactionsContextValue`, `BudgetsContextValue`) are structured so that standard REST or GraphQL endpoints can replace `localStorage` without altering any UI components:
- `fetchTransactions() -> Promise<Transaction[]>`
- `createTransaction(t) -> Promise<Transaction>`
- `updateBudget(category, limit) -> Promise<Budget>`
