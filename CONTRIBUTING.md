# Contributing to Financial Observatory

Thank you for your interest in contributing. This document outlines guidelines for working with this codebase.

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- A modern browser (Chrome / Firefox / Safari)

---

## Development Setup

```bash
git clone https://github.com/your-username/smart-expense-tracker.git
cd smart-expense-tracker/app
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

---

## Coding Standards

### TypeScript

- **Strict mode is required.** `tsconfig.json` enforces `strict: true`. Do not add `// @ts-ignore` suppressions.
- All domain models live in `src/types.ts`. Add new types there; do not inline them in components.
- Prefer explicit return types on functions that are non-trivial.

### React

- Use **functional components** with hooks exclusively. No class components.
- State that needs to persist across routes belongs in `context/`. Local-only UI state stays inside the component.
- Never mutate context state directly — always call the provided mutation functions (`addTransaction`, `setBudgets`, etc.).

### CSS

- The design system lives in `src/index.css` as CSS custom properties (`--bg-app`, `--accent`, etc.).
- **Do not use inline styles for design values.** Reference tokens via `var(--token-name)`.
- Do not add Tailwind, CSS-in-JS, or additional CSS frameworks.
- All animations must respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    /* disable transforms / transitions */
  }
  ```

### File Naming

| Type | Convention | Example |
|:-----|:-----------|:--------|
| Components | PascalCase | `MetricCard.tsx` |
| Pages | PascalCase | `Dashboard.tsx` |
| Utilities | camelCase | `formatters.ts` |
| Context | PascalCase + `Context` suffix | `BudgetsContext.tsx` |

---

## Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(scope): <short description>
```

**Types:**

| Type | When to use |
|:-----|:------------|
| `feat` | New feature or user-visible capability |
| `fix` | Bug fix |
| `style` | CSS / visual changes only, no logic change |
| `refactor` | Code restructure without behavior change |
| `docs` | Documentation updates only |
| `chore` | Build config, deps, tooling changes |
| `perf` | Performance improvements |

**Examples:**

```
feat(ledger): add payment method filter chips
fix(budgets): correct utilization percentage for over-budget categories
style(dashboard): tighten KPI card spacing on mobile
docs: update README with screenshot table
```

---

## Pull Request Guidelines

1. **Branch naming:** `feat/short-description`, `fix/issue-description`, `docs/update-readme`
2. **One concern per PR** — avoid bundling unrelated changes.
3. Before submitting, run:
   ```bash
   cd app
   npm run lint
   npm run build
   ```
   Both must pass with zero errors.
4. Do not modify `prd.md`, `architecture.md`, `design.md`, or `rules.md` unless the change specifically updates the product specification.

---

## Architecture Rules (Non-Negotiable)

- **No backend.** All data must remain in `localStorage`. Do not introduce `fetch` calls to external APIs.
- **No new runtime dependencies** without a clear, justified need. The bundle must stay lean.
- **No redesigns.** Visual changes must work within the existing design token system (`index.css`). Do not override `--bg-app`, `--accent`, or core surface tokens globally.
- **Preserve all existing routes.** Every route listed in `App.tsx` must continue to render correctly.

---

## Running Lint & Build

```bash
# Lint
cd app && npm run lint

# Type-check + production build
cd app && npm run build
```

---

## Data Reset During Development

If your `localStorage` state becomes corrupted during development, open **Settings → Reset Data** in the running app, or clear storage manually:

```javascript
// Browser DevTools console
localStorage.removeItem("expense-tracker:transactions");
localStorage.removeItem("expense-tracker:budgets");
location.reload();
```

The app will fall back to deterministic seed data from `src/utils/seed.ts`.

---

## Questions

Open a GitHub Issue with the label `question` for any architectural questions before making significant changes.
