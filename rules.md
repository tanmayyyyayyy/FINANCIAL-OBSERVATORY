# Engineering & Design Rules for Future AI Coding Agents

These rules are mandatory guidelines for any engineer or AI agent interacting with the Financial Observatory codebase. They ensure aesthetic excellence, architectural integrity, and production stability.

---

### 1. Never Destroy Existing Working Functionality
All existing routes (`/`, `/login`, `/signup`, `/onboarding`, `/dashboard`, `/budgets`, `/ledger`, `/prediction`, `/settings`, `/add-expense`, `/transaction-success`), contexts, and data models must be preserved. Features must only be enhanced or refined, never deleted without explicit instruction.

### 2. Inspect Before Editing
Always inspect existing types (`types.ts`), contexts (`TransactionsContext`, `BudgetsContext`), and style definitions before making modifications. Never blindly guess file paths or component contracts.

### 3. Reuse Existing Components & Libraries
Do not introduce duplicate UI components or utility functions. Use the existing packages in `package.json` (`lucide-react`, `recharts`, `react-router-dom`). Do not introduce extraneous heavy dependencies (e.g. Tailwind, Framer Motion, Material UI) when clean, modern Vanilla CSS and existing packages fulfill the requirement.

### 4. Zero Unnecessary Dependencies
Every new dependency requires clear justification. If an animation, tooltip, or layout can be implemented cleanly with standard CSS and React primitives, do so natively.

### 5. Do Not Hardcode Secrets or Expose Keys
Never embed API keys, secret credentials, or confidential endpoints in the source code or commit history.

### 6. Keep TypeScript Strict
Do not use `any` types. Ensure all state, component props, and event handlers are fully typed. The repository must compile cleanly with `tsc -b` at all times without warnings.

### 7. Modular Component Architecture
Avoid sprawling multi-thousand line files where components are crammed together. Separate pages, layouts, shared navigation, and UI atoms into logical subdirectories (`components/`, `pages/`, `utils/`).

### 8. Strict Adherence to Design Tokens
All colors, spacing, borders, and typography must reference the centralized CSS custom properties in `index.css` (e.g. `var(--bg)`, `var(--surface-1)`, `var(--border-subtle)`, `var(--text-primary)`). Never hardcode random hex colors or arbitrary spacing numbers.

### 9. Never Randomly Change the Visual Language
The product identity is "Financial Observatory" — a monochrome, near-black, high-precision financial instrument. Do not introduce neon accents, rainbow charts, cartoonish icons, or generic SaaS gradients.

### 10. Semantic Color Usage Only
The interface is strictly monochrome with rare, restrained semantic accents:
- **Positive / Inflow / On-Track:** Soft emerald/mint (`#10b981` / `rgba(16, 185, 129, 0.8)`)
- **Negative / Outflow / Over-Budget:** Muted crimson/coral (`#f43f5e` / `rgba(244, 63, 94, 0.8)`)
- **Attention / Warning:** Restrained amber (`#f59e0b` / `rgba(245, 158, 11, 0.8)`)
Avoid screaming red or radioactive lime.

### 11. Respect Reduced Motion
Always implement `@media (prefers-reduced-motion: reduce)`. Disable translational shifts, complex spring oscillations, and high-frequency animations for users requesting reduced motion.

### 12. Test After Every Meaningful Change
Run `npm run build` (which includes `tsc -b && vite build`) to verify that no compilation breaks or syntax regressions were introduced.

### 13. Do Not Rewrite Unrelated Files
Keep diffs tightly scoped to the task at hand. Do not modify files outside the direct responsibility of the feature being worked on.

### 14. Keep Changes Focused & Atomic
Implement changes in coherent, well-structured batches. Do not jump between unrelated components without completing the active module.

### 15. Real Project Data Over Fake Data
Always connect components to real application state in `TransactionsContext` and `BudgetsContext`. Fall back to seed data only when `localStorage` is empty. Never display hardcoded mock values where reactive context data exists.

### 16. Never Remove Existing Routes
All routes defined in `App.tsx` are canonical contracts. If a route exists, redesign its page view while preserving its URL path and parameter conventions.

### 17. Do Not Overwrite User Changes
Respect intentional modifications made by the user. If a conflict arises, preserve user preferences and merge non-destructively.

### 18. Avoid Duplicate Components
Do not create two versions of a button, card, or modal. Consolidate variations into parameterized props on standard primitives.

### 19. Maintain Clean Console Logs
Remove all debugging `console.log` statements before finishing tasks. Ensure zero runtime errors, zero undefined warnings, and zero unhandled promises.

### 20. Keep Documentation Updated
When modifying core architecture or introducing significant tokens, update `architecture.md`, `design.md`, and `task.md` accordingly.
