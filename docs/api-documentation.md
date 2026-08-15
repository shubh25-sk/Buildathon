# REST API Documentation

## Base URL
`http://localhost:4000/api/v1`

## Endpoints

### 1. Locations
- `GET /locations/origins`: List Indian export origin cities and ICD hubs.
- `GET /locations/destinations`: List international destination ports.
- `GET /locations/ports`: List Indian sea container ports (Nhava Sheva, Mundra, Chennai).
- `GET /locations/airports`: List air cargo complexes.

### 2. Calculations
- `POST /calculations`: Run export cost calculation.
  - **Body**: `CalculationInput`
  - **Returns**: `CalculationResult`
- `GET /calculations/:id`: Retrieve saved calculation.
- `GET /calculations`: List recent calculations.

### 3. Routes
- `POST /routes/generate`: Generate 3+ route alternatives.
- `POST /routes/compare`: Generate comparative matrix with MSME badges.

### 4. Pricing & Glossary
- `GET /pricing/exchange-rates`: Current currency exchange rates relative to INR.
- `GET /pricing/assumptions`: Freight and handling cost assumptions.
- `GET /glossary?q=...&category=...`: Search trade terms glossary.
