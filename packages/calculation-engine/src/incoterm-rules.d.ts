import { CostComponent, IncotermCode } from '@export-cost/shared';
/**
 * Filter and tag cost components based on Incoterms 2020 rules
 */
export declare function applyIncotermRules(components: CostComponent[], incoterm: IncotermCode): CostComponent[];
