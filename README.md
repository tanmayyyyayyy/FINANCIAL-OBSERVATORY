# Financial Observatory

> A high-precision personal financial intelligence platform — built with React 19, TypeScript, and Vite.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## Overview

**Financial Observatory** is a fully offline, desktop-first personal finance tracker engineered to feel premium — blending the analytical rigor of institutional financial terminals with the quiet elegance of Apple software and the micro-interaction craft of Linear and Raycast.

All data lives exclusively in your browser's `localStorage`. No backend. No API keys. No cloud leakage.

---

## Screenshots

| Dashboard | Ledger | Budgets |
|:---------:|:------:|:-------:|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Ledger](docs/screenshots/ledger.png) | ![Budgets](docs/screenshots/budgets.png) |

| Prediction Engine | Settings |
|:-----------------:|:--------:|
| ![Prediction](docs/screenshots/prediction.png) | ![Settings](docs/screenshots/settings.png) |

> Add screenshots to `docs/screenshots/` after capturing your local build.

---

## Feature Highlights

- **Spatial Telemetry Dashboard** — Net balance, monthly spend, income, and savings rate in a single glance with animated KPI cards.
- **Financial Terrain Chart** — Recharts-powered smooth area chart of daily cumulative spend vs. expected burn rate.
- **Category Allocation** — Monochromatic proportional bars with real-time percentages.
- **Interactive Ledger** — Real-time search + multi-filter (category, payment rail) across all transactions with instant deletion.
- **Budget Instruments** — Precision velocity gauges with auto-status segmentation: On Track / Approaching Limit / Over Budget.
- **Prediction Engine** — Run-rate extrapolation, confidence scores, and interactive scenario adjustment (+/- discretionary spend).
- **Fast Transaction Entry** — Dedicated `/add-expense` route + inline `QuickAddModal` for sub-5-second logging.
- **Settings & Taxonomy** — Custom category management, notification toggles, JSON data export, and one-click seed reset.
- **Zero Cloud** — All state in `localStorage`. Works completely offline.
- **Fully Responsive** — Optimized for 1440px desktop, 768px tablet, and 390px mobile with a fixed glass bottom nav on mobile.

---

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| Framework | React 19 |
| Language | TypeScript 6 (strict) |
| Build Tool | Vite 8 |
| Routing | React Router 7 |
| Charting | Recharts 3 |
| Icons | Lucide React |
| Styling | Vanilla CSS (Design Token System) |
| Persistence | Browser `localStorage` |

---

## Project Structure

```
Smart-Expense-Tracker/
├── prd.md              # Product Requirements Document
├── architecture.md     # System Architecture & Data Flow
├── design.md           # Design Tokens & UI Guidelines
├── rules.md            # Coding Standards & Agent Rules
├── task.md             # Implementation & QA Checklist
└── app/
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    └── src/
        ├── App.tsx               # Router & shell layout
        ├── types.ts              # Domain models
        ├── index.css             # Design system (CSS variables)
        ├── context/
        │   ├── BudgetsContext.tsx
        │   └── TransactionsContext.tsx
        ├── components/
        │   ├── Navbar.tsx
        │   ├── MetricCard.tsx
        │   ├── SpendingChart.tsx
        │   ├── CategoryBreakdown.tsx
        │   ├── QuickAddModal.tsx
        │   ├── EmptyState.tsx
        │   └── SystemBadge.tsx
        ├── pages/
        │   ├── Landing.tsx
        │   ├── Login.tsx
        │   ├── Signup.tsx
        │   ├── Onboarding.tsx
        │   ├── Dashboard.tsx
        │   ├── Budgets.tsx
        │   ├── Ledger.tsx
        │   ├── Prediction.tsx
        │   ├── Settings.tsx
        │   ├── AddExpense.tsx
        │   └── TransactionSuccess.tsx
        └── utils/
            ├── formatters.ts     # INR currency & date formatting
            ├── analytics.ts      # Run-rate, savings rate, forecast math
            └── seed.ts           # Deterministic fallback data
```

---

## Routes

| Route | Page | Description |
|:------|:-----|:------------|
| `/` | Landing | Editorial marketing hero |
| `/login` | Login | Authentication screen |
| `/signup` | Signup | Registration screen |
| `/onboarding` | Onboarding | 3-step setup flow |
| `/dashboard` | Dashboard | Central telemetry observatory |
| `/budgets` | Budgets | Budget control instruments |
| `/ledger` | Ledger | Transaction ledger & filters |
| `/prediction` | Prediction | Burn-rate & scenario engine |
| `/settings` | Settings | Preferences & category taxonomy |
| `/add-expense` | AddExpense | Dedicated transaction entry |
| `/transaction-success` | TransactionSuccess | Confirmation screen |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/smart-expense-tracker.git
cd smart-expense-tracker

# Install app dependencies
cd app
npm install
```

### Development

```bash
cd app
npm run dev
```

Open http://localhost:5173 in your browser.

### Production Build

```bash
cd app
npm run build
npm run preview
```

---

## Data Model

```typescript
// types.ts
export type PaymentMethod = "UPI" | "Credit Card" | "Debit Card" | "Cash";

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  date: string;       // ISO: YYYY-MM-DD
  createdAt: string;  // ISO: YYYY-MM-DDTHH:mm:ss.sssZ
}

export interface Budget {
  category: string;
  limit: number;
}
```

State is persisted automatically to:
- `localStorage["expense-tracker:transactions"]`
- `localStorage["expense-tracker:budgets"]`

---

## Design System

The entire visual language is driven by CSS custom properties defined in `app/src/index.css`:

- **Background layers:** `--bg-app`, `--bg-surface`, `--bg-surface-2`
- **Border opacity:** `--border-subtle`, `--border-medium`
- **Typography:** Inter (Google Fonts), tabular numerals for financial data
- **Glassmorphism:** `backdrop-filter: blur(16px)` with `rgba(255,255,255,0.08)` borders
- **Motion:** GPU-accelerated via `transform` + `opacity`, eased with `cubic-bezier(0.22, 1, 0.36, 1)`
- **Accent:** `--accent` (#6C8EF5 — restrained indigo)

See `design.md` for the full token reference.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines, commit conventions, and how to submit changes.

---

## License

MIT © Tanmay Jain
