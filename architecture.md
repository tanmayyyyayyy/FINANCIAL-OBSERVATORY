# Application Architecture Specification

**Product:** Smart Expense Tracker / Financial Observatory<br />
**Runtime:** Client-Side Single Page Application (SPA) + Render Web Service Backend<br />
**Frontend Toolchain:** React 19 + TypeScript + Vite 8 + React Router 7 + Recharts 3 (Render Static Site)<br />
**Backend Toolchain:** Node.js 20 + TypeScript + Express (Render Web Service)<br />
**Database & Auth:** Google Cloud Firestore + Firebase Authentication<br />
**AI Engine:** Google Gemini 3.8 Flash (Server-Side Express HTTP API via Secret GEMINI_API_KEY)<br />

---

## 1. High-Level System Architecture

Financial Observatory operates as an intelligent, privacy-conscious Single Page Application deployed on Render, backed by Google Firebase Authentication and Cloud Firestore. All user data is multi-tenant partitioned and secured at the database layer via Cloud Firestore security rules. Opt-in AI capabilities route exclusively through a dedicated Node.js/TypeScript Express service on Render, protecting secrets, enforcing rate limits, verifying Firebase ID tokens, and maintaining human-in-the-loop validation for financial data.

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                  Browser Client Layer                                  │
│                 Render Static Site: React 19 + TypeScript + Vite 8                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                     React Router 7                                     │
│          (/, /login, /signup, /onboarding, /dashboard, /budgets, /ledger, ...)         │
├──────────────────────┬────────────────────────┬───────────────────┬────────────────────┤
│     AuthContext      │ FinancialProfileContext│TransactionsContext│   BudgetsContext   │
│  - User credentials  │ - Monthly baseline inc │ - Ledger entries  │ - Category limits  │
│  - Session state     │ - Target budget        │ - Inflow / Outflow│ - Envelope usage   │
│  - Protected routes  │ - AI opt-in setting    │ - Real-time sync  │ - Threshold alerts │
├──────────────────────┴────────────────────────┴───────────────────┴────────────────────┤
│                                Client-Side Engines                                     │
│  - Deterministic Financial Math & Run-Rate Forecasting (analytics.ts)                 │
│  - Rule-Based Anomaly, Recurring & Duplicate Detection (insights.ts)                  │
│  - Local PDF/CSV Statement Parser (pdfjs-dist / HTML5 File API)                       │
│  - Apple Pro / Terminal Design System & Reduced-Motion Handlers (index.css)            │
└──────────────────────────────┬───────────────────────────────────┬─────────────────────┘
                               │                                   │
                     Client Firebase SDK             Authorization: Bearer <ID Token>
                               │                                   │
                               ▼                                   ▼
┌──────────────────────────────────────────────┐┌────────────────────────────────────────┐
│            Google Cloud Firestore            ││           Render Web Service           │
│  /users/{userId} (Profile & AI consent)      ││       (Node.js 20, TypeScript, Express)│
│  /users/{userId}/transactions (Movements)    │├────────────────────────────────────────┤
│  /users/{userId}/budgets (Category limits)   ││  Security & Governance Pipeline:       │
│  /users/{userId}/goals (Savings milestones)  ││  1. Firebase Admin verifyIdToken()     │
│  /users/{userId}/aiRateLimits (Quota track)  ││  2. requireAiEnabled Firestore check   │
│                                              ││  3. Atomic 20 req/60 min rate limiter  │
│  Security Rules:                             ││  4. Strict JSON Schema sanitization    │
│  allow read, write: if request.auth != null  │├────────────────────────────────────────┤
│    && request.auth.uid == userId;            ││        Google Gemini 3.8 Flash         │
│                                              ││   Render Secret: GEMINI_API_KEY        │
└──────────────────────────────────────────────┘└────────────────────────────────────────┘
```

---

## 2. Directory Structure

```text
Smart-Expense-Tracker/
├── README.md                          # Project overview and user documentation
├── architecture.md                    # Technical architecture & contracts specification
├── design.md                          # Visual design tokens and UI guidelines
├── prd.md                             # Product requirements document
├── rules.md                           # Development rules and coding standards
├── task.md                            # Implementation and QA checklist
├── firebase.json                      # Firebase Hosting, Functions, and Firestore configuration
├── firestore.rules                    # Multi-tenant security rules
├── .firebaserc                        # Firebase target project mapping
├── functions/                         # Serverless backend (Node.js 20, TypeScript)
│   ├── package.json                   # Dependencies: firebase-admin, firebase-functions
│   ├── tsconfig.json                  # Functions compiler options
│   └── src/
│       ├── index.ts                   # Exported HTTPS callable endpoints
│       └── ai/
│           ├── features.ts            # Implementations for Ask, QuickAdd, Receipt, Goals
│           ├── gemini.ts              # Gemini 3.8 Flash caller with strict JSON schemas
│           ├── rateLimit.ts           # Per-user 20 req/60 min atomic rate limiting
│           └── security.ts            # Authentication and consent validation middleware
└── app/                               # Frontend Single Page Application
    ├── index.html                     # HTML5 entry with viewport meta tags
    ├── package.json                   # Client dependencies: React 19, Recharts, Framer Motion
    ├── vite.config.ts                 # Vite 8 bundler configuration
    ├── tsconfig.json                  # Workspace TypeScript configuration
    └── src/
        ├── main.tsx                   # React root mount
        ├── App.tsx                    # Route definitions and shell layout
        ├── types.ts                   # Core domain data models
        ├── index.css                  # Design system tokens and global styles
        ├── firebase/                  # Client Firebase integration
        │   ├── config.ts              # Firebase app, auth, db, and functions initialization
        │   ├── ai.ts                  # Typed HTTPS callable wrappers for Cloud Functions
        │   └── errors.ts              # User-facing error message sanitizers
        ├── context/                   # Global React state providers
        │   ├── AuthContext.tsx        # Firebase Auth lifecycle and state
        │   ├── FinancialProfileContext.tsx # User baseline income and target budget
        │   ├── TransactionsContext.tsx# Real-time transaction state and Firestore sync
        │   └── BudgetsContext.tsx     # Real-time category budget envelopes
        ├── components/                # Modular UI instruments and modals
        │   ├── Navbar.tsx             # Sticky header & mobile dock navigation
        │   ├── QuickAddModal.tsx      # Manual & AI natural-language transaction entry
        │   ├── AskYourMoney.tsx       # Conversational financial assistant drawer
        │   ├── GoalPlanner.tsx        # Savings goal parser with deterministic targets
        │   ├── StatementImport.tsx    # Client-side PDF and CSV statement parser
        │   ├── AccessibleSelect.tsx   # WCAG-compliant combobox selector
        │   ├── SpendingChart.tsx      # Recharts financial terrain visualizer
        │   ├── CategoryBreakdown.tsx  # Proportional category allocation bars
        │   ├── MetricCard.tsx         # KPI telemetry display card
        │   └── EmptyState.tsx         # Standardized empty state presentation
        ├── pages/                     # Application routes
        │   ├── Landing.tsx            # Marketing overview and visual demo
        │   ├── Login.tsx              # Email/password authentication
        │   ├── Signup.tsx             # New observer registration
        │   ├── Onboarding.tsx         # 3-step baseline calibration flow
        │   ├── Dashboard.tsx          # Central telemetry observatory
        │   ├── Budgets.tsx            # Category envelope instruments
        │   ├── Ledger.tsx             # Searchable, filterable transaction table
        │   ├── Prediction.tsx         # Run-rate burn projection and scenario modeler
        │   ├── Settings.tsx           # Profile settings, AI toggle, and data export
        │   ├── AddExpense.tsx         # Dedicated movement logging page
        │   └── TransactionSuccess.tsx # Confirmation receipt screen
        └── utils/                     # Deterministic algorithmic helpers
            ├── analytics.ts           # Financial equations, forecast math, and aggregates
            ├── insights.ts            # Anomaly, duplicate, and recurring charge detection
            ├── formatters.ts          # INR currency and date formatting
            └── dialogFocus.ts         # Focus trapping for accessible modals
```

---

## 3. Data Layer & Core Financial Model

### 3.1 Domain Contracts (`types.ts`)

```typescript
export type PaymentMethod = "UPI" | "Credit Card" | "Debit Card" | "Cash" | "Bank Transfer";
export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  date: string;          // ISO format: YYYY-MM-DD
  createdAt: string;     // ISO timestamp
  type?: TransactionType;// Defaults to "expense" if undefined (legacy compatibility)
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

### 3.2 The Deterministic Financial Equation

Financial telemetry is computed through pure, deterministic arithmetic in `app/src/utils/analytics.ts` to ensure consistency:

```text
Money In   = Profile Baseline Monthly Income + Recorded Income Transactions
Money Out  = Recorded Expense Transactions
Money Left = Money In − Money Out
```

* **Baseline Income:** Recorded during onboarding and stored in `users/{userId}.monthlyIncome`. Provides an ongoing calibration baseline for users who do not log individual income transactions.
* **Income Transactions:** Discrete inflows (`type: "income"`) such as salary deposits, bonuses, or refunds are added directly to the baseline income.
* **Expense Transactions:** Outflows (`type: "expense"` or legacy records where `type === undefined`) deduct from the total capital pool.
* **Savings Rate:** Computed as `(Money Left / Money In) * 100` when `Money In > 0`.
* **Month-End Forecast:** Calculated by projecting current spending velocity across remaining calendar days: `(currentSpend / elapsedDays) * totalDaysInMonth`.

---

## 4. AI Architecture & Security Pipeline

All artificial intelligence capabilities utilize Google Gemini 3.8 Flash via a strictly governed serverless architecture.

```text
User Request (React Client)
   │
   ▼
Firebase Cloud Function (asia-south1)
   │
   ├── 1. Verify request.auth.uid (Reject if unauthenticated)
   ├── 2. Check users/{uid}.aiEnabled == true in Firestore (Reject if opted out)
   ├── 3. Atomic Transaction on users/{uid}/aiRateLimits (Limit: 20 req / 60 min)
   ├── 4. Input Length & Structure Validation
   │
   ▼
Google Generative Language REST API (Gemini 3.8 Flash)
   │ (Header: x-goog-api-key: GEMINI_API_KEY from Cloud Secret Manager)
   │
   ▼
Output Validation against Strict JSON Schema
   │
   ▼
Return Structured Proposal Draft to Client
   │
   ▼
Human Review UI (Explicit "Confirm & Save" Required)
   │
   ▼
Commit to Cloud Firestore
```

### 4.1 AI Governance Rules
1. **Server-Side Exclusivity:** No client code connects directly to Gemini APIs. The `GEMINI_API_KEY` is kept in Cloud Secret Manager.
2. **Opt-In Mandate:** Generative features remain dormant until the user enables `aiEnabled: true` in `/settings`.
3. **Atomic Rate Limiter:** Per-UID usage records track call timestamps inside a Firestore transaction. Exceeding 20 calls within 60 minutes aborts with an HttpsError `resource-exhausted`.
4. **Data Minimization:**
   * Conversation history in `Ask Your Money` is truncated to 8 turns and 1,200 characters per message.
   * Internal tool outputs are restricted to 10 transactions and 8 category summaries.
   * Weekly insights aggregate 7-day category totals; itemized transaction logs are omitted.
   * Receipts are downscaled client-side on an HTML5 canvas to max 1400px and JPEG quality 0.72 ($\le 700\text{ KB}$) prior to transmission.
   * Bank statements (PDF/CSV) are parsed entirely in client memory using `pdfjs-dist`; raw statements are never transmitted to AI endpoints.
5. **Mutation Safety (Zero Direct AI Writes):** The AI engine is strictly incapable of modifying financial documents directly. All generative operations yield structured drafts that must be confirmed by the user before committing to Firestore.

---

## 5. Security & Multi-Tenant Isolation

### 5.1 Firestore Rules
Security is enforced at the database layer via [firestore.rules](file:///Users/tanmayjain/Desktop/Smart-Expense-Tracker/firestore.rules):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, create, update, delete: if request.auth != null
        && request.auth.uid == userId;

      match /{document=**} {
        allow read, write: if request.auth != null
          && request.auth.uid == userId;
      }
    }
  }
}
```
* Every document read, query, and write enforces `request.auth.uid == userId`.
* Unauthenticated callers receive immediate permission denials.
* Cross-tenant enumeration and data leakage are structurally impossible.

---

## 6. Visualization & Design System

* **Styling Architecture:** High-contrast Vanilla CSS with CSS custom properties declared in `:root` inside [index.css](file:///Users/tanmayjain/Desktop/Smart-Expense-Tracker/app/src/index.css).
* **Color Palette:** Pure black canvas (`#040405`), subtle tiered surfaces (`#070708`, `#0e0e10`), restrained borders (`rgba(255, 255, 255, 0.055)`), and semantic accents for positive inflow (`#10b981`), negative outflow (`#f43f5e`), and budget warnings (`#f59e0b`).
* **Micro-Motion & Accessibility:**
  * Animated with Framer Motion, with full compliance for `prefers-reduced-motion: reduce`.
  * CSS global rule zeroes transitions and animations when reduced motion is requested (`animation-duration: 0.001ms !important`).
  * Modal dialogs and sliding drawers implement accessible focus containment via `containDialogFocus`.
  * Custom controls implement WCAG ARIA attributes (`combobox`, `listbox`, `option`, `aria-expanded`, `aria-activedescendant`).

---

## 7. Deployment Specification

* **Static Assets:** Hosted via Firebase Hosting from `app/dist` with single-page application URL rewrites routing all paths (`**`) to `/index.html`.
* **Cloud Functions:** Deployed to region `asia-south1` running on the Node.js 20 runtime with automated predeploy TypeScript compilation.
