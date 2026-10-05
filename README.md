<div align="center">

# FINANCIAL OBSERVATORY

**Where your money stops being a spreadsheet — and becomes a system you can understand.**

A telemetry-grade financial workspace for recording transactions, analyzing spending velocity, establishing envelope budgets, projecting month-end cash flow, and interacting with privacy-first AI assistance.

Built with a high-contrast terminal aesthetic: clear telemetry up front, an interactive ledger underneath, real-time Firestore persistence, and serverless Cloud Functions for opt-in Gemini intelligence.

<br />

[Product Features](#key-features) • [Financial Model](#financial-computation-model) • [Architecture](#architecture--tech-stack) • [AI & Privacy](#ai-architecture--security) • [Local Setup](#local-development)

<br />

</div>

---

## The Vision

Recording a purchase is simple. Understanding what a constellation of purchases says about your financial runway takes deeper inspection. Financial Observatory brings transaction logging, category budgets, cash-flow run-rate projections, and AI-assisted financial telemetry into one cohesive, calm interface.

The application combines a reactive single-page client with a serverless Firebase cloud backend. User accounts, transaction ledgers, category budgets, and savings goals are stored in Google Cloud Firestore under strict per-user security rules. Optional artificial intelligence is managed entirely server-side via Firebase Cloud Functions v2, ensuring credentials remain protected and financial calculations remain deterministic.

---

## Financial Computation Model

All core financial metrics, projections, and signals are computed deterministically in application code without AI hallucination.

```text
Money In   = Baseline Monthly Income (Profile / Onboarding) + Recorded Income Transactions
Money Out  = Recorded Expense Transactions
Money Left = Money In − Money Out
```

* **Income Sources:** The baseline income established during onboarding or settings acts as a calibrated monthly baseline. Explicit income transactions (e.g. salary deposits, freelance payments, refunds) are added directly to this baseline.
* **Outflow Tracking:** Every recorded expense deducts from the total capital pool.
* **Legacy Transaction Compatibility:** Any transaction record lacking an explicit `type` attribute defaults deterministically to an `expense`.
* **Savings Rate:** Calculated as `(Money Left / Money In) * 100` whenever `Money In > 0`.
* **Projections:** Month-end forecasting extrapolates the daily spending velocity across the days remaining in the billing period, with an interactive scenario adjustment slider.

---

## Key Features

| Capability | Description |
| :--- | :--- |
| **Spatial Telemetry Dashboard** | High-density overview showing total inflow, outflow, net balance, savings rate, budget utilization, and recent ledger activity. |
| **Financial Terrain Chart** | Interactive 14-day spending waveform visualizer contrasting daily burn rate with average trajectory. |
| **Interactive Ledger** | Searchable by merchant, category, or notes. Filterable by category, payment method, or transaction flow (inflow vs. outflow). Supports record deletion. |
| **Budget Instruments** | Category envelopes with configurable limits, warning thresholds ($\ge 80\%$), critical alerts ($\ge 100\%$), and remaining headroom telemetry. |
| **Prediction Engine** | Mathematical run-rate extrapolation estimating month-end spend with an interactive slider for discretionary delta modeling. |
| **Ask Your Money** | Conversational drawer powered by Gemini 3.8 Flash using read-only tools (`getSpending`, `getBudgetStatus`, `getTrend`, `getTransactions`) to inspect your data. |
| **Quick Add Natural Language** | Single-line natural-language transaction entry (e.g., *"₹450 lunch at Subway on UPI"*) parsed into structured drafts for review. |
| **Multimodal Receipt Scanner** | Client-compressed receipt camera/photo uploads parsed by Gemini into itemized merchant, date, amount, and category drafts. |
| **Goal Planner** | Natural language savings goal generator that derives structured milestones and computes deterministic monthly savings requirements. |
| **Statement Import** | 100% client-side statement processing for CSV and PDF bank files via `pdfjs-dist`. Zero bank statement data is ever sent to AI services. |
| **Deterministic Insights Engine** | Algorithmic signal detection for unusual spikes ($> 2.5\times$ median), duplicate transactions, and recurring billing patterns. |
| **User-Scoped Cloud Sync** | Real-time multi-device synchronization via Cloud Firestore, strictly locked to the authenticated user's UID. |

---

## Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          Browser Client Layer                          │
│        React 19 + TypeScript + Vite 8 + React Router 7 + Recharts      │
├───────────────────────────────────┬────────────────────────────────────┤
│         Firebase Auth SDK         │       Client Firebase SDK          │
│   (Email / Password Sessions)     │    (Firestore Snapshots & HTTPS)   │
└─────────────────┬─────────────────┴──────────────────┬─────────────────┘
                  │                                    │
                  ▼                                    ▼
┌───────────────────────────────────┐┌───────────────────────────────────┐
│       Cloud Firestore             ││    Firebase Cloud Functions v2    │
│  /users/{userId}/transactions     ││       (Node.js 20, TypeScript)    │
│  /users/{userId}/budgets          ││          Region: asia-south1      │
│  /users/{userId}/goals            │├───────────────────────────────────┤
│  Security: request.auth.uid == uid││       Google Gemini 3.8 Flash     │
└───────────────────────────────────┘│   Secret: GEMINI_API_KEY (Backend)│
                                     └───────────────────────────────────┘
```

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 with TypeScript |
| **Build & Tooling** | Vite 8 |
| **Routing** | React Router 7 (Protected Routes with SPA History) |
| **Styling** | Vanilla CSS Design Tokens (Apple Pro / Terminal / Linear dark theme) |
| **Data Visualization** | Recharts 3 + Custom Monotonic SVG Gradients |
| **Authentication** | Firebase Authentication (Email/Password lifecycle) |
| **Cloud Storage** | Google Cloud Firestore (User-scoped document hierarchy) |
| **Serverless Backend** | Firebase Cloud Functions v2 (Node.js 20, TypeScript, `asia-south1`) |
| **AI Engine** | Google Gemini 3.8 Flash (Server-side callable endpoints) |
| **Hosting** | Firebase Hosting (Configured with SPA rewrites to `/index.html`) |

---

## AI Architecture & Security Guardrails

All artificial intelligence features are engineered with strict credit-saving and privacy-first constraints:

1. **Server-Side Isolation:** The browser client never communicates directly with Google Gemini APIs and never holds API keys. All AI calls route through Firebase Cloud Functions HTTPS callables in `asia-south1`.
2. **Secret Management:** The `GEMINI_API_KEY` is maintained securely in Cloud Secret Manager via `defineSecret("GEMINI_API_KEY")`.
3. **Opt-In by Default:** AI features are disabled until explicitly enabled by the user in `/settings` (`aiEnabled: false` by default).
4. **Strict Rate Limiting:** Enforced atomically via Firestore transactions at **20 AI requests per user per 60 minutes**. Exceeded quotas return clean `resource-exhausted` errors.
5. **Data Minimization:**
   * Chat message history is strictly capped at the 8 most recent turns and 1,200 characters per message.
   * Analytical tools return at most 10 transactions and 8 category aggregates.
   * Weekly insights transmit aggregated 7-day category totals rather than itemized transaction histories.
   * Receipts are compressed on an HTML5 canvas to max 1400px and JPEG quality 0.72 ($\le 700\text{ KB}$) before upload.
   * Statement parsing (CSV/PDF) runs entirely in local browser memory via `pdfjs-dist`; no statements are sent to AI.
6. **Human-in-the-Loop Mutation Safety:** The AI **never** writes directly to Firestore financial collections. Every AI action (Quick Add, Receipt Scan, Goal Planner) produces an editable draft that requires explicit user confirmation before committing to the database.
7. **Deterministic Calculation Integrity:** Financial math, balances, savings rates, and run rates are calculated in deterministic TypeScript code, never delegated to generative model outputs.

---

## Project Structure

```text
Smart-Expense-Tracker/
├── README.md                     # Project overview and system specification
├── architecture.md               # Technical architecture and data contracts
├── design.md                     # Design tokens and UI guidelines
├── prd.md                        # Product requirements
├── rules.md                      # Development conventions
├── task.md                       # Implementation and QA checklist
├── firebase.json                 # Firebase Hosting, Functions, and Firestore configuration
├── firestore.rules               # Multi-tenant security rules
├── .firebaserc                   # Firebase project targeting (financial-observatory-1b20e)
├── functions/                    # Serverless Cloud Functions backend
│   ├── package.json              # Node 20 runtime & dependencies
│   ├── tsconfig.json             # TypeScript configuration
│   └── src/
│       ├── index.ts              # Exported HTTPS callable functions
│       └── ai/
│           ├── features.ts       # AI feature endpoints (Ask Your Money, Receipt, etc.)
│           ├── gemini.ts         # Server-side Gemini 3.8 Flash caller with JSON schema
│           ├── rateLimit.ts      # Atomic 20-req/hour Firestore rate limiter
│           └── security.ts       # Auth verification & schema sanitization middleware
└── app/                          # React 19 Single Page Application
    ├── index.html                # Entry point
    ├── package.json              # Client dependencies
    ├── vite.config.ts            # Vite configuration
    ├── tsconfig.json             # Client TypeScript configuration
    └── src/
        ├── main.tsx              # React mounting
        ├── App.tsx               # Route declarations & shell layout
        ├── types.ts              # Core data contracts
        ├── index.css             # Global design tokens and responsive styles
        ├── firebase/             # Client Firebase integration
        │   ├── config.ts         # Environment-backed Firebase initialization
        │   ├── ai.ts             # Cloud Functions HTTPS callable wrappers
        │   └── errors.ts         # Sanitized user-facing error formatting
        ├── context/              # Global state providers
        │   ├── AuthContext.tsx             # Firebase Auth session state
        │   ├── FinancialProfileContext.tsx # User profile & baseline income
        │   ├── TransactionsContext.tsx     # Real-time transaction synchronization
        │   └── BudgetsContext.tsx          # Real-time category budget synchronization
        ├── components/           # Reusable UI instruments & modals
        │   ├── Navbar.tsx            # Desktop header & mobile dock navigation
        │   ├── QuickAddModal.tsx     # Manual & AI natural-language transaction entry
        │   ├── AskYourMoney.tsx      # Slide-in conversational financial assistant
        │   ├── GoalPlanner.tsx       # AI goal parser with deterministic savings target
        │   ├── StatementImport.tsx   # Client-side PDF/CSV statement parser
        │   ├── AccessibleSelect.tsx  # Fully keyboard-accessible combobox
        │   ├── SpendingChart.tsx     # Recharts spending terrain visualizer
        │   ├── CategoryBreakdown.tsx # Proportional allocation bars
        │   ├── MetricCard.tsx        # KPI telemetry card
        │   └── EmptyState.tsx        # Standard empty state presentation
        ├── pages/                # Application routes
        │   ├── Landing.tsx           # Product overview and hero
        │   ├── Login.tsx             # Account sign-in
        │   ├── Signup.tsx            # Account registration
        │   ├── Onboarding.tsx        # Baseline income & budget calibration
        │   ├── Dashboard.tsx         # Central telemetry observatory
        │   ├── Budgets.tsx           # Category budget instruments
        │   ├── Ledger.tsx            # Searchable, filterable transaction table
        │   ├── Prediction.tsx        # Run-rate projection & scenario sandbox
        │   ├── Settings.tsx          # Profile, AI toggle, and data export
        │   ├── AddExpense.tsx        # Dedicated full-page movement logger
        │   └── TransactionSuccess.tsx# Submission receipt confirmation
        └── utils/
            ├── analytics.ts          # Deterministic financial math & run-rates
            ├── insights.ts           # Anomaly, recurring, and duplicate detection
            ├── formatters.ts         # Currency (INR) and date formatters
            └── dialogFocus.ts        # Accessible modal focus containment
```

---

## Data Model

```typescript
export type PaymentMethod = "UPI" | "Credit Card" | "Debit Card" | "Cash" | "Bank Transfer";
export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  date: string;          // ISO date: YYYY-MM-DD
  createdAt: string;     // ISO timestamp
  type?: TransactionType;// Defaults to "expense" if undefined
  isSampleData?: boolean;
}

export interface Budget {
  category: string;
  limit: number;
}

export interface FinancialProfile {
  monthlyIncome: number;
  monthlyBudget: number;
}
```

Firestore documents are partitioned under `/users/{userId}`:
* `/users/{userId}`: Profile baseline income, budget target, and settings (`aiEnabled`).
* `/users/{userId}/transactions/{txId}`: Individual inflow and outflow movements.
* `/users/{userId}/budgets/{budgetId}`: Envelope budget definitions.
* `/users/{userId}/goals/{goalId}`: Financial target milestones.
* `/users/{userId}/aiRateLimits/usage`: Atomic rate-limiting timestamps and counter.

---

## Routes

| Path | Access | Screen | Description |
| :--- | :--- | :--- | :--- |
| `/` | Public | Landing | Overview and feature demonstration |
| `/login` | Public | Login | Firebase email/password sign-in |
| `/signup` | Public | Signup | Account registration |
| `/onboarding` | Protected | Onboarding | 3-step baseline income, category, and budget calibration |
| `/dashboard` | Protected | Dashboard | Core telemetry, KPIs, 14-day spending chart, and category spend |
| `/budgets` | Protected | Budgets | Category budget envelope instruments and alerts |
| `/ledger` | Protected | Ledger | Searchable, filterable transaction ledger with delete actions |
| `/prediction` | Protected | Prediction | Mathematical month-end projection and scenario adjustments |
| `/settings` | Protected | Settings | Account profile, AI consent toggle, and data export |
| `/add-expense` | Protected | Add Movement | Dedicated transaction logging screen (Money In or Money Out) |
| `/transaction-success` | Protected | Confirmation | Transaction commitment receipt screen |

---

## Local Development

### Prerequisites

* Node.js 20 or newer
* npm

### 1. Client Setup (Frontend)

```bash
cd app
npm install
```

Configure `app/.env` (values from your Firebase console, plus the API URL):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:5001
```

Run the frontend development server:

```bash
npm run dev
```

Build and preview the production bundle:

```bash
npm run build
npm run preview
```

### 2. Render Backend API Setup (Server)

```bash
cd server
npm install
```

Configure `server/.env`:

```env
PORT=5001
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_PROJECT_ID=financial-observatory-1b20e
# Optional: Paste full service account JSON or individual email/key
# FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

Run the backend development server:

```bash
npm run dev
```

Compile the production build:

```bash
npm run build
npm start
```

### 3. Deploying on Render

You can deploy the entire stack using Render Blueprints (`render.yaml`) or by creating two services manually:

#### A. Backend: Render Web Service
* **Root Directory:** `server`
* **Runtime:** Node 20
* **Build Command:** `npm install && npm run build`
* **Start Command:** `npm start`
* **Environment Variables:**
  * `NODE_VERSION`: `20`
  * `PORT`: `10000` (Render default)
  * `GEMINI_API_KEY`: *(Render Secret)* Your Google Gemini API key
  * `FIREBASE_PROJECT_ID`: `financial-observatory-1b20e`
  * `FIREBASE_SERVICE_ACCOUNT_JSON`: *(Render Secret)* Your Firebase Admin Service Account JSON string
  * `CLIENT_ORIGIN`: Your Render frontend URL (e.g. `https://financial-observatory-client.onrender.com`)

#### B. Frontend: Render Static Site
* **Root Directory:** `app`
* **Build Command:** `npm install && npm run build`
* **Publish Directory:** `dist`
* **Routes:** Rewrite `/*` to `/index.html` (SPA routing)
* **Environment Variables:**
  * `VITE_API_BASE_URL`: URL of your Render Web Service (e.g. `https://financial-observatory-api.onrender.com`)
  * `VITE_FIREBASE_API_KEY`: Firebase web API key
  * `VITE_FIREBASE_AUTH_DOMAIN`: `financial-observatory-1b20e.firebaseapp.com`
  * `VITE_FIREBASE_PROJECT_ID`: `financial-observatory-1b20e`
  * `VITE_FIREBASE_STORAGE_BUCKET`: `financial-observatory-1b20e.firebasestorage.app`
  * `VITE_FIREBASE_MESSAGING_SENDER_ID`: `994080928480`
  * `VITE_FIREBASE_APP_ID`: `1:994080928480:web:76dd6cf2e383c69285d685`

---

## Privacy & Security Model

* **Multi-Tenant Isolation:** Firestore security rules verify `request.auth.uid == userId` for every read, write, and list query. Cross-account data leakage is blocked at the database engine level.
* **Serverless AI Security:** Google Gemini API keys are never bundled with or sent to the client browser.
* **Consent First:** The generative AI assistant is turned off by default until the user explicitly enables it.
* **Local Parsing:** Bank statements (CSV/PDF) are read locally inside the browser using HTML5 File APIs and PDF.js without sending documents to cloud storage or AI parsing APIs.

---

## License

All rights reserved. Contact the project maintainer for redistribution or licensing inquiries.
