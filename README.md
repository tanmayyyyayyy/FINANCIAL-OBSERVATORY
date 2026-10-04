<div align="center">

# FINANCIAL OBSERVATORY

**Where your money stops being a spreadsheet - and becomes a system you can understand.**

A local-first expense tracker for recording transactions, reading spending patterns, setting category budgets, and exploring a simple month-end run-rate projection.

Built as a focused financial workspace: clear telemetry up front, a searchable ledger underneath, and no account connection or cloud service in the middle.

<br />

[Product Preview](#product-preview) • [Architecture](#architecture--tech-stack) • [Design System](#design-system) • [Local Setup](#local-development)

<br />

</div>

---

## The Idea

Recording a purchase is easy. Understanding what a collection of purchases says about your month takes more work. Financial Observatory brings entry, review, budgets, and a lightweight projection into one calm interface, so everyday spending is easier to inspect and act on.

The app runs in your browser. Transactions and budgets are stored in `localStorage`; there is no backend, bank connection, external financial API, or account sync.

## Product Journey

| Observe | Understand |
| --- | --- |
| Dashboard metrics, a 14-day spending view, and category allocation | See totals and category-level spending without leaving the overview |
| Searchable ledger with category and payment-method filters | Find and review individual entries, then remove an entry when needed |

| Control | Forecast |
| --- | --- |
| Category budgets with editable limits and threshold indicators | Compare recorded spend with a simple month-end run-rate projection |
| Quick transaction entry from the navigation and relevant screens | Adjust a scenario slider to see how a spending change affects the projection |

## Financial Intelligence Loop

```text
Record a transaction
  |
  v
Categorize and persist locally
  |
  v
Review dashboard and ledger
  |
  v
Compare spending with budget limits
  |
  v
Explore a run-rate projection
  |
  v
Make a more informed next choice
```

The projection is arithmetic, not AI: it extrapolates a current daily spend rate and lets you apply a scenario adjustment. It does not connect to a bank or learn from external financial history.

## Product Preview

Screenshots are not included in the repository yet. No preview images are linked here, so the README renders cleanly until actual captures are added.

## Key Features

| Capability | What it does |
| --- | --- |
| **Spatial Telemetry Dashboard** | Brings together spending, budget utilization, category breakdown, and recent entries. Income and comparison figures use preset values rather than imported account activity. |
| **Financial Terrain Chart** | Visualizes daily and cumulative spending across the latest 14-day window alongside a reference pace. |
| **Interactive Ledger** | Searches descriptions and categories; filters by category or payment method; sorts by date or amount; and supports transaction deletion. |
| **Budget Instruments** | Shows category spend against configurable limits, with remaining headroom and threshold status. |
| **Prediction Engine** | Projects month-end spend from a daily run rate and lets you adjust the projection with a discretionary-spend slider. The displayed confidence figure is a fixed presentation value, not a statistical confidence calculation. |
| **Fast Transaction Entry** | Adds an expense through a quick-entry modal or the dedicated `/add-expense` route. Entries include amount, category, description, payment method, and date. |
| **Settings & Taxonomy** | Provides profile fields, category controls, preference toggles, JSON export, and a reset to the starter records. Profile, category, and preference controls are currently page-level state rather than persisted settings. |
| **Responsive Experience** | Adapts the application layout and navigation for smaller screens as well as desktop. |
| **Local-First Persistence** | Saves transactions and budgets in browser `localStorage`; initial data is loaded from local storage or the app's starter records. |

## Architecture & Tech Stack

Financial Observatory is a client-rendered React application. Context providers own transaction and budget state and synchronize those records with browser storage. Screens use analytics helpers for derived totals and projections, and formatting helpers for dates and currency.

```text
State and persistence
React pages/components
  | add / read
  v
React Context <---- read / write ----> Browser localStorage
  | transaction + budget state
  v
analytics.ts + formatters.ts
  |
  v
Rendered metrics, charts, and tables
```

| Layer | Technology |
| --- | --- |
| UI | React 19 |
| Language | TypeScript 6 |
| Build and development server | Vite 8 |
| Routing | React Router 7 |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Styling | Vanilla CSS and custom properties |
| Persistence | Browser `localStorage` |

### Project Structure

```text
Smart-Expense-Tracker/
├── README.md
├── architecture.md
├── design.md
├── prd.md
├── CONTRIBUTING.md
├── rules.md
├── task.md
└── app/
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── types.ts
        ├── index.css
        ├── components/
        │   ├── CategoryBreakdown.tsx
        │   ├── EmptyState.tsx
        │   ├── MetricCard.tsx
        │   ├── Navbar.tsx
        │   ├── QuickAddModal.tsx
        │   └── SpendingChart.tsx
        ├── context/
        │   ├── BudgetsContext.tsx
        │   └── TransactionsContext.tsx
        ├── data/
        │   └── screens.ts
        ├── pages/
        │   ├── AddExpense.tsx
        │   ├── Budgets.tsx
        │   ├── Dashboard.tsx
        │   ├── Landing.tsx
        │   ├── Ledger.tsx
        │   ├── Login.tsx
        │   ├── Onboarding.tsx
        │   ├── Prediction.tsx
        │   ├── Settings.tsx
        │   ├── Signup.tsx
        │   └── TransactionSuccess.tsx
        └── utils/
            ├── analytics.ts
            └── formatters.ts
```

### Data Model

The app's current records are intentionally small. A transaction represents an expense entry; the model does not define a separate income transaction type.

```typescript
export type PaymentMethod = "UPI" | "Credit Card" | "Debit Card" | "Cash";

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  date: string;
  createdAt: string;
}

export interface Budget {
  category: string;
  limit: number;
}
```

The contexts persist transactions under `expense-tracker:transactions` and budgets under `expense-tracker:budgets`. If stored JSON cannot be read, each context falls back to its in-app starter records.

## Design System

The visual direction documented in [`design.md`](design.md) treats financial data as an instrument panel: quiet, high contrast, and structured for scanning.

- **Canvas and surfaces:** Deep black application canvas, subtle layered surfaces, and fine dividers.
- **Typography:** Inter with system fallbacks, clear hierarchy, and tabular numerals for financial values.
- **Accent:** Restrained indigo, with separate semantic colors for positive, warning, and negative states.
- **Glass:** Lightly translucent surfaces with blur, used as a depth cue rather than decoration.
- **Motion:** Short transitions with a consistent easing curve; the design specification includes a `prefers-reduced-motion` override.
- **Responsive behavior:** Layouts and navigation adapt to narrow viewports while keeping core data readable.

## Routes

| Path | Screen |
| --- | --- |
| `/` | Landing |
| `/login` | Login screen |
| `/signup` | Signup screen |
| `/onboarding` | Onboarding flow |
| `/dashboard` | Spending overview |
| `/budgets` | Budget controls |
| `/ledger` | Searchable transaction ledger |
| `/prediction` | Run-rate and scenario projection |
| `/settings` | Settings and data tools |
| `/add-expense` | Transaction entry |
| `/transaction-success` | Entry confirmation screen |

The login, signup, and onboarding paths are frontend screens; this repository does not include an authentication backend.

## Local Development

### Requirements

- Node.js 18 or newer
- npm

### Run the app

```bash
git clone https://github.com/tanmayyyyayyy/Smart-Expense-Tracker.git
cd Smart-Expense-Tracker
cd app
npm install
npm run dev
```

Vite prints the local URL when the development server starts, usually `http://localhost:5173`.

To create and preview a production build:

```bash
npm run build
npm run preview
```

## Documentation

- [Architecture](architecture.md) - application layers, state flow, and data handling
- [Design system](design.md) - visual tokens and interface guidance
- [Product requirements](prd.md) - product goals and feature requirements
- [Contributing](CONTRIBUTING.md) - contribution guidance
- [Project rules](rules.md) - repository working conventions
- [Task checklist](task.md) - implementation and QA tracking

## Privacy

Transaction and budget records remain in the browser's `localStorage`; this app does not send them to a service. That also means data is limited to the current browser profile and is not synced or backed up by the app. `localStorage` is not an encrypted vault, so use an appropriate device account and browser profile.

## Project Status

This is a local-first frontend project with working transaction entry, ledger, budgets, dashboard, and run-rate projection screens. It has no published deployment or connected financial data source documented here.

Forecasts are simple estimates based on recorded spend and preset values, not financial advice or AI-generated predictions. Dashboard income and comparison figures, along with the prediction confidence display, are presentation values rather than reconciled or statistically derived account history.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the repository's contribution guidance.

## License

There is no license file in this repository at present. No open-source license is stated here; contact the project maintainer before redistributing the code.
