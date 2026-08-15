# Technical Architecture Document

## 1. Monorepo Overview
The application is structured as an npm monorepo with strict package separation:

- `packages/shared`: Pure TypeScript interfaces, Incoterms 2020 definitions, currency formatting utilities.
- `packages/calculation-engine`: Standalone business logic engine (zero HTTP dependencies) for cost component calculations, Incoterm allocations, ECI scoring, and route generation.
- `packages/server`: Express REST API handling endpoints, seed JSON datasets, mock auth middleware (simulating AWS Cognito), and route comparison.
- `packages/client`: React 18 + Vite web frontend using Leaflet 1.9, CSS custom properties design tokens, and client-side PDF/CSV generators.

## 2. System Architecture Diagram

```
+-------------------------------------------------------+
|                    React 18 Client                    |
|  (Calculator Wizard | ECI Gauge | Leaflet Trade Map)  |
+--------------------------+----------------------------+
                           |
                           v
+-------------------------------------------------------+
|                   Express REST API                    |
|  (/api/v1/calculations, /locations, /pricing, /routes)|
+--------------------------+----------------------------+
                           |
                           v
+-------------------------------------------------------+
|               Pure Calculation Engine                 |
|     (Decimal.js Money Math | ECI Score | Incoterms)   |
+-------------------------------------------------------+
```
