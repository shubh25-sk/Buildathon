# 🔄 Developer Workflow Guide

> How to develop, test, build, and extend the Export Cost Indicator monorepo.

---

## 1. Development Environment Setup

### Prerequisites
- **Node.js** ≥ 18.x (LTS recommended)
- **npm** ≥ 9.x (ships with Node.js 18+)
- Modern browser (Chrome, Firefox, Edge)

### Initial Setup
```bash
# Clone the repository
git clone <repo-url>
cd export-cost-app/

# Install all workspace dependencies (resolves cross-package links)
npm install
```

> **Note**: npm workspaces automatically symlinks `@export-cost/shared`, `@export-cost/calculation-engine`, and `@export-cost/server` so cross-package imports resolve without manual linking.

---

## 2. Running the Application

### Frontend Only (Offline Mode)
```bash
npm run dev
# → Vite dev server at http://localhost:3000
# → Hot Module Replacement (HMR) enabled
# → Falls back to seed data when API is unreachable
```

### Backend API Server
```bash
npm run dev:server
# → Express API at http://localhost:4000
# → tsx watch mode — auto-restarts on file changes
# → Health check: GET http://localhost:4000/api/v1/health
```

### Full Stack (Two Terminals)
```bash
# Terminal 1 — Backend
npm run dev:server

# Terminal 2 — Frontend
npm run dev
```

---

## 3. Testing Workflow

### Run All Tests
```bash
npm run test
# Runs vitest across all workspaces that have test scripts
```

### Run Specific Package Tests
```bash
# Calculation engine tests only
npm run test:engine

# Server API tests only
npm run test:server
```

### Type Checking
```bash
npm run typecheck
# Runs tsc --noEmit across all workspaces
```

---

## 4. Build & Production

### Production Build
```bash
npm run build
# Builds all workspaces:
#   - shared: tsc compile
#   - calculation-engine: tsc compile
#   - server: tsc compile
#   - client: tsc && vite build → dist/
```

### Preview Production Build
```bash
cd packages/client
npm run preview
# → Serves production bundle at http://localhost:4173
```

---

## 5. Package Dependency Graph

```
┌──────────────────────────┐
│   @export-cost/shared    │ ← Pure types, constants, utils (zero deps)
└──────────┬───────────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
┌──────────────┐ ┌──────────────────┐
│ calc-engine  │ │    server         │
│ (business    │ │ (Express REST     │
│  logic)      │ │  API + seed data) │
└──────┬───────┘ └────────┬─────────┘
       │                  │
       ▼                  │
┌──────────────────────────┐
│   @export-cost/client    │ ← React 18 + Vite + Leaflet
│ (imports engine directly │
│  for offline fallback)   │
└──────────────────────────┘
```

**Key insight**: The client imports `@export-cost/calculation-engine` directly for offline-first execution. When the server API is unreachable, the client runs the full calculation engine locally using seed data.

---

## 6. Code Organization Conventions

### File Naming
- **Components**: PascalCase (`DashboardView.tsx`, `TradeMap.tsx`)
- **Modules**: camelCase or kebab-case (`calculator.ts`, `incoterm-rules.ts`)
- **Types**: Colocated in `shared/src/types/export.ts` (single source of truth)
- **Constants**: `shared/src/constants/` (incoterms, currencies)

### Feature Structure (Client)
Each feature is a self-contained directory:
```
features/
├── calculator/CalculatorWizard.tsx   # 6-step form wizard
├── comparison/RouteComparison.tsx    # Route cards comparison
├── dashboard/DashboardView.tsx       # Landing page + saved calcs
├── glossary/GlossaryView.tsx         # Searchable glossary
├── indicator/IndicatorGauge.tsx      # ECI score + sub-scores
├── map/TradeMap.tsx                  # Leaflet interactive map
└── results/ResultsView.tsx          # Full results page
```

### API Service Layer
All API calls are centralized in `client/src/services/api.ts`:
- Each function attempts a `fetch()` to the Express backend
- On failure, falls back to seed data or local calculation engine
- localStorage used for calculation persistence

---

## 7. Adding a New Feature

### Step-by-step workflow:

#### 1. Define Types (if needed)
Edit `packages/shared/src/types/export.ts` — add interfaces or enums. Re-export from `packages/shared/src/index.ts`.

#### 2. Implement Business Logic
Add to `packages/calculation-engine/src/` — keep it pure (no HTTP, no DOM).

#### 3. Add API Endpoint
Create route handler in `packages/server/src/routes/`. Register in `packages/server/src/app.ts`:
```typescript
import { newRouter } from './routes/new-feature.js';
app.use('/api/v1/new-feature', newRouter);
```

#### 4. Add Seed/Fallback Data
Update `packages/client/src/services/api.ts` with offline fallback constants.

#### 5. Create UI Component
Add `packages/client/src/features/<feature-name>/<Component>.tsx`. Wire it into `App.tsx` tab navigation.

#### 6. Test
```bash
npm run typecheck  # Verify types
npm run test       # Run test suite
npm run dev        # Visual verification
```

---

## 8. Adding a New Cost Component

1. **Define the component** in `packages/calculation-engine/src/cost-components/index.ts`:
   ```typescript
   const newComponentInr = /* calculation */;
   components.push({
     id: 'comp-new-item',
     code: 'NEW_ITEM',
     name: 'New Cost Item',
     category: 'FREIGHT', // or appropriate CostCategory
     amountInr: newComponentInr,
     amount: newComponentInr / valCurrencyRateInr,
     amountTargetCurrency: newComponentInr / targetRateInr,
     isSellerResponsibility: true,
     incotermNote: 'Describe when this applies.',
     breakdownDetails: 'How this was calculated'
   });
   ```

2. **Add Incoterm rules** in `packages/calculation-engine/src/incoterm-rules.ts` — include the new `code` in the appropriate Incoterm case arrays.

3. **Update docs** in `docs/calculation-engine.md`.

---

## 9. Adding a New Route Corridor

Edit `packages/calculation-engine/src/route-generator.ts`:

1. Add new waypoints to `getOceanWaypoints()` for the geographic corridor.
2. Add a new `Route` object in `generateRouteAlternatives()` with `RouteLeg[]`.
3. Include meaningful `badges` for MSME recommendations.

---

## 10. Adding New Origins / Destinations

Edit `packages/client/src/services/api.ts`:

1. Add to `SEED_ORIGINS` array (for Indian export hubs) or `SEED_DESTINATIONS` (for international ports).
2. Also add corresponding seed data to the server: `packages/server/src/data/seed/`.
3. The `CalculatorWizard` dropdown will automatically display new entries.

---

## 11. Git Workflow

```bash
# Feature branch
git checkout -b feature/new-incoterm-exw-variant

# Make changes
# ...

# Type check before commit
npm run typecheck

# Run tests
npm run test

# Commit
git add .
git commit -m "feat: add EXW factory variant incoterm"

# Push
git push origin feature/new-incoterm-exw-variant
```

---

## 12. Troubleshooting

| Issue | Solution |
|-------|----------|
| `Cannot find module '@export-cost/shared'` | Run `npm install` from the root to rebuild workspace symlinks |
| Vite HMR not reflecting changes | Clear browser cache, restart `npm run dev` |
| Leaflet map tiles not loading | Check internet connection — tiles load from OpenStreetMap CDN |
| API returns 404 | Ensure `npm run dev:server` is running on port 4000 |
| TypeScript errors in `.js` compiled files | These are pre-compiled artifacts — edit the `.ts` source files only |
| PDF export blank | Ensure the `results-printable-area` div is rendered and visible |
