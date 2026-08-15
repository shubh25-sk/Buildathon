# Testing Guide

## Test Architecture
Tests are implemented using **Vitest** for fast execution:

- `packages/calculation-engine/__tests__/calculator.test.ts`: Pure business logic tests covering Incoterms responsibility rules, cost component math, ECI scoring bounds (0–100), and route generation.
- `packages/server/__tests__/api.test.ts`: Supertest API integration testing endpoints `/health`, `/locations/origins`, `/pricing/exchange-rates`, `/calculations`.

Run tests:
```bash
npm run test
```
