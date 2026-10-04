# Financial Observatory Design System

## 1. Brand Identity
- **Product Name:** Financial Observatory
- **Tagline:** See where your money goes.
- **Design Philosophy:** Minimalist, Precise, Calm, Data-driven, Architectural, Uncompromising.
- **Aesthetic Benchmark:** Apple Pro Software + Linear + Raycast + Institutional Bloomberg Terminal.

---

## 2. Color Palette & Tokens

### 2.1 Surfaces & Depth
| Token | Value | Semantic Intent |
| :--- | :--- | :--- |
| `--bg-base` | `#050505` | Deepest viewport canvas |
| `--bg-app` | `#080808` | Primary application canvas |
| `--surface-1` | `#0E0E0E` | Base card background |
| `--surface-2` | `#141414` | Hovered surface, secondary controls |
| `--surface-3` | `#1A1A1A` | Modals, elevated dialogs, tooltips |
| `--surface-glass` | `rgba(255, 255, 255, 0.03)` | Frosted glass backplates |

### 2.2 Borders & Dividers
| Token | Value | Semantic Intent |
| :--- | :--- | :--- |
| `--border-subtle` | `rgba(255, 255, 255, 0.07)` | Standard structural dividers |
| `--border-strong` | `rgba(255, 255, 255, 0.14)` | Hover borders, active cards |
| `--border-focus` | `rgba(255, 255, 255, 0.35)` | Keyboard focus rings |

### 2.3 Typography & Foreground
| Token | Value | Semantic Intent |
| :--- | :--- | :--- |
| `--text-primary` | `#FFFFFF` | Primary headers, key numbers, active tabs |
| `--text-secondary` | `rgba(255, 255, 255, 0.65)` | Labels, table cells, secondary copy |
| `--text-muted` | `rgba(255, 255, 255, 0.38)` | Microcopy, timestamps, inactive icons |
| `--text-dim` | `rgba(255, 255, 255, 0.22)` | Subtle guide text |

### 2.4 Semantic Accents (Restrained)
| Token | Value | Usage |
| :--- | :--- | :--- |
| `--semantic-pos` | `#10B981` | Inflow, savings surplus, on-track status |
| `--semantic-pos-bg`| `rgba(16, 185, 129, 0.10)` | Positive badge pill background |
| `--semantic-neg` | `#F43F5E` | Outflow, expense debit, over-budget alert |
| `--semantic-neg-bg`| `rgba(244, 63, 94, 0.10)` | Negative badge pill background |
| `--semantic-warn` | `#F59E0B` | Budget 80%+ threshold warning |
| `--semantic-warn-bg`| `rgba(245, 158, 11, 0.10)` | Warning badge pill background |

---

## 3. Typography System

### 3.1 Font Family
```css
font-family:
  "Inter",
  -apple-system,
  BlinkMacSystemFont,
  "SF Pro Display",
  "SF Pro Text",
  "Segoe UI",
  Roboto,
  Helvetica,
  Arial,
  sans-serif;
```
For tabular data & numerals:
```css
font-variant-numeric: tabular-nums;
letter-spacing: -0.02em;
```

### 3.2 Scale & Hierarchy
| Level | Font Size | Line Height | Letter Spacing | Weight |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `56px` (`3.5rem`) | `1.08` | `-0.035em` | `600` |
| **Page Title** | `32px` (`2.0rem`) | `1.15` | `-0.025em` | `600` |
| **Section Header** | `20px` (`1.25rem`) | `1.30` | `-0.015em` | `500` |
| **Large Metric** | `28px` (`1.75rem`) | `1.10` | `-0.030em` | `600` (Tabular) |
| **Body Large** | `16px` (`1.0rem`) | `1.60` | `-0.005em` | `400` |
| **Body Regular** | `14px` (`0.875rem`) | `1.50` | `0` | `400` |
| **Eyebrow / Monospace** | `11px` (`0.6875rem`) | `1.0` | `+0.12em` | `600` (Uppercase) |
| **Micro Caption** | `12px` (`0.75rem`) | `1.40` | `+0.01em` | `400` |

---

## 4. Spacing & Spatial Grid
Base spacing unit: **4px**
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-6`: 24px
- `space-8`: 32px
- `space-12`: 48px
- `space-16`: 64px
- `space-20`: 80px

Max container width: `1280px` centered with dynamic gutter (`16px` mobile, `32px` tablet, `48px` desktop).

---

## 5. Border Radii
- **Small Controls (Buttons, Inputs, Badges):** `8px` – `10px`
- **Cards, Panels, Chart Containers:** `16px` – `18px`
- **Large Modals & Sections:** `20px` – `24px`
- *Strict Rule:* Never use full capsule pill radii for large cards; keep geometric tension crisp.

---

## 6. Glass Surfaces & Atmospheric Depth
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.025);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

### Background Atmosphere
A non-distracting, cinematic dark background:
- Central soft radial gradient (`radial-gradient(circle at 50% 0%, rgba(255,255,255,0.035) 0%, transparent 70%)`)
- Subtle ambient vignette around viewport perimeter.
- Faint microscopic noise texture (0.02 opacity) to eliminate banding.

---

## 7. Motion & Easing Curves

### Easing Function
```css
--ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
```

### Durations
- **Micro-interactions (hover, active press, toggle):** `150ms` – `200ms`
- **Component transitions (dialogs, dropdowns, card lift):** `250ms` – `350ms`
- **Page transitions & Route layout shifts:** `400ms` – `550ms`

### Reduced Motion Override
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 8. Component Specifications

### 8.1 Buttons
- **Primary:** Solid white background (`#FFFFFF`), pure black text (`#000000`), font weight 500, slight scale down on active press (`scale(0.98)`).
- **Secondary:** Surface background (`rgba(255, 255, 255, 0.05)`), subtle border (`rgba(255, 255, 255, 0.1)`), white text.
- **Ghost:** Transparent background, white hover state with subtle background wash.

### 8.2 Form Inputs
- Background: `#101010`
- Border: `1px solid rgba(255, 255, 255, 0.1)`
- Focus: `border-color: rgba(255, 255, 255, 0.4)`, `outline: none`, subtle box-shadow glow.
- Border radius: `8px`.
- Padding: `10px 14px`.

### 8.3 Data Tables (Ledger)
- Header row: Uppercase micro labels, `rgba(255, 255, 255, 0.4)` text, border-bottom `1px solid rgba(255, 255, 255, 0.06)`.
- Body rows: Minimum height `48px`, subtle hover background `rgba(255, 255, 255, 0.03)`, smooth border transitions.

### 8.4 Charts
- Grid lines: `stroke="rgba(255, 255, 255, 0.05)"`, `strokeDasharray="3 3"`.
- Spending line: `stroke="#FFFFFF"`, `strokeWidth={2}`.
- Gradient fill: Linear gradient from `rgba(255, 255, 255, 0.12)` down to `rgba(255, 255, 255, 0.00)`.
- Custom tooltip: Dark blur backing, white values, crisp timestamp.
