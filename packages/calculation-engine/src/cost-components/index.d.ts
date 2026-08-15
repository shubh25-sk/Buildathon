import { CalculationInput, CostComponent, Location } from '@export-cost/shared';
export interface ComponentCalcContext {
    input: CalculationInput;
    origin: Location;
    destination: Location;
    distanceInlandKm: number;
    distanceMainKm: number;
    ratesInr: Record<string, number>;
}
export declare function calculateAllComponents(ctx: ComponentCalcContext): CostComponent[];
