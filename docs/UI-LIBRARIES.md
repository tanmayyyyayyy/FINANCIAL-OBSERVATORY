# UI Component Libraries Registry

This document catalogs the integration of third-party animated UI component resources into **Financial Observatory**:
1. **Skiper UI** (`@skiper-ui`)
2. **Vengeance UI** (`@vengeanceui`)
3. **Animmaster Lib** (`animmaster`)

---

## 1. Architectural Foundation & Rules

All three resources are integrated into the existing **React 19 + Vite 8 + Framer Motion 13** architecture without introducing secondary CSS frameworks or breaking changes.

- **Design Philosophy**: Apple × Linear × Raycast — dark monochrome, subtle glassmorphism, restrained micro-interactions, tabular financial precision.
- **Path Aliases**: `@/` maps to `app/src/`.
- **Class Merging**: `app/src/lib/utils.ts` exports standard `cn(...inputs)` combining `clsx` and `tailwind-merge`.
- **Registry Configuration**: `app/components.json` maps official registries for `@skiper-ui` and `@vengeanceui`.
- **Local Source**: All components reside as source files in `app/src/components/ui/` so they can be adapted, themed, and audited.

---

## 2. Skiper UI

- **Source**: [https://skiper-ui.com/](https://skiper-ui.com/)
- **Author**: [@gurvinder-singh02](https://x.com/Gur__vi) ([https://gxuri.me](https://gxuri.me))
- **Installation Method**:
  ```bash
  cd app
  npx shadcn@latest add @skiper-ui/<component-name>
  ```
- **Pro Setup (Optional)**:
  If a Pro license key is available, add to `.env.local`:
  ```bash
  SKIPER_LICENSE_KEY="your-key-here"
  ```
  And update `components.json` with authorization header:
  ```json
  "@skiper-ui": {
    "url": "https://skiper-ui.com/r/{name}.json",
    "headers": {
      "Authorization": "Bearer ${SKIPER_LICENSE_KEY}"
    }
  }
  ```

### Installed Starter Components

| Component | Path | Description | Dependencies |
| :--- | :--- | :--- | :--- |
| `skiper40` (`Link000`–`Link005`) | `src/components/ui/skiper-ui/skiper40.tsx` | Animated navigation links with smooth underline transitions. Adapted for React Router / Vite. | `framer-motion` |
| `skiper3` | `src/components/ui/skiper-ui/skiper3.tsx` | Dynamic pill / toggle interaction with spring layout transition. | `framer-motion` |

### License & Attribution
- **Free Version**: Free to use in personal & commercial projects with attribution comment preserved in source files.
- **Pro Version**: No attribution required.

---

## 3. Vengeance UI

- **Source**: [https://www.vengenceui.com/](https://www.vengenceui.com/)
- **Registry**: `https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/main/public/r/{name}.json`
- **Installation Method**:
  ```bash
  cd app
  npx shadcn@latest add @vengeanceui/<component-name>
  ```

### Installed Starter Components

| Component | Path | Description | Dependencies |
| :--- | :--- | :--- | :--- |
| `animated-number` | `src/components/ui/animated-number.tsx` | Smooth rolling digit ticker for metrics, balances, and savings totals. Includes `AnimatedScore`. | `framer-motion` |
| `animated-button` | `src/components/ui/animated-button.tsx` | Micro-motion button with subtle shine border sweep, spring hover & tap response. | `framer-motion` |
| `glow-border-card` | `src/components/ui/glow-border-card.tsx` | Glassmorphic card with conic gradient border glow effect, customizable color presets. | Vanilla CSS / `@property` |
| `border-beam` | `src/components/ui/border-beam.tsx` | Traveling border beam line effect for highlighting active cards or cards in focus. | Vanilla CSS |

### License & Attribution
- Open-source, shadcn-compatible MIT-style usage. Components are checked directly into the codebase.

---

## 4. Animmaster Lib

- **Source**: [https://animmasterlib.dev/](https://animmasterlib.dev/)
- **Nature of Product**: Proprietary commercial catalog of 300+ animated components.
- **License / PRO Limitations**:
  - Code for PRO components is accessible only upon purchasing a license from animmasterlib.dev.
  - Per project policy, **we do not bypass paywalls or scrape protected source code**.
  - If a team member purchases a PRO license, place the licensed React/Vite component files in `app/src/components/ui/animmaster/`.

### Installed Starter Components

| Component | Path | Description | Dependencies |
| :--- | :--- | :--- | :--- |
| `AnimmasterHoverCard` | `src/components/ui/animmaster/AnimmasterHoverCard.tsx` | Interactive cursor-tracking spotlight spring card, fully accessible and reduced-motion aware. | `framer-motion` |

---

## 5. Components Intentionally NOT Installed (Do NOT Use)

To protect dashboard load times, mobile battery, and the restrained Apple × Linear aesthetic, avoid the following classes of components:

1. **Heavy 3D / WebGL / Shader Components**:
   - Examples: `liquid-metal`, `ascii-glitch-ripple`, `skiper28` (Three.js), `liquid-ocean`.
   - **Reason**: Adds 500kB–1.5MB to client bundle, increases GPU overhead, harms low-power mobile devices.
2. **Alternative Animation Engine Runtimes**:
   - Examples: Components requiring `gsap`, `@gsap/react`, `lenis`, or `anime.js` (e.g. `skiper17`, `skiper30`, `reveal-loader`).
   - **Reason**: The project already standardizes on `framer-motion` (^13.5.1). Introducing GSAP or Lenis creates redundant animation libraries.
3. **Aggressive Distracting Effects**:
   - Examples: Continuous screen glitches, floating cursor trails, neon cyber text.
   - **Reason**: Disrupts financial clarity and readability.

---

## 6. Accessibility & Reduced Motion

Every component integrated must adhere to:
1. **Reduced Motion**: Always check `useReducedMotion()` from `framer-motion` or CSS `@media (prefers-reduced-motion: reduce)` to disable non-essential motion.
2. **Keyboard Navigation**: Buttons and links must support focus rings (`focus-visible:ring-1`) and Enter/Space triggers.
3. **Contrast**: Text and borders must remain legible against `--bg-base` (#040405).
