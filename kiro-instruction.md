# 🤖 Kiro AI Instruction Spec — Export Cost Indicator & Trade Route Map

> Structured instructions for AI-assisted development on this codebase.
> Use this document when working with Kiro, Copilot, or any AI coding assistant.

---

## Project Identity

- **Name**: Export Cost Indicator & Trade Route Map
- **Team**: χάρις (Grace) — Buildathon Hackathon
- **Purpose**: Step-by-step export cost calculator and interactive trade route visualizer for Indian MSME exporters
- **Monorepo**: npm workspaces with 4 packages (`shared`, `calculation-engine`, `server`, `client`)

---

## Architecture Summary

```
packages/shared/         → TypeScript types, Incoterm definitions, currency utils (ZERO external deps)
packages/calculation-engine/ → Pure business logic: cost calculator, ECI scorer, Incoterm rules, route generator
packages/server/         → Express REST API with seed data, mock auth, 5 route groups
packages/client/         → React 18 + Vite + Leaflet SPA with offline-first fallback
```

### Key Architectural Decisions
1. **Offline-first**: The client imports `@export-cost/calculation-engine` directly and maintains seed data in `api.ts`, so the app works without the backend server
2. **Incoterms 2020 compliance**: All cost allocations follow ICC Incoterms 2020 rules (EXW → DDP responsibility chain)
3. **Pure calculation engine**: Zero HTTP/DOM dependencies — testable in isolation via Vitest
4. **CSS Custom Properties**: All styling uses design tokens — no utility-class framework
5. **Glassmorphism dark theme**: Semi-transparent cards with `backdrop-filter: blur()` on dark slate backgrounds

---

## File Map — Where Things Live

### Types & Interfaces
- `packages/shared/src/types/export.ts` — **ALL type definitions live here** (CalculationInput, CalculationResult, Route, CostComponent, ExportCostIndicator, GlossaryTerm, etc.)
- `packages/shared/src/constants/incoterms.ts` — 6 IncotermDefinition records (EXW→DDP)
- `packages/shared/src/constants/currencies.ts` — Currency formatting utilities
- `packages/shared/src/utils/money.ts` — Decimal.js-safe money formatting

### Business Logic (Calculation Engine)
- `packages/calculation-engine/src/calculator.ts` — **Main orchestrator**: routes → cost components → Incoterm rules → ECI indicator
- `packages/calculation-engine/src/cost-components/index.ts` — **15 cost component generators** (product value, packaging, inland transport, THC, docs, customs, inspection, freight, fuel, insurance, destination, duties, last-mile, banking, contingency)
- `packages/calculation-engine/src/incoterm-rules.ts` — Maps each cost component code to seller/buyer responsibility per Incoterm
- `packages/calculation-engine/src/indicator.ts` — **ECI scoring formula** (6 weighted sub-scores → overall 0–100)
- `packages/calculation-engine/src/route-generator.ts` — Generates 3 route alternatives (direct sea, transshipment via Jebel Ali, air cargo) with realistic ocean corridor waypoints

### Server API
- `packages/server/src/app.ts` — Express app setup (CORS, JSON parser, mock auth, route registration)
- `packages/server/src/routes/` — 5 route files: `calculations.ts`, `locations.ts`, `routes.ts`, `pricing.ts`, `glossary.ts`
- `packages/server/src/data/seed/` — JSON seed datasets (glossary terms, locations, pricing assumptions)
- `packages/server/src/providers/` — Mock AWS Cognito auth middleware

### Frontend (Client)
- `packages/client/src/app/App.tsx` — **Root SPA** with tab-based navigation (dashboard, calculate, results, map, glossary)
- `packages/client/src/services/api.ts` — **API client + offline fallbacks** (seed data for origins, destinations, ports, glossary, exchange rates)
- `packages/client/src/features/dashboard/DashboardView.tsx` — Landing page with KPI cards + saved calculations table
- `packages/client/src/features/calculator/CalculatorWizard.tsx` — **6-step form wizard** for shipment input
- `packages/client/src/features/results/ResultsView.tsx` — Full results page (metrics + cost table + comparison + map)
- `packages/client/src/features/indicator/IndicatorGauge.tsx` — ECI score display with sub-score progress bars
- `packages/client/src/features/comparison/RouteComparison.tsx` — Side-by-side route cards
- `packages/client/src/features/map/TradeMap.tsx` — Leaflet interactive map with polyline routes + waypoints
- `packages/client/src/features/glossary/GlossaryView.tsx` — Searchable/filterable trade terms glossary
- `packages/client/src/styles/design-tokens.css` — CSS custom properties (colors, typography, shadows, radii)
- `packages/client/src/styles/global.css` — Global styles, glass-card, buttons, badges, forms, tables
- `packages/client/src/utils/csvExport.ts` — PapaParse CSV generation
- `packages/client/src/utils/pdfExport.ts` — html2canvas + jsPDF report export

---

## Coding Conventions

### TypeScript
- Strict types — all interfaces in `shared/src/types/export.ts`
- Union types for enums: `IncotermCode = 'EXW' | 'FOB' | 'CFR' | 'CIF' | 'DAP' | 'DDP'`
- No `any` types unless absolutely necessary
- `Record<K, V>` for dictionaries (exchange rates, incoterms map)

### React Components
- Functional components with `React.FC<Props>` typing
- Props interfaces defined above each component
- `useState` and `useEffect` for local state
- No external state management library (no Redux/Zustand)
- Inline styles for component-specific styling (design tokens referenced via `var()`)
- CSS classes (from `global.css`) for reusable patterns

### CSS
- **Never use Tailwind** — this project uses vanilla CSS with custom properties
- All tokens in `design-tokens.css` `:root` block
- Utility classes: `.glass-card`, `.btn`, `.btn-primary`, `.badge`, `.form-input`, `.data-table`
- Responsive grids via `repeat(auto-fit, minmax(Xpx, 1fr))`

### API Pattern
```typescript
export async function fetchSomething(): Promise<SomeType> {
  try {
    const res = await fetch(`${API_BASE}/endpoint`);
    if (res.ok) {
      const body = await res.json();
      return body.data;
    }
  } catch {}
  return SEED_FALLBACK_DATA; // Always have offline fallback
}
```

### Cost Component Pattern
```typescript
const componentInr = /* calculation */;
components.push({
  id: 'comp-unique-id',
  code: 'UNIQUE_CODE',      // Used in incoterm-rules.ts switch cases
  name: 'Human Readable Name',
  category: 'COST_CATEGORY', // CostCategory union type
  amountInr: componentInr,
  amount: componentInr / valCurrencyRateInr,
  amountTargetCurrency: componentInr / targetRateInr,
  isSellerResponsibility: true,
  incotermNote: 'When this applies under different Incoterms.',
  breakdownDetails: 'How this was calculated'
});
```

---

## Domain Knowledge

### Incoterms 2020 (ICC Standard)
The app supports 6 of the 11 ICC Incoterms:

| Code | Name | Seller Pays Until |
|------|------|-------------------|
| EXW | Ex Works | Factory gate only |
| FOB | Free On Board | Loading on vessel at Indian port |
| CFR | Cost & Freight | Ocean freight to destination port |
| CIF | Cost, Insurance & Freight | Freight + marine insurance to destination port |
| DAP | Delivered at Place | Delivery to buyer's address (excl. import duties) |
| DDP | Delivered Duty Paid | Everything including import duties |

### Cost Component Codes (used in incoterm-rules.ts)
```
PRODUCT_VALUE, PACKAGING, INLAND_TRANSPORT, ORIGIN_HANDLING,
DOCUMENTATION, CUSTOMS_CLEARANCE, INSPECTION, MAIN_FREIGHT,
FUEL_SURCHARGE, CARGO_INSURANCE, DESTINATION_CHARGES,
IMPORT_DUTIES, LAST_MILE, BANKING_FEES, CONTINGENCY
```

### ECI Formula
```
Score = (CostEfficiency × 0.40) + (TransitSpeed × 0.20) + (RouteReliability × 0.15)
      + (RouteComplexity × 0.10) + (RiskRating × 0.10) + (Sustainability × 0.05)
```

### Route Alternatives
3 routes are always generated:
1. **Direct Ocean Freight** — Road → Sea → Road (19 days, $1,150, lowest carbon)
2. **Transshipment via Jebel Ali** — Road → Sea → Sea → Road (25 days, $1,370, flexible schedules)
3. **Air Cargo Express** — Road → Air → Road (3 days, $3,080, lowest risk)

### Ocean Corridor Waypoints
Realistic maritime routes with waypoints for:
- India → Europe: Arabian Sea → Gulf of Aden → Bab-el-Mandeb → Red Sea → Suez Canal → Mediterranean
- India → SE Asia: Indian Ocean → Malacca Strait
- India → USA East Coast: Suez → Mediterranean → Gibraltar → Atlantic
- India → Australia: Indian Ocean → South of Indonesia → Coral Sea
- India → Middle East: Arabian Sea direct

---

## Common Tasks

### "Add a new cost component"
1. Add calculation logic in `packages/calculation-engine/src/cost-components/index.ts`
2. Add the component's `code` to appropriate Incoterm case arrays in `incoterm-rules.ts`
3. The component will automatically appear in results table & CSV/PDF exports

### "Add a new Incoterm"
1. Add to `IncotermCode` union in `shared/src/types/export.ts`
2. Add definition in `shared/src/constants/incoterms.ts`
3. Add case in `calculation-engine/src/incoterm-rules.ts`
4. Add option in `CalculatorWizard.tsx` step 5 select

### "Add a new origin/destination city"
1. Add to `SEED_ORIGINS` or `SEED_DESTINATIONS` in `client/src/services/api.ts`
2. Add to server seed data in `server/src/data/seed/`
3. Dropdowns auto-populate from these arrays

### "Add a new feature tab"
1. Create component in `client/src/features/<name>/<Component>.tsx`
2. Add tab value to `ActiveTab` union in `App.tsx`
3. Add `NavButton` in header nav
4. Add conditional render in `<main>` section

### "Modify the ECI scoring weights"
Edit `packages/calculation-engine/src/indicator.ts` — adjust the multipliers in the weighted sum formula (must sum to 1.0).

### "Add a new trade corridor with realistic waypoints"
Edit `getOceanWaypoints()` in `packages/calculation-engine/src/route-generator.ts` — add a new geographic condition with waypoint coordinates.

### "Change the UI theme"
Edit `packages/client/src/styles/design-tokens.css` — all colors, shadows, radii, and transitions are CSS custom properties.

---

## Testing

```bash
npm run test            # Run all workspace tests (Vitest)
npm run test:engine     # Calculation engine tests only
npm run test:server     # Server API tests only
npm run typecheck       # TypeScript type checking across all packages
```

Test files are in `__tests__/` directories within each package.

---

## Important Constraints

1. **Financial precision**: Use `decimal.js` for monetary calculations — never rely on native JS floating-point for currency math
2. **Offline-first**: Always provide seed data fallbacks in `api.ts` — the app must function without the server
3. **Incoterm accuracy**: Cost allocation rules in `incoterm-rules.ts` must strictly follow ICC Incoterms 2020 standard
4. **No Tailwind**: Styling uses vanilla CSS with custom properties only
5. **Type safety**: All interfaces in `shared/src/types/export.ts` — no ad-hoc types in other packages
6. **Package boundaries**: `calculation-engine` must remain pure (no HTTP, no DOM, no React)
7. **Monorepo imports**: Use `@export-cost/shared` and `@export-cost/calculation-engine` — never relative cross-package paths

---

## Environment & Ports

| Service | Default Port | Command |
|---------|-------------|---------|
| Vite Dev Server (Client) | `3000` | `npm run dev` |
| Express API (Server) | `4000` | `npm run dev:server` |
| Vite Preview (Production) | `4173` | `cd packages/client && npm run preview` |

---

## Dependencies Summary

### Client
- `react` 18.2, `react-dom` 18.2
- `vite` 5.0, `@vitejs/plugin-react` 4.2
- `leaflet` 1.9, `react-leaflet` 4.2 (interactive maps)
- `lucide-react` 0.309 (SVG icons)
- `jspdf` 2.5, `html2canvas` 1.4 (PDF export)
- `papaparse` 5.4 (CSV export)
- `decimal.js` 10.4 (financial math)

### Server
- `express` 4.18, `cors` 2.8
- `tsx` 4.7 (TypeScript execution)
- `vitest` 1.2, `supertest` 6.3 (testing)

### Calculation Engine
- `decimal.js` 10.4 (financial math)
- `vitest` 1.2 (testing)

### Shared
- Zero external dependencies (pure TypeScript)
