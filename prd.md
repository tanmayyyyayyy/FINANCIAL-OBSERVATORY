# Product Requirements Document

**Product:** Smart Expense Tracker / Financial Observatory  
**Current Product Identity:** Financial Observatory  
**Version:** 2.0.0 (Production Redesign)  
**Status:** Architecture & UI/UX Transformation  

---

## 1. Product Vision
Financial Observatory is a high-precision, desktop-first, fully responsive personal financial intelligence platform designed for individuals who demand complete clarity and control over their capital allocation. Blending the analytical rigor of institutional financial terminals with the quiet elegance of modern Apple software and the refined micro-interaction quality of Raycast and Linear, Financial Observatory transforms mundane expense recording into continuous spatial awareness of one's financial trajectory.

---

## 2. Problem Statement
Most personal expense management software suffers from two extremes:
1. **Overly gamified consumer apps:** Cluttered with cartoonish mascots, rainbow progress bars, aggressive notification badges, and invasive third-party cross-selling.
2. **Clunky legacy spreadsheets or developer prototypes:** Brittle, visually uninspiring, poorly optimized for mobile, and lacking meaningful predictive intelligence.

Users lack an intentional, distraction-free environment that treats financial data with architectural dignity, provides instant telemetry on spending velocity, and forecasts cash burn with quiet analytical confidence.

---

## 3. Target Users
- **Disciplined Professionals & Builders:** Developers, designers, founders, and knowledge workers who appreciate minimalist, high-craft software aesthetics (Linear, Raycast, Apple).
- **Capital Allocators & Modern Earners:** Individuals managing multiple payment channels (UPI, Credit Cards, Debit Cards, Cash) seeking instant reconciliation without noise.
- **Data-Minded Planners:** Users who want forward-looking predictive telemetry rather than backward-looking guilt trips.

---

## 4. Core User Journeys
1. **Observatory Ingestion (Capture):** Quickly log a financial outflow with merchant, payment method, category, and date in < 5 seconds via a hotkeyable or instant form.
2. **Spatial Telemetry (Dashboard):** Scan monthly spending velocity, net balance, savings rate, and category allocation against budgets in a single glance.
3. **Audit & Reconciliation (Ledger):** Search, filter, and inspect granular transactions across time, category, and payment rails with immediate inline deletion and feedback.
4. **Instrument Calibration (Budgets):** Set category spending limits and monitor consumption gauges before thresholds are breached.
5. **Predictive Projection (Intelligence):** Review algorithmic projections of month-end expenditure and confidence intervals based on run-rate and historical velocity.
6. **System Customization (Settings):** Manage custom category taxonomy, alert toggles, currency standards, and data export/reset.

---

## 5. Features Matrix
| Feature Area | Key Capabilities | Priority |
| :--- | :--- | :--- |
| **Global Navigation** | Desktop floating glass header, active route glow, responsive mobile bottom bar | P0 |
| **Unified Telemetry** | High-contrast KPI cards (Net Balance, Monthly Spend, Monthly Income, Savings Rate) | P0 |
| **Financial Terrain Chart** | Recharts-powered smooth interactive spending curves, area fills, custom tooltip | P0 |
| **Category Distribution** | Monochromatic proportional bars, percentage breakdowns, hover details | P0 |
| **Interactive Ledger** | Real-time search, multi-filter (category, payment rail), date sorting, row actions | P0 |
| **Budget Instruments** | Visual velocity gauges, limit editor, contextual threshold alerts | P0 |
| **Prediction Engine** | Run-rate extrapolation, confidence indices, variance heuristics | P0 |
| **Fast Transaction Entry** | Rapid entry modal/route with autofocus, numeric precision, and validation | P0 |
| **Context Persistence** | LocalStorage backed state for budgets and transactions with seed fallback | P0 |
| **System Settings** | Category lifecycle, alert preferences, data export/reset controls | P1 |

---

## 6. Dashboard Requirements
- **Greeting & System Status:** Contextual greeting ("Good evening, Tanmay"), current date/time telemetry, live status indicator.
- **Top Metrics Grid:** 4 key indicators featuring large tabular numerals, delta comparisons against previous cycle (+8.4% vs last month), and micro labels.
- **Dominant Chart Visual:** Smooth monochrome/accent area chart displaying daily cumulative spending vs expected linear burn rate.
- **Category Allocation:** Horizontal proportional bars displaying top spend categories with real-time percentages and totals.
- **Ledger Snippet:** Recent 5 transactions with merchant description, category badge, payment rail, timestamp, and signed currency amounts.
- **Forward Horizon Card:** Concise analytical forecast card linking directly to the Prediction Engine.

---

## 7. Budget Requirements
- **Financial Instrument Representation:** Budgets styled as precision gauge instruments rather than generic progress bars.
- **Status Segmentation:** Automatic categorization into `On Track` (<70%), `Approaching Limit` (70–99%), and `Over Budget` (≥100%).
- **Interactive Limit Calibration:** Ability to edit category limits inline or via a dedicated control without resetting transactions.
- **Summary Metrics:** Total monthly budget envelope, total utilized, remaining capital, and overall utilization index.

---

## 8. Ledger Requirements
- **Comprehensive Data Table:** Columns for Transaction / Merchant, Category, Payment Method, Date, Amount, and Actions.
- **Dynamic Search & Filtering:** Filter by text query across description and category; filter by payment method (`UPI`, `Credit Card`, `Debit Card`, `Cash`).
- **Transaction Deletion:** Instant optimistic removal with contextual confirmation.
- **Empty States:** Atmospheric, non-jarring empty state with clear calls to action when filters yield no matches.
- **Direct Entry Trigger:** Primary CTA to open Transaction Entry directly from the ledger header.

---

## 9. Prediction Requirements
- **Analytical Presentation:** Rigorous run-rate calculation based on elapsed days in current billing cycle projected to end-of-month.
- **Confidence Telemetry:** Computed confidence score based on transaction frequency and variance.
- **Scenario Projection:** Interactive scenario adjustment (e.g., standard pace, 10% discretionary reduction, 15% acceleration).
- **Behavioral Insights:** Clear analytical callouts (e.g. "Dining represents 38% of discretionary burn rate").

---

## 10. Settings Requirements
- **Personal Profile:** Display user profile name and email address with persistence.
- **Taxonomy Management:** Add new spending categories; remove custom categories (with validation against in-use items).
- **Notification & Intelligence Toggles:** Toggle spending velocity alerts and weekly summaries.
- **Data Portability:** Export transaction and budget history as structured JSON; one-click reset to pristine seed data.

---

## 11. Responsive Requirements
- **1440px / 1280px Desktop:** Wide multi-column observatory layout with expansive whitespace and side-by-side analytical modules.
- **1024px / 768px Tablet:** 2-column adaptive grid, collapsible controls, full-width charts.
- **390px / 375px Mobile:** Ergonomic single-column flow, horizontal swipeable KPI metrics, cards replacing tables, fixed bottom glass navigation bar.

---

## 12. Accessibility Requirements
- **Color Contrast:** All text meets or exceeds WCAG 2.1 AA contrast ratio (minimum 4.5:1 for body, 3:1 for large typography against dark surfaces).
- **Keyboard Navigation:** Full focus ring visibility, semantic buttons, accessible ARIA attributes on modals and toggles.
- **Motion Accessibility:** Strict adherence to `prefers-reduced-motion` media queries, disabling transform translations and scale animations.

---

## 13. Performance Requirements
- **Initial Paint:** Under 300ms on modern desktop browsers.
- **Client Bundle Size:** Keep gzipped bundle < 150KB.
- **Frame Rate:** Constant 60fps for UI transitions, chart hover states, and modal appearances.

---

## 14. Non-Functional Requirements
- **Zero Cloud Leakage:** All financial data stored locally in browser `localStorage`.
- **Strict TypeScript:** Zero TypeScript errors with strict typing for all domain models.
- **Zero Runtime Console Errors:** Clean console during standard navigation and state mutation flows.

---

## 15. Future Features
- Multi-currency conversion engine with live FX rates.
- CSV / Bank statement OFX/QIF parser.
- Encrypted biometric unlock via WebAuthn.
- Multi-month trend archive and year-in-review observatory.

---

## 16. Success Criteria
- The application looks and feels like an elite, commercial-grade financial tool worthy of launch.
- Design achieves complete visual coherence matching the `#050505` monochrome aesthetic with subtle glassmorphism and restrained micro-motion.
- All existing routes, features, contexts, and business logic remain fully functional.
