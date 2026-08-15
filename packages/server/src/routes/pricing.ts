import { Router } from 'express';
import { CURRENCIES } from '@export-cost/shared';

export const pricingRouter = Router();

// GET /api/v1/pricing/exchange-rates
pricingRouter.get('/exchange-rates', (req, res) => {
  const rates = Object.fromEntries(
    Object.entries(CURRENCIES).map(([code, details]) => [code, details.defaultRateInr])
  );

  res.json({
    success: true,
    baseCurrency: 'INR',
    updatedAt: new Date().toISOString(),
    rates
  });
});

// GET /api/v1/pricing/assumptions
pricingRouter.get('/assumptions', (req, res) => {
  res.json({
    success: true,
    assumptions: {
      seaFreightPerCbmUsd: 45,
      airFreightExpressUsdPerKg: 4.80,
      airFreightEconomyUsdPerKg: 3.20,
      inlandFreightInrPerKmTon: 28,
      originThcInrSea: 7500,
      originThcInrAir: 4500,
      marineInsuranceRatePct: 0.35,
      contingencyDefaultPct: 2.5,
      isSeededMockData: true,
      dataNotice: 'Rates represent Q3 2026 indicative benchmarks across Indian export corridors.'
    }
  });
});
