import { describe, expect, it } from 'vitest';
import { calculateExportCost } from '../src/calculator.js';
import { CalculationInput, Location } from '@export-cost/shared';

describe('Calculation Engine Tests', () => {
  const mockOrigin: Location = {
    id: 'origin-delhi',
    name: 'Delhi NCR',
    state: 'Delhi',
    country: 'India',
    lat: 28.61,
    lng: 77.20,
    type: 'ORIGIN'
  };

  const mockDestination: Location = {
    id: 'dest-hamburg',
    name: 'Hamburg',
    country: 'Germany',
    lat: 53.55,
    lng: 9.99,
    type: 'DESTINATION'
  };

  const sampleInput: CalculationInput = {
    productName: 'Cotton Finished Garments',
    category: 'TEXTILES',
    declaredValue: 500000,
    valueCurrency: 'INR',
    quantity: 1000,
    unit: 'Pieces',
    weightKg: 450,
    volumeCbm: 2.5,
    packageType: 'PALLET',
    originId: mockOrigin.id,
    destinationId: mockDestination.id,
    incoterm: 'CIF',
    transportMode: 'SEA',
    urgency: 'STANDARD',
    includeInsurance: true,
    targetCurrency: 'EUR'
  };

  it('calculates export costs and returns structured breakdown', () => {
    const result = calculateExportCost({
      input: sampleInput,
      origin: mockOrigin,
      destination: mockDestination
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.costBreakdown.totalExportCostInr).toBeGreaterThan(sampleInput.declaredValue);
    expect(result.costBreakdown.components.length).toBeGreaterThan(5);
    expect(result.isEstimatedData).toBe(true);
  });

  it('enforces Incoterm EXW vs DDP seller responsibility rules', () => {
    const exwResult = calculateExportCost({
      input: { ...sampleInput, incoterm: 'EXW' },
      origin: mockOrigin,
      destination: mockDestination
    });

    const ddpResult = calculateExportCost({
      input: { ...sampleInput, incoterm: 'DDP' },
      origin: mockOrigin,
      destination: mockDestination
    });

    // EXW seller responsibility should be less than total
    const exwSellerInr = exwResult.costBreakdown.components
      .filter(c => c.isSellerResponsibility)
      .reduce((sum, c) => sum + c.amountInr, 0);

    const ddpSellerInr = ddpResult.costBreakdown.components
      .filter(c => c.isSellerResponsibility)
      .reduce((sum, c) => sum + c.amountInr, 0);

    expect(ddpSellerInr).toBeGreaterThan(exwSellerInr);
  });

  it('produces Export Cost Indicator score between 0 and 100', () => {
    const result = calculateExportCost({
      input: sampleInput,
      origin: mockOrigin,
      destination: mockDestination
    });

    const { overallScore, subScores, level } = result.indicator;
    expect(overallScore).toBeGreaterThanOrEqual(0);
    expect(overallScore).toBeLessThanOrEqual(100);
    expect(subScores.costEfficiency).toBeGreaterThanOrEqual(0);
    expect(subScores.costEfficiency).toBeLessThanOrEqual(100);
    expect(['EXCELLENT', 'GOOD', 'MODERATE', 'CHALLENGING']).toContain(level);
  });

  it('generates 3 distinct route alternatives', () => {
    const result = calculateExportCost({
      input: sampleInput,
      origin: mockOrigin,
      destination: mockDestination
    });

    expect(result.routeAlternatives.length).toBeGreaterThanOrEqual(3);
    const modes = result.routeAlternatives.map(r => r.transportMode);
    expect(modes).toContain('SEA');
    expect(modes).toContain('AIR');
  });
});
