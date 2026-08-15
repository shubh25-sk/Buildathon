# Export Cost Indicator and Trade Route Map

A step-by-step export cost calculator, normalized Export Cost Indicator (ECI) scoring engine, interactive Leaflet trade map, and route comparison application for Indian MSMEs.

![Export Cost Indicator Portal](https://raw.githubusercontent.com/antigravity/export-cost-app/main/docs/screenshot.png)

## Features
- **Itemized Cost Engine**: 15+ cost components (inland freight, origin handling, documentation, customs clearance, main carriage, insurance, destination charges, banking fees, contingency).
- **Incoterms 2020 Allocation**: Enforces cost responsibility split across EXW, FOB, CFR, CIF, DAP, DDP.
- **Export Cost Indicator (ECI)**: Multi-factor efficiency score (0–100) evaluating cost, speed, reliability, complexity, risk, and carbon emissions.
- **Interactive Trade Map**: Leaflet map visualizing sea, air, and multimodal trade corridors with port popups.
- **Side-by-side Route Comparison**: Compare up to 4 route alternatives with MSME recommendation badges.
- **Reports Export**: One-click client-side PDF and CSV report downloads.

## Monorepo Architecture
```
export-cost-app/
├── docs/                      # 12 Product & Technical specs
└── packages/
    ├── shared/                # Types, Incoterm definitions, currency utils
    ├── calculation-engine/    # Pure cost calculator & ECI scorer (Vitest tested)
    ├── server/                # Express REST API & Seed data
    └── client/                # React 18 + Vite + Leaflet UI
```

## Quick Start

```bash
# Install workspace dependencies
npm install

# Run frontend React app (http://localhost:3000)
npm run dev

# Run backend API server (http://localhost:4000)
npm run dev:server

# Run test suite
npm run test

# Run TypeScript type check
npm run typecheck
```

## Documentation
- [Product Requirements (PRD)](docs/product-requirements.md)
- [Technical Architecture](docs/technical-architecture.md)
- [REST API Specs](docs/api-documentation.md)
- [Database Schema (PostgreSQL)](docs/database-schema.md)
- [Calculation Engine Engine Docs](docs/calculation-engine.md)
- [AWS Deployment Guide](docs/aws-deployment-guide.md)
- [User Guide](docs/user-guide.md)
