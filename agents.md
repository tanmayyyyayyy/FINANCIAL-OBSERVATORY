# FINANCIAL OBSERVATORY — CREDIT SAVER MODE

You are taking over an existing project previously developed with Codex.

PROJECT:
Financial Observatory / Smart Expense Tracker

REPOSITORY:
tanmayyyyayyy/Smart-Expense-Tracker

IMPORTANT:
This is NOT a new project.
Do NOT rebuild, rewrite, redesign, or replace existing functionality.

Your job is to CONTINUE from the current codebase exactly as it exists.

==================================================
1. CREDIT-SAVER MODE — ALWAYS ON
==================================================

Optimize for minimum AI/tool usage and minimum unnecessary work.

Rules:

- Inspect once, then act.
- Do not repeatedly reread files you already understand.
- Do not repeatedly ask me for confirmation.
- Batch related tasks into one operation.
- Prefer targeted searches over reading entire files.
- Reuse existing components, utilities, hooks, contexts, and design tokens.
- Do not regenerate files unnecessarily.
- Do not create duplicate implementations.
- Do not install packages unless absolutely necessary.
- Do not run unnecessary dev servers.
- Do not repeatedly take screenshots.
- Do not repeatedly run the same build/test unless something changed.
- After a successful validation, do not rerun it without a reason.
- Keep responses short.
- At the end of a task, report only:
  1. What changed
  2. Validation result
  3. Any blocker
- Never explain obvious steps or narrate every command.

Use this priority order:

1. Broken functionality
2. Security/data correctness
3. Architecture
4. Core UX
5. Responsive behavior
6. Motion
7. Visual polish
8. Refactoring

Do not spend credits polishing something while a functional issue exists.

==================================================
2. BEFORE EVERY TASK
==================================================

First inspect only what is necessary.

Read:
- README.md
- relevant documentation
- relevant source files
- existing git status

Do NOT read the entire repository blindly.

If the task is clear from the existing code, execute it immediately.

Do NOT ask me questions if the answer can be determined from the codebase.

==================================================
3. GIT SAFETY
==================================================

NEVER:

- git reset --hard
- git clean
- git checkout -- .
- delete existing work
- overwrite unrelated changes
- force push
- rewrite Git history

Preserve existing work.

Before modifying anything:

git status

After modifications:

git diff --check

Do NOT commit or push unless I explicitly ask.

If I ask you to commit:
- create one clean, meaningful commit
- do not split tiny changes into many commits
- never force push

==================================================
4. CURRENT PROJECT ARCHITECTURE
==================================================

Frontend:

- React
- TypeScript
- Vite
- Tailwind/CSS
- Firebase SDK

Backend:

- Firebase Cloud Functions v2
- Node.js
- TypeScript

Database:

- Firebase Firestore

Authentication:

- Firebase Authentication

AI:

- Gemini through Firebase Cloud Functions
- AI API keys MUST remain server-side
- Never expose Gemini/API keys in frontend

Hosting:

Firebase Hosting

Project:

financial-observatory-1b20e

==================================================
5. AI ARCHITECTURE — DO NOT BREAK
==================================================

All AI requests must go through Firebase Cloud Functions.

Current AI capabilities include:

- parseTransactionText
- scanReceipt
- parseSavingsGoal
- generateWeeklyInsight
- askYourMoney

AI rules:

- API key server-side only
- no hardcoded secrets
- authenticated users only where appropriate
- server-side per-user rate limiting
- AI does NOT directly mutate Firestore financial data
- AI-created transaction/budget/goal requires user confirmation/edit
- deterministic financial calculations remain application code
- AI is used for parsing, explanation, suggestions and intelligence

Never move Gemini calls directly into React/frontend.

==================================================
6. FINANCIAL LOGIC — CRITICAL
==================================================

DO NOT BREAK THIS.

Money In:

profile/onboarding income
+
recorded income transactions

Money Out:

expense transactions

Money Left:

Money In - Money Out

Legacy transactions without `type` are expenses.

Example:

Profile income = ₹5000
Income transaction = ₹2000
Expense = ₹500

Expected:

Money In = ₹7000
Money Out = ₹500
Money Left = ₹6500

Forecasted savings must use the same additive income logic.

Any future financial feature must follow this model.

==================================================
7. FIREBASE SECURITY
==================================================

User data must remain user-scoped.

Current structure includes:

users/{uid}/transactions
users/{uid}/budgets
users/{uid}/categories

Do not weaken Firestore rules.

Never introduce service-account credentials into the frontend.

Never commit:

.env
service account JSON
private keys
API keys
Firebase admin credentials

==================================================
8. EXISTING PRODUCT
==================================================

The application is already a premium financial dashboard.

Existing areas include:

- Landing
- Login
- Signup
- Onboarding
- Dashboard
- Budgets
- Ledger
- Prediction
- Settings
- Add Expense
- Transaction Success
- Ask Your Money
- Goal Planner
- Statement Import
- Command Palette

Existing UX direction:

Apple × Linear × Raycast

Visual language:

- deep black / near-black
- subtle gradients
- glass surfaces
- fine borders
- restrained indigo accents
- clean typography
- tabular financial numbers
- subtle motion
- responsive mobile layouts
- accessibility
- reduced-motion support

Do not replace this design system with a generic dashboard.

==================================================
9. COMPONENT REUSE
==================================================

Before creating a new component:

Search for an existing component that can be reused.

Prefer existing:

- MetricCard
- Navbar
- QuickAddModal
- SpendingChart
- CategoryBreakdown
- AccessibleSelect
- EmptyState
- AskYourMoney
- GoalPlanner
- StatementImport

Reuse existing contexts and utilities whenever possible.

Do not duplicate logic.

==================================================
10. DATA / FINANCIAL SAFETY
==================================================

Never silently change existing financial records.

For financial mutations:

- explicit user action
- predictable validation
- confirmation where AI is involved
- preserve existing data

Never fabricate financial data.

Never use AI to perform arithmetic when deterministic code can do it.

==================================================
11. VALIDATION STRATEGY
==================================================

Use the smallest useful validation.

For a frontend-only change:

- targeted checks
- build only if appropriate

For backend/function changes:

- Functions build

For financial logic:

- run focused financial cases

For broad changes:

- frontend build
- Functions build
- git diff --check

Do not repeatedly run identical validation.

==================================================
12. DEPENDENCIES
==================================================

Do not install packages unless required.

Before adding a package:

1. Check whether existing dependencies can solve the problem.
2. Prefer native/browser/React functionality.
3. Only install if genuinely necessary.

NEVER run:

npm audit fix --force

Do not downgrade Firebase or other dependencies simply to silence audit output.

==================================================
13. FILES / DOCUMENTATION
==================================================

Read existing:

- README.md
- prd.md
- task.md
- rules.md
- architecture.md
- design.md
- CONTRIBUTING.md

Only open the documents relevant to the current task.

Keep documentation synchronized when architecture changes materially.

==================================================
14. AUTONOMOUS WORK STYLE
==================================================

When I give you a task:

1. Understand the goal.
2. Inspect only relevant code.
3. Identify the smallest correct implementation.
4. Implement it.
5. Validate it.
6. Stop.

Do not keep improving unrelated things.

If you discover an unrelated issue:
- do not fix it automatically
- mention it briefly at the end

If a task contains multiple related requirements:
- complete them in one batch
- validate once at the end

==================================================
15. IMPORTANT CURRENT STATE
==================================================

The project has already undergone:

- major UI redesign
- Firebase authentication
- Firestore integration
- Firebase Hosting
- AI architecture
- Firebase Functions foundation
- Gemini integration layer
- AI rate limiting
- Ask Your Money
- receipt scanning
- natural-language transaction parsing
- goal planning
- statement import
- financial insights
- responsive/mobile UX
- accessibility improvements
- motion improvements

Do NOT recreate these systems.

Extend them.

==================================================
16. WHEN SOMETHING IS UNCLEAR
==================================================

First inspect the repository.

Only ask me if:

- a product decision genuinely cannot be inferred
- credentials are required
- deployment/billing approval is required
- there are two materially different interpretations

Otherwise make the safest reasonable implementation.

==================================================
17. DEPLOYMENT / BILLING
==================================================

Do NOT:

- enable Firebase Blaze
- change billing
- deploy Cloud Functions
- configure production secrets

unless I explicitly instruct you to do so.

Firebase Hosting deployment is separate from Functions deployment.

==================================================
18. FINAL RESPONSE FORMAT
==================================================

Always keep the final response concise.

Use:

DONE

Changed:
- ...

Validation:
- ...

Blockers:
- None

If something failed:

BLOCKED

Issue:
- ...

Required action:
- ...

Do not provide long explanations unless I ask.

==================================================
FINAL INSTRUCTION
==================================================

Treat this repository as an existing production-oriented project.

Be conservative.
Be precise.
Use minimum credits.
Make the smallest correct change.
Preserve existing architecture.
Never destroy existing work.
Do not repeatedly inspect or explain.
Finish the task and stop.