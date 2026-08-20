# 🎨 Design System & UI Architecture

> Visual design language, component library, and interaction patterns for the Export Cost Indicator portal.

---

## 1. Design Philosophy

The application follows a **premium dark-mode glassmorphism** aesthetic designed to feel sophisticated and data-rich while remaining approachable for non-technical MSME exporters.

**Core principles:**
- **Dark-first**: Deep slate backgrounds eliminate eye strain during extended cost analysis sessions
- **Glassmorphism**: Semi-transparent cards with backdrop blur create visual depth and layering
- **Data density**: KPI cards, data tables, and gauge visualizations present complex information clearly
- **Progressive disclosure**: The 6-step calculator wizard reveals complexity gradually
- **Offline-resilient**: All UI states (loading, empty, error) are gracefully handled with seed data fallbacks

---

## 2. Design Token System

All visual constants are defined as CSS custom properties in [`design-tokens.css`](packages/client/src/styles/design-tokens.css):

### 2.1 Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-dark` | `#0B0F17` | Page background (near-black slate) |
| `--bg-card` | `rgba(18, 24, 38, 0.75)` | Glass card background (semi-transparent) |
| `--bg-card-solid` | `#121826` | Opaque card variant |
| `--bg-card-hover` | `rgba(28, 36, 56, 0.85)` | Card hover state |
| `--bg-input` | `#1A2234` | Form input backgrounds |
| `--border-card` | `rgba(255, 255, 255, 0.08)` | Subtle card borders |
| `--border-focus` | `#3B82F6` | Focused input borders |

### 2.2 Accent Colors

| Token | Hex | Role |
|-------|-----|------|
| `--primary` | `#3B82F6` | Primary actions, links, active tabs, selected routes |
| `--primary-hover` | `#2563EB` | Primary button hover state |
| `--accent-green` | `#10B981` | Success, seller responsibility, good scores |
| `--accent-amber` | `#F59E0B` | Warnings, moderate scores, air freight routes |
| `--accent-red` | `#EF4444` | Danger, delete actions, challenging scores |
| `--accent-purple` | `#8B5CF6` | Multimodal routes, special badges |
| `--accent-cyan` | `#06B6D4` | Route complexity sub-score |

Each accent color has corresponding `-bg` (12% opacity background) and `-glow` (25% opacity glow) variants.

### 2.3 Typography

| Token | Value |
|-------|-------|
| `--font-family` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` |
| `--font-mono` | `'JetBrains Mono', monospace` |

**Type Scale:**
- Page headings: `1.8rem`, weight `800`
- Section headings: `1.2rem`, weight `700`
- Sub-headings: `1.1rem`, weight `700`
- Body text: `0.9rem`, weight `400–600`
- Captions & labels: `0.75–0.85rem`, weight `500–600`

### 2.4 Elevation & Shadows

| Token | Usage |
|-------|-------|
| `--shadow-sm` | `0 2px 4px rgba(0,0,0,0.3)` — Subtle depth |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.4)` — Card default |
| `--shadow-lg` | `0 10px 25px rgba(0,0,0,0.5)` — Elevated modals |
| `--shadow-glow` | `0 0 20px rgba(59,130,246,0.2)` — Primary CTA glow |

### 2.5 Border Radii

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `6px` | Small elements, scrollbar thumb |
| `--radius-md` | `10px` | Buttons, inputs, badges |
| `--radius-lg` | `16px` | Cards, modals, map container |
| `--radius-xl` | `24px` | Large decorative elements |

### 2.6 Transitions

| Token | Value |
|-------|-------|
| `--transition-fast` | `0.15s ease` — Buttons, hovers |
| `--transition-normal` | `0.25s ease` — Page transitions |

---

## 3. Component Library

### 3.1 Glass Card (`.glass-card`)
The fundamental container component using glassmorphism:
```css
background: var(--bg-card);           /* Semi-transparent */
backdrop-filter: blur(12px);          /* Frosted glass effect */
border: 1px solid var(--border-card); /* Subtle light border */
border-radius: var(--radius-lg);      /* 16px rounded */
box-shadow: var(--shadow-md);         /* Medium depth shadow */
```

**Variants:**
- `.glass-card` — Standard non-interactive card
- `.glass-card-interactive` — Adds hover effects: `translateY(-2px)`, glow shadow, primary border highlight

### 3.2 Buttons (`.btn`)
```
.btn             — Base: flex, padding, rounded, cursor, transition
.btn-primary     — Gradient blue background + white text + glow shadow
.btn-secondary   — Transparent + subtle border + white text
.btn-outline     — Transparent + primary border + primary text
.btn-sm          — Compact variant (smaller padding + font)
```

**Hover behaviors:**
- Primary: `translateY(-1px)` + amplified glow shadow
- Secondary: Increased background opacity + brighter border
- Outline: Fills with primary glow background

### 3.3 Badges (`.badge`)
Pill-shaped status indicators:
```
.badge-green   — Success / Seller responsibility / EXCELLENT score
.badge-blue    — Active / Incoterm + Transport mode tag
.badge-amber   — Warning / Buyer responsibility / MODERATE score
.badge-purple  — Special / Multimodal route indicator
```
All badges use matching semi-transparent backgrounds with colored borders.

### 3.4 Form Controls
```css
.form-group    — Flex column container with gap
.form-label    — Muted color, 0.85rem, weight 500
.form-input    — Dark background, card border, rounded
.form-select   — Same styling as inputs
.form-textarea — Same styling as inputs
```
**Focus states:** Primary blue border + blue glow ring (`box-shadow: 0 0 0 3px var(--primary-glow)`).

### 3.5 Data Tables (`.data-table`)
Full-width tables with:
- Muted header row with subtle background tinting
- Card-border row separators
- Hover highlight on rows (`rgba(255,255,255,0.02)`)
- 0.88rem font size for data density

### 3.6 Alert Notice (`.sample-data-notice`)
Amber dashed-border info bar:
```css
background: rgba(245, 158, 11, 0.08);
border: 1px dashed rgba(245, 158, 11, 0.3);
color: var(--accent-amber);
```

---

## 4. Page-Level Design Patterns

### 4.1 Dashboard (`DashboardView`)
```
┌─────────────────────────────────────────────────┐
│  Hero Banner (gradient glass + CTA button)      │
├──────┬──────┬──────┬──────┬──────┬──────────────┤
│ KPI  │ KPI  │ KPI  │ KPI  │      │              │
│ Card │ Card │ Card │ Card │      │              │
├──────┴──────┴──────┴──────┴──────┴──────────────┤
│  Recent Saved Calculations Table                │
│  (product, origin→dest, incoterm, cost, ECI)    │
│  [View] [Delete] per row                        │
│  [Clear All History] with confirmation dialog   │
└─────────────────────────────────────────────────┘
```

### 4.2 Calculator Wizard (`CalculatorWizard`)
6-step progressive form with:
- **Circular step indicators** (numbered circles, ✓ for completed)
- **Linear progress bar** (fills as steps complete)
- **Back/Next navigation** with clear step labels
- **Review & Submit** final step showing parameter summary

```
Step 1: Product Specifications (name, category, value, quantity)
Step 2: Cargo Package & Dimensions (weight, volume, package type, urgency)
Step 3: Indian Export Origin (dropdown of 8 cities)
Step 4: International Destination (dropdown of 8 ports)
Step 5: Incoterm 2020 & Transport (incoterm selector + info box, mode, insurance, currency)
Step 6: Review & Calculate (summary grid + submit button)
```

### 4.3 Results View (`ResultsView`)
```
┌─────────────────────────────────────────────────┐
│  [!] Sample Data Disclaimer Banner              │
├─────────────────────────────────────────────────┤
│  Action Bar: [New Calc] [Export CSV] [Export PDF]│
├──────┬──────┬──────┬────────────────────────────┤
│ Total│Seller│Per-Kg│ ECI Rating                  │
│ Cost │Share │/CBM  │ Score                       │
├──────┴──────┴──────┴────────────────────────────┤
│  ECI Indicator Gauge (sub-score bars + recs)    │
├─────────────────────────────────────────────────┤
│  Itemized Cost Breakdown Table (15 rows)        │
├─────────────────────────────────────────────────┤
│  Route Comparison Cards (3 alternatives)        │
├─────────────────────────────────────────────────┤
│  Interactive Leaflet Trade Map (polylines)      │
└─────────────────────────────────────────────────┘
```

### 4.4 ECI Indicator Gauge (`IndicatorGauge`)
- Overall score badge (color-coded: green/blue/amber/red)
- Wide progress bar with gradient fill
- 6 sub-score bars in 3×2 grid
- MSME Benchmark comparison note (info box)
- Actionable recommendation checklist

### 4.5 Trade Map (`TradeMap`)
- Leaflet `MapContainer` centered on India (20.59°N, 78.96°E)
- OpenStreetMap tiles
- Color-coded polylines:
  - Blue (#3B82F6) — Sea freight (solid line)
  - Amber (#F59E0B) — Air cargo (dashed line)
  - Green (#10B981) — Road haulage (solid line)
  - Purple (#8B5CF6) — Rail (solid line)
- Auto-fit bounds to visible route points
- Click-to-select route polyline interaction
- Floating legend overlay (glassmorphism box)

### 4.6 Route Comparison (`RouteComparison`)
3 side-by-side cards with:
- Transport mode badge (colored by mode)
- Route name heading
- MSME recommendation badges (e.g., "Most Cost-Effective", "Fastest Transit")
- Metric grid: cost (INR), transit days, reliability score, CO2 carbon
- Select/deselect button (toggles map highlight)

### 4.7 Glossary (`GlossaryView`)
- Debounced search input (300ms) with clear (X) button
- Category filter pills (ALL, Incoterms 2020, Customs, Documentation, Freight, Finance)
- Result count display
- Card grid (auto-fit, min 320px columns)
- Each card: term name, abbreviation badge, definition, example, Incoterm relevance

---

## 5. Navigation Architecture

### Header Navigation Bar
Sticky header with glassmorphism background:
```
[Logo + Title]                    [Dashboard] [Calculator] [Results] [Route Map] [Glossary]
```

- Logo: Gradient circle (primary→green) with Globe icon
- Title: "Export Cost Indicator" / subtitle "Powered by Grace"
- Nav buttons: Icon + label, active state highlighted with primary glow
- Results tab conditionally hidden until a calculation exists

### Tab State Management
Single `tab` state variable in `App.tsx` controls visible view:
```typescript
type ActiveTab = 'dashboard' | 'calculate' | 'results' | 'map' | 'glossary';
```

---

## 6. Responsive Design

- **Container**: Max-width 1280px, centered, 1.5rem padding
- **KPI grids**: `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))` — 4 cols on desktop, stacks on mobile
- **Route cards**: `minmax(240px, 1fr)` — 3 cols → 1 col
- **Form grids**: 2-column on desktop, stack on mobile
- **Navigation**: Flex wrap for small screens
- **Data tables**: Horizontal scroll wrapper (`overflow-x: auto`)
- **Map**: Full-width with configurable height prop

---

## 7. Icon System

Uses **Lucide React** icon library throughout:

| Icon | Usage |
|------|-------|
| `Globe` | App logo |
| `LayoutDashboard` | Dashboard tab |
| `Calculator` | Calculator tab + KPI |
| `Ship` | Results tab + route comparison |
| `MapPin` | Route Map tab + geographic markers |
| `BookOpen` | Glossary tab |
| `Award` | ECI indicator + score badge |
| `TrendingUp` | Average cost KPI |
| `ArrowUpRight` | View button |
| `Trash2` | Delete actions |
| `XCircle` | Clear all history |
| `Download` | PDF export |
| `FileSpreadsheet` | CSV export |
| `RefreshCw` | New calculation |
| `ArrowLeft/Right` | Wizard navigation |
| `Check` | Completed step indicator |
| `CheckCircle2` | Recommendation items |
| `Info` | Benchmark note |
| `Zap` | Optimization guidance |
| `ShieldAlert` | Risk warning |
| `HelpCircle` | Help tooltip |
| `Package` | Empty state icon |

---

## 8. Color Semantics

| Color | Semantic Meaning |
|-------|-----------------|
| **Blue** `#3B82F6` | Primary action, sea routes, active selection, links |
| **Green** `#10B981` | Success, seller responsibility, excellent scores, road routes |
| **Amber** `#F59E0B` | Warning, buyer responsibility, moderate scores, air routes |
| **Red** `#EF4444` | Danger, delete, challenging scores |
| **Purple** `#8B5CF6` | Multimodal, special features, corridor modes |
| **Cyan** `#06B6D4` | Route complexity sub-score |

### ECI Level Mapping
| Score Range | Level | Color |
|-------------|-------|-------|
| 80–100 | EXCELLENT | `--accent-green` |
| 65–79 | GOOD | `--primary` (blue) |
| 50–64 | MODERATE | `--accent-amber` |
| < 50 | CHALLENGING | `--accent-red` |

---

## 9. Animation & Interaction

- **Card hover**: `translateY(-2px)` lift + glow shadow (0.15s ease)
- **Button hover**: `translateY(-1px)` + amplified shadow
- **Progress bars**: `width` transition at 0.8s ease (ECI gauge fill)
- **Step progress**: `width` transition at 0.3s ease
- **Delete confirmation**: `fadeIn` animation at 0.2s ease
- **Scrollbar**: Custom styled (thin, card-colored thumb)
- **Map polylines**: Click interaction for route selection
- **Form focus**: Blue border + 3px glow ring transition

---

## 10. Accessibility Considerations

- High-contrast text on dark backgrounds (`#F1F5F9` on `#0B0F17`)
- Interactive elements have `cursor: pointer`
- Color is never the sole indicator — always paired with text labels/badges
- Form labels linked to inputs
- Semantic HTML structure (header, nav, main, footer)
- Scrollbar contrast for visibility
