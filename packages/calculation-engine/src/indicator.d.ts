import { ExportCostIndicator } from '@export-cost/shared';
export interface IndicatorCalculationContext {
    productValueInr: number;
    totalExportCostInr: number;
    logisticsCostInr: number;
    weightKg: number;
    transitDays: number;
    reliabilityScore: number;
    riskScore: number;
    carbonKg: number;
    isMultimodal: boolean;
}
export declare function calculateExportCostIndicator(ctx: IndicatorCalculationContext): ExportCostIndicator;
