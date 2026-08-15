import { CalculationInput, CalculationResult, CurrencyCode, Location } from '@export-cost/shared';
export interface CalculatorOptions {
    input: CalculationInput;
    origin: Location;
    destination: Location;
    originPort?: Location;
    destinationPort?: Location;
    exchangeRates?: Record<CurrencyCode, number>;
}
export declare function calculateExportCost(opts: CalculatorOptions): CalculationResult;
