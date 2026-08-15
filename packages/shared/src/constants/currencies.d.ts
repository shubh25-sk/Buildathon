import { CurrencyCode } from '../types/export.js';
export interface CurrencyDetails {
    code: CurrencyCode;
    name: string;
    symbol: string;
    flag: string;
    defaultRateInr: number;
}
export declare const CURRENCIES: Record<CurrencyCode, CurrencyDetails>;
