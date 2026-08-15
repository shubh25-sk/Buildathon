import {
  CalculationInput,
  CalculationResult,
  CostBreakdown,
  CurrencyCode,
  Location
} from '@export-cost/shared';
import { calculateAllComponents } from './cost-components/index.js';
import { applyIncotermRules } from './incoterm-rules.js';
import { calculateExportCostIndicator } from './indicator.js';
import { generateRouteAlternatives } from './route-generator.js';

export interface CalculatorOptions {
  input: CalculationInput;
  origin: Location;
  destination: Location;
  originPort?: Location;
  destinationPort?: Location;
  exchangeRates?: Record<CurrencyCode, number>;
}

const DEFAULT_RATES: Record<CurrencyCode, number> = {
  INR: 1.0,
  USD: 83.50,
  EUR: 90.80,
  GBP: 106.20,
  AED: 22.73,
  SGD: 62.15,
  JPY: 0.54
};

export function calculateExportCost(opts: CalculatorOptions): CalculationResult {
  const { input, origin, destination, originPort, destinationPort } = opts;
  const rates = opts.exchangeRates || DEFAULT_RATES;

  // 1. Generate Route Alternatives
  const routeAlternatives = generateRouteAlternatives({
    origin,
    destination,
    originPort,
    destinationPort,
    weightKg: input.weightKg,
    volumeCbm: input.volumeCbm
  });

  // Select primary route matching transport mode preference
  const selectedRoute = routeAlternatives.find(r => r.transportMode === input.transportMode) || routeAlternatives[0];

  // 2. Compute Raw Cost Components
  const distanceInland = selectedRoute.legs[0]?.distanceKm || 250;
  const distanceMain = selectedRoute.legs.find(l => l.mode === 'SEA' || l.mode === 'AIR')?.distanceKm || 6500;

  const rawComponents = calculateAllComponents({
    input,
    origin,
    destination,
    distanceInlandKm: distanceInland,
    distanceMainKm: distanceMain,
    ratesInr: rates
  });

  // 3. Apply Incoterms 2020 Allocation Rules
  const taggedComponents = applyIncotermRules(rawComponents, input.incoterm);

  // 4. Calculate Totals
  const valRateInr = rates[input.valueCurrency] || 1;
  const targetRateInr = rates[input.targetCurrency] || 1;

  const totalSellerCostInr = taggedComponents
    .filter(c => c.isSellerResponsibility)
    .reduce((sum, c) => sum + c.amountInr, 0);

  const totalBuyerCostInr = taggedComponents
    .filter(c => !c.isSellerResponsibility)
    .reduce((sum, c) => sum + c.amountInr, 0);

  const totalExportCostInr = totalSellerCostInr + totalBuyerCostInr;
  const productCostInr = input.declaredValue * valRateInr;
  const logisticsCostInr = totalSellerCostInr - productCostInr;

  // Cost Share Breakdown
  const freightComponent = taggedComponents.find(c => c.code === 'MAIN_FREIGHT')?.amountInr || 0;
  const customsComponent = taggedComponents.find(c => c.code === 'CUSTOMS_CLEARANCE')?.amountInr || 0;

  const freightSharePct = totalExportCostInr > 0 ? Math.round((freightComponent / totalExportCostInr) * 100) : 0;
  const productSharePct = totalExportCostInr > 0 ? Math.round((productCostInr / totalExportCostInr) * 100) : 0;
  const dutiesCustomsSharePct = totalExportCostInr > 0 ? Math.round((customsComponent / totalExportCostInr) * 100) : 0;
  const logisticsSharePct = Math.max(0, 100 - productSharePct);

  const costBreakdown: CostBreakdown = {
    components: taggedComponents,
    totalSellerCost: totalSellerCostInr / valRateInr,
    totalBuyerCost: totalBuyerCostInr / valRateInr,
    totalExportCost: totalExportCostInr / valRateInr,
    currency: input.valueCurrency,
    totalExportCostInr,
    totalExportCostTarget: totalExportCostInr / targetRateInr,
    perKgCostInr: Math.round(totalExportCostInr / Math.max(input.weightKg, 1)),
    perCbmCostInr: Math.round(totalExportCostInr / Math.max(input.volumeCbm, 0.1)),
    costSharePercentage: {
      freightSharePct,
      logisticsSharePct,
      dutiesCustomsSharePct,
      productSharePct
    }
  };

  // 5. Calculate Export Cost Indicator (ECI)
  const indicator = calculateExportCostIndicator({
    productValueInr: productCostInr,
    totalExportCostInr,
    logisticsCostInr: Math.max(logisticsCostInr, 0),
    weightKg: input.weightKg,
    transitDays: selectedRoute.totalTransitDays,
    reliabilityScore: selectedRoute.reliabilityScore,
    riskScore: selectedRoute.riskScore,
    carbonKg: selectedRoute.carbonKg,
    isMultimodal: selectedRoute.legs.length > 2
  });

  return {
    id: `calc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    input,
    origin,
    destination,
    costBreakdown,
    indicator,
    selectedRoute,
    routeAlternatives,
    exchangeRates: rates,
    isEstimatedData: true,
    disclaimer: 'Estimates provided for planning purposes based on sample rates. Confirm binding quotes with certified logistics service providers.'
  };
}
