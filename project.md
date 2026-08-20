# 📦 Project Overview — Export Cost Indicator & Trade Route Map

> **Team**: χάρις (Grace)  
> **Hackathon**: Buildathon  
> **License**: MIT  
> **Status**: Production-ready prototype (estimated benchmark data)

---

## 1. Problem Statement

Indian MSMEs contribute over **45% of India's total exports**, yet navigating complex logistics costs, Incoterm allocations (EXW → DDP), Indian customs formalities (ICEGATE / CHA), and multi-modal route comparisons remains **opaque, manual, and prohibitively complex** for non-logistics experts.

---

## 2. Product Vision

An **accessible, transparent, step-by-step export cost calculator** and **interactive trade route map** purpose-built for Indian MSME exporters, enabling:

- Instant total-landed-cost estimates across 8+ Indian origins → 8+ international destinations
- Itemized 15-component cost breakdown with Incoterms 2020 seller/buyer responsibility splits
- Normalized multi-factor Export Cost Indicator (ECI) scoring (0–100)
- Geographic visualization of real sea, air, and multimodal trade corridors on an interactive Leaflet map
- Side-by-side route comparison with MSME recommendation badges
- One-click PDF & CSV export of cost reports

---

## 3. Monorepo Architecture

```
export-cost-app/
├── docs/                           # 12 Product & Technical spec documents
├── Presentation/                   # Interactive HTML5 presentation (69KB single-file)
├── packages/
│   ├── shared/                     # @export-cost/shared
│   │   └── src/
│   │       ├── types/export.ts     # 205 LOC — All TypeScript interfaces & enums
│   │       ├── constants/
│   │       │   ├── incoterms.ts    # 6 full IncotermDefinition records (EXW→DDP)
│   │       │   └── currencies.ts   # Currency formatting & exchange rate utils
│   │       └── utils/money.ts      # decimal.js-safe money formatting
│   │
│   ├── calculation-engine/         # @export-cost/calculation-engine
│   │   └── src/
│   │       ├── calculator.ts       # Main orchestrator: routes → costs → incoterms → ECI
│   │       ├── cost-components/    # 15 cost component generators (290 LOC)
│   │       ├── incoterm-rules.ts   # Incoterms 2020 seller/buyer cost allocation engine
│   │       ├── indicator.ts        # Weighted ECI scoring formula (6 sub-scores)
│   │       └── route-generator.ts  # 3-route alternative generator with ocean waypoints
│   │
│   ├── server/                     # @export-cost/server
│   │   └── src/
│   │       ├── app.ts              # Express app (CORS, mock auth, 5 route groups)
│   │       ├── routes/             # REST API: calculations, locations, routes, pricing, glossary
│   │       ├── providers/          # Mock AWS Cognito auth middleware
│   │       └── data/seed/          # JSON seed datasets (glossary, locations, pricing)
│   │
│   └── client/                     # @export-cost/client
│       └── src/
│           ├── app/App.tsx         # Root SPA with tab navigation (5 tabs)
│           ├── features/
│           │   ├── dashboard/      # DashboardView — KPI cards + saved calc history table
│           │   ├── calculator/     # CalculatorWizard — 6-step form wizard
│           │   ├── results/        # ResultsView — cost breakdown table + metrics + map
│           │   ├── indicator/      # IndicatorGauge — ECI score display + sub-score bars
│           │   ├── comparison/     # RouteComparison — side-by-side route cards
│           │   ├── map/            # TradeMap — Leaflet interactive map with polyline routes
│           │   └── glossary/       # GlossaryView — searchable trade terms glossary
│           ├── services/api.ts     # API client with offline seed fallbacks (432 LOC)
│           ├── styles/
│           │   ├── design-tokens.css  # CSS custom properties (colors, typography, shadows)
│           │   └── global.css         # Glassmorphism cards, buttons, forms, tables
│           └── utils/
│               ├── csvExport.ts    # Client-side PapaParse CSV generation
│               └── pdfExport.ts    # html2canvas + jsPDF report export
└── package.json                    # npm workspaces root
```

---

## 4. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 18.2 | Component-based SPA UI |
| **Build** | Vite | 5.0 | Dev server & production bundler |
| **Language** | TypeScript | 5.3 | Full-stack type safety |
| **Mapping** | Leaflet + react-leaflet | 1.9 / 4.2 | Interactive trade route map |
| **Icons** | Lucide React | 0.309 | Modern SVG icon library |
| **CSS** | CSS Custom Properties | — | Design token system + glassmorphism |
| **Backend** | Express.js | 4.18 | REST API server |
| **Testing** | Vitest | 1.2 | Unit & integration tests |
| **Math** | Decimal.js | 10.4 | IEEE-754-safe financial arithmetic |
| **PDF** | jsPDF + html2canvas | 2.5 / 1.4 | Client-side report generation |
| **CSV** | PapaParse | 5.4 | Client-side CSV export |
| **Monorepo** | npm workspaces | — | Package dependency management |
| **Auth (Mock)** | Custom middleware | — | Simulates AWS Cognito JWT claims |
| **Database (Spec)** | PostgreSQL / AWS RDS | — | Planned production persistence |

---

## 5. Core Data Models (TypeScript Interfaces)

### CalculationInput
User-provided shipment parameters:
- `productName`, `category` (8 industries), `declaredValue`, `valueCurrency`
- `quantity`, `unit`, `weightKg`, `volumeCbm`, `packageType`
- `originId`, `destinationId` (Indian origins → international destinations)
- `incoterm` (EXW | FOB | CFR | CIF | DAP | DDP)
- `transportMode` (SEA | AIR), `urgency`, `includeInsurance`
- `targetCurrency` for report display

### CalculationResult
Complete output including:
- Full `CostBreakdown` with 15 itemized `CostComponent[]`
- `ExportCostIndicator` (overall score + 6 sub-scores + recommendations)
- `selectedRoute` + `routeAlternatives[]` (3 routes: direct sea, transshipment, air)
- Exchange rates, disclaimers

### Route & RouteLeg
Multi-modal route model with:
- Ordered legs (ROAD → SEA/AIR → ROAD)
- Per-leg waypoints for realistic ocean corridor rendering (Suez Canal, Malacca Strait, etc.)
- Carrier names, distance, transit time, carbon emissions

---

## 6. Key Features

### 6.1 — 15-Component Cost Engine
Computes itemized costs from product value through contingency buffer, including inland transport, THC, documentation, customs clearance, category inspection, international freight (volumetric/CBM), fuel surcharge, cargo insurance, destination charges, import duties, last-mile delivery, bank LC fees, and contingency buffer.

### 6.2 — Incoterms 2020 Allocation
Strict enforcement of ICC Incoterms 2020 rules for seller vs buyer cost responsibility across EXW, FOB, CFR, CIF, DAP, and DDP.

### 6.3 — Export Cost Indicator (ECI)
Weighted composite score (0–100):
- Cost Efficiency (40%) — logistics-to-product-value ratio
- Transit Speed (20%) — days relative to benchmark
- Route Reliability (15%) — carrier/port reliability score
- Route Complexity (10%) — direct vs multimodal transshipment
- Risk Rating (10%) — congestion & corridor risk
- Sustainability (5%) — carbon footprint per kg

### 6.4 — Interactive Leaflet Trade Map
Real-world maritime corridor waypoints (Arabian Sea → Suez Canal → Mediterranean, Malacca Strait, Cape route) rendered as polylines with color-coded transport modes and port marker popups.

### 6.5 — Route Comparison Matrix
Side-by-side cards comparing 3 route alternatives (direct sea, transshipment via Jebel Ali, air cargo) with cost, transit days, reliability, carbon, and MSME recommendation badges.

### 6.6 — Offline-First Architecture
Full seed data for 8 Indian origins, 8 international destinations, 3 ports, 22 glossary terms, and exchange rates — the entire app functions without a backend server.

### 6.7 — Report Export
Client-side PDF (html2canvas + jsPDF) and CSV (PapaParse) generation for sharing cost reports.

---

## 7. API Surface

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/health` | Service health check |
| `GET` | `/api/v1/locations/origins` | Indian export origin cities |
| `GET` | `/api/v1/locations/destinations` | International destination ports |
| `GET` | `/api/v1/locations/ports` | Indian sea container ports |
| `POST` | `/api/v1/calculations` | Run full export cost calculation |
| `GET` | `/api/v1/calculations/:id` | Retrieve saved calculation |
| `POST` | `/api/v1/routes/generate` | Generate route alternatives |
| `POST` | `/api/v1/routes/compare` | Comparative matrix with badges |
| `GET` | `/api/v1/pricing/exchange-rates` | INR-base currency rates |
| `GET` | `/api/v1/glossary?q=&category=` | Search trade terms glossary |

---

## 8. Quick Start

```bash
# Install all workspace dependencies
npm install

# Start frontend (http://localhost:3000)
npm run dev

# Start backend API (http://localhost:4000)
npm run dev:server

# Run test suite
npm run test

# TypeScript type check
npm run typecheck
```

---

## 9. Seed Data Coverage

| Data Set | Count | Source |
|----------|-------|--------|
| Indian Origins | 8 | Ludhiana, Delhi, Jaipur, Tirupur, Surat, Indore, Moradabad, Bengaluru |
| International Destinations | 8 | Hamburg, Rotterdam, Dubai, Singapore, New York, Felixstowe, Yokohama, Sydney |
| Indian Ports | 3 | Nhava Sheva (JNPT), Mundra, Chennai |
| Incoterms | 6 | EXW, FOB, CFR, CIF, DAP, DDP |
| Product Categories | 8 | Textiles, Agriculture, Engineering, Pharma, Chemicals, Handicrafts, Electronics, Other |
| Glossary Terms | 22 | Incoterms, Customs, Documentation, Freight, Finance |
| Currencies | 7 | INR, USD, EUR, GBP, AED, SGD, JPY |

---

## 10. File Statistics

| Package | Files | Key Source LOC |
|---------|-------|---------------|
| `shared` | 9 TS files | ~530 LOC (types + constants + utils) |
| `calculation-engine` | 5 TS modules | ~950 LOC (calculator + components + indicator + routes + incoterms) |
| `server` | 10 TS files | ~400 LOC (app + routes + seed data + mock auth) |
| `client` | 12 TSX/TS files | ~2,100 LOC (App + 7 features + api + styles + utils) |
| **Total** | ~36 source files | **~4,000 LOC** |
