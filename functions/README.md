# Firebase Cloud Functions

These Node 20 Firebase Functions v2 callables provide AI parsing, weekly
explanations, and Ask your money. Each callable requires Firebase Auth, uses the
verified Auth UID, checks the per-user `aiEnabled` preference, and applies the
shared server-side quota in `src/ai/rateLimit.ts`. Financial lookups read only
the authenticated user's `users/{uid}/transactions`, `budgets`, or profile.

AI output is schema checked and never written directly to a financial record.
Transaction and goal drafts are returned for client review; the client saves
only after explicit confirmation. Receipt images are sent only to the callable
when the user invokes receipt scanning. Chat tools return scoped summaries or a
small set of recent transaction details, not the full ledger.

Before deployment, set `GEMINI_API_KEY` as a Firebase Functions secret with
`firebase functions:secrets:set GEMINI_API_KEY`. Do not put this key in the web
app's Vite environment or commit it to the repository. Review the configured AI
provider's current data handling terms before enabling the secret in production.

Deploying Cloud Functions for Firebase requires the Firebase project to use the
Blaze pay-as-you-go plan. No billing change or deployment has been performed.
See the [Firebase Functions setup documentation](https://firebase.google.com/docs/functions/get-started).
